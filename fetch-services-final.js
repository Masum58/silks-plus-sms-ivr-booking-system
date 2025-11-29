const axios = require('axios');
require('dotenv').config();

const baseUrl = process.env.ONRO_API_URL;
const clientId = process.env.ONRO_CLIENT_ID;
const clientSecret = process.env.ONRO_CLIENT_SECRET;
// We'll get customerId from auth response to be sure, or use env
let customerId = process.env.ONRO_CUSTOMER_ID;

async function fetchServices() {
    try {
        // Step 1: Get access token
        console.log('🔐 Getting Access Token...');
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
        // Update customerId from auth response if available
        if (authResponse.data.data.customerId) {
            customerId = authResponse.data.data.customerId;
        }

        console.log('✅ Access Token received');
        console.log('📋 Customer ID:', customerId, '\n');

        // Step 2: Fetch Services
        const endpoint = '/api/v1/customer/service';
        console.log(`📦 Fetching Services from ${endpoint}...`);

        const response = await axios.get(`${baseUrl}${endpoint}`, {
            params: {
                customerId: customerId
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept-Language': 'en',
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ SUCCESS! Services fetched successfully.\n');

        if (response.data && response.data.data) {
            const services = response.data.data;
            console.log(`Found ${services.length} services:`);

            services.forEach((service, index) => {
                console.log(`\n🔹 Service #${index + 1}`);
                console.log(`   ID: ${service._id}`);
                console.log(`   Name: ${service.name}`);
                console.log(`   Type: ${service.type}`);
            });

            if (services.length > 0) {
                console.log('\n💡 COPY THIS ID FOR POSTMAN:');
                console.log(`   "${services[0]._id}"`);
            }
        } else {
            console.log('No services found in response data.');
            console.log(JSON.stringify(response.data, null, 2));
        }

    } catch (error) {
        console.log(`❌ Failed (${error.response ? error.response.status : error.message})`);
        if (error.response && error.response.data) {
            console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

fetchServices();
