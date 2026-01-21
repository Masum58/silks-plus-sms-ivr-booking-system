const axios = require('axios');
require('dotenv').config();

const taxiCallerService = require('../src/services/taxiCallerService');

async function debugTaxiCallerSettings() {
    console.log('🔍 Debugging TaxiCaller Settings for Company ID: 8296');

    try {
        const authHeader = await taxiCallerService.getAuthHeader();
        const companyId = 8296;

        // 1. Get Vehicle List
        console.log('\n--- Fetching Vehicle List ---');
        const vehicleRes = await axios.get(`https://api-rc.taxicaller.net/api/v1/company/${companyId}/vehicle/list`, {
            headers: { 'Authorization': authHeader }
        });
        console.log('Vehicles Found:', JSON.stringify(vehicleRes.data, null, 2));

        // 2. Get Job List (to see if any active jobs exist)
        console.log('\n--- Fetching Active Jobs ---');
        const jobsRes = await axios.get(`https://api-rc.taxicaller.net/api/v1/company/${companyId}/job/list`, {
            headers: { 'Authorization': authHeader }
        });
        console.log('Active Jobs:', JSON.stringify(jobsRes.data, null, 2));

    } catch (error) {
        console.error('❌ Error debugging:', error.response?.data || error.message);
    }
}

debugTaxiCallerSettings();
