require('dotenv').config();
const axios = require('axios');

async function listPhoneNumbers() {
    const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY;

    if (!VAPI_PRIVATE_KEY) {
        console.error('Error: Missing VAPI_PRIVATE_KEY environment variable.');
        return;
    }

    try {
        const response = await axios.get('https://api.vapi.ai/phone-number', {
            headers: {
                Authorization: `Bearer ${VAPI_PRIVATE_KEY}`
            }
        });

        console.log('Current Phone Numbers in Vapi:');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error listing phone numbers:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

listPhoneNumbers();
