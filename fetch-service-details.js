const axios = require('axios');
require('dotenv').config();

const baseUrl = process.env.ONRO_API_URL;
const clientId = process.env.ONRO_CLIENT_ID;
const clientSecret = process.env.ONRO_CLIENT_SECRET;
const SERVICE_ID = "0_17d3kbyR41-zdPFiUQV";

async function fetchServiceDetails() {
    try {
        console.log('🔐 Authenticating...\n');

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
        console.log('✅ Authenticated\n');

        // Try to fetch service details
        console.log(`📋 Fetching service details for ID: ${SERVICE_ID}\n`);

        const endpoints = [
            `/api/v1/customer/services/${SERVICE_ID}`,
            `/api/v1/customer/service/${SERVICE_ID}`,
            `/api/v1/services/${SERVICE_ID}`,
            `/api/v1/service/${SERVICE_ID}`
        ];

        for (const endpoint of endpoints) {
            try {
                console.log(`Trying: ${endpoint}`);
                const response = await axios.get(`${baseUrl}${endpoint}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept-Language': 'en',
                        'Content-Type': 'application/json'
                    }
                });

                console.log(`\n✅ SUCCESS!\n`);
                console.log('Full Response:');
                console.log(JSON.stringify(response.data, null, 2));

                // Look for vehicle types in the response
                if (response.data && response.data.data) {
                    const serviceData = response.data.data;
                    console.log('\n🔍 Looking for vehicle types...\n');

                    // Check various possible locations
                    if (serviceData.vehicleTypes) {
                        console.log('Found vehicleTypes:');
                        console.log(JSON.stringify(serviceData.vehicleTypes, null, 2));
                    }
                    if (serviceData.vehicles) {
                        console.log('Found vehicles:');
                        console.log(JSON.stringify(serviceData.vehicles, null, 2));
                    }
                    if (serviceData.allowedVehicles) {
                        console.log('Found allowedVehicles:');
                        console.log(JSON.stringify(serviceData.allowedVehicles, null, 2));
                    }
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

        console.log('\n⚠️ Could not fetch service details.');

    } catch (error) {
        console.log('❌ Error occurred');
        console.log('Error:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

fetchServiceDetails();
