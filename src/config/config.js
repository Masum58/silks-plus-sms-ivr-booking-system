require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  onro: {
    apiUrl: process.env.ONRO_API_URL,
    customerId: process.env.ONRO_CUSTOMER_ID,
    clientId: process.env.ONRO_CLIENT_ID,
    clientSecret: process.env.ONRO_CLIENT_SECRET,
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },
  vapi: {
    privateKey: process.env.VAPI_PRIVATE_KEY,
    publicKey: process.env.VAPI_PUBLIC_KEY,
    assistantId: process.env.VAPI_ASSISTANT_ID,
  },
};

module.exports = config;
