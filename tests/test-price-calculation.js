const axios = require('axios');

async function testMultipleDistances() {
    console.log('🧪 Testing Price Calculation with Different Distances...\n');

    const testCases = [
        {
            name: 'Short Trip (1 mile)',
            pickup: '3 Austra Parkway, Monroe, NY',
            dropoff: '7 Van Buren Drive, Monroe, NY',
            expectedDistance: '~1 mile'
        },
        {
            name: 'Medium Trip (3 miles)',
            pickup: 'Hayes Court & Garfield Road, Kiryas Joel',
            dropoff: '3 YD Goldberger Drive, Monroe',
            expectedDistance: '~3 miles'
        },
        {
            name: 'Long Trip (5 miles)',
            pickup: 'Hayes Court & Garfield Road, Kiryas Joel',
            dropoff: '33 Route 17M, Harriman, NY',
            expectedDistance: '~5 miles'
        }
    ];

    for (let i = 0; i < testCases.length; i++) {
        const test = testCases[i];
        console.log(`\n${'='.repeat(60)}`);
        console.log(`Test ${i + 1}: ${test.name}`);
        console.log(`Expected Distance: ${test.expectedDistance}`);
        console.log(`${'='.repeat(60)}`);

        const payload = {
            message: {
                type: 'function-call',
                functionCall: {
                    name: 'bookOrder',
                    parameters: {
                        pickupAddress: test.pickup,
                        deliveryAddress: test.dropoff,
                        customerPhone: '+18453958774',
                        customerName: 'Test Customer',
                        vehicleType: 'Car'
                    }
                }
            }
        };

        try {
            const response = await axios.post('http://localhost:3000/vapi/webhook', payload, {
                timeout: 20000
            });

            if (response.data.results && response.data.results[0]) {
                const result = response.data.results[0].result;
                console.log(`\n📍 Pickup: ${test.pickup}`);
                console.log(`📍 Drop-off: ${test.dropoff}`);
                console.log(`💰 Price: ${result.price || 'Not Available'}`);
                console.log(`📝 Status: ${result.success ? '✅ Success' : '❌ Failed'}`);
                console.log(`🆔 Order ID: ${result.orderId}`);
            }
        } catch (error) {
            console.error(`❌ Error: ${error.message}`);
        }

        // Wait 2 seconds between requests
        if (i < testCases.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log('✅ Testing Complete!');
    console.log(`${'='.repeat(60)}\n`);
}

testMultipleDistances();
