const axios = require('axios');

async function testBookingAndCancel() {
    console.log('🚀 Starting End-to-End Test: Booking -> Cancellation');
    const baseUrl = 'http://localhost:3000/vapi/webhook';

    // 1. BOOKING
    console.log('\n--- SMS/Voice Booking Simulation ---');
    const bookPayload = {
        message: {
            type: 'function-call',
            functionCall: {
                name: 'bookOrder',
                parameters: {
                    pickupAddress: "Austra Parkway, Monroe, NY",
                    deliveryAddress: "Beer Sheva Street, Monroe, NY",
                    customerPhone: "+19177203770", // Use a generic US number to avoid international SMS errors in logs
                    customerName: "Automated Test User",
                    driverGender: "Man"
                }
            }
        }
    };

    let orderId = null;

    try {
        const bookResponse = await axios.post(baseUrl, bookPayload);
        const result = bookResponse.data.results?.[0]?.result;

        if (result && result.success) {
            console.log('✅ Booking Successful!');
            console.log(`   Order Ref: ${result.orderId}`);
            console.log(`   TaxiCaller ID: ${result.taxiCallerId}`);
            console.log(`   Price: ${result.price}`);
            orderId = result.orderId;
        } else {
            console.error('❌ Booking Failed:', JSON.stringify(bookResponse.data, null, 2));
            return;
        }

    } catch (error) {
        console.error('❌ Booking Request Failed:', error.message);
        return;
    }

    if (!orderId) return;

    // Wait a moment before cancelling (simulate user reading SMS)
    console.log('\n⏳ Waiting 3 seconds before cancelling...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 2. CANCELLATION
    console.log('\n--- Cancellation Simulation ---');

    // We simulate the flow where Vapi calls cancelOrder with the Reference ID
    const cancelPayload = {
        message: {
            type: 'function-call',
            functionCall: {
                name: 'cancelOrder',
                parameters: {
                    orderId: orderId, // The short ref we got
                    reason: "Changed my mind"
                }
            }
        }
    };

    try {
        const cancelResponse = await axios.post(baseUrl, cancelPayload);
        const result = cancelResponse.data.results?.[0]?.result;

        if (result && result.success) {
            console.log('✅ Cancellation Successful!');
            console.log(`   Message: ${result.message}`);
        } else {
            console.error('❌ Cancellation Failed:', JSON.stringify(cancelResponse.data, null, 2));
        }

    } catch (error) {
        console.error('❌ Cancellation Request Failed:', error.message);
    }
}

testBookingAndCancel();
