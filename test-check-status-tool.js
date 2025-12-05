const onroService = require('./src/services/onroService');
const orderRef = require('./src/services/orderReferenceService');

async function testCheckStatusTool() {
    try {
        console.log('🔄 Authenticating...');
        await onroService.authenticate();

        // 1. Setup Test Data
        const phone = '+18126668455';
        const orderId = 'adjRTzKbewTp8KNAkyy4Z'; // The order created earlier
        const ref = '123456';

        console.log(`📝 Storing local mapping: ${ref} -> ${orderId}`);
        orderRef.storeOrder(ref, orderId, {
            pickup: 'Test Pickup Address',
            delivery: 'Test Delivery Address',
            customerName: 'Test User',
            customerPhone: phone
        });

        // 2. Simulate Tool Logic
        console.log(`\n🔍 Checking status for: ${phone}`);

        // Get local orders
        const localOrders = orderRef.getOrdersByPhone(phone);
        console.log(`   Found ${localOrders.length} local orders`);

        if (localOrders.length === 0) {
            console.log('❌ No local orders found');
            return;
        }

        // Get active orders from Onro
        const masterCustomerId = process.env.ONRO_CUSTOMER_ID;
        // Mocking the service call to return what we want to test, 
        // OR just use the real service but print debug info

        // Let's modify the service call in memory or just use the real one and print
        const token = await onroService.getValidToken();
        const axios = require('axios');
        const response = await axios.get(`${process.env.ONRO_API_URL}/api/v1/customer/order/history`, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: {
                customerId: masterCustomerId,
                page: 1,
                perpage: 20
            }
        });

        const allOrders = response.data.data || [];
        console.log('📋 Recent Orders Statuses:');
        allOrders.forEach(o => console.log(`   - ${o.id}: ${o.status} (${new Date(o.createdAt).toISOString()})`));

        // Filter for active statuses (Including SupportCanceled for testing)
        const activeStatuses = ['Pending', 'Assigned', 'Started', 'Arrived', 'PickedUp', 'SupportCanceled'];
        const activeOrders = allOrders.filter(order => activeStatuses.includes(order.status));

        // Find intersection
        const foundOrders = [];
        for (const localOrder of localOrders) {
            const activeOrder = activeOrders.find(o => o.id === localOrder.orderId);
            if (activeOrder) {
                foundOrders.push({
                    reference: localOrder.reference,
                    status: activeOrder.status,
                    pickup: localOrder.pickup
                });
            }
        }

        // Result
        if (foundOrders.length > 0) {
            console.log(`✅ Found ${foundOrders.length} active matching orders!`);
            foundOrders.forEach(o => {
                console.log(`   - Order ${o.reference}: ${o.status}`);
            });
        } else {
            console.log('⚠️ No matching active orders found (Order might be inactive or not in recent history)');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testCheckStatusTool();
