require('dotenv').config();
const axios = require('axios');

async function fetchTaxiCallerVehicles() {
    console.log('🔍 Fetching TaxiCaller Vehicle Types...');

    const apiToken = process.env.TAXICALLER_API_KEY;
    const companyId = process.env.TAXICALLER_COMPANY_ID;
    const apiUrl = process.env.TAXICALLER_API_URL || 'https://api-rc.taxicaller.net';

    if (!apiToken || !companyId) {
        console.error('❌ Missing TAXICALLER_API_KEY or TAXICALLER_COMPANY_ID in .env');
        return;
    }

    try {
        // 1. Get JWT Token
        console.log('🔄 Getting JWT Token...');
        const authClient = axios.create({ baseURL: 'https://api.taxicaller.net' });
        const authResponse = await authClient.get('/AdminService/v1/jwt/for-key', {
            params: { key: apiToken, sub: 'ivr', ttl: 900 }
        });
        const token = authResponse.data;
        console.log('✅ Token acquired');

        // 2. Fetch Vehicle Types
        console.log('🔄 Fetching Vehicle Types...');
        const client = axios.create({ baseURL: apiUrl });
        const response = await client.get(`/api/v1/company/${companyId}/vehicle-type`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('\n✅ VEHICLE TYPES:');
        console.log(JSON.stringify(response.data, null, 2));

        // 3. Fetch Online Vehicles
        console.log('\n🔄 Fetching Online Vehicles...');
        const onlineResponse = await client.get(`/api/v1/company/${companyId}/vehicle`, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { online: true }
        });

        console.log('\n✅ ONLINE VEHICLES:');
        console.log(JSON.stringify(onlineResponse.data, null, 2));

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

fetchTaxiCallerVehicles();
