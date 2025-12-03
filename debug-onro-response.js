#!/usr/bin/env node

/**
 * Debug Onro Response Structure
 * This will show us exactly what fields Onro returns
 */

require('dotenv').config();
const axios = require('axios');

async function debugOnroResponse() {
    try {
        console.log('🔍 Checking Onro API Response Structure...\n');

        // Get access token
        const authResponse = await axios.post(
            'https://api.swiflymessenger.com/api/v1/customer/auth/token',
            {
                clientId: process.env.ONRO_CLIENT_ID,
                clientSecret: process.env.ONRO_CLIENT_SECRET
            }
        );

        const token = authResponse.data.data.accessToken;
        console.log('✅ Authenticated\n');

        // Get recent orders to see structure
        const ordersResponse = await axios.get(
            'https://api.swiflymessenger.com/api/v1/customer/order',
            {
                headers: { 'Authorization': `Bearer ${token}` },
                params: { limit: 1 }
            }
        );

        if (ordersResponse.data.data && ordersResponse.data.data.length > 0) {
            const order = ordersResponse.data.data[0];

            console.log('📦 Sample Order Structure:');
            console.log('='.repeat(50));
            console.log(JSON.stringify(order, null, 2));
            console.log('='.repeat(50));
            console.log('\n🔑 Available Fields:');
            console.log(Object.keys(order));
            console.log('\n💡 Looking for CODE field...');

            // Check for code-like fields
            const codeFields = Object.keys(order).filter(key =>
                key.toLowerCase().includes('code') ||
                key.toLowerCase().includes('number') ||
                key === 'id' ||
                key === '_id'
            );

            console.log('Possible CODE fields:', codeFields);
            codeFields.forEach(field => {
                console.log(`  ${field}: ${order[field]}`);
            });
        } else {
            console.log('❌ No orders found');
        }

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

debugOnroResponse();
