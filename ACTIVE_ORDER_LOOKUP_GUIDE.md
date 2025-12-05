# Active Order Lookup - Setup Guide

This guide explains how to enable the "Active Order Lookup" feature in your Vapi Dashboard.

## 1. Add the `checkOrderStatus` Tool

1.  Log in to your **Vapi Dashboard**.
2.  Navigate to your Assistant.
3.  Go to the **Tools** section.
4.  Click **Create Tool** (or Add Tool).
5.  Select **Function** type.
6.  Enter the following details:

    *   **Name:** `checkOrderStatus`
    *   **Description:** `Check the status of active orders for the customer.`
    *   **Parameters:**
        ```json
        {
          "type": "object",
          "properties": {
            "customerPhone": {
              "type": "string",
              "description": "The customer's phone number."
            }
          },
          "required": ["customerPhone"]
        }
        ```

7.  **Server URL:** Ensure this tool points to your Render URL (same as `bookOrder`):
    `https://swifly-booking.onrender.com/vapi/webhook`

## 2. Update System Prompt

Update your System Prompt to include instructions for this tool.

**Add this to the "Order Status" section:**

```markdown
### 3. Order Status
- If the user asks about the status of their order (e.g., "Where is my driver?", "Is my order ready?"), ask for their phone number if you don't have it.
- Call the `checkOrderStatus` tool with their phone number.
- Report the status returned by the tool clearly.
```

## 3. Testing

1.  Call your Vapi number.
2.  Book an order (this will store the order reference locally).
3.  Ask: "What is the status of my order?"
4.  The assistant should check and tell you the status (e.g., "Pending", "Assigned").

**Note:**
- This feature works by matching the phone number with recent orders created *by this system*.
- It checks the last 50 orders in the Onro account.
- If the server restarts, the local memory of "which phone number made which order" is lost (until we add a database).
