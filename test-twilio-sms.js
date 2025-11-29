#!/usr/bin/env node

/**
 * Twilio SMS Integration Test
 * Tests sending and verifying Twilio configuration
 */

const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

console.log('🧪 Twilio SMS Integration Test\n');
console.log('='.repeat(60));

// Step 1: Verify credentials
console.log('\n📋 Step 1: Verifying Credentials...\n');
console.log(`   Account SID: ${accountSid}`);
console.log(`   Phone Number: ${phoneNumber}`);
console.log(`   Auth Token: ${authToken ? '***' + authToken.slice(-4) : 'NOT SET'}`);

if (!accountSid || !authToken || !phoneNumber) {
    console.log('\n❌ ERROR: Missing Twilio credentials in .env file');
    process.exit(1);
}

// Step 2: Initialize Twilio client
console.log('\n🔧 Step 2: Initializing Twilio Client...\n');
const client = twilio(accountSid, authToken);
console.log('   ✅ Client initialized');

// Step 3: Verify account
async function verifyAccount() {
    try {
        console.log('\n🔍 Step 3: Verifying Account...\n');
        const account = await client.api.accounts(accountSid).fetch();
        console.log('   ✅ Account verified');
        console.log(`   Account Name: ${account.friendlyName}`);
        console.log(`   Status: ${account.status}`);
        console.log(`   Type: ${account.type}`);
        return true;
    } catch (error) {
        console.log('   ❌ Account verification failed');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

// Step 4: Check phone number
async function checkPhoneNumber() {
    try {
        console.log('\n📱 Step 4: Checking Phone Number...\n');
        const incomingPhoneNumbers = await client.incomingPhoneNumbers.list({
            phoneNumber: phoneNumber
        });

        if (incomingPhoneNumbers.length > 0) {
            const number = incomingPhoneNumbers[0];
            console.log('   ✅ Phone number found');
            console.log(`   Friendly Name: ${number.friendlyName}`);
            console.log(`   Capabilities:`);
            console.log(`      - SMS: ${number.capabilities.sms ? '✅' : '❌'}`);
            console.log(`      - Voice: ${number.capabilities.voice ? '✅' : '❌'}`);
            console.log(`      - MMS: ${number.capabilities.mms ? '✅' : '❌'}`);

            if (number.smsUrl) {
                console.log(`   SMS Webhook: ${number.smsUrl}`);
            } else {
                console.log('   ⚠️  No SMS webhook configured');
            }

            return number.capabilities.sms;
        } else {
            console.log('   ❌ Phone number not found in account');
            return false;
        }
    } catch (error) {
        console.log('   ❌ Error checking phone number');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

// Step 5: Send test SMS
async function sendTestSMS(toNumber) {
    try {
        console.log(`\n📤 Step 5: Sending Test SMS to ${toNumber}...\n`);

        const message = await client.messages.create({
            body: '🎉 Test message from Silks Plus SMS/IVR System! Your Twilio integration is working perfectly.',
            from: phoneNumber,
            to: toNumber
        });

        console.log('   ✅ SMS sent successfully!');
        console.log(`   Message SID: ${message.sid}`);
        console.log(`   Status: ${message.status}`);
        console.log(`   Direction: ${message.direction}`);
        console.log(`   Price: ${message.price || 'Pending'} ${message.priceUnit || ''}`);

        return message;
    } catch (error) {
        console.log('   ❌ Failed to send SMS');
        console.log(`   Error: ${error.message}`);

        if (error.code === 21211) {
            console.log('\n   💡 This is an invalid phone number format.');
            console.log('   Make sure to use E.164 format: +[country code][number]');
            console.log('   Example: +8801712345678 for Bangladesh');
        } else if (error.code === 21608) {
            console.log('\n   💡 This number is not verified for trial accounts.');
            console.log('   Add it to verified numbers in Twilio console or upgrade account.');
        }

        return null;
    }
}

// Main test function
async function runTests() {
    console.log('\n🚀 Starting Twilio Integration Tests...\n');

    // Test 1: Verify account
    const accountOk = await verifyAccount();
    if (!accountOk) {
        console.log('\n❌ Account verification failed. Please check credentials.');
        return;
    }

    // Test 2: Check phone number
    const phoneOk = await checkPhoneNumber();
    if (!phoneOk) {
        console.log('\n⚠️  Phone number check failed or SMS not enabled.');
    }

    // Test 3: Ask for test number
    console.log('\n' + '='.repeat(60));
    console.log('📱 SMS Sending Test');
    console.log('='.repeat(60));
    console.log('\nTo test SMS sending, you need to provide a phone number.');
    console.log('\n⚠️  IMPORTANT:');
    console.log('   - For trial accounts: Use a verified number');
    console.log('   - Format: E.164 (+[country][number])');
    console.log('   - Bangladesh example: +8801712345678');
    console.log('   - US example: +15551234567');

    // Check if phone number provided as argument
    const testNumber = process.argv[2];

    if (testNumber) {
        await sendTestSMS(testNumber);
    } else {
        console.log('\n💡 To send a test SMS, run:');
        console.log(`   node test-twilio-sms.js +YOUR_PHONE_NUMBER`);
        console.log('\n   Example:');
        console.log(`   node test-twilio-sms.js +8801712345678`);
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Test Summary');
    console.log('='.repeat(60));
    console.log(`\n✅ Account: ${accountOk ? 'OK' : 'FAILED'}`);
    console.log(`${phoneOk ? '✅' : '⚠️ '} Phone Number: ${phoneOk ? 'OK' : 'Check required'}`);
    console.log(`${testNumber ? '✅' : '⏭️ '} SMS Test: ${testNumber ? 'Attempted' : 'Skipped'}`);

    console.log('\n📝 Next Steps:');
    if (!testNumber) {
        console.log('   1. Run with your phone number to test SMS sending');
    }
    console.log('   2. Configure SMS webhook for receiving messages');
    console.log('   3. Set up A2P 10DLC registration for US numbers (if needed)');
    console.log('');
}

// Run tests
runTests().catch(error => {
    console.error('\n❌ Unexpected error:', error);
    process.exit(1);
});
