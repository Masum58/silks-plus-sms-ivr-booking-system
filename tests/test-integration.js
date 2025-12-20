const axios = require('axios');
const config = require('./src/config/config');
const onroService = require('./src/services/onroService');
const twilioService = require('./src/services/twilioService');

async function testServerHealth() {
    try {
        const response = await axios.get(`http://localhost:${config.port}/api/health`);
        console.log('✅ Server Health Check:', response.data);
    } catch (error) {
        console.error('❌ Server Health Check Failed:', error.message);
    }
}

async function testOnroConfig() {
    console.log('ℹ️ Testing Onro Config...');
    if (config.onro.apiUrl && config.onro.customerId) {
        console.log('✅ Onro Config Loaded');
    } else {
        console.error('❌ Onro Config Missing');
    }
}

async function testTwilioConfig() {
    console.log('ℹ️ Testing Twilio Config...');
    if (config.twilio.accountSid && config.twilio.authToken) {
        console.log('✅ Twilio Config Loaded');
    } else {
        console.error('❌ Twilio Config Missing');
    }
}

async function runTests() {
    console.log('🚀 Starting Integration Tests...');

    // Wait for server to start if running concurrently, or assume it's running
    // For this script, we'll just check config first
    await testOnroConfig();
    await testTwilioConfig();

    // We can't easily test the server endpoint unless we spawn it or it's already running.
    // We'll rely on the user or a separate command to start the server.
    // However, we can try to hit it and see.
    await testServerHealth();
}

runTests();
