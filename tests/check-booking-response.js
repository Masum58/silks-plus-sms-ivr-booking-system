const taxiCallerService = require('../src/services/taxiCallerService');

async function testRawResponse() {
    console.log('🚀 Testing raw booking response from TaxiCaller...');

    const bookingData = {
        pickupAddress: "Hayes Court & Garfield Road, Kiryas Joel",
        pickupCoordinates: [-74.168, 41.336], // Approximate for Hayes/Garfield
        dropoffAddress: "3 YD Goldberger Drive, Monroe",
        dropoffCoordinates: [-74.175, 41.328], // Approximate for YD Goldberger
        customerName: "Test User",
        customerPhone: "8452385689",
        vehicleType: "1",
        passengers: 1
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
