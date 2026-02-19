require('dotenv').config();
const axios = require('axios');

async function updateVapiWebhook() {
    const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY;
    const PHONE_NUMBER_ID = '6b053f9a-9c07-4280-b776-2bbd027e317c'; // +18669016939

    if (!VAPI_PRIVATE_KEY) {
        console.error('Error: Missing VAPI_PRIVATE_KEY environment variable.');
        return;
    }

    console.log(`Updating Vapi webhook for phone number ID: ${PHONE_NUMBER_ID}...`);

    try {
        const response = await axios.patch(
            `https://api.vapi.ai/phone-number/${PHONE_NUMBER_ID}`,
            {
                server: {
                    url: 'https://swifly-booking.onrender.com/vapi/webhook',
                    timeoutSeconds: 20
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${VAPI_PRIVATE_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Successfully updated the Vapi webhook URL!');
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error updating Vapi webhook:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

updateVapiWebhook();
