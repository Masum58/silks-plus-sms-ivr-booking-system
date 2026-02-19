const axios = require('axios');
require('dotenv').config();

async function findLatestJobs() {
    console.log('🔍 Fetching LATEST JOBS via AdminService...');

    const companyId = process.env.TAXICALLER_COMPANY_ID;
    const apiKey = process.env.TAXICALLER_API_KEY;
    const baseUrl = process.env.TAXICALLER_API_URL || 'https://api.taxicaller.net';

    try {
        const adminJwtRes = await axios.get(`${baseUrl}/AdminService/v1/jwt/for-key`, {
            params: { key: apiKey, sub: '*', ttl: 900 }
        });
        const adminJwt = adminJwtRes.data.token || adminJwtRes.data;
        const authHeader = `Bearer ${adminJwt}`;

        const res = await axios.get(`${baseUrl}/AdminService/v1/job/list`, {
            headers: { 'Authorization': authHeader },
            params: { company_id: companyId, limit: 20 }
        });

        const list = res.data.list || res.data || [];
        console.log(`✅ Found ${list.length} jobs.`);

        list.slice(0, 10).forEach(job => {
            console.log('---------------------------');
            console.log(`Job ID: ${job.id}`);
            console.log(`Created: ${new Date(job.created * 1000).toLocaleString()}`);
            console.log(`Phone: ${job.customer_phone}`);
            console.log(`Price: ${job.price} ${job.currency}`);
            console.log(`Status: ${job.state}`);
            console.log(`Title: ${job.title}`);
        });

    } catch (err) {
        console.error('Failed:', err.message);
        if (err.response) console.log(JSON.stringify(err.response.data, null, 2));
    }
}

findLatestJobs();
