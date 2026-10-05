# Humayro_3.1 — AI News Intelligence

**Humayro_3.1** is an AI-powered global news intelligence platform designed with a **$0/month free-first architecture**. It combines multi-source verified news aggregation, real-time Google Search-grounded AI synthesis, an interactive 3D telemetry globe, continent hotspot intelligence, and multilingual voice search.

---

## Features

- **Real-Time AI News Synthesis**: Asks natural language questions about world events, returning objective summaries, structured event timelines, and cited verification sources.
- **Multi-Source News Ingestion**: Aggregates verified RSS feeds from global news agencies (Reuters, BBC, Associated Press, NPR, Al Jazeera, MIT Tech Review) with intelligent deduplication and caching.
- **3D Telemetry Earth Globe**: Interactive canvas-rendered wireframe Earth sphere with latitude/longitude lines, pulsing communication nodes, and mouse parallax tilt.
- **Live Regional Hotspot Map**: Interactive SVG world map covering North America, Europe, Asia, Australia & Oceania, and Africa. Clicking any continent launches deep regional intelligence.
- **Multilingual Support (4 Languages)**: Fully localized in **Uzbek** (Default), **English**, **Russian**, and **Korean**. AI responses and Speech Recognition dynamically adapt to the selected language.
- **Web Speech Voice Search**: Natural voice inquiry support directly in the browser with visual listening pulse.
- **Local-First Accounts & Bookmarking**: Sign up, log in, manage saved articles, view search history, and track daily quota with zero mandatory cloud configuration.
- **Optional Supabase Cloud Sync**: Pre-configured integration for Supabase free-tier database and authentication.
- **Protected Observability Console**: Built-in admin desk (`/api/admin/metrics`) monitoring search counts, AI usage, cache health, and provider latency.
- **Dark & Light Mode**: Seamless theme switching with localStorage persistence and OS system detection.

---

## Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Humayro_3.1 Frontend                 │
│  (React 19 + TypeScript + Vite + Tailwind CSS + Canvas)│
└───────────────────────────┬────────────────────────────┘
                            │ /api/news/*, /api/ai/*
┌───────────────────────────▼────────────────────────────┐
│                  Express Node.js Server                │
│                 (server.ts on Port 3000)               │
├───────────────────────────┬────────────────────────────┤
│     News Ingestion Layer  │      AI Adapter Layer      │
│   (server/newsService.ts) │   (server/aiService.ts)    │
└─────────────┬─────────────┴──────────────┬─────────────┘
              │                            │
   ┌──────────▼──────────┐      ┌──────────▼──────────┐
   │ Verified Global RSS │      │  Google Gemini 2.5  │
   │  Reuters, BBC, AP   │      │  (Search Grounding) │
   │   GDELT Fallback    │      │  Groq / OpenRouter  │
   └─────────────────────┘      └─────────────────────┘
```

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, HTML5 2D Canvas
- **Backend**: Express 4, Node.js (`tsx`), Fast XML Parser
- **AI Engine**: `@google/genai` (Gemini 2.5 Flash with real-time Google Search grounding) + Groq/OpenRouter fallback adapter
- **Build Tool**: Vite 8

---

## Free Services Used

All services are selected under generous $0/month free-tier policies:

1. **Google Gemini API Free Tier**:
   - Primary model: `gemini-2.5-flash` with Google Search grounding.
   - Cost: Free tier available for developers (up to 15 RPM / 1,500 RPD).
2. **Global Public RSS Feeds**:
   - Cost: $0 (unlimited public consumption with respect to robots.txt and reasonable cache intervals).
3. **GDELT Project v2 API**:
   - Cost: $0 (public data project supported by Google Jigsaw).
4. **Supabase Free Tier (Optional)**:
   - Cost: $0 (up to 50,000 monthly active users and 500MB database).

> *Note: Free-tier availability and limits may change over time according to third-party provider terms.*

---

## Environment Variables

Copy `.env.example` to `.env` or configure them in your hosting provider:

```bash
# Gemini API Key (injected automatically in AI Studio)
GEMINI_API_KEY="your-gemini-key"

# AI Provider Strategy ('gemini' | 'groq' | 'openrouter')
AI_PROVIDER="gemini"
# GROQ_API_KEY=""
# OPENROUTER_API_KEY=""
# FALLBACK_AI_PROVIDER="groq"

# Protected Admin Console Passkey
ADMIN_SECRET="admin2026"

# Optional Cloud Database (Supabase Free Tier)
# VITE_SUPABASE_URL=""
# VITE_SUPABASE_ANON_KEY=""

PORT=3000
```

---

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run full-stack development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Run production build**:
   ```bash
   npm run build
   npm run start
   ```

---

## AI Provider Setup

1. **Google Gemini (Recommended)**:
   - Obtain a free API key at [Google AI Studio](https://aistudio.google.com/).
   - Set `GEMINI_API_KEY="your_key"`.
2. **Groq (Optional Fallback)**:
   - Obtain a free API key at [console.groq.com](https://console.groq.com/).
   - Set `GROQ_API_KEY="your_key"` and `FALLBACK_AI_PROVIDER="groq"`.

---

## Deployment

### Cloudflare Pages / Workers
Build command: `npm run build`
Output directory: `dist`

### Netlify / Vercel
Build command: `npm run build`
Publish directory: `dist`

---

## Security & Privacy

- **No Secrets in Frontend**: All AI calls and API keys execute exclusively on the backend (`server.ts` / `/api/*`).
- **Input Sanitization**: All incoming HTML from RSS XML feeds is stripped of script tags, unsafe entities, and markup before caching.
- **Local-First Privacy**: Anonymous readers can bookmark articles and search without account creation or cloud tracking.

---

## Rate Limits

- **Anonymous Guest**: 50 free searches / day (tracked in browser storage).
- **Registered Free Account**: 200 free searches / day.
- **Graceful Error Handling**: If upstream AI limits are reached, the system falls back to summarizing matched local RSS wire feeds.

---

## Known Limitations

- Real-time speech recognition requires browser Web Speech API support (Google Chrome, Edge, Safari).
- Free tier AI models may occasionally have momentary latency during peak global traffic.
