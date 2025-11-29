/**
 * SMS Parser Service
 * Extracts booking information from SMS messages
 */

class SmsParser {
    /**
     * Parse SMS message to extract booking details
     * Supports multiple formats:
     * - "Book from ADDRESS1 to ADDRESS2"
     * - "Pickup: ADDRESS1, Delivery: ADDRESS2"
     * - "I need delivery from ADDRESS1 to ADDRESS2"
     */
    parseBookingMessage(message) {
        const result = {
            isBookingRequest: false,
            pickup: null,
            delivery: null,
            customerName: null,
            rawMessage: message
        };

        const lowerMessage = message.toLowerCase();

        // Check if it's a booking request
        const bookingKeywords = ['book', 'pickup', 'delivery', 'order', 'need', 'send'];
        result.isBookingRequest = bookingKeywords.some(keyword => lowerMessage.includes(keyword));

        if (!result.isBookingRequest) {
            return result;
        }

        // Pattern 1: "Book from ADDRESS1 to ADDRESS2"
        const pattern1 = /(?:book|pickup|send|deliver).*?from\s+(.+?)\s+to\s+(.+?)(?:\.|$)/i;
        const match1 = message.match(pattern1);
        if (match1) {
            result.pickup = this.cleanAddress(match1[1]);
            result.delivery = this.cleanAddress(match1[2]);
            return result;
        }

        // Pattern 2: "Pickup: ADDRESS1, Delivery: ADDRESS2"
        const pattern2 = /pickup[:\s]+(.+?)(?:,|\s+delivery|\s+drop)/i;
        const pattern3 = /delivery[:\s]+(.+?)(?:\.|$|,)/i;

        const pickupMatch = message.match(pattern2);
        const deliveryMatch = message.match(pattern3);

        if (pickupMatch) {
            result.pickup = this.cleanAddress(pickupMatch[1]);
        }
        if (deliveryMatch) {
            result.delivery = this.cleanAddress(deliveryMatch[1]);
        }

        // Pattern 3: "from ADDRESS1 to ADDRESS2" (without "book")
        if (!result.pickup && !result.delivery) {
            const pattern4 = /from\s+(.+?)\s+to\s+(.+?)(?:\.|$)/i;
            const match4 = message.match(pattern4);
            if (match4) {
                result.pickup = this.cleanAddress(match4[1]);
                result.delivery = this.cleanAddress(match4[2]);
            }
        }

        return result;
    }

    /**
     * Clean and format address
     */
    cleanAddress(address) {
        if (!address) return null;

        return address
            .trim()
            .replace(/[,;]+$/, '') // Remove trailing commas/semicolons
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
    }

    /**
     * Extract customer name from message (if provided)
     * Pattern: "Name: John Doe" or "My name is John Doe"
     */
    extractCustomerName(message) {
        const patterns = [
            /name[:\s]+([a-z\s]+?)(?:\.|,|$)/i,
            /my name is\s+([a-z\s]+?)(?:\.|,|$)/i,
            /i am\s+([a-z\s]+?)(?:\.|,|$)/i
        ];

        for (const pattern of patterns) {
            const match = message.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }

        return null;
    }

    /**
     * Validate parsed booking data
     */
    validateBooking(parsedData) {
        const errors = [];

        if (!parsedData.isBookingRequest) {
            errors.push('Message does not appear to be a booking request');
        }

        if (!parsedData.pickup) {
            errors.push('Pickup address not found');
        }

        if (!parsedData.delivery) {
            errors.push('Delivery address not found');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Create Onro order payload from parsed data
     */
    createOnroPayload(parsedData, customerPhone, vehicleTypeId = null) {
        // Extract customer name or use phone number
        const customerName = parsedData.customerName ||
            this.extractCustomerName(parsedData.rawMessage) ||
            'Customer';

        const payload = {
            service: {
                id: "0_17d3kbyR41-zdPFiUQV", // Bag-Box service
                options: []
            },
            paymentMethod: "Cash",
            paymentSide: "Sender",
            promoCode: "",
            isScheduled: false,
            pickup: {
                address: parsedData.pickup,
                fullName: customerName,
                phone: customerPhone,
                schedulePickupNow: true,
                scheduleDateAfter: 0,
                scheduleDateBefore: 0
            }
        };

        // Add vehicle type if provided
        if (vehicleTypeId) {
            payload.vehicleType = {
                id: vehicleTypeId,
                options: []
            };
        }

        return payload;
    }

    /**
     * Generate response message based on parsing result
     */
    generateResponseMessage(parsedData, validation) {
        if (!validation.isValid) {
            return `Sorry, I couldn't understand your booking request. ${validation.errors.join('. ')}.\n\nPlease use format: "Book from [pickup address] to [delivery address]"`;
        }

        return `Thank you! I've received your booking request:\n\n📍 Pickup: ${parsedData.pickup}\n📍 Delivery: ${parsedData.delivery}\n\nWe're processing your order and will confirm shortly!`;
    }
}

module.exports = new SmsParser();
