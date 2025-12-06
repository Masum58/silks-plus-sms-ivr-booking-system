# 🔧 Vapi Webhook Setup Guide - URGENT FIX

## 🐛 Problem: AI can't call bookOrder tool

**Symptoms:**
- AI keeps saying "Let me process your booking..."
- Nothing happens
- Call eventually ends without booking

**Root Cause:** Webhook URL not configured in Vapi Dashboard

---

## ✅ Solution: Configure Webhook URL

### Step 1: Get Your Production URL

Your backend needs to be deployed and publicly accessible. 

**Options:**
1. **If using Render/Heroku/Railway:**
   - Your URL: `https://your-app-name.onrender.com` (or similar)
   
2. **If using ngrok for testing:**
   ```bash
   ngrok http 3000
   ```
   - Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

3. **If using localhost (NOT RECOMMENDED):**
   - Vapi cannot reach localhost
   - You MUST use ngrok or deploy to cloud

---

### Step 2: Configure in Vapi Dashboard

1. **Go to Vapi Dashboard** (https://dashboard.vapi.ai)

2. **Select your Assistant**

3. **Find "Server URL" or "Model" section**
   - Look for "Server URL", "Functions", or "Tools" settings

4. **Set the Server URL:**
   ```
   https://your-production-url.com/api/vapi/webhook
   ```
   
   **Example:**
   ```
   https://silks-plus-sms-ivr.onrender.com/api/vapi/webhook
   ```

5. **Save Changes**

---

### Step 3: Verify Webhook is Working

Run this test from your terminal:

```bash
curl -X POST https://YOUR-URL-HERE/api/vapi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "type": "function-call",
      "functionCall": {
        "name": "bookOrder",
        "parameters": {
          "pickupAddress": "123 Test St",
          "deliveryAddress": "456 Test Ave",
          "customerPhone": "1234567890",
          "paymentMethod": "Cash",
          "vehicleType": "Car"
        }
      }
    }
  }'
```

**Expected Response:**
```json
{
  "results": [
    {
      "result": {
        "success": true,
        "message": "Perfect! I'm processing your booking now. Your order reference is X-X-X-X-X-X..."
      }
    }
  ]
}
```

**If you get an error:**
- Check if your server is running
- Check if the URL is correct
- Check if the route `/api/vapi/webhook` exists

---

## 🚀 Quick Fix for Testing (Using ngrok)

If you don't have a production URL yet:

### 1. Install ngrok:
```bash
brew install ngrok
# or download from https://ngrok.com/download
```

### 2. Start your local server:
```bash
cd /Users/masumabedin/Desktop/silks_plus_sms_ivr
npm start
```

### 3. In a new terminal, start ngrok:
```bash
ngrok http 3000
```

### 4. Copy the HTTPS URL:
```
Forwarding: https://abc123.ngrok.io -> http://localhost:3000
```

### 5. Set in Vapi Dashboard:
```
https://abc123.ngrok.io/api/vapi/webhook
```

### 6. Test again!

---

## 📋 Checklist:

- [ ] Backend server is running
- [ ] Server is publicly accessible (not localhost)
- [ ] Webhook URL is set in Vapi Dashboard
- [ ] Webhook URL ends with `/api/vapi/webhook`
- [ ] Webhook responds to test curl command
- [ ] Tools are configured in Vapi Dashboard
- [ ] System Prompt is updated

---

## 🎯 After Fixing:

1. **Make a new test call**
2. **AI should now successfully call bookOrder**
3. **You should hear the order reference**
4. **SMS should arrive**

---

## ❓ Still Not Working?

**Check Vapi Logs:**
1. Go to Vapi Dashboard
2. Find "Logs" or "Call History"
3. Look for error messages

**Common Errors:**
- "Webhook timeout" → Server too slow or not responding
- "Tool not found" → Tool name mismatch
- "Invalid parameters" → Parameter mismatch

**Need Help?**
Share:
1. Your webhook URL
2. Screenshot of Vapi Server URL settings
3. Error from Vapi logs (if any)
