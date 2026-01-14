#!/bin/bash

# Vapi Webhook Test Script
# This simulates a Vapi function call to test your booking system

echo "🚀 Testing Vapi Webhook (TaxiCaller Integration)"
echo "================================================"
echo ""

# Configuration
SERVER_URL="http://localhost:3000"
ENDPOINT="/vapi/webhook"

# Test 1: Book Order
echo "📞 TEST 1: Booking a Ride"
echo "-------------------------"

curl -X POST "${SERVER_URL}${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "type": "function-call",
      "functionCall": {
        "name": "bookOrder",
        "parameters": {
          "pickupAddress": "3 Austra Parkway, Monroe, NY",
          "deliveryAddress": "7 Van Buren Drive, Monroe, NY",
          "customerPhone": "+18125551234",
          "customerName": "John Doe",
          "driverGender": "Female"
        }
      }
    }
  }'

echo ""
echo ""
echo "✅ Booking request sent!"
echo ""
echo "Check your terminal logs for:"
echo "  - 'TaxiCaller Booking Created'"
echo "  - Order ID and Reference"
echo ""
echo "Check TaxiCaller Dashboard:"
echo "  - https://app-rc.taxicaller.net/dispatch-console"
echo ""
echo "================================================"
