const axios = require('axios');
require('dotenv').config();

async function findThe12DollarOrder() {
    console.log('🔍 Searching for the $12.00 Order in the WHOLE COMPANY...');

    const companyId = process.env.TAXICALLER_COMPANY_ID;
    const apiKey = process.env.TAXICALLER_API_KEY;
    const baseUrl = process.env.TAXICALLER_API_URL || 'https://api.taxicaller.net';

    try {
        const adminJwtRes = await axios.get(`${baseUrl}/AdminService/v1/jwt/for-key`, {
            params: { key: apiKey, sub: '*', ttl: 900 }
        });
        const adminJwt = adminJwtRes.data.token || adminJwtRes.data;
        const authHeader = `Bearer ${adminJwt}`;

        // Get Orders from the last 2 hours
        const now = Math.floor(Date.now() / 1000);
        const since = now - 7200;

        const payload = {
            company_id: parseInt(companyId),
            created_from: since,
            limit: 100
        };

        console.log(`   Searching since ${new Date(since * 1000).toLocaleString()}...`);

        try {
            // Using search endpoint
            const res = await axios.post(`${baseUrl}/api/v1/booker/availability/order`, {}, { // Wait, search is better
                headers: { 'Authorization': authHeader }
            });
            // Actually, let's use the AdminService list if possible
            const res2 = await axios.get(`${baseUrl}/AdminService/v1/company/${companyId}/jobs`, {
                headers: { 'Authorization': authHeader },
                params: { from: since }
            });

            console.log('✅ Success! Found jobs:', res2.data.length);
            res2.data.forEach(job => {
                console.log('---------------------------');
                console.log(`Job ID: ${job.id}`);
                console.log(`Created: ${new Date(job.created * 1000).toLocaleString()}`);
                console.log(`Phone: ${job.customer_phone}`);
                console.log(`Price: ${job.price}`);
                console.log(`Provider: ${job.provider_id}`);
                console.log(`Vehicle: ${job.vehicle_type}`);
            });
        } catch (e) {
            console.log(`❌ Failed: ${e.response?.status} - ${e.message}`);
        }

    } catch (err) {
        console.error('Setup failed:', err.message);
    }
}

findThe12DollarOrder();
