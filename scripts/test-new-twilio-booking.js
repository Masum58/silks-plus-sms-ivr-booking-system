require('dotenv').config();
const taxiCallerService = require('../src/services/taxiCallerService');
const twilioService = require('../src/services/twilioService');

// Use the new credentials directly for the test to ensure they work
process.env.TWILIO_ACCOUNT_SID = 'ACcc78761badc4265a00b8d9958b978ee6';
process.env.TWILIO_AUTH_TOKEN = '1d713bc11e1cb133f8888dbd5f67d94c';
process.env.TWILIO_PHONE_NUMBER = '+18669016939';

async function testBookingAndSms() {
    const customerPhone = "+18456371211";
    const pickupAddress = "3 Astra Park, Monroe, NY";
    const dropoffAddress = "7 Van Buren Drive, Monroe, NY";

    console.log('🚀 Starting Booking Test...');
    console.log(`   Pickup: ${pickupAddress}`);
    console.log(`   Drop-off: ${dropoffAddress}`);
    console.log(`   Phone: ${customerPhone}`);

    try {
        // 1. Create Booking
        const bookingData = {
            customerName: "Test User",
            customerPhone: customerPhone,
            pickupAddress: pickupAddress,
            dropoffAddress: dropoffAddress,
            vehicleType: "2", // Standard Car
            driverGender: "Any"
        };

        console.log('⏳ Creating TaxiCaller booking...');
        const order = await taxiCallerService.createBooking(bookingData);
        const orderId = order.order?.order_id || order.id || 'UNKNOWN';
        console.log(`✅ Booking Created! Order ID: ${orderId}`);

        // 2. Send SMS
        const smsBody = `Your ride is booked. Order ID: ${orderId}. Pickup: ${pickupAddress}. The price is $6.00. Thank you for choosing Car Safe!`;

        console.log(`⏳ Sending SMS to ${customerPhone}...`);
        const smsResult = await twilioService.sendSms(customerPhone, smsBody);
        console.log('✅ SMS Sent Successfully!');
        console.log('   Twilio SID:', smsResult.sid);

    } catch (error) {
        console.error('❌ Test Failed!');
        if (error.response) {
            console.error('   API Error:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('   Error:', error.message);
        }
    }
}

testBookingAndSms();
