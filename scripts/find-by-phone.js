const axios = require('axios');
require('dotenv').config();

async function findOrderByPhone(phone) {
    console.log(`🔍 Searching for orders with phone: ${phone}...`);

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
        const bookerToken = tokenRes.data.token || tokenRes.data.jwt || tokenRes.data || tokenRes.data.token;
        const bookerAuthHeader = `Bearer ${bookerToken}`;

        // Search via AdminService v1 order search
        console.log(`\nProbing AdminService Order Search...`);
        try {
            const res = await axios.get(`${baseUrl}/AdminService/v1/order/search`, {
                headers: { 'Authorization': authHeader },
                params: {
                    company_id: companyId,
                    search: phone
                }
            });
            console.log('✅ Found orders:', res.data.length);
            res.data.forEach(o => {
                console.log(`- ID: ${o.id} | Created: ${new Date(o.created * 1000).toLocaleString()} | Status: ${o.state} | Provider: ${o.provider_id}`);
            });
        } catch (e) {
            console.log(`❌ Admin Search Failed: ${e.response?.status} - ${JSON.stringify(e.response?.data)}`);
        }

        // Search via Booker List
        console.log(`\nProbing Booker Order List with filter...`);
        try {
            const res = await axios.get(`${baseUrl}/api/v1/booker/order`, {
                headers: { 'Authorization': bookerAuthHeader }
            });
            const list = res.data.list || res.data;
            const matches = list.filter(o => JSON.stringify(o).includes(phone.replace('+', '')));
            console.log('✅ Found matches in Booker list:', matches.length);
            matches.forEach(o => {
                console.log(`- ID: ${o.order_id || o.id} | State: ${o.state?.state || o.state} | Created: ${o.created}`);
            });
        } catch (e) {
            console.log(`❌ Booker List Failed: ${e.response?.status}`);
        }

    } catch (err) {
        console.error('Fatal Setup Error:', err.message);
    }
}

// Try multiple formats
const targetPhone = "18456371211";
findOrderByPhone(targetPhone);
findOrderByPhone("+1" + targetPhone);
