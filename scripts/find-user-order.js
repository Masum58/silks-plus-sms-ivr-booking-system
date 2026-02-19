const axios = require('axios');
require('dotenv').config();

async function findUserOrder() {
    console.log('🔍 Searching for the USERs $12 ORDER...');

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

        // Phones to check
        const phones = ['+8801819365623', '+01819365623', '01819365623'];

        for (const phone of phones) {
            console.log(`\nChecking phone: ${phone}...`);
            try {
                const res = await axios.get(`${baseUrl}/api/v1/booker/order`, {
                    headers: { 'Authorization': bookerAuthHeader },
                    params: { company_id: companyId }
                });

                const list = res.data.list || res.data || [];
                const matches = list.filter(o => {
                    const orderPhone = o.order?.items?.[0]?.passenger?.phone || o.customer_phone;
                    return orderPhone === phone;
                });

                if (matches.length > 0) {
                    console.log(`✅ Found ${matches.length} matches!`);
                    matches.forEach(m => {
                        console.log('---------------------------');
                        console.log(`ID: ${m.id || m.order_id}`);
                        console.log(`State: ${m.state?.state}`);
                        console.log(`Price: ${m.order?.fare_quote?.total}`);
                        console.log(`Provider: ${m.order?.provider_id}`);
                        console.log(`Vehicle: ${m.order?.vehicle_type}`);
                    });
                } else {
                    console.log('❌ No matches in /order list');
                }
            } catch (err) {
                console.log(`❌ Failed checklist for ${phone}: ${err.message}`);
            }
        }

    } catch (err) {
        console.error('Setup failed:', err.message);
    }
}

findUserOrder();
