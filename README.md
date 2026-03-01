

# 🤖 AI Chat App — Next.js + Hugging Face

A fully working AI chat web app built with Next.js, Tailwind CSS, and the Hugging Face Inference API. Features three beautiful themes including an animated Underwater mode.
---

## ✨ Features

- 💬 Real AI responses via Hugging Face Inference API (free tier)
- 🎨 Three themes: Light ☀️, Dark 🌙, Underwater 🌊
- 🫧 Animated floating bubbles + wave motion in Underwater theme
- 💾 Theme preference saved to localStorage
- 📱 Fully responsive — works on mobile and desktop
- ⚡ Serverless API route — no dedicated backend needed
- 🚀 Deploy-ready for Replit and Vercel free tier

---

## 🚀 Quick Start

### Option 1 — Replit (easiest)

1. Import this repo into [replit.com](https://replit.com) → **Create Repl → Import from GitHub**
2. In the **Deployments** environment variables, add:
   ```
   HUGGINGFACE_API_KEY=hf_your_token_here
   ```
3. Get your free token at → [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) (Read access)
4. Click **Run** → then **Deploy** for a public URL

### Option 2 — Vercel

1. Fork this repo
2. Import to [vercel.com](https://vercel.com)
3. Add `HUGGINGFACE_API_KEY` in Environment Variables
4. Deploy → get your public URL instantly

### Option 3 — Local Development

```bash
git clone https://github.com/yourusername/ai-chat-app.git
cd ai-chat-app
npm install
cp .env.local.example .env.local
# Add your HF key to .env.local
npm run dev
# → http://localhost:3000
```

---

## 🔑 Getting a Hugging Face API Key

1. Go to [huggingface.co](https://huggingface.co) and create a free account
2. Navigate to **Settings → Access Tokens**
3. Click **New Token** → select **Read** access
4. Copy the token (starts with `hf_...`)
5. Add it as `HUGGINGFACE_API_KEY` in your environment

> **Note:** The free tier may have a cold start delay of 20–30 seconds on first use.

---

## 📁 Project Structure

```
├── pages/
│   ├── index.js          # Main chat UI
│   ├── _app.js           # Next.js app wrapper
│   └── api/
│       └── chat.js       # Serverless Hugging Face API handler
├── components/
│   ├── ChatBox.js        # Chat bubble renderer + typing indicator
│   ├── ThemeSelector.js  # Theme toggle buttons
│   └── Bubbles.js        # Underwater floating bubble animation
├── styles/
│   └── globals.css       # Tailwind + CSS animations + theme variables
├── tailwind.config.js
├── next.config.js
└── .env.local.example
```

---

## 🎨 Themes

| Theme | Description |
|-------|-------------|
| ☀️ Light | Warm off-white with orange accents |
| 🌙 Dark | Deep charcoal with amber highlights |
| 🌊 Underwater | Deep blue gradient, floating bubbles, wave animation, glassmorphism |

---

## 🤖 AI Model

Uses **Meta Llama 3.1 8B Instruct** via the Hugging Face Router API:
```
meta-llama/Llama-3.1-8B-Instruct:cerebras
```

To swap models, edit the `model` field in `pages/api/chat.js`.

---

## 🛠 Tech Stack

- **Framework:** Next.js 13 (Pages Router)
- **UI:** React 18 + Tailwind CSS 3
- **AI:** Hugging Face Inference API (free tier)
- **Animations:** Pure CSS keyframes
- **Deployment:** Replit / Vercel

---

## 📄 License

MIT — free to use, modify, and deploy.
