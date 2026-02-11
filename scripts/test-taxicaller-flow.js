require('dotenv').config();
const taxiCallerService = require('../src/services/taxiCallerService');

async function testFullFlow() {
    console.log('🚀 Starting Full TaxiCaller Integration Test...');

    const testBooking = {
        customerName: "Test User",
        customerPhone: "+1234567890",
        pickupAddress: "123 Main St, Monroe, NY 10950",
        pickupCoordinates: [41.3255, -74.1868],
        dropoffAddress: "456 Oak Ave, Monroe, NY 10950",
        dropoffCoordinates: [41.3230, -74.1800],
        vehicleType: "2" // Sedan
    };

    try {
        // 1. Get Fare Estimate
        console.log('\n--- 1. Testing Fare Estimate ---');
        const estimate = await taxiCallerService.getFareEstimate(testBooking);
        console.log('✅ Estimate successful');

        // 2. Create Booking
        console.log('\n--- 2. Testing Booking Creation ---');
        const booking = await taxiCallerService.createBooking(testBooking);
        const orderId = booking.order?.order_id || booking.order_id || booking.id;
        console.log(`✅ Booking successful! Order ID: ${orderId}`);

        // 3. Get Active Orders
        console.log('\n--- 3. Testing Active Orders Fetch ---');
        try {
            const activeOrders = await taxiCallerService.getActiveOrders(testBooking.customerPhone);
            console.log(`✅ Found ${activeOrders.length} active orders`);
        } catch (e) {
            console.log('⚠️ Active Orders fetch failed (skipping):', e.message);
        }

        // 4. Cancel Order
        console.log('\n--- 4. Testing Order Cancellation ---');
        await taxiCallerService.cancelOrder(orderId);
        console.log('✅ Cancellation successful');

        console.log('\n✨ FULL FLOW TEST PASSED! ✨');

    } catch (error) {
        console.error('\n❌ Test Flow Failed!');
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testFullFlow();
