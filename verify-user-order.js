const taxiCallerService = require('./src/services/taxiCallerService');
require('dotenv').config();

async function checkUserOrder() {
    console.log('🔍 Checking Active Orders for +8801819365623...');
    try {
        const orders = await taxiCallerService.getActiveOrders('+8801819365623');
        console.log('✅ Found Orders:', JSON.stringify(orders, null, 2));

        console.log('\n🔍 Checking Active Orders for 01819365623 (Raw)...');
        const ordersRaw = await taxiCallerService.getActiveOrders('01819365623');
        console.log('✅ Found Orders (Raw):', JSON.stringify(ordersRaw, null, 2));

    } catch (err) {
        console.error('❌ Failed:', err.message);
    }
}

checkUserOrder();
