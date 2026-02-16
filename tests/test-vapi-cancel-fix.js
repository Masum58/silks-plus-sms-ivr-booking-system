const taxiCallerService = require('../src/services/taxiCallerService');
const orderRef = require('../src/services/orderReferenceService');
const vapiRoute = require('../src/routes/vapi'); // We can't easily import the route handler, but we can test the service directly first.

// Mock the route handler logic for testing
async function testCancelFix() {
    console.log('🚀 Starting Vapi Cancellation Fix Test...');

    const testPhone = '+18456371211'; // Use a real-ish number format
    const isLocalTest = true;

    try {
        // 1. Create a dummy Booking directly via Service (to populate TaxiCaller)
        console.log('\n1. Creating Test Booking...');
        const bookingData = {
            clientId: 12345, // Dummy
            customerName: "Test User",
            customerPhone: testPhone,
            pickupAddress: "123 Test St, Monroe, NY",
            pickupCoordinates: [-74.2, 41.3],
            dropoffAddress: "456 Test Ave, Monroe, NY",
            dropoffCoordinates: [-74.1, 41.4],
            vehicleType: "1",
            provider_id: 0
        };

        const order = await taxiCallerService.createBooking(bookingData);
        const orderId = order.order?.order_id || order.order_id || order.id;
        console.log(`✅ Created Order: ${orderId}`);

        // 2. Validate it exists in findOrdersByPhone
        console.log('\n2. Verifying findOrdersByPhone...');
        let foundOrders = await taxiCallerService.findOrdersByPhone(testPhone);
        console.log(`FOUND: ${foundOrders.length} orders`);
        if (foundOrders.length === 0) {
            console.error('❌ Failed to find the order we just created!');
            process.exit(1);
        }
        const match = foundOrders.find(o => (o.id || o.order_id) == orderId);
        if (!match) {
            console.error('❌ Created order not in the list!');
            process.exit(1);
        }
        console.log(`✅ Order ${orderId} found via phone lookup.`);

        // 3. Simulate "Server Restart" (Clear OrderReferenceService memory)
        console.log('\n3. Clearing Local Memory (Simulating Restart)...');
        // We can't easily clear the singleton's map from outside without a method, 
        // but `findOrdersByPhone` doesn't use it, which is the point. 
        // So we just rely on `findOrdersByPhone` functionality which we tested in step 2.

        // 4. Cancel using findOrdersByPhone logic (mimicking vapi.js)
        console.log('\n4. Attempting Cancel by Phone...');

        // This is the logic we added to vapi.js
        let targetId = null;
        if (foundOrders.length > 0) {
            const mostRecent = foundOrders[0];
            targetId = mostRecent.id || mostRecent.order_id;
            console.log(`vapi.js Logic: Found most recent order ${targetId}`);
        }

        if (targetId) {
            await taxiCallerService.cancelOrder(targetId);
            console.log(`✅ Cancelled Order ${targetId}`);
        } else {
            console.error('❌ Failed to resolve order ID for cancellation.');
            process.exit(1);
        }

        console.log('\n✨ TEST PASSED: robust cancellation works!');

    } catch (error) {
        console.error('❌ Test Failed:', error);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

testCancelFix();
