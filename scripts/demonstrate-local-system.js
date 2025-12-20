const axios = require('axios');
const { spawn } = require('child_process');

// Configuration
const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

async function runDemo() {
    console.log('🚀 Starting System Demonstration...');
    console.log('-----------------------------------');

    // 1. Start the Server
    console.log('📡 Starting Local Server...');
    const server = require('../index'); // This starts the server on PORT 3000

    // Wait for server to initialize
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
        // ==========================================
        // TEST 1: Voice Booking (Vapi Webhook)
        // ==========================================
        console.log('\n\n📞 TEST 1: Voice Booking (Vapi Simulation)');
        console.log('------------------------------------------');

        const voicePayload = {
            message: {
                type: "function-call",
                functionCall: {
                    name: "bookOrder",
                    parameters: {
                        pickupAddress: "3 Austra Parkway, Monroe, NY",
                        deliveryAddress: "7 Van Buren Drive, Monroe, NY",
                        customerPhone: "+15550001111",
                        customerName: "Voice User",
                        vehicleType: "Car"
                    }
                }
            }
        };

        console.log('📤 Sending Vapi Payload:', JSON.stringify(voicePayload, null, 2));

        const voiceResponse = await axios.post(`${BASE_URL}/vapi/webhook`, voicePayload);

        console.log('📥 Received Vapi Response:', JSON.stringify(voiceResponse.data, null, 2));


        // ==========================================
        // TEST 2: SMS Booking (Twilio Webhook)
        // ==========================================
        console.log('\n\n📨 TEST 2: SMS Booking (Twilio Simulation)');
        console.log('------------------------------------------');

        const smsPayload = new URLSearchParams();
        smsPayload.append('From', '+15550002222');
        smsPayload.append('Body', 'Book from 123 Main St, Monroe, NY to 456 Broad St, Monroe, NY');
        smsPayload.append('MessageSid', 'SM_DEMO_123');

        console.log('📤 Sending SMS Payload (Form Data):');
        console.log('   From: +15550002222');
        console.log('   Body: Book from 123 Main St, Monroe, NY to 456 Broad St, Monroe, NY');

        const smsResponse = await axios.post(`${BASE_URL}/sms/receive`, smsPayload, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        console.log('📥 Received TwiML Response:');
        console.log(smsResponse.data);


        // ==========================================
        // TEST 3: Order Status Check (Voice)
        // ==========================================
        console.log('\n\n🔍 TEST 3: Order Status Check (Voice Simulation)');
        console.log('------------------------------------------');

        const statusPayload = {
            message: {
                type: "function-call",
                functionCall: {
                    name: "checkOrderStatus",
                    parameters: {
                        customerPhone: "+15550001111" // Same phone as Test 1
                    }
                }
            }
        };

        console.log('📤 Sending Status Check Payload:', JSON.stringify(statusPayload, null, 2));

        const statusResponse = await axios.post(`${BASE_URL}/vapi/webhook`, statusPayload);

        console.log('📥 Received Status Response:', JSON.stringify(statusResponse.data, null, 2));

    } catch (error) {
        console.error('❌ Error during demo:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    } finally {
        console.log('\n\n🏁 Demonstration Complete');
        console.log('-----------------------------------');
        process.exit(0);
    }
}

runDemo();
