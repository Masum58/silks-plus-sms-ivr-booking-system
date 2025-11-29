#!/usr/bin/env node

/**
 * Test Vapi Webhook
 * Simulates a tool call from Vapi Assistant
 */

const axios = require('axios');

const WEBHOOK_URL = 'http://localhost:3000/vapi/webhook';

async function testVapiWebhook() {
    try {
        console.log('🧪 Testing Vapi Webhook...\n');

        // Simulate Vapi payload for a tool call
        const payload = {
            message: {
                type: "tool-calls",
                toolCalls: [
                    {
                        id: "call_123456789",
                        type: "function",
                        function: {
                            name: "bookOrder",
                            arguments: JSON.stringify({
                                pickupAddress: "123 Voice Lane, Dhaka",
                                deliveryAddress: "456 Speech Street, Chittagong",
                                customerName: "Voice User",
                                customerPhone: "+8801700000000"
                            })
                        }
                    }
                ]
            }
        };

        console.log('📤 Sending simulated Vapi Tool Call:');
        console.log(JSON.stringify(payload, null, 2));
        console.log('');

        const response = await axios.post(WEBHOOK_URL, payload);

        console.log('✅ Webhook Response:');
        console.log(JSON.stringify(response.data, null, 2));

        console.log('\n🎉 Success! The server processed the voice command.');

    } catch (error) {
        console.log('❌ Error:', error.message);
        if (error.response) {
            console.log('   Status:', error.response.status);
            console.log('   Data:', error.response.data);
        }
    }
}

testVapiWebhook();
