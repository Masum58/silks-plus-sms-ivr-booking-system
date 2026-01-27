const axios = require('axios');
require('dotenv').config();
const taxiCallerService = require('../src/services/taxiCallerService');

async function getCompany() {
    try {
        const authHeader = await taxiCallerService.getAuthHeader();
        const companyId = process.env.TAXICALLER_COMPANY_ID || '8296';
        const baseUrl = process.env.TAXICALLER_API_URL || 'https://api-rc.taxicaller.net';

        const res = await axios.get(`${baseUrl}/api/v1/company/${companyId}`, {
            headers: { 'Authorization': authHeader }
        });
        console.log('Company Info:', JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.log(`❌ Failed: ${e.response?.status} ${e.response?.statusText}`);
        console.log('Error Data:', e.response?.data);
    }
}

getCompany();
