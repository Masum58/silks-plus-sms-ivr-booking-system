const express = require('express');
const router = express.Router();
const taxiCallerService = require('../services/taxiCallerService');
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
        // Log the exact request body for debugging
        console.log('📥 [VAPI] Received Request:', JSON.stringify(req.body, null, 2));

        // Support multiple request formats from Vapi
        let message = req.body.message;

        // If Vapi sends empty body or auto-generated format, try to extract from root
        if (!message && req.body.type) {
            message = req.body;
        }

        // If it's a direct tool call (no message wrapper), wrap it for our logic
        if (!message && req.body.toolCalls) {
            message = {
                type: 'tool-calls',
                toolCalls: req.body.toolCalls
            };
        }

        // If still no message, check if parameters are directly in body (Direct Tool Call)
        if (!message && (req.body.pickupAddress || req.body.customerPhone)) {
            console.log('🛠️  Detected Direct Tool Call format');
            message = {
                type: 'function-call',
                functionCall: {
                    name: 'bookOrder',
                    parameters: req.body
                }
            };
        }

        // Special handling for Vapi Test Tool (sends empty body {})
        if (!message && Object.keys(req.body).length === 0) {
            console.log('✅ [VAPI] Health Check / Test Tool received');
            return res.json({
                results: [{
                    result: {
                        success: true,
                        message: "Server is LIVE and connected to Vapi! Please make a real call to test booking."
                    }
                }]
            });
        }

        if (!message) {
            console.warn('⚠️  [VAPI] Unknown request format:', req.body);
            // Still return 200 to avoid Vapi errors, but log it
            return res.json({ success: true, note: "Unknown format received" });
        }

        console.log('📞 Vapi Webhook:', message.type);

        // Handle Function Call (New Vapi Format)
        if (message.type === 'function-call') {
            const { functionCall } = message;
            console.log(`🛠️  Function Call: ${functionCall.name}`);
            console.log(`   Parameters:`, functionCall.parameters);

            let result;

            if (functionCall.name === 'bookOrder') {
                try {
                    result = await handleBookOrder(functionCall.parameters);
                } catch (error) {
                    console.error('❌ Error in bookOrder:', error.message);
                    result = {
                        success: false,
                        message: "I encountered an error while booking. Please try again or contact support."
                    };
                }
            } else if (functionCall.name === 'cancelOrder') {
                try {
                    result = await handleCancelOrder(functionCall.parameters);
                } catch (error) {
                    console.error('❌ Error in cancelOrder:', error.message);
                    result = {
                        success: false,
                        message: "I encountered an error while cancelling. Please try again."
                    };
                }
            } else if (functionCall.name === 'checkOrderStatus') {
                try {
                    result = await handleCheckOrderStatus(functionCall.parameters);
                } catch (error) {
                    console.error('❌ Error in checkOrderStatus:', error.message);
                    result = {
                        success: false,
                        message: "I encountered an error while checking status. Please try again."
                    };
                }
            }

            // Return result in Vapi format
            return res.json({
                results: [{
                    result: result
                }]
            });
        }

        // Handle Tool Calls (Old Vapi Format - keep for compatibility)
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

    // 2. Get active orders from TaxiCaller
    // TODO: Implement getActiveOrders in TaxiCallerService
    // For now, we rely on local mapping or return empty if not implemented
    const activeOrders = []; // await taxiCallerService.getActiveOrders(targetCustomerId);

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
        customerName = "Customer",
        customerPhone,
        driverNotes = "",
        driverGender = "Any", // New parameter: Male, Female, or Any
        additionalStops = [] // New parameter for multiple stops
    } = args;

    // Default payment method to Cash since we don't ask for it anymore
    const paymentMethod = "Cash";

    console.log('🚀 Processing Voice Booking...');
    console.log(`   Pickup: ${pickupAddress}`);
    console.log(`   Drop-off: ${deliveryAddress}`);
    console.log(`   Gender Pref: ${driverGender}`);
    console.log('📦 Booking Order with args:', JSON.stringify(args, null, 2));

    // Validate
    if (!pickupAddress || !deliveryAddress) {
        console.error('❌ Missing address');
        return {
            success: false,
            message: "I need both pickup and drop-off addresses to book the ride."
        };
    }

    // Handle placeholder phone number
    let finalPhone = customerPhone;
    if (!customerPhone || customerPhone.toLowerCase().includes('captured phone number')) {
        console.warn('⚠️ Placeholder phone number detected');
        return {
            success: false,
            message: "I'm sorry, I couldn't get your phone number automatically. Please tell me the best number to reach you."
        };
    }

    // Normalize phone number (remove spaces, ensure E.164-ish)
    finalPhone = customerPhone.replace(/\s+/g, '');
    if (finalPhone.startsWith('plus')) {
        finalPhone = '+' + finalPhone.substring(4);
    }
    console.log(`   Normalized Phone: ${finalPhone}`);
    args.customerPhone = finalPhone; // Update args for processOrderAsync

    // Log additional stops if any
    if (additionalStops && additionalStops.length > 0) {
        console.log(`   Additional Stops: ${JSON.stringify(additionalStops)}`);
    }

    // Validate payment method (Client confirmed: Card and Wallet only, no Cash)
    const validPaymentMethods = ['Wallet', 'Card'];
    const selectedPaymentMethod = validPaymentMethods.includes(paymentMethod)
        ? paymentMethod
        : 'Card'; // Default to Card if invalid
    console.log(`   Payment Method: ${selectedPaymentMethod}`);

    // Validate Vehicle Type
    // Validate Vehicle Type
    // Default to standard car ID (Found ID 2 in RC environment)
    const selectedVehicleTypeId = "2"; // Standard Car Type ID
    console.log(`   Vehicle Type: Car (ID: ${selectedVehicleTypeId})`);

    // Generate short reference BEFORE async processing
    const orderRef = require('../services/orderReferenceService');
    const shortRef = orderRef.generateReference();
    console.log(`   Generated Reference: ${shortRef}`);

    // Wait for the booking to be processed (with a timeout) to get ETA
    try {
        const result = await Promise.race([
            processOrderAsync(args, selectedPaymentMethod, selectedVehicleTypeId, shortRef, driverGender, additionalStops),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 12000))
        ]);

        if (result && result.success) {
            let message = `Perfect! I've booked your ride. Your order reference is ${shortRef.split('').join('-')}. `;
            if (result.price && result.price !== "Not Available") {
                message += `The estimated price is ${result.price}. `;
            } else {
                message += `Your driver will confirm the final price at the end of the trip. `;
            }
            if (result.eta) {
                message += `The ETA is ${result.eta}. `;
            } else {
                message += `A driver will be assigned shortly and you'll receive the ETA via SMS. `;
            }
            message += `Thank you for using Car Safe!`;

            return {
                success: true,
                message: message
            };
        } else {
            return {
                success: false,
                message: result.message || "I encountered an error while booking. Please try again or contact support."
            };
        }
    } catch (err) {
        console.log('⚠️ Booking processing failed or timed out:', err.message);
        return {
            success: false,
            message: "I'm sorry, the booking is taking longer than expected. Please try again in a moment."
        };
    }
}

