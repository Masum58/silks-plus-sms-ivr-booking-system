require('dotenv').config();
const smsParser = require('./src/services/smsParser');
const geocodingService = require('./src/services/geocodingService');
const onroService = require('./src/services/onroService');
const customerService = require('./src/services/customerService');

async function testSMSBooking() {
    console.log('📱 Testing SMS Booking Flow\n');
    console.log('='.repeat(60));

    try {
        // Test SMS message
        const testSMS = "Book from 3 Austra Parkway, Unit 103, Monroe, NY 10950 to 7 Van Buren Drive, Unit 304, Monroe, NY 10950";
        const customerPhone = "01317365623";

        console.log('📩 Incoming SMS:');
        console.log(`   From: ${customerPhone}`);
        console.log(`   Message: "${testSMS}"\n`);

        // Step 1: Parse SMS
        console.log('Step 1: Parsing SMS...');
        const parsed = smsParser.parseBookingMessage(testSMS);
        console.log(`   ✅ Is Booking Request: ${parsed.isBookingRequest}`);
        console.log(`   ✅ Pickup: ${parsed.pickup}`);
        console.log(`   ✅ Delivery: ${parsed.delivery}\n`);

        if (!parsed.isBookingRequest || !parsed.pickup || !parsed.delivery) {
            console.log('❌ SMS parsing failed!');
            return;
        }

        // Step 2: Geocode addresses
        console.log('Step 2: Geocoding Addresses...');
        const [pickupCoords, deliveryCoords] = await Promise.all([
            geocodingService.getCoordinates(parsed.pickup),
            geocodingService.getCoordinates(parsed.delivery)
        ]);
        console.log(`   ✅ Pickup: [${pickupCoords[0]}, ${pickupCoords[1]}]`);
        console.log(`   ✅ Delivery: [${deliveryCoords[0]}, ${deliveryCoords[1]}]\n`);

        // Step 3: Authenticate with Onro
        console.log('Step 3: Authenticating with Onro...');
        await onroService.authenticate();
        console.log('   ✅ Authenticated\n');

        // Step 4: Get/Create Customer
        console.log('Step 4: Getting Customer...');
        let customerId;
        try {
            customerId = await customerService.getOrCreateCustomer({
                phone: customerPhone,
                name: 'SMS Customer',
                email: null
            });
            console.log(`   ✅ Customer ID: ${customerId}\n`);
        } catch (error) {
            console.log('   ⚠️  Using Master Account\n');
            customerId = process.env.ONRO_CUSTOMER_ID;
        }

        // Step 5: Create Order
        console.log('Step 5: Creating Order...');
        const payload = {
            customerId: customerId,
            service: {
                id: "0_17d3kbyR41-zdPFiUQV",
                options: []
            },
            promoCode: "",
            isScheduled: false,
            pickup: {
                address: parsed.pickup,
                fullName: "SMS Customer",
                phone: customerPhone,
                coordinates: pickupCoords,
                schedulePickupNow: false,
                scheduleDateAfter: 0,
                scheduleDateBefore: 0,
                email: ""
            },
            dropoffs: [{
                address: parsed.delivery,
                fullName: "Receiver",
                phone: customerPhone,
                coordinates: deliveryCoords,
                scheduleDateAfter: 0,
                scheduleDateBefore: 0,
                email: ""
            }],
            vehicleType: {
                id: "0CRbnzYnv4_rQA53K7O5z", // Car
                options: []
            }
        };

        const order = await onroService.createBooking(payload);
        console.log('   ✅ Order Created!\n');

        // Step 6: Generate Order Reference
        console.log('Step 6: Generating Order Reference...');
        const orderRef = require('./src/services/orderReferenceService');
        const shortRef = orderRef.generateReference();
        orderRef.storeOrder(shortRef, order.data.id, {
            pickup: parsed.pickup,
            delivery: parsed.delivery,
            customerPhone: customerPhone
        });
        console.log(`   ✅ Order Reference: ${shortRef}\n`);

        // Step 7: Prepare SMS Response
        console.log('Step 7: Preparing SMS Response...');
        const smsResponse = `✅ Booking confirmed!\nOrder Reference: ${shortRef}\nPickup: ${parsed.pickup}\nDelivery: ${parsed.delivery}\nYou'll receive updates via SMS.`;
        console.log(`   ✅ SMS Response:\n${smsResponse}\n`);

        console.log('='.repeat(60));
        console.log('✅ SMS BOOKING TEST PASSED!');
        console.log('='.repeat(60));
        console.log('\n📋 Summary:');
        console.log(`   ✅ SMS Parsed correctly`);
        console.log(`   ✅ Addresses geocoded`);
        console.log(`   ✅ Order created in Onro`);
        console.log(`   ✅ Order ID: ${order.data.id}`);
        console.log(`   ✅ Order Reference: ${shortRef}`);
        console.log(`   ✅ SMS response ready`);
        console.log('\n🎉 SMS Booking is working perfectly!');

    } catch (error) {
        console.error('\n❌ TEST FAILED!');
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testSMSBooking();
