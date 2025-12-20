require('dotenv').config();
const axios = require('axios');
const onroService = require('./src/services/onroService');

async function testPaymentMethods() {
    try {
        console.log('🔍 Testing Different Payment Method Values...\n');

        await onroService.authenticate();
        const token = await onroService.getValidToken();

        // Get a recent successful order to see what payment method was used
        console.log('📋 Checking recent orders for payment method...');
        const historyResponse = await axios.get(`${process.env.ONRO_API_URL}/api/v1/customer/order/history`, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: {
                customerId: process.env.ONRO_CUSTOMER_ID,
                page: 1,
                perpage: 5
            }
        });

        if (historyResponse.data && historyResponse.data.data && historyResponse.data.data.length > 0) {
            console.log('\n✅ Found recent orders:');
            historyResponse.data.data.forEach((order, index) => {
                console.log(`\nOrder ${index + 1}:`);
                console.log(`  ID: ${order.id}`);
                console.log(`  Code: ${order.code}`);
                console.log(`  Payment Method: ${order.paymentMethod || 'N/A'}`);
                console.log(`  Payment Side: ${order.paymentSide || 'N/A'}`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testPaymentMethods();
