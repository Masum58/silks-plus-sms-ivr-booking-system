const geocodingService = require('../src/services/geocodingService');
const taxiCallerService = require('../src/services/taxiCallerService');

async function testFullRouteFlow() {
    console.log('🚀 Testing full route flow (Google Maps -> TaxiCaller)...');

    const pickupAddress = "Austra Parkway, Monroe, NY";
    const dropoffAddress = "Beer Sheva Street, Monroe, NY";

    try {
        console.log('1. Calculating route via Google Maps...');
        const routeData = await geocodingService.getRoute(pickupAddress, dropoffAddress);

        if (!routeData) {
            throw new Error('Route calculation failed');
        }
        console.log(`✅ Route found: ${routeData.distance}m, Points: ${routeData.points.length / 2}`);

        const pickupCoords = await geocodingService.getCoordinates(pickupAddress);
        const dropoffCoords = await geocodingService.getCoordinates(dropoffAddress);

        const bookingData = {
            pickupAddress: pickupAddress,
            pickupCoordinates: pickupCoords,
            dropoffAddress: dropoffAddress,
            dropoffCoordinates: dropoffCoords,
            route: routeData, // Include distance, duration, and pts
            customerName: "Route Test User",
            customerPhone: "8452385688",
            vehicleType: "1",
            passengers: 1,
            driverNotes: "Test with full route points"
        };

        console.log('2. Creating booking in TaxiCaller...');
        const result = await taxiCallerService.createBooking(bookingData);

        console.log('\n--- VERIFICATION ---');
        console.log(`Order ID: ${result.order?.order_id || 'NOT FOUND'}`);
        console.log(`Price: ${result.price}`);

        // Manual check recommendation
        console.log('\n👉 Check logs/taxicaller.log to ensure "legs" and "pts" are present in the payload.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testFullRouteFlow();
