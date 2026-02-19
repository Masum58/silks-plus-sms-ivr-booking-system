require('dotenv').config();
const taxiCallerService = require('../src/services/taxiCallerService');
const axios = require('axios');

async function testAvailability(companyId, providerId) {
    console.log(`🔍 Testing Availability for CID: ${companyId}, PID: ${providerId}...`);
    const baseUrl = process.env.TAXICALLER_API_URL || 'https://api-rc.taxicaller.net';

    try {
        const token = await taxiCallerService.getAccessToken();
        const bookerToken = await taxiCallerService.getBookerToken();

        const payload = {
            order: {
                company_id: parseInt(companyId),
                provider_id: parseInt(providerId),
                vehicle_type: "1",
                items: [
                    {
                        "@type": "passengers",
                        seq: 0,
                        passenger: {
                            name: "Test User",
                            phone: "+1234567890",
                            email: "test@example.com"
                        },
                        require: { "seats": 1, "wc": 0, "bags": 0 },
                        pay_info: [{ "@t": 5, "data": null }]
                    }
                ],
                route: {
                    nodes: [
                        {
                            location: {
                                name: "3 Austra Parkway, Monroe, NY 10950",
                                coords: [41340058, -74192534]
                            },
                            actions: [{ "@type": "client_action", "item_seq": 0, "action": "in" }],
                            seq: 0,
                            times: { "arrive": { "target": 0, "latest": 0 } }
                        },
                        {
                            location: {
                                name: "7 Van Buren Drive, Monroe, NY 10950",
                                coords: [41332345, -74187654]
                            },
                            actions: [{ "@type": "client_action", "item_seq": 0, "action": "out" }],
                            seq: 1
                        }
                    ]
                }
            }
        };

        try {
            const res = await axios.post(`${baseUrl}/api/v1/booker/availability/order`, payload, {
                headers: { 'Authorization': `Bearer ${bookerToken}` }
            });
            console.log(`✅ SUCCESS! Response:`, JSON.stringify(res.data, null, 2));
        } catch (e) {
            console.log(`❌ Failed: ${e.response?.status} - ${JSON.stringify(e.response?.data)}`);
        }

    } catch (err) {
        console.error('Fatal Error:', err.message);
    }
}

console.log('--- TEST 1: CID 46261, PID 0 ---');
testAvailability('46261', '0').then(() => {
    console.log('\n--- TEST 2: CID 8296, PID 46261 ---');
    return testAvailability('8296', '46261');
});
