const axios = require('axios');

async function testBooking() {
    console.log('🚀 Starting Test Booking with New Addresses...');
    console.log('-----------------------------------');

    const payload = {
        message: {
            type: 'function-call',
            functionCall: {
                name: 'bookOrder',
                parameters: {
                    pickupAddress: 'Hayes Court & Garfield Road, Kiryas Joel',
                    deliveryAddress: '18 Getzil Berger Blvd, Monroe',
                    customerPhone: '+18453958774',
                    customerName: 'Test Customer',
                    vehicleType: 'Car',
                    driverGender: 'Female'
                }
            }
        }
    };

    console.log('📤 Sending Payload:');
    console.log(JSON.stringify(payload, null, 2));
    console.log('');

    try {
        const response = await axios.post('http://localhost:3000/vapi/webhook', payload);
        console.log('📥 Received Response:');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
    console.log('-----------------------------------');
}

testBooking();
