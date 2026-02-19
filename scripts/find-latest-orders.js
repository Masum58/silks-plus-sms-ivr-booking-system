const axios = require('axios');
require('dotenv').config();

async function findLatestOrders() {
    console.log('🔍 Fetching the 5 NEWEST ORDERS for company 48647...');

    const companyId = process.env.TAXICALLER_COMPANY_ID;
    const apiKey = process.env.TAXICALLER_API_KEY;
    const baseUrl = process.env.TAXICALLER_API_URL || 'https://api.taxicaller.net';

    try {
        const adminJwtRes = await axios.get(`${baseUrl}/AdminService/v1/jwt/for-key`, {
            params: { key: apiKey, sub: '*', ttl: 900 }
        });
        const adminJwt = adminJwtRes.data.token || adminJwtRes.data;
        const authHeader = `Bearer ${adminJwt}`;

        // Get Booker Token
        const creds = { creds: { company_id: parseInt(companyId), ops: 3 } };
        const tokenRes = await axios.get(`${baseUrl}/api/v1/booker/booker-token`, {
            headers: { 'Authorization': authHeader },
            params: { data: JSON.stringify(creds) }
        });
        const bookerToken = tokenRes.data.token || tokenRes.data.jwt || tokenRes.data;
        const bookerAuthHeader = `Bearer ${bookerToken}`;

        console.log('   Querying /api/v1/booker/order...');
        const res = await axios.get(`${baseUrl}/api/v1/booker/order`, {
            headers: { 'Authorization': bookerAuthHeader },
            params: { limit: 20 }
        });

        const list = res.data.list || res.data || [];
        console.log(`✅ Found ${list.length} orders in recent history.`);

        // Sort by creation time descending
        list.sort((a, b) => (b.order?.created || 0) - (a.order?.created || 0));

        list.slice(0, 5).forEach(m => {
            const o = m.order || m;
            console.log('---------------------------');
            console.log(`ID: ${o.id || o.order_id}`);
            console.log(`Created: ${new Date(o.created * 1000).toLocaleString()}`);
            console.log(`Phone: ${o.items?.[0]?.passenger?.phone}`);
            console.log(`Price: ${o.fare_quote?.total}`);
            console.log(`Status: ${m.state?.state}`);
        });

    } catch (err) {
        console.error('Failed:', err.message);
        if (err.response) console.log(JSON.stringify(err.response.data, null, 2));
    }
}

findLatestOrders();
