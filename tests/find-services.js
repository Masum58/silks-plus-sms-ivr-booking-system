const axios = require('axios');
require('dotenv').config();

const baseUrl = process.env.ONRO_API_URL;
const clientId = process.env.ONRO_CLIENT_ID;
const clientSecret = process.env.ONRO_CLIENT_SECRET;

const possibleEndpoints = [
    '/api/v1/customer/services',
    '/api/v1/services',
    '/api/v1/customer/service',
    '/api/v1/common/services',
    '/api/v1/public/services',
    '/api/v1/customer/services/list',
    '/api/v1/lookups/services'
];

async function findServicesEndpoint() {
    try {
        // Step 1: Get access token
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

        // Step 2: Try endpoints
        console.log('🔍 Testing endpoints for Services...');

        for (const endpoint of possibleEndpoints) {
            try {
                process.stdout.write(`Testing ${endpoint}... `);
                const response = await axios.get(`${baseUrl}${endpoint}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept-Language': 'en',
                        'Content-Type': 'application/json'
                    }
                });

                console.log('✅ SUCCESS!');
                console.log('Response Data:', JSON.stringify(response.data, null, 2).substring(0, 200) + '...');

                if (response.data && response.data.data && Array.isArray(response.data.data)) {
                    console.log('\n🎉 FOUND SERVICES!');
                    response.data.data.forEach(s => {
                        console.log(`- ID: ${s._id}, Name: ${s.name}`);
                    });
                    return;
                }
            } catch (error) {
                console.log(`❌ Failed (${error.response ? error.response.status : error.message})`);
            }
        }

        console.log('\n❌ Could not find Services endpoint.');

    } catch (error) {
        console.log('❌ Auth Failed:', error.message);
    }
}

findServicesEndpoint();
