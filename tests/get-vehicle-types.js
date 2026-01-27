const axios = require('axios');
require('dotenv').config();
const taxiCallerService = require('../src/services/taxiCallerService');

async function getVehicles() {
    try {
        const authHeader = await taxiCallerService.getAuthHeader();
        const companyId = process.env.TAXICALLER_COMPANY_ID || '8296';
        const baseUrl = process.env.TAXICALLER_API_URL || 'https://api-rc.taxicaller.net';

        const res = await axios.get(`${baseUrl}/api/v1/company/${companyId}/vehicle/list`, {
            headers: { 'Authorization': authHeader }
        });

        const types = new Set();
        res.data.list.forEach(v => types.add(v.type));
        console.log('Available Vehicle Types in Vehicle List:', Array.from(types));
        console.log('Full Vehicle List:', JSON.stringify(res.data.list, null, 2));
    } catch (e) {
        console.error('Error:', e.message);
    }
}

getVehicles();
