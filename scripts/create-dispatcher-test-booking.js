const axios = require('axios');

async function createTestBooking() {
    console.log('🚀 Starting Test Booking for Dispatcher Visibility...');

    const url = 'http://localhost:3000/vapi/webhook';
    const timestamp = new Date().toLocaleString();

    const payload = {
        message: {
            type: 'function-call',
            functionCall: {
                name: 'bookOrder',
                parameters: {
                    pickupAddress: "10 Main Street, Monroe, NY",
                    deliveryAddress: "20 Broadway, Monroe, NY",
                    customerPhone: "+18452385689",
                    customerName: "Dispatcher Test",
                    driverNotes: `DISPATCHER VISIBILITY TEST - ${timestamp}`,
                    driverGender: "Any"
                }
            }
        }
    };

    try {
        console.log('📤 Sending booking request to local server...');
        const response = await axios.post(url, payload);

        console.log('\n✅ Response from Server:');
        console.log(JSON.stringify(response.data, null, 2));

        if (response.data.results && response.data.results[0].result.success) {
            console.log('\n✨ SUCCESS: Booking created!');
            const taxiCallerId = response.data.results[0].result.taxiCallerId;
            console.log(`📝 TaxiCaller Order ID: ${taxiCallerId}`);
            console.log('👉 Please check your TaxiCaller Dispatcher dashboard now.');
            console.log(`🔍 Look for order ID: ${taxiCallerId} or note: "DISPATCHER VISIBILITY TEST"`);
        } else {
            console.log('\n❌ FAILED:', response.data.results[0].result.message);
        }
    } catch (error) {
        console.error('\n❌ Error connecting to server:', error.message);
        if (error.response) {
            console.error('Data:', error.response.data);
        }
    }
}

createTestBooking();
