# Complete Testing Guide - TaxiCaller Integration

## ✅ Pre-Test Checklist

Before testing, make sure:

- [ ] Server is running (`npm start`)
- [ ] `.env` file has correct credentials
- [ ] Vapi System Prompt is updated with new realistic prompt
- [ ] TaxiCaller RC environment is accessible

---

## 🧪 Test 1: Local Backend Test (No Vapi)

**Purpose:** Verify backend booking logic works

### Run:
```bash
node scripts/demonstrate-local-system.js
```

### Expected Output:
```
✅ Order created: { order_id: "66ed94e6..." }
📱 SMS confirmation sent
```

### If it fails:
- Check server logs for errors
- Verify TaxiCaller credentials in `.env`
- Check if geocoding worked (look for "📍 Pickup Coords")

---

## 🧪 Test 2: cURL Test (Simulate Vapi Call)

**Purpose:** Test Vapi webhook endpoint

### Run:
```bash
./scripts/test-vapi-curl.sh
```

### Expected Response:
```json
{
  "results": [{
    "result": {
      "success": true,
      "message": "Perfect! I'm processing your booking now..."
    }
  }]
}
```

### Check Server Logs For:
```
🚀 Processing Voice Booking...
📍 Pickup Coords: [-74.123, 41.456]
📍 Delivery Coords: [-74.789, 41.234]
✅ Order created
📱 SMS confirmation sent
```

---

## 🧪 Test 3: Real Vapi Call (Phone)

**Purpose:** End-to-end test with real voice

### Steps:

1. **Update Vapi System Prompt:**
   - Copy content from `docs/VAPI_SYSTEM_PROMPT_REALISTIC.md`
   - Paste in Vapi Dashboard → Assistant → System Prompt
   - Save

2. **Call Vapi Phone Number**

3. **Use This Script:**

```
AI: "Car Safe, pickup location?"
YOU: "Three Austra Parkway, Monroe, New York"

AI: "Going to?"
YOU: "Seven Van Buren Drive, Monroe, New York"

AI: "Phone number?"
YOU: "Plus one, five five five, one two three four five six seven"

AI: [Should book immediately]
AI: "ETA 15-20 minutes. Thank you!"
```

### What to Check:

**During Call:**
- [ ] AI responds quickly (no long pauses)
- [ ] AI doesn't ask for ZIP code
- [ ] AI doesn't ask for apartment number
- [ ] AI books immediately after getting info

**After Call:**
- [ ] Check server terminal for booking confirmation
- [ ] Check TaxiCaller Dashboard for new booking
- [ ] Check phone for SMS (if Twilio is configured)

---

## 🧪 Test 4: Address Correction Test

**Purpose:** Test if AI handles unclear addresses

### Script:

```
AI: "Pickup location?"
YOU: "Ostrava Parkway" (intentionally wrong)

AI: "Did you say Austra Parkway?"
YOU: "Yes"

AI: "Going to?"
YOU: "Benbury Road" (intentionally wrong)

AI: "Could you spell that?"
YOU: "V-A-N B-U-R-E-N Drive"

AI: "Van Buren Drive, got it."
```

### Expected:
- AI should ask for clarification
- AI should accept spelling
- Booking should still succeed

---

## 🧪 Test 5: Error Handling Test

**Purpose:** Test what happens when booking fails

### Option A: Stop Server (Simulate Backend Error)

1. Stop your server (`Ctrl+C`)
2. Call Vapi
3. Provide booking details

**Expected:** AI should say "I'm having trouble processing. Please try again."

### Option B: Invalid Address

```
AI: "Pickup location?"
YOU: "123 Nonexistent Street, Nowhere City"

AI: "Going to?"
YOU: "456 Fake Avenue"
```

**Expected:** 
- Geocoding will fail
- Booking will attempt anyway
- May fail with "Address not found" or similar

---

## 🧪 Test 6: Status Check Test

**Purpose:** Test order status lookup

### Script:

```
AI: "Car Safe, pickup location?"
YOU: "Actually, where's my car? I booked earlier."

AI: "What's your phone number?"
YOU: "555-1234"

AI: [Calls checkOrderStatus]
AI: "I couldn't find any recent orders for this number."
```

**Note:** Status check won't work until we implement `getActiveOrders` in TaxiCaller service.

---

## 📊 Success Criteria

### ✅ All Tests Pass If:

1. **Local Test:**
   - Booking created in TaxiCaller
   - No errors in console

2. **cURL Test:**
   - Returns `success: true`
   - Server logs show booking created

3. **Real Vapi Call:**
   - AI responds naturally (like a dispatcher)
   - Booking completes in < 30 seconds
   - Reference number is provided
   - SMS sent (if configured)

4. **Address Correction:**
   - AI asks for clarification when unsure
   - Accepts spelling
   - Booking succeeds

5. **Error Handling:**
   - AI gives friendly error messages
   - Doesn't crash or hang
   - Logs errors properly

---

## 🔧 Troubleshooting

### Problem: "Address not found"
**Solution:** 
- Check if Google Maps API key is valid
- Try adding city name: "Austra Parkway, Monroe"
- Check geocoding logs

### Problem: "No online vehicle"
**Solution:**
- This is expected in RC environment
- Booking is created but not assigned
- Check TaxiCaller dashboard to confirm booking exists

### Problem: "Booking failed"
**Solution:**
- Check server logs for exact error
- Verify TaxiCaller credentials
- Check if booker token is being generated

### Problem: SMS not received
**Solution:**
- Check Twilio Geo-Permissions for target country
- Verify phone number format (+1 for US, +880 for BD)
- Check Twilio logs in dashboard

---

## 🎯 Next Steps After Testing

If all tests pass:
1. ✅ Mark integration as complete
2. ✅ Deploy to production (if needed)
3. ✅ Train client on how to use system

If tests fail:
1. Share server logs with me
2. Share Vapi call transcript
3. I'll debug and fix

---

## 📞 Quick Test Commands

```bash
# Start server
npm start

# Test 1: Local
node scripts/demonstrate-local-system.js

# Test 2: cURL
./scripts/test-vapi-curl.sh

# Test 3: Check logs
# (Just watch the terminal while making Vapi call)
```

---

**Start with Test 1, then move to Test 2, then Test 3!**
