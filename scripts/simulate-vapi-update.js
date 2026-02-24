const axios = require('axios');

async function testVapiBooking() {
    console.log('🚀 Simulating Booking to test "16" and confirmation logic...');

    const payload = {
        message: {
            type: 'function-call',
            functionCall: {
                name: 'bookOrder',
                parameters: {
                    pickupAddress: "16 Beer Sheva Street, Monroe, NY", // Testing "16"
                    deliveryAddress: "17 Forest Road, Monroe, NY", // Testing "17"
                    customerPhone: "+8801317365623",
                    customerName: "Verification Test User",
                    // Driver gender omitted to test "no preference" by default
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
            console.log(`📍 Order Reference (For Customer): ${result.orderId}`);
            console.log(`💼 TaxiCaller ID (For Dispatcher): ${result.taxiCallerId}`);
            console.log(`💰 Expected Price: ${result.price}`);
            console.log('\n👉 Go to your TaxiCaller Dispatch Console now to verify the address precision.');
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

testVapiBooking();
