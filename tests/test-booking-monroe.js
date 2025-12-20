#!/usr/bin/env node

/**
 * Test Booking SMS with Monroe, NY Address (Active Zone)
 */

const axios = require('axios');

const WEBHOOK_URL = 'http://localhost:3000/sms/receive';

async function testBooking() {
    try {
        console.log('🧪 Testing Booking SMS with Active Zone (Monroe, NY)...\n');

        // Using Monroe, NY address (confirmed active zone by Onro)
        const twilioRequest = {
            From: '+8801712345678',
            To: '+18126668455',
            Body: 'Book from 123 Main St, Monroe, NY 10950 to 456 Lake Rd, Monroe, NY 10950',
            MessageSid: 'SM' + Math.random().toString(36).substr(2, 9),
            NumMedia: '0'
        };

        console.log('📤 Sending simulated SMS:');
        console.log(`   Message: "${twilioRequest.Body}"\n`);

        const response = await axios.post(WEBHOOK_URL, twilioRequest, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('✅ Webhook Response:');
        console.log(response.data);
        console.log('\n🎉 Check your server terminal for order creation status!');

    } catch (error) {
        console.log('❌ Error:', error.message);
        if (error.response) {
            console.log('   Status:', error.response.status);
            console.log('   Data:', error.response.data);
        }
    }
}

testBooking();
