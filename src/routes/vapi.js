const express = require('express');
const router = express.Router();
const onroService = require('../services/onroService');
const smsParser = require('../services/smsParser'); // Reuse validation logic if useful

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
                    const args = typeof func.arguments === 'string'
                        ? JSON.parse(func.arguments)
                        : func.arguments;

                    const result = await handleBookOrder(args);

                    results.push({
                        toolCallId: id,
                        result: JSON.stringify(result)
                    });
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
 * Handle 'bookOrder' tool call
 */
async function handleBookOrder(args) {
    const { pickupAddress, deliveryAddress, customerName, customerPhone } = args;

    console.log('🚀 Processing Voice Booking...');
    console.log(`   Pickup: ${pickupAddress}`);
    console.log(`   Delivery: ${deliveryAddress}`);

    // Validate
    if (!pickupAddress || !deliveryAddress) {
        return {
            success: false,
            message: "I need both pickup and delivery addresses to book the order."
        };
    }

    // Prepare Onro Payload
    const vehicleTypeId = process.env.ONRO_VEHICLE_TYPE_ID;

    // Use a default phone if not provided (e.g., from the caller ID if available in headers, but for now use arg or default)
    const phone = customerPhone || '+8801700000000';

    const payload = {
        service: {
            id: "0_17d3kbyR41-zdPFiUQV", // Bag-Box
            options: []
        },
        paymentMethod: "Cash",
        paymentSide: "Sender",
        pickup: {
            address: pickupAddress,
            fullName: customerName || 'Voice Customer',
            phone: phone,
            schedulePickupNow: true,
            scheduleDateAfter: 0,
            scheduleDateBefore: 0
        },
        // We'll construct delivery as dropoff/delivery object based on previous findings
        // But reusing smsParser logic or creating new one. 
        // Let's use the structure that worked in test-booking.js
        delivery: {
            address: deliveryAddress,
            fullName: "Receiver",
            phone: phone // Using same phone for test
        }
    };

    if (vehicleTypeId) {
        payload.vehicleType = {
            id: vehicleTypeId,
            options: []
        };

        try {
            const order = await onroService.createBooking(payload);
            console.log('✅ Order created:', order.data.id);
            return {
                success: true,
                message: `Booking confirmed! Your order ID is ${order.data.id}. A driver is on the way.`,
                orderId: order.data.id
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

module.exports = router;
