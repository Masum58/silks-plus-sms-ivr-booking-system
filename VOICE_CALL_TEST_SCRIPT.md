# Voice Call Test Script - Vapi Booking

## 📞 Call করার আগে প্রস্তুতি:

**আপনার Vapi Phone Number:** [আপনার Vapi number এখানে লিখুন]

**Test Data:**
- Phone: `01317365623`
- Pickup: `3 Austra Parkway, Unit 103, Monroe, New York 10950`
- Delivery: `7 Van Buren Drive, Unit 304, Monroe, New York 10950`
- Driver Notes: `Ring doorbell`
- Payment: `Cash` (AI জিজ্ঞেস করবে কিন্তু save হবে না)
- Vehicle: `Car`

---

## 🎬 Complete Conversation Script:

### AI: 
"Hi. I'd be happy to assist you today. Are you looking to book a delivery, check the status of an order, or cancel?"

### YOU:
**"I want to book a delivery"**

---

### AI:
"Great. I'd be happy to help you book a delivery. May I have your phone number for order updates?"

### YOU:
**"Zero one three one seven, three six five, six two three"**

---

### AI:
"Thank you. So that's 01317365623, correct?"

### YOU:
**"Yes"**

---

### AI:
"Perfect. Where would you like us to pick up from? Please provide the complete street address, city, state, and ZIP code."

### YOU:
**"3 Austra, A-U-S-T-R-A, Parkway, Unit 103, Monroe, New York, 10950"**

*(Spell out "Austra" to help AI understand)*

---

### AI:
"Thank you. To confirm, the pickup address is 3 Austra Parkway, Unit 103, Monroe, New York 10950. Is that correct?"

### YOU:
**"Yes"**

---

### AI:
"Got it. And where should we deliver to? Please provide the complete street address, city, state, and ZIP code."

### YOU:
**"7 Van Buren, V-A-N B-U-R-E-N, Drive, Unit 304, Monroe, New York, 10950"**

*(Spell out "Van Buren" to help AI understand)*

---

### AI:
"Thank you. To confirm, the delivery address is 7 Van Buren Drive, Unit 304, Monroe, New York 10950. Is that correct?"

### YOU:
**"Yes"**

---

### AI:
"Perfect. Do you have any special instructions for the driver?"

### YOU:
**"Ring doorbell"**

---

### AI:
"And would you like to pay via Cash, Wallet, or Card?"

### YOU:
**"Cash"**

---

### AI:
"Great! Would you like a Car or Car Eataly for delivery?"

### YOU:
**"Car"**

---

### AI:
"Perfect! I'm processing your booking now. You'll receive a confirmation SMS with your order reference shortly. Thank you for using Swifly Messenger!"

---

## ✅ Expected Results:

1. **Call Duration:** ~2-3 minutes
2. **No Timeout:** Call should NOT disconnect during processing
3. **SMS Received:** Within 30 seconds
4. **SMS Content:** Order Reference (6 digits) + Pickup/Delivery addresses
5. **Onro Dashboard:** Order visible with Order Code

---

## 📋 Checklist (Mark as you test):

- [ ] AI asked for Phone Number
- [ ] AI confirmed Phone Number
- [ ] AI asked for Pickup Address
- [ ] AI confirmed Pickup Address correctly (Austra, not Aster)
- [ ] AI asked for Delivery Address
- [ ] AI confirmed Delivery Address correctly (Van Buren, not Benborn)
- [ ] AI asked for Driver Notes
- [ ] AI asked for Payment Method
- [ ] AI asked for Vehicle Type
- [ ] AI said "I'm processing your booking now"
- [ ] Call did NOT timeout/disconnect
- [ ] SMS received with Order Reference
- [ ] Order visible in Onro Dashboard

---

## 🐛 If Problems Occur:

### Problem 1: AI misunderstands address
**Solution:** Spell it out letter by letter
- "A-U-S-T-R-A" for Austra
- "V-A-N B-U-R-E-N" for Van Buren

### Problem 2: Call times out
**Solution:** This should be fixed now. If it still happens, note the exact time it disconnects.

### Problem 3: No SMS received
**Solution:** 
1. Check your phone number is correct
2. Wait up to 1 minute
3. Check spam folder

### Problem 4: Order not in Dashboard
**Solution:**
1. Refresh Onro Dashboard
2. Search by Order Code (from SMS)
3. Check "Recent Orders" section

---

## 📝 Notes Section:

**Order Reference Received:** _______________

**SMS Received Time:** _______________

**Any Issues?**
_______________________________________
_______________________________________

**Overall Rating:** ☐ Excellent ☐ Good ☐ Needs Improvement

---

## 🎯 Quick Tips:

1. **Speak Clearly:** AI works best with clear pronunciation
2. **Spell Difficult Words:** When in doubt, spell it out
3. **Confirm Everything:** Always say "Yes" when AI confirms
4. **Be Patient:** Wait for AI to finish speaking before responding
5. **Note Order Reference:** Write it down from SMS

---

**Ready? Call your Vapi number and follow this script!** 📞
