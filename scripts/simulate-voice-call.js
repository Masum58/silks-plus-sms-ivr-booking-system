const axios = require('axios');

// Configuration
const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

async function simulateVoiceCall() {
    console.log('🚀 Starting Voice Call Simulation...');
    console.log('-----------------------------------');

    try {
        // ==========================================
        // TEST: Voice Booking (Vapi Webhook)
        // ==========================================
        console.log('📞 Simulate: Incoming Call from Vapi');

        const voicePayload = {
            message: {
                type: "function-call",
                functionCall: {
                    name: "bookOrder",
                    parameters: {
                        pickupAddress: "3 Austra Parkway, Monroe, NY 10950",
                        deliveryAddress: "7 Van Buren Drive, Monroe, NY 10950",
                        customerPhone: "+8801317365623", // User's BD Number
                        customerName: "Masum Abedin",
                        vehicleType: "Car"
                    }
                }
            }
        };

        console.log('📤 Sending Payload:', JSON.stringify(voicePayload, null, 2));

        const response = await axios.post(`${BASE_URL}/vapi/webhook`, voicePayload);

        console.log('📥 Received Response:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('⚠️  Server is not running! Please run "npm start" in another terminal.');
        } else if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    } finally {
        console.log('-----------------------------------');
    }
}

simulateVoiceCall();
