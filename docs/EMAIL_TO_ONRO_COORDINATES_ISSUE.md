# Email to Onro Support - Coordinates Issue

**Subject:** URGENT: "Pickup Zone not found" Error - Coordinates [0, 0] Not Working

---

Dear Onro Support Team,

I've tested with the exact Monroe, NY addresses but still getting the same error. I believe the issue is with the **coordinates field**.

## Problem:
I'm using placeholder coordinates `[0, 0]` because I don't have access to a geocoding service. This seems to be causing the "Pickup Zone not found" error.

## Test Details:
**Addresses Used (Monroe, NY 10950):**
- Pickup: `3 Austra Parkway #103 Monroe NY 10950`
- Delivery: `7 Van Buren Drive #304 Monroe NY 10950`

**Error:**
```
Error: "Pickup Zone not found"
Code: -403
```

**Current Coordinates in Payload:**
```json
"pickup": {
  "address": "3 Austra Parkway #103 Monroe NY 10950",
  "coordinates": [0, 0]  // ← This is the problem
}
```

## Questions:
1. **Can I use coordinates `[0, 0]`** or do I need real GPS coordinates?
2. **Does Onro provide a geocoding service** to convert addresses to coordinates?
3. **Can the API accept addresses without coordinates** and auto-geocode them?
4. **Is there a test mode** where coordinates are not required for zone validation?

## What I Need:
I need a way to create orders **without requiring Google Maps API** or other paid geocoding services. 

**Possible Solutions:**
- Allow `[0, 0]` coordinates and auto-geocode on your end
- Provide an Onro geocoding endpoint
- Skip zone validation for test accounts
- Accept orders with address-only (no coordinates required)

This is blocking my integration from going live. Please provide a solution urgently.

Thank you!

Best regards,
[Your Name]

---

**Technical Details:**
- Customer ID: `_eWVj1wYoPkoBOlb-e5uh`
- Service ID: `0_17d3kbyR41-zdPFiUQV`
- Vehicle Type ID: `0CRbnzYnv4_rQA53K7O5z`
- Payment Method: `Wallet`
- Endpoint: `/api/v1/customer/order/ondemand`

**Full Payload:**
```json
{
  "customerId": "_eWVj1wYoPkoBOlb-e5uh",
  "service": {"id": "0_17d3kbyR41-zdPFiUQV", "options": []},
  "vehicleType": {"id": "0CRbnzYnv4_rQA53K7O5z", "options": []},
  "paymentMethod": "Wallet",
  "paymentSide": "Sender",
  "promoCode": "",
  "isScheduled": false,
  "pickup": {
    "address": "3 Austra Parkway #103 Monroe NY 10950",
    "fullName": "Customer",
    "phone": "+8801712345678",
    "coordinates": [0, 0],
    "floor": "",
    "room": "",
    "placeId": "",
    "buildingBlock": "",
    "customerDescription": "",
    "schedulePickupNow": false,
    "scheduleDateAfter": 0,
    "scheduleDateBefore": 0,
    "email": ""
  },
  "dropoffs": [{
    "address": "7 Van Buren Drive #304 Monroe NY 10950",
    "fullName": "Receiver",
    "phone": "+8801712345678",
    "coordinates": [0, 0],
    "scheduleDateAfter": 0,
    "scheduleDateBefore": 0,
    "buildingBlock": "",
    "floor": "",
    "room": "",
    "placeId": "",
    "email": ""
  }]
}
```
