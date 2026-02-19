require('dotenv').config();
const axios = require('axios');

async function linkTwilioNumber() {
    const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY;
    const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;
    const TWILIO_NUMBER = process.env.TWILIO_PHONE_NUMBER;
    const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

    if (!VAPI_PRIVATE_KEY || !VAPI_ASSISTANT_ID || !TWILIO_NUMBER || !TWILIO_SID || !TWILIO_AUTH_TOKEN) {
        console.error('Error: Missing environment variables.');
        console.log('Required: VAPI_PRIVATE_KEY, VAPI_ASSISTANT_ID, TWILIO_PHONE_NUMBER, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN');
        return;
    }

    console.log(`Attempting to import Twilio number ${TWILIO_NUMBER} to Vapi...`);

    try {
        const response = await axios.post(
            'https://api.vapi.ai/phone-number/import',
            {
                twilioPhoneNumber: TWILIO_NUMBER,
                twilioAccountSid: TWILIO_SID,
                twilioAuthToken: TWILIO_AUTH_TOKEN,
                assistantId: VAPI_ASSISTANT_ID,
                name: 'Main Twilio Number'
            },
            {
                headers: {
                    Authorization: `Bearer ${VAPI_PRIVATE_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Successfully imported and linked the phone number!');
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error linking phone number:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

linkTwilioNumber();
