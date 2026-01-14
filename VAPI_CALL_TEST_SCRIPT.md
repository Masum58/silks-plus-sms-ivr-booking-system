# Vapi Phone Call Test Script

## 📞 Before You Call:

1. ✅ Make sure server is running (`npm start`)
2. ✅ Update Vapi System Prompt:
   - Copy all text from `docs/VAPI_SYSTEM_PROMPT_REALISTIC.md`
   - Go to Vapi Dashboard → Your Assistant → System Prompt
   - Paste and Save

---

## 🎯 Test Scenario 1: Perfect Flow (Easy Addresses)

**Call Vapi Phone Number**

```
AI: "Car Safe, pickup location?"
YOU: "Three Austra Parkway, Monroe, New York"

AI: "Going to?"
YOU: "Seven Van Buren Drive, Monroe, New York"

AI: "Phone number?"
YOU: "Plus one, five five five, one two three four five six seven"

AI: [Books immediately]
AI: "ETA 15-20 minutes. Thank you!"
```

### ✅ Success Criteria:
- AI responds quickly (< 2 seconds)
- AI doesn't ask for ZIP code
- AI doesn't ask for apartment number
- Booking completes in < 30 seconds
- You get a reference number

---

## 🎯 Test Scenario 2: Short Addresses (Real-world Style)

```
AI: "Car Safe, pickup location?"
YOU: "Tutania"

AI: "Going to?"
YOU: "Van Buren"

AI: "Phone number?"
YOU: "Five five five, one two three four"

AI: [Books]
AI: "ETA 15-20 minutes. Thank you!"
```

### ✅ Success Criteria:
- AI accepts short address names
- Geocoding finds the correct location
- Booking succeeds

---

## 🎯 Test Scenario 3: Address Correction

```
AI: "Pickup location?"
YOU: "Ostrava Parkway" (intentionally wrong pronunciation)

AI: "Did you say Austra Parkway?"
YOU: "Yes, Austra"

AI: "Going to?"
YOU: "Benbury Road" (intentionally wrong)

AI: "Could you spell that?"
YOU: "V as in Victor, A as in Apple, N as in Nancy, 
     B as in Boy, U as in Umbrella, R as in Robert, 
     E as in Echo, N as in Nancy, Drive"

AI: "Van Buren Drive, got it. Phone number?"
```

### ✅ Success Criteria:
- AI asks for clarification when unsure
- AI accepts spelling
- Booking still succeeds

---

## 🎯 Test Scenario 4: With Driver Preference

```
AI: "Pickup location?"
YOU: "Carriage Hill Court"

AI: "Going to?"
YOU: "Van Arsdale Road"

AI: "Phone number?"
YOU: "Five five five, nine eight seven six"

AI: [About to book]
YOU: "Wait, I need a female driver"

AI: "Got it, female driver. Booking now..."
AI: "ETA 15-20 minutes. Thank you!"
```

### ✅ Success Criteria:
- AI handles mid-conversation preference
- Gender preference is applied

---

## 🎯 Test Scenario 5: Multiple Addresses

Test with these real Monroe-area addresses:

**Pickup Options:**
- "14 Carriage Hill Court, Monroe"
- "1 Beer Sheva Street, Monroe"
- "Spring Mountain Road, Monroe"
- "County Route 105, Highland Mills"

**Drop-off Options:**
- "2 Van Arsdale Road, Monroe"
- "Acres Road, Monroe"
- "Garfield Road, Monroe"

---

## 📊 What to Check After Each Call:

### 1. Server Terminal:
Look for these messages:
```
🚀 Processing Voice Booking...
   Pickup: [address]
   Drop-off: [address]
📍 Pickup Coords: [-74.xxx, 41.xxx]
📍 Delivery Coords: [-74.xxx, 41.xxx]
✅ Order created: { order_id: "..." }
📱 SMS confirmation sent
```

### 2. TaxiCaller Dashboard:
- Go to: https://app-rc.taxicaller.net
- Check: Dispatch → Jobs
- Verify: New booking appears with correct addresses

### 3. Phone (if Twilio configured):
- Check for SMS confirmation
- Should say: "Booking Confirmed! Ref: xxxxx..."

---

## ⚠️ Common Issues & Solutions:

### Issue 1: AI asks for ZIP code
**Problem:** Old system prompt still active  
**Solution:** Re-copy and paste new prompt from `VAPI_SYSTEM_PROMPT_REALISTIC.md`

### Issue 2: AI doesn't understand address
**Problem:** Pronunciation unclear  
**Solution:** Spell it out: "A-U-S-T-R-A Parkway"

### Issue 3: Booking fails silently
**Problem:** Backend error  
**Solution:** Check server terminal for error messages

### Issue 4: Long pause before response
**Problem:** Geocoding taking time  
**Solution:** Normal for first call, should be faster after

---

## 🎬 Quick Test Checklist:

Before calling:
- [ ] Server running (`npm start`)
- [ ] Vapi prompt updated
- [ ] Have test addresses ready

During call:
- [ ] AI responds naturally
- [ ] No unnecessary questions
- [ ] Booking completes quickly

After call:
- [ ] Check server logs
- [ ] Check TaxiCaller dashboard
- [ ] Verify booking details

---

## 📱 Your Vapi Phone Number:

**Find it here:**
1. Go to: https://dashboard.vapi.ai
2. Click: Assistants → Your Assistant
3. Look for: Phone Number section
4. Call that number!

---

## 🚀 Ready to Test?

1. **Start with Scenario 1** (easiest)
2. **Then try Scenario 2** (real-world)
3. **Then Scenario 3** (error handling)

**Good luck! Call করার পর আমাকে জানান কেমন হলো!** 📞✨
