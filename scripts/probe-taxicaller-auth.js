require('dotenv').config();
const axios = require('axios');

async function probeSubjects() {
    const key = process.env.TAXICALLER_API_KEY;
    const baseUrl = process.env.TAXICALLER_API_URL || 'https://api.taxicaller.net';

    const subjects = ['ivr', 'admin', 'booker', '*', 'api', 'chatbot', 'external'];

    console.log(`🔍 Probing subjects for key: ${key.substring(0, 5)}...`);

    for (const sub of subjects) {
        console.log(`\nTesting subject: "${sub}"...`);
        try {
            const res = await axios.get(`${baseUrl}/AdminService/v1/jwt/for-key`, {
                params: { key, sub, ttl: 900 }
            });
            console.log(`✅ SUCCESS! Token acquired for sub: "${sub}"`);
            process.exit(0);
        } catch (e) {
            console.log(`❌ FAILED for sub "${sub}": ${e.response?.status} - ${e.response?.data?.message || e.message}`);
        }
    }

    console.log('\nTesting WITHOUT sub parameter...');
    try {
        const res = await axios.get(`${baseUrl}/AdminService/v1/jwt/for-key`, {
            params: { key, ttl: 900 }
        });
        console.log(`✅ SUCCESS! Token acquired WITHOUT sub`);
    } catch (e) {
        console.log(`❌ FAILED WITHOUT sub: ${e.response?.status} - ${e.response?.data?.message || e.message}`);
    }
}

probeSubjects();
