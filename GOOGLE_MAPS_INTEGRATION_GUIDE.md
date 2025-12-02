# Google Maps API Integration Guide

## 📋 Client কে কি বলবেন

Client কে এই message পাঠান:

---

**Subject:** Google Maps API Key Required for Address Geocoding

Dear [Client Name],

The SMS and Voice booking system is almost complete! However, to enable automatic order creation in Onro, we need a **Google Maps API Key** for address geocoding.

**Why it's needed:**
- Onro requires GPS coordinates (latitude/longitude) for each address
- Google Maps API converts addresses to coordinates automatically
- Without it, orders cannot be created in the Onro system

**Cost:**
- Google provides **$200 free credit per month**
- For typical usage (100-200 orders/day), this is completely FREE
- You only pay if you exceed the free quota

**What I need from you:**
Please create a Google Maps API Key and share it with me. Here's how:

1. Go to: https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Enable "Geocoding API"
4. Create an API Key
5. Share the key with me

**Security Note:** I'll store it securely in environment variables.

Let me know once you have the key, and I'll complete the integration within 1 hour!

Best regards,
[Your Name]

---

## 🔧 Integration Steps (After Getting API Key)

### Step 1: Install Google Maps Package
```bash
npm install @googlemaps/google-maps-services-js
```

### Step 2: Add API Key to .env
```bash
GOOGLE_MAPS_API_KEY=your_api_key_here
```

### Step 3: Create Geocoding Service

File: `src/services/geocodingService.js`

```javascript
const { Client } = require('@googlemaps/google-maps-services-js');
const config = require('../config/config');

class GeocodingService {
    constructor() {
        this.client = new Client({});
    }

    async getCoordinates(address) {
        try {
            const response = await this.client.geocode({
                params: {
                    address: address,
                    key: config.googleMaps.apiKey
                }
            });

            if (response.data.results.length > 0) {
                const location = response.data.results[0].geometry.location;
                return [location.lng, location.lat]; // [longitude, latitude]
            }

            // Fallback to [0, 0] if geocoding fails
            console.warn(`Geocoding failed for address: ${address}`);
            return [0, 0];

        } catch (error) {
            console.error('Geocoding error:', error.message);
            return [0, 0]; // Fallback
        }
    }
}

module.exports = new GeocodingService();
```

### Step 4: Update Config

File: `src/config/config.js`

Add this section:
```javascript
googleMaps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY
}
```

### Step 5: Update SMS Parser

File: `src/services/smsParser.js`

Add at the top:
```javascript
const geocodingService = require('./geocodingService');
```

Update `createOnroPayload` method:
```javascript
async createOnroPayload(parsedData, customerPhone, vehicleTypeId = null) {
    const customerName = parsedData.customerName ||
        this.extractCustomerName(parsedData.rawMessage) ||
        'Customer';

    // Get real coordinates
    const pickupCoords = await geocodingService.getCoordinates(parsedData.pickup);
    const deliveryCoords = await geocodingService.getCoordinates(parsedData.delivery);

    const payload = {
        service: {
            id: "0_17d3kbyR41-zdPFiUQV",
            options: []
        },
        paymentMethod: "Wallet",
        paymentSide: "Sender",
        promoCode: "",
        isScheduled: false,
        pickup: {
            address: parsedData.pickup,
            fullName: customerName,
            phone: customerPhone,
            floor: "",
            room: "",
            placeId: "",
            buildingBlock: "",
            coordinates: pickupCoords, // Real coordinates!
            customerDescription: "",
            schedulePickupNow: false,
            scheduleDateAfter: 0,
            scheduleDateBefore: 0,
            email: ""
        },
        dropoffs: [
            {
                address: parsedData.delivery,
                fullName: "Receiver",
                phone: customerPhone,
                coordinates: deliveryCoords, // Real coordinates!
                scheduleDateAfter: 0,
                scheduleDateBefore: 0,
                buildingBlock: "",
                floor: "",
                room: "",
                placeId: "",
                email: ""
            }
        ]
    };

    if (vehicleTypeId) {
        payload.vehicleType = {
            id: vehicleTypeId,
            options: []
        };
    }

    return payload;
}
```

### Step 6: Update Vapi Route

File: `src/routes/vapi.js`

