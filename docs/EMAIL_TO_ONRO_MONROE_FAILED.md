# Email to Onro Support - Monroe Zone Test Failed

**Subject:** Monroe, NY Zone Test Failed - Still Getting "Pickup Zone not found"

---

Dear Onro Support Team,

Thank you for confirming that **Monroe, NY 10950** is in an active zone.

However, I'm still getting the same error when trying to create an order:

## Error:
```
Error: "Pickup Zone not found"
Code: -403
```

## Test Addresses Used:
- **Pickup:** 123 Main St, Monroe, NY 10950
- **Delivery:** 456 Lake Rd, Monroe, NY 10950

## Current Payload:
```json
{
  "customerId": "_eWVj1wYoPkoBOlb-e5uh",
  "service": {"id": "0_17d3kbyR41-zdPFiUQV"},
  "vehicleType": {"id": "0CRbnzYnv4_rQA53K7O5z"},
  "paymentMethod": "Wallet",
  "paymentSide": "Sender",
  "pickup": {
    "address": "123 Main St, Monroe, NY 10950",
    "fullName": "Customer",
    "phone": "+8801712345678",
    "coordinates": [0, 0]  // ← Is this the problem?
  },
  "dropoffs": [{
    "address": "456 Lake Rd, Monroe, NY 10950",
    "fullName": "Receiver",
    "phone": "+8801712345678",
    "coordinates": [0, 0]  // ← Is this the problem?
  }]
}
```

## Questions:
1. **Do I need REAL coordinates** instead of `[0, 0]`?
2. **Can you provide exact working addresses** in Monroe, NY that I can test with?
3. **Is there a specific format** for Monroe addresses that I should follow?
4. **Can you test order creation** on your end with my Customer ID to verify zone access?

I've followed your documentation exactly, but the zone error persists.

Please help me resolve this so I can complete the integration.

Thank you!

Best regards,
[Your Name]

---

**Customer ID:** `_eWVj1wYoPkoBOlb-e5uh`
**Endpoint:** `/api/v1/customer/order/ondemand`
