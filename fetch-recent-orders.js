const axios = require('axios');
require('dotenv').config();

const baseUrl = process.env.ONRO_API_URL;
const clientId = process.env.ONRO_CLIENT_ID;
const clientSecret = process.env.ONRO_CLIENT_SECRET;

async function fetchRecentOrders() {
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

        // Try to fetch recent orders
        console.log('📋 Fetching recent orders...\n');

        const endpoints = [
            '/api/v1/customer/orders',
            '/api/v1/customer/order',
            '/api/v1/orders'
        ];

        for (const endpoint of endpoints) {
            try {
                console.log(`Trying: ${endpoint}`);
                const response = await axios.get(`${baseUrl}${endpoint}`, {
                    params: {
                        limit: 5,  // Get last 5 orders
                        page: 1
                    },
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept-Language': 'en',
                        'Content-Type': 'application/json'
                    }
                });

                console.log(`\n✅ SUCCESS!\n`);
                console.log('Response:', JSON.stringify(response.data, null, 2));

                // Look for vehicle type in orders
                if (response.data && response.data.data) {
                    const orders = Array.isArray(response.data.data) ? response.data.data : [response.data.data];

                    console.log('\n🔍 Looking for vehicle types in orders...\n');
                    orders.forEach((order, index) => {
                        console.log(`\nOrder ${index + 1}:`);
                        console.log(`  Order ID: ${order._id || order.id}`);
                        console.log(`  Service: ${order.service?.title || order.service?.id}`);

                        if (order.vehicleType) {
                            console.log(`  ✅ Vehicle Type Found:`);
                            console.log(`     ID: ${order.vehicleType.id || order.vehicleType._id}`);
                            console.log(`     Title: ${order.vehicleType.title || order.vehicleType.name || 'N/A'}`);
                        }

                        if (order.deliveryMethod) {
                            console.log(`  Delivery Method:`);
                            console.log(`     ID: ${order.deliveryMethod.id || order.deliveryMethod._id}`);
                            console.log(`     Title: ${order.deliveryMethod.title || order.deliveryMethod.name || 'N/A'}`);
                        }
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

        console.log('\n⚠️ Could not fetch orders.');

    } catch (error) {
        console.log('❌ Error occurred');
        console.log('Error:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

console.log('🚀 Fetching Recent Orders to Find Vehicle Type...\n');
fetchRecentOrders();
