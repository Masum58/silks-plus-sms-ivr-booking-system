const taxiCallerService = require('../src/services/taxiCallerService');

async function verifyOrder() {
    const orderId = '671e347a4e221a69';
    console.log(`🔍 Fetching full details for Order ID: ${orderId}...`);

    try {
        const order = await taxiCallerService.getOrderStatus(orderId);
        console.log('\n--- TaxiCaller Data Verification ---');

        if (order) {
            console.log('✅ Order Found!');
            console.log(`Status: ${order.state?.state}`);
            console.log(`Pickup: ${order.order?.route?.nodes[0]?.location?.name}`);

            console.log('\n1. 🛣️ Route Points (PTS) check:');
            const pts = order.order?.route?.legs[0]?.pts;
            if (pts && pts.length > 0) {
                console.log(`   - Found ${pts.length / 2} coordinate points in the route.`);
            } else {
                console.log('   - ❌ No route points found.');
            }

            console.log('\n2. 💺 Passenger Requirements check:');
            const item = order.order?.items[0];
            if (item?.require) {
                console.log(`   - Seats: ${item.require.seats}`);
                console.log(`   - Bags: ${item.require.bags}`);
            } else {
                console.log('   - ❌ No require object found.');
            }

            console.log('\n3. 💳 Payment Info check:');
            if (item?.pay_info) {
                console.log(`   - Pay Info @t: ${item.pay_info[0]?.['@t']}`);
            } else {
                console.log('   - ❌ No pay_info found.');
            }
        } else {
            console.log('❌ Order not found or API access error.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

verifyOrder();
