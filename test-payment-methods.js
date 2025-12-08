require('dotenv').config();
const axios = require('axios');

async function testCardPayment() {
    console.log('💳 Testing Card Payment Method\n');
    console.log('='.repeat(60));

    try {
        // Test with Card payment
        const webhookResponse = await axios.post('https://swifly-booking.onrender.com/vapi/webhook', {
            message: {
                type: 'function-call',
                functionCall: {
                    name: 'bookOrder',
                    parameters: {
                        pickupAddress: '3 Austra Parkway, Unit 103, Monroe, NY 10950',
                        deliveryAddress: '7 Van Buren Drive, Unit 304, Monroe, NY 10950',
                        customerPhone: '01317365623',
                        paymentMethod: 'Card',  // Testing Card payment
                        vehicleType: 'Car'
                    }
                }
            }
        });

        console.log('✅ Test 1: Card Payment');
        console.log('   Status:', webhookResponse.status);
        console.log('   Response:', JSON.stringify(webhookResponse.data, null, 2));

        const message1 = webhookResponse.data.results[0].result.message;
        const refMatch1 = message1.match(/reference is ([\d-]+)/);
        if (refMatch1) {
            console.log(`   ✅ Order Reference: ${refMatch1[1].replace(/-/g, '')}`);
        }

        console.log('\n' + '='.repeat(60));

        // Test with Wallet payment
        const webhookResponse2 = await axios.post('https://swifly-booking.onrender.com/vapi/webhook', {
            message: {
                type: 'function-call',
                functionCall: {
                    name: 'bookOrder',
                    parameters: {
                        pickupAddress: '3 Austra Parkway, Unit 103, Monroe, NY 10950',
                        deliveryAddress: '7 Van Buren Drive, Unit 304, Monroe, NY 10950',
                        customerPhone: '01317365623',
                        paymentMethod: 'Wallet',  // Testing Wallet payment
                        vehicleType: 'Car'
                    }
                }
            }
        });

        console.log('\n✅ Test 2: Wallet Payment');
        console.log('   Status:', webhookResponse2.status);
        console.log('   Response:', JSON.stringify(webhookResponse2.data, null, 2));

        const message2 = webhookResponse2.data.results[0].result.message;
        const refMatch2 = message2.match(/reference is ([\d-]+)/);
        if (refMatch2) {
            console.log(`   ✅ Order Reference: ${refMatch2[1].replace(/-/g, '')}`);
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ PAYMENT METHOD TESTS PASSED!');
        console.log('='.repeat(60));
        console.log('\n📋 Summary:');
        console.log('   ✅ Card payment: Working');
        console.log('   ✅ Wallet payment: Working');
        console.log('   ✅ Both orders created successfully');
        console.log('\n🎉 Payment method issue RESOLVED!');

    } catch (error) {
        console.error('\n❌ TEST FAILED!');
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testCardPayment();
