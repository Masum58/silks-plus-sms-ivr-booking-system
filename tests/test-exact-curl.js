const axios = require('axios');

// Test with different possible base URLs
const possibleBaseUrls = [
    'https://api.swiflymessenger.com',
    'https://swiflymessenger.com',
    'https://api.onro.com',
    'https://onro.com',
    'https://rest.swiflymessenger.com',
    'https://rest.onro.com'
];

const clientId = '6abe75e935fbe5572b25192d5fe93bdc';
const clientSecret = 'ff6bcf08949db5aed3d2b769c9a6e877';

async function testWithUrl(baseUrl) {
    try {
        console.log(`\n🔍 Testing: ${baseUrl}`);

        const response = await axios.post(`${baseUrl}/api/v1/customer/auth/access-token`, {
            clientId: clientId,
            clientSecret: clientSecret
        }, {
            headers: {
                'Accept-Language': 'en',
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ SUCCESS!');
        console.log('Response:', JSON.stringify(response.data, null, 2));
        return true;
    } catch (error) {
        const status = error.response ? error.response.status : 'No response';
        const message = error.response ? error.response.data : error.message;
        console.log(`❌ Failed with status: ${status}`);
        if (error.response && error.response.data) {
            console.log('Error:', JSON.stringify(error.response.data, null, 2));
        }
        return false;
    }
}

async function testAll() {
    console.log('Testing authentication with client-provided credentials...');
    console.log('Client ID:', clientId);
    console.log('Client Secret:', clientSecret);

    for (const url of possibleBaseUrls) {
        const success = await testWithUrl(url);
        if (success) {
            console.log(`\n✅✅✅ FOUND WORKING URL: ${url}`);
            console.log(`Update your .env file with: ONRO_API_URL=${url}`);
            return;
        }
    }

    console.log('\n❌ None of the URLs worked. Please ask client for the correct base URL (the {{rest}} variable value)');
}

testAll();
