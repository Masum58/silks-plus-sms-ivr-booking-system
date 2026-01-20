# Vapi Phone Call Test Script (Updated)

## 📞 Before You Call:

1. ✅ Make sure server is running and live on Render.
2. ✅ Update Vapi System Prompt:
   - Copy all text from `docs/VAPI_SYSTEM_PROMPT_REALISTIC.md`
   - Go to Vapi Dashboard → Your Assistant → System Prompt
   - Paste and Save
3. ✅ Update Vapi Tools:
   - Ensure `bookOrder` tool has `additionalStops` (array) and `driverGender` (enum) parameters.

---

## 🎯 Test Scenario 1: Perfect Flow with Price & ETA

**Call Vapi Phone Number**

```
AI: "Car Safe, pickup address?"
YOU: "Beer Sheva Street"

AI: "Drop-off address?"
YOU: "60 Morong Drive"

AI: "I have your number as [Your Number]. Is that correct?"
YOU: "Yes, that's correct."

AI: "So, picking up at Beer Sheva Street, going to 60 Morong Drive, for phone number [Your Number]. Correct?"
YOU: "Yes."

AI: [Books immediately]
AI: "Perfect! I've booked your ride. Your order reference is X-X-X. The estimated price is 15 USD. The ETA is 10 minutes. Thank you for using Car Safe!"
```

---

## 🎯 Test Scenario 2: Multiple Stops

```
AI: "Car Safe, pickup address?"
YOU: "72 Bailey Farm Road"

AI: "Drop-off address?"
YOU: "498 Old Berry Commons Drive"

YOU: "Wait, I need to add a stop at 3 Oscar Parkway."
AI: "Sure, stop at 3 Oscar Parkway added. I have your number as [Number]. Is that correct?"

YOU: "Yes."

AI: "So, picking up at 72 Bailey Farm Road, stopping at 3 Oscar Parkway, going to 498 Old Berry Commons Drive, for phone number [Number]. Correct?"
YOU: "Yes."

AI: [Books with stops]
```

---

## 🎯 Test Scenario 3: Driver Gender Preference

```
AI: "Car Safe, pickup address?"
YOU: "Titania Boulevard"

AI: "Drop-off address?"
YOU: "Van Buren Drive"

YOU: "Can I get a female driver?"
AI: "Got it, I'll request a female driver for you. I have your number as [Number]. Is that correct?"

YOU: "Yes."

AI: [Books with gender preference]
```

---

## 🎯 Test Scenario 4: Price Not Available (Fallback)

If the system doesn't have a tariff set for the route:

```
AI: [After booking]
AI: "Perfect! I've booked your ride. Your order reference is X-X-X. Your driver will confirm the final price at the end of the trip. A driver will be assigned shortly and you'll receive the ETA via SMS."
```

---

## 📊 What to Check in Logs (Render/Local):

Look for these optimized logs:
```
   🔍 Geocoding addresses in parallel...
   📍 Pickup Coords: [-74.xxx, 41.xxx]
   📍 Delivery Coords: [-74.xxx, 41.xxx]
💰 Ride Price: 15 USD (or Not Available)
✅ Order created: { order_id: "..." }
```

---

## 🎬 Quick Test Checklist:

- [ ] AI responds quickly (Parallel geocoding makes it fast!)
- [ ] AI never says "captured phone number"
- [ ] AI mentions the price (or the driver fallback)
- [ ] Multiple stops appear in TaxiCaller dashboard
- [ ] Gender preference appears in TaxiCaller driver notes/attributes

**Good luck! Call করার পর আমাকে জানান কেমন হলো!** 📞✨
