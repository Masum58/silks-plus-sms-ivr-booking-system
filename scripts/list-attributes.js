const taxiCallerService = require('../src/services/taxiCallerService');

async function listAttributes() {
    console.log('🔍 Fetching TaxiCaller Attributes (Corrected Endpoint)...');
    try {
        const token = await taxiCallerService.getAccessToken();
        const response = await taxiCallerService.client.get('/api/v1/admin/attribute', {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { company_id: process.env.TAXICALLER_COMPANY_ID }
        });
        console.log('✅ Attributes Found:');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Failed to fetch attributes:', error.message);
        if (error.response) {
            console.error('   Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

listAttributes();
