#!/usr/bin/env node

/**
 * Test Google Maps API Key
 * This script verifies that the API key is working correctly
 */

const axios = require('axios');
require('dotenv').config();

async function testGoogleMapsAPI() {
    try {
        console.log('🧪 Testing Google Maps API Key...\n');

        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            console.log('❌ Error: GOOGLE_MAPS_API_KEY not found in .env file');
            console.log('\nPlease add it to your .env file:');
            console.log('GOOGLE_MAPS_API_KEY=your_api_key_here');
            return;
        }

        console.log('✅ API Key found in .env');
        console.log(`   Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}\n`);

        // Test address
        const testAddress = '3 Austra Parkway #103 Monroe NY 10950';
        console.log(`📍 Testing with address: "${testAddress}"\n`);

        // Call Google Maps Geocoding API
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: testAddress,
                key: apiKey
            }
        });

        if (response.data.status === 'OK') {
            const result = response.data.results[0];
            const location = result.geometry.location;

            console.log('✅✅✅ SUCCESS! Google Maps API is working!\n');
            console.log('📍 Geocoding Result:');
            console.log(`   Address: ${result.formatted_address}`);
            console.log(`   Latitude: ${location.lat}`);
            console.log(`   Longitude: ${location.lng}`);
            console.log(`   Coordinates: [${location.lng}, ${location.lat}]`);
            console.log('\n🎉 Your API key is ready to use!');

        } else if (response.data.status === 'REQUEST_DENIED') {
            console.log('❌ API Key Error: Request Denied');
            console.log('\nPossible reasons:');
            console.log('1. Geocoding API is not enabled');
            console.log('2. API key restrictions are too strict');
            console.log('3. Billing is not enabled (required for production)');
            console.log('\nPlease check Google Cloud Console.');

        } else {
            console.log(`❌ Error: ${response.data.status}`);
            console.log('Error message:', response.data.error_message || 'Unknown error');
        }

    } catch (error) {
        console.log('❌ Network Error:', error.message);
        if (error.response) {
            console.log('Response:', error.response.data);
        }
    }
}

testGoogleMapsAPI();
