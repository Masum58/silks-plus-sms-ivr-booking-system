const axios = require('axios');
require('dotenv').config();

const baseUrl = process.env.ONRO_API_URL;
const clientId = process.env.ONRO_CLIENT_ID;
const clientSecret = process.env.ONRO_CLIENT_SECRET;
let customerId = process.env.ONRO_CUSTOMER_ID;

const SERVICE_ID = "0_17d3kbyR41-zdPFiUQV";

async function verifyOrderCreation() {
    try {
        console.log('🚀 Starting Final Verification (Attempt 2)...');

        // Step 1: Auth
        console.log('🔐 Authenticating...');
        const authResponse = await axios.post(`${baseUrl}/api/v1/customer/auth/access-token`, {
            clientId: clientId,
            clientSecret: clientSecret
        }, { headers: { 'Accept-Language': 'en', 'Content-Type': 'application/json' } });

        const accessToken = authResponse.data.data.accessToken;
        if (authResponse.data.data.customerId) customerId = authResponse.data.data.customerId;
        console.log('✅ Authenticated');

        // Step 2: Create Order
        console.log('📦 Creating Test Order...');
        const orderData = {
            customerId: customerId, // Added customerId
            service: {
                id: SERVICE_ID,
                options: [] // Added options
            },
            paymentMethod: "Cash",
            paymentSide: "Sender",
            pickup: {
                address: "Cumberland Gate, London W2 2RH, UK",
                fullName: "Test User",
                phone: "+1234567890"
                // Removed note
            },
            delivery: {
                address: "456 Oxford Street, London W1D 1BS, UK",
                fullName: "Test Receiver",
                phone: "+0987654321"
                // Removed note
            },
            note: "Test order from Script"
        };

        const response = await axios.post(
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

        console.log('✅✅✅ ORDER CREATED SUCCESSFULLY!');
        console.log('Order ID:', response.data.data.orderId || response.data.data._id);
        console.log('Status:', response.data.data.status);
        console.log('\n🎉 Verification Passed! Postman collection is ready to use.');

    } catch (error) {
        console.log(`❌ Failed (${error.response ? error.response.status : error.message})`);
        if (error.response && error.response.data) {
            console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

verifyOrderCreation();
