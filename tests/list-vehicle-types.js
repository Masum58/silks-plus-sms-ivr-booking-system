const axios = require('axios');
require('dotenv').config();
const taxiCallerService = require('../src/services/taxiCallerService');

async function listVehicleTypes() {
    try {
        const authHeader = await taxiCallerService.getAuthHeader();
        const companyId = process.env.TAXICALLER_COMPANY_ID || 8296;

        console.log(`🔍 Fetching Vehicle Types for Company ID: ${companyId}`);
        const response = await axios.get(`https://api-rc.taxicaller.net/api/v1/company/${companyId}/vehicle/type/list`, {
            headers: { 'Authorization': authHeader }
        });

        console.log('Vehicle Types:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

listVehicleTypes();
