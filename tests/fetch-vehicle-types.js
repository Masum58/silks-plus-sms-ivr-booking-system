const axios = require('axios');
const onroService = require('./src/services/onroService');
require('dotenv').config();

async function fetchVehicleTypes() {
    try {
        console.log('Authenticating...');
        await onroService.authenticate();
        const token = await onroService.getValidToken();

        // Try common endpoints for vehicle types
        const endpoints = [
            '/api/v1/customer/vehicle-types',
            '/api/v1/customer/vehicles',
            '/api/v1/customer/lookup/vehicle-types',
            '/api/v1/customer/settings/vehicles'
        ];

        for (const endpoint of endpoints) {
            try {
                console.log(`Checking ${endpoint}...`);
                const response = await axios.get(`${process.env.ONRO_API_URL}${endpoint}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log(`✅ Success: ${endpoint}`);
                console.log(JSON.stringify(response.data, null, 2));
            } catch (error) {
                console.log(`❌ Failed: ${endpoint} (${error.response ? error.response.status : error.message})`);
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

fetchVehicleTypes();
