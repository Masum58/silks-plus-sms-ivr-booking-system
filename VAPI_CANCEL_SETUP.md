# Vapi Dashboard - Cancel Order Tool Setup

## 🔧 Quick Setup Guide

### Step 1: Login to Vapi
```
https://dashboard.vapi.ai
```

### Step 2: Select Your Assistant
- Go to **Assistants**
- Click on your booking assistant

### Step 3: Add Cancel Tool

Go to **Functions/Tools** section and add:

**Function Name:** `cancelOrder`

**Function JSON:**
```json
{
  "name": "cancelOrder",
  "description": "Cancel an existing delivery order using the order ID",
  "parameters": {
    "type": "object",
    "properties": {
      "orderId": {
        "type": "string",
        "description": "The order ID to cancel (e.g., KjuqG2aDyU63AEt4q3WnK)"
      }
    },
    "required": ["orderId"]
  }
}
```

### Step 4: Update System Prompt

Add this to your assistant's **System Prompt** or **Instructions**:

```
CANCELLATION SUPPORT:

You can help customers cancel their orders.

When a customer wants to cancel:
1. Ask for their order ID politely
2. Use the cancelOrder function with the order ID
3. Wait for the response
4. Clearly communicate the result to the customer

Example conversation:
Customer: "I want to cancel my order"
You: "I can help you with that. What's your order ID?"
Customer: "KjuqG2aDyU63AEt4q3WnK"
You: [Call cancelOrder function]
You: [Read response] "Your order KjuqG2aDyU63AEt4q3WnK has been cancelled successfully."

If cancellation fails, explain that the order may have already been picked up or completed, and suggest contacting support.
```

### Step 5: Save Changes

Click **Save** or **Update Assistant**

---

## ✅ Done!

Your voice assistant can now:
- ✅ Book orders
- ✅ Cancel orders

Test by calling: `+1 812 666 8455`

---

## 🧪 Test Conversation:

```
You: "Hi, I want to cancel my order"
AI: "I can help with that. What's your order ID?"
You: "9389985"
AI: "Your order 9389985 has been cancelled successfully."
```
