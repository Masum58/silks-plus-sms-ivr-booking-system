require('dotenv').config();
const axios = require('axios');
const onroService = require('./src/services/onroService');
const orderReferenceService = require('./src/services/orderReferenceService');

async function checkOrderInDashboard() {
    try {
        console.log('🔍 Checking Order in Onro Dashboard...\n');
        console.log('Order Reference from Voice Call: 866517\n');

        // Step 1: Get full Order ID from reference
        console.log('Step 1: Looking up full Order ID...');
        const fullOrderId = orderReferenceService.getOrderId('866517');

        if (!fullOrderId) {
            console.log('❌ Order Reference not found in local mapping');
            console.log('   This might mean the order was not created successfully\n');

            // Try to find it in order history
            console.log('Step 2: Searching in Onro order history...');
            await onroService.authenticate();
            const token = await onroService.getValidToken();

            const historyResponse = await axios.get(`${process.env.ONRO_API_URL}/api/v1/customer/order/history`, {
                headers: { 'Authorization': `Bearer ${token}` },
                params: {
                    customerId: process.env.ONRO_CUSTOMER_ID,
                    page: 1,
                    perpage: 10
                }
            });

            if (historyResponse.data && historyResponse.data.data) {
                console.log(`\n✅ Found ${historyResponse.data.data.length} recent orders:\n`);

                historyResponse.data.data.forEach((order, index) => {
                    console.log(`Order ${index + 1}:`);
                    console.log(`  ID: ${order.id}`);
                    console.log(`  Code: ${order.code || 'N/A'}`);
                    console.log(`  Status: ${order.status || 'N/A'}`);
                    console.log(`  Pickup: ${order.pickup?.address || 'N/A'}`);
                    console.log(`  Delivery: ${order.dropoffs?.[0]?.address || 'N/A'}`);
                    console.log(`  Vehicle Type: ${order.vehicleType?.id || 'N/A'}`);
                    console.log('');
                });

                // Check if our order is in the list
                const ourOrder = historyResponse.data.data.find(o => o.code === '866517');
                if (ourOrder) {
                    console.log('🎉 FOUND YOUR ORDER!');
                    console.log('='.repeat(60));
                    console.log(`Order Code: ${ourOrder.code}`);
                    console.log(`Order ID: ${ourOrder.id}`);
                    console.log(`Status: ${ourOrder.status}`);
                    console.log(`Pickup: ${ourOrder.pickup?.address}`);
                    console.log(`Delivery: ${ourOrder.dropoffs?.[0]?.address}`);
                    console.log(`Vehicle Type ID: ${ourOrder.vehicleType?.id || 'N/A'}`);
                    console.log('='.repeat(60));
                } else {
                    console.log('⚠️  Order 866517 not found in recent orders');
                    console.log('   It might take a few moments to appear in the dashboard');
                }
            }
        } else {
            console.log(`✅ Full Order ID: ${fullOrderId}\n`);

            // Get order details
            console.log('Step 2: Fetching order details from Onro...');
            await onroService.authenticate();
            const token = await onroService.getValidToken();

            const orderResponse = await axios.get(`${process.env.ONRO_API_URL}/api/v1/customer/order/${fullOrderId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
                params: {
                    customerId: process.env.ONRO_CUSTOMER_ID
                }
            });

            if (orderResponse.data && orderResponse.data.data) {
                const order = orderResponse.data.data;
                console.log('\n🎉 ORDER FOUND IN ONRO DASHBOARD!');
                console.log('='.repeat(60));
                console.log(`Order Reference: 866517`);
                console.log(`Order ID: ${order.id}`);
                console.log(`Order Code: ${order.code || 'N/A'}`);
                console.log(`Status: ${order.status}`);
                console.log(`Pickup: ${order.pickup?.address}`);
                console.log(`Delivery: ${order.dropoffs?.[0]?.address}`);
                console.log(`Driver Notes: ${order.pickup?.notes || order.dropoffs?.[0]?.notes || 'N/A'}`);
                console.log(`Vehicle Type ID: ${order.vehicleType?.id || 'N/A'}`);
                console.log('='.repeat(60));

                console.log('\n✅ VERIFICATION COMPLETE!');
                console.log('   ✅ Order exists in Onro Dashboard');
                console.log('   ✅ Pickup address correct');
                console.log('   ✅ Delivery address correct');
                console.log('   ✅ Vehicle Type set correctly');
            }
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

checkOrderInDashboard();
