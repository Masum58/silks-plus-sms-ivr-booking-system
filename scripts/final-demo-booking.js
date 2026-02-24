const axios = require('axios');

async function finalDemoBooking() {
    console.log('🚀 Performing Final Demo Booking for TaxiCaller Dashboard...');

    const payload = {
        message: {
            type: 'function-call',
            functionCall: {
                name: 'bookOrder',
                parameters: {
                    pickupAddress: "Austra Parkway, Monroe, NY",
                    deliveryAddress: "Beer Sheva Street, Monroe, NY",
                    customerPhone: "+8801317365623",
                    customerName: "Final Demo Booking",
                    driverGender: "Female"
                }
            }
        }
    };

    try {
        const response = await axios.post('http://localhost:3000/vapi/webhook', payload);
        console.log('\n📥 Booking Response from Server:');
        console.log(JSON.stringify(response.data, null, 2));

        const result = response.data.results?.[0]?.result;
        if (result && result.success) {
            console.log('\n✅ SUCCESS!');
            console.log(`📍 Order Reference: ${result.orderId}`);
            console.log(`📍 TaxiCaller ID: ${result.taxiCallerId}`);
            console.log(`💰 Price: ${result.price}`);
            console.log('\n👉 Go to your TaxiCaller Dispatch Console now to see the booking.');
        } else {
            console.log('\n❌ Booking failed or returned an error.');
        }
    } catch (error) {
        console.error('\n❌ Simulation Failed:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

finalDemoBooking();
