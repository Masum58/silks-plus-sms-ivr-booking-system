require('dotenv').config();

// Test the bookOrder function directly
async function testBookOrderFunction() {
    console.log('🧪 Testing bookOrder Function Directly...\n');

    // Mock the required services
    const mockArgs = {
        pickupAddress: '3 Austra Parkway, Unit 103, Monroe, NY 10950',
        deliveryAddress: '7 Van Buren Drive, Unit 304, Monroe, NY 10950',
        customerName: 'Test User',
        customerPhone: '01317365623',
        driverNotes: 'Ring doorbell',
        paymentMethod: 'Cash',
        vehicleType: 'Car'
    };

    console.log('📋 Input Arguments:');
    console.log(JSON.stringify(mockArgs, null, 2));
    console.log('');

    // Import and call handleBookOrder
    const { handleBookOrder } = require('./src/routes/vapi');

    console.log('📞 Calling handleBookOrder...\n');
    const result = await handleBookOrder(mockArgs);

    console.log('='.repeat(60));
    console.log('✅ FUNCTION RETURNED:');
    console.log('='.repeat(60));
    console.log(`Success: ${result.success}`);
    console.log(`Message: ${result.message}`);
    console.log('='.repeat(60));

    // Extract reference from message
    const refMatch = result.message.match(/reference is ([\d-]+)/);
    if (refMatch) {
        const ref = refMatch[1].replace(/-/g, '');
        console.log(`\n🎯 Order Reference Extracted: ${ref}`);
        console.log(`   AI will say: "Your order reference is ${refMatch[1]}"`);
        console.log(`   Customer hears: "${refMatch[1].split('').join(' ')}"`);

        // Wait a moment for async processing
        console.log('\n⏳ Waiting 5 seconds for async order creation...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Check if order was stored
        const orderRefService = require('./src/services/orderReferenceService');
        const storedOrderId = orderRefService.getOrderId(ref);

        if (storedOrderId) {
            console.log(`\n✅ Order Reference Mapping Stored!`);
            console.log(`   Reference: ${ref}`);
            console.log(`   Order ID: ${storedOrderId}`);
        } else {
            console.log(`\n⚠️  Order Reference not yet stored (async still processing)`);
        }
    } else {
        console.log('\n❌ ERROR: No reference found in message!');
        console.log('   This means the fix did not work correctly.');
    }
}

testBookOrderFunction().catch(console.error);
