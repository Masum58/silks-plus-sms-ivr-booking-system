const axios = require('axios');
const path = require('path');
require('dotenv').config();

async function checkLatestLiveOrder() {
    console.log('🚀 Checking LATEST LIVE ORDERS from TaxiCaller...');

    const companyId = process.env.TAXICALLER_COMPANY_ID;
    const apiKey = process.env.TAXICALLER_API_KEY;
    const baseUrl = process.env.TAXICALLER_API_URL || 'https://api.taxicaller.net';

    try {
        // 1. Get Admin JWT (Correct way based on app logic)
        console.log('   Authenticating...');
        const adminJwtRes = await axios.get(`${baseUrl}/AdminService/v1/jwt/for-key`, {
            params: { key: apiKey, sub: '*', ttl: 900 }
        });
        const adminJwt = adminJwtRes.data.token || adminJwtRes.data;
        const authHeader = `Bearer ${adminJwt}`;

        // 2. Get Booker Token
        const creds = { creds: { company_id: parseInt(companyId), ops: 3 } };
        const tokenRes = await axios.get(`${baseUrl}/api/v1/booker/booker-token`, {
            headers: { 'Authorization': authHeader },
            params: { data: JSON.stringify(creds) }
        });
        const bookerToken = tokenRes.data.token || tokenRes.data.jwt || tokenRes.data;
        const bookerAuthHeader = `Bearer ${bookerToken}`;

        // 3. Get Orders (Try /api/v1/booker/order)
        console.log('   Fetching orders...');
        const response = await axios.get(`${baseUrl}/api/v1/booker/order`, {
            headers: { 'Authorization': bookerAuthHeader },
            params: { company_id: companyId }
        });

        const list = response.data.list || response.data || [];
        console.log(`✅ Found ${list.length} orders.`);

        if (list.length > 0) {
            // Sort by created time descending
            const sorted = list.sort((a, b) => b.created - a.created);

            console.log('\n--- TOP 5 RECENT ORDERS ---');
            sorted.slice(0, 5).forEach(order => {
                const o = order.order || order;
                const state = order.state || o.state;
                console.log(`ID: ${o.id || o.order_id}`);
                console.log(`  State: ${state?.state}`);
                console.log(`  Created: ${new Date(o.created * 1000).toLocaleString()}`);
                console.log(`  Phone: ${o.items?.[0]?.passenger?.phone}`);
                console.log(`  Pickup: ${o.route?.nodes?.[0]?.location?.name}`);
                console.log(`  Price: ${o.fare_quote?.total ? (o.fare_quote.total / 1000).toFixed(2) : 'N/A'}`);
                console.log(`  Provider ID: ${o.provider_id}`);
                console.log(`  Vehicle Type: ${o.vehicle_type}`);
                console.log('---------------------------');
            });
        }
    } catch (error) {
        console.error('❌ Audit Failed:', error.message);
        if (error.response) {
            console.error('   Details:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

checkLatestLiveOrder();
