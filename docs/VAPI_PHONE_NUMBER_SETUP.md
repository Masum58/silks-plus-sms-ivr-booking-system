# Vapi Dashboard Configuration - Phone Number Collection

## 🔧 Update Required in Vapi Dashboard

### Step 1: Update bookOrder Tool

Go to: https://dashboard.vapi.ai → Your Assistant → Tools → bookOrder

**Update the function parameters to include phone number:**

```json
{
  "type": "function",
  "function": {
    "name": "bookOrder",
    "description": "Books a delivery order with pickup and delivery addresses and customer phone number",
    "parameters": {
      "type": "object",
      "properties": {
        "pickupAddress": {
          "type": "string",
          "description": "Full pickup address including street, city, state, and ZIP code"
        },
        "deliveryAddress": {
          "type": "string",
          "description": "Full delivery address including street, city, state, and ZIP code"
        },
        "customerPhone": {
          "type": "string",
          "description": "Customer's phone number for order updates and delivery coordination"
        },
        "customerName": {
          "type": "string",
          "description": "Customer's name (optional)"
        }
      },
      "required": ["pickupAddress", "deliveryAddress", "customerPhone"]
    }
  }
}
```

**Key Changes:**
- ✅ Added `customerPhone` parameter
- ✅ Made it **required** (in required array)
- ✅ Added description for phone number

---

### Step 2: Update System Prompt

Copy the updated prompt from `VAPI_COMPLETE_SYSTEM_PROMPT.md` and paste it into the System Prompt field.

**New flow includes:**
1. Greet customer
2. **Ask for phone number** ← NEW
3. **Confirm phone number** ← NEW
4. Ask for pickup address
5. Confirm pickup
6. Ask for delivery address
7. Confirm delivery
8. Book order with all info

---

### Step 3: Test

After updating:
1. Call your Vapi number: +1 812 666 8455
2. AI should ask: "May I have your phone number?"
3. Provide phone number
4. AI should confirm it
5. Continue with booking

---

## ✅ Checklist:

- [ ] Updated bookOrder tool with customerPhone parameter
- [ ] Made customerPhone required
- [ ] Updated system prompt
- [ ] Saved changes
- [ ] Tested phone number collection

---

**After completing these steps, phone numbers will be collected and sent to Onro!** 📱
