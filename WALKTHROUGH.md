# Step-by-Step Guide: Running and Testing the SMS Application

Follow these steps to run your application and test the SMS sending functionality.

## Prerequisites
- Ensure you are in the project directory: `/Users/masumabedin/Desktop/silks_plus_sms_ivr`
- Ensure Node.js is installed.

## Step 1: Start the Server
Open your terminal and run the following command to start the application:

```bash
node index.js
```

**Expected Output:**
You should see something like this:
```
Server is running on port 3000
Environment: development
```
*Keep this terminal window open. The server needs to be running to accept requests.*

## Step 2: Send a Test POST Request
Open a **new** terminal window (or tab) and use the `curl` command to send a test SMS request.

**Command:**
```bash
curl -X POST http://localhost:3000/api/test-sms \
     -H "Content-Type: application/json" \
     -d '{"to": "+15555555555", "body": "Hello from Step-by-Step Test"}'
```

**Note:** Replace `+15555555555` with a valid phone number if you want to actually send an SMS (and ensure your Twilio credentials allow it).

## Step 3: Check the Results

### In the Client (Curl) Terminal:
You will see a JSON response.
- **If successful:** `{"success":true, "sid": "..."}`
- **If failed (e.g., invalid number):** `{"success":false, "error":"..."}`

### In the Server Terminal:
Switch back to the terminal where you ran `node index.js`. You should see logs indicating the attempt. If there was an error (like an invalid number), the detailed error log will appear here.
