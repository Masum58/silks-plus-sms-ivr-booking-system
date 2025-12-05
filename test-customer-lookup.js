const customerService = require('./src/services/customerService');

async function testCustomerLookup() {
    try {
        // Use a phone number that likely exists (e.g. from previous tests or the one in .env if any)
        // Or use the one I used in previous manual tests: +18126668455
        const phone = '+18126668455';

        console.log(`🔍 Looking up customer: ${phone}`);
        const customerId = await customerService.findCustomerByPhone(phone);

        if (customerId) {
            console.log(`✅ Found customer ID: ${customerId}`);
        } else {
            console.log('❌ Customer not found.');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testCustomerLookup();
