#!/usr/bin/env node

/**
 * Simulate Twilio SMS Webhook Request
 * This simulates what Twilio sends when an SMS is received
 */

const axios = require('axios');

// Your ngrok URL (update this!)
const WEBHOOK_URL = 'http://localhost:3000/sms/receive';

// Simulate Twilio's request
const twilioRequest = {
    MessageSid: 'SM' + Math.random().toString(36).substring(7),
    AccountSid: 'ACcc78761badc4265a00b8d9958b978ee6',
    From: '+8801712345678',  // Simulated sender
    To: '+18126668455',      // Your Twilio number
    Body: 'Test message from Bangladesh! 🇧🇩',
    NumMedia: '0'
};

async function testWebhook() {
    try {
        console.log('🧪 Testing SMS Webhook...\n');
        console.log('📤 Sending simulated SMS:');
        console.log(`   From: ${twilioRequest.From}`);
        console.log(`   To: ${twilioRequest.To}`);
        console.log(`   Message: ${twilioRequest.Body}`);
        console.log('');

        const response = await axios.post(WEBHOOK_URL, twilioRequest, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('✅ Webhook Response:');
        console.log(response.data);
        console.log('\n🎉 Success! Check your server terminal for logs.');

    } catch (error) {
        console.log('❌ Error:');
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Data:`, error.response.data);
        } else {
            console.log(`   ${error.message}`);
        }

        console.log('\n💡 Make sure:');
        console.log('   1. Server is running (node index.js)');
        console.log('   2. URL is correct (check ngrok URL if using)');
    }
}

console.log('🚀 Twilio SMS Webhook Simulator\n');
console.log('This simulates receiving an SMS without actually sending one.\n');
testWebhook();
