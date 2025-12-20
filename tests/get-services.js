const axios = require('axios');
require('dotenv').config();

const baseUrl = process.env.ONRO_API_URL;
const clientId = process.env.ONRO_CLIENT_ID;
const clientSecret = process.env.ONRO_CLIENT_SECRET;

async function getServices() {
    try {
        // Step 1: Get access token
        console.log('🔐 Getting Access Token...\n');

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
        console.log('✅ Access Token received\n');

        // Step 2: Get available services
        console.log('📋 Fetching available services...\n');

        const servicesResponse = await axios.get(
            `${baseUrl}/api/v1/customer/services`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept-Language': 'en',
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ Services fetched successfully!\n');
        console.log('Full Response:');
        console.log(JSON.stringify(servicesResponse.data, null, 2));

        if (servicesResponse.data && servicesResponse.data.data) {
            console.log('\n📦 Available Services:');
            const services = servicesResponse.data.data;
            if (Array.isArray(services)) {
                services.forEach((service, index) => {
                    console.log(`\n${index + 1}. Service ID: ${service._id}`);
                    console.log(`   Name: ${service.name || 'N/A'}`);
                    console.log(`   Type: ${service.type || 'N/A'}`);
                });

                if (services.length > 0) {
                    console.log('\n💡 Use this Service ID in your Postman request:');
                    console.log(`   "${services[0]._id}"`);
                }
            }
        }

    } catch (error) {
        console.log('❌ Error occurred');
        console.log('Status:', error.response ? error.response.status : 'No response');
        console.log('Error:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

console.log('🚀 Fetching Available Services...\n');
getServices();
