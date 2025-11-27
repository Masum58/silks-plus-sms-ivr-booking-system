# How to Test Phase 1 with Postman

Follow these steps to verify that the Phase 1 (Middleware + Twilio + Onro Setup) is working correctly.

## Prerequisites
1.  **Server Must be Running**: Ensure your terminal shows `Server is running on port 3000`.
2.  **Postman Installed**: Make sure you have the Postman app installed.

## Step 1: Import the Collection
1.  Open **Postman**.
2.  Click the **Import** button (usually at the top left).
3.  Select **File** > **Upload Files**.
4.  Browse to your project folder: `/Users/masumabedin/Desktop/silks_plus_sms_ivr/`.
5.  Select the file `postman_collection.json`.
6.  Click **Import**.
7.  You will see a new collection on the left side named **SMS + IVR Booking Add-On**.

## Step 2: Test Server Health
*This confirms the middleware is running.*

1.  Click on **SMS + IVR Booking Add-On** > **Health Check**.
2.  Click the big blue **Send** button.
3.  **Expected Result**:
    *   Status: `200 OK`
    *   Body:
        ```json
        {
            "status": "ok",
            "timestamp": "..."
        }
        ```

## Step 3: Test Onro Configuration
*This confirms the system can read your Onro API credentials.*

1.  Click on **Test Onro Config**.
2.  Click **Send**.
3.  **Expected Result**:
    *   Status: `200 OK`
    *   Body:
        ```json
        {
            "success": true,
            "message": "Onro authentication simulated",
            "result": true
        }
        ```

## Step 4: Test Twilio SMS
*This sends a real SMS to your phone to prove Twilio is connected.*

1.  Click on **Test SMS**.
2.  Click on the **Body** tab (below the URL bar).
3.  You will see JSON like this:
    ```json
    {
        "to": "YOUR_PHONE_NUMBER",
        "body": "Hello from Postman!"
    }
    ```
4.  **IMPORTANT**: Replace `"YOUR_PHONE_NUMBER"` with your actual mobile number (e.g., `"+15550001234"`). Keep the quotes!
5.  Click **Send**.
6.  **Expected Result**:
    *   Status: `200 OK`
    *   Body:
        ```json
        {
            "success": true,
            "sid": "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }
        ```
    *   **Check your phone**: You should receive the text message!

---
**If all these pass, Phase 1 is successfully completed!**
