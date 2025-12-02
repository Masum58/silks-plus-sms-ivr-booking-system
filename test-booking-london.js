#!/usr/bin/env node

/**
 * Test Booking SMS with Valid London Addresses
 */

const axios = require('axios');

const WEBHOOK_URL = 'http://localhost:3000/sms/receive';

async function testBooking() {
    try {
        console.log('🧪 Testing Booking SMS Flow with Valid Addresses...\n');

        // Using addresses from Onro's example (London)
        const twilioRequest = {
            From: '+8801712345678',
            To: '+18126668455',
            Body: 'Book from Cumberland Gate, London W2 2UH, UK to 62 Albemarle St, London W1S 4BD, UK',
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
        console.log('\n🎉 Success! Check your server terminal to see the parsed data and order payload.');

    } catch (error) {
        console.log('❌ Error:', error.message);
        if (error.response) {
            console.log('   Status:', error.response.status);
            console.log('   Data:', error.response.data);
        }
    }
}

testBooking();
