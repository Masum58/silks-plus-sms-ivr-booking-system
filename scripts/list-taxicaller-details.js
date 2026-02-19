require('dotenv').config();
const taxiCallerService = require('../src/services/taxiCallerService');
const axios = require('axios');

async function listProvidersAndZones() {
    try {
        const token = await taxiCallerService.getAccessToken();
        const client = axios.create({
            baseURL: process.env.TAXICALLER_API_URL,
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const companyId = process.env.TAXICALLER_COMPANY_ID;

        console.log(`\n🏢 Company ID: ${companyId}`);

        // 1. List Providers
        console.log('\n📡 Fetching Providers...');
        try {
            const providerResponse = await client.get(`/api/v1/company/${companyId}/provider/list`);
            console.log('✅ Providers:', JSON.stringify(providerResponse.data, null, 2));
        } catch (e) {
            console.log('⚠️ Could not fetch providers:', e.response?.status);
        }

        // 2. List Assignment Zones
        console.log('\n📍 Fetching Assignment Zones...');
        try {
            // Using guessed endpoint based on patterns
            const zoneResponse = await client.get(`/api/v1/company/${companyId}/zone/list`);
            console.log('✅ Zones:', JSON.stringify(zoneResponse.data, null, 2));
        } catch (e) {
            console.log('⚠️ Could not fetch zones:', e.response?.status);
        }

        // 3. List Vehicle Types
        console.log('\n🚗 Fetching Vehicle Types...');
        try {
            const typeResponse = await client.get(`/api/v1/company/${companyId}/vehicle-type/list`);
            console.log('✅ Vehicle Types:', JSON.stringify(typeResponse.data, null, 2));
        } catch (e) {
            console.log('⚠️ Could not fetch vehicle types:', e.response?.status);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

listProvidersAndZones();
