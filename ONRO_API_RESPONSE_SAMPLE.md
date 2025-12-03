# Onro API Response Sample

## Request to Onro Support:

Here is the full response we receive when creating an order via API:

---

## API Endpoint:
```
POST https://api.swiflymessenger.com/api/v1/customer/order/ondemand
```

## Request Payload:
```json
{
  "service": {
    "id": "0_17d3kbyR41-zdPFiUQV",
    "options": []
  },
  "paymentMethod": "Wallet",
  "pickup": {
    "address": "3 Austra Parkway #103 Monroe NY 10950",
    "coordinates": [-74.161288, 41.332023],
    "scheduleDateAfter": 0,
    "scheduleDateBefore": 0,
    "buildingBlock": "",
    "floor": "",
    "room": "",
    "placeId": "",
    "email": ""
  },
  "dropoffs": [
    {
      "address": "7 Van Buren Drive #304 Monroe NY 10950",
      "coordinates": [-74.1686768, 41.3386472],
      "scheduleDateAfter": 0,
      "scheduleDateBefore": 0,
      "buildingBlock": "",
      "floor": "",
      "room": "",
      "placeId": "",
      "email": ""
    }
  ],
  "vehicleType": {
    "id": "0CRbnzYnv4_rQA53K7O5z",
    "options": []
  },
  "customerId": "_eWVj1wYoPkoBOlb-e5uh"
}
```

## Response Received:
```json
{
  "data": {
    "id": "hbwgt9b298k3lpxt9k7jy",
    // ... other fields ...
  }
}
```

## Question:
When we create an order via API, we receive an ID like `hbwgt9b298k3lpxt9k7jy`.

However, in the Onro dashboard (https://manage.swiflymessenger.com), we see a different CODE like `9624222`.

**Which field in the API response contains this dashboard CODE (9624222)?**

We need this CODE to:
1. Display to customers
2. Allow customers to cancel orders using this CODE
3. Match API-created orders with dashboard orders

Please provide the exact field name in the response that contains the dashboard CODE.

Thank you!

---

## Additional Context:

We are building an SMS + Voice booking system that integrates with Onro API.

Our system flow:
1. Customer books via SMS/Voice
2. We create order via Onro API
3. We send Order ID to customer
4. Customer uses Order ID to cancel

Currently, we're sending the `id` field, but customers can't find their orders in the dashboard using this ID.

We need the dashboard CODE field name to fix this issue.
