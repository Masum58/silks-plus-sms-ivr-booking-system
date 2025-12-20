const onroService = require('./src/services/onroService');
const customerService = require('./src/services/customerService');
require('dotenv').config();

async function testCreateOrder() {
    try {
        console.log('🚀 Starting Test Order Creation...');

        // 1. Authenticate
        await onroService.authenticate();
        console.log('✅ Authenticated');

        // 2. Get/Create Customer
        const phone = "01317365623";
        let customerId;
        try {
            customerId = await customerService.getOrCreateCustomer({
                phone: phone,
                name: "Test User",
                email: "test@example.com"
            });
            console.log(`✅ Customer ID: ${customerId}`);
        } catch (error) {
            console.log('⚠️ Customer creation failed, using Master ID');
            customerId = process.env.ONRO_CUSTOMER_ID;
            console.log(`   Master ID: ${customerId}`);
        }

        // 3. Create Order
        // Get coordinates using service
        const geocodingService = require('./src/services/geocodingService');
        const pickupAddress = "3 Austra Parkway, Unit 103, Monroe, NY 10950";
        const deliveryAddress = "7 Van Buren Drive, Unit 304, Monroe, NY 10950";

        const pickupCoords = await geocodingService.getCoordinates(pickupAddress);
        const deliveryCoords = await geocodingService.getCoordinates(deliveryAddress);

        const payload = {
            customerId: customerId,
            service: { id: "0_17d3kbyR41-zdPFiUQV", options: [] }, // Bag-Box
            paymentMethod: "Cash",
            paymentSide: "Sender",
            promoCode: "",
            isScheduled: false,
            pickup: {
                address: pickupAddress,
                fullName: "Test User",
                phone: phone,
                coordinates: pickupCoords,
                schedulePickupNow: false,
                scheduleDateAfter: 0,
                scheduleDateBefore: 0,
                email: ""
            },
            dropoffs: [{
                address: deliveryAddress,
                fullName: "Receiver",
                phone: phone,
                coordinates: deliveryCoords,
                scheduleDateAfter: 0,
                scheduleDateBefore: 0,
                email: ""
            }]
        };

        if (process.env.ONRO_VEHICLE_TYPE_ID) {
            payload.vehicleType = { id: "INVALID_VEHICLE_ID", options: [] }; // Intentionally invalid
        }

        console.log('📦 Sending Payload:', JSON.stringify(payload, null, 2));

        const order = await onroService.createBooking(payload);
        console.log('✅ Order Created Successfully!');
        console.log('   ID:', order.data.id);
        console.log('   Code:', order.data.code || 'N/A'); // Check if Code is returned
        console.log('   Status:', order.data.status);

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('   Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testCreateOrder();
