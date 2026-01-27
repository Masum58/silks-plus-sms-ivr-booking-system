const axios = require('axios');
require('dotenv').config();
const taxiCallerService = require('../src/services/taxiCallerService');

async function listVehicleTypes() {
    try {
        const authHeader = await taxiCallerService.getAuthHeader();
        const companyId = 8296;

        const endpoints = [
            `/api/v1/booker/vehicle-types`,
            `/api/v1/booker/company/${companyId}/vehicle-types`,
            `/api/v1/company/${companyId}/vehicle-types`,
            `/api/v1/company/${companyId}/settings`
        ];

        for (const endpoint of endpoints) {
            console.log(`\n--- Testing Endpoint: ${endpoint} ---`);
            try {
                const res = await axios.get(`https://api-rc.taxicaller.net${endpoint}`, {
                    headers: { 'Authorization': authHeader }
                });
                console.log('Success:', JSON.stringify(res.data, null, 2));
            } catch (e) {
                console.log('Failed:', e.response?.status, e.response?.data?.errors?.[0]?.message || e.message);
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

listVehicleTypes();
