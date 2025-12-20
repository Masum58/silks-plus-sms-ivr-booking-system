# Email to Onro Support - Request for Vehicle ID

**To:** [Onro Support Email - যেখান থেকে credentials পেয়েছেন]

**Subject:** Request for Vehicle ID - API Integration (Customer ID: _eWVj1wYoPkoBOlb-e5uh)

---

Hi Onro Team,

Thank you for providing the API credentials and documentation link.

I have successfully:
- ✅ Authenticated using the provided Client ID and Client Secret
- ✅ Fetched service details for "Bag-Box" (Service ID: `0_17d3kbyR41-zdPFiUQV`)
- ✅ Reviewed your API documentation: https://documenter.getpostman.com/view/30670905/2sA3XLDPB6

**What I Need:**

According to your documentation, the following information should be provided:
- Customer ID ✅ (Received: `_eWVj1wYoPkoBOlb-e5uh`)
- Client ID ✅ (Received)
- Client Secret ✅ (Received)
- Service ID ✅ (Have: `0_17d3kbyR41-zdPFiUQV`)
- **Vehicle ID ❌ (Missing - Please provide)**
- Base URL ✅ (Have: `https://api.swiflymessenger.com/`)
- Payment Method & Payment Side ✅ (Using: Cash, Sender)

**My Question:**

What is the **Vehicle ID** (or Vehicle Type ID) that I should use for creating ondemand orders with the "Bag-Box" service?

I can see in the dashboard that there are two vehicle options:
1. "Car"
2. "Car Eataly"

Please provide the Vehicle IDs for these options so I can use them in the API payload.

**Current Payload Structure:**

```json
{
  "service": {
    "id": "0_17d3kbyR41-zdPFiUQV",
    "options": []
  },
  "vehicleType": {
    "id": "NEED_VEHICLE_ID_HERE",  // ← Please provide this
    "options": []
  },
  "paymentMethod": "Cash",
  "paymentSide": "Sender",
  "promoCode": "",
  "isScheduled": false,
  "pickup": {
    "address": "...",
    "fullName": "...",
    "phone": "...",
    "schedulePickupNow": true,
    "scheduleDateAfter": 0,
    "scheduleDateBefore": 0
  }
}
```

**Error I'm Getting:**

When I try to create an order without the correct Vehicle ID, I get:
```
"VehicleType Not Found"
```

**Additional Information:**

- I tried fetching vehicles via API endpoints but they all return 404
- Service details show a `deliveryMethods` array with ID `VJ4BV0EsmNacbBa0lT1am`, but using this as vehicleType ID doesn't work

Could you please provide:
1. The correct Vehicle ID(s) for "Car" and "Car Eataly"
2. Confirmation if there are any other required fields I'm missing

Thank you for your help!

Best regards,
Masum Abedin
Swiftly Integrations

---

**Quick Reference:**
- Customer ID: `_eWVj1wYoPkoBOlb-e5uh`
- Service ID: `0_17d3kbyR41-zdPFiUQV`
- Service Name: Bag-Box
- Order Type: Ondemand
