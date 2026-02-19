const axios = require('axios');
require('dotenv').config();

async function comparePrices() {
    console.log('🧪 Comparing Prices for 75 Bakertown to 27 Satmar...');

    const companyId = process.env.TAXICALLER_COMPANY_ID;
    const apiKey = process.env.TAXICALLER_API_KEY;
    const baseUrl = process.env.TAXICALLER_API_URL || 'https://api.taxicaller.net';

    try {
        const adminJwtRes = await axios.get(`${baseUrl}/AdminService/v1/jwt/for-key`, {
            params: { key: apiKey, sub: '*', ttl: 900 }
        });
        const adminJwt = adminJwtRes.data.token || adminJwtRes.data;
        const authHeader = `Bearer ${adminJwt}`;

        const creds = { creds: { company_id: parseInt(companyId), ops: 3 } };
        const tokenRes = await axios.get(`${baseUrl}/api/v1/booker/booker-token`, {
            headers: { 'Authorization': authHeader },
            params: { data: JSON.stringify(creds) }
        });
        const bookerToken = tokenRes.data.token || tokenRes.data.jwt || tokenRes.data;
        const bookerAuthHeader = `Bearer ${bookerToken}`;

        const scenarios = [
            { vt: "1", pid: companyId, name: "Vehicle Type 1, Provider Co" },
            { vt: "2", pid: companyId, name: "Vehicle Type 2, Provider Co" },
            { vt: "1", pid: "0", name: "Vehicle Type 1, Provider 0" },
            { vt: "2", pid: "0", name: "Vehicle Type 2, Provider 0" },
            { vt: "0", pid: "0", name: "Vehicle Type 0, Provider 0" }
        ];

        for (const s of scenarios) {
            console.log(`\nScenario: ${s.name}`);
            const payload = {
                order: {
                    company_id: parseInt(companyId),
                    provider_id: parseInt(s.pid),
                    vehicle_type: s.vt,
                    items: [{
                        "@type": "passengers",
                        seq: 0,
                        passenger: { name: "Test", phone: "+880123456789", email: "audit@example.com" },
                        require: { seats: 1, wc: 0, bags: 0 },
                        pay_info: [{ "@t": 5, data: null }]
                    }],
                    route: {
                        nodes: [
                            { location: { name: "75 Bakertown Road", coords: [-74159437, 41339160] }, actions: [{ "@type": "client_action", item_seq: 0, action: "in" }], seq: 0 },
                            { location: { name: "27 Satmar Drive", coords: [-74166288, 41343555] }, actions: [{ "@type": "client_action", item_seq: 0, action: "out" }], seq: 1 }
                        ]
                    }
                }
            };

            try {
                const res = await axios.post(`${baseUrl}/api/v1/booker/availability/order`, payload, {
                    headers: { 'Authorization': bookerAuthHeader }
                });
                const amount = res.data.slots?.[0]?.fare_quote?.amount;
                console.log(`✅ Price: ${amount ? amount : 'N/A'}`);
            } catch (err) {
                console.log(`❌ Failed: ${err.message}`);
            }
        }

    } catch (err) {
        console.error('Setup failed:', err.message);
    }
}

comparePrices();
