#!/usr/bin/env node

/**
 * Test SMS Parser
 * Tests the SMS parsing functionality with various message formats
 */

const smsParser = require('./src/services/smsParser');

console.log('🧪 SMS Parser Test Suite\n');
console.log('='.repeat(60));

// Test cases
const testMessages = [
    {
        name: 'Format 1: Book from X to Y',
        message: 'Book from Dhaka, Bangladesh to Chittagong, Bangladesh',
        expected: { pickup: 'Dhaka, Bangladesh', delivery: 'Chittagong, Bangladesh' }
    },
    {
        name: 'Format 2: Pickup/Delivery format',
        message: 'Pickup: 123 Main Street, London. Delivery: 456 Oak Avenue, Manchester',
        expected: { pickup: '123 Main Street, London', delivery: '456 Oak Avenue, Manchester' }
    },
    {
        name: 'Format 3: Simple from-to',
        message: 'I need delivery from Cumberland Gate to Oxford Street',
        expected: { pickup: 'Cumberland Gate', delivery: 'Oxford Street' }
    },
    {
        name: 'Invalid: No addresses',
        message: 'Hello, how are you?',
        expected: { isBookingRequest: false }
    },
    {
        name: 'Invalid: Only pickup',
        message: 'Pickup from Dhaka',
        expected: { pickup: 'Dhaka', delivery: null }
    }
];

// Run tests
testMessages.forEach((test, index) => {
    console.log(`\nTest ${index + 1}: ${test.name}`);
    console.log('-'.repeat(60));
    console.log(`Message: "${test.message}"`);

    const result = smsParser.parseBookingMessage(test.message);
    const validation = smsParser.validateBooking(result);

    console.log('\nParsed Result:');
    console.log(`  Is Booking Request: ${result.isBookingRequest}`);
    console.log(`  Pickup: ${result.pickup || 'Not found'}`);
    console.log(`  Delivery: ${result.delivery || 'Not found'}`);

    console.log('\nValidation:');
    console.log(`  Valid: ${validation.isValid ? '✅' : '❌'}`);
    if (!validation.isValid) {
        console.log(`  Errors: ${validation.errors.join(', ')}`);
    }

    // Generate response message
    const response = smsParser.generateResponseMessage(result, validation);
    console.log('\nResponse Message:');
    console.log(`  "${response}"`);

    // Test Onro payload generation (if valid)
    if (validation.isValid) {
        const payload = smsParser.createOnroPayload(result, '+8801234567890', 'TEST_VEHICLE_ID');
        console.log('\nOnro Payload Generated:');
        console.log(`  Service ID: ${payload.service.id}`);
        console.log(`  Pickup Address: ${payload.pickup.address}`);
        console.log(`  Vehicle Type ID: ${payload.vehicleType?.id || 'Not set'}`);
    }
});

console.log('\n' + '='.repeat(60));
console.log('✅ All tests completed!\n');
