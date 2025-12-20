require('dotenv').config();

// Simulate Vapi webhook call
async function simulateVapiCall() {
    console.log('🎭 Simulating Vapi Webhook Call...\n');

    // Import the handler
    const vapiHandler = require('./src/routes/vapi');

    // Simulate Vapi request body
    const mockRequest = {
        body: {
            message: {
                type: 'function-call',
                functionCall: {
                    name: 'bookOrder',
                    parameters: {
                        pickupAddress: '3 Austra Parkway, Unit 103, Monroe, NY 10950',
                        deliveryAddress: '7 Van Buren Drive, Unit 304, Monroe, NY 10950',
                        customerName: 'Test User',
                        customerPhone: '01317365623',
                        driverNotes: 'Ring doorbell',
                        paymentMethod: 'Cash',
                        vehicleType: 'Car'
                    }
                }
            }
        }
    };

    // Simulate response object
    const mockResponse = {
        json: function (data) {
            console.log('📤 Response to Vapi:\n');
            console.log(JSON.stringify(data, null, 2));

            if (data.results && data.results[0]) {
                const result = data.results[0];
                console.log('\n' + '='.repeat(60));
                console.log('✅ VAPI WILL RECEIVE:');
                console.log('='.repeat(60));
                console.log(`Success: ${result.result.success}`);
                console.log(`Message: ${result.result.message}`);
                console.log('='.repeat(60));

                // Extract reference from message
                const refMatch = result.result.message.match(/reference is ([\d-]+)/);
                if (refMatch) {
                    const ref = refMatch[1].replace(/-/g, '');
                    console.log(`\n🎯 Order Reference: ${ref}`);
                    console.log(`   AI will say: "${refMatch[1]}"`);
                } else {
                    console.log('\n⚠️  No reference found in message!');
                }
            }
        }
    };

    // Call the handler
    console.log('📞 Calling Vapi Handler...\n');
    await vapiHandler(mockRequest, mockResponse);
}

simulateVapiCall().catch(console.error);
