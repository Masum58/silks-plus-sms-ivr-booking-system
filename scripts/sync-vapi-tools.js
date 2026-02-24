require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY;

async function updateTools() {
    console.log('🔍 Fetching Vapi Tools Config...');
    const toolsConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../VAPI_TOOLS_CONFIG.json'), 'utf8'));

    try {
        // 1. Get current assistant to see its tool IDs
        const assistantId = process.env.VAPI_ASSISTANT_ID;
        const assistantRes = await axios.get(`https://api.vapi.ai/assistant/${assistantId}`, {
            headers: { Authorization: `Bearer ${VAPI_PRIVATE_KEY}` }
        });

        const assistant = assistantRes.data;
        console.log(`✅ Found Assistant: ${assistant.name}`);

        // 2. Loop through tools in config and update/create them
        for (const toolConfig of toolsConfig) {
            const toolName = toolConfig.function.name;
            console.log(`\n🛠️ Handling tool: ${toolName}...`);

            // Try to find existing tool by name
            const toolsRes = await axios.get('https://api.vapi.ai/tool', {
                headers: { Authorization: `Bearer ${VAPI_PRIVATE_KEY}` }
            });

            const existingTool = toolsRes.data.find(t => t.function?.name === toolName);

            if (existingTool) {
                console.log(`   Updating existing tool (ID: ${existingTool.id})...`);
                await axios.patch(`https://api.vapi.ai/tool/${existingTool.id}`, toolConfig, {
                    headers: { Authorization: `Bearer ${VAPI_PRIVATE_KEY}` }
                });
                console.log(`   ✅ Tool ${toolName} updated.`);
            } else {
                console.log(`   Creating new tool...`);
                const newTool = await axios.post('https://api.vapi.ai/tool', toolConfig, {
                    headers: { Authorization: `Bearer ${VAPI_PRIVATE_KEY}` }
                });
                console.log(`   ✅ Tool ${toolName} created with ID: ${newTool.data.id}`);
            }
        }

        console.log('\n✨ Vapi Tools synchronization complete!');
    } catch (err) {
        console.error('❌ Error updating tools:', err.response?.data || err.message);
    }
}

updateTools();
