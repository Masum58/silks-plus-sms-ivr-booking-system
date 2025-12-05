const onroService = require('./src/services/onroService');
const axios = require('axios');

async function testGetBooking() {
    try {
        console.log('🔄 Authenticating...');
        await onroService.authenticate();
        const token = await onroService.getValidToken();

        const orderId = 'adjRTzKbewTp8KNAkyy4Z'; // The order I just created
        const customerId = process.env.ONRO_CUSTOMER_ID;

        console.log(`\n📋 Fetching specific order (singular): ${orderId}`);
        try {
            const response = await axios.get(`${process.env.ONRO_API_URL}/api/v1/customer/order/${orderId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('✅ Order found!');
            console.log('Status:', response.data.data.status);
        } catch (error) {
            console.log(`❌ Failed: ${error.response ? error.response.status : error.message}`);
        }

        console.log(`\n📋 Trying Active endpoint (only customerId):`);
        try {
            const response = await axios.get(`${process.env.ONRO_API_URL}/api/v1/customer/order/active`, {
                headers: { 'Authorization': `Bearer ${token}` },
                params: { customerId: customerId }
            });
            console.log('✅ Active success!');
            console.log(`Count: ${response.data.data ? response.data.data.length : 0}`);
            if (response.data.data && response.data.data.length > 0) {
                console.log('Sample:', JSON.stringify(response.data.data[0], null, 2));
            }
        } catch (error) {
            console.log(`❌ Active failed: ${error.response ? error.response.status : error.message}`);
            if (error.response && error.response.data) {
                console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
            }
        }

        console.log(`\n📋 Trying History endpoint (with perpage):`);
        try {
            const response = await axios.get(`${process.env.ONRO_API_URL}/api/v1/customer/order/history`, {
                headers: { 'Authorization': `Bearer ${token}` },
                params: {
                    customerId: customerId,
                    page: 1,
                    perpage: 10
                }
            });
            console.log('✅ History success!');
            console.log(`Count: ${response.data.data ? response.data.data.length : 0}`);
            if (response.data.data && response.data.data.length > 0) {
                console.log('Sample Order:', JSON.stringify(response.data.data[0], null, 2));
            }
        } catch (error) {
            console.log(`❌ History failed: ${error.response ? error.response.status : error.message}`);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testGetBooking();
