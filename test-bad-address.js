const onroService = require('./src/services/onroService');
require('dotenv').config();

async function testBadAddress() {
    console.log('🧪 Testing Bad Address / Zero Coordinates...');

    // Simulate geocoding failure
    const pickupCoords = [0, 0];
    const deliveryCoords = [0, 0];

    const payload = {
        customerId: process.env.ONRO_CUSTOMER_ID,
        service: { id: "0_17d3kbyR41-zdPFiUQV", options: [] },
        paymentMethod: "Wallet",
        paymentSide: "Sender",
        promoCode: "",
        isScheduled: false,
        pickup: {
            address: "103 Monroe Street, Newark, New York 10950",
            fullName: "Test User",
            phone: "+18126668455",
            coordinates: [-74.226221, 41.3140161],
            customerDescription: "Test weird address",
            schedulePickupNow: false,
            scheduleDateAfter: 0,
            scheduleDateBefore: 0,
            email: ""
        },
        dropoffs: [{
            address: "Another Bad Address",
            fullName: "Receiver",
            phone: "+18126668455",
            coordinates: deliveryCoords,
            scheduleDateAfter: 0,
            scheduleDateBefore: 0,
            buildingBlock: "",
            floor: "",
            room: "",
            placeId: "",
            email: ""
        }],
        vehicleType: {
            id: process.env.ONRO_VEHICLE_TYPE_ID || "0CRbnzYnv4_rQA53K7O5z",
            options: []
        }
    };

    try {
        await onroService.authenticate();
        console.log('   Sending payload with [0,0] coords...');
        const order = await onroService.createBooking(payload);
        console.log('✅ Order created successfully (Unexpected)!');
        console.log('   ID:', order.data.id);
    } catch (error) {
        console.log('❌ Order creation failed (Expected):');
        console.log('   Status:', error.response ? error.response.status : 'Unknown');
        console.log('   Message:', error.response ? JSON.stringify(error.response.data) : error.message);
    }
}

testBadAddress();
