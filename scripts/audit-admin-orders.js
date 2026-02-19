const axios = require('axios');
require('dotenv').config();

async function auditAdminOrders() {
    console.log('🔍 Auditing TaxiCaller Orders via AdminService...');

    const companyId = process.env.TAXICALLER_COMPANY_ID;
    const apiKey = process.env.TAXICALLER_API_KEY;
    const baseUrl = process.env.TAXICALLER_API_URL || 'https://api.taxicaller.net';

    try {
        // 1. Get Admin JWT
        console.log('   Getting Admin JWT...');
        const adminJwtRes = await axios.get(`${baseUrl}/AdminService/v1/jwt/for-key`, {
            params: {
                key: apiKey,
                sub: '*',
                ttl: 900
            }
        });

        const adminJwt = adminJwtRes.data.token || adminJwtRes.data;
        const authHeader = `Bearer ${adminJwt}`;

        // 2. Get Recent Orders via AdminService
        console.log('   Fetching recent orders via /AdminService/v1/order/list...');
        const response = await axios.get(`${baseUrl}/AdminService/v1/order/list`, {
            headers: { 'Authorization': authHeader },
            params: {
                company_id: companyId,
                offset: 0,
                limit: 20
            }
        });

        const list = response.data.list || response.data || [];
        console.log(`✅ Found ${list.length} orders.`);

        if (list.length > 0) {
            list.forEach(order => {
                console.log('------------------------------------');
                console.log(`Order ID: ${order.id}`);
                console.log(`Status: ${order.state?.state || 'N/A'}`);
                console.log(`Created: ${new Date(order.created * 1000).toLocaleString()}`);
                console.log(`Pickup: ${order.route?.nodes?.[0]?.location?.name}`);
                console.log(`Dropoff: ${order.route?.nodes?.[1]?.location?.name}`);
                console.log(`Provider ID: ${order.provider_id}`);
                console.log(`Vehicle Type: ${order.vehicle_type}`);
                console.log(`Passenger: ${order.items?.[0]?.passenger?.name} (${order.items?.[0]?.passenger?.phone})`);
                console.log(`Dispatch Options: ${JSON.stringify(order.dispatch_options)}`);
                console.log(`Booked By: ${order.booked_by || 'Unknown'}`);
            });
        }
    } catch (error) {
        console.error('❌ Audit Failed:', error.message);
        if (error.response) {
            console.error('   Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

auditAdminOrders();
