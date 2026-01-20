const axios = require('axios');

async function testSmsBooking() {
    console.log('🚀 Starting SMS Webhook Simulation Test...');

    // Use the live Render URL
    const url = 'https://swifly-booking.onrender.com/sms/receive';

    // Simulated Twilio SMS Payload
    const payload = new URLSearchParams();
    payload.append('From', '+18456371211');
    payload.append('Body', 'Book from 72 Bailey Farm Road to 498 Woodbury Commons Drive');
    payload.append('MessageSid', 'SM' + Math.random().toString(36).substring(7));

    try {
        console.log('📤 Sending simulated SMS to server...');
        console.log(`   From: +18456371211`);
        console.log(`   Message: "Book from 72 Bailey Farm Road to 498 Woodbury Commons Drive"`);

        const response = await axios.post(url, payload.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        console.log('\n✅ Response from Server (TwiML):');
        console.log(response.data);

        if (response.data.includes('Booking confirmed')) {
            console.log('\n✨ TEST PASSED: SMS Booking was successful!');
        } else {
            console.log('\n❌ TEST FAILED: Check the response above.');
        }
    } catch (error) {
        console.error('\n❌ Error connecting to server:', error.message);
        if (error.response) {
            console.error('📦 Error Details:', error.response.data);
        }
    }
}

testSmsBooking();