/**
 * Process order asynchronously to avoid Vapi timeout
 */
async function processOrderAsync(args, selectedPaymentMethod, selectedVehicleTypeId, shortRef, driverGender, additionalStops = []) {
    const {
        pickupAddress,
        deliveryAddress,
        customerName = "Customer",
        customerPhone,
        driverNotes = ""
    } = args;

    // Initialize coordinates
    let pickupCoords = null;
    let deliveryCoords = null;

    try {
        // Geocode Pickup, Delivery, and Stops in parallel for speed
        console.log('   🔍 Geocoding addresses in parallel...');
        const geocodePromises = [
            geocodingService.getCoordinates(pickupAddress).catch(e => { console.warn(`   ⚠️ Pickup Geo Error: ${e.message}`); return null; }),
            deliveryAddress ? geocodingService.getCoordinates(deliveryAddress).catch(e => { console.warn(`   ⚠️ Delivery Geo Error: ${e.message}`); return null; }) : Promise.resolve(null)
        ];

        // Add stops to parallel geocoding if any
        if (additionalStops && Array.isArray(additionalStops)) {
            additionalStops.forEach(stop => {
                geocodePromises.push(geocodingService.getCoordinates(stop).catch(e => { console.warn(`   ⚠️ Stop Geo Error (${stop}): ${e.message}`); return null; }));
            });
        }

        const geoResults = await Promise.all(geocodePromises);
        pickupCoords = geoResults[0];
        deliveryCoords = geoResults[1];

        const geocodedStops = [];
        if (additionalStops && Array.isArray(additionalStops)) {
            additionalStops.forEach((stop, index) => {
                geocodedStops.push({
                    address: stop,
                    coordinates: geoResults[index + 2]
                });
            });
        }

        console.log(`   📍 Pickup Coords: ${pickupCoords}`);
        console.log(`   📍 Delivery Coords: ${deliveryCoords}`);

        const customerService = require('../services/customerService');
        let customerId;

        try {
            customerId = await customerService.getOrCreateCustomer({
                phone: customerPhone,
                name: customerName, // Use customerName for customer name
                email: null // Optional
            });
            console.log(`   Customer ID: ${customerId}`);
        } catch (error) {
            console.error('❌ Customer creation failed:', error.message);
            // Fallback to Guest (0) if creation fails
            customerId = 0;
            console.log(`   Using fallback customer ID: ${customerId} (Guest)`);
        }

        // Prepare TaxiCaller Payload
        // We pass the data to taxiCallerService which handles the mapping
        const bookingData = {
            clientId: customerId,
            customerName: customerName,
            customerPhone: customerPhone,
            pickupAddress: pickupAddress,
            pickupCoordinates: pickupCoords,
            dropoffAddress: deliveryAddress,
            dropoffCoordinates: deliveryCoords,
            additionalStops: geocodedStops, // Pass geocoded stops
            vehicleType: selectedVehicleTypeId,
            driverNotes: driverNotes,
            driverGender: driverGender // Pass gender preference
        };

        try {
            const order = await taxiCallerService.createBooking(bookingData);
            // TaxiCaller response structure: { order: { order_id: '...' }, ... }
            const orderId = order.order?.order_id || order.order_id || order.id || 'UNKNOWN';
            console.log('✅ Order created:', JSON.stringify(order, null, 2));
            console.log('   Full Order ID:', orderId);

            // Log Price for Backend Engineer
            const price = order.price || "Not Available"; // Adjust based on TaxiCaller response
            console.log(`💰 Ride Price: ${price}`);

            console.log('   Short Reference:', shortRef);

            // Store mapping (reference was already generated)
            const orderRef = require('../services/orderReferenceService');
            orderRef.storeOrder(shortRef, orderId, {
                pickup: pickupAddress,
                delivery: deliveryAddress,
                customerName: customerName,
                customerPhone: customerPhone,
                price: price // Store price in local mapping too
            });

            console.log(`   Mapping: ${shortRef} → ${orderId}`);

            // Send SMS confirmation
            try {
                const smsService = require('../services/twilioService');

                // Normalize phone number for Twilio
                let smsPhone = customerPhone.replace(/\D/g, ''); // Remove non-digits
                if (smsPhone.startsWith('01') && smsPhone.length === 11) {
                    smsPhone = '+880' + smsPhone.substring(1); // BD Number: 017... -> +88017...
                } else if (smsPhone.startsWith('8801') && smsPhone.length === 13) {
                    smsPhone = '+' + smsPhone; // BD Number: 88017... -> +88017...
                } else if (smsPhone.length === 10) {
                    smsPhone = '+1' + smsPhone; // US Number: 812... -> +1812...
                } else if (!smsPhone.startsWith('+')) {
                    smsPhone = '+' + smsPhone; // Assume it has country code if not matching above
                }

                const smsMessage = `Booking Confirmed! Ref: ${shortRef}. Pickup: ${pickupAddress}. Delivery: ${deliveryAddress}. Track status by replying "Status".`;
                await smsService.sendSms(smsPhone, smsMessage);
                console.log(`📱 SMS confirmation sent to ${smsPhone}`);
            } catch (smsError) {
                console.error(`❌ Failed to send SMS confirmation to ${customerPhone}:`, smsError.message);
                if (smsError.code === 21612) {
                    console.error('💡 TIP: Enable Bangladesh Geo-Permissions in Twilio Console.');
                }
                // Don't fail the booking if SMS fails
            }

            return {
                success: true,
                message: `Booking confirmed! Your order reference is ${shortRef}. A driver is on the way.`,
                orderId: shortRef,
                eta: null, // ETA is not always available immediately
                price: price // Return the price
            };
        } catch (error) {
            console.error('❌ TaxiCaller Error:', error.message);
            if (error.response && error.response.data) {
                console.error('📦 TaxiCaller Error Details:', JSON.stringify(error.response.data, null, 2));
            }

            // Send error SMS
            try {
                const smsService = require('../services/twilioService');
                let smsPhone = customerPhone.replace(/\D/g, '');
                if (smsPhone.startsWith('01') && smsPhone.length === 11) {
                    smsPhone = '+880' + smsPhone.substring(1);
                } else if (smsPhone.length === 10) {
                    smsPhone = '+1' + smsPhone;
                } else if (!smsPhone.startsWith('+')) {
                    smsPhone = '+' + smsPhone;
                }
                const smsMessage = `Booking failed. Error: ${error.response?.data?.message || error.message}`;
                await smsService.sendSms(smsPhone, smsMessage);
            } catch (smsError) {
                console.error('❌ Failed to send error SMS:', smsError.message);
            }
            return {
                success: false,
                message: `TaxiCaller Error: ${error.response?.data?.message || error.message}`
            };
        }
    } catch (outerError) {
        console.error('❌ Fatal error in processOrderAsync:', outerError.message);
        return {
            success: false,
            message: `Fatal Error: ${outerError.message}`
        };
    }
}

