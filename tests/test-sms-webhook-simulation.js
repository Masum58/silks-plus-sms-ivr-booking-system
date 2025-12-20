const axios = require('axios');

async function testSmsWebhook() {
    console.log('📨 Testing SMS Webhook...');

    const url = 'https://swifly-booking.onrender.com/sms/receive';
    // const url = 'http://localhost:3000/sms/receive'; // Uncomment for local testing

    const payload = {
        From: '+15551234567',
        Body: 'Book from 3 Austra Parkway, Monroe, NY to 7 Van Buren Drive, Monroe, NY',
        MessageSid: 'SM' + Date.now()
    };

    try {
        console.log(`POST ${url}`);
        console.log('Payload:', payload);

        const response = await axios.post(url, payload, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' } // Twilio sends form-urlencoded
        });

        console.log('\n✅ Response Status:', response.status);
        console.log('✅ Response Data:', response.data);

        if (response.data.includes('<Message>')) {
            console.log('✅ Valid TwiML response received');
        } else {
            console.error('❌ Invalid response format (expected TwiML)');
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testSmsWebhook();
