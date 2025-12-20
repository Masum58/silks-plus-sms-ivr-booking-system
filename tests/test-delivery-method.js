#!/usr/bin/env node

const axios = require('axios');

const API_URL = 'http://localhost:3000/api/create-booking';

// Test with deliveryMethod instead of vehicleType
const payload = {
    service: {
        id: "0_17d3kbyR41-zdPFiUQV",
        options: []
    },
    deliveryMethod: {
        id: "VJ4BV0EsmNacbBa0lT1am",
        options: []
    },
    paymentMethod: "Cash",
    paymentSide: "Sender",
    promoCode: "",
    isScheduled: false,
    pickup: {
        address: "Cumberland Gate, London W2 2RH, UK",
        fullName: "John Doe",
        phone: "+1234567890",
        schedulePickupNow: true,
        scheduleDateAfter: 0,
        scheduleDateBefore: 0
    }
};

async function testDeliveryMethod() {
    try {
        console.log('🧪 Testing with deliveryMethod field...\n');
        console.log('Payload:', JSON.stringify(payload, null, 2));

        const response = await axios.post(API_URL, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('\n✅ SUCCESS!');
        console.log('Response:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.log('\n❌ FAILED');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Error:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.log('Error:', error.message);
        }
    }
}

testDeliveryMethod();
