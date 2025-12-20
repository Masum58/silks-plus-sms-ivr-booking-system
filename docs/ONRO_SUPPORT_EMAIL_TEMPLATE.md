# Email Template for Onro Support - Payment Method Documentation Request

---

**To:** support@onro.com (or your Onro support contact)

**Subject:** API Documentation Request - Payment Method Implementation

---

Dear Onro Support Team,

We are integrating the Onro API for our delivery booking system and need assistance with implementing payment method selection.

---

## Current Situation:

We are successfully creating orders via the API using the `/api/v1/customer/order/ondemand` endpoint. However, when we attempt to include payment method information, we receive the following error:

```
"paymentMethodId" is required (paymentMethodId)
"paymentProvider" is required (paymentProvider)
"cardInfo" is required (cardInfo)
```

---

## Our Current Payload:

```json
{
  "customerId": "xxx",
  "service": {
    "id": "0_17d3kbyR41-zdPFiUQV",
    "options": []
  },
  "paymentMethod": "Card",
  "paymentSide": "Sender",
  "pickup": { ... },
  "dropoffs": [ ... ],
  "vehicleType": { ... }
}
```

---

## Questions:

1. **What is the correct structure for the payment method object?**
   - What should we send for `paymentMethodId`?
   - What values are accepted for `paymentProvider`?
   - What information is required in `cardInfo`?

2. **How do we enable Card and Wallet payments for our account?**
   - Do we need special permissions or configuration?
   - Are there any account settings we need to enable?

3. **Can you provide example payloads for:**
   - Card payment
   - Wallet payment
   - Cash payment (if supported)

4. **Documentation:**
   - Is there API documentation for payment methods?
   - Are there any test credentials we can use?

---

## Account Information:

- **Account ID:** _eWVj1wYoPkoBOlb-e5uh
- **API Endpoint:** https://api.onro.app
- **Service ID:** 0_17d3kbyR41-zdPFiUQV (Bag-Box)

---

## Use Case:

Our customers need to select their payment method (Card or Wallet) during the booking process via voice call or SMS. We want to pass this selection to the Onro API so it's reflected in the order details.

---

## Urgency:

This is the last remaining feature for our production deployment. We would greatly appreciate your prompt assistance.

---

Thank you for your support!

Best regards,
[Your Name]
[Your Company]
[Your Contact Information]

---
