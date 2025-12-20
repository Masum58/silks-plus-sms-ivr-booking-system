const onroService = require('./src/services/onroService');

async function testActiveOrders() {
    try {
        console.log('🔄 Authenticating...');
        await onroService.authenticate();

        const customerId = process.env.ONRO_CUSTOMER_ID;
        console.log(`📋 Fetching active orders for customer: ${customerId}`);

        const orders = await onroService.getActiveOrders(customerId);

        console.log('✅ Success!');
        console.log(`   Count: ${orders.length}`);

        if (orders.length > 0) {
            console.log('   Sample Order:', JSON.stringify(orders[0], null, 2));
        } else {
            console.log('   No active orders found.');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testActiveOrders();
