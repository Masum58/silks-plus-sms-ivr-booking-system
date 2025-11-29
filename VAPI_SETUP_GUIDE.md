# Vapi Voice Integration Setup Guide 📞

## ✅ Server Side Ready

Your server is ready to handle voice bookings!
- **Webhook Endpoint:** `/vapi/webhook`
- **Tool Name:** `bookOrder`
- **Parameters:** `pickupAddress`, `deliveryAddress`

## 🔧 Vapi Dashboard Configuration

To make the AI Assistant work, you need to configure it in the Vapi Dashboard.

### Step 1: Login to Vapi
Go to [dashboard.vapi.ai](https://dashboard.vapi.ai)

### Step 2: Create/Edit Assistant
1. Select your Assistant (or create new)
2. Go to **"Tools"** or **"Functions"** section

### Step 3: Add "bookOrder" Tool
Create a new tool/function with this exact configuration:

**Name:** `bookOrder`
**Description:** `Book a delivery order when the user provides pickup and delivery addresses.`

**Parameters (JSON Schema):**
```json
{
  "type": "object",
  "properties": {
    "pickupAddress": {
      "type": "string",
      "description": "The address where the package should be picked up"
    },
    "deliveryAddress": {
      "type": "string",
      "description": "The address where the package should be delivered"
    },
    "customerName": {
      "type": "string",
      "description": "Name of the customer (optional)"
    },
    "customerPhone": {
      "type": "string",
      "description": "Phone number of the customer (optional)"
    }
  },
  "required": ["pickupAddress", "deliveryAddress"]
}
```

### Step 4: Configure Server URL
1. Go to **"Server"** or **"Callback URL"** section
2. Enter your ngrok URL + `/vapi/webhook`
   
   **Example:**
   ```
   https://YOUR_NGROK_URL.ngrok-free.app/vapi/webhook
   ```

### Step 5: Test It!
1. Call your Assistant (via Vapi dashboard or phone number)
2. Say: **"I want to send a package from Dhaka to Chittagong"**
3. The Assistant should trigger the `bookOrder` tool
4. Your server will process it and respond!

## 🧪 Testing

### Simulated Test (Local)
You can test without configuring Vapi dashboard using the test script:

```bash
node test-vapi-webhook.js
```

### Real Call Test
Once Vapi dashboard is configured:
1. Call the assistant
2. Speak the booking request
3. Check server terminal for logs:
   ```
   📞 Vapi Webhook: tool-calls
   🛠️ Tool Call: bookOrder
   🚀 Processing Voice Booking...
   ```
