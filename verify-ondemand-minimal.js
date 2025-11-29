const axios = require('axios');
require('dotenv').config();

const baseUrl = process.env.ONRO_API_URL;
const clientId = process.env.ONRO_CLIENT_ID;
const clientSecret = process.env.ONRO_CLIENT_SECRET;
let customerId = process.env.ONRO_CUSTOMER_ID;

const SERVICE_ID = "0_17d3kbyR41-zdPFiUQV";
const VEHICLE_TYPE_ID = "VJ4BV0EsmNacbBa0lT1am";

async function verifyOrderCreation() {
    try {
        console.log('🚀 Starting Verification (Minimal)...');

        // Step 1: Auth
        const authResponse = await axios.post(`${baseUrl}/api/v1/customer/auth/access-token`, {
            clientId: clientId,
            clientSecret: clientSecret
        }, { headers: { 'Accept-Language': 'en', 'Content-Type': 'application/json' } });

        const accessToken = authResponse.data.data.accessToken;
        if (authResponse.data.data.customerId) customerId = authResponse.data.data.customerId;
        console.log('✅ Authenticated');

        // Step 2: Create Order with ONLY known valid fields
        console.log('📦 Creating Test Order...');
        const orderData = {
            customerId: customerId,
            service: {
                id: SERVICE_ID,
                options: []
            },
            vehicleType: {
                id: VEHICLE_TYPE_ID,
                options: []
            },
            paymentMethod: "Cash",
            paymentSide: "Sender",
            promoCode: "",
            isScheduled: false,

            pickup: {
                address: "Cumberland Gate, London W2 2RH, UK",
                fullName: "Test User",
                phone: "+1234567890",
                schedulePickupNow: true,
                scheduleDateAfter: 0,
                scheduleDateBefore: 0
            }
            // Intentionally omitting any dropoff/destination to see what error we get
        };

        const endpoint = '/api/v1/customer/order/ondemand';
        console.log(`Testing endpoint: ${endpoint}`);

        const response = await axios.post(
            `${baseUrl}${endpoint}`,
            orderData,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept-Language': 'en',
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅✅✅ ORDER CREATED SUCCESSFULLY (Unexpectedly)!');
        console.log('Order ID:', response.data.data.orderId || response.data.data._id);

    } catch (error) {
        console.log(`❌ Failed (${error.response ? error.response.status : error.message})`);
        if (error.response && error.response.data) {
            console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

verifyOrderCreation();
