#!/usr/bin/env node

/**
 * Test script to verify Onro API booking creation
 * This script tests the create-booking endpoint with the correct payload structure
 */

const axios = require('axios');

const API_URL = 'http://localhost:3000/api/create-booking';

// Correct payload structure for ONDEMAND endpoint
const bookingPayload = {
    service: {
        id: "0_17d3kbyR41-zdPFiUQV",  // Your service ID
        options: []
    },
    vehicleType: {
        id: "VJ4BV0EsmNacbBa0lT1am",  // Vehicle type ID as object
        options: []
    },
    paymentMethod: "Cash",
    paymentSide: "Sender",
    promoCode: "",  // REQUIRED - empty string if no promo
    isScheduled: false,  // REQUIRED - false for immediate pickup
    pickup: {
        address: "Cumberland Gate, London W2 2RH, UK",
        fullName: "John Doe",
        phone: "+1234567890",
        schedulePickupNow: true,  // REQUIRED - true for immediate
        scheduleDateAfter: 0,     // REQUIRED - 0 for immediate
        scheduleDateBefore: 0     // REQUIRED - 0 for immediate
    }
};

async function testBookingCreation() {
    try {
        console.log('🚀 Testing booking creation...');
        console.log('📦 Payload:', JSON.stringify(bookingPayload, null, 2));

        const response = await axios.post(API_URL, bookingPayload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Success!');
        console.log('📋 Response:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('❌ Error creating booking:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Message:', error.message);
        }
        process.exit(1);
    }
}

// Run the test
testBookingCreation();
