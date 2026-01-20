const axios = require('axios');

async function testVapiCancellation() {
    console.log('🚀 Starting Vapi Cancellation Test...');

    // Use localhost for local debugging since the server is running
    const baseUrl = 'http://localhost:3000';
    const webhookUrl = `${baseUrl}/vapi/webhook`;

    // 1. FIRST, CREATE A REAL BOOKING TO GET A VALID REFERENCE
    console.log('\n--- STEP 1: CREATING A BOOKING ---');
    const bookPayload = {
        message: {
            type: "function-call",
            functionCall: {
                name: "bookOrder",
                parameters: {
                    pickupAddress: "72 Bailey Farm Road, Monroe, NY",
                    deliveryAddress: "498 Woodbury Commons Drive, Central Valley, NY",
                    customerPhone: "8456371211"
                }
            }
        }
    };

    try {
        const bookResponse = await axios.post(webhookUrl, bookPayload);
        const bookResult = bookResponse.data.results[0].result;
        console.log('✅ Booking Response:', bookResult.message);

        // Extract the short reference from the response (e.g., "s-w-b-v-9")
        const refMatch = bookResult.message.match(/reference is ([a-z0-9-]+)\./i);
        if (!refMatch) {
            console.error('❌ Could not find order reference in response.');
            return;
        }
        const shortRef = refMatch[1];
        console.log(`✨ Captured Reference to Cancel: ${shortRef}`);

        // 2. NOW, SIMULATE VAPI CALLING THE cancelOrder TOOL
        console.log('\n--- STEP 2: SIMULATING VAPI CANCELLATION TOOL CALL ---');
        const cancelPayload = {
            message: {
                type: "function-call",
                functionCall: {
                    name: "cancelOrder",
                    parameters: {
                        orderId: shortRef // Vapi passes the reference it just heard
                    }
                }
            }
        };

        console.log(`📤 Sending cancelOrder request for: ${shortRef}`);
        const cancelResponse = await axios.post(webhookUrl, cancelPayload);
        const cancelResult = cancelResponse.data.results[0].result;

        console.log('\n✅ Vapi Tool Response:');
        console.log(JSON.stringify(cancelResult, null, 2));

        if (cancelResult.success) {
            console.log('\n✨ TEST PASSED: Vapi successfully cancelled the specific booking!');
        } else {
            console.log('\n❌ TEST FAILED: Cancellation failed.');
        }

    } catch (error) {
        console.error('\n❌ Error during Vapi test:', error.message);
        if (error.response) {
            console.error('📦 Error Details:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testVapiCancellation();
