# Local Testing Commands 🚀

Here are the commands to test the system locally without making real calls.

## Step 1: Start the Server
Open **Terminal 1** and run:
```bash
npm start
```
*(Keep this terminal open. You will see the logs here.)*

---

## Step 2: Simulate a Voice Call
Open **Terminal 2** and run:
```bash
node scripts/simulate-voice-call.js
```
*(This sends a fake call to your server using your real phone number.)*

---

## Step 3: Check Results
Look at **Terminal 1**. You should see:
- `🚀 Processing Voice Booking...`
- `💰 Delivery Price: ...`
- `✅ Order created...`
