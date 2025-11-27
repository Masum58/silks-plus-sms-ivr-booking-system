const twilio = require('twilio');
const config = require('../config/config');

class TwilioService {
    constructor() {
        this.client = twilio(config.twilio.accountSid, config.twilio.authToken);
    }

    async sendSms(to, body) {
        try {
            const message = await this.client.messages.create({
                body: body,
                from: config.twilio.phoneNumber,
                to: to
            });
            console.log(`SMS sent to ${to}: ${message.sid}`);
            return message;
        } catch (error) {
            console.error('Error sending SMS:', error);
            throw error;
        }
    }
}

module.exports = new TwilioService();
