const axios = require('axios');
require('dotenv').config();

const baseUrl = process.env.ONRO_API_URL;
const clientId = process.env.ONRO_CLIENT_ID;
const clientSecret = process.env.ONRO_CLIENT_SECRET;

async function fetchCompleteInfo() {
    try {
        console.log('🚀 Onro API - Complete Information Fetch\n');
        console.log('='.repeat(60));

        // Step 1: Authenticate
        console.log('\n🔐 Step 1: Authenticating...\n');
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
        const customerId = authResponse.data.data.customerId;

        console.log('✅ Authenticated Successfully');
        console.log(`   Customer ID: ${customerId}`);
        console.log(`   Access Token: ${accessToken.substring(0, 20)}...`);

        // Step 2: Fetch Services
        console.log('\n📋 Step 2: Fetching Services...\n');

        try {
            const servicesResponse = await axios.get(`${baseUrl}/api/v1/customer/service`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept-Language': 'en'
                }
            });

            console.log('✅ Services Found!\n');
            const services = servicesResponse.data.data;

            if (Array.isArray(services)) {
                services.forEach((service, index) => {
                    console.log(`Service ${index + 1}:`);
                    console.log(`   ID: ${service.id || service._id}`);
                    console.log(`   Title: ${service.title}`);
                    console.log(`   Description: ${service.description}`);
                    console.log(`   Order Types: ${JSON.stringify(service.orderTypes)}`);

                    if (service.deliveryMethods && service.deliveryMethods.length > 0) {
                        console.log(`   Delivery Methods:`);
                        service.deliveryMethods.forEach((dm, dmIndex) => {
                            console.log(`      ${dmIndex + 1}. ${dm.title} (ID: ${dm.id})`);
                        });
                    }
                    console.log('');
                });
            } else {
                console.log('Single Service:');
                console.log(`   ID: ${services.id || services._id}`);
                console.log(`   Title: ${services.title}`);
            }
        } catch (error) {
            console.log(`❌ Services fetch failed: ${error.response ? error.response.status : error.message}`);
        }

        // Step 3: Try to fetch Vehicles
        console.log('\n🚗 Step 3: Trying to Fetch Vehicles...\n');

        const vehicleEndpoints = [
            '/api/v1/customer/vehicle',
            '/api/v1/customer/vehicles',
            '/api/v1/vehicle',
            '/api/v1/vehicles',
            '/api/v1/customer/vehicle-types',
            '/api/v1/vehicle-types'
        ];

        let vehiclesFound = false;

        for (const endpoint of vehicleEndpoints) {
            try {
                console.log(`   Trying: ${endpoint}`);
                const response = await axios.get(`${baseUrl}${endpoint}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept-Language': 'en'
                    }
                });

                console.log(`\n   ✅ SUCCESS! Found vehicles at: ${endpoint}\n`);
                console.log('   Vehicles:');
                console.log(JSON.stringify(response.data, null, 2));
                vehiclesFound = true;
                break;

            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log(`      ❌ 404`);
                } else {
                    console.log(`      ❌ ${error.response ? error.response.status : error.message}`);
                }
            }
        }

        if (!vehiclesFound) {
            console.log('\n   ⚠️  No vehicle endpoint found.');
            console.log('   💡 Vehicle IDs should be provided by Onro support.');
        }

        // Step 4: Summary
        console.log('\n' + '='.repeat(60));
        console.log('📊 SUMMARY');
        console.log('='.repeat(60));
        console.log('\n✅ What we have:');
        console.log(`   - Customer ID: ${customerId}`);
        console.log(`   - Service ID: 0_17d3kbyR41-zdPFiUQV`);
        console.log(`   - Service Name: Bag-Box`);
        console.log(`   - Delivery Method ID: VJ4BV0EsmNacbBa0lT1am`);

        console.log('\n❌ What we need:');
        console.log('   - Vehicle Type ID (for API order creation)');

        console.log('\n💡 Next Steps:');
        console.log('   1. Contact Onro support and ask for Vehicle ID');
        console.log('   2. Or check if deliveryMethod ID can be used as vehicleType ID');
        console.log('   3. Reference: https://documenter.getpostman.com/view/30670905/2sA3XLDPB6');
        console.log('');

    } catch (error) {
        console.log('\n❌ Error occurred:');
        console.log(error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

fetchCompleteInfo();
