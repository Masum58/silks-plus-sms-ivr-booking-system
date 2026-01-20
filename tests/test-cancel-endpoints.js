const axios = require('axios');
require('dotenv').config();

const taxiCallerService = require('../src/services/taxiCallerService');

async function testCancellationEndpoints() {
    console.log('🧪 Testing Cancellation Endpoints...');

    // 1. Create a booking first to get a fresh ID
    console.log('Creating a booking...');
    const bookingData = {
        pickupAddress: "72 Bailey Farm Road, Monroe, NY",
        dropoffAddress: "498 Woodbury Commons Drive, Central Valley, NY",
        customerPhone: "8456371211",
        customerName: "Test User"
    };

    const result = await taxiCallerService.createBooking(bookingData);
    const orderId = result.order?.order_id || result.order_id || result.id;
    console.log(`✅ Created Order ID: ${orderId}`);

    const bookerToken = await taxiCallerService.getBookerToken();
    const bookerAuthHeader = `Bearer ${bookerToken}`;

    const endpoints = [
        { method: 'DELETE', url: `/api/v1/booker/order/${orderId}` },
        { method: 'DELETE', url: `/api/v1/booker/order/${orderId}?company_id=${process.env.TAXICALLER_COMPANY_ID}` },
        { method: 'POST', url: `/api/v1/booker/order/${orderId}/cancel` },
        { method: 'POST', url: `/api/v1/booker/order/${orderId}/cancel?company_id=${process.env.TAXICALLER_COMPANY_ID}` }
    ];

    for (const endpoint of endpoints) {
        console.log(`\nTesting ${endpoint.method} ${endpoint.url}...`);
        try {
            const response = await axios({
                method: endpoint.method,
                url: `${process.env.TAXICALLER_API_URL || 'https://api-rc.taxicaller.net'}${endpoint.url}`,
                headers: { 'Authorization': bookerAuthHeader }
            });
            console.log(`✅ SUCCESS: ${JSON.stringify(response.data)}`);
            return; // Stop if one works
        } catch (error) {
            console.log(`❌ FAILED: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
        }
    }

    // Try AdminService as well
    console.log('\nTesting AdminService /AdminService/v1/order/cancel...');
    try {
        const authHeader = await taxiCallerService.getAuthHeader();
        const response = await axios.post(
            `${process.env.TAXICALLER_API_URL || 'https://api-rc.taxicaller.net'}/AdminService/v1/order/cancel`,
            { order_id: orderId },
            { headers: { 'Authorization': authHeader } }
        );
        console.log(`✅ SUCCESS (AdminService): ${JSON.stringify(response.data)}`);
    } catch (error) {
        console.log(`❌ FAILED (AdminService): ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
    }
}

testCancellationEndpoints();
