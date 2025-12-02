#!/usr/bin/env node

/**
 * Fetch Payment Methods from Onro
 */

const axios = require('axios');
require('dotenv').config();

const baseUrl = process.env.ONRO_API_URL;
const clientId = process.env.ONRO_CLIENT_ID;
const clientSecret = process.env.ONRO_CLIENT_SECRET;

async function fetchPaymentMethods() {
    try {
        console.log('🔐 Authenticating...');

        // Authenticate
        const authResponse = await axios.post(`${baseUrl}/api/v1/customer/auth/access-token`, {
            clientId: clientId,
            clientSecret: clientSecret
        }, { headers: { 'Accept-Language': 'en', 'Content-Type': 'application/json' } });

        const accessToken = authResponse.data.data.accessToken;
        console.log('✅ Authenticated\n');

        // Try to fetch payment methods (endpoint might be /api/v1/customer/payment-methods or similar)
        console.log('📋 Fetching payment methods...\n');

        const endpoints = [
            '/api/v1/customer/payment-methods',
            '/api/v1/payment-methods',
            '/api/v1/customer/settings',
            '/api/v1/customer/profile'
        ];

        for (const endpoint of endpoints) {
            try {
                console.log(`Trying: ${endpoint}`);
                const response = await axios.get(`${baseUrl}${endpoint}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept-Language': 'en'
                    }
                });

                console.log('✅ Success!');
                console.log(JSON.stringify(response.data, null, 2));
                break;
            } catch (error) {
                console.log(`❌ ${error.response ? error.response.status : error.message}`);
            }
        }

        console.log('\n💡 Note: Based on Onro documentation, valid payment methods are usually:');
        console.log('   - "Cash"');
        console.log('   - "Wallet"');
        console.log('   - "Card"');
        console.log('\nIf "Cash" is not working, try "Wallet" or check with Onro support.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

fetchPaymentMethods();
