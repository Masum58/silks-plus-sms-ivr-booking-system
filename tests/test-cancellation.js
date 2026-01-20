const axios = require('axios');

async function testFullFlow() {
    console.log('🚀 Starting Full Flow Test: Booking followed by Cancellation...');

    // Use the live Render URL
    const baseUrl = 'https://swifly-booking.onrender.com';
    const bookUrl = `${baseUrl}/vapi/webhook`;

    // 1. CREATE A BOOKING
    console.log('\n--- STEP 1: CREATING A BOOKING ---');
    const bookPayload = {
        message: {
            type: "function-call",
            functionCall: {
                name: "bookOrder",
                parameters: {
                    pickupAddress: "72 Bailey Farm Road, Monroe, NY",
                    deliveryAddress: "498 Woodbury Commons Drive, Central Valley, NY",
                    customerPhone: "8456371211",
                    customerName: "Test User"
                }
            }
        }
    };

    try {
        const bookResponse = await axios.post(bookUrl, bookPayload);
        const responseText = bookResponse.data.results[0].result.message;
        console.log('✅ Booking Response:', responseText);

        // Extract the short reference from the response (e.g., "y-z-s-f-s")
        const refMatch = responseText.match(/reference is ([a-z0-9-]+)\./i);
        if (!refMatch) {
            console.error('❌ Could not find order reference in response.');
            return;
        }
        const shortRef = refMatch[1];
        console.log(`✨ Captured Short Reference: ${shortRef}`);

        // Wait 3 seconds for Render to sync (if multiple instances)
        console.log('⏳ Waiting 3 seconds before cancellation...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 2. CANCEL THE BOOKING
        console.log('\n--- STEP 2: CANCELLING THE BOOKING ---');
        const cancelPayload = {
            message: {
                type: "function-call",
                functionCall: {
                    name: "cancelOrder",
                    parameters: {
                        orderId: shortRef
                    }
                }
            }
        };

        const cancelResponse = await axios.post(bookUrl, cancelPayload);
        console.log('✅ Cancellation Response:', JSON.stringify(cancelResponse.data.results[0].result, null, 2));

        if (cancelResponse.data.results[0].result.success) {
            console.log('\n✨ SUCCESS: Booking was created and then cancelled successfully!');
        } else {
            console.log('\n❌ FAILED: Cancellation did not return success.');
        }

    } catch (error) {
        console.error('\n❌ Error during test:', error.message);
        if (error.response) {
            console.error('📦 Error Details:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testFullFlow();
