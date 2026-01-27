const axios = require('axios');
require('dotenv').config();
const taxiCallerService = require('../src/services/taxiCallerService');

async function checkProductionAccount() {
    console.log('🔍 Checking TaxiCaller Production Account...');

    // Temporarily override the baseURL to production
    const productionUrl = 'https://api.taxicaller.net';

    try {
        const authHeader = await taxiCallerService.getAuthHeader();
        console.log('✅ Auth Header acquired');

        // Try to get company info or vehicle list from production
        const companyId = process.env.TAXICALLER_COMPANY_ID;
        console.log(`📡 Fetching vehicle list for Company ID: ${companyId} at ${productionUrl}`);

        const res = await axios.get(`${productionUrl}/api/v1/company/${companyId}/vehicle/list`, {
            headers: { 'Authorization': authHeader }
        });

        console.log('✅ Success! Vehicles found:', JSON.stringify(res.data, null, 2));
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

checkProductionAccount();
