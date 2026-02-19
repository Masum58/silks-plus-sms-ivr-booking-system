const axios = require('axios');
require('dotenv').config();

async function getVapiAssistant() {
    console.log('🔍 Fetching Vapi Assistant Details...');
    const assistantId = process.env.VAPI_ASSISTANT_ID;
    const privateKey = process.env.VAPI_PRIVATE_KEY;

    try {
        const response = await axios.get(`https://api.vapi.ai/assistant/${assistantId}`, {
            headers: { 'Authorization': `Bearer ${privateKey}` }
        });

        console.log('✅ Assistant Found!');
        console.log('Name:', response.data.name);
        console.log('Model:', response.data.model?.model);
        if (response.data.model?.messages) {
            const sysMsg = response.data.model.messages.find(m => m.role === 'system');
            if (sysMsg) {
                console.log('\n--- CURRENT SYSTEM PROMPT ---\n');
                console.log(sysMsg.content);
                console.log('\n-----------------------------\n');
            } else {
                console.log('No system message found in messages array.');
            }
        } else {
            console.log('System Prompt Length:', response.data.model?.systemPrompt?.length);
            console.log('Full Model Obj:', JSON.stringify(response.data.model, null, 2));
        }
    } catch (error) {
        console.error('❌ Error fetching assistant:', error.response?.data || error.message);
    }
}

getVapiAssistant();
