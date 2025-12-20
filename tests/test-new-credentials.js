const axios = require('axios');

// New correct credentials from client
const baseUrl = 'https://api.swiflymessenger.com';
const customerId = '_eWVj1wYoPkoBOlb-e5uh';
const clientId = '8afc120586c98b88dc92eb8cef242ad1';
const clientSecret = '922e9c54608b217a8d02f70fd9318b45';

async function testAuthentication() {
    console.log('🔐 Testing Authentication with NEW credentials...');
    console.log('Base URL:', baseUrl);
    console.log('Customer ID:', customerId);
    console.log('Client ID:', clientId);
    console.log('---\n');

    try {
        const response = await axios.post(`${baseUrl}/api/v1/customer/auth/access-token`, {
            clientId: clientId,
            clientSecret: clientSecret
        }, {
            headers: {
                'Accept-Language': 'en',
                'Content-Type': 'application/json'
            }
        });

        console.log('✅✅✅ SUCCESS! Authentication worked!');
        console.log('\nFull Response:');
        console.log(JSON.stringify(response.data, null, 2));

        if (response.data && response.data.data) {
            console.log('\n📋 Token Details:');
            console.log('Access Token:', response.data.data.accessToken?.substring(0, 30) + '...');
            console.log('Customer ID:', response.data.data.customerId);
            console.log('Expires In:', response.data.data.expiresIn, 'seconds');

            console.log('\n✅ Ready to update .env file!');
        }
    } catch (error) {
        console.log('❌ Authentication FAILED');
        console.log('Status:', error.response ? error.response.status : 'No response');
        console.log('Error:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

testAuthentication();
