# Email to Onro Support

**Subject:** Need Help with Order Creation API - Delivery Address Field Name

---

Dear Onro Support Team,

I am integrating your API for programmatic order creation and need assistance with the correct payload structure.

## What I Have:
- ✅ Successfully authenticated using `/api/v1/customer/auth/access-token`
- ✅ Service ID: `0_17d3kbyR41-zdPFiUQV` (Bag-Box)
- ✅ Vehicle Type ID: `0CRbnzYnv4_rQA53K7O5z` (Car - you provided this)
- ✅ Customer ID: `_eWVj1wYoPkoBOlb-e5uh`

## What I'm Trying:
Create an on-demand order with pickup and delivery addresses using:
- Endpoint: `/api/v1/customer/order/ondemand`

## The Problem:
I cannot find the correct field name for the **delivery/dropoff address**. I have tried:
- `delivery` → Error: "delivery is not allowed"
- `dropoff` → Error: "dropoff is not allowed"
- `dropOff` → Error: "dropOff is not allowed"
- `destinations` → Error: "destinations is not allowed"
- `stops` → Error: "stops is not allowed"
- `dropPoints` → Error: "dropPoints is not allowed"

## My Current Payload (that fails):
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
  "paymentMethod": "Cash",
  "paymentSide": "Sender",
  "promoCode": "",
  "isScheduled": false,
  "pickup": {
    "address": "123 Gulshan Avenue, Dhaka",
    "fullName": "Customer",
    "phone": "+8801712345678",
    "schedulePickupNow": true,
    "scheduleDateAfter": 0,
    "scheduleDateBefore": 0
  }
  // ❓ What field should I use here for delivery address?
}
```

## Questions:
1. **What is the correct field name** for the delivery/dropoff address in the `/ondemand` endpoint?
2. Can you provide a **complete working example payload** for creating an on-demand order with pickup and delivery?
3. Is there any **API documentation** that shows the exact payload structure?

I would greatly appreciate your help with this.

Thank you!

Best regards,
[Your Name]
