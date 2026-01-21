const axios = require('axios');
const taxiCallerService = require('../src/services/taxiCallerService');

async function checkZones() {
    console.log('🔍 Checking Zones List...');
    try {
        const authHeader = await taxiCallerService.getAuthHeader();
        const res = await axios.get('https://api-rc.taxicaller.net/api/v1/company/8296/zone/list', {
            headers: { 'Authorization': authHeader }
        });
        console.log('Zones:', JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.error('❌ Error fetching zones:', e.response?.data || e.message);
    }
}
checkZones();
