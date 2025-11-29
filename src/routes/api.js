const express = require('express');
const router = express.Router();
const onroService = require('../services/onroService');
const twilioService = require('../services/twilioService');

// Health Check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test Onro Connection (Temporary)
router.get('/test-onro', async (req, res) => {
    try {
        // This is a dummy call to verify connectivity
        // You might need to adjust this based on a real endpoint that exists in Onro
        const result = await onroService.authenticate();
        res.json({ success: true, message: 'Onro authentication simulated', result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Test Twilio SMS (Temporary - use with caution)
router.post('/test-sms', async (req, res) => {
    const { to, body } = req.body;
    if (!to || !body) {
        return res.status(400).json({ error: 'Missing "to" or "body"' });
    }
    try {
        const result = await twilioService.sendSms(to, body);
        res.json({ success: true, sid: result.sid });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;

// Create Onro Booking (Test Endpoint)
router.post('/create-booking', async (req, res) => {
    try {
        const bookingData = req.body;
        // Basic validation
        if (!bookingData || Object.keys(bookingData).length === 0) {
            return res.status(400).json({ error: 'Missing booking data in request body' });
        }

        console.log('Creating booking with data:', JSON.stringify(bookingData, null, 2));
        const result = await onroService.createBooking(bookingData);
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Booking creation failed:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            details: error.response ? error.response.data : null
        });
    }
});
