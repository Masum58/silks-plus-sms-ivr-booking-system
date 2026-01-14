require('dotenv').config();
const twilioService = require('../src/services/twilioService');

async function testSms() {
    const to = "+8801317365623"; // User's number
    const body = "Test SMS from TaxiCaller Integration Debugger";

    console.log(`🚀 Attempting to send SMS to ${to}...`);
    console.log(`   From: ${process.env.TWILIO_PHONE_NUMBER}`);

    try {
        const result = await twilioService.sendSms(to, body);
        console.log('✅ SMS Sent Successfully!');
        console.log('   SID:', result.sid);
    } catch (error) {
        console.error('❌ SMS Failed!');
        console.error('   Code:', error.code);
        console.error('   Message:', error.message);
        console.error('   More Info:', error.moreInfo);
    }
}

testSms();
