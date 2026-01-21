const axios = require('axios');
const taxiCallerService = require('../src/services/taxiCallerService');

async function checkFareEstimate() {
    console.log('🔍 Checking Fare Estimate from TaxiCaller...');

    try {
        const bookerToken = await taxiCallerService.getBookerToken();
        const authHeader = `Bearer ${bookerToken}`;

        const params = {
            pickup: "Beer Sheva Street, Monroe, NY",
            destination: "60 Morong Drive, Monroe, NY",
            vehicle_class: "Standard",
            passengers: 1
        };

        const res = await axios.get('https://api-rc.taxicaller.net/api/v1/booker/fare', {
            params: params,
            headers: { 'Authorization': authHeader }
        });

        console.log('Fare Estimate Response:', JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.error('❌ Error fetching fare:', e.response?.data || e.message);
    }
}

checkFareEstimate();
