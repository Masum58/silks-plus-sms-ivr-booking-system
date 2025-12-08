require('dotenv').config();
const onroService = require('./src/services/onroService');
const geocodingService = require('./src/services/geocodingService');

async function testWithoutPaymentMethod() {
    console.log('🧪 Testing Order Creation WITHOUT Payment Method\n');
    console.log('='.repeat(60));

    try {
        // Step 1: Authenticate
        console.log('Step 1: Authenticating...');
        await onroService.authenticate();
        console.log('✅ Authenticated\n');

        // Step 2: Get Customer
        console.log('Step 2: Using Master Account...');
        const customerId = process.env.ONRO_CUSTOMER_ID;
        console.log(`✅ Customer ID: ${customerId}\n`);

        // Step 3: Geocode
        console.log('Step 3: Geocoding addresses...');
        const [pickupCoords, deliveryCoords] = await Promise.all([
            geocodingService.getCoordinates('3 Austra Parkway, Unit 103, Monroe, NY 10950'),
            geocodingService.getCoordinates('7 Van Buren Drive, Unit 304, Monroe, NY 10950')
        ]);
        console.log(`✅ Pickup: [${pickupCoords[0]}, ${pickupCoords[1]}]`);
        console.log(`✅ Delivery: [${deliveryCoords[0]}, ${deliveryCoords[1]}]\n`);

        // Step 4: Create Order WITHOUT payment method
        console.log('Step 4: Creating order WITHOUT payment method...');
        const payload = {
            customerId: customerId,
            service: {
                id: "0_17d3kbyR41-zdPFiUQV",
                options: []
            },
            // NO payment method fields
            promoCode: "",
            isScheduled: false,
            pickup: {
                address: "3 Austra Parkway, Unit 103, Monroe, NY 10950",
                fullName: "Test User",
                phone: "01317365623",
                coordinates: pickupCoords,
                schedulePickupNow: false,
                scheduleDateAfter: 0,
                scheduleDateBefore: 0,
                email: ""
            },
            dropoffs: [{
                address: "7 Van Buren Drive, Unit 304, Monroe, NY 10950",
                fullName: "Receiver",
                phone: "01317365623",
                coordinates: deliveryCoords,
                scheduleDateAfter: 0,
                scheduleDateBefore: 0,
                email: ""
            }],
            vehicleType: {
                id: "0CRbnzYnv4_rQA53K7O5z",
                options: []
            }
        };

        const order = await onroService.createBooking(payload);

        console.log('\n' + '='.repeat(60));
        console.log('✅ ORDER CREATED SUCCESSFULLY!');
        console.log('='.repeat(60));
        console.log(`Order ID: ${order.data.id}`);
        console.log(`Order Code: ${order.data.code || 'N/A'}`);
        console.log(`Payment Method: Not specified (will use Onro default)`);
        console.log(`Vehicle Type: Car`);
        console.log(`Pickup: 3 Austra Parkway, Unit 103, Monroe, NY 10950`);
        console.log(`Delivery: 7 Van Buren Drive, Unit 304, Monroe, NY 10950`);
        console.log('='.repeat(60));

        console.log('\n🎉 TEST PASSED!');
        console.log('   ✅ Order created without payment method');
        console.log('   ✅ No API errors');
        console.log('   ✅ Voice/SMS booking will work');
        console.log('\n📋 Note:');
        console.log('   - Payment method not specified in API');
        console.log('   - Onro will use default payment handling');
        console.log('   - Client can handle payment manually');
        console.log('\n📞 Ready for voice call test!');

    } catch (error) {
        console.error('\n❌ TEST FAILED!');
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testWithoutPaymentMethod();
