# Vapi Call Script - Quick Reference

## 🎯 Scenario 1: Standard Booking (30 seconds)

```
AI: "Car Safe, pickup location?"
YOU: "Three Austra Parkway, Monroe, New York"

AI: "Going to?"
YOU: "Seven Van Buren Drive, Monroe, New York"

AI: "Phone number?"
YOU: "Plus one, five five five, one two three four five six seven"

AI: "ETA 15-20 minutes. Thank you!"
```

---

## 🎯 Scenario 2: Short Style (20 seconds)

```
AI: "Car Safe, pickup location?"
YOU: "Tutania"

AI: "Going to?"
YOU: "Van Buren"

AI: "Phone number?"
YOU: "Five five five, one two three four"

AI: "ETA 15-20 minutes. Thank you!"
```

---

## 🎯 Scenario 3: With Spelling

```
AI: "Pickup location?"
YOU: "Austra Parkway"

AI: "Going to?"
YOU: "Van Buren Drive"
(If AI mishears, spell it: "V-A-N B-U-R-E-N")

AI: "Phone number?"
YOU: "Five five five, six seven eight nine"

AI: "ETA 15-20 minutes. Thank you!"
```

---

## 🎯 Scenario 4: Female Driver

```
AI: "Pickup location?"
YOU: "Carriage Hill Court"

AI: "Going to?"
YOU: "Van Arsdale Road"

AI: "Phone number?"
YOU: "Five five five, nine eight seven six"

YOU: "I need a female driver"
AI: "Got it, female driver."

AI: "ETA 15-20 minutes. Thank you!"
```

---

## ✅ After Call - Check:

1. **Server logs** - Look for "✅ Order created"
2. **TaxiCaller Dashboard** - New booking should appear
3. **Phone SMS** - Confirmation message (if Twilio configured)

---

## 📞 Common Addresses to Test:

**Pickup:**
- Austra Parkway
- Carriage Hill Court
- Beer Sheva Street
- Tutania

**Drop-off:**
- Van Buren Drive
- Van Arsdale Road
- Garfield Road
- Acres Road
