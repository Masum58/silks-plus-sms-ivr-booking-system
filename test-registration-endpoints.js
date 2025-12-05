const axios = require('axios');
const config = require('./src/config/config');
require('dotenv').config();

const client = axios.create({
    baseURL: process.env.ONRO_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    validateStatus: () => true // Don't throw on error
});

async function testEndpoints() {
    console.log('🔍 Testing Registration Endpoints...');

    const payload = {
        firstName: "Test",
        lastName: "User",
        phone: "+15550001111",
        email: "testuser1111@example.com",
        password: "Password123!"
    };

    const endpoints = [
        '/api/v1/customer/auth/register',
        '/api/v1/auth/register',
        '/api/v1/register',
        '/api/v1/customers',
        '/api/v1/customer/customers',
        '/api/v1/business/customers',
        '/api/v1/admin/customers',
        '/api/v1/dispatcher/customers'
    ];

    for (const endpoint of endpoints) {
        try {
            console.log(`\nTesting POST ${endpoint}...`);
            const response = await client.post(endpoint, payload);
            console.log(`   Status: ${response.status} ${response.statusText}`);
            if (response.status !== 404) {
                console.log(`   Response:`, JSON.stringify(response.data).substring(0, 100));
            }
        } catch (error) {
            console.log(`   Error: ${error.message}`);
        }
    }
}

testEndpoints();
