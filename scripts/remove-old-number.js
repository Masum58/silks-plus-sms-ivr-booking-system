require('dotenv').config();
const axios = require('axios');

async function removeOldNumber() {
    const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY;
    const OLD_NUMBER_ID = '74be0e3b-8ef3-414c-b7e7-58c31de5bc6b'; // +18126668455

    if (!VAPI_PRIVATE_KEY) {
        console.error('Error: Missing VAPI_PRIVATE_KEY environment variable.');
        return;
    }

    console.log(`Attempting to delete old number ID: ${OLD_NUMBER_ID} (+18126668455)...`);

    try {
        const response = await axios.delete(`https://api.vapi.ai/phone-number/${OLD_NUMBER_ID}`, {
            headers: {
                Authorization: `Bearer ${VAPI_PRIVATE_KEY}`
            }
        });

        console.log('Successfully deleted the old phone number!');
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error deleting phone number:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

removeOldNumber();
