const taxiCallerService = require('../src/services/taxiCallerService');

async function testRawResponse() {
    console.log('🚀 Testing raw booking response from TaxiCaller...');

    const bookingData = {
        pickupAddress: "Monroe, NY",
        dropoffAddress: "New York, NY",
        customerName: "Test User",
        customerPhone: "8452385689",
        vehicleType: "1"
    };

    try {
        const result = await taxiCallerService.createBooking(bookingData);
        console.log('\n--- FULL RESULT ---');
        console.log(JSON.stringify(result, null, 2));

        if (result.price) {
            console.log(`\n✅ SUCCESS! Price found: ${result.price}`);
        } else {
            console.log('\n❌ Price is still NULL.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testRawResponse();
