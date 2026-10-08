# Humayro 3.3 — AI-Powered Global Intelligence Platform

<p align="center">
  <img src="https://img.shields.io/badge/version-3.3.0-orange.svg" alt="Version 3.3.0" />
  <img src="https://img.shields.io/badge/react-19.0-blue.svg" alt="React 19" />
  <img src="https://img.shields.io/badge/vite-8.3-purple.svg" alt="Vite 8" />
  <img src="https://img.shields.io/badge/tailwindcss-v4-38bdf8.svg" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/AI-Google_Gemini_2.5_Flash-green.svg" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/license-MIT-lightgrey.svg" alt="License MIT" />
</p>

**Humayro 3.3** is a next-generation, high-performance **AI-Powered Global Intelligence & News Monitoring Platform**. It bridges the gap between breaking world headlines, deep AI causal synthesis, 2D military-grade tactical geo-radar telemetry, 3D holographic CyberGlobe exploration, and real-time per-region environmental and geopolitical metrics.

---

## 🌟 Key Features

### 1. 🌐 Tactical 2D Geo-Radar & 3D Hologram CyberGlobe
- **High-Definition 2D Tactical Radar Map**: Built with WGS84 equirectangular coordinate projection, latitude/longitude parallels (60°N, 30°N, Equator 0°, 30°S, 60°S), tactical HUD overlays, radar sweep indicators, and glowing continental corridors.
- **3D CyberGlobe Hologram**: Canvas-based 3D globe with interactive coordinate points, rotation controls, and region focusing.
- **8 Intelligence Sectors**:
  - `[UZ/CA]` Uzbekistan & Central Asia (Heartland focus)
  - `[KR/EA]` East Asia & Pacific Rim (Semiconductor & AI chip corridors)
  - `[EU/BRU]` European Union (AI Act & Energy Security)
  - `[US/NA]` North America (Silicon Valley AI & Markets)
  - `[ME/GULF]` Middle East & Gulf (Vision 2030 & Strategic Transit)
  - `[AFR]` African Continent (Tech startups & Critical minerals)
  - `[SA/BRA]` South America (Agrotech & Bio-economy)
  - `[OC/SYD]` Australia & Oceania (Green hydrogen & Space telemetry)

### 2. ⚡ Regional Intelligence Workspace (Mintaqaviy Tahliliy Markaz)
- **Geopolitical Dossier**: Executive summary, historical context, and current strategic posture.
- **Real-Time Weather & Telemetry (Open-Meteo)**: Live temperature, humidity, wind, and sky condition for regional capital hubs (Tashkent, Samarkand, Seoul, Brussels, Washington, Dubai, Nairobi, etc.).
- **Top Active Developments**: Real-time breaking developments with citations and direct AI deep-dive actions.
- **Public Debates & Dilemmas**: Deep breakdown of public discourse, root causes, impact levels, and societal reactions.
- **Key Indicators Matrix**: GDP growth, AI R&D investments, renewable energy transitions, and automation indices with trend badges.
- **Curated YouTube Video Reports**: Integrated YouTube video briefs with embedded playback and channel attribution.
- **One-Click AI Prompts**: Curated query chips to instantly launch deep neural synthesis.

### 3. 🧠 Multimodal AI Synthesis Engine
- **Search-Grounded Intelligence**: Powered by Google Gemini 2.5 Flash with live Google Search grounding.
- **Multi-Provider Fallback**: Architecture supports automatic failover between Gemini, Groq (Llama 3.3), and OpenRouter.
- **Structured Intelligence Briefs**:
  - Top Viral Headline & Trend Index
  - Executive Strategic Summary
  - Public Sentiment & Discourse Analysis
  - Key Drivers & Systemic Catalysts
  - Chronological Event Timeline
  - Historical Parallel Matrix & Wisdom Lessons
  - Verified Sources Citation List
  - Built-in Neural Audio Reader (TTS speech synthesis)

