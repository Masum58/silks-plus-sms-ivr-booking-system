# TaxiCaller Production API Integration Details

This document outlines the technical specifications of our integration with the TaxiCaller API, specifically aligned with the production standards requested by the TaxiCaller support team for Company ID: **48647**.

## 🚀 API Endpoint
- **URL:** `https://api.taxicaller.net/api/v1/booker/order`
- **Method:** `POST`
- **Authentication:** `Bearer [Booker Token]` (Fetched via `/api/v1/booker/booker-token`)

---

## 🛠️ Payload Structure Key Features

1. **Route Mapping (Full Path):**
   - **`route.nodes`:** Defines Pickup (seq 0) and Drop-off (seq 1) with micro-degree coordinates `[Longitude * 10^6, Latitude * 10^6]`.
   - **`route.legs`:** Includes metadata for distance (meters) and estimated duration (seconds).
   - **`pts` Array:** A flat array of micro-degree integers `[lng, lat, lng, lat...]` defining the exact road path, ensuring visual route visibility on the dispatch map.

2. **Passenger Requirements:**
   - **`require` Object:** Correctly placed inside the items array to specify `seats`, `wc`, and `bags`.
   - **`pay_info`:** Relocated directly into the passenger item (Type 5: CARD_PRESENT).

3. **ASAP Booking:**
   - **`times.arrive.target`:** Set to `0` as per Julianna's instruction for immediate dispatch.

---

## 📄 Real Production Sample Payload

```json
{
  "order": {
    "company_id": 48647,
    "provider_id": 0,
    "vehicle_type": "1",
    "external_id": "7hkoa",
    "items": [
      {
        "@type": "passengers",
        "seq": 0,
        "passenger": {
          "name": "Vapi Live Test",
          "phone": "+8801317365623",
          "email": "guest@example.com"
        },
        "require": {
          "seats": 1,
          "wc": 0,
          "bags": 0
        },
        "pay_info": [
          {
            "@t": 5,
            "data": null
          }
        ]
      }
    ],
    "route": {
      "nodes": [
        {
          "location": {
            "name": "Austra Parkway, Monroe, NY",
            "coords": [-74161116, 41330452]
          },
          "actions": [{ "@type": "client_action", "item_seq": 0, "action": "in" }],
          "seq": 0,
          "times": { "arrive": { "target": 0, "latest": 0 } },
          "info": { "all": "[GENDER PREFERENCE: FEMALE] " }
        },
        {
          "location": {
            "name": "Beer Sheva Street, Monroe, NY",
            "coords": [-74161059, 41329321]
          },
          "actions": [{ "@type": "client_action", "item_seq": 0, "action": "out" }],
          "seq": 1,
          "times": null,
          "info": {}
        }
      ],
      "meta": {
        "dist": 1611,
        "est_dur": 272
      },
      "legs": [
        {
          "meta": { "dist": 1611, "est_dur": 272 },
          "pts": [-74161120, 41330450, -74161710, 41330800, -74161860, 41330900, ...],
          "from_seq": 0,
          "to_seq": 1
        }
      ]
    },
    "price_info": { "currency": "USD" }
  },
  "dispatch_options": { "auto_assign": true }
}
```

---

## ✅ Integration Summary
- **Geocoding:** Powered by Google Maps API.
- **Route Logic:** Dynamic calculations for segments using Google Directions API.
- **ASAP Priority:** All bookings default to immediate dispatch.
