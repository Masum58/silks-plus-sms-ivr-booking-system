const axios = require('axios');

async function testVapiBooking() {
    console.log('🚀 Starting Vapi Webhook Simulation Test...');

    // Use the local server URL (make sure your server is running)
    // Or you can use the live Render URL if you want to test the deployed version
    const url = 'http://localhost:3000/vapi/webhook';

    const payload = {
        message: {
            type: 'function-call',
            functionCall: {
                name: 'bookOrder',
                parameters: {
                    pickupAddress: "Beer Sheva Street",
                    deliveryAddress: "60 Morong Drive",
                    customerPhone: "8452385689",
                    additionalStops: ["3 Oscar Parkway"],
                    driverGender: "Any"
                }
            }
        }
    };

    try {
        console.log('📤 Sending simulated Vapi tool call...');
        console.log('📦 Payload:', JSON.stringify(payload, null, 2));

        const response = await axios.post(url, payload);

        console.log('\n✅ Response from Server:');
        console.log(JSON.stringify(response.data, null, 2));

        if (response.data.results && response.data.results[0].result.success) {
            console.log('\n✨ TEST PASSED: Booking was successful!');
            console.log('📝 AI Message:', response.data.results[0].result.message);
        } else {
            console.log('\n❌ TEST FAILED:', response.data.results[0].result.message);
        }
    } catch (error) {
        console.error('\n❌ Error connecting to server:', error.message);
        console.log('💡 Make sure your local server is running (npm start) before running this test.');
    }
}

testVapiBooking();
