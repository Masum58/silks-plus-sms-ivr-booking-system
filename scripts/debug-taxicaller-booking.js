require('dotenv').config();
const taxiCallerService = require('../src/services/taxiCallerService');

async function debugBooking() {
    console.log('🚀 Starting Booker Token Flow Debug...');
    console.log(`   API URL: ${process.env.TAXICALLER_API_URL}`);
    console.log(`   Company ID: ${process.env.TAXICALLER_COMPANY_ID}`);

    const bookingData = {
        customerName: "Debug User",
        customerPhone: "+8801317365623",
        pickupAddress: "123 Debug Street, NY",
        dropoffAddress: "456 Test Avenue, NY",
        driverGender: "Female",
        vehicleType: "2"
    };

    try {
        // 1. Get Auth Header (via AdminService)
        console.log('\n🔐 Authenticating (via /AdminService/v1/jwt/for-key)...');
        const tokenResponse = await taxiCallerService.client.get('/AdminService/v1/jwt/for-key', {
            params: {
                key: process.env.TAXICALLER_API_KEY,
                sub: 'ivr',
                ttl: 900
            }
        });
        const token = tokenResponse.data.token || tokenResponse.data;
        const authHeader = `Bearer ${token}`;
        console.log('✅ Authenticated');

        // 2. Get Booker Token (Correct Flow with data param)
        console.log('\n🎟️  Fetching Booker Token...');
        let bookerToken;
        try {
            const creds = {
                creds: {
                    company_id: parseInt(process.env.TAXICALLER_COMPANY_ID),
                    ops: 3 // 3 likely means permission level
                }
            };

            const bookerTokenResponse = await taxiCallerService.client.get('/api/v1/booker/booker-token', {
                headers: { 'Authorization': authHeader },
                params: {
                    data: JSON.stringify(creds)
                }
            });

            bookerToken = bookerTokenResponse.data.token || bookerTokenResponse.data.jwt || bookerTokenResponse.data;
            if (typeof bookerToken === 'object' && bookerToken.token) bookerToken = bookerToken.token;

            console.log('✅ Booker Token Acquired');
        } catch (err) {
            console.error('❌ Failed to get Booker Token:', err.message);
            if (err.response) console.error('   Status:', err.response.status, JSON.stringify(err.response.data));
            return; // Stop if we can't get the token
        }

        const bookerAuthHeader = `Bearer ${bookerToken}`;

        // 3. Create Booking (Using Booker Token)
        console.log('\n📦 Creating Booking (Testing /api/v1/booker/order with Booker Token)...');

        // Use endpoint without ID for creation
        const endpoint = `/api/v1/booker/order`;

        const payload = {
            order: {
                company_id: parseInt(process.env.TAXICALLER_COMPANY_ID),
                provider_id: 0,
                items: [
                    {
                        "@type": "passengers",
                        seq: 0,
                        passenger: {
                            name: bookingData.customerName,
                            phone: bookingData.customerPhone,
                            email: "debug@example.com"
                        },
                        client_id: 0, // Guest Booking
                        require: {
                            seats: 1,
                            wc: 0,
                            bags: 0
                        },
                        pay_info: [
                            {
                                "@t": 0, // CASH
                                "data": null
                            }
                        ]
                    }
                ],
                route: {
                    nodes: [
                        {
                            location: { name: bookingData.pickupAddress },
                            actions: [{ "@type": "client_action", item_seq: 0, action: "in" }],
                            seq: 0,
                            // Set pickup time to 1 hour from now (Advance Booking)
                            times: {
                                arrive: {
                                    target: Math.floor(Date.now() / 1000) + 3600, // 1 hour later
                                    latest: 0
                                }
                            }
                        },
                        {
                            location: { name: bookingData.dropoffAddress },
                            actions: [{ "@type": "client_action", item_seq: 0, action: "out" }],
                            seq: 1
                        }
                    ]
                }
            }
        };

        console.log(`\n🚀 Sending POST to ${endpoint}...`);
        const response = await taxiCallerService.client.post(endpoint, payload, {
            headers: { 'Authorization': bookerAuthHeader }
        });

        const order = response.data;
        console.log('✅ Booking Response:', JSON.stringify(order, null, 2));
        console.log(`\n🎉 SUCCESS! Order Created.`);

    } catch (error) {
        console.error('\n❌ Debug Failed!');
        console.error('   Error:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

debugBooking();
