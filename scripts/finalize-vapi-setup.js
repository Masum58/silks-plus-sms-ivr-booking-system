require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY;
const ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;
const TWILIO_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

// Read system prompt from the markdown file
const SYSTEM_PROMPT = fs.readFileSync(path.join(__dirname, '../vapi_system_prompt.md'), 'utf8');

async function finalize() {
    try {
        console.log('--- 1. Updating Assistant Configuration ---');
        await axios.patch(`https://api.vapi.ai/assistant/${ASSISTANT_ID}`, {
            model: {
                messages: [{ role: 'system', content: SYSTEM_PROMPT }],
                provider: 'openai',
                model: 'gpt-4o'
            },
            firstMessage: "Car Safe, pickup address?",
            endCallMessage: "Thank you for choosing Car Safe. Have a great day."
        }, {
            headers: { Authorization: `Bearer ${VAPI_PRIVATE_KEY}` }
        });
        console.log('✅ Assistant updated with new prompt.');

        console.log('\n--- 2. Linking Phone Number ---');
        try {
            const res = await axios.post('https://api.vapi.ai/phone-number/import', {
                twilioPhoneNumber: TWILIO_NUMBER,
                twilioAccountSid: TWILIO_SID,
                twilioAuthToken: TWILIO_AUTH_TOKEN,
                assistantId: ASSISTANT_ID,
                name: 'Car Safe Main Line'
            }, {
                headers: { Authorization: `Bearer ${VAPI_PRIVATE_KEY}` }
            });
            console.log('✅ Phone number linked:', res.data.id);
        } catch (e) {
            if (e.response?.data?.message?.includes('already exists') || e.response?.data?.message?.includes('already in use')) {
                console.log('ℹ️ Phone number already linked or in use.');
            } else {
                throw e;
            }
        }

        console.log('\n✨ Vapi Finalization Complete!');
    } catch (err) {
        console.error('❌ Error during finalization:', err.response?.data || err.message);
    }
}

finalize();
