const axios = require('axios');
require('dotenv').config();

async function findWrongCompanyJob() {
    console.log('🔍 Searching for job in WRONG Company 8296...');

    // Override company ID for this check
    const companyId = 8296;
    const apiKey = process.env.TAXICALLER_API_KEY;
    const baseUrl = process.env.TAXICALLER_API_URL || 'https://api.taxicaller.net';

    try {
        const adminJwtRes = await axios.get(`${baseUrl}/AdminService/v1/jwt/for-key`, {
            params: { key: apiKey, sub: '*', ttl: 900 }
        });
        const adminJwt = adminJwtRes.data.token || adminJwtRes.data;
        const authHeader = `Bearer ${adminJwt}`;

        console.log(`\nProbing AdminService Company Jobs for Co: ${companyId}...`);
        try {
            const res = await axios.get(`${baseUrl}/AdminService/v1/company/${companyId}/jobs`, {
                headers: { 'Authorization': authHeader },
                params: { limit: 10 }
            });
            console.log('✅ Success! Found jobs:', res.data.length);
            res.data.forEach(job => {
                console.log(`- ID: ${job.id} | Created: ${new Date(job.created * 1000).toLocaleString()} | Phone: ${job.customer_phone}`);
            });
        } catch (e) {
            console.log(`❌ Failed: ${e.response?.status} - ${e.response?.data?.message || e.message}`);
        }

    } catch (err) {
        console.error('Fatal Setup Error:', err.message);
    }
}

findWrongCompanyJob();
