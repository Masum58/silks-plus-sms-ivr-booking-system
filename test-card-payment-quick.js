require('dotenv').config();
const onroService = require('./src/services/onroService');
const customerService = require('./src/services/customerService');
const geocodingService = require('./src/services/geocodingService');

async function quickCardPaymentTest() {
    console.log('💳 Quick Card Payment Test\n');
    console.log('='.repeat(60));

    try {
        // Step 1: Authenticate
        console.log('Step 1: Authenticating...');
        await onroService.authenticate();
        console.log('✅ Authenticated\n');

        // Step 2: Get Customer
        console.log('Step 2: Getting Customer...');
        const customerId = process.env.ONRO_CUSTOMER_ID;
        console.log(`✅ Customer ID: ${customerId}\n`);

        // Step 3: Geocode
        console.log('Step 3: Geocoding...');
        const [pickupCoords, deliveryCoords] = await Promise.all([
            geocodingService.getCoordinates('3 Austra Parkway, Monroe, NY 10950'),
            geocodingService.getCoordinates('7 Van Buren Drive, Monroe, NY 10950')
        ]);
        console.log(`✅ Pickup: [${pickupCoords[0]}, ${pickupCoords[1]}]`);
        console.log(`✅ Delivery: [${deliveryCoords[0]}, ${deliveryCoords[1]}]\n`);

        // Step 4: Create Order with CARD payment
        console.log('Step 4: Creating Order with CARD payment...');
        const payload = {
            customerId: customerId,
            service: {
                id: "0_17d3kbyR41-zdPFiUQV",
                options: []
            },
            paymentMethod: "Card",  // ← Testing Card payment
            paymentSide: "Sender",
            promoCode: "",
            isScheduled: false,
            pickup: {
                address: "3 Austra Parkway, Monroe, NY 10950",
                fullName: "Test User",
                phone: "01317365623",
                coordinates: pickupCoords,
                schedulePickupNow: false,
                scheduleDateAfter: 0,
                scheduleDateBefore: 0,
                email: ""
            },
            dropoffs: [{
                address: "7 Van Buren Drive, Monroe, NY 10950",
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
        console.log('✅ ORDER CREATED WITH CARD PAYMENT!');
        console.log('='.repeat(60));
        console.log(`Order ID: ${order.data.id}`);
        console.log(`Order Code: ${order.data.code || 'N/A'}`);
        console.log(`Payment Method: Card`);
        console.log(`Status: Success`);
        console.log('='.repeat(60));

        console.log('\n🎉 CARD PAYMENT WORKING!');
        console.log('   ✅ No "invalid payment method" error');
        console.log('   ✅ Order created successfully');
        console.log('   ✅ Payment method accepted by Onro');
        console.log('\n📞 Ready for voice call test!');

    } catch (error) {
        console.error('\n❌ TEST FAILED!');
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

quickCardPaymentTest();
