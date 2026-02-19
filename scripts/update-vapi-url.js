require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY;
const ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;
const SERVER_URL = 'https://swifly-booking.onrender.com/vapi/webhook';

const SYSTEM_PROMPT = fs.readFileSync(path.join(__dirname, '../vapi_system_prompt.md'), 'utf8');

async function updateVapiServer() {
    try {
        console.log(`🚀 Updating Vapi Assistant ${ASSISTANT_ID}...`);
        console.log(`🔗 Setting Server URL: ${SERVER_URL}`);

        const response = await axios.patch(`https://api.vapi.ai/assistant/${ASSISTANT_ID}`, {
            serverUrl: SERVER_URL,
            model: {
                messages: [{ role: 'system', content: SYSTEM_PROMPT }],
                provider: 'openai',
                model: 'gpt-4o'
            }
        }, {
            headers: { Authorization: `Bearer ${VAPI_PRIVATE_KEY}` }
        });

        console.log('✅ Vapi Assistant Updated Successfully!');
        console.log('   Server URL is now:', response.data.serverUrl);

    } catch (err) {
        console.error('❌ Update Failed:', err.response?.data || err.message);
    }
}

updateVapiServer();
