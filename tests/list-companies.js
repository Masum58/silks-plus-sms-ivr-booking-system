const axios = require('axios');
require('dotenv').config();
const taxiCallerService = require('../src/services/taxiCallerService');

async function listCompanies() {
    try {
        const authHeader = await taxiCallerService.getAuthHeader();
        console.log('🔍 Fetching Company List...');
        const response = await axios.get('https://api-rc.taxicaller.net/api/v1/company/list', {
            headers: { 'Authorization': authHeader }
        });
        console.log('Companies:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

listCompanies();
