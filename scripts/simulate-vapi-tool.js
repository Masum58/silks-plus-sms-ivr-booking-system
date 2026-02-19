const axios = require('axios');

async function simulateVapiToolCall() {
    console.log('🚀 Simulating Vapi Tool Call (Live Format)...');

    const payload = {
        message: {
            type: 'function-call',
            functionCall: {
                name: 'bookOrder',
                parameters: {
                    pickupAddress: "Austra Parkway, Monroe, NY",
                    deliveryAddress: "Beer Sheva Street, Monroe, NY",
                    customerPhone: "+8801317365623",
                    customerName: "Vapi Live Test",
                    driverGender: "Female"
                }
            }
        }
    };

    try {
        const response = await axios.post('http://localhost:3000/vapi/webhook', payload);
        console.log('📥 Server Response:');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Simulation Failed:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

simulateVapiToolCall();
