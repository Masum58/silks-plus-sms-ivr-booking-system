const axios = require('axios');
require('dotenv').config();
const taxiCallerService = require('../src/services/taxiCallerService');

async function auditRecentOrders() {
    console.log('🔍 Auditing Recent TaxiCaller Orders (No Params Mode)...');

    // Initialize service
    // await taxiCallerService.initialize();

    const companyId = process.env.TAXICALLER_COMPANY_ID;
    const baseUrl = process.env.TAXICALLER_API_URL || 'https://api.taxicaller.net';

    try {
        const token = await taxiCallerService.getAccessToken(); // Gets Admin Token internally? No, likely just refreshes.
        // wait, getAccessToken() returns a token string. Is it Admin or Booker?
        // It returns this.apiToken (the key) or a JWT? 
        // In TaxiCallerService.js, getAccessToken refreshes authorization token.
        // But let's use the raw logic to be sure about "sub".

        // Let's get "Admin" sub explicitly
        const adminJwtRes = await axios.get(`${baseUrl}/AdminService/v1/jwt/for-key`, {
            params: { key: process.env.TAXICALLER_API_KEY, sub: 'admin', ttl: 900 }
        });
        const adminToken = adminJwtRes.data.token || adminJwtRes.data;
        const authHeader = `Bearer ${adminToken}`;
        console.log('✅ Got Admin Token (sub: admin)');

        const endpoints = [
            `/AdminService/v1/company/${companyId}/jobs`,
            `/AdminService/v1/job/list`,
            `/api/v1/company/${companyId}/jobs`
        ];

        for (const ep of endpoints) {
            console.log(`\nTesting: ${ep}`);
            try {
                const res = await axios.get(`${baseUrl}${ep}`, {
                    headers: { 'Authorization': authHeader }
                });
                console.log(`✅ SUCCESS! Status: ${res.status}`);
                console.log('Data keys:', Object.keys(res.data));
            } catch (err) {
                console.log(`❌ FAILED: ${err.message}`);
                if (err.response) console.log(`   Internal: ${JSON.stringify(err.response.data)}`);
            }
        }

    } catch (error) {
        console.error('❌ Fatal Error:', error.message);
    }
}

auditRecentOrders();
