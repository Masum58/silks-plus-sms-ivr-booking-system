const axios = require('axios');
require('dotenv').config();

async function searchOrders() {
    console.log('🔍 Searching for RECENT ORDERS via AdminService/v1/order/search...');

    const companyId = process.env.TAXICALLER_COMPANY_ID;
    const apiKey = process.env.TAXICALLER_API_KEY;
    const baseUrl = process.env.TAXICALLER_API_URL || 'https://api.taxicaller.net';

    try {
        const adminJwtRes = await axios.get(`${baseUrl}/AdminService/v1/jwt/for-key`, {
            params: { key: apiKey, sub: '*', ttl: 900 }
        });
        const adminJwt = adminJwtRes.data.token || adminJwtRes.data;
        const authHeader = `Bearer ${adminJwt}`;

        // Search for orders from the last 24 hours
        const now = Math.floor(Date.now() / 1000);
        const yesterday = now - (24 * 3600);

        const payload = {
            company_id: parseInt(companyId),
            created_from: yesterday,
            created_to: now,
            limit: 50
        };

        console.log(`   Searching from ${new Date(yesterday * 1000).toLocaleString()} to ${new Date(now * 1000).toLocaleString()}...`);

        try {
            const res = await axios.post(`${baseUrl}/AdminService/v1/order/search`, payload, {
                headers: { 'Authorization': authHeader }
            });

            const list = res.data.list || res.data || [];
            console.log(`✅ Found ${list.length} orders.`);

            if (list.length > 0) {
                list.forEach(order => {
                    const o = order.order || order;
                    const state = order.state || o.state;
                    console.log('------------------------------------');
                    console.log(`Order ID: ${o.id || o.order_id}`);
                    console.log(`Status: ${state?.state || 'N/A'}`);
                    console.log(`Created: ${new Date(o.created * 1000).toLocaleString()}`);
                    console.log(`Passenger: ${o.items?.[0]?.passenger?.phone}`);
                    console.log(`Price: ${o.fare_quote?.total}`);
                    console.log(`Provider: ${o.provider_id}`);
                });
            }
        } catch (e) {
            console.log(`❌ Search Failed: ${e.response?.status} - ${e.message}`);
            if (e.response) console.log(JSON.stringify(e.response.data, null, 2));
        }

    } catch (err) {
        console.error('Setup failed:', err.message);
    }
}

searchOrders();
