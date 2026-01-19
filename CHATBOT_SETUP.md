# AI Chatbot Setup Guide

Your F1 Intelligence Hub now has **real AI** powered by Groq! 🚀

## What You Get (100% FREE)
- Real AI responses using Groq's Llama 3.3 model
- Fast response times
- No credit card required
- Generous free tier (14,400 requests per day)

## Setup Instructions

### Step 1: Get Your Free Groq API Key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account (no credit card needed)
3. Navigate to "API Keys" section
4. Click "Create API Key"
5. Copy your API key

### Step 2: Add API Key to Your Project

1. In your project folder, create a file named `.env.local`
2. Add this line:
   ```
   GROQ_API_KEY=gsk_your_actual_api_key_here
   ```
3. Replace `gsk_your_actual_api_key_here` with your actual Groq API key

**Important:** Never commit your `.env.local` file to git. It's already in `.gitignore`.

### Step 3: Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart it:
PORT=3001 pnpm dev
```

### Step 4: Test It Out!

Go to http://localhost:3001 and try asking questions like:
- "What's Verstappen's lap time performance?"
- "How are the tyre strategies comparing?"
- "Analyze the gap evolution between VER and HAM"
- "Who has the fastest pit stops?"

## How It Works

The AI chatbot:
- Analyzes your F1 race data
- Provides insights and analysis
- References specific charts when relevant
- Maintains conversation context

## Troubleshooting

**"GROQ_API_KEY not configured" error:**
- Make sure you created `.env.local` file (not `.env.local.example`)
- Check that your API key is correct
- Restart the dev server after adding the key

**Slow responses:**
- Groq is usually very fast, but may be slower during peak times
- Check your internet connection

**Rate limits:**
- Free tier: 14,400 requests per day
- If you hit the limit, wait 24 hours or upgrade to paid plan

## Need Help?

- Groq Documentation: https://console.groq.com/docs
- Groq Discord: https://discord.gg/groq

## Cost Information

**Groq Free Tier:**
- 14,400 requests per day
- No credit card required
- Perfect for development and personal projects

**Paid Plans (if you need more):**
- Pay-as-you-go pricing
- Very affordable (~$0.10 per 1M tokens)

Enjoy your AI-powered F1 Intelligence Hub! 🏎️💨
