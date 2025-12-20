# 🚀 Render.com Deployment Guide

## Step-by-Step Instructions

### 📋 Prerequisites:
- ✅ GitHub account
- ✅ Render.com account (free)
- ✅ Your project code ready

---

## Part 1: GitHub Setup (5 minutes)

### Step 1: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `silks-booking-system`
3. Description: `SMS and Voice Booking System with Onro Integration`
4. **Public** or **Private** (your choice)
5. **DO NOT** initialize with README
6. Click **Create repository**

### Step 2: Push Code to GitHub

Open Terminal and run these commands:

```bash
cd /Users/masumabedin/Desktop/silks_plus_sms_ivr

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - SMS + Voice Booking System"

# Add GitHub remote (replace with YOUR repository URL)
git remote add origin https://github.com/YOUR_USERNAME/silks-booking-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** Replace `YOUR_USERNAME` with your actual GitHub username

---

## Part 2: Render.com Setup (10 minutes)

### Step 1: Create Render Account

1. Go to: https://render.com
2. Click **Get Started for Free**
3. Sign up with GitHub (recommended)

### Step 2: Create New Web Service

1. Click **New** → **Web Service**
2. Click **Connect GitHub**
3. Authorize Render to access your repositories
4. Find and select: `silks-booking-system`
5. Click **Connect**

### Step 3: Configure Service

**Basic Settings:**
- **Name:** `swifly-booking` (or any name you want)
- **Region:** Choose closest to you
- **Branch:** `main`
- **Root Directory:** (leave empty)
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node index.js`

**Plan:**
- Select **Free** plan

### Step 4: Add Environment Variables

Click **Advanced** → **Add Environment Variable**

Add ALL these variables from your `.env` file:

```
PORT=3000
NODE_ENV=production

ONRO_API_URL=https://api.onro.app
ONRO_CUSTOMER_ID=_eWVj1wYoPkoBOlb-e5uh
ONRO_CLIENT_ID=sFOcJCIqJqkoBOlb-e5uh
ONRO_CLIENT_SECRET=Ql3Ew7kqpkoBOlb-e5uh
ONRO_VEHICLE_TYPE_ID=0CRbnzYnv4_rQA53K7O5z

TWILIO_ACCOUNT_SID=ACcc78761badc4265a00b8d9958b978ee6
TWILIO_AUTH_TOKEN=328aa1389c4aad7c0089b2d1247d0a35
TWILIO_PHONE_NUMBER=+18126668455

VAPI_PRIVATE_KEY=a9b6e0b9-9d4c-4b3f-8e2a-1f5c6d7e8f9a
VAPI_PUBLIC_KEY=cd802dfc-5655-43cf-98ea-662014ec0835
VAPI_ASSISTANT_ID=cd802dfc-5655-43cf-98ea-662014ec0835

GOOGLE_MAPS_API_KEY=AIzaSyDt3yHAfNYgVcXhYAT22jcS9wHEdHSLi5Q
```

**Important:** Copy each value exactly from your `.env` file!

### Step 5: Deploy

1. Click **Create Web Service**
2. Wait for deployment (3-5 minutes)
3. You'll see build logs

**Successful deployment shows:**
```
==> Build successful 🎉
==> Deploying...
==> Your service is live 🎉
```

---

## Part 3: Get Your Permanent URL

After deployment, you'll get a URL like:
```
https://swifly-booking.onrender.com
```

**This URL will NEVER change!** ✅

---

## Part 4: Update Webhooks (One-time only)

### Update Twilio:

1. Go to: https://console.twilio.com/us1/develop/sms/services/MG8a2e0f8e7d4c3b2a1f0e9d8c7b6a5f4
2. Click **Integration**
3. Update **Incoming Messages** webhook:
   ```
   https://swifly-booking.onrender.com/sms/receive
   ```
4. Click **Save**

### Update Vapi:

1. Go to: https://dashboard.vapi.ai
2. Click **Phone Numbers**
3. Select your number: `+1 812 666 8455`
4. Update **Server URL**:
   ```
   https://swifly-booking.onrender.com/vapi/webhook
   ```
5. Click **Save**

---

## Part 5: Test Your Deployment

### Test 1: Check if Service is Running

Open browser and go to:
```
https://swifly-booking.onrender.com
```

You should see:
```
Silks Plus SMS/IVR Booking System
```

### Test 2: Send SMS

Send SMS to: `+1 812 666 8455`
```
Book from 3 Austra Parkway #103 Monroe NY 10950 to 7 Van Buren Drive #304 Monroe NY 10950
```

You should receive confirmation with Order ID!

### Test 3: Make Voice Call

Call: `+1 812 666 8455`

AI assistant should answer!

---

## 🎉 Success!

Your system is now:
- ✅ Running 24/7
- ✅ Permanent URL (never changes)
- ✅ No PC required
- ✅ No ngrok needed
- ✅ Production-ready

---

## 📊 Monitoring

### View Logs:

1. Go to Render dashboard
2. Click on your service
3. Click **Logs** tab
4. See real-time logs

### Check Status:

Dashboard shows:
- Service status (Running/Stopped)
- Last deployment time
- Resource usage

---

## 🔄 Future Updates

When you make code changes:

```bash
git add .
git commit -m "Your update message"
git push
```

Render will **automatically redeploy**! 🎉

---

## ⚠️ Important Notes

### Sleep Mode (Free Plan):
- Service sleeps after 15 minutes of inactivity
- Wakes up automatically when request comes (30-60 seconds)
- First request after sleep will be slow

### To Prevent Sleep:
- Upgrade to paid plan ($7/month)
- Or use free cron service to ping every 10 minutes

### Upgrade to Paid:
- Go to Render dashboard
- Click your service
- Click **Upgrade**
- Select **Starter** plan ($7/month)
- Benefits: No sleep, faster, more resources

---

## 🆘 Troubleshooting

### Build Failed?
- Check build logs in Render
- Make sure `package.json` is correct
- Verify all dependencies are listed

### Service Not Starting?
- Check environment variables
- Look at logs for errors
- Verify `node index.js` command works locally

### Webhooks Not Working?
- Verify URLs are correct
- Check if service is running
- Look at Render logs for incoming requests

---

## 📞 Support

- Render Docs: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

---

**You're all set! Your booking system is now live 24/7!** 🚀
