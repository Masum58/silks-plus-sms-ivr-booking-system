# Silks Plus SMS & IVR Booking System

This project implements an automated booking system using SMS (Twilio) and Voice AI (Vapi), integrated with the Onro platform for order management. It allows customers to place orders via text messages or voice calls.

## 🚀 Features

- **SMS Booking**: Automated booking flow via Twilio SMS.
- **Voice Booking (IVR)**: AI-powered voice ordering using Vapi.
- **Onro Integration**: Seamless integration with Onro API for creating and managing orders.
- **Webhook Handling**: Robust webhook endpoints for real-time communication with Twilio and Vapi.
- **Automated Testing**: Scripts to verify booking flows and API integrations.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Integrations**: 
  - Twilio (SMS)
  - Vapi (Voice AI)
  - Onro (Delivery/Order Platform)
- **Utilities**: Axios, Dotenv, Ngrok (for local dev)

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Accounts for:
  - Twilio
  - Vapi
  - Onro
  - Ngrok (for local webhook testing)

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
   Create a `.env` file in the root directory and add your credentials:
   ```env
   # Server Config
   PORT=3000
   
   # Onro API
   ONRO_API_KEY=your_onro_api_key
   ONRO_BASE_URL=https://api.onro.com/v1
   
   # Twilio Config
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   
   # Vapi Config
   VAPI_PRIVATE_KEY=your_vapi_key
   ```

## 🏃‍♂️ Running Locally

Since this project relies on webhooks (Twilio/Vapi calling your server), you need to expose your local server to the internet using **ngrok**.

1. **Start the Server:**
   ```bash
   node index.js
   ```

2. **Start Ngrok:**
   Open a new terminal and run:
   ```bash
   ngrok http 3000
   ```

3. **Update Webhooks:**
   Copy the forwarding URL from ngrok (e.g., `https://your-url.ngrok-free.app`) and update your webhook settings:
   - **Twilio (SMS):** `[Your-Ngrok-URL]/sms/receive`
   - **Vapi (Voice):** `[Your-Ngrok-URL]/vapi/webhook`

   *Note: See `STARTUP_GUIDE.md` for detailed steps on updating webhooks.*

## 🧪 Testing

The project includes several test scripts to verify functionality:

- **Test SMS Booking Flow:**
  ```bash
  node test-booking-sms.js
  ```
- **Test Order Creation:**
  ```bash
  node test-create-order.js
  ```
- **Verify Onro Integration:**
  ```bash
  node test-integration.js
  ```

## 📂 Project Structure

- `src/`: Source code for handlers and logic.
- `index.js`: Main entry point and server setup.
- `test-*.js`: Various test scripts for different features.
- `*_GUIDE.md`: Documentation and guides for setup and testing.

## 📄 License

ISC
