# TaxiCaller API Integration - Full Request Details

**Date:** February 17, 2026  
**Integration:** Vapi AI Voice Booking System → TaxiCaller Production API  
**Company ID:** 48647  
**API Base URL:** `https://api.taxicaller.net`

---

## 🔴 Current Issues

We are experiencing the following issues with bookings created via the API:

1. **Vehicle Type Not Selected:** The booking shows "No vehicle type" in TaxiCaller console
2. **Payment Method Not Selected:** Payment method is not being set
3. **Unassigned Status:** All bookings go to "Unassigned" instead of being auto-assigned

---

## 📡 Complete API Request Details

### Endpoint
```
POST https://api.taxicaller.net/api/v1/booker/order
```

### Authentication
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**JWT Token Generation:**
- Endpoint: `POST /api/v1/booker/auth`
- Payload: `{ "api_key": "YOUR_API_KEY" }`
- Token Type: Booker JWT (valid for 24 hours)

---

## 📦 Full Request Payload

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

---

## 🔍 Field-by-Field Breakdown

### Order Object

| Field | Value | Purpose | Status |
|-------|-------|---------|--------|
| `company_id` | `48647` | Your production company ID | ✅ Working |
| `provider_id` | `0` | Universal visibility (all dispatchers) | ✅ Working |
| `vehicle_type` | `"1"` | Standard Car (ID from your system) | ❌ **Not appearing in console** |
| `external_id` | `"abc123"` | Our internal reference for tracking | ✅ Working |

### Items Array (Route Nodes)

**Passenger Node (seq: 0):**
- `@type`: `"passengers"` - Indicates pickup with customer info
- `passenger.name`: Customer's full name
- `passenger.phone`: E.164 format (e.g., `+19177203770`)
- `passenger.email`: Default to `guest@example.com`
- `node.type`: `"PICK_UP"`
- `node.address`: Full street address
- `node.location`: GPS coordinates from Google Maps API

**Drop-off Node (seq: 1):**
- `@type`: `"route"` - Standard route node
- `node.type`: `"DROP_OFF"`
- `node.address`: Destination address
- `node.location`: GPS coordinates

### Payment Object

```json
"payment": {
  "method": "CARD"
}
```

**Issue:** This field is not being recognized. We've tried:
- `"CARD"`
- `"CASH"`
- `"WALLET"`

❌ **Payment method still shows as "Not selected" in console**

### Dispatch Options

```json
"dispatch_options": {
  "auto_assign": false
}
```

- We intentionally set `auto_assign: false` so orders appear in "Unassigned" for manual dispatcher review
- This is working as expected

---

## 📸 Example API Response (Success)

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

**Price Format:** TaxiCaller returns price as `"7000 USD"` (cents), which we convert to `$7.00`

---

## ❓ Questions for TaxiCaller Support

### 1. Vehicle Type Field
**Question:** What is the correct field name and format for specifying vehicle type?

**What we've tried:**
- `"vehicle_type": "1"` (String)
- `"vehicle_type": 1` (Integer)
- `"vehicle_id": 1`

**Expected Result:** Booking should show "Standard Car" in the console

---

### 2. Payment Method Field
**Question:** What is the correct structure for the payment object?

**What we've tried:**
```json
"payment": {
  "method": "CARD"
}
```

**Alternative formats we can try:**
```json
"payment_method": "CARD"
```
or
```json
"payment": {
  "type": "CARD"
}
```

**Expected Result:** Booking should show "Card" as payment method

---

### 3. Auto-Assignment
**Question:** Is there a way to enable auto-assignment via API while still maintaining universal visibility (provider_id: 0)?

**Current Behavior:**
- `auto_assign: false` → Goes to "Unassigned" ✅ (This is what we want for now)
- `auto_assign: true` → Would it assign to a specific driver automatically?

---

## 🧪 Test Booking Details

**Most Recent Test Booking:**
- **Order ID:** `67195f144e220ad6`
- **Reference:** `tu4um`
- **Created:** Feb 16, 2026
- **Status:** Successfully created, visible in console
- **Issues:** Vehicle type and payment method not showing

---

## 📞 Contact Information

If TaxiCaller support needs to review our integration:

- **Integration Type:** Vapi AI Voice Assistant → TaxiCaller API
- **Environment:** Production (`api.taxicaller.net`)
- **Company ID:** 48647
- **Authentication:** Booker JWT (API Key-based)
- **Webhook URL:** `https://swifly-booking.onrender.com/vapi/webhook`

---

## 🚀 Next Steps

1. Please review the payload structure above
2. Confirm the correct field names for:
   - Vehicle Type
   - Payment Method
3. Provide any additional required fields we may be missing
4. Let us know if there are any API version differences we should be aware of

Thank you for your assistance!
