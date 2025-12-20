# Email to Onro Support - Payment Method Issue

**Subject:** Payment Method Error - "Selected payment method is invalid"

---

Dear Onro Support Team,

Thank you for the previous help with the API payload structure. I've successfully implemented the `dropoffs` array format.

## Current Status:
✅ **Fixed Issues:**
- Correct payload structure with `dropoffs` array
- Proper coordinates format `[longitude, latitude]`
- All required fields included

## New Issue:
❌ **Payment Method Error:**
```
Error: "Selected payment method is invalid"
Code: -400
```

## My Current Payload:
```json
{
  "customerId": "_eWVj1wYoPkoBOlb-e5uh",
  "service": {
    "id": "0_17d3kbyR41-zdPFiUQV",
    "options": []
  },
  "vehicleType": {
    "id": "0CRbnzYnv4_rQA53K7O5z",
    "options": []
  },
  "paymentMethod": "Cash",  // ← This is causing the error
  "paymentSide": "Sender",
  "promoCode": "",
  "isScheduled": false,
  "pickup": {
    "address": "123 Gulshan Avenue, Dhaka",
    "fullName": "Customer",
    "phone": "+8801712345678",
    "coordinates": [0, 0],
    "schedulePickupNow": false,
    "scheduleDateAfter": 0,
    "scheduleDateBefore": 0,
    // ... other fields
  },
  "dropoffs": [
    {
      "address": "456 Agrabad, Chittagong",
      "fullName": "Receiver",
      "phone": "+8801712345678",
      "coordinates": [0, 0],
      // ... other fields
    }
  ]
}
```

## Questions:
1. **Is "Cash" payment method enabled** for my account (`_eWVj1wYoPkoBOlb-e5uh`)?
2. **What are the valid payment methods** I can use?
3. Do I need to **configure payment methods** in my account settings first?

According to your documentation, valid options are: `"Cash"`, `"Wallet"`, `"Card"`. 
But "Cash" is not working for me.

Please advise on how to resolve this.

Thank you!

Best regards,
[Your Name]
