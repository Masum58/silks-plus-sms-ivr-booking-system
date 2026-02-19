const axios = require('axios');
require('dotenv').config();

async function findProviderNames() {
    console.log('🔍 Identifying Provider Names for Company 48647...');

    const companyId = process.env.TAXICALLER_COMPANY_ID;
    const apiKey = process.env.TAXICALLER_API_KEY;
    const baseUrl = process.env.TAXICALLER_API_URL || 'https://api.taxicaller.net';

    try {
        const adminJwtRes = await axios.get(`${baseUrl}/AdminService/v1/jwt/for-key`, {
            params: { key: apiKey, sub: '*', ttl: 900 }
        });
        const adminJwt = adminJwtRes.data.token || adminJwtRes.data;
        const authHeader = `Bearer ${adminJwt}`;

        // Attempt to find provider info using specific provider IDs we found earlier
        const providerIds = [74688, 78547, 72679];

        for (const pid of providerIds) {
            console.log(`\nProbing Provider ID: ${pid}...`);
            try {
                // Try AdminService v1 provider endpoint (guessing path)
                const res = await axios.get(`${baseUrl}/AdminService/v1/company/${companyId}/provider/${pid}`, {
                    headers: { 'Authorization': authHeader }
                });
                console.log(`✅ Success for ${pid}:`, JSON.stringify(res.data, null, 2));
            } catch (e) {
                console.log(`❌ Failed for ${pid}: ${e.response?.status} - ${e.message}`);
            }
        }

        // Try one more: search for providers in AdminService
        console.log(`\nProbing AdminService Company Details...`);
        try {
            const res = await axios.get(`${baseUrl}/AdminService/v1/company/${companyId}`, {
                headers: { 'Authorization': authHeader }
            });
            console.log(`✅ Success:`, JSON.stringify(res.data, null, 2));
        } catch (e) {
            console.log(`❌ Failed: ${e.response?.status} - ${e.message}`);
        }

    } catch (err) {
        console.error('Setup failed:', err.message);
    }
}

findProviderNames();
