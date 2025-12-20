const axios = require('axios');
require('dotenv').config();

async function testTokenExchange() {
    console.log('Testing Token Exchange with credentials:');
    console.log('Base URL:', process.env.ONRO_API_URL);
    console.log('Client ID:', process.env.ONRO_CLIENT_ID);
    console.log('Client Secret:', process.env.ONRO_CLIENT_SECRET ? '***' + process.env.ONRO_CLIENT_SECRET.slice(-4) : 'NOT SET');

    const payload = {
        clientId: process.env.ONRO_CLIENT_ID,
        clientSecret: process.env.ONRO_CLIENT_SECRET
    };

    console.log('\nSending POST to /api/v1/customer/auth/access-token');
    console.log('Payload:', JSON.stringify(payload, null, 2));

    try {
        const response = await axios.post(
            `${process.env.ONRO_API_URL}/api/v1/customer/auth/access-token`,
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Accept-Language': 'en'
                }
            }
        );

        console.log('\n✅ SUCCESS!');
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log('\n❌ FAILED!');
        console.log('Status:', error.response?.status);
        console.log('Error:', JSON.stringify(error.response?.data, null, 2));
    }
}

testTokenExchange();
