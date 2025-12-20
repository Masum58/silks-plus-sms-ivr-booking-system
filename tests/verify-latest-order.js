require('dotenv').config();
const axios = require('axios');
const onroService = require('./src/services/onroService');

async function verifyLatestOrder() {
    try {
        console.log('🔍 Verifying Latest Order in Onro Dashboard...\n');

        await onroService.authenticate();
        const token = await onroService.getValidToken();

        // Get recent orders
        const historyResponse = await axios.get(`${process.env.ONRO_API_URL}/api/v1/customer/order/history`, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: {
                customerId: process.env.ONRO_CUSTOMER_ID,
                page: 1,
                perpage: 3
            }
        });

        if (historyResponse.data && historyResponse.data.data) {
            console.log('✅ Latest 3 Orders:\n');

            historyResponse.data.data.forEach((order, index) => {
                console.log(`Order ${index + 1}:`);
                console.log(`  ID: ${order.id}`);
                console.log(`  Status: ${order.status}`);
                console.log(`  Pickup: ${order.pickup?.address || 'N/A'}`);
                console.log(`  Delivery: ${order.dropoffs?.[0]?.address || 'N/A'}`);
                console.log(`  Vehicle Type ID: ${order.vehicleType?.id || 'N/A'}`);
                console.log('');
            });

            // Check if our latest order is there
            const latestOrder = historyResponse.data.data[0];
            if (latestOrder.id === 'f9avEOe9F7CqnKvH5EP31') {
                console.log('🎉 LATEST ORDER VERIFIED IN DASHBOARD!');
                console.log('='.repeat(60));
                console.log(`Order ID: ${latestOrder.id}`);
                console.log(`Status: ${latestOrder.status}`);
                console.log(`Pickup: ${latestOrder.pickup?.address}`);
                console.log(`Delivery: ${latestOrder.dropoffs?.[0]?.address}`);
                console.log(`Vehicle Type: ${latestOrder.vehicleType?.id}`);
                console.log('='.repeat(60));
            } else {
                console.log('⚠️  Latest order not yet in dashboard (might take a moment)');
                console.log(`   Expected: f9avEOe9F7CqnKvH5EP31`);
                console.log(`   Found: ${latestOrder.id}`);
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

verifyLatestOrder();
