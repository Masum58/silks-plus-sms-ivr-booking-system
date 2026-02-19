require('dotenv').config();
const taxiCallerService = require('../src/services/taxiCallerService');
const axios = require('axios');

async function discoverDetails() {
    const companyId = process.env.TAXICALLER_COMPANY_ID;
    console.log(`🔍 Discovering details for Company ID: ${companyId}`);

    try {
        const token = await taxiCallerService.getAccessToken();
        const baseUrl = process.env.TAXICALLER_API_URL || 'https://api.taxicaller.net';

        const endpoints = [
            `/api/v1/company/${companyId}/provider/list`,
            `/api/v1/company/${companyId}/vehicle-type/list`,
            `/api/v1/booker/provider/list`,
            `/AdminService/v1/company/${companyId}`
        ];

        for (const endpoint of endpoints) {
            console.log(`\n📡 Testing: ${endpoint}`);
            try {
                const res = await axios.get(`${baseUrl}${endpoint}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log('✅ Success!');
                console.log(JSON.stringify(res.data, null, 2));
            } catch (e) {
                console.log(`❌ Failed: ${e.response?.status} - ${e.message}`);
            }
        }

        // 2. Test Availability API to see providers
        console.log('\n📡 Testing Availability API (Custom Check)...');
        const availabilityPayload = {
            order: {
                company_id: parseInt(companyId),
                pickup: { lat: 41.32, lng: -74.18, address: "Monroe, NY" },
                destination: { lat: 41.34, lng: -74.20, address: "Kiryas Joel, NY" }
            }
        };

        try {
            const res = await axios.post(`${baseUrl}/api/v1/booker/availability/order`, availabilityPayload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('✅ Availability Success!');
            console.log(JSON.stringify(res.data, null, 2));
        } catch (e) {
            console.log(`❌ Availability Failed: ${e.response?.status} - ${JSON.stringify(e.response?.data)}`);
        }

    } catch (err) {
        console.error('Fatal Error:', err.message);
    }
}

discoverDetails();
