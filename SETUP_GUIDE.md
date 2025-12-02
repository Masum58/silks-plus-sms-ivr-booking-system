# 🚀 Project Setup Guide
## How to Run This Project on Any PC

### Prerequisites
Before starting, make sure you have:
- ✅ **Node.js** installed (v16 or higher)
- ✅ **npm** installed (comes with Node.js)
- ✅ **ngrok** installed (for local testing)

---

## Step 1: Get the Project Files

1. Copy the entire project folder to the new PC
2. Open Terminal/Command Prompt
3. Navigate to the project folder:
   ```bash
   cd /path/to/silks_plus_sms_ivr
   ```

---

## Step 2: Install Dependencies

Run this command to install all required packages:
```bash
npm install
```

This will install:
- express
- axios
- dotenv
- twilio
- and other dependencies

---

## Step 3: Configure Environment Variables

1. Open the `.env` file in the project folder
2. Make sure all credentials are filled in:

```env
# Server
PORT=3000
NODE_ENV=development

# Onro API
ONRO_API_URL=https://api.onro.app
ONRO_CUSTOMER_ID=_eWVj1wYoPkoBOlb-e5uh
ONRO_CLIENT_ID=sFOcJCIqJqkoBOlb-e5uh
ONRO_CLIENT_SECRET=Ql3Ew7kqpkoBOlb-e5uh

# Twilio
TWILIO_ACCOUNT_SID=ACcc78761badc4265a00b8d9958b978ee6
TWILIO_AUTH_TOKEN=328aa1389c4aad7c0089b2d1247d0a35
TWILIO_PHONE_NUMBER=+18126668455

# Vapi
VAPI_PRIVATE_KEY=a9b6e0b9-9d4c-4b3f-8e2a-1f5c6d7e8f9a
VAPI_PUBLIC_KEY=cd802dfc-5655-43cf-98ea-662014ec0835
VAPI_ASSISTANT_ID=cd802dfc-5655-43cf-98ea-662014ec0835

# Onro Vehicle Type ID (Required for order creation)
ONRO_VEHICLE_TYPE_ID=0CRbnzYnv4_rQA53K7O5z
```

---

## Step 4: Start the Server

Run the server:
```bash
node index.js
```

You should see:
```
🚀 Server running on port 3000
📱 SMS webhook ready at /sms/receive
📞 Vapi webhook ready at /vapi/webhook
```

---

## Step 5: Start ngrok (for Testing)

Open a **new terminal** (keep the server running) and run:
```bash
ngrok http 3000
```

Copy the **Forwarding URL** (e.g., `https://abc123.ngrok-free.app`)

---

## Step 6: Update Webhooks

### For Twilio (SMS):
1. Go to [Twilio Console](https://console.twilio.com)
2. Navigate to **Messaging** > **Services** > **swifly messenger**
3. Go to **Integration** section
4. Update **Incoming Messages** webhook:
   ```
   https://YOUR_NGROK_URL.ngrok-free.app/sms/receive
   ```
5. Click **Save**

### For Vapi (Voice):
1. Go to [Vapi Dashboard](https://dashboard.vapi.ai)
2. Select **Phone Numbers**
3. Click on your number (`+1 812 666 8455`)
4. Update **Server URL**:
   ```
   https://YOUR_NGROK_URL.ngrok-free.app/vapi/webhook
   ```
5. Click **Save**

---

## ✅ Testing

### Test SMS:
Send an SMS to `+18126668455`:
```
Book from Dhaka to Chittagong
```

### Test Voice:
Call `+18126668455` and speak to the AI assistant.

---

## 📝 Important Notes

1. **ngrok URL changes** every time you restart ngrok (free version)
2. You need to **update webhooks** in Twilio and Vapi each time
3. Keep **both terminals open** (one for server, one for ngrok)
4. Check `.env` file for all credentials

---

## 🚀 For Production (No ngrok needed)

Deploy to a free hosting service like **Render.com**:
1. Push code to GitHub
2. Connect GitHub to Render
3. Get a permanent URL (e.g., `https://swifly-booking.onrender.com`)
4. Update Twilio and Vapi webhooks **once** with this URL
5. Never worry about ngrok again!

---

## 🆘 Troubleshooting

### Server won't start?
```bash
# Check if port 3000 is already in use
lsof -i :3000

# Kill the process if needed
kill -9 <PID>
```

### Dependencies missing?
```bash
# Reinstall all dependencies
rm -rf node_modules
npm install
```

### ngrok not working?
```bash
# Make sure ngrok is installed
ngrok version

# If not installed, download from ngrok.com
```

---

## 📞 Need Help?

Check these files:
- `TWILIO_SMS_GUIDE.md` - SMS setup details
- `VAPI_SETUP_GUIDE.md` - Voice setup details
- `EMAIL_TO_ONRO_SUPPORT.md` - Onro API help
