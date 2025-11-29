const axios = require('axios');
require('dotenv').config();

const baseUrl = process.env.ONRO_API_URL;
const clientId = process.env.ONRO_CLIENT_ID;
const clientSecret = process.env.ONRO_CLIENT_SECRET;
let customerId = process.env.ONRO_CUSTOMER_ID;

async function fetchServices() {
    try {
        console.log('🔐 Getting Access Token...');
        const authResponse = await axios.post(`${baseUrl}/api/v1/customer/auth/access-token`, {
            clientId: clientId,
            clientSecret: clientSecret
        }, {
            headers: { 'Accept-Language': 'en', 'Content-Type': 'application/json' }
        });

        const accessToken = authResponse.data.data.accessToken;
        if (authResponse.data.data.customerId) customerId = authResponse.data.data.customerId;

        console.log('✅ Access Token received');

        const endpoint = '/api/v1/customer/service';
        console.log(`📦 Fetching Services from ${endpoint}...`);

        const response = await axios.get(`${baseUrl}${endpoint}`, {
            params: { customerId: customerId },
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept-Language': 'en',
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ SUCCESS!');
        console.log('Response Data Structure:');
        console.log(JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.log(`❌ Failed (${error.response ? error.response.status : error.message})`);
    }
}

fetchServices();
