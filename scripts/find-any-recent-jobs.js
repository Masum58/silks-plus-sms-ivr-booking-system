const axios = require('axios');
require('dotenv').config();

async function findAnyRecentJobs() {
    console.log('🔍 Searching for ANY RECENT JOBS for company 48647...');

    const companyId = process.env.TAXICALLER_COMPANY_ID;
    const apiKey = process.env.TAXICALLER_API_KEY;
    const baseUrl = process.env.TAXICALLER_API_URL || 'https://api.taxicaller.net';

    try {
        const adminJwtRes = await axios.get(`${baseUrl}/AdminService/v1/jwt/for-key`, {
            params: { key: apiKey, sub: '*', ttl: 900 }
        });
        const adminJwt = adminJwtRes.data.token || adminJwtRes.data;
        const authHeader = `Bearer ${adminJwt}`;

        // 1. Try AdminService Company Jobs (Common endpoint in TC)
        console.log(`\nProbing AdminService Company Jobs...`);
        try {
            const res = await axios.get(`${baseUrl}/AdminService/v1/order/list`, {
                headers: { 'Authorization': authHeader },
                params: {
                    company_id: companyId,
                    limit: 20
                }
            });
            console.log('✅ Success! Found orders:', res.data.length);
            res.data.forEach(m => {
                const o = m.order || m;
                console.log(`- ID: ${o.id || o.order_id} | Created: ${new Date(o.created * 1000).toLocaleString()} | Phone: ${o.items?.[0]?.passenger?.phone}`);
            });
        } catch (e) {
            console.log(`❌ Failed /order/list: ${e.response?.status}`);
        }

        // 2. Try simple search with wildcard phone if possible, or just list
        console.log(`\nProbing Booker Order List...`);
        try {
            const creds = { creds: { company_id: parseInt(companyId), ops: 3 } };
            const tokenRes = await axios.get(`${baseUrl}/api/v1/booker/booker-token`, {
                headers: { 'Authorization': authHeader },
                params: { data: JSON.stringify(creds) }
            });
            const bookerToken = tokenRes.data.token || tokenRes.data.jwt || tokenRes.data;
            const bookerAuthHeader = `Bearer ${bookerToken}`;

            const res = await axios.get(`${baseUrl}/api/v1/booker/order`, {
                headers: { 'Authorization': bookerAuthHeader },
                params: { limit: 20 }
            });
            console.log('✅ Success! Found booker orders:', res.data.list?.length || res.data.length);
        } catch (e) {
            console.log(`❌ Failed /booker/order: ${e.response?.status}`);
        }

    } catch (err) {
        console.error('Fatal Setup Error:', err.message);
    }
}

findAnyRecentJobs();
