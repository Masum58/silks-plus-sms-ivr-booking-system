const axios = require('axios');
require('dotenv').config();

async function checkCompanyOrders() {
    console.log('🔍 Checking LIVE COMPANY ORDERS...');

    const companyId = process.env.TAXICALLER_COMPANY_ID;
    const apiKey = process.env.TAXICALLER_API_KEY;
    const baseUrl = process.env.TAXICALLER_API_URL || 'https://api.taxicaller.net';

    try {
        // 1. Get Admin JWT
        const adminJwtRes = await axios.get(`${baseUrl}/AdminService/v1/jwt/for-key`, {
            params: { key: apiKey, sub: '*', ttl: 900 }
        });
        const adminJwt = adminJwtRes.data.token || adminJwtRes.data;
        const authHeader = `Bearer ${adminJwt}`;

        // 2. Get Order List
        console.log(`   Fetching orders for company ${companyId}...`);
        const response = await axios.get(`${baseUrl}/api/v1/company/${companyId}/order/list`, {
            headers: { 'Authorization': authHeader }
        });

        const list = response.data.list || response.data || [];
        console.log(`✅ Found ${list.length} orders.`);

        if (list.length > 0) {
            // Take the last 10
            list.slice(0, 10).forEach(order => {
                const o = order.order || order;
                const state = order.state || o.state;
                console.log('------------------------------------');
                console.log(`Order ID: ${o.id || o.order_id}`);
                console.log(`Status: ${state?.state || 'N/A'}`);
                console.log(`Created: ${new Date(o.created * 1000).toLocaleString()}`);
                console.log(`Pickup: ${o.route?.nodes?.[0]?.location?.name}`);
                console.log(`Price: ${o.fare_quote?.total ? (o.fare_quote.total / 1000).toFixed(2) : 'N/A'}`);
                console.log(`Provider ID: ${o.provider_id}`);
                console.log(`Vehicle Type: ${o.vehicle_type}`);
                console.log(`Passenger: ${o.items?.[0]?.passenger?.phone}`);
            });
        }
    } catch (error) {
        console.error('❌ Failed:', error.message);
        if (error.response) console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    }
}

checkCompanyOrders();
