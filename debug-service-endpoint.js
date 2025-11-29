const axios = require('axios');
require('dotenv').config();

const baseUrl = process.env.ONRO_API_URL;
const clientId = process.env.ONRO_CLIENT_ID;
const clientSecret = process.env.ONRO_CLIENT_SECRET;

async function debugServiceEndpoint() {
    try {
        console.log('🔐 Getting Access Token...');
        const authResponse = await axios.post(`${baseUrl}/api/v1/customer/auth/access-token`, {
            clientId: clientId,
            clientSecret: clientSecret
        }, {
            headers: {
                'Accept-Language': 'en',
                'Content-Type': 'application/json'
            }
        });

        const accessToken = authResponse.data.data.accessToken;
        console.log('✅ Access Token received\n');

        const endpoint = '/api/v1/customer/service';
        console.log(`🔍 Debugging ${endpoint}...`);

        try {
            const response = await axios.get(`${baseUrl}${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept-Language': 'en',
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ SUCCESS!');
            console.log(response.data);
        } catch (error) {
            console.log(`❌ Failed (${error.response ? error.response.status : error.message})`);
            if (error.response && error.response.data) {
                console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
            }
        }

    } catch (error) {
        console.log('❌ Auth Failed:', error.message);
    }
}

debugServiceEndpoint();
