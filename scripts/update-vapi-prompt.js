const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function updateVapiPrompt() {
    console.log('🚀 Updating Vapi System Prompt...');
    const assistantId = process.env.VAPI_ASSISTANT_ID;
    const privateKey = process.env.VAPI_PRIVATE_KEY;

    try {
        // Read the updated prompt file
        const promptPath = path.join(__dirname, '../updated_system_prompt.txt');
        const newSystemPrompt = fs.readFileSync(promptPath, 'utf8');

        if (!newSystemPrompt || newSystemPrompt.length < 100) {
            throw new Error('System prompt file seems empty or too short.');
        }

        console.log(`📝 Read new prompt (${newSystemPrompt.length} chars).`);

        // First, get current config to preserve other settings
        const currentRes = await axios.get(`https://api.vapi.ai/assistant/${assistantId}`, {
            headers: { 'Authorization': `Bearer ${privateKey}` }
        });

        const currentModel = currentRes.data.model;

        // Construct update payload
        // We need to update the 'system' message in the messages array if it exists, 
        // OR set systemPrompt field if that's what is used. 
        // Based on audit, it seemed 'messages' might be the place, but let's handle both.

        let updatedModel = { ...currentModel };

        // Method 1: Update messages array
        if (updatedModel.messages) {
            const systemMsgIndex = updatedModel.messages.findIndex(m => m.role === 'system');
            if (systemMsgIndex >= 0) {
                updatedModel.messages[systemMsgIndex].content = newSystemPrompt;
            } else {
                updatedModel.messages.unshift({ role: 'system', content: newSystemPrompt });
            }
        } else {
            updatedModel.messages = [{ role: 'system', content: newSystemPrompt }];
        }

        // Method 2: Update systemPrompt field (some Vapi models use this directly)
        updatedModel.systemPrompt = newSystemPrompt;

        // Perform Update
        console.log('📡 Sending update to Vapi API...');
        const updateRes = await axios.patch(`https://api.vapi.ai/assistant/${assistantId}`, {
            model: updatedModel
        }, {
            headers: { 'Authorization': `Bearer ${privateKey}` }
        });

        console.log('✅ Update Successful!');
        console.log('New Model:', updateRes.data.model?.model);
        console.log('New System Prompt Length:', updateRes.data.model?.systemPrompt?.length || updateRes.data.model?.messages?.find(m => m.role == 'system')?.content?.length);

    } catch (error) {
        console.error('❌ Update Failed:', error.response?.data || error.message);
    }
}

updateVapiPrompt();
