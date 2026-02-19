const axios = require('axios');
require('dotenv').config();

async function listVehicleTypes() {
    console.log('🔍 Listing TaxiCaller Vehicle Types...');

    const companyId = process.env.TAXICALLER_COMPANY_ID;
    const apiKey = process.env.TAXICALLER_API_KEY;
    const baseUrl = process.env.TAXICALLER_API_URL || 'https://api.taxicaller.net';

    try {
        // 1. Get Admin JWT
        const adminJwtRes = await axios.get(`${baseUrl}/AdminService/v1/jwt/for-key`, {
            params: {
                key: apiKey,
                sub: '*',
                ttl: 900
            }
        });
        const adminJwt = adminJwtRes.data.token || adminJwtRes.data;

        // 2. Get Vehicle Types
        const response = await axios.get(`${baseUrl}/api/v1/admin/vehicle-type`, {
            headers: { 'Authorization': `Bearer ${adminJwt}` },
            params: {
                company_id: companyId
            }
        });

        console.log(`✅ Found ${response.data.list ? response.data.list.length : 0} vehicle types.`);

        if (response.data.list) {
            response.data.list.forEach(type => {
                console.log(`- ID: ${type.id}, Name: ${type.name}, Capacity: ${type.capacity}`);
            });
        }
    } catch (error) {
        console.error('❌ Failed to list vehicle types:', error.message);
        if (error.response) {
            console.error('   Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

listVehicleTypes();
