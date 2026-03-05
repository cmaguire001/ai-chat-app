# 🤖 AI Chat App — Next.js + Hugging Face

A fully working AI chat web app with three themes including an animated Underwater Mario-style mode.

## ✨ Features

- 💬 Real-time AI chat via Hugging Face Inference API (free tier)
- 🎨 Three themes: Light, Dark, Underwater (with floating bubbles + wave animation)
- 💾 Theme preference saved to localStorage
- 📱 Fully responsive
- 🚀 Works on Replit and Vercel free tier

## 🚀 Quick Start (Replit)

1. **Import this project** into Replit (New Repl → Import from GitHub or upload files)
2. In the Replit **Secrets** panel (🔒 icon), add:
   ```
   Key:   HUGGINGFACE_API_KEY
   Value: hf_your_actual_key_here
   ```
3. Get your free key at → https://huggingface.co/settings/tokens
4. Click **Run** — Replit auto-installs dependencies
5. Click **Deploy** for a public URL

## 🚀 Quick Start (Vercel)

1. Push to GitHub
2. Import to vercel.com
3. Add `HUGGINGFACE_API_KEY` in Environment Variables
4. Deploy!

## 🚀 Local Development

```bash
npm install
cp .env.local.example .env.local
# Edit .env.local and add your HF key
npm run dev
# → http://localhost:3000
```

## 🎨 Themes

| Theme | Description |
|-------|-------------|
| ☀️ Light | Clean, warm off-white |
| 🌙 Dark | Charcoal with amber accents |
| 🌊 Underwater | Blue gradient + floating bubbles + wave motion |

## 📁 Project Structure

```
├── pages/
│   ├── index.js         # Main chat UI page
│   └── api/
│       └── chat.js      # Serverless HF API handler
├── components/
│   ├── ChatBox.js       # Chat bubble renderer
│   ├── ThemeSelector.js # Theme toggle buttons
│   └── Bubbles.js       # Underwater bubble particles
├── styles/
│   └── globals.css      # Tailwind + animations
├── tailwind.config.js
└── next.config.js
```

## 🔑 API Notes

- Uses `mistralai/Mistral-7B-Instruct-v0.2` by default
- Model may take 20–30s to warm up on HF free tier (cold start)
- Without an API key, the app runs in **demo mode** with friendly placeholder responses
- You can swap the model in `pages/api/chat.js` for any other HF Inference API model

Technical Skills Demonstrated

Debugged and resolved a multi-layer environment variable conflict across dev and production environments in a Next.js / Cloud Run deployment
Identified and removed hardcoded API credentials from git history, eliminating a critical security vulnerability
Architected a 3-layer environment variable redundancy system using .replit, .env.production.local, and deployment run commands
Built custom diagnostic API endpoints to inspect runtime environment state in production
Diagnosed and resolved Replit Cloud Run container caching issues through forced clean redeployment
Managed HuggingFace API token rotation and access scope configuration
Implemented structured server-side logging to enable real-time production debugging via curl
Identified .gitignore misconfiguration that was silently excluding environment files from production builds
Demonstrated systematic root cause analysis methodology across 6+ potential failure points before isolating the true issue
