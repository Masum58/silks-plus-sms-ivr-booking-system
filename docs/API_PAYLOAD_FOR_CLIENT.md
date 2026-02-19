# TaxiCaller API Request Details

## Endpoint
```
POST https://api.taxicaller.net/api/v1/booker/order
```

## Headers
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

## Request Payload

```json
{
  "order": {
    "company_id": 48647,
    "provider_id": 0,
    "vehicle_type": "1",
    "external_id": "abc123",
    "items": [
      {
        "@type": "passengers",
        "seq": 0,
        "passenger": {
          "name": "John Doe",
          "phone": "+19177203770",
          "email": "guest@example.com"
        },
        "node": {
          "type": "PICK_UP",
          "address": "Austra Parkway, Monroe, NY",
          "location": {
            "lat": 41.3309,
            "lng": -74.1862
          }
        }
      },
      {
        "@type": "route",
        "seq": 1,
        "node": {
          "type": "DROP_OFF",
          "address": "Beer Sheva Street, Monroe, NY",
          "location": {
            "lat": 41.3287,
            "lng": -74.1801
          }
        }
      }
    ],
    "payment": {
      "method": "CARD"
    },
    "price_info": {
      "currency": "USD"
    }
  },
  "dispatch_options": {
    "auto_assign": false
  }
}
```

## Response (Success)

```json
{
  "order": {
    "order_id": "67195f144e220ad6",
    "company_id": 48647,
    "state": "UNASSIGNED",
    "items": [...],
    "created": 1708156420
  },
  "price": "7000 USD",
  "dispatch_options": {
    "auto_assign": false
  }
}
```


