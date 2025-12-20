# Twilio SMS Integration - Complete Guide

## ✅ যা Complete হয়েছে

### 1. Twilio Account Setup ✅
- Account Status: **Active (Full Account)**
- Phone Number: **+1 (812) 666-8455**
- Capabilities: SMS ✅ | Voice ✅ | MMS ✅

### 2. Code Integration ✅
- `twilioService.js` - SMS sending service
- `src/routes/sms.js` - Webhook handlers for receiving SMS
- `index.js` - Routes configured

### 3. Test Script ✅
- `test-twilio-sms.js` - Comprehensive testing tool

## 📱 কিভাবে Test করবেন

### Test 1: SMS পাঠান (Send SMS)

```bash
# আপনার phone number দিয়ে test করুন
node test-twilio-sms.js +8801XXXXXXXXX

# Example (Bangladesh number):
node test-twilio-sms.js +8801712345678

# Example (US number):
node test-twilio-sms.js +15551234567
```

**Note:** Trial account হলে শুধু verified numbers এ SMS যাবে।

### Test 2: SMS Receive করুন (Receive SMS)

SMS receive করার জন্য webhook setup করতে হবে:

#### Option A: ngrok দিয়ে (Local Testing)

1. **ngrok install করুন:**
   ```bash
   brew install ngrok
   # অথবা
   npm install -g ngrok
   ```

2. **Server run করুন:**
   ```bash
   node index.js
   ```

3. **ngrok tunnel তৈরি করুন:**
   ```bash
   ngrok http 3000
   ```

4. **ngrok URL copy করুন:**
   ```
   Forwarding: https://abc123.ngrok.io -> http://localhost:3000
   ```

5. **Twilio Console এ webhook set করুন:**
   - Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/incoming
   - Click your number: (812) 666-8455
   - Scroll to "Messaging"
   - **A MESSAGE COMES IN:** Webhook
   - **URL:** `https://abc123.ngrok.io/sms/receive`
   - **HTTP:** POST
   - Save

6. **Test করুন:**
   - আপনার phone থেকে +18126668455 এ SMS পাঠান
   - Server console এ message দেখতে পাবেন
   - Auto-reply পাবেন

#### Option B: Production Deployment

Production server deploy করলে:
- Webhook URL: `https://your-domain.com/sms/receive`
- Status Callback URL: `https://your-domain.com/sms/status`

## 🔧 Webhook Endpoints

### 1. Receive SMS
```
POST /sms/receive
```
যখন কেউ আপনার Twilio number এ SMS পাঠাবে।

**Response:** Auto-reply SMS

### 2. Status Callback
```
POST /sms/status
```
SMS delivery status updates এর জন্য।

## 📊 Test Results Summary

### ✅ Account Verification
- Account Name: My first Twilio account
- Status: Active
- Type: Full

### ✅ Phone Number Check
- Number: +1 (812) 666-8455
- SMS Capability: Enabled
- Voice Capability: Enabled
- MMS Capability: Enabled

### ⚠️ Current Webhook
- URL: https://demo.twilio.com/welcome/sms/reply
- **Action Required:** Update to your server URL

## 🚀 Next Steps

### 1. Test SMS Sending
```bash
node test-twilio-sms.js +YOUR_PHONE_NUMBER
```

### 2. Setup ngrok for Local Testing
```bash
# Terminal 1: Run server
node index.js

# Terminal 2: Run ngrok
ngrok http 3000
```

### 3. Configure Webhook in Twilio Console
- Use ngrok URL: `https://YOUR_NGROK_URL.ngrok.io/sms/receive`

### 4. Test SMS Receiving
- Send SMS to: +18126668455
- Check server logs
- Verify auto-reply

### 5. Implement Booking Logic
Update `src/routes/sms.js` to:
- Parse SMS content
- Extract booking details
- Create Onro order
- Send confirmation

## ⚠️ Important Notes

### A2P 10DLC Registration
আপনার screenshot এ দেখা যাচ্ছে:
> "A2P 10DLC registration required for US messaging"

**এটা কি?**
- US numbers দিয়ে business SMS পাঠানোর জন্য registration লাগে
- Without registration: Limited throughput
- With registration: Higher limits, better deliverability

**কিভাবে করবেন:**
1. Twilio Console → Messaging → Regulatory Compliance
2. Register your business
3. Create A2P campaign
4. Wait for approval (usually 1-2 weeks)

**এখনই লাগবে?**
- Testing এর জন্য: না
- Production এর জন্য: হ্যাঁ

### Trial Account Limitations
- শুধু verified numbers এ SMS যাবে
- Twilio branding থাকবে messages এ
- Limited free credits

**Upgrade করতে:**
- Twilio Console → Billing
- Add payment method
- Upgrade to paid account

## 📝 Code Examples

### Send SMS Programmatically
```javascript
const twilioService = require('./src/services/twilioService');

// Send SMS
await twilioService.sendSms(
    '+8801712345678',  // To
    'Your booking is confirmed!'  // Message
);
```

### Process Incoming SMS
```javascript
// In src/routes/sms.js
router.post('/sms/receive', (req, res) => {
    const { From, Body } = req.body;
    
    // Parse message
    // Create booking
    // Send confirmation
    
    res.type('text/xml');
    res.send(`<Response><Message>Confirmed!</Message></Response>`);
});
```

## 🎯 Integration with Onro

যখন SMS আসবে:

1. **Parse Message:**
   ```
   "Book pickup from 123 Main St to 456 Oak Ave"
   ```

2. **Extract Details:**
   - Pickup: 123 Main St
   - Delivery: 456 Oak Ave

3. **Create Onro Order:**
   ```javascript
   const order = await onroService.createBooking({
       service: { id: "...", options: [] },
       vehicleType: { id: "...", options: [] },
       pickup: { address: "123 Main St", ... },
       // ... rest of payload
   });
   ```

4. **Send Confirmation SMS:**
   ```javascript
   await twilioService.sendSms(
       customerPhone,
       `Booking confirmed! Order ID: ${order.id}`
   );
   ```

## 🐛 Troubleshooting

### SMS না পাঠাতে পারলে:
- Check credentials in `.env`
- Verify phone number format (E.164)
- Check Twilio account balance
- Verify number is verified (trial accounts)

### SMS receive করতে না পারলে:
- Check webhook URL is accessible
- Verify ngrok is running
- Check server logs
- Test webhook URL in browser

### Auto-reply কাজ না করলে:
- Check `twilioService.sendSms()` function
- Verify credentials
- Check server logs for errors

## 📞 Support

- Twilio Documentation: https://www.twilio.com/docs/sms
- Twilio Console: https://console.twilio.com
- ngrok Documentation: https://ngrok.com/docs

---

**সব ready! এখন test করুন:** 🚀
```bash
node test-twilio-sms.js +YOUR_PHONE_NUMBER
```
