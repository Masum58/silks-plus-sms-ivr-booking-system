const geocodingService = require('./src/services/geocodingService');
require('dotenv').config();

async function testWeirdAddress() {
    const address = "103 Monroe Street, Newark, New York 10950";
    console.log(`🧪 Testing Geocoding for: "${address}"`);

    const start = Date.now();
    const coords = await geocodingService.getCoordinates(address);
    const duration = (Date.now() - start) / 1000;

    console.log(`✅ Result: [${coords}]`);
    console.log(`⏱️ Duration: ${duration}s`);
}

testWeirdAddress();