Add at the top:
```javascript
const geocodingService = require('../services/geocodingService');
```

Update `handleBookOrder` function:
```javascript
async function handleBookOrder(args) {
    const { pickupAddress, deliveryAddress, customerName, customerPhone } = args;

    if (!pickupAddress || !deliveryAddress) {
        return {
            success: false,
            message: "I need both pickup and delivery addresses to book the order."
        };
    }

    const vehicleTypeId = process.env.ONRO_VEHICLE_TYPE_ID;
    const phone = customerPhone || '+8801700000000';

    // Get real coordinates
    const pickupCoords = await geocodingService.getCoordinates(pickupAddress);
    const deliveryCoords = await geocodingService.getCoordinates(deliveryAddress);

    const payload = {
        service: {
            id: "0_17d3kbyR41-zdPFiUQV",
            options: []
        },
        paymentMethod: "Wallet",
        paymentSide: "Sender",
        promoCode: "",
        isScheduled: false,
        pickup: {
            address: pickupAddress,
            fullName: customerName || 'Voice Customer',
            phone: phone,
            floor: "",
            room: "",
            placeId: "",
            buildingBlock: "",
            coordinates: pickupCoords, // Real coordinates!
            customerDescription: "",
            schedulePickupNow: false,
            scheduleDateAfter: 0,
            scheduleDateBefore: 0,
            email: ""
        },
        dropoffs: [
            {
                address: deliveryAddress,
                fullName: "Receiver",
                phone: phone,
                coordinates: deliveryCoords, // Real coordinates!
                scheduleDateAfter: 0,
                scheduleDateBefore: 0,
                buildingBlock: "",
                floor: "",
                room: "",
                placeId: "",
                email: ""
            }
        ]
    };

    if (vehicleTypeId) {
        payload.vehicleType = {
            id: vehicleTypeId,
            options: []
        };

        try {
            const order = await onroService.createBooking(payload);
            console.log('✅ Order created:', order.data.id);
            return {
                success: true,
                message: `Booking confirmed! Your order ID is ${order.data.id}. A driver is on the way.`,
                orderId: order.data.id
            };
        } catch (error) {
            console.error('❌ Onro Error:', error.message);
            return {
                success: false,
                message: "I'm sorry, I couldn't create the order in the system. Please try again later."
            };
        }
    } else {
        console.log('⚠️ Vehicle ID missing');
        return {
            success: true,
            message: `I've received your request to send a package from ${pickupAddress} to ${deliveryAddress}. However, the system is in test mode.`,
            details: "Vehicle Type ID missing in .env"
        };
    }
}
```

### Step 7: Update SMS Route

File: `src/routes/sms.js`

Change line where `createOnroPayload` is called:
```javascript
// OLD:
const onroPayload = smsParser.createOnroPayload(parsedData, from, vehicleTypeId);

// NEW (add await):
const onroPayload = await smsParser.createOnroPayload(parsedData, from, vehicleTypeId);
```

Also add `async` to the route handler:
```javascript
router.post('/receive', async (req, res) => {
    // ... rest of code
});
```

---

## ✅ Testing After Integration

### Test 1: SMS Booking
```bash
node test-exact-monroe.js
```

Expected result:
- ✅ Real coordinates fetched from Google Maps
- ✅ Order created successfully in Onro
- ✅ Order ID returned

### Test 2: Voice Booking
```bash
node test-vapi-webhook.js
```

Expected result:
- ✅ Real coordinates fetched
- ✅ Order created in Onro
- ✅ Success message with Order ID

---

## 🎉 After Successful Test

Your system will be **100% complete** and ready for:
- ✅ SMS bookings with automatic order creation
- ✅ Voice bookings with AI assistant
- ✅ Real-time Onro integration
- ✅ Customer confirmations with Order IDs

---

## 📝 Summary

**What you need from client:**
- Google Maps API Key (FREE with $200/month credit)

**What I'll do (1 hour):**
1. Install Google Maps package
2. Create geocoding service
3. Update SMS and Voice handlers
4. Test with real addresses
5. Confirm orders are created in Onro

**Result:**
- Fully functional SMS + Voice booking system
- Ready for production deployment
- Client can start using immediately

---

**Let me know once you get the API Key!** 🚀
