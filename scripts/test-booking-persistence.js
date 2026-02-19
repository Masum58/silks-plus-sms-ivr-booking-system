const axios = require('axios');
require('dotenv').config();

async function testBookingAndStatus() {
    console.log('🚀 Testing Booking + Status Follow-up...');

    const companyId = process.env.TAXICALLER_COMPANY_ID;
    const apiKey = process.env.TAXICALLER_API_KEY;
    const baseUrl = process.env.TAXICALLER_API_URL || 'https://api.taxicaller.net';

    try {
        // 1. Get Admin JWT
        const adminJwtRes = await axios.get(`${baseUrl}/AdminService/v1/jwt/for-key`, {
            params: { key: apiKey, sub: '*', ttl: 900 }
        });
        const adminJwt = adminJwtRes.data.token || adminJwtRes.data;

        // 2. Get Booker Token
        const tokenRes = await axios.get(`${baseUrl}/api/v1/booker/booker-token`, {
            headers: { 'Authorization': `Bearer ${adminJwt}` },
            params: { data: JSON.stringify({ creds: { company_id: parseInt(companyId), ops: 3 } }) }
        });
        const bookerToken = tokenRes.data.token || tokenRes.data.jwt || tokenRes.data;
        const bookerAuthHeader = `Bearer ${bookerToken}`;

        // 3. Create Booking (Re-using the "75 Bakertown" addresses)
        console.log('   Creating booking...');
        const payload = {
            order: {
                company_id: parseInt(companyId),
                provider_id: parseInt(companyId),
                vehicle_type: "2",
                items: [{
                    "@type": "passengers",
                    seq: 0,
                    passenger: { name: "Audit Test", phone: "+880123456789", email: "audit@example.com" },
                    require: { seats: 1, wc: 0, bags: 0 },
                    pay_info: [{ "@t": 5, data: null }]
                }],
                route: {
                    nodes: [
                        { location: { name: "75 Bakertown Road", coords: [-74159437, 41339160] }, actions: [{ "@type": "client_action", item_seq: 0, action: "in" }], seq: 0 },
                        { location: { name: "27 Satmar Drive", coords: [-74166288, 41343555] }, actions: [{ "@type": "client_action", item_seq: 0, action: "out" }], seq: 1 }
                    ]
                }
            },
            dispatch_options: { auto_assign: false }
        };

        const createRes = await axios.post(`${baseUrl}/api/v1/booker/order`, payload, {
            headers: { 'Authorization': bookerAuthHeader }
        });

        const orderId = createRes.data.order?.order_id || createRes.data.order_id || createRes.data.id;
        console.log(`✅ Booking Created! ID: ${orderId}`);

        // 4. Get Status Immediately
        console.log('   Fetching status for the new order...');
        const statusRes = await axios.get(`${baseUrl}/api/v1/booker/order/${orderId}`, {
            headers: { 'Authorization': bookerAuthHeader }
        });

        console.log('📝 Order Metadata from TaxiCaller:');
        console.log(JSON.stringify(statusRes.data, null, 2));

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        if (error.response) {
            console.error('   Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testBookingAndStatus();
