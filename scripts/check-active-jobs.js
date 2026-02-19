const axios = require('axios');
require('dotenv').config();

async function checkActiveJobs() {
    console.log('🔍 Checking ACTIVE JOBS for company 48647...');

    const companyId = process.env.TAXICALLER_COMPANY_ID;
    const apiKey = process.env.TAXICALLER_API_KEY;
    const baseUrl = process.env.TAXICALLER_API_URL || 'https://api.taxicaller.net';

    try {
        const adminJwtRes = await axios.get(`${baseUrl}/AdminService/v1/jwt/for-key`, {
            params: { key: apiKey, sub: '*', ttl: 900 }
        });
        const adminJwt = adminJwtRes.data.token || adminJwtRes.data;
        const authHeader = `Bearer ${adminJwt}`;

        // Try AdminService v1 jobs endpoint
        console.log(`\nFetching jobs from /AdminService/v1/company/${companyId}/jobs...`);
        try {
            const res = await axios.get(`${baseUrl}/AdminService/v1/company/${companyId}/jobs`, {
                headers: { 'Authorization': authHeader }
            });
            console.log('✅ Success! Found jobs:', res.data.length);
            res.data.forEach(job => {
                console.log('---------------------------');
                console.log(`ID: ${job.id} | Created: ${new Date(job.created * 1000).toLocaleString()}`);
                console.log(`Phone: ${job.customer_phone} | Price: ${job.price} | Status: ${job.state}`);
            });
        } catch (e) {
            console.log(`❌ Failed: ${e.response?.status}`);
        }

    } catch (err) {
        console.error('Fatal Setup Error:', err.message);
    }
}

checkActiveJobs();
