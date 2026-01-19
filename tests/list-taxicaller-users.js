require('dotenv').config();
const axios = require('axios');

async function listTaxiCallerUsers() {
    console.log('🔍 Fetching TaxiCaller User List (Header API Key)...');

    const apiToken = process.env.TAXICALLER_API_KEY;
    const companyId = process.env.TAXICALLER_COMPANY_ID;
    const apiUrl = process.env.TAXICALLER_API_URL || 'https://api-rc.taxicaller.net';

    try {
        console.log('🔄 Fetching Users from ' + apiUrl + '...');
        const client = axios.create({ baseURL: apiUrl });

        const response = await client.get(`/api/v1/company/${companyId}/user`, {
            headers: {
                'Authorization': `Bearer ${apiToken}`
            }
        });

        console.log('\n✅ USER LIST:');
        if (Array.isArray(response.data)) {
            response.data.forEach(user => {
                console.log(`- Username: ${user.username}, Role: ${user.role}, Email: ${user.email || 'N/A'}`);
            });
        } else {
            console.log(JSON.stringify(response.data, null, 2));
        }

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

listTaxiCallerUsers();
