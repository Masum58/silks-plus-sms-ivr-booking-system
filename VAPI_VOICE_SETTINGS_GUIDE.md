# Vapi Voice Settings Guide

## 🎤 Fixing Pronunciation Issues

### Problem:
AI misunderstands addresses like:
- "Austra" → "Aster"
- "Van Buren" → "Benborn/Penburn/Member Inn"

### Solution: Configure Vapi Voice Settings

---

## Step 1: Access Voice Settings

1. Go to **Vapi Dashboard** (https://dashboard.vapi.ai)
2. Select your **Assistant**
3. Navigate to **Voice** or **Model** settings

---

## Step 2: Configure Speech Recognition

### Option A: Use Deepgram (Recommended)

1. In **Voice Settings**, find **Transcriber** or **Speech-to-Text Provider**
2. Select **Deepgram** (if available)
3. Enable **Smart Formatting**
4. Add **Custom Vocabulary**:

```json
{
  "keywords": [
    "Austra:5",
    "Van Buren:5",
    "Monroe:5",
    "Parkway:3",
    "Drive:3"
  ]
}
```

The number (1-5) indicates priority/boost level.

### Option B: Adjust Model Settings

1. Find **Model** or **LLM Settings**
2. Set **Temperature** to `0.3` (lower = more accurate)
3. Enable **Spelling Mode** or **Address Mode** (if available)

---

## Step 3: Update System Prompt

Make sure your System Prompt includes:

```
**Address Accuracy:** 
- If customer spells out any part (e.g., "A-U-S-T-R-A"), write it EXACTLY as spelled.
- Always confirm the address by reading it back.
- If customer corrects you, use their correction EXACTLY.
- Common addresses: "Austra Parkway" (not Aster), "Van Buren Drive" (not Benborn).
```

---

## Step 4: Test Again

1. Call your Vapi number
2. Spell out the address: "A-U-S-T-R-A Parkway"
3. Check if AI writes "Austra" correctly

---

## Alternative: Use SMS for Addresses

If pronunciation issues persist, you can:

1. Ask customer to **text the address** to your Twilio number
2. AI confirms via voice: "I've received your address via text"
3. This ensures 100% accuracy

---

## Vapi Dashboard Locations

**Voice Settings:**
- Dashboard → Assistants → [Your Assistant] → Voice
- Look for: Transcriber, Speech Provider, Custom Vocabulary

**Model Settings:**
- Dashboard → Assistants → [Your Assistant] → Model
- Look for: Temperature, Instructions, Advanced Settings

---

**Note:** If you can't find these settings, contact Vapi support or check their documentation for your specific plan tier.
