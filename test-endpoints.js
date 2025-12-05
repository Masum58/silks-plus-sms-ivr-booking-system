const axios = require('axios');
require('dotenv').config();

async function testEndpoints() {
    const baseUrl = process.env.ONRO_API_URL;
    const endpoints = [
        '/api/v1/customer/auth/register',
        '/api/v1/customer/auth/signup',
        '/api/v1/customer/register',
        '/api/v1/customer/signup',
        '/api/v1/auth/register',
        '/api/v1/auth/signup'
    ];

    console.log('🔍 Testing Registration Endpoints...');

    for (const endpoint of endpoints) {
        try {
            // Try POST with empty body or minimal data to see if we get 400 (Bad Request) instead of 404
            const response = await axios.post(`${baseUrl}${endpoint}`, {});
            console.log(`✅ ${endpoint}: ${response.status} (Likely exists)`);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    console.log(`❌ ${endpoint}: 404 Not Found`);
                } else {
                    console.log(`✅ ${endpoint}: ${error.response.status} (Exists! Error: ${error.response.data.message || 'Unknown'})`);
                }
            } else {
                console.log(`❓ ${endpoint}: Error ${error.message}`);
            }
        }
    }
}

testEndpoints();
