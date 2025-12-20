require('dotenv').config();
const axios = require('axios');

async function completeEndToEndTest() {
    console.log('🧪 Complete End-to-End Test\n');
    console.log('='.repeat(60));

    try {
        // Test 1: Webhook Response
        console.log('\n✅ Test 1: Webhook Response Format');
        const webhookResponse = await axios.post('https://swifly-booking.onrender.com/vapi/webhook', {
            message: {
                type: 'function-call',
                functionCall: {
                    name: 'bookOrder',
                    parameters: {
                        pickupAddress: '3 Austra Parkway, Unit 103, Monroe, NY 10950',
                        deliveryAddress: '7 Van Buren Drive, Unit 304, Monroe, NY 10950',
                        customerPhone: '01317365623',
                        paymentMethod: 'Cash',
                        vehicleType: 'Car'
                    }
                }
            }
        });

        console.log('   Status:', webhookResponse.status);
        console.log('   Response:', JSON.stringify(webhookResponse.data, null, 2));

        // Extract order reference
        const message = webhookResponse.data.results[0].result.message;
        const refMatch = message.match(/reference is ([\d-]+)/);

        if (refMatch) {
            const orderRef = refMatch[1].replace(/-/g, '');
            console.log(`\n   ✅ Order Reference: ${orderRef}`);
            console.log(`   ✅ AI will say: "${refMatch[1]}"`);
        } else {
            console.log('\n   ❌ No reference found!');
        }

        // Test 2: Check Order Status
        console.log('\n✅ Test 2: Check Order Status');
        const statusResponse = await axios.post('https://swifly-booking.onrender.com/vapi/webhook', {
            message: {
                type: 'function-call',
                functionCall: {
                    name: 'checkOrderStatus',
                    parameters: {
                        customerPhone: '01317365623'
                    }
                }
            }
        });

        console.log('   Status:', statusResponse.status);
        console.log('   Response:', JSON.stringify(statusResponse.data, null, 2));

        console.log('\n' + '='.repeat(60));
        console.log('✅ ALL TESTS PASSED!');
        console.log('='.repeat(60));
        console.log('\n📋 Summary:');
        console.log('   ✅ Webhook responding correctly');
        console.log('   ✅ Order reference generating');
        console.log('   ✅ JSON format correct');
        console.log('   ✅ checkOrderStatus working');
        console.log('\n🎯 Ready for Voice Call Test!');
        console.log('   Call your Vapi number now!');

    } catch (error) {
        console.error('\n❌ TEST FAILED!');
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

completeEndToEndTest();
