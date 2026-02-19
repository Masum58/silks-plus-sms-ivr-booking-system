const axios = require('axios');
require('dotenv').config();

async function findByExternalId(externalId) {
    console.log(`🔍 Searching for order with External ID: ${externalId}...`);

    const companyId = process.env.TAXICALLER_COMPANY_ID;
    const apiKey = process.env.TAXICALLER_API_KEY;
    const baseUrl = process.env.TAXICALLER_API_URL || 'https://api.taxicaller.net';

    try {
        const adminJwtRes = await axios.get(`${baseUrl}/AdminService/v1/jwt/for-key`, {
            params: { key: apiKey, sub: '*', ttl: 900 }
        });
        const adminJwt = adminJwtRes.data.token || adminJwtRes.data;
        const authHeader = `Bearer ${adminJwt}`;

        // Try AdminService search by external_id
        console.log(`\nProbing AdminService Order Search for external_id...`);
        try {
            const res = await axios.get(`${baseUrl}/AdminService/v1/order/search`, {
                headers: { 'Authorization': authHeader },
                params: {
                    company_id: companyId,
                    search: externalId
                }
            });
            console.log('✅ Found orders:', res.data.length);
            res.data.forEach(o => {
                console.log(`- ID: ${o.id} | Created: ${new Date(o.created * 1000).toLocaleString()} | Status: ${o.state} | Provider: ${o.provider_id} | Phone: ${o.items?.[0]?.passenger?.phone}`);
            });
        } catch (e) {
            console.log(`❌ Admin Search Failed: ${e.response?.status} - ${JSON.stringify(e.response?.data)}`);
        }

    } catch (err) {
        console.error('Fatal Setup Error:', err.message);
    }
}

findByExternalId("5egve");
findByExternalId("5a8mt"); // My previous one
