const axios = require('axios');
require('dotenv').config();

async function auditWorkingOrder() {
    console.log('🔍 Auditing the WORKING ORDER 671561984e2203eb...');

    const companyId = process.env.TAXICALLER_COMPANY_ID;
    const apiKey = process.env.TAXICALLER_API_KEY;
    const baseUrl = process.env.TAXICALLER_API_URL || 'https://api.taxicaller.net';

    try {
        const adminJwtRes = await axios.get(`${baseUrl}/AdminService/v1/jwt/for-key`, {
            params: { key: apiKey, sub: '*', ttl: 900 }
        });
        const adminJwt = adminJwtRes.data.token || adminJwtRes.data;
        const authHeader = `Bearer ${adminJwt}`;

        const creds = { creds: { company_id: parseInt(companyId), ops: 3 } };
        const tokenRes = await axios.get(`${baseUrl}/api/v1/booker/booker-token`, {
            headers: { 'Authorization': authHeader },
            params: { data: JSON.stringify(creds) }
        });
        const bookerToken = tokenRes.data.token || tokenRes.data.jwt || tokenRes.data;
        const bookerAuthHeader = `Bearer ${bookerToken}`;

        const orderId = '671561984e2203eb';
        console.log(`   Fetching details for ${orderId}...`);

        try {
            const res = await axios.get(`${baseUrl}/api/v1/booker/order/${orderId}`, {
                headers: { 'Authorization': bookerAuthHeader }
            });

            console.log('✅ Status Retrieved:');
            console.log(JSON.stringify(res.data, null, 2));
        } catch (e) {
            console.log(`❌ Failed: ${e.response?.status} - ${e.message}`);
        }

    } catch (err) {
        console.error('Setup failed:', err.message);
    }
}

auditWorkingOrder();
