const axios = require('axios');
require('dotenv').config();
const taxiCallerService = require('../src/services/taxiCallerService');

async function getCompanyInfo() {
    try {
        const authHeader = await taxiCallerService.getAuthHeader();
        const companyId = 8296;

        console.log(`\n--- Fetching Company Info: ${companyId} ---`);
        const res = await axios.get(`https://api-rc.taxicaller.net/api/v1/company/${companyId}`, {
            headers: { 'Authorization': authHeader }
        });
        console.log('Success:', JSON.stringify(res.data, null, 2));
    } catch (error) {
        console.error('Error:', error.response?.status, error.response?.data || error.message);
    }
}

getCompanyInfo();
