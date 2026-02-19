const axios = require('axios');
const taxiCallerService = require('../src/services/taxiCallerService');

async function checkFareEstimate() {
    console.log('🔍 Checking Fare Estimate from TaxiCaller (Availability API)...');

    try {
        const bookingData = {
            pickupAddress: "3 Austra Parkway, Monroe, NY 10950",
            pickupCoordinates: [41.340058, -74.192534], // Example coords for Monroe
            dropoffAddress: "7 Van Buren Drive, Monroe, NY 10950",
            dropoffCoordinates: [41.332345, -74.187654],
            vehicleType: "1"
        };

        const response = await taxiCallerService.getFareEstimate(bookingData);

        console.log('------------------------------------');
        console.log('✅ SUCCESS: Sample Response for Support');
        console.log('------------------------------------');
        console.log('Request Source: POST /api/v1/booker/availability/order');
        console.log('Response Body:', JSON.stringify(response, null, 2));
        console.log('------------------------------------');

    } catch (e) {
        console.error('❌ Error fetching fare:', e.response?.data || e.message);
    }
}

checkFareEstimate();
