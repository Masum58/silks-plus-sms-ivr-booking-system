const geocodingService = require('./src/services/geocodingService');
require('dotenv').config();

async function testAustraAddress() {
    const address = "3 Parkway, Monroe, New York NY 10950";
    console.log(`🧪 Testing Geocoding for: "${address}"`);

    const start = Date.now();
    try {
        const coords = await geocodingService.getCoordinates(address);
        const duration = (Date.now() - start) / 1000;

        console.log(`✅ Result: [${coords}]`);
        console.log(`⏱️ Duration: ${duration}s`);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testAustraAddress();
