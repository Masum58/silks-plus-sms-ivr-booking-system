require('dotenv').config();
const taxiCallerService = require('../src/services/taxiCallerService');
const axios = require('axios');

async function listCompanies() {
    console.log('🔍 Fetching Companies for the API Key...');
    const baseUrl = process.env.TAXICALLER_API_URL || 'https://api-rc.taxicaller.net';

    try {
        const token = await taxiCallerService.getAccessToken();

        // Try AdminService v1 company list
        console.log(`\nTesting GET /AdminService/v1/company/list...`);
        try {
            const res = await axios.get(`${baseUrl}/AdminService/v1/company/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('✅ Found Companies:');
            console.log(JSON.stringify(res.data, null, 2));
        } catch (e) {
            console.log(`❌ AdminService list failed: ${e.response?.status} - ${JSON.stringify(e.response?.data)}`);
        }

    } catch (err) {
        console.error('Fatal Error:', err.message);
    }
}

listCompanies();
