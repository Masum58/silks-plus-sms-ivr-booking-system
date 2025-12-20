const axios = require('axios');
const config = require('./src/config/config');
require('dotenv').config();

// Mock Vapi Webhook Handler Logic
const geocodingService = require('./src/services/geocodingService');
const onroService = require('./src/services/onroService');
const orderRef = require('./src/services/orderReferenceService');

async function testFullFlow() {
    console.log('🚀 Starting Full System Verification...');
    const startTime = Date.now();

    // --- Step 1: Booking ---
    console.log('\n1️⃣ Testing Booking Flow...');
    const bookingArgs = {
        pickupAddress: "3 Austra Parkway, Unit 103, Monroe, NY 10950",
        deliveryAddress: "7 Van Buren Drive, Unit 304, Monroe, NY 10950",
        customerName: "Test User",
        customerPhone: "+18126668455", // User's phone
        driverNotes: "Call when you arrive"
    };

    try {
        const bookingStart = Date.now();

        // Simulate Vapi Logic
        console.log('   Geocoding addresses (Parallel)...');
        const [pickupCoords, deliveryCoords] = await Promise.all([
            geocodingService.getCoordinates(bookingArgs.pickupAddress),
            geocodingService.getCoordinates(bookingArgs.deliveryAddress)
        ]);
        console.log(`   Geocoding done in ${(Date.now() - bookingStart) / 1000}s`);

        // Create Payload (Matching vapi.js structure)
        const payload = {
            customerId: process.env.ONRO_CUSTOMER_ID,
            service: { id: "0_17d3kbyR41-zdPFiUQV", options: [] },
            paymentMethod: "Wallet",
            paymentSide: "Sender",
            promoCode: "",
            isScheduled: false,
            pickup: {
                address: bookingArgs.pickupAddress,
                fullName: bookingArgs.customerName,
                phone: bookingArgs.customerPhone,
                coordinates: pickupCoords,
                customerDescription: bookingArgs.driverNotes,
                schedulePickupNow: false,
                scheduleDateAfter: 0,
                scheduleDateBefore: 0,
                email: ""
            },
            dropoffs: [{
                address: bookingArgs.deliveryAddress,
                fullName: "Receiver",
                phone: bookingArgs.customerPhone,
                coordinates: deliveryCoords,
                scheduleDateAfter: 0,
                scheduleDateBefore: 0,
                buildingBlock: "",
                floor: "",
                room: "",
                placeId: "",
                email: ""
            }]
        };

        if (process.env.ONRO_VEHICLE_TYPE_ID) {
            payload.vehicleType = { id: process.env.ONRO_VEHICLE_TYPE_ID, options: [] };
        }

        console.log('   Sending to Onro...');
        const order = await onroService.createBooking(payload);
        const bookingTime = (Date.now() - bookingStart) / 1000;

        console.log(`✅ Booking Successful! Time: ${bookingTime}s`);
        console.log(`   Order ID: ${order.data.id}`);

        // Store Reference
        const shortRef = orderRef.generateReference();
        orderRef.storeOrder(shortRef, order.data.id, {
            pickup: bookingArgs.pickupAddress,
            customerPhone: bookingArgs.customerPhone
        });
        console.log(`   Reference: ${shortRef}`);

        // --- Step 2: Status Check ---
        console.log('\n2️⃣ Testing Status Check...');
        const statusStart = Date.now();

        // Simulate checkOrderStatus
        const localOrders = orderRef.getOrdersByPhone(bookingArgs.customerPhone);
        const activeOrders = await onroService.getActiveOrders(process.env.ONRO_CUSTOMER_ID);

        const found = localOrders.find(lo => activeOrders.some(ao => ao.id === lo.orderId));

        if (found) {
            const status = activeOrders.find(ao => ao.id === found.orderId).status;
            console.log(`✅ Status Check Successful! Status: ${status}`);
        } else {
            console.log('⚠️ Order not found in active list (might be delay or filtered out)');
            // Debug: Print all active IDs
            console.log('   Active IDs:', activeOrders.map(o => o.id));
        }
        console.log(`   Status Check Time: ${(Date.now() - statusStart) / 1000}s`);

        // --- Step 3: Cancellation ---
        console.log('\n3️⃣ Testing Cancellation...');
        await onroService.cancelOrder(order.data.id);
        console.log('✅ Cancellation Successful!');

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        if (error.response) console.error('   Response:', error.response.data);
    }

    console.log(`\n🏁 Total Test Time: ${(Date.now() - startTime) / 1000}s`);
}

testFullFlow();
