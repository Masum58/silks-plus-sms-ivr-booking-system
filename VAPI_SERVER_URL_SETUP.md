# Vapi Server URL Setup - Step by Step

## 🎯 URL to Set:
```
https://swifly-booking.onrender.com/vapi/webhook
```

---

## 📍 Where to Set This URL in Vapi Dashboard:

### Method 1: In Assistant Settings (Most Common)

1. **Go to Vapi Dashboard**
   - Visit: https://dashboard.vapi.ai
   - Login to your account

2. **Select Your Assistant**
   - Click on "Assistants" in left sidebar
   - Click on your assistant (the one you're using for calls)

3. **Find "Model" or "Functions" Tab**
   - Look for tabs at the top: Overview, Model, Voice, Functions, etc.
   - Click on **"Model"** or **"Functions"**

4. **Look for "Server URL" Field**
   - Scroll down to find a field labeled:
     - "Server URL" OR
     - "Function Server URL" OR
     - "Custom Server URL" OR
     - "Webhook URL"

5. **Paste the URL**
   ```
   https://swifly-booking.onrender.com/vapi/webhook
   ```

6. **Save Changes**
   - Click "Save" or "Update" button at the bottom

---

### Method 2: In Tools Configuration (Alternative)

1. **Go to Vapi Dashboard**

2. **Click "Tools" in Left Sidebar**

3. **For Each Tool (bookOrder, checkOrderStatus, cancelOrder):**
   - Click on the tool
   - Look for "Server" or "Server URL" field
   - Paste: `https://swifly-booking.onrender.com/vapi/webhook`
   - Save

---

### Method 3: In Phone Number Settings (If Using Phone)

1. **Go to Vapi Dashboard**

2. **Click "Phone Numbers"**

3. **Select Your Phone Number**

4. **Find "Assistant" Section**
   - Make sure your assistant is selected

5. **Check if there's a "Server URL" field**
   - If yes, paste: `https://swifly-booking.onrender.com/vapi/webhook`
   - Save

---

## ✅ How to Verify It's Set Correctly:

### After Setting the URL:

1. **Make a Test Call**
   - Call your Vapi number
   - Say "I want to book a delivery"
   - Provide all information
   - AI should say "Your order reference is X-X-X-X-X-X"

2. **Check Vapi Logs**
   - Go to Dashboard → Logs or Call History
   - Look for your test call
   - Check if there are any errors

---

## 🔍 Common Locations in Vapi Dashboard:

**Look for these sections:**
- ✅ Assistants → [Your Assistant] → Model → Server URL
- ✅ Assistants → [Your Assistant] → Functions → Server URL
- ✅ Tools → [Tool Name] → Server URL
- ✅ Phone Numbers → [Your Number] → Server URL

**The field might be labeled as:**
- "Server URL"
- "Function Server URL"
- "Custom Server URL"
- "Webhook URL"
- "API Endpoint"

---

## 🚨 Important Notes:

1. **Use HTTPS, not HTTP**
   ✅ Correct: `https://swifly-booking.onrender.com/vapi/webhook`
   ❌ Wrong: `http://swifly-booking.onrender.com/vapi/webhook`

2. **Include `/vapi/webhook` at the end**
   ✅ Correct: `https://swifly-booking.onrender.com/vapi/webhook`
   ❌ Wrong: `https://swifly-booking.onrender.com`

3. **No trailing slash**
   ✅ Correct: `https://swifly-booking.onrender.com/vapi/webhook`
   ❌ Wrong: `https://swifly-booking.onrender.com/vapi/webhook/`

4. **Same URL for ALL tools**
   - bookOrder → same URL
   - checkOrderStatus → same URL
   - cancelOrder → same URL

---

## 📞 After Setting:

1. **Wait 1 minute** for changes to take effect
2. **Make a test call**
3. **If it works:** You'll hear the order reference!
4. **If it doesn't work:** Check Vapi logs for errors

---

## ❓ Can't Find the Field?

If you can't find "Server URL" anywhere:

1. **Take a screenshot** of your Vapi Dashboard
2. **Share it** so I can help you locate the exact field
3. **Or contact Vapi Support** and ask:
   "Where do I set the Server URL for my assistant's functions?"

---

## 🎯 Quick Checklist:

- [ ] Logged into Vapi Dashboard
- [ ] Found "Server URL" field (in Assistant → Model or Functions)
- [ ] Pasted: `https://swifly-booking.onrender.com/vapi/webhook`
- [ ] Saved changes
- [ ] Waited 1 minute
- [ ] Made test call
- [ ] Heard order reference!

---

**Once you set this URL, your voice calls will work perfectly!** 🚀
