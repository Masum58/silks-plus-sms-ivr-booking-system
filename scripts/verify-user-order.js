require('dotenv').config();
const axios = require('axios');
const TaxiCallerService = require('../src/services/taxiCallerService');

const service = require('../src/services/taxiCallerService');
async function verifyRecentOrder() {
    const phone = '+8801317365623';

    console.log(`🔍 Checking recent orders for: ${phone}`);
    try {
        const orders = await service.getActiveOrders(phone);
        console.log('✅ Found orders:', JSON.stringify(orders, null, 2));

        if (orders.length === 0) {
            console.log('ℹ️ No active orders found. Checking if there are recently completed/cancelled ones...');
            // In a real scenario, we might check history, but for now let's see active.
        }
    } catch (e) {
        console.error('❌ Error fetching orders:', e.message);
    }
}

verifyRecentOrder();
