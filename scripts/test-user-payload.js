require('dotenv').config();
const taxiCallerService = require('../src/services/taxiCallerService');
const axios = require('axios');

async function testUserPayload() {
    console.log('🔍 Testing User Provided Payload...');
    const baseUrl = 'https://api-rc.taxicaller.net';

    try {
        const bookerToken = await taxiCallerService.getBookerToken();

        const payload = {
            "order": {
                "company_id": 46261,
                "provider_id": 0,
                "vehicle_type": "1",
                "items": [
                    {
                        "@type": "passengers",
                        "seq": 0,
                        "passenger": {
                            "name": "Test User",
                            "phone": "+1234567890",
                            "email": "test@example.com"
                        },
                        "require": { "seats": 1, "wc": 0, "bags": 0 },
                        "pay_info": [{ "@t": 5, "data": null }]
                    }
                ],
                "route": {
                    "nodes": [
                        {
                            "location": {
                                "name": "3 Austra Parkway, Monroe, NY 10950",
                                "coords": [41340058, -74192534]
                            },
                            "actions": [{ "@type": "client_action", "item_seq": 0, "action": "in" }],
                            "seq": 0,
                            "times": { "arrive": { "target": 0, "latest": 0 } }
                        },
                        {
                            "location": {
                                "name": "7 Van Buren Drive, Monroe, NY 10950",
                                "coords": [41332345, -74187654]
                            },
                            "actions": [{ "@type": "client_action", "item_seq": 0, "action": "out" }],
                            "seq": 1
                        }
                    ]
                }
            }
        };

        const res = await axios.post(`${baseUrl}/api/v1/booker/availability/order`, payload, {
            headers: { 'Authorization': `Bearer ${bookerToken}` }
        });
        console.log('✅ SUCCESS! User payload worked:', JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.log('❌ FAILED with user payload:', e.response?.status, JSON.stringify(e.response?.data));
    }
}

testUserPayload();