/**
 * Handle 'cancelOrder' tool call
 */
async function handleCancelOrder(args) {
    const { orderId, customerPhone } = args;

    console.log('🚫 Processing Order Cancellation...');
    console.log(`   Reference: ${orderId}, Phone: ${customerPhone}`);

    // Validate
    if (!orderId && !customerPhone) {
        return {
            success: false,
            message: "I need the order reference or your phone number to cancel the order."
        };
    }

    // Get full Order ID from short reference or phone number
    const orderRef = require('../services/orderReferenceService');
    let targetOrderId = orderId;
    let fullOrderId;

    if (orderId) {
        // Normalize: Remove dashes if AI passed "v-o-v-2-s" instead of "vov2s"
        const cleanRef = orderId.replace(/-/g, '').toLowerCase();
        fullOrderId = orderRef.getOrderId(cleanRef);
    } else if (customerPhone) {
        const localOrders = orderRef.getOrdersByPhone(customerPhone);
        if (localOrders.length > 0) {
            // Cancel the most recent order
            const mostRecent = localOrders[localOrders.length - 1];
            targetOrderId = mostRecent.reference;
            fullOrderId = mostRecent.orderId;
        }
    }

    if (!fullOrderId) {
        console.log('❌ Reference not found in mapping');
        return {
            success: false,
            message: `Order reference ${orderId} not found. Please check the reference number and try again.`
        };
    }

    console.log(`   Found mapping: ${orderId} → ${fullOrderId}`);

    try {
        const taxiCallerService = require('../services/taxiCallerService');
        await taxiCallerService.cancelOrder(fullOrderId);
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
