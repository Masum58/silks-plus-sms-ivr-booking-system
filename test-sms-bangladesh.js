require('dotenv').config();
const twilio = require('twilio');

async function sendTestSMS() {
    try {
        console.log('📱 Sending Test SMS to Bangladesh Number...\n');

        const client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );

        const message = await client.messages.create({
            body: '🧪 Test SMS from Swifly Booking System. If you receive this, SMS delivery to Bangladesh is working! ✅',
            from: process.env.TWILIO_PHONE_NUMBER,
            to: '+8801317365623' // Bangladesh number
        });

        console.log('✅ SMS Sent Successfully!');
        console.log('='.repeat(60));
        console.log(`Message SID: ${message.sid}`);
        console.log(`Status: ${message.status}`);
        console.log(`To: ${message.to}`);
        console.log(`From: ${message.from}`);
        console.log('='.repeat(60));
        console.log('\n📱 Check your phone for the test SMS!');
        console.log('   If you receive it, SMS to Bangladesh is working!');

    } catch (error) {
        console.error('❌ Error sending SMS:', error.message);
        if (error.code) {
            console.error(`Error Code: ${error.code}`);
        }
    }
}

sendTestSMS();
