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
        const fs = require('fs');
        const path = require('path');
        const logDir = path.join(__dirname, '../../logs');
        if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
        fs.appendFileSync(path.join(logDir, 'vapi.log'), `\n--- ${new Date().toISOString()} ---\n${JSON.stringify(req.body, null, 2)}\n`);

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

    try {
        const taxiCallerService = require('../services/taxiCallerService');
        // Use the robust phone search
        const activeOrders = await taxiCallerService.findOrdersByPhone(customerPhone);

        if (activeOrders.length === 0) {
            return {
                success: true,
                message: "I couldn't find any recent orders for this phone number."
            };
        }

        // Filter for truly active orders if needed (though findOrdersByPhone returns recent ones)
        // Let's filter out completed/cancelled just in case, or show them if they are very recent?
        // Let's show the most recent one.
        const mostRecent = activeOrders[0];
        const status = mostRecent.state?.state || mostRecent.state || 'Unknown';

        let message = `Your most recent order is currently ${status}. `;
        if (status === 'UNASSIGNED') {
            message += "We are looking for a driver for you.";
        } else if (status === 'ASSIGNED') {
            message += "A driver has been assigned and is on the way.";
        }

        return {
            success: true,
            message: message
        };

    } catch (error) {
        console.error('❌ Error in checkOrderStatus:', error.message);
        return {
            success: false,
            message: "I encountered an error while checking the order status. Please try again later."
        };
    }
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
    // List of common fake/placeholder numbers to ignore
    const FAKE_NUMBERS = ['8451234567', '1234567890', '5555555555', '1111111111'];

    // Normalize phone number (remove all non-digit characters)
    let cleanPhone = customerPhone ? customerPhone.replace(/\D/g, '') : '';

    // Handle placeholder phone number or obviously fake ones
    if (!cleanPhone ||
        customerPhone.toLowerCase().includes('captured') ||
        FAKE_NUMBERS.some(fake => cleanPhone.includes(fake)) ||
        cleanPhone.length < 10) {

        console.warn(`⚠️ Invalid or Fake phone number detected: ${customerPhone}`);
        return {
            success: false,
            message: "I can't use that number because it looks like a test number or is incomplete. Please provide a real 10-digit phone number for the driver to reach you."
        };
    }

    // Ensure E.164 format
    let finalPhone = cleanPhone;
    if (finalPhone.length === 10) {
        finalPhone = '1' + finalPhone; // Assume US
    } else if (finalPhone.length === 11 && finalPhone.startsWith('0')) {
        finalPhone = '88' + finalPhone; // Assume Bangladesh
    }

    if (!finalPhone.startsWith('+')) {
        finalPhone = '+' + finalPhone;
    }

    console.log(`   Final Verified Phone: ${finalPhone}`);
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
    const selectedVehicleTypeId = "1"; // Standard Car Type ID
    console.log(`   Vehicle Type: Car (ID: ${selectedVehicleTypeId})`);

    // Generate short reference BEFORE async processing
    const orderRef = require('../services/orderReferenceService');
    const shortRef = orderRef.generateReference();
    console.log(`   Generated Reference: ${shortRef}`);

    // Wait for the booking to be processed (with a timeout) to get ETA
    try {
        const result = await Promise.race([
            processOrderAsync(args, selectedPaymentMethod, selectedVehicleTypeId, shortRef, driverGender, additionalStops),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 18000))
        ]);

        if (result && result.success) {
            // Price is already formatted by taxiCallerService
            return result;
        } else {
            return {
                success: false,
                message: result?.message || "I encountered an error while booking. Please try again or contact support."
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
        // Geocode Pickup, Delivery, and Customer ID in parallel for maximum speed
        console.log('   🔍 Parallel processing: Geocoding + Customer Service...');
        const customerService = require('../services/customerService');

        const [pickupCoords, deliveryCoords, customerId] = await Promise.all([
            geocodingService.getCoordinates(pickupAddress).catch(() => null),
            deliveryAddress ? geocodingService.getCoordinates(deliveryAddress).catch(() => null) : Promise.resolve(null),
            customerService.getOrCreateCustomer({ phone: customerPhone, name: customerName }).catch(() => 0)
        ]);

        console.log(`   📍 Pickup: ${pickupCoords}, Delivery: ${deliveryCoords}, CID: ${customerId}`);

        // Error if geocoding failed for either address
        if (!pickupCoords) {
            console.error('❌ Pickup geocoding failed:', pickupAddress);
            return {
                success: false,
                message: `I'm sorry, I couldn't find the location "${pickupAddress}" on the map. Could you please provide a more specific pickup address?`
            };
        }

        if (deliveryAddress && !deliveryCoords) {
            console.error('❌ Delivery geocoding failed:', deliveryAddress);
            return {
                success: false,
                message: `I'm sorry, I couldn't find the destination "${deliveryAddress}" on the map. Could you please provide a more specific delivery address?`
            };
        }

        // Prepare TaxiCaller Payload
        const bookingData = {
            clientId: customerId,
            customerName: customerName,
            customerPhone: customerPhone,
            pickupAddress: pickupAddress,
            pickupCoordinates: pickupCoords,
            dropoffAddress: deliveryAddress,
            dropoffCoordinates: deliveryCoords,
            externalId: shortRef, // Tag with short reference for easy search
            additionalStops: [],
            vehicleType: "1", // Set to 1 (Standard Car)
            driverNotes: driverNotes,
            driverGender: driverGender
        };

        try {
            const order = await taxiCallerService.createBooking(bookingData);
            // TaxiCaller response structure: { order: { order_id: '...' }, ... }
            const orderId = order.order?.order_id || order.order_id || order.id || 'UNKNOWN';
            console.log('✅ Order created:', JSON.stringify(order, null, 2));
            console.log('   Full Order ID:', orderId);

            const finalPrice = taxiCallerService.formatPrice(order.price || "Not Available");
            console.log('------------------------------------');
            console.log(`✅ Order ID: ${orderId}`);
            console.log(`💰 RAW PRICE FROM API: ${JSON.stringify(order.price)}`);
            console.log(`💰 FULL ORDER OBJECT (DEBUG): ${JSON.stringify(order).substring(0, 500)}...`);
            console.log(`💰 FORMATTED PRICE: ${finalPrice}`);
            console.log('------------------------------------');

            const finalMessage = `Your ride is booked. The price is ${finalPrice}. A driver will be assigned shortly. (Ref: ${orderId}, Co: ${process.env.TAXICALLER_COMPANY_ID})`;

            const resultPayload = {
                success: true,
                message: finalMessage,
                orderId: shortRef,
                taxiCallerId: orderId,
                eta: null,
                price: finalPrice
            };

            // Send Success SMS with Reference ID for Cancellation
            try {
                const smsService = require('../services/twilioService');
                const smsMessage = `Your ride is confirmed! Ref: ${shortRef}. Price: ${finalPrice}. To cancel, reply with 'CANCEL ${shortRef}' or call us at +19177203770.`;
                await smsService.sendSms(args.customerPhone, smsMessage);
                console.log(`✅ Success SMS sent to ${args.customerPhone}`);
            } catch (smsError) {
                console.error('❌ Failed to send success SMS:', smsError.message);
            }

            return resultPayload;
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
        console.log(`   Normalized Ref: ${cleanRef}`);
        fullOrderId = orderRef.getOrderId(cleanRef);
        console.log(`   Found Full Order ID: ${fullOrderId}`);
    } else if (customerPhone) {
        // 1. Try local memory first
        const localOrders = orderRef.getOrdersByPhone(customerPhone);
        if (localOrders.length > 0) {
            // Cancel the most recent order
            const mostRecent = localOrders[localOrders.length - 1];
            targetOrderId = mostRecent.reference;
            fullOrderId = mostRecent.orderId;
        } else {
            // 2. Fallback to TaxiCaller API lookup
            console.log(`   Local memory empty. Querying TaxiCaller for phone: ${customerPhone}`);
            try {
                const taxiCallerService = require('../services/taxiCallerService');
                const remoteOrders = await taxiCallerService.findOrdersByPhone(customerPhone);

                if (remoteOrders.length > 0) {
                    const mostRecent = remoteOrders[0]; // Already sorted desc
                    // Use the ID directly
                    fullOrderId = mostRecent.id || mostRecent.order_id || mostRecent.order?.id;
                    targetOrderId = fullOrderId; // We don't have a short ref, so use full ID
                    console.log(`   Found Active Order via API: ${fullOrderId} (${mostRecent.state})`);
                }
            } catch (err) {
                console.error('❌ Failed to query TaxiCaller for cancellation:', err.message);
            }
        }
    }

    if (!fullOrderId) {
        console.log('❌ Reference not found in mapping or API');
        return {
            success: false,
            message: `I couldn't find an active order for that phone number. Please check the number and try again.`
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
