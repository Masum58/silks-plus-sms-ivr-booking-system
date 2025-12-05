const axios = require('axios');
require('dotenv').config();
const onroService = require('./src/services/onroService');

async function testOrderDetails() {
    try {
        await onroService.authenticate();
        const token = await onroService.getValidToken();
        const orderId = 'adjRTzKbewTp8KNAkyy4Z'; // Use the ID from creation

        const endpoints = [
            `/api/v1/customer/order/details?orderId=${orderId}`,
            `/api/v1/customer/order/info?orderId=${orderId}`,
            `/api/v1/customer/order/get?orderId=${orderId}`,
            `/api/v1/customer/order?orderId=${orderId}`,
            `/api/v1/customer/orders?orderId=${orderId}`,
            `/api/v1/customer/orders/detail?orderId=${orderId}`,
            `/api/v1/customer/order/${orderId}/details`,
            `/api/v1/customer/order/${orderId}/info`
        ];

        console.log('🔍 Testing Single Order Endpoints...');

        for (const endpoint of endpoints) {
            try {
                const response = await axios.get(`${process.env.ONRO_API_URL}${endpoint}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log(`✅ Success: ${endpoint}`);
                console.log(JSON.stringify(response.data, null, 2));
                return;
            } catch (error) {
                console.log(`❌ Failed: ${endpoint} (${error.response ? error.response.status : error.message})`);
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testOrderDetails();
