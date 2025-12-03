/**
 * SMS Routes
 * Handles incoming SMS messages from Twilio
 */

const express = require('express');
const router = express.Router();
const smsParser = require('../services/smsParser');
const onroService = require('../services/onroService');

/**
 * Webhook endpoint for incoming SMS messages
 * Twilio will POST here when a message is received
 */
router.post('/receive', async (req, res) => {
    try {
        const { From: from, Body: body, MessageSid: messageSid, NumMedia: numMedia } = req.body;

        // Log incoming SMS
        console.log('\n📨 SMS Received:');
        console.log(`   From: ${from}`);
        console.log(`   Message: ${body}`);
        console.log(`   SID: ${messageSid}`);
        console.log(`   Media Count: ${numMedia || 0}`);

        // Parse the SMS message
        const parsedData = smsParser.parseBookingMessage(body);
        console.log('📋 Parsed Data:', parsedData);

        let replyMessage = '';

        // Handle cancel request
        if (parsedData.isCancelRequest) {
            console.log(`\n🚫 Cancel request for Order ID: ${parsedData.orderId}`);

            try {
                await onroService.cancelOrder(parsedData.orderId);
                replyMessage = `✅ Order ${parsedData.orderId} has been cancelled successfully!`;
                console.log('✅ Cancellation successful');
            } catch (error) {
                console.error('❌ Cancellation failed:', error.message);
                replyMessage = `❌ Sorry, we couldn't cancel order ${parsedData.orderId}. It may have already been picked up or completed. Please contact support for assistance.`;
            }
        }
        // Handle booking request
        else if (parsedData.isBookingRequest) {
            console.log('\n🔍 Parsed Data:', JSON.stringify(parsedData, null, 2));

            // Validate booking data
            const validation = smsParser.validateBooking(parsedData);
            console.log('✅ Validation:', validation);

            if (validation.isValid) {
                // Create Onro order payload
                const vehicleTypeId = process.env.ONRO_VEHICLE_TYPE_ID || null;
                const orderPayload = await smsParser.createOnroPayload(parsedData, from, vehicleTypeId);

                console.log('\n📦 Order Payload:', JSON.stringify(orderPayload, null, 2));

                // Try to create Onro order (if vehicle type ID is available)
                if (vehicleTypeId) {
                    try {
                        console.log('\n🚀 Creating Onro order...');
                        const order = await onroService.createBooking(orderPayload);
                        console.log('✅ Order created:', order.data);

                        replyMessage = `🎉 Booking confirmed!\n\n📍 Pickup: ${parsedData.pickup}\n📍 Delivery: ${parsedData.delivery}\n\nOrder ID: ${order.data.id || 'Pending'}\n\nA driver will be assigned shortly!`;
                    } catch (error) {
                        console.error('❌ Onro order creation failed:', error.message);
                        replyMessage = `We received your booking request:\n\n📍 Pickup: ${parsedData.pickup}\n📍 Delivery: ${parsedData.delivery}\n\nHowever, there was an issue creating the order. Our team will contact you shortly.`;
                    }
                } else {
                    // Vehicle type ID not configured yet
                    console.log('⚠️ Vehicle Type ID not configured. Order not created.');
                    replyMessage = smsParser.generateResponseMessage(parsedData, validation);
                }
            } else {
                // Invalid booking request
                replyMessage = smsParser.generateResponseMessage(parsedData, validation);
            }
        } else {
            // Not a booking or cancel request
            replyMessage = "Hi! To book a delivery, send: 'Book from [pickup address] to [delivery address]'\n\nTo cancel an order, send: 'Cancel order [ORDER_ID]'";
        }

        console.log('\n💬 Reply:', replyMessage);

        // Respond to Twilio with TwiML
        res.type('text/xml');
        res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${replyMessage}</Message>
</Response>`);

    } catch (error) {
        console.error('❌ Error processing SMS:', error);
        res.status(500).send('Error processing SMS');
    }
});

/**
 * Webhook endpoint for SMS status callbacks
 * Twilio will POST here with delivery status updates
 */
router.post('/status', (req, res) => {
    try {
        const {
            MessageSid: messageSid,
            MessageStatus: status,
            To: to,
            From: from
        } = req.body;

        console.log('\n📊 SMS Status Update:');
        console.log(`   SID: ${messageSid}`);
        console.log(`   Status: ${status}`);
        console.log(`   To: ${to}`);
        console.log(`   From: ${from}`);

        res.sendStatus(200);
    } catch (error) {
        console.error('❌ Error processing status callback:', error);
        res.status(500).send('Error processing status callback');
    }
});

module.exports = router;
