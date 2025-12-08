# How to Check Orders in Onro Dashboard

## 📍 Onro Dashboard Access:

**URL:** https://manage.swiftymessenger.com (or your Onro dashboard URL)

---

## 🔍 Step-by-Step: How to Find Your Order

### Method 1: Recent Orders (Easiest)

1. **Login to Onro Dashboard**
   - Go to your Onro dashboard URL
   - Enter your credentials

2. **Go to "Orders" or "Deliveries"**
   - Look for "Orders", "Deliveries", or "Bookings" in the left sidebar
   - Click on it

3. **Check Recent Orders**
   - You should see a list of recent orders
   - Look for orders with these addresses:
     - Pickup: `3 Austra Parkway, Unit 103, Monroe, NY 10950`
     - Delivery: `7 Van Buren Drive, Unit 304, Monroe, NY 10950`

4. **Check Order Details**
   - Click on the order to see details
   - Verify:
     - ✅ Pickup address correct
     - ✅ Delivery address correct
     - ✅ Vehicle Type: Car
     - ✅ Status: (Pending/Assigned/etc.)

---

### Method 2: Search by Phone Number

1. **Go to Orders Section**

2. **Find Search Box**
   - Look for a search field at the top

3. **Search by Phone**
   - Enter: `01317365623`
   - Press Enter

4. **View Results**
   - All orders with this phone number will appear

---

### Method 3: Filter by Date

1. **Go to Orders Section**

2. **Find Date Filter**
   - Look for "Today", "This Week", or date range selector

3. **Select "Today"**
   - This will show only today's orders

4. **Look for Your Test Orders**
   - Check the list for Monroe addresses

---

## 📋 What to Look For:

When you find an order, verify these details:

### ✅ Order Information:
- **Pickup Address:** 3 Austra Parkway, Unit 103, Monroe, NY 10950
- **Delivery Address:** 7 Van Buren Drive, Unit 304, Monroe, NY 10950
- **Customer Phone:** 01317365623
- **Vehicle Type:** Car (or Car ID: 0CRbnzYnv4_rQA53K7O5z)
- **Status:** Pending/Assigned/In Progress

### ✅ Additional Details:
- **Driver Notes:** Ring doorbell (if visible)
- **Payment Method:** (might not be visible due to API limitation)
- **Created Date:** Today's date
- **Created Time:** Recent (within last few minutes)

---

## 🎯 Expected Results:

### If Voice Call Was Successful:
You should see:
1. **New order** in the list
2. **Correct addresses** (Austra Parkway → Van Buren Drive)
3. **Today's date**
4. **Status:** Pending or Assigned

### If You Don't See the Order:
Possible reasons:
1. **Order still processing** (wait 1-2 minutes)
2. **Async processing delay** (background job running)
3. **API error** (check server logs)
4. **Geocoding issue** (address outside service area)

---

## 🔧 Troubleshooting:

### If Order Not Visible:

1. **Refresh the page**
   - Press F5 or click refresh button

2. **Wait 1-2 minutes**
   - Async processing takes time

3. **Check "All Orders" tab**
   - Don't filter by status

4. **Search by phone number**
   - Use: `01317365623`

5. **Check server logs**
   - Look for "Order created" message
   - Check for any errors

---

## 📱 Alternative: Check via API

If you can't find it in dashboard, check via our script:

```bash
cd /Users/masumabedin/Desktop/silks_plus_sms_ivr
node verify-latest-order.js
```

This will show the latest orders from Onro API.

---

## 🎯 Quick Checklist:

After Voice Call:
- [ ] Login to Onro Dashboard
- [ ] Go to Orders section
- [ ] Filter by "Today"
- [ ] Look for Monroe addresses
- [ ] Click on order to see details
- [ ] Verify all information correct
- [ ] Check order status

---

## 📞 Next Steps:

1. **Make Voice Call** (if not done yet)
2. **Wait for AI to say order reference**
3. **Wait 1-2 minutes**
4. **Check Onro Dashboard**
5. **Verify order details**

---

**Note:** Due to async processing, orders may take 1-2 minutes to appear in the dashboard after the voice call ends.
