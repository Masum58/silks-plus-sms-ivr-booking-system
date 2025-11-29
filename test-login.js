const axios = require('axios');
require('dotenv').config();

async function testLogin() {
    console.log('Testing Login endpoint...');
    console.log('Base URL:', process.env.ONRO_API_URL);

    // From the screenshot, the Login endpoint is /api/v1/customer/business/auth/login
    const payload = {
        username: "test_b",
        password: "123123"
    };

    console.log('\nSending POST to /api/v1/customer/business/auth/login');
    console.log('Payload:', JSON.stringify(payload, null, 2));

    try {
        const response = await axios.post(
            `${process.env.ONRO_API_URL}/api/v1/customer/business/auth/login`,
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

testLogin();
