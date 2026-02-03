require('dotenv').config();
const geocodingService = require('../src/services/geocodingService');

async function testAliases() {
    console.log('🧪 Testing Address Alias Safety Net...');
    console.log('====================================');

    const testCases = [
        // 1. Direct Alias Match
        { input: "Tutania", expected: "Titania Boulevard, Monroe, NY" },
        // 2. Number + Alias
        { input: "15 Tutania", expected: "15 Titania Boulevard, Monroe, NY" },
        // 3. Known Street with Typos (handled by alias map keys)
        { input: "Austro", expected: "Austra Parkway, Monroe, NY" },
        // 4. Special Landmark
        { input: "KJ", expected: "Kiryas Joel, NY" },
        // 5. Standard Address (Pass-through) - General NYC
        { input: "Empire State Building, New York", expected: "Empire State Building, New York, NY" }, // Should append NY if missing
        { input: "123 Broadway, Brooklyn", expected: "123 Broadway, Brooklyn, NY" }, // Should detect Brooklyn and NOT append Monroe
        // 6. Local Address (Pass-through)
        { input: "123 Main St", expected: "123 North Main Street, Monroe, NY" }, // Main Street is aliased to North Main!
    ];

    let passed = 0;

    for (const test of testCases) {
        console.log(`\n🔹 Input: "${test.input}"`);
        const coords = await geocodingService.getCoordinates(test.input);

        if (coords) {
            console.log(`   ✅ Success! Coords: [${coords[0]}, ${coords[1]}]`);
            passed++;
        } else {
            console.error(`   ❌ Failed to geocode.`);
        }
    }

    console.log('\n====================================');
    console.log(`Test Complete: ${passed}/${testCases.length} addresses resolved.`);
    process.exit(0);
}

testAliases();
