const onroService = require('./src/services/onroService');
const orderRef = require('./src/services/orderReferenceService');
require('dotenv').config();

async function testCheckStatus() {
    // Mock args from Vapi
    const args = {
        customerPhone: "01317365623" // Phone from transcript
    };

    console.log('Testing checkOrderStatus with args:', args);

    // 1. Get local orders
    const localOrders = orderRef.getOrdersByPhone(args.customerPhone);
    console.log('Local Orders:', localOrders);

    // 2. Lookup Customer ID
    const customerService = require('./src/services/customerService');
    let targetCustomerId = process.env.ONRO_CUSTOMER_ID;

    try {
        const customerId = await customerService.findCustomerByPhone(args.customerPhone);
        if (customerId) {
            console.log(`✅ Found customer account: ${customerId}`);
            targetCustomerId = customerId;
        } else {
            console.log('⚠️ Customer not found, using Master ID');
        }
    } catch (error) {
        console.error('❌ Customer lookup error:', error.message);
    }

    // 3. Get raw history from Onro
    await onroService.authenticate();
    const token = await onroService.getValidToken();
    const axios = require('axios');

    console.log(`Fetching raw history for customer: ${targetCustomerId}...`);
    const response = await axios.get(`${process.env.ONRO_API_URL}/api/v1/customer/order/history`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
            customerId: targetCustomerId,
            page: 1,
            perpage: 20
        }
    });

    const allOrders = response.data.data;
    console.log(`Fetched ${allOrders.length} orders from history.`);

    allOrders.forEach(order => {
        console.log(`ID: ${order.id}, Status: ${order.status}, Created: ${order.createdAt}`);
    });

    if (localOrders.length > 0) {
        // 3. Find intersection
        const found = localOrders.find(lo => allOrders.some(ao => ao.id === lo.orderId)); // Changed activeOrders to allOrders
        if (found) {
            console.log('✅ Found matching order:', found);
            const status = allOrders.find(ao => ao.id === found.orderId).status; // Changed activeOrders to allOrders
            console.log('   Status:', status);
        } else {
            console.log('⚠️ Order not found in active list (might be delay)');
            console.log('   Active IDs:', activeOrders.map(o => o.id));
        }
    } else {
        console.log('❌ No local orders found for this phone.');
    }
}

testCheckStatus();
