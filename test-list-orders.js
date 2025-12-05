const onroService = require('./src/services/onroService');

async function testListOrders() {
    try {
        console.log('🔄 Authenticating...');
        await onroService.authenticate();
        const token = await onroService.getValidToken();
        const axios = require('axios');

        const endpoint = '/api/v1/customer/order/active';
        console.log(`\n📋 Debugging endpoint: ${endpoint}`);

        try {
            const response = await axios.get(`${process.env.ONRO_API_URL}${endpoint}`, {
                headers: { 'Authorization': `Bearer ${token}` },
                params: {
                    limit: 10,
                    page: 1
                }
            });
            console.log('✅ Success!');
            console.log(JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.log(`❌ Failed: ${error.response ? error.response.status : error.message}`);
            if (error.response && error.response.data) {
                console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testListOrders();
