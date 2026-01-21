const axios = require('axios');
const taxiCallerService = require('../src/services/taxiCallerService');

async function checkVehicleTypes() {
    try {
        const authHeader = await taxiCallerService.getAuthHeader();
        const res = await axios.get('https://api-rc.taxicaller.net/api/v1/company/8296/vehicle/type/list', {
            headers: { 'Authorization': authHeader }
        });
        console.log('Vehicle Types:', JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.error(e.response?.data || e.message);
    }
}
checkVehicleTypes();
