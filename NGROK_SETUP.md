# ngrok Setup Guide - Step by Step

## 🚀 ngrok Install করা হয়েছে ✅

কিন্তু ngrok use করার জন্য একটা **FREE account** এবং **authtoken** লাগবে।

## 📝 Step-by-Step Setup (5 minutes)

### Step 1: ngrok Account তৈরি করুন (FREE)

1. **যান:** https://dashboard.ngrok.com/signup
2. **Sign up করুন:**
   - Google account দিয়ে (সবচেয়ে সহজ)
   - অথবা Email দিয়ে
3. ✅ Account তৈরি হয়ে গেছে!

### Step 2: Authtoken Copy করুন

1. Sign up করার পর automatically **"Your Authtoken"** page এ যাবেন
2. অথবা যান: https://dashboard.ngrok.com/get-started/your-authtoken
3. **Authtoken copy করুন** (এরকম দেখতে: `2abc...xyz`)

### Step 3: Authtoken Configure করুন

Terminal এ এই command run করুন (আপনার authtoken দিয়ে):

```bash
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

**Example:**
```bash
ngrok config add-authtoken 2abc123def456ghi789jkl
```

### Step 4: ngrok চালান

```bash
ngrok http 3000
```

✅ এখন কাজ করবে!

---

## 🎯 Quick Steps (Copy-Paste করুন)

```bash
# Step 1: Browser এ যান
open https://dashboard.ngrok.com/signup

# Step 2: Sign up করুন (Google account recommended)

# Step 3: Authtoken copy করুন এবং configure করুন
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE

# Step 4: ngrok চালান
ngrok http 3000
```

---

## 📋 আপনি যা দেখবেন

ngrok চালানোর পর এরকম দেখবেন:

```
ngrok                                                                           

Session Status                online
Account                       your-email@gmail.com
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123-xyz.ngrok-free.app -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**এই URL copy করবেন:** `https://abc123-xyz.ngrok-free.app`

---

## 🔧 Twilio Webhook Setup (পরের step)

ngrok URL পাওয়ার পর:

1. যান: https://console.twilio.com/us1/develop/phone-numbers/manage/incoming
2. Click: `(812) 666-8455`
3. Messaging section এ:
   - **A MESSAGE COMES IN:** Webhook
   - **URL:** `https://YOUR_NGROK_URL.ngrok-free.app/sms/receive`
   - **HTTP:** POST
4. Save

---

## 💡 Important Notes

- ngrok account **সম্পূর্ণ FREE**
- Credit card লাগে না
- Free plan এ 1 tunnel at a time
- URL প্রতিবার change হয় (restart করলে)

---

## 🚀 Ready?

1. ✅ Browser এ যান: https://dashboard.ngrok.com/signup
2. ✅ Sign up করুন
3. ✅ Authtoken copy করুন
4. ✅ Terminal এ configure করুন
5. ✅ `ngrok http 3000` চালান

**তারপর আমাকে বলুন ngrok URL টা!** 😊
