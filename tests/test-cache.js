const geocodingService = require('../src/services/geocodingService');

async function testGeocodingCache() {
    console.log('Testing Geocoding Cache Speed...');

    // 1. Test a cached alias
    const start1 = Date.now();
    const coords1 = await geocodingService.getCoordinates('Austra Parkway');
    const duration1 = Date.now() - start1;
    console.log(`- Request (Austra Parkway): [${coords1}] | Duration: ${duration1}ms`);

    // 2. Test another cached alias
    const start2 = Date.now();
    const coords2 = await geocodingService.getCoordinates('hayes corner');
    const duration2 = Date.now() - start2;
    console.log(`- Request (hayes corner): [${coords2}] | Duration: ${duration2}ms`);

    // 3. Test non-cached (Google Maps)
    const start3 = Date.now();
    const coords3 = await geocodingService.getCoordinates('100 Main Street, Monroe, NY');
    const duration3 = Date.now() - start3;
    console.log(`- Request (100 Main Street): [${coords3}] | Duration: ${duration3}ms`);

    if (duration1 < 10 && duration2 < 10) {
        console.log('\n✅ CACHE IS WORKING! (Sub-10ms response for aliases)');
    } else {
        console.warn('\n⚠️ CACHE MAY NOT BE WORKING as expected.');
    }
}

testGeocodingCache();
