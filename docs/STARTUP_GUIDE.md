# 🌅 Daily Startup Guide - How to Resume Work

Since you are using free ngrok, your **Webhook URL changes every time** you restart. Follow these steps when you turn on your PC.

## Step 1: Start the Server 🚀

1. Open VS Code.
2. Open a Terminal (`Ctrl + ~`).
3. Run the server:
   ```bash
   node index.js
   ```

## Step 2: Start ngrok 🌐

1. Open a **second** terminal tab (`+` button).
2. Run ngrok:
   ```bash
   ngrok http 3000
   ```
3. Copy the **Forwarding URL** (e.g., `https://random-name.ngrok-free.app`).

## Step 3: Update Twilio (for SMS) 📱

1. Go to [Twilio Console](https://console.twilio.com).
2. Navigate to **Phone Numbers** > **Manage** > **Active Numbers**.
3. Click your number (`+18126668455`).
4. Scroll to **Messaging** section.
5. Update **"A message comes in"** Webhook URL:
   - Paste new ngrok URL
   - Add `/sms/receive` at the end
   - Example: `https://new-url.ngrok-free.app/sms/receive`
6. Click **Save**.

## Step 4: Update Vapi (for Voice) 📞

1. Go to [Vapi Dashboard](https://dashboard.vapi.ai).
2. Select your **Assistant**.
3. Go to **Tools** tab.
4. Edit the `bookOrder` tool.
5. Update **Server URL**:
   - Paste new ngrok URL
   - Add `/vapi/webhook` at the end
   - Example: `https://new-url.ngrok-free.app/vapi/webhook`
6. Click **Save** and **Publish**.

## ✅ Ready!

Now your system is live again. You can test with:
```bash
node test-booking-sms.js
```
