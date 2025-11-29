const axios = require('axios');
require('dotenv').config();

const baseUrl = process.env.ONRO_API_URL;
const clientId = process.env.ONRO_CLIENT_ID;
const clientSecret = process.env.ONRO_CLIENT_SECRET;

async function fetchVehicleTypes() {
    try {
        console.log('🔐 Authenticating with Onro...\n');

        // Step 1: Get access token
        const authResponse = await axios.post(`${baseUrl}/api/v1/customer/auth/access-token`, {
            clientId: clientId,
            clientSecret: clientSecret
        }, {
            headers: {
                'Accept-Language': 'en',
                'Content-Type': 'application/json'
            }
        });

        const accessToken = authResponse.data.data.accessToken;
        console.log('✅ Authentication successful\n');

        // Step 2: Try to fetch vehicle types
        console.log('🚗 Fetching vehicle types...\n');

        // Try different possible endpoints
        const possibleEndpoints = [
            '/api/v1/customer/vehicle-types',
            '/api/v1/customer/vehicles',
            '/api/v1/customer/vehicletypes',
            '/api/v1/vehicle-types',
            '/api/v1/vehicles'
        ];

        for (const endpoint of possibleEndpoints) {
            try {
                console.log(`Trying: ${endpoint}`);
                const response = await axios.get(`${baseUrl}${endpoint}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept-Language': 'en',
                        'Content-Type': 'application/json'
                    }
                });

                console.log(`\n✅ SUCCESS! Endpoint: ${endpoint}\n`);
                console.log('Response:');
                console.log(JSON.stringify(response.data, null, 2));

                if (response.data && response.data.data) {
                    console.log('\n📋 Vehicle Types:');
                    const vehicles = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
                    vehicles.forEach((vehicle, index) => {
                        console.log(`\n${index + 1}. Vehicle:`);
                        console.log(`   ID: ${vehicle._id || vehicle.id}`);
                        console.log(`   Name: ${vehicle.name || 'N/A'}`);
                        console.log(`   Type: ${vehicle.type || 'N/A'}`);
                    });
                }
                return;
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log(`   ❌ 404 - Not found`);
                } else {
                    console.log(`   ❌ Error: ${error.response ? error.response.status : error.message}`);
                }
            }
        }

        console.log('\n⚠️ Could not find vehicle types endpoint.');
        console.log('💡 Vehicle types might be embedded in service details.');
        console.log('   Try checking the service endpoint or contact Onro support.\n');

    } catch (error) {
        console.log('❌ Error occurred');
        console.log('Status:', error.response ? error.response.status : 'No response');
        console.log('Error:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

console.log('🚀 Fetching Vehicle Types from Onro API...\n');
fetchVehicleTypes();
