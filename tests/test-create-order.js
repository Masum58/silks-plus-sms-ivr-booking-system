const axios = require('axios');
require('dotenv').config();

const baseUrl = process.env.ONRO_API_URL;
const customerId = process.env.ONRO_CUSTOMER_ID;
const clientId = process.env.ONRO_CLIENT_ID;
const clientSecret = process.env.ONRO_CLIENT_SECRET;

async function createOrder() {
    try {
        // Step 1: Get access token
        console.log('🔐 Step 1: Getting access token...');
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
        console.log('✅ Access token received');
        console.log('Token:', accessToken.substring(0, 30) + '...\n');

        // Step 2: Create order with proper structure based on API docs
        console.log('📦 Step 2: Creating order...');

        // This is a sample pickup-delivery order structure
        // You may need to adjust based on actual requirements
        const orderData = {
            customerId: customerId,
            pickup: {
                address: "Cumberland Gate, London W2 2RH, UK",
                // Optional fields you might need:
                // addressDetail: "Apartment 5B",
                // completesAfter: timestamp,
                // completesBefore: timestamp,
                // coordinates: [lat, lng],
                // fullName: "John Doe",
                // phone: "+1234567890",
                // note: "Ring the bell"
            }
            // Add delivery, payment, and other required fields based on your needs
        };

        const orderResponse = await axios.post(
            `${baseUrl}/api/v1/customer/order/pickup-delivery`,
            orderData,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept-Language': 'en',
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ Order created successfully!');
        console.log('Response:', JSON.stringify(orderResponse.data, null, 2));

    } catch (error) {
        console.log('❌ Error occurred');
        console.log('Status:', error.response ? error.response.status : 'No response');
        console.log('Error:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);

        if (error.response && error.response.data) {
            console.log('\n💡 Error details:', error.response.data);
        }
    }
}

createOrder();
