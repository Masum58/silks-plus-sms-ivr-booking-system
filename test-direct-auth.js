const axios = require('axios');
require('dotenv').config();

const baseUrl = process.env.ONRO_API_URL;
const clientId = process.env.ONRO_CLIENT_ID;
const clientSecret = process.env.ONRO_CLIENT_SECRET;

async function testDirectAuth() {
    console.log('Testing Onro Authentication...');
    console.log('Base URL:', baseUrl);
    console.log('Client ID:', clientId ? `${clientId.substring(0, 10)}...` : 'NOT SET');
    console.log('Client Secret:', clientSecret ? `${clientSecret.substring(0, 10)}...` : 'NOT SET');
    console.log('---');

    try {
        const endpoint = '/api/v1/customer/auth/access-token';
        console.log(`Testing endpoint: ${endpoint}`);

        const response = await axios.post(`${baseUrl}${endpoint}`, {
            clientId: clientId,
            clientSecret: clientSecret
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Accept-Language': 'en'
            }
        });

        console.log('✅ SUCCESS!');
        console.log('Response:', JSON.stringify(response.data, null, 2));

        if (response.data && response.data.data && response.data.data.accessToken) {
            console.log('\n✅ Access Token received:', response.data.data.accessToken.substring(0, 20) + '...');
            console.log('✅ Customer ID:', response.data.data.customerId);
            console.log('✅ Expires In:', response.data.data.expiresIn, 'seconds');
        }
    } catch (error) {
        console.log('❌ FAILED!');
        console.log('Status:', error.response ? error.response.status : 'No response');
        console.log('Error:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);

        if (error.response && error.response.status === 403) {
            console.log('\n⚠️  403 Forbidden - This usually means:');
            console.log('   1. Invalid Client ID or Client Secret');
            console.log('   2. Credentials do not have proper permissions');
            console.log('   3. API key is disabled or expired');
            console.log('\n💡 Please verify your ONRO_CLIENT_ID and ONRO_CLIENT_SECRET in .env file');
        }
    }
}

testDirectAuth();
