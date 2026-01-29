const axios = require('axios');

async function testRenderBooking() {
    console.log('🚀 Testing LIVE Render Server Booking...');
    console.log('Server: https://swifly-booking.onrender.com');
    console.log('-----------------------------------\n');

    const payload = {
        message: {
            type: 'function-call',
            functionCall: {
                name: 'bookOrder',
                parameters: {
                    pickupAddress: 'Hayes Court & Garfield Road, Kiryas Joel',
                    deliveryAddress: '3 YD Goldberger Drive, Monroe',
                    customerPhone: '+18453958774',
                    customerName: 'Masum Test',
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
        const response = await axios.post('https://swifly-booking.onrender.com/vapi/webhook', payload, {
            timeout: 25000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ SUCCESS!');
        console.log('📥 Received Response:');
        console.log(JSON.stringify(response.data, null, 2));

        if (response.data.results && response.data.results[0]) {
            const result = response.data.results[0].result;
            console.log('\n📊 Booking Summary:');
            console.log('   Status:', result.success ? '✅ Success' : '❌ Failed');
            console.log('   Message:', result.message);
            console.log('   Order ID:', result.orderId);
            console.log('   Price:', result.price);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
    console.log('\n-----------------------------------');
}

testRenderBooking();
