# Car Safe: AI Taxi Booking System (Voice & SMS)

An automated taxi booking solution using **Voice AI (Vapi)** and **SMS (Twilio)**, integrated directly with the **TaxiCaller Dispatch Platform**. This system allows customers to book rides, check status, and cancel orders via natural language voice calls or simple text messages.

## 🚀 Features

- **Voice AI Dispatcher (Vapi)**:
  - Natural, human-like conversation for booking rides.
  - Automatic address recognition for Monroe, NY (including aliases like "Tutania", "KJ", "Beer Sheva").
  - Support for additional stops and driver gender preferences (Lady/Man driver).
  - Real-time booking cancellation via voice.
- **SMS Booking (Twilio)**:
  - Book rides by texting (e.g., "Book from Tutania to Van Buren").
  - Cancel orders via text (e.g., "Cancel order ABC12").
  - Automated SMS confirmations with order references and ETAs.
- **TaxiCaller Integration**:
  - Direct integration with TaxiCaller API for real-time order creation.
  - Automatic customer profile management.
  - Real-time price estimates and status tracking.
- **Robust Backend**:
  - Node.js/Express middleware deployed on Render.
  - Parallel geocoding for fast response times.
  - Intelligent order reference mapping (short codes for easy recall).

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Integrations**: 
  - **TaxiCaller API** (Dispatch & Order Management)
  - **Vapi** (Voice AI Orchestration)
  - **Twilio** (SMS Gateway)
  - **Google Maps API** (Geocoding & Address Validation)
- **Deployment**: Render

## 📋 Prerequisites

- Node.js (v18 or higher)
- TaxiCaller API Key & Company ID
- Vapi Account & API Key
- Twilio Account (SID, Auth Token, and Phone Number)
- Google Maps API Key

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd silks_plus_sms_ivr
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   
   # TaxiCaller Config
   TAXICALLER_API_KEY=your_api_key
   TAXICALLER_COMPANY_ID=your_company_id
   TAXICALLER_API_URL=https://api-rc.taxicaller.net
   
   # Twilio Config
   TWILIO_ACCOUNT_SID=your_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=your_phone_number
   
   # Google Maps
   GOOGLE_MAPS_API_KEY=your_google_key
   
   # Vapi
   VAPI_API_KEY=your_vapi_key
   ```

## 🏃‍♂️ Running Locally

1. **Start the Server:**
   ```bash
   npm start
   ```

2. **Expose to Internet (Ngrok):**
   ```bash
   ngrok http 3000
   ```

3. **Update Webhooks:**
   - **Twilio SMS:** `[Your-URL]/sms/receive`
   - **Vapi Webhook:** `[Your-URL]/vapi/webhook`

## 🧪 Testing

The project includes automated test scripts for all core flows:

- **Test Voice Booking Flow:**
  ```bash
  node tests/test-vapi-final.js
  ```
- **Test SMS Booking Flow:**
  ```bash
  node tests/test-sms-booking.js
  ```
- **Test Cancellation Flow:**
  ```bash
  node tests/test-vapi-cancel.js
  ```

## 📂 Project Structure

- `src/routes/vapi.js`: Main logic for Voice AI tool handling.
- `src/routes/sms.js`: SMS parsing and booking logic.
- `src/services/taxiCallerService.js`: Direct communication with TaxiCaller API.
- `src/services/smsParser.js`: Intelligent text parsing for booking requests.
- `docs/`: System prompts and configuration guides.
- `tests/`: End-to-end simulation scripts.

## 📄 License

ISC
