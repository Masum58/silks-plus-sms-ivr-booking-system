# 🤝 Backend Team Handover Guide

Welcome to the **SMS + IVR Booking System** project! This document outlines the current status, architecture, and the immediate next steps required to complete the project.

---

## 🚀 Project Overview
This is a middleware application that enables customers to book courier services via **Voice Calls (Vapi AI)** and **SMS (Twilio)**. It integrates with the **Onro** platform for order management.

### 🌐 Live API Endpoints (Production)

| Service | Method | Endpoint URL | Description |
| :--- | :--- | :--- | :--- |
| **Vapi (Voice)** | `POST` | `https://swifly-booking.onrender.com/vapi/webhook` | Handles voice calls & booking logic |
| **Twilio (SMS)** | `POST` | `https://swifly-booking.onrender.com/sms/receive` | Handles incoming SMS & replies |

### ✅ What is Working (Production Ready)
1.  **Voice Booking:** Customers can call, give details (pickup/dropoff), and the AI books the order.
2.  **SMS Booking:** Customers can text "Book from A to B" and get an order confirmation.
3.  **Onro Integration:** Orders are automatically created in the Onro Dashboard.
4.  **Address Validation:** Google Maps Geocoding is integrated and optimized for Monroe, NY.
5.  **Vehicle Selection:** Dynamic selection between "Car" and "Car Eataly".

### 🚧 What is Missing (Your Core Tasks)
The client requires **Secure Payments (Stripe)** and **Customer Account Auto-creation**. The current system uses in-memory storage, which is not suitable for these features.

---

## 🛠️ Your Mission: Architecture Migration

We have designed a migration plan to move from "In-Memory" to "PostgreSQL + Stripe".

### 1. Database Setup (Priority #1)
- **Goal:** Replace in-memory `Map` with **PostgreSQL**.
- **Stack:** Node.js + **Prisma ORM** + PostgreSQL.
- **Tasks:**
    - Set up PostgreSQL (on Render or elsewhere).
    - Install Prisma: `npm install prisma @prisma/client`.
    - Create `Customer` and `Order` tables.
    - Update `src/services/orderReferenceService.js` to save/read from DB.

### 2. Stripe Payment Integration (Priority #2)
- **Goal:** Collect payments before confirming Onro orders.
- **Flow:**
    1.  User books via Voice/SMS.
    2.  System saves order to DB as `PENDING_PAYMENT`.
    3.  System sends **Stripe Payment Link** via SMS.
    4.  **Stripe Webhook** detects payment success.
    5.  System creates order in **Onro** and sends final confirmation.

---

## 🔑 Required Credentials (Environment Variables)

You will need to create a `.env` file with the following keys. Ask the client/previous dev for these values:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Onro API (Courier Platform)
ONRO_API_URL=https://api.onro.com/v1
ONRO_API_KEY=x-api-key-here
ONRO_COMPANY_ID=company-id-here
ONRO_CUSTOMER_ID=master-customer-id-here (Used for guest bookings)

# Vapi AI (Voice)
VAPI_PRIVATE_KEY=vapi-private-key-here

# Twilio (SMS)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...

# Google Maps (Geocoding)
GOOGLE_MAPS_API_KEY=AIza...

# [NEW] Database & Payment (You need to add these)
DATABASE_URL="postgresql://user:password@host:port/dbname"
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 📂 Codebase Structure

- `index.js`: Main entry point.
- `src/`: Core application code.
    - `routes/`: API routes (Vapi, SMS).
    - `services/`: Business logic.
- `docs/`: Project documentation and guides.
    - `ENV_VARIABLES_CHECKLIST.txt`: Checklist for environment variables.
- `scripts/`: Utility scripts.
    - `demonstrate-local-system.js`: Live demo script.
- `tests/`: Test scripts and verification tools.

---

## 📝 Immediate Next Steps for You

1.  **Clone the Repo** & Install dependencies (`npm install`).
2.  **Set up PostgreSQL** and connect it using Prisma.
3.  **Refactor `src/services/orderReferenceService.js`** to use the database.
4.  **Implement `src/services/paymentService.js`** for Stripe.
5.  **Run Demo:** `node scripts/demonstrate-local-system.js` to verify the system.

Good luck! The core logic for Voice and SMS is solid; you just need to add the persistence and payment layer.
