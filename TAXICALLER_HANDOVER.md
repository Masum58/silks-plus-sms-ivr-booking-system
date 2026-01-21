# TaxiCaller Integration Handover Document

## 1. Project Overview
This project integrates an SMS/IVR system with TaxiCaller for automated taxi bookings. The system uses Vapi for voice calls and Twilio for SMS.

## 2. Key Files
- **`src/services/taxiCallerService.js`**: Main service handling API calls to TaxiCaller (Auth, Booking, Fare).
- **`src/routes/api.js`**: API endpoints that receive requests and call the service.
- **`tests/check-booking-response.js`**: Test script to verify the raw API response from TaxiCaller.
- **`.env`**: Contains `TAXICALLER_API_KEY`, `TAXICALLER_COMPANY_ID`, etc.

## 3. Current Status & Blocking Issue
The system successfully creates bookings in TaxiCaller, but the **`fare_quote`** and **`price`** fields always return **`null`**.

### Error Signature in API Response:
```json
"vehicle": {
  "type": "INVALID"
}
```
This indicates that TaxiCaller's tariff engine cannot match the booking request with any active Tariff Rule.

## 4. Admin Panel Configuration (Current State)
- **Zones**: A zone named "NewYork" (ID 102) is defined.
- **Tariffs**: A "Standard" tariff is defined with a Taximeter ($5 start, $0.30 distance).
- **Tariff Groups**: Group "1" (or "Standard") is linked to the "Standard" tariff.
- **Tariff Rules**:
  - Booking source: `API` (or `api`)
  - Vehicle type: `Sedan` (ID 1)
  - Vehicle class: `Sedan` (or `Standard`)
  - Zones: `NewYork` (From/To)
  - Tariff group: `Standard`
  - **Estimates**: "Enable fare estimates" is checked.

## 5. Troubleshooting Steps Taken
- **Booking Source**: Tried both `"API"` and `"api"`. `"api"` avoids 500 errors but doesn't trigger fare.
- **Vehicle Type**: Explicitly sending `vehicle_type_id: 1` (matches Sedan in panel).
- **Vehicle Class**: Tried `"Standard"`, `"Sedan"`, and `null`.
- **Tariff Group**: Tried sending `tariff_group: 1` and `tariff_group: "Standard"`.
- **Addresses**: Tried specific Monroe, NY addresses and general "New York, NY" addresses to ensure zone matching.

## 6. Recommendations for Next Developer
1. **Verify Vehicle Type ID**: Use the API to list vehicle types and confirm that `1` is indeed the correct ID for "Sedan".
2. **Zone Matching**: Check if the coordinates sent in the API request fall exactly within the polygon defined for the "NewYork" zone.
3. **Tariff Rule Priority**: Ensure no other rules are overriding the "API" rule.
4. **TaxiCaller Support**: If the payload matches the rule exactly and still returns `null`, contact TaxiCaller support with the `order_id` from the test script.

## 7. How to Test
Run the following command to see the current raw response:
```bash
node tests/check-booking-response.js
```
