#!/usr/bin/env node

/**
 * Test different payload variations to find what works
 */

const axios = require('axios');

const API_URL = 'http://localhost:3000/api/create-booking';

// Test 1: Without vehicleType
const test1 = {
    service: {
        id: "0_17d3kbyR41-zdPFiUQV",
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

// Test 2: With vehicleType as empty object
const test2 = {
    ...test1,
    vehicleType: {}
};

// Test 3: With vehicleType.id only
const test3 = {
    ...test1,
    vehicleType: {
        id: "VJ4BV0EsmNacbBa0lT1am"
    }
};

// Test 4: Minimal payload
const test4 = {
    service: {
        id: "0_17d3kbyR41-zdPFiUQV"
    },
    paymentMethod: "Cash",
    paymentSide: "Sender",
    pickup: {
        address: "Cumberland Gate, London W2 2RH, UK",
        fullName: "John Doe",
        phone: "+1234567890"
    }
};

async function testPayload(name, payload) {
    try {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`Testing: ${name}`);
        console.log(`${'='.repeat(60)}`);
        console.log('Payload:', JSON.stringify(payload, null, 2));

        const response = await axios.post(API_URL, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ SUCCESS!');
        console.log('Response:', JSON.stringify(response.data, null, 2));
        return true;

    } catch (error) {
        console.log('❌ FAILED');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Error:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.log('Error:', error.message);
        }
        return false;
    }
}

async function runTests() {
    console.log('🧪 Running Payload Tests...\n');

    const tests = [
        ['Test 1: Without vehicleType', test1],
        ['Test 2: With empty vehicleType', test2],
        ['Test 3: With vehicleType.id only', test3],
        ['Test 4: Minimal payload', test4]
    ];

    for (const [name, payload] of tests) {
        const success = await testPayload(name, payload);
        if (success) {
            console.log('\n🎉 Found working payload! Stopping tests.');
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between tests
    }
}

runTests();
