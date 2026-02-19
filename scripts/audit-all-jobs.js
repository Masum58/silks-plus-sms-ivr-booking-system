const axios = require('axios');
require('dotenv').config();

async function auditJobs() {
    console.log('🔍 Auditing ALL JOBS for company 48647...');

    const companyId = process.env.TAXICALLER_COMPANY_ID;
    const apiKey = process.env.TAXICALLER_API_KEY;
    const baseUrl = process.env.TAXICALLER_API_URL || 'https://api.taxicaller.net';

    try {
        const adminJwtRes = await axios.get(`${baseUrl}/AdminService/v1/jwt/for-key`, {
            params: { key: apiKey, sub: '*', ttl: 900 }
        });
        const adminJwt = adminJwtRes.data.token || adminJwtRes.data;
        const authHeader = `Bearer ${adminJwt}`;

        // Try AdminService v1 job list
        const endpoints = [
            `/AdminService/v1/company/${companyId}/jobs`,
            `/AdminService/v1/job/list`,
            `/AdminService/v1/order/list`
        ];

        for (const endpoint of endpoints) {
            console.log(`\nProbing ${endpoint}...`);
            try {
                const res = await axios.get(`${baseUrl}${endpoint}`, {
                    headers: { 'Authorization': authHeader },
                    params: { company_id: companyId, limit: 10 }
                });
                console.log(`✅ Success! Found ${res.data.length || 0} items.`);
                const items = Array.isArray(res.data) ? res.data : (res.data.list || []);
                items.forEach(item => {
                    const o = item.order || item;
                    const phone = o.items?.[0]?.passenger?.phone || o.customer_phone || 'N/A';
                    const id = o.id || o.order_id || o.job_id;
                    const created = o.created ? new Date(o.created * 1000).toLocaleString() : 'N/A';
                    console.log(`- ID: ${id} | Created: ${created} | Phone: ${phone} | Price: ${o.price?.total || o.price || 'N/A'}`);
                });
            } catch (e) {
                console.log(`❌ Failed: ${e.response?.status} - ${e.message}`);
            }
        }

    } catch (err) {
        console.error('Fatal Setup Error:', err.message);
    }
}

auditJobs();
