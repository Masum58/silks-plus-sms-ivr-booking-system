require('dotenv').config();
const taxiCallerService = require('../src/services/taxiCallerService');
const axios = require('axios');

async function getCompanyInfo(companyId) {
    console.log(`🔍 Fetching Info for Company ID: ${companyId}...`);
    const baseUrl = process.env.TAXICALLER_API_URL || 'https://api-rc.taxicaller.net';

    try {
        const token = await taxiCallerService.getAccessToken();

        console.log(`\nTesting GET /api/v1/company/${companyId}/vehicle-type/list...`);
        try {
            const res = await axios.get(`${baseUrl}/api/v1/company/${companyId}/vehicle-type/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('✅ SUCCESS! Found vehicle types:');
            console.log(JSON.stringify(res.data, null, 2));
        } catch (e) {
            console.log(`❌ Failed: ${e.response?.status} - ${JSON.stringify(e.response?.data)}`);
        }

    } catch (err) {
        console.error('Fatal Error:', err.message);
    }
}

const targetId = process.argv[2] || '46261';
getCompanyInfo(targetId);
