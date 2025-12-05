const axios = require('axios');
const onroService = require('./src/services/onroService');
require('dotenv').config();

async function getOrderDetails() {
    try {
        console.log('Authenticating...');
        await onroService.authenticate();
        const token = await onroService.getValidToken();

        const response = await axios.get(`${process.env.ONRO_API_URL}/api/v1/customer/order/history`, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: {
                customerId: process.env.ONRO_CUSTOMER_ID,
                page: 1,
                perpage: 5
            }
        });

        console.log('✅ History Fetched:');
        if (response.data.data.length > 0) {
            const firstOrder = response.data.data[0];
            console.log('First Order ID:', firstOrder.id);
            console.log('Pickup:', JSON.stringify(firstOrder.pickup, null, 2));
            console.log('Dropoff:', JSON.stringify(firstOrder.dropoffs[0], null, 2));
        } else {
            console.log('No orders found in history.');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('   Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

getOrderDetails();
