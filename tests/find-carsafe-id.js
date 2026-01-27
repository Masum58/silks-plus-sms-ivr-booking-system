const axios = require('axios');
require('dotenv').config();

async function findCarSafeId() {
    console.log('🔍 Searching for "CarSafe" Company ID on Production...');

    const apiKey = process.env.TAXICALLER_API_KEY;
    const apiUrl = 'https://api.taxicaller.net';

    if (!apiKey) {
        console.error('❌ Error: TAXICALLER_API_KEY is missing in .env');
        return;
    }

    try {
        // 1. Get JWT Token
        console.log('🔄 Fetching JWT Token...');
        const authRes = await axios.get(`${apiUrl}/AdminService/v1/jwt/for-key`, {
            params: {
                key: apiKey,
                ttl: 3600,
                sub: 'carsa-b' // Your main account ID from the screenshot
            }
        });
        const token = authRes.data.data;
        const authHeader = `Bearer ${token}`;

        // 2. List Companies
        console.log('📡 Fetching Company List...');
        const compRes = await axios.get(`${apiUrl}/api/v1/company/list`, {
            headers: { 'Authorization': authHeader }
        });

        console.log('\n✅ Found Companies:');
        compRes.data.list.forEach(c => {
            console.log(`- Name: ${c.name} | ID: ${c.id} | Slug: ${c.slug}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        if (error.response?.status === 401) {
            console.log('💡 Tip: Please double check your API Key in .env');
        }
    }
}

findCarSafeId();
