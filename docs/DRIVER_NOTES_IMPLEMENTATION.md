# Driver Notes Feature - Implementation Guide

## 🎯 Feature Overview
Allow customers to provide special instructions for drivers (e.g., "Leave at door", "Call when you arrive", "Fragile").

---

## 📝 Step 1: Update Vapi System Prompt

### Add to Booking Flow (after step 10):
```
10. Ask "Do you have any special instructions for the driver?" (optional - if customer says no, that's fine)
11. Use the 'bookOrder' tool with all collected information to create the booking
```

### Add Note After Instructions:
```
Note: Driver instructions are optional. Examples include "Leave at door", "Ring doorbell", "Call when you arrive", "Fragile - handle with care", etc.
```

### Update Example Conversation (add before bookOrder call):
```
You: "Perfect. Do you have any special instructions for the driver?"
Customer: "Yes, please call when you arrive"
You: [Call bookOrder with phone, addresses, and driver notes]
You: "Excellent! Your booking is confirmed. Your order reference is 123456. We'll pick up from 123 Main Street, Apartment 5B and deliver to 456 Park Avenue, Unit 304. The driver will call when they arrive. Thank you for using Swifly Messenger!"
```

---

## 🔧 Step 2: Update Vapi Dashboard

### Add Parameter to bookOrder Tool:
```json
{
  "driverNotes": {
    "type": "string",
    "description": "Special instructions for the driver (optional)"
  }
}
```

**Note:** Do NOT add to required array - this is optional!

---

## 💻 Step 3: Backend Code (Already Done)

### Vapi Route (`src/routes/vapi.js`):
```javascript
async function handleBookOrder(args) {
    const { pickupAddress, deliveryAddress, customerName, customerPhone, driverNotes } = args;
    
    // ... existing code ...
    
    const payload = {
        // ... existing fields ...
        pickup: {
            // ... existing fields ...
            customerDescription: driverNotes || "",
        },
        dropoffs: [{
            // ... existing fields ...
        }]
    };
}
```

### SMS Parser (`src/services/smsParser.js`):
Parse "Notes: [instructions]" from SMS messages.

---

## 🧪 Testing

### Voice Test:
```
Call: +1 812 666 8455
AI: "Do you have any special instructions for the driver?"
You: "Yes, please call when you arrive"
AI: Confirms booking with notes
```

### SMS Test:
```
Send: "Book from A to B. Notes: Leave at door"
Response: Booking confirmed with notes
```

### Verify in Onro:
Check if notes appear in order details.

---

## ✅ Checklist:
- [ ] Update Vapi system prompt (Step 1)
- [ ] Update Vapi dashboard tool (Step 2)
- [ ] Update backend code (Step 3)
- [ ] Test voice booking with notes
- [ ] Test SMS booking with notes
- [ ] Verify notes in Onro dashboard

---

**After completing these steps, driver notes will be fully functional!** 📝
