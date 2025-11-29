#!/usr/bin/env node

/**
 * Test Booking SMS
 * Simulates a valid booking SMS to test the full flow
 */

const axios = require('axios');

// Your ngrok URL or localhost
const WEBHOOK_URL = 'http://localhost:3000/sms/receive';

async function sendBookingSMS() {
    try {
        console.log('🧪 Testing Booking SMS Flow...\n');

        const bookingMessage = "Book from 123 Gulshan Avenue, Dhaka to 456 Agrabad, Chittagong";

        console.log('📤 Sending simulated SMS:');
        console.log(`   Message: "${bookingMessage}"`);
        console.log('');

        const response = await axios.post(WEBHOOK_URL, {
            MessageSid: 'SM' + Math.random().toString(36).substring(7),
            AccountSid: 'AC_TEST',
            From: '+8801712345678',
            To: '+18126668455',
            Body: bookingMessage,
            NumMedia: '0'
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('✅ Webhook Response:');
        console.log(response.data);
        console.log('\n🎉 Success! Check your server terminal to see the parsed data and order payload.');

    } catch (error) {
        console.log('❌ Error:', error.message);
        if (error.response) {
            console.log('   Status:', error.response.status);
            console.log('   Data:', error.response.data);
        }
    }
}

sendBookingSMS();
