const axios = require('axios');
require('dotenv').config();

async function checkActiveJobs8296() {
    console.log('🔍 Checking ACTIVE JOBS for WRONG company 8296...');

    const companyId = 8296;
    const apiKey = process.env.TAXICALLER_API_KEY; // Might be invalid for 8296 if key is company-specific
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
                const date = new Date(job.created * 1000).toLocaleString();
                console.log(`- ID: ${job.id} | Created: ${date} | Phone: ${job.customer_phone}`);
            });
        } catch (e) {
            console.log(`❌ Failed: ${e.response?.status} - ${JSON.stringify(e.response?.data)}`);
        }

    } catch (err) {
        console.error('Fatal Setup Error:', err.message);
    }
}

checkActiveJobs8296();
