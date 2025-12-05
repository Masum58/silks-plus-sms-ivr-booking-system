const express = require('express');
const router = express.Router();
const onroService = require('../services/onroService');
const smsParser = require('../services/smsParser'); // Reuse validation logic if useful
const geocodingService = require('../services/geocodingService');

/**
 * Webhook for Vapi Assistant
 * Vapi will POST here when:
 * 1. Assistant needs to call a tool (function-call)
 * 2. Call status changes
 * 3. Transcript is available
 */
router.post('/webhook', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).send('No message found');
        }

        console.log('📞 Vapi Webhook:', message.type);

        // Handle Tool Calls (Function Calls)
        if (message.type === 'tool-calls') {
            const toolCalls = message.toolCalls;
            const results = [];

            for (const toolCall of toolCalls) {
                const { id, type, function: func } = toolCall;

                console.log(`🛠️ Tool Call: ${func.name}`);
                console.log(`   Arguments:`, func.arguments);

                if (func.name === 'bookOrder') {
                    try {
                        const args = typeof func.arguments === 'string'
                            ? JSON.parse(func.arguments)
                            : func.arguments;

                        const result = await handleBookOrder(args);

                        results.push({
                            toolCallId: id,
                            result: JSON.stringify(result)
                        });
                    } catch (error) {
                        console.error('❌ Error in bookOrder:', error.message);
                        results.push({
                            toolCallId: id,
                            result: JSON.stringify({
                                success: false,
                                message: "I encountered an error while booking. The address might be invalid or outside our service area. Please ask the customer to clarify the City and State."
                            })
                        });
                    }
                }

                if (func.name === 'cancelOrder') {
                    try {
                        const args = typeof func.arguments === 'string'
                            ? JSON.parse(func.arguments)
                            : func.arguments;

                        const result = await handleCancelOrder(args);

                        results.push({
                            toolCallId: id,
                            result: JSON.stringify(result)
                        });
                    } catch (error) {
                        console.error('❌ Error in cancelOrder:', error.message);
                        results.push({
                            toolCallId: id,
                            result: JSON.stringify({
                                success: false,
                                message: "I encountered an error while cancelling the order. Please try again later."
                            })
                        });
                    }
                }

                if (func.name === 'checkOrderStatus') {
                    try {
                        const args = typeof func.arguments === 'string'
                            ? JSON.parse(func.arguments)
                            : func.arguments;

                        const result = await handleCheckOrderStatus(args);

                        results.push({
                            toolCallId: id,
                            result: JSON.stringify(result)
                        });
                    } catch (error) {
                        console.error('❌ Error in checkOrderStatus:', error.message);
                        results.push({
                            toolCallId: id,
                            result: JSON.stringify({
                                success: false,
                                message: "I encountered an error while checking the order status. Please try again later."
                            })
                        });
                    }
                }
            }

            // Return results to Vapi
            return res.json({
                results: results
            });
        }

        // Handle other message types (optional)
        if (message.type === 'status-update') {
            console.log(`   Status: ${message.status}`);
            if (message.status === 'ended') {
                console.log('   Call ended');
                console.log(`   Cost: ${message.cost}`);
            }
        }

        res.sendStatus(200);

    } catch (error) {
        console.error('❌ Error processing Vapi webhook:', error);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * Handle 'checkOrderStatus' tool call
 */
async function handleCheckOrderStatus(args) {
    const { customerPhone } = args;
    console.log(`🔍 Checking order status for: ${customerPhone}`);

    if (!customerPhone) {
        return {
            success: false,
            message: "I need your phone number to check your order status."
        };
    }

    // 1. Get local order references for this phone
    const orderRef = require('../services/orderReferenceService');
    const localOrders = orderRef.getOrdersByPhone(customerPhone);

    if (localOrders.length === 0) {
        // Note: Since we use in-memory storage, this might happen after restart
        return {
            success: true,
            message: "I couldn't find any recent orders for this phone number."
        };
    }

    // 2. Get active orders from Onro
    // First, try to find the customer's specific account
    const customerService = require('../services/customerService');
    let targetCustomerId = process.env.ONRO_CUSTOMER_ID; // Default to Master

    try {
        const customerId = await customerService.findCustomerByPhone(customerPhone); // Fixed method name
        if (customerId) {
            console.log(`   Found customer account: ${customerId}`);
            targetCustomerId = customerId; // Use ID directly
        }
    } catch (error) {
        console.warn('   Customer lookup failed, using Master account');
    }

    const activeOrders = await onroService.getActiveOrders(targetCustomerId);

    // 3. Find intersection
    const foundOrders = [];

    for (const localOrder of localOrders) {
        // Check if this local order is in the active list
        const activeOrder = activeOrders.find(o => o.id === localOrder.orderId);

        if (activeOrder) {
            foundOrders.push({
                reference: localOrder.reference,
                status: activeOrder.status,
                pickup: localOrder.pickup
            });
        }
    }

    if (foundOrders.length === 0) {
        return {
            success: true,
            message: "You have no active orders at the moment."
        };
    }

    // 4. Format response
    let message = `You have ${foundOrders.length} active order${foundOrders.length > 1 ? 's' : ''}. `;

    foundOrders.forEach(order => {
        // Format status (e.g. Assigned -> Assigned)
        const status = order.status;
        // Say reference digit by digit
        const ref = order.reference.split('').join('-');
        message += `Order ${ref} is currently ${status}. `;
    });

    return {
        success: true,
        message: message
    };
}

/**
 * Handle 'bookOrder' tool call
 */
async function handleBookOrder(args) {
    const {
        pickupAddress,
        deliveryAddress,
        customerName = "Customer", // Default to Customer if not specified
        customerPhone,
        driverNotes = "",
        paymentMethod = "Cash" // Default to Cash if not specified
    } = args;

    console.log('🚀 Processing Voice Booking...');
    console.log(`   Pickup: ${pickupAddress}`);
    console.log(`   Delivery: ${deliveryAddress}`);
    console.log('📦 Booking Order with args:', JSON.stringify(args, null, 2));

    // Validate
    if (!pickupAddress || !deliveryAddress) {
        console.error('❌ Missing address');
        return {
            success: false,
            message: "I need both pickup and delivery addresses to book the order."
        };
    }
    if (!customerPhone) {
        return {
            success: false,
            message: "I need your phone number to create the booking."
        };
    }

    // Validate Payment Method
    const validPaymentMethods = ['Cash', 'Wallet', 'Card'];
    const selectedPaymentMethod = validPaymentMethods.includes(paymentMethod) ? paymentMethod : 'Cash';
    console.log(`   Payment Method: ${selectedPaymentMethod}`);

    // Get or create customer account
    const customerService = require('../services/customerService');
    let customerId;

    try {
        customerId = await customerService.getOrCreateCustomer({
            phone: customerPhone,
            name: pickupName, // Use pickupName for customer name
            email: null // Optional
        });
        console.log(`   Customer ID: ${customerId}`);
    } catch (error) {
        console.error('❌ Customer creation failed:', error.message);
        // Fallback to default customer ID if creation fails
        customerId = process.env.ONRO_CUSTOMER_ID;
        console.log(`   Using fallback customer ID: ${customerId}`);
    }

    // Prepare Onro Payload
    const vehicleTypeId = process.env.ONRO_VEHICLE_TYPE_ID;

    // Get real coordinates from Google Maps (Parallel execution for speed)
    const [pickupCoords, deliveryCoords] = await Promise.all([
        geocodingService.getCoordinates(pickupAddress),
        geocodingService.getCoordinates(deliveryAddress)
    ]);

    const payload = {
        customerId: customerId, // Dynamic customer ID from lookup/creation
        service: {
            id: "0_17d3kbyR41-zdPFiUQV", // Bag-Box
            options: []
        },
        paymentMethod: "Wallet",
        paymentSide: "Sender",
        promoCode: "",
        isScheduled: false,
        pickup: {
            address: pickupAddress,
            fullName: customerName || 'Voice Customer',
            phone: customerPhone,
            floor: "",
            room: "",
            placeId: "",
            buildingBlock: "",
            coordinates: pickupCoords, // Real coordinates from Google Maps!
            customerDescription: driverNotes || "",
            schedulePickupNow: false,
            scheduleDateAfter: 0,
            scheduleDateBefore: 0,
            email: ""
        },
        dropoffs: [
            {
                address: deliveryAddress,
                fullName: "Receiver",
                phone: customerPhone,
                coordinates: deliveryCoords, // Real coordinates from Google Maps!
                scheduleDateAfter: 0,
                scheduleDateBefore: 0,
                buildingBlock: "",
                floor: "",
                room: "",
                placeId: "",
                email: ""
            }
        ]
    };

    if (vehicleTypeId) {
        payload.vehicleType = {
            id: vehicleTypeId,
            options: []
        };

        try {
            const order = await onroService.createBooking(payload);
            console.log('✅ Order created:', order.data);
            console.log('   Full Order ID:', order.data.id);

            // Generate short reference
            const orderRef = require('../services/orderReferenceService');
            const shortRef = orderRef.generateReference();

            // Store mapping
            orderRef.storeOrder(shortRef, order.data.id, {
                pickup: pickupAddress,
                delivery: deliveryAddress,
                customerName: customerName,
                customerPhone: customerPhone
            });

            console.log('   Short Reference:', shortRef);
            console.log(`   Mapping: ${shortRef} → ${order.data.id}`);

            // Send SMS confirmation
            try {
                const smsService = require('../services/twilioService'); // Fixed import

                // Normalize phone number for Twilio
                let smsPhone = customerPhone.replace(/\D/g, ''); // Remove non-digits
                if (smsPhone.startsWith('01') && smsPhone.length === 11) {
                    smsPhone = '+880' + smsPhone.substring(1); // BD Number: 017... -> +88017...
                } else if (smsPhone.length === 10) {
                    smsPhone = '+1' + smsPhone; // US Number: 812... -> +1812...
                } else if (!smsPhone.startsWith('+')) {
                    smsPhone = '+' + smsPhone; // Assume it has country code if not matching above
                }

                const smsMessage = `Booking Confirmed! Ref: ${shortRef}. Pickup: ${pickupAddress}. Delivery: ${deliveryAddress}. Track status by replying "Status".`;
                await smsService.sendSms(smsPhone, smsMessage);
                console.log(`📱 SMS confirmation sent to ${smsPhone}`);
            } catch (smsError) {
                console.error('❌ Failed to send SMS confirmation:', smsError.message);
                // Don't fail the booking if SMS fails
            }

            return {
                success: true,
                message: `Booking confirmed! Your order reference is ${shortRef}. I have sent a confirmation SMS to your phone. A driver is on the way.`,
                orderId: shortRef
            };
        } catch (error) {
            console.error('❌ Onro Error:', error.message);
            return {
                success: false,
                message: "I'm sorry, I couldn't create the order in the system. Please try again later."
            };
        }
    } else {
        console.log('⚠️ Vehicle ID missing, simulating success');
        return {
            success: true,
            message: `I've received your request to send a package from ${pickupAddress} to ${deliveryAddress}. However, the system is in test mode and the vehicle type is not configured yet.`,
            details: "Vehicle Type ID missing in .env"
        };
    }
}

/**
 * Handle 'cancelOrder' tool call
 */
async function handleCancelOrder(args) {
    const { orderId } = args;

    console.log('🚫 Processing Order Cancellation...');
    console.log(`   Reference: ${orderId}`);

    // Validate
    if (!orderId) {
        return {
            success: false,
            message: "I need the order reference to cancel the order."
        };
    }

    // Get full Order ID from short reference
    const orderRef = require('../services/orderReferenceService');
    const fullOrderId = orderRef.getOrderId(orderId);

    if (!fullOrderId) {
        console.log('❌ Reference not found in mapping');
        return {
            success: false,
            message: `Order reference ${orderId} not found. Please check the reference number and try again.`
        };
    }

    console.log(`   Found mapping: ${orderId} → ${fullOrderId}`);

    try {
        await onroService.cancelOrder(fullOrderId);
        console.log('✅ Order cancelled successfully');
        return {
            success: true,
            message: `Your order ${orderId} has been cancelled successfully.`
        };
    } catch (error) {
        console.error('❌ Cancellation Error:', error.message);
        return {
            success: false,
            message: "I'm sorry, I couldn't cancel the order. It may have already been picked up or completed. Please contact support for assistance."
        };
    }
}

module.exports = router;
