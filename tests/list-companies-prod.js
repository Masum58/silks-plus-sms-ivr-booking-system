const axios = require('axios');
require('dotenv').config();
const taxiCallerService = require('../src/services/taxiCallerService');

async function listCompaniesProduction() {
    console.log('🔍 Listing Companies on Production...');
    try {
        const authHeader = await taxiCallerService.getAuthHeader();
        const res = await axios.get('https://api.taxicaller.net/api/v1/company/list', {
            headers: { 'Authorization': authHeader }
        });
        console.log('Companies:', JSON.stringify(res.data, null, 2));
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

listCompaniesProduction();
