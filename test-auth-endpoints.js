const axios = require('axios');
require('dotenv').config();

const baseUrl = process.env.ONRO_API_URL;
const clientId = process.env.ONRO_CLIENT_ID;
const clientSecret = process.env.ONRO_CLIENT_SECRET;

const endpoints = [
    '/oauth/token',
    '/api/oauth/token',
    '/api/v1/oauth/token',
    '/auth/login',
    '/api/auth/login',
    '/api/v1/auth/login',
    '/login',
    '/api/login',
    '/api/v1/login',
    '/customer/login',
    '/api/customer/login'
];

async function testEndpoints() {
    console.log(`Testing auth endpoints on ${baseUrl}...`);

    for (const endpoint of endpoints) {
        try {
            console.log(`Testing ${endpoint}...`);
            // Try with client_credentials payload
            let payload = {
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret,
                scope: '*'
            };

            let response = await axios.post(`${baseUrl}${endpoint}`, payload);
            console.log(`SUCCESS: ${endpoint}`);
            console.log('Response:', response.data);
            return;
        } catch (error) {
            if (error.response && error.response.status !== 404) {
                console.log(`POSSIBLE MATCH (Status ${error.response.status}): ${endpoint}`);
                console.log('Error Data:', error.response.data);
                // If 400/401, it might be the right endpoint but wrong payload.
                // Let's try email/password payload just in case
                try {
                    console.log(`   Retrying ${endpoint} with email/password payload...`);
                    const payload2 = {
                        email: clientId, // Sometimes client_id is used as email/username
                        password: clientSecret
                    };
                    const response2 = await axios.post(`${baseUrl}${endpoint}`, payload2);
                    console.log(`   SUCCESS with email/password: ${endpoint}`);
                    console.log('   Response:', response2.data);
                    return;
                } catch (err2) {
                    console.log(`   Failed with email/password: ${err2.response ? err2.response.status : err2.message}`);
                }
            } else {
                console.log(`Failed: ${endpoint} (${error.response ? error.response.status : error.message})`);
            }
        }
    }
    console.log('All endpoints failed.');
}

testEndpoints();
