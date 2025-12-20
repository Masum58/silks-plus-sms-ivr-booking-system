# 🐛 Voice Call Failed - Troubleshooting Guide

## Problem: AI keeps saying "Let me process..." but nothing happens

**What happened:**
- AI collected all information correctly ✅
- AI tried to book the order ❌
- AI kept repeating "Let me process..." ❌
- Call ended without booking ❌

---

## Root Cause Analysis:

The AI is **unable to call the `bookOrder` tool**. This means:

1. **Tool not configured in Vapi Dashboard**, OR
2. **Tool parameters don't match**, OR
3. **Webhook URL not working**

---

## Solution Steps:

### Step 1: Verify Webhook URL

1. Go to **Vapi Dashboard**
2. Select your **Assistant**
3. Go to **Server URL** or **Functions** section
4. Verify the webhook URL is set to:
   ```
   https://your-production-url.com/api/vapi/webhook
   ```
5. Make sure it's **publicly accessible**

### Step 2: Verify Tool Configuration

1. Go to **Vapi Dashboard** → **Tools**
2. Check if `bookOrder` tool exists
3. Verify the tool has these **exact parameters**:

```json
{
  "name": "bookOrder",
  "description": "Book a delivery order",
  "parameters": {
    "type": "object",
    "properties": {
      "pickupAddress": {
        "type": "string",
        "description": "Complete pickup address"
      },
      "deliveryAddress": {
        "type": "string",
        "description": "Complete delivery address"
      },
      "customerPhone": {
        "type": "string",
        "description": "Customer phone number"
      },
      "customerName": {
        "type": "string",
        "description": "Customer name (optional)"
      },
      "driverNotes": {
        "type": "string",
        "description": "Special instructions for driver (optional)"
      },
      "paymentMethod": {
        "type": "string",
        "enum": ["Cash", "Wallet", "Card"],
        "description": "Payment method"
      },
      "vehicleType": {
        "type": "string",
        "enum": ["Car", "Car Eataly"],
        "description": "Vehicle type"
      }
    },
    "required": [
      "pickupAddress",
      "deliveryAddress",
      "customerPhone",
      "paymentMethod",
      "vehicleType"
    ]
  }
}
```

### Step 3: Test Webhook Manually

Run this command to test if your webhook is accessible:

```bash
curl -X POST https://your-production-url.com/api/vapi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "type": "function-call",
      "functionCall": {
        "name": "bookOrder",
        "parameters": {
          "pickupAddress": "3 Austra Parkway, Unit 103, Monroe, NY 10950",
          "deliveryAddress": "7 Van Buren Drive, Unit 304, Monroe, NY 10950",
          "customerPhone": "01317365623",
          "paymentMethod": "Cash",
          "vehicleType": "Car"
        }
      }
    }
  }'
```

**Expected Response:**
```json
{
  "results": [
    {
      "result": {
        "success": true,
        "message": "Perfect! I'm processing your booking now. Your order reference is X-X-X-X-X-X..."
      }
    }
  ]
}
```

---

## Quick Checklist:

- [ ] Webhook URL is set in Vapi Dashboard
- [ ] Webhook URL is publicly accessible
- [ ] `bookOrder` tool exists in Vapi Dashboard
- [ ] Tool parameters match exactly
- [ ] Tool is enabled/active
- [ ] Server is running and accessible

---

## Alternative: Check Vapi Logs

1. Go to **Vapi Dashboard**
2. Find **Logs** or **Call History**
3. Look for the failed call
4. Check for error messages like:
   - "Tool not found"
   - "Webhook timeout"
   - "Invalid parameters"

---

## Next Steps:

1. **Check your production server URL**
   - Is it deployed?
   - Is it running?
   - Is it publicly accessible?

2. **Verify Vapi Dashboard configuration**
   - Tools configured?
   - Webhook URL set?

3. **Test webhook manually** (see Step 3 above)

4. **Share error logs** if available

---

## Need Help?

If you're stuck, please provide:
1. Your production webhook URL
2. Screenshot of Vapi Tools configuration
3. Any error messages from Vapi logs
