require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

// Simulate Vapi webhook call
async function simulateVapiCall() {
    console.log('🎭 Simulating Vapi Webhook Call with Fixes...\n');

    const app = express();
    app.use(bodyParser.json());

    // Import the router
    const vapiRouter = require(path.join(__dirname, '../src/routes/vapi'));
    app.use('/vapi', vapiRouter);

    // Simulate Vapi request body with data from latest transcript
    const mockPayload = {
        message: {
            type: 'tool-calls',
            toolCalls: [
                {
                    id: 'call_123',
                    type: 'function',
                    function: {
                        name: 'bookOrder',
                        arguments: JSON.stringify({
                            pickupAddress: '142 Route 17M, Monroe, NY 10950',
                            deliveryAddress: '320 East Smith Club Road, Central Valley, NY',
                            customerPhone: '+1 938 400 3338',
                            paymentMethod: 'Card',
                            vehicleType: 'Car'
                        })
                    }
                }
            ]
        }
    };

    const req = {
        method: 'POST',
        url: '/webhook',
        body: mockPayload,
        headers: { 'content-type': 'application/json' }
    };

    const res = {
        statusCode: 200,
        status: function (code) {
            this.statusCode = code;
            return this;
        },
        json: function (data) {
            console.log('📤 Response to Vapi (Status ' + this.statusCode + '):\n');
            console.log(JSON.stringify(data, null, 2));

            if (data.results && data.results[0]) {
                const result = data.results[0];
                const parsedResult = JSON.parse(result.result);
                console.log('\n' + '='.repeat(60));
                console.log('✅ VAPI WILL RECEIVE:');
                console.log('='.repeat(60));
                console.log(`Success: ${parsedResult.success}`);
                console.log(`Message: ${parsedResult.message}`);
                console.log('='.repeat(60));
            } else if (data.message) {
                console.log('\n❌ ERROR MESSAGE:', data.message);
            }
        }
    };

    console.log('📞 Calling Vapi Webhook...\n');

    vapiRouter(req, res, (err) => {
        if (err) console.error('❌ Router Error:', err);
    });
}

simulateVapiCall().catch(console.error);
