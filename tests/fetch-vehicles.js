const axios = require('axios');
require('dotenv').config();

const baseUrl = process.env.ONRO_API_URL;
const clientId = process.env.ONRO_CLIENT_ID;
const clientSecret = process.env.ONRO_CLIENT_SECRET;
let customerId = process.env.ONRO_CUSTOMER_ID;

async function fetchVehicles() {
    try {
        console.log('🔐 Getting Access Token...');
        const authResponse = await axios.post(`${baseUrl}/api/v1/customer/auth/access-token`, {
            clientId: clientId,
            clientSecret: clientSecret
        }, { headers: { 'Accept-Language': 'en', 'Content-Type': 'application/json' } });

        const accessToken = authResponse.data.data.accessToken;
        if (authResponse.data.data.customerId) customerId = authResponse.data.data.customerId;
        console.log('✅ Access Token received');

        // Try to fetch vehicles
        const endpoints = [
            '/api/v1/customer/vehicles',
            '/api/v1/vehicles',
            '/api/v1/customer/vehicle',
            '/api/v1/lookups/vehicles'
        ];

        for (const endpoint of endpoints) {
            try {
                console.log(`Testing ${endpoint}...`);
                const response = await axios.get(`${baseUrl}${endpoint}`, {
                    params: { customerId: customerId },
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept-Language': 'en',
                        'Content-Type': 'application/json'
                    }
                });

                console.log('✅ SUCCESS!');
                console.log(JSON.stringify(response.data, null, 2));
                return;
            } catch (error) {
                console.log(`❌ Failed (${error.response ? error.response.status : error.message})`);
            }
        }

    } catch (error) {
        console.log(`❌ Failed (${error.response ? error.response.status : error.message})`);
    }
}

fetchVehicles();
