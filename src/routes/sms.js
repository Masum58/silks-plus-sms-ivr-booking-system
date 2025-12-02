const express = require('express');
const router = express.Router();
const twilioService = require('../services/twilioService');
const smsParser = require('../services/smsParser');
const onroService = require('../services/onroService');

/**
 * Webhook endpoint for receiving SMS from Twilio
 * Twilio will POST to this endpoint when an SMS is received
 */
router.post('/receive', async (req, res) => {
    try {
        // Extract Twilio request parameters
        const {
            From: from,
            To: to,
            Body: body,
            MessageSid: messageSid,
            NumMedia: numMedia
        } = req.body;

        console.log('📨 SMS Received:');
        console.log(`   From: ${from}`);
        console.log(`   To: ${to}`);
        console.log(`   Message: ${body}`);
        console.log(`   SID: ${messageSid}`);
        console.log(`   Media Count: ${numMedia || 0}`);

        // Parse the SMS message
        const parsedData = smsParser.parseBookingMessage(body);
        console.log('\n🔍 Parsed Data:', JSON.stringify(parsedData, null, 2));

        // Validate booking data
        const validation = smsParser.validateBooking(parsedData);
        console.log('✅ Validation:', validation);

        let replyMessage;

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
            ErrorCode: errorCode,
            ErrorMessage: errorMessage
        } = req.body;

        console.log('📊 SMS Status Update:');
        console.log(`   SID: ${messageSid}`);
        console.log(`   Status: ${status}`);
        console.log(`   To: ${to}`);

        if (errorCode) {
            console.log(`   ❌ Error ${errorCode}: ${errorMessage}`);
        }

        // TODO: Update database with delivery status

        res.sendStatus(200);
    } catch (error) {
        console.error('Error processing status callback:', error);
        res.status(500).send('Error processing status');
    }
});

module.exports = router;
