require('dotenv').config();
const taxiCallerService = require('../src/services/taxiCallerService');

async function verifyConnection() {
    console.log('🚀 Starting TaxiCaller Connection Verification...');
    console.log(`   API URL: ${process.env.TAXICALLER_API_URL}`);
    console.log(`   Company ID: ${process.env.TAXICALLER_COMPANY_ID}`);

    try {
        // 1. Test Authentication (Get Token)
        console.log('\n🔐 Testing Authentication...');
        const token = await taxiCallerService.getAccessToken();
        console.log('✅ Authentication Successful!');
        console.log(`   Token: ${token.substring(0, 20)}...`);

        // 2. Fetch Vehicle List (using the client directly to access specific endpoint)
        console.log('\nPY Testing Vehicle List Fetch...');
        // Note: We need to use the authenticated client from the service
        // Since `client` is not exposed, we'll add a temporary method or just use axios with the token
        const axios = require('axios');
        const client = axios.create({
            baseURL: process.env.TAXICALLER_API_URL,
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const vehicleResponse = await client.get(`/api/v1/company/${process.env.TAXICALLER_COMPANY_ID}/vehicle/list`);
        console.log('✅ Vehicle List Fetched!');
        console.log('   Raw Data:', JSON.stringify(vehicleResponse.data, null, 2));

        let vehicles = [];
        if (Array.isArray(vehicleResponse.data)) {
            vehicles = vehicleResponse.data;
        } else if (vehicleResponse.data && Array.isArray(vehicleResponse.data.vehicles)) {
            vehicles = vehicleResponse.data.vehicles;
        } else if (vehicleResponse.data && Array.isArray(vehicleResponse.data.data)) {
            vehicles = vehicleResponse.data.data;
        }

        console.log(`   Found ${vehicles.length} vehicles.`);

        if (vehicles.length > 0) {
            console.log('   Sample Vehicles:');
            vehicles.slice(0, 3).forEach(v => {
                console.log(`   - ID: ${v.id}, Name: ${v.name}, Type: ${v.vehicle_type_name} (Type ID: ${v.vehicle_type_id})`);
            });
        } else {
            console.log('   ⚠️ No vehicles found. Please check the Dispatch Console.');
        }

        // 3. Fetch Attributes/Tags (Users/Vehicles)
        // Docs say: https://app-rc.taxicaller.net/dispatch/vehicles/tags
        // API might be /api/v1/company/{id}/tag/list or similar. Let's try to guess or skip if unknown.
        // Based on common patterns:
        console.log('\n🏷️  Testing Attributes/Tags Fetch...');
        try {
            const tagResponse = await client.get(`/api/v1/company/${process.env.TAXICALLER_COMPANY_ID}/tag/list`);
            console.log('✅ Tags Fetched!');
            console.log('   Tags:', JSON.stringify(tagResponse.data, null, 2));
        } catch (tagError) {
            console.log('⚠️  Could not fetch tags via API (might need different endpoint).');
            console.log('   Error:', tagError.response?.status);
        }

    } catch (error) {
        console.error('\n❌ Verification Failed!');
        console.error('   Error:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

verifyConnection();
