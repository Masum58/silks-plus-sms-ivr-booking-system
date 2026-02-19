const axios = require('axios');
require('dotenv').config();

async function probeEndpoints() {
    console.log('🔍 Probing TaxiCaller Order Endpoints...');

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

        const endpoints = [
            '/api/v1/booker/order',
            '/api/v1/booker/orders',
            '/api/v1/booker/order/list',
            '/api/v1/booker/job',
            '/api/v1/booker/jobs'
        ];

        for (const ep of endpoints) {
            console.log(`Testing GET ${ep}...`);
            try {
                const res = await axios.get(`${baseUrl}${ep}`, {
                    headers: { 'Authorization': bookerAuthHeader },
                    params: { company_id: companyId }
                });
                console.log(`✅ SUCCESS ${ep}: ${Array.isArray(res.data) ? res.data.length : 'Object'} items`);
            } catch (err) {
                console.log(`❌ FAILED ${ep}: ${err.response?.status || err.message}`);
            }
        }

    } catch (err) {
        console.error('Probe setup failed:', err.message);
    }
}

probeEndpoints();
