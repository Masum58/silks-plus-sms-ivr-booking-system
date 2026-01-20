/**
 * SMS Routes
 * Handles incoming SMS messages from Twilio
 */

const express = require('express');
const router = express.Router();
const smsParser = require('../services/smsParser');
const onroService = require('../services/onroService');

/**
 * Webhook endpoint for incoming SMS messages
 * Twilio will POST here when a message is received
 */
router.post('/receive', async (req, res) => {
    try {
        const { From: from, Body: body, MessageSid: messageSid, NumMedia: numMedia } = req.body;

        // Log incoming SMS
        console.log('\n📨 SMS Received:');
        console.log(`   From: ${from}`);
        console.log(`   Message: ${body}`);
        console.log(`   SID: ${messageSid}`);
        console.log(`   Media Count: ${numMedia || 0}`);

        // Parse the SMS message
        const parsedData = smsParser.parseBookingMessage(body);
        console.log('📋 Parsed Data:', parsedData);

        let replyMessage = '';

        // Handle cancel request
        if (parsedData.isCancelRequest) {
            console.log(`\n🚫 Cancel request for Reference: ${parsedData.orderId}`);

            // Get full Order ID from short reference
            const orderRef = require('../services/orderReferenceService');
            const fullOrderId = orderRef.getOrderId(parsedData.orderId);

            if (!fullOrderId) {
                replyMessage = `❌ Order reference ${parsedData.orderId} not found. Please check the reference number and try again.`;
                console.log('❌ Reference not found in mapping');
            } else {
                console.log(`   Found mapping: ${parsedData.orderId} → ${fullOrderId}`);

                try {
                    const taxiCallerService = require('../services/taxiCallerService');
                    await taxiCallerService.cancelOrder(fullOrderId);
                    replyMessage = `✅ Order ${parsedData.orderId} has been cancelled successfully!`;
                    console.log('✅ Cancellation successful');
                } catch (error) {
                    console.error('❌ Cancellation failed:', error.message);
                    replyMessage = `❌ Sorry, we couldn't cancel order ${parsedData.orderId}. It may have already been picked up or completed. Please contact support for assistance.`;
                }
            }
        } else if (parsedData.isStatusRequest) {
            console.log(`\n🔍 Status request from: ${from}`);

            // 1. Get local order references for this phone
            const orderRef = require('../services/orderReferenceService');
            const localOrders = orderRef.getOrdersByPhone(from);

            if (localOrders.length === 0) {
                replyMessage = "I couldn't find any recent orders for this phone number.";
            } else {
                try {
                    // 2. Get active orders from Onro (Master Account)
                    const masterCustomerId = process.env.ONRO_CUSTOMER_ID;
                    const activeOrders = await onroService.getActiveOrders(masterCustomerId);

                    // 3. Find intersection
                    const foundOrders = [];
                    for (const localOrder of localOrders) {
                        const activeOrder = activeOrders.find(o => o.id === localOrder.orderId);
                        if (activeOrder) {
                            foundOrders.push({
                                reference: localOrder.reference,
                                status: activeOrder.status
                            });
                        }
                    }

                    if (foundOrders.length === 0) {
                        replyMessage = "You have no active orders at the moment.";
                    } else {
                        replyMessage = `You have ${foundOrders.length} active order${foundOrders.length > 1 ? 's' : ''}:\n`;
                        foundOrders.forEach(order => {
                            replyMessage += `\nOrder ${order.reference}: ${order.status}`;
                        });
                    }
                } catch (error) {
                    console.error('❌ Error checking status:', error.message);
                    replyMessage = "Sorry, I couldn't check your order status right now. Please try again later.";
                }
            }
        }
        // Handle booking request
        else if (parsedData.isBookingRequest) {
            console.log('\n🔍 Parsed Data:', JSON.stringify(parsedData, null, 2));

            // Validate booking data
            const validation = smsParser.validateBooking(parsedData);
            console.log('✅ Validation:', validation);

            if (validation.isValid) {
                try {
                    const taxiCallerService = require('../services/taxiCallerService');

                    // Create TaxiCaller order payload
                    const bookingData = await smsParser.createTaxiCallerPayload(parsedData, from);

                    console.log('\n🚀 Creating TaxiCaller order via SMS...');
                    const result = await taxiCallerService.createBooking(bookingData);

                    console.log('✅ Order created:', result);

                    // Generate short reference
                    const orderRef = require('../services/orderReferenceService');
                    const shortRef = orderRef.generateReference();

                    // Store mapping
                    // TaxiCaller returns order object, sometimes nested
                    const orderId = result.order?.id || result.id;

                    orderRef.storeOrder(shortRef, orderId, {
                        pickup: parsedData.pickup,
                        delivery: parsedData.delivery,
                        customerPhone: from,
                        price: result.price
                    });

                    console.log('   Short Reference:', shortRef);
                    console.log(`   Mapping: ${shortRef} → ${orderId}`);

                    replyMessage = `🎉 Booking confirmed!\n\n📍 Pickup: ${parsedData.pickup}\n📍 Delivery: ${parsedData.delivery}\n\nOrder Reference: ${shortRef}\n\n`;

                    if (result.price && result.price !== "Not Available") {
                        replyMessage += `Estimated Price: ${result.price}\n`;
                    } else {
                        replyMessage += `Your driver will confirm the final price.\n`;
                    }

                    replyMessage += `\nA driver will be assigned shortly!`;
                } catch (error) {
                    console.error('❌ TaxiCaller order creation failed:', error.message);
                    replyMessage = `We received your booking request:\n\n📍 Pickup: ${parsedData.pickup}\n📍 Delivery: ${parsedData.delivery}\n\nHowever, there was an issue creating the order. Please try again or call us.`;
                }
            } else {
                // Invalid booking request
                replyMessage = smsParser.generateResponseMessage(parsedData, validation);
            }
        }
        else {
            // Not a booking or cancel request
            replyMessage = "Hi! To book a delivery, send: 'Book from [pickup address] to [delivery address]'\n\nTo cancel an order, send: 'Cancel order [ORDER_ID]'";
        }

        console.log('\n💬 Reply:', replyMessage);

        // Respond to Twilio with TwiML
        res.type('text/xml');
        res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${replyMessage}</Message>
</Response>`);

    } catch (error) {
        console.error('❌ Error processing SMS:', error);
        res.status(500).send('Error processing SMS');
    }
});

/**
 * Webhook endpoint for SMS status callbacks
 * Twilio will POST here with delivery status updates
 */
router.post('/status', (req, res) => {
    try {
        const {
            MessageSid: messageSid,
            MessageStatus: status,
            To: to,
            From: from
        } = req.body;

        console.log('\n📊 SMS Status Update:');
        console.log(`   SID: ${messageSid}`);
        console.log(`   Status: ${status}`);
        console.log(`   To: ${to}`);
        console.log(`   From: ${from}`);

        res.sendStatus(200);
    } catch (error) {
        console.error('❌ Error processing status callback:', error);
        res.status(500).send('Error processing status callback');
    }
});

module.exports = router;
