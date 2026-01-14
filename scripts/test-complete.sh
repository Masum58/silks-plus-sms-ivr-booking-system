#!/bin/bash

# Complete Test Suite for TaxiCaller Integration
# Run this script to test all components

echo "🚀 TaxiCaller Integration - Complete Test Suite"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SERVER_URL="http://localhost:3000"
VAPI_ENDPOINT="/vapi/webhook"

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to check if server is running
check_server() {
    echo "📡 Checking if server is running..."
    if curl -s "${SERVER_URL}" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Server is running${NC}"
        return 0
    else
        echo -e "${RED}❌ Server is not running!${NC}"
        echo "Please start the server with: npm start"
        exit 1
    fi
}

# Test 1: Simple Booking
test_booking() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🧪 TEST 1: Simple Booking"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    RESPONSE=$(curl -s -X POST "${SERVER_URL}${VAPI_ENDPOINT}" \
      -H "Content-Type: application/json" \
      -d '{
        "message": {
          "type": "function-call",
          "functionCall": {
            "name": "bookOrder",
            "parameters": {
              "pickupAddress": "3 Austra Parkway, Monroe, NY",
              "deliveryAddress": "7 Van Buren Drive, Monroe, NY",
              "customerPhone": "+15551234567",
              "customerName": "Test User"
            }
          }
        }
      }')
    
    if echo "$RESPONSE" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ PASSED: Booking successful${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAILED: Booking failed${NC}"
        echo "Response: $RESPONSE"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# Test 2: Booking with Gender Preference
test_gender_preference() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🧪 TEST 2: Booking with Female Driver Preference"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    RESPONSE=$(curl -s -X POST "${SERVER_URL}${VAPI_ENDPOINT}" \
      -H "Content-Type: application/json" \
      -d '{
        "message": {
          "type": "function-call",
          "functionCall": {
            "name": "bookOrder",
            "parameters": {
              "pickupAddress": "14 Carriage Hill Court, Monroe, NY",
              "deliveryAddress": "2 Van Arsdale Road, Monroe, NY",
              "customerPhone": "+15559876543",
              "customerName": "Jane Doe",
              "driverGender": "Female"
            }
          }
        }
      }')
    
    if echo "$RESPONSE" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ PASSED: Booking with gender preference successful${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAILED: Booking failed${NC}"
        echo "Response: $RESPONSE"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# Test 3: Short Address Format
test_short_address() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🧪 TEST 3: Short Address Format (Real-world)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    RESPONSE=$(curl -s -X POST "${SERVER_URL}${VAPI_ENDPOINT}" \
      -H "Content-Type: application/json" \
      -d '{
        "message": {
          "type": "function-call",
          "functionCall": {
            "name": "bookOrder",
            "parameters": {
              "pickupAddress": "Austra Parkway, Monroe",
              "deliveryAddress": "Van Buren Drive, Monroe",
              "customerPhone": "+15551112222",
              "customerName": "Quick Test"
            }
          }
        }
      }')
    
    if echo "$RESPONSE" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ PASSED: Short address format works${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${YELLOW}⚠️  WARNING: Short address may need full format${NC}"
        echo "Response: $RESPONSE"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# Test 4: Status Check
test_status_check() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🧪 TEST 4: Order Status Check"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    RESPONSE=$(curl -s -X POST "${SERVER_URL}${VAPI_ENDPOINT}" \
      -H "Content-Type: application/json" \
      -d '{
        "message": {
          "type": "function-call",
          "functionCall": {
            "name": "checkOrderStatus",
            "parameters": {
              "customerPhone": "+15551234567"
            }
          }
        }
      }')
    
    if echo "$RESPONSE" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ PASSED: Status check endpoint works${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAILED: Status check failed${NC}"
        echo "Response: $RESPONSE"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# Test 5: Empty Body (Vapi Test Tool)
test_empty_body() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🧪 TEST 5: Empty Body Handling"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    RESPONSE=$(curl -s -X POST "${SERVER_URL}${VAPI_ENDPOINT}" \
      -H "Content-Type: application/json" \
      -d '{}')
    
    if echo "$RESPONSE" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ PASSED: Empty body handled gracefully${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAILED: Empty body not handled${NC}"
        echo "Response: $RESPONSE"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# Run all tests
main() {
    check_server
    
    echo ""
    echo "Starting test suite..."
    echo ""
    
    test_booking
    sleep 1
    
    test_gender_preference
    sleep 1
    
    test_short_address
    sleep 1
    
    test_status_check
    sleep 1
    
    test_empty_body
    
    # Summary
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📊 TEST SUMMARY"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo -e "${GREEN}✅ Tests Passed: $TESTS_PASSED${NC}"
    echo -e "${RED}❌ Tests Failed: $TESTS_FAILED${NC}"
    echo ""
    
    TOTAL=$((TESTS_PASSED + TESTS_FAILED))
    PERCENTAGE=$((TESTS_PASSED * 100 / TOTAL))
    
    echo "Success Rate: ${PERCENTAGE}%"
    echo ""
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "${GREEN}🎉 All tests passed! System is ready.${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Update Vapi System Prompt with docs/VAPI_SYSTEM_PROMPT_REALISTIC.md"
        echo "2. Make a real phone call to test voice interaction"
        echo "3. Check TaxiCaller dashboard for created bookings"
    else
        echo -e "${RED}⚠️  Some tests failed. Please check server logs.${NC}"
        echo ""
        echo "Troubleshooting:"
        echo "1. Check if TaxiCaller credentials are correct in .env"
        echo "2. Check server terminal for detailed error messages"
        echo "3. Verify Google Maps API key is valid"
    fi
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Run main function
main
