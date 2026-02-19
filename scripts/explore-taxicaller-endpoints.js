require('dotenv').config();
const taxiCallerService = require('../src/services/taxiCallerService');
const axios = require('axios');

async function exploreEndpoints() {
    console.log('🔍 Exploring TaxiCaller Endpoints...');
    const companyId = process.env.TAXICALLER_COMPANY_ID;
    const baseUrl = process.env.TAXICALLER_API_URL || 'https://api-rc.taxicaller.net';

    try {
        const token = await taxiCallerService.getAccessToken();
        const bookerToken = await taxiCallerService.getBookerToken();

        const variations = [
            { name: 'Company Order List', url: `/api/v1/company/${companyId}/order/list`, token: token },
            { name: 'AdminService Order List', url: `/AdminService/v1/order/list`, token: token },
            { name: 'AdminService Active Jobs', url: `/AdminService/v1/job/list`, token: token },
            { name: 'Booker Order List', url: `/api/v1/booker/order`, token: bookerToken }
        ];

        for (const v of variations) {
            console.log(`\nTesting ${v.name}: GET ${v.url}...`);
            try {
                const res = await axios.get(`${baseUrl}${v.url}`, {
                    headers: { 'Authorization': `Bearer ${v.token}` }
                });
                console.log(`✅ SUCCESS [${v.name}]: ${Array.isArray(res.data.list) ? res.data.list.length : (Array.isArray(res.data) ? res.data.length : 'Object')} items found`);
            } catch (e) {
                console.log(`❌ FAILED [${v.name}]: ${e.response?.status} - ${e.message}`);
            }
        }

    } catch (err) {
        console.error('Fatal Error:', err.message);
    }
}

exploreEndpoints();
