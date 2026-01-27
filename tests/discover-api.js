const axios = require('axios');
require('dotenv').config();
const taxiCallerService = require('../src/services/taxiCallerService');

async function discover() {
    console.log('🔍 Discovering TaxiCaller Resources...');
    try {
        const authHeader = await taxiCallerService.getAuthHeader();
        const companyId = process.env.TAXICALLER_COMPANY_ID || '8296';
        const baseUrl = process.env.TAXICALLER_API_URL || 'https://api-rc.taxicaller.net';

        const endpoints = [
            `/api/v1/company/${companyId}/vehicle/list`,
            `/api/v1/company/${companyId}/vehicle-type/list`,
            `/api/v1/company/${companyId}/tariff/list`,
            `/api/v1/company/${companyId}/zone/list`
        ];

        for (const endpoint of endpoints) {
            console.log(`📡 Testing: ${endpoint}`);
            try {
                const res = await axios.get(`${baseUrl}${endpoint}`, {
                    headers: { 'Authorization': authHeader }
                });
                console.log(`✅ Success [${endpoint}]:`, JSON.stringify(res.data, null, 2).substring(0, 500) + '...');
            } catch (e) {
                console.log(`❌ Failed [${endpoint}]: ${e.response?.status} ${e.response?.statusText}`);
            }
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

discover();
