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
                    const args = typeof func.arguments === 'string'
                        ? JSON.parse(func.arguments)
                        : func.arguments;

                    const result = await handleBookOrder(args);

                    results.push({
                        toolCallId: id,
                        result: JSON.stringify(result)
                    });
                }

                if (func.name === 'cancelOrder') {
                    const args = typeof func.arguments === 'string'
                        ? JSON.parse(func.arguments)
                        : func.arguments;

                    const result = await handleCancelOrder(args);

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

    // Get real coordinates from Google Maps
    const pickupCoords = await geocodingService.getCoordinates(pickupAddress);
    const deliveryCoords = await geocodingService.getCoordinates(deliveryAddress);

    const payload = {
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
            phone: phone,
            floor: "",
            room: "",
            placeId: "",
            buildingBlock: "",
            coordinates: pickupCoords, // Real coordinates from Google Maps!
            customerDescription: "",
            schedulePickupNow: false,
            scheduleDateAfter: 0,
            scheduleDateBefore: 0,
            email: ""
        },
        dropoffs: [
            {
                address: deliveryAddress,
                fullName: "Receiver",
                phone: phone,
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
            console.log('   Order CODE:', order.data.code);
            console.log('   Order ID:', order.data.id);

            const orderCode = order.data.code || order.data.id;
            return {
                success: true,
                message: `Booking confirmed! Your order ID is ${orderCode}. A driver is on the way.`,
                orderId: orderCode
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
    console.log(`   Order ID: ${orderId}`);

    // Validate
    if (!orderId) {
        return {
            success: false,
            message: "I need the order ID to cancel the order."
        };
    }

    try {
        await onroService.cancelOrder(orderId);
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
