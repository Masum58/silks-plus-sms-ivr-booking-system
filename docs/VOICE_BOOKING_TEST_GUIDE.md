# Voice Booking Test Guide

## 📞 Test Information

**Test Date:** 2025-12-06
**Tester:** Masum
**Purpose:** Verify complete booking flow with Payment Method and Vehicle Type selection

---

## ✅ Test Checklist

### Pre-Test Setup
- [ ] Vapi System Prompt updated with Vehicle Type
- [ ] Vapi Tools Config updated with `vehicleType` parameter
- [ ] Backend deployed to production
- [ ] Phone ready to receive SMS

### Test Data to Use

**Phone Number:** `01317365623` (your number)

**Pickup Address:** `3 Austra Parkway, Unit 103, Monroe, New York 10950`

**Delivery Address:** `7 Van Buren Drive, Unit 304, Monroe, New York 10950`

**Driver Notes:** `Ring doorbell`

**Payment Method:** `Cash`

**Vehicle Type:** `Car`

---

## 🎯 Test Script

### Step 1: Call Vapi Number
- Dial your Vapi phone number
- Wait for AI greeting

### Step 2: Provide Phone Number
**AI asks:** "May I have your phone number for order updates?"
**You say:** "Zero one three one seven three six five six two three"
**AI confirms:** "So that's 01317365623, correct?"
**You say:** "Yes"

### Step 3: Provide Pickup Address
**AI asks:** "Where would you like us to pick up from?"
**You say:** "3 Austra Parkway, Unit 103, Monroe, New York 10950"
**AI asks:** "Is there an apartment or unit number?"
**You say:** "Unit 103" (or "I already mentioned it")
**AI confirms:** Address
**You say:** "Yes"

### Step 4: Provide Delivery Address
**AI asks:** "Where should we deliver to?"
**You say:** "7 Van Buren Drive, Unit 304, Monroe, New York 10950"
**AI asks:** "Is there an apartment or unit number?"
**You say:** "Unit 304" (or "I already mentioned it")
**AI confirms:** Address
**You say:** "Yes"

### Step 5: Driver Notes
**AI asks:** "Do you have any special instructions for the driver?"
**You say:** "Ring doorbell"

### Step 6: Payment Method
**AI asks:** "Would you like to pay via Cash, Wallet, or Card?"
**You say:** "Cash"

### Step 7: Vehicle Type (NEW!)
**AI asks:** "Would you like a Car or Car Eataly for delivery?"
**You say:** "Car"

### Step 8: Confirmation
**AI says:** "Booking confirmed! Your order reference is [X-X-X-X-X-X]..."
**You note:** Write down the order reference

---

## ✅ Verification Steps

### Immediate Checks (During Call)
- [ ] AI asked for Phone Number
- [ ] AI asked for Pickup Address (with unit)
- [ ] AI asked for Delivery Address (with unit)
- [ ] AI asked for Driver Notes
- [ ] AI asked for Payment Method
- [ ] **AI asked for Vehicle Type** ← NEW!
- [ ] AI provided Order Reference (6 digits)
- [ ] AI confirmed all details

### After Call (Within 1 minute)
- [ ] SMS received with booking confirmation
- [ ] SMS contains Order Reference
- [ ] SMS contains Pickup and Delivery addresses

### Onro Dashboard Check (Within 2 minutes)
- [ ] Login to Onro Dashboard
- [ ] Search for Order Reference
- [ ] Order exists and is visible
- [ ] Payment Method is "Cash"
- [ ] **Vehicle Type is "Car"** ← NEW!
- [ ] Pickup address matches (with Unit 103)
- [ ] Delivery address matches (with Unit 304)
- [ ] Driver notes show "Ring doorbell"

---

## 📝 Test Results

**Order Reference Received:** _______________

**SMS Received:** ☐ Yes ☐ No

**Order Visible in Dashboard:** ☐ Yes ☐ No

**Payment Method Correct:** ☐ Yes ☐ No

**Vehicle Type Correct:** ☐ Yes ☐ No

**All Details Match:** ☐ Yes ☐ No

---

## 🐛 Issues Found

| Issue | Description | Severity |
|-------|-------------|----------|
| 1.    |             | High/Medium/Low |
| 2.    |             | High/Medium/Low |
| 3.    |             | High/Medium/Low |

---

## ✅ Test Status

**Overall Result:** ☐ PASS ☐ FAIL

**Notes:**
_______________________________________
_______________________________________
_______________________________________

**Tested By:** Masum
**Date:** 2025-12-06
**Time:** _______
