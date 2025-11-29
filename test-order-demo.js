const axios = require('axios');
require('dotenv').config();

const baseUrl = process.env.ONRO_API_URL;
const customerId = process.env.ONRO_CUSTOMER_ID;
const clientId = process.env.ONRO_CLIENT_ID;
const clientSecret = process.env.ONRO_CLIENT_SECRET;

async function testCreateOrder() {
    try {
        // Step 1: Get access token
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔐 STEP 1: Getting Access Token');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

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
        console.log('✅ Authentication Successful!');
        console.log('📋 Customer ID:', authResponse.data.data.customerId);
        console.log('🔑 Access Token:', accessToken.substring(0, 40) + '...');
        console.log('⏰ Expires In:', authResponse.data.data.expiresIn, 'seconds\n');

        // Step 2: Create order with all required fields
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📦 STEP 2: Creating Order');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // Sample order data with required fields
        const orderData = {
            customerId: customerId,
            service: "service_id_here", // You need to get this from client
            paymentMethod: "cash", // or "card", "wallet", etc.
            paymentSide: "customer", // or "driver", "company", etc.
            pickup: {
                address: "Cumberland Gate, London W2 2RH, UK",
                fullName: "John Doe",
                phone: "+1234567890"
            },
            delivery: {
                address: "456 Oxford Street, London W1D 1BS, UK",
                fullName: "Jane Smith",
                phone: "+0987654321"
            },
            note: "Test order from API"
        };

        console.log('📤 Sending order data:');
        console.log(JSON.stringify(orderData, null, 2));
        console.log('');

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

        console.log('✅✅✅ ORDER CREATED SUCCESSFULLY! ✅✅✅\n');
        console.log('📋 Full Response:');
        console.log(JSON.stringify(orderResponse.data, null, 2));

        if (orderResponse.data && orderResponse.data.data) {
            console.log('\n🎉 Order Details:');
            console.log('Order ID:', orderResponse.data.data.orderId || orderResponse.data.data._id);
            console.log('Status:', orderResponse.data.data.status);
        }

    } catch (error) {
        console.log('\n❌ ERROR OCCURRED\n');
        console.log('Status Code:', error.response ? error.response.status : 'No response');

        if (error.response && error.response.data) {
            console.log('Error Message:', error.response.data.message);
            console.log('\nFull Error Response:');
            console.log(JSON.stringify(error.response.data, null, 2));

            // Parse the error message to show what's missing
            if (error.response.data.message && error.response.data.message.includes('required')) {
                console.log('\n💡 MISSING REQUIRED FIELDS:');
                const message = error.response.data.message;
                const fields = message.match(/"([^"]+)" is required/g);
                if (fields) {
                    fields.forEach(field => console.log('   -', field));
                }
            }
        } else {
            console.log('Error:', error.message);
        }
    }
}

console.log('\n🚀 Starting Order Creation Test...\n');
testCreateOrder();