### 4. 🌍 Universal 12-Language Localization
- Fully localized in **12 languages**:
  - 🇺🇿 **O'zbekcha** (Default)
  - 🇰🇿 **Қазақша**
  - 🇰🇬 **Кыргызча**
  - 🇹🇯 **Тоҷикӣ**
  - 🇹🇲 **Türkmençe**
  - 🇦🇿 **Azərbaycanca**
  - 🇹🇷 **Türkçe**
  - 🇸🇦 **العربية**
  - 🇮🇷 **فارسی**
  - 🇷🇺 **Русский**
  - 🇬🇧 **English**
  - 🇰🇷 **한국어**
- Complete UI, labels, prompts, metrics, indicators, and voice recognition dynamically synchronize to the selected language.

### 5. 📡 Continuous Live Signal Stream
- Auto-refreshes verified global RSS & Google News feeds every 30 seconds.
- Live Signal Marquee with real-time signal score indicator.
- Category filters: All, Uzbekistan, World, Technology, Economy, Science.
- Magazine, Live Stream, and Terminal display modes.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   Humayro 3.3 Frontend                   │
│   (React 19 + TypeScript + Vite 8 + Tailwind CSS v4)    │
│   - IntelligenceHero & AI Search                        │
│   - Tactical 2D Geo-Radar & 3D Hologram CyberGlobe       │
│   - Regional Intelligence Workspace                     │
│   - IntelligenceFeed & Right-Side Reader Drawer          │
│   - AI Intelligence Brief (Synthesis & Voice)            │
└────────────────────────────┬─────────────────────────────┘
                             │ /api/*
┌────────────────────────────▼─────────────────────────────┐
│                 Full-Stack Express / Netlify             │
│                 (server.ts / netlify/functions)          │
├────────────────────────────┬─────────────────────────────┤
│     News & Region Service  │      AI Service Adapter     │
│  - RSS / Google News Ingest│  - Gemini 2.5 Flash Search  │
│  - Open-Meteo Weather API  │  - Groq / OpenRouter Backup │
│  - 30-second TTL Cache     │  - Historical Parallel Map  │
└────────────────────────────┴─────────────────────────────┘
```

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/shoxruxmamurbekov/Humayro_3.3.git
cd Humayro_3.3
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env`:
```env
# Google Gemini API Key (Required for AI synthesis)
GEMINI_API_KEY="your-gemini-api-key"

# AI Provider ('gemini' | 'groq' | 'openrouter')
AI_PROVIDER="gemini"

# Admin Dashboard Secret Token (for /api/admin/metrics) - REQUIRED
ADMIN_SECRET="your-strong-random-admin-secret-token"

PORT="3000"
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production
```bash
npm run build
npm start
```

---

## 📦 Deployment Options

### Netlify (One-Click Serverless)
The project includes pre-configured `netlify.toml` and `netlify/functions/api.ts`:
1. Push code to GitHub.
2. Link your repository in Netlify.
3. Add `GEMINI_API_KEY` in Netlify Environment Variables.
4. Deploy! All API requests (`/api/*`) are automatically routed to the serverless function.

### Docker / Cloud Run / VPS
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🛠️ GitHub Push Guide

To upload this project to your GitHub repository:

```bash
# 1. Initialize git (if not already done)
git init

# 2. Add all files
git add .

# 3. Create your release commit
git commit -m "feat: release Humayro 3.3 with 2D geo-radar, regional workspace, and full i18n"

# 4. Set the main branch
git branch -M main

# 5. Connect your remote repository
git remote add origin https://github.com/shoxruxmamurbekov/Humayro_3.3.git
# (Or if updating Humayro_3.2: git remote add origin https://github.com/shoxruxmamurbekov/Humayro_3.2.git)

# 6. Push to GitHub
git push -u origin main --force
```

---

## 📄 License
MIT License © 2026 Humayro Global Intelligence. All rights reserved.
