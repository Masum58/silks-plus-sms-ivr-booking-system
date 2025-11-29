# Email to Onro Support

**To:** support@onro.com ( )

**Subject:** API Integration - Need Vehicle Type ID for Programmatic Order Creation

---

Hi Onro Support Team,

I'm integrating with the Onro API to create orders programmatically for our SMS/IVR booking system.

**Current Status:**
- ✅ Successfully authenticated via `/api/v1/customer/auth/access-token`
- ✅ Successfully fetched service details via `/api/v1/customer/service/{id}`
- ❌ Getting "VehicleType Not Found" error when creating orders

**My Account Details:**
- Customer ID: `_eWVj1wYoPkoBOlb-e5uh`
- Service ID: `0_17d3kbyR41-zdPFiUQV`
- Service Name: "Bag-Box"
- Order Type: "Ondemand"

**The Issue:**

When I try to create an order via `/api/v1/customer/order/ondemand`, I get:

```json
{
  "code": -400,
  "message": "VehicleType Not Found"
}
```

**What I've Tried:**

1. Used the delivery method ID from service details: `VJ4BV0EsmNacbBa0lT1am`
2. Tried fetching vehicle types from various endpoints (all return 404):
   - `/api/v1/customer/vehicles`
   - `/api/v1/customer/vehicle-types`
   - `/api/v1/vehicles`

**What I Need:**

1. **The correct vehicle type ID(s)** for my "Bag-Box" service
   - I see "Car" and "Car Eataly" options in the dashboard
   - What are their vehicle type IDs?

2. **API endpoint to fetch available vehicle types** (if exists)

3. **Complete example payload** for creating an ondemand order with my service

**Current Payload Structure:**

```json
{
  "service": {
    "id": "0_17d3kbyR41-zdPFiUQV",
    "options": []
  },
  "vehicleType": {
    "id": "NEED_THIS_ID",
    "options": []
  },
  "paymentMethod": "Cash",
  "paymentSide": "Sender",
  "promoCode": "",
  "isScheduled": false,
  "pickup": {
    "address": "Cumberland Gate, London W2 2RH, UK",
    "fullName": "John Doe",
    "phone": "+1234567890",
    "schedulePickupNow": true,
    "scheduleDateAfter": 0,
    "scheduleDateBefore": 0
  }
}
```

**Additional Questions:**

1. Is there a difference between `deliveryMethods` (in service details) and `vehicleType` (in order creation)?
2. Do you have complete API documentation I can reference?
3. Is there a sandbox/test environment where I can test without creating real orders?

Thank you for your help!

Best regards,
[Your Name]
[Your Company]
[Your Contact Info]
