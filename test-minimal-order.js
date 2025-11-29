#!/usr/bin/env node

/**
 * Try creating order with absolute minimum required fields
 * Based on what dashboard might be sending
 */

const axios = require('axios');
require('dotenv').config();

const baseUrl = process.env.ONRO_API_URL;
const clientId = process.env.ONRO_CLIENT_ID;
const clientSecret = process.env.ONRO_CLIENT_SECRET;

async function createMinimalOrder() {
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
        const customerId = authResponse.data.data.customerId;
        console.log('✅ Authenticated\n');

        // Try the simplest possible payload
        const payload = {
            customerId: customerId,
            service: {
                id: "0_17d3kbyR41-zdPFiUQV"
            },
            deliveryMethod: {
                id: "VJ4BV0EsmNacbBa0lT1am"
            },
            paymentMethod: "Cash",
            paymentSide: "Sender",
            pickup: {
                address: "Cumberland Gate, London W2 2RH, UK",
                fullName: "John Doe",
                phone: "+1234567890"
            },
            dropoff: {
                address: "456 Oxford Street, London W1D 1BS, UK",
                fullName: "Jane Smith",
                phone: "+0987654321"
            }
        };

        console.log('📦 Creating order with minimal payload...\n');
        console.log('Payload:', JSON.stringify(payload, null, 2));

        const response = await axios.post(`${baseUrl}/api/v1/customer/order/ondemand`, payload, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept-Language': 'en',
                'Content-Type': 'application/json'
            }
        });

        console.log('\n✅✅✅ SUCCESS!');
        console.log('Response:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.log('❌ Failed');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Error:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.log('Error:', error.message);
        }
    }
}

createMinimalOrder();
