require('dotenv').config();
const taxiCallerService = require('../src/services/taxiCallerService');
const geocodingService = require('../src/services/geocodingService');

async function comparePrices() {
    const locations = [
        ["6 Fillmore Court, Kiryas Joel, NY", "12 Prag Boulevard, Kiryas Joel, NY"], // Short
        ["Austra Parkway, Monroe, NY", "Lake Street, Monroe, NY"], // Medium
        ["Kiryas Joel, NY", "Harriman, NY"], // Different zones
        ["Monroe, NY", "Woodbury Common, NY"] // Further
    ];

    console.log('🧪 Comparing Prices for Different Locations...');

    for (const [pickup, delivery] of locations) {
        console.log(`\n📍 ${pickup} ➡️ ${delivery}`);
        try {
            const pCoords = await geocodingService.getCoordinates(pickup);
            const dCoords = await geocodingService.getCoordinates(delivery);

            const estimate = await taxiCallerService.getFareEstimate({
                pickupAddress: pickup,
                pickupCoordinates: pCoords,
                dropoffAddress: delivery,
                dropoffCoordinates: dCoords,
                vehicleType: "1"
            });

            console.log(`✅ Price: ${estimate.price}`);
            console.log(`📊 Raw Amount: ${estimate.rawPrice}`);
        } catch (err) {
            console.error(`❌ Error: ${err.message}`);
        }
    }
}

comparePrices();
