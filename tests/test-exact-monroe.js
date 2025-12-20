#!/usr/bin/env node

/**
 * Test Booking SMS with Exact Monroe Addresses
 */

const axios = require('axios');

const WEBHOOK_URL = 'https://swifly-booking.onrender.com/sms/receive';

async function testBooking() {
    try {
        console.log('🧪 Testing Booking SMS with Exact Monroe Addresses...\n');

        // Using exact addresses provided
        const twilioRequest = {
            From: '+8801712345678',
            To: '+18126668455',
            Body: 'Book from 3 Austra Parkway #103 Monroe NY 10950 to 7 Van Buren Drive #304 Monroe NY 10950',
            MessageSid: 'SM' + Math.random().toString(36).substr(2, 9),
            NumMedia: '0'
        };

        console.log('📤 Sending simulated SMS:');
        console.log(`   From: ${twilioRequest.From}`);
        console.log(`   Message: "${twilioRequest.Body}"\n`);

        const response = await axios.post(WEBHOOK_URL, twilioRequest, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('✅ Webhook Response:');
        console.log(response.data);
        console.log('\n🎉 Check your server terminal for order creation status!');
        console.log('If successful, you should see an Order ID!');

    } catch (error) {
        console.log('❌ Error:', error.message);
        if (error.response) {
            console.log('   Status:', error.response.status);
            console.log('   Data:', error.response.data);
        }
    }
}

testBooking();
