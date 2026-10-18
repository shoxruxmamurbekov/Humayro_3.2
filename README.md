# Violet Sun 3.2 — AI-Powered Global Intelligence Platform

<p align="center">
  <img src="https://img.shields.io/badge/version-3.2.0-orange.svg" alt="Version 3.2.0" />
  <img src="https://img.shields.io/badge/react-19.0-blue.svg" alt="React 19" />
  <img src="https://img.shields.io/badge/vite-8.3-purple.svg" alt="Vite 8" />
  <img src="https://img.shields.io/badge/tailwindcss-v4-38bdf8.svg" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/AI-Google_Gemini_2.5_Flash-green.svg" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/license-MIT-lightgrey.svg" alt="License MIT" />
</p>

**Violet Sun 3.2** is a next-generation, high-performance **AI-Powered Global Intelligence & News Monitoring Platform**. It bridges the gap between breaking world headlines, deep AI causal synthesis, 2D military-grade tactical geo-radar telemetry, 3D holographic CyberGlobe exploration, and real-time per-region environmental and geopolitical metrics.

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

### 4. 🔌 AI Provider Manager\n\nThe protected Admin Console can configure Gemini, Groq, and OpenRouter, test provider connections, choose primary/fallback providers, and set model IDs. Provider keys entered in the UI are encrypted server-side with AES-256-GCM; they are never sent back to the browser. On Netlify, settings are persisted in Netlify Blobs.\n\n### 5. 🌍 Universal 12-Language Localization
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

Full setup, request flow, and Admin API examples: [docs/AI_PROVIDER_MANAGER.md](docs/AI_PROVIDER_MANAGER.md).\n\nFolder-by-folder architecture and the frontend → backend → provider request flow: [docs/PROJECT_SKELETON_API_FLOW.md](docs/PROJECT_SKELETON_API_FLOW.md).\n\n### 6. 📡 Continuous Live Signal Stream
- Auto-refreshes verified global RSS & Google News feeds every 30 seconds.
- Live Signal Marquee with real-time signal score indicator.
- Category filters: All, Uzbekistan, World, Technology, Economy, Science.
- Magazine, Live Stream, and Terminal display modes.

### 6. 🔌 Personal News via MCP (Bring Your Own AI)
- A public, stateless MCP server (Streamable HTTP) lives at `/api/mcp`. Each person connects their own AI client; it picks the person's country, topics and keywords and writes the daily or weekly digest itself. The server runs no model and uses no AI quota.
- Tools: `get_digest` (daily/weekly), `get_latest_news`, `search_articles`, `list_options`. Results are headlines with source URLs, grouped per topic or keyword.
- No login and no stored user data: interests live in the person's AI, not on this server. Scheduling is done by the AI client (the server is pull-only).
- Claude Code: `claude mcp add --transport http humayro https://<your-domain>/api/mcp`.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   Violet Sun 3.2 Frontend                   │
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
git clone https://github.com/shoxruxmamurbekov/Violet-Sun.git
cd Violet-Sun
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
# Configure at least one provider key for AI synthesis
GEMINI_API_KEY="your-gemini-api-key"

# Primary AI provider and optional fallback
AI_PROVIDER="gemini"
# GROQ_API_KEY="your-groq-api-key"
# OPENROUTER_API_KEY="your-openrouter-api-key"
# FALLBACK_AI_PROVIDER="groq"

# Required to save API keys entered through the Admin AI Provider Manager.
# Generate once with: openssl rand -hex 32
# Keep it stable; rotating it will make saved provider keys unreadable.
AI_SETTINGS_ENCRYPTION_KEY="your-random-secret-at-least-32-characters"

# Admin Dashboard Secret Token (for /api/admin/*) - REQUIRED
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

## 📦 Deployment

**Supported target: Netlify** (static site + serverless API in `netlify/functions/api.ts`).
GitHub Pages is not supported: it serves static files only, so `/api/*` would return 404.

1. Connect the repository in Netlify. Build settings come from `netlify.toml` (`npm run build`, publish `dist`, Node 22).
2. Set these environment variables in Netlify (Site settings → Environment variables):
   - `ADMIN_SECRET` (required; the server refuses to start without it)
   - `GEMINI_API_KEY` (AI features)
   - `YOUTUBE_API_KEY` (optional, region videos)
3. Deploy. `/api/*` is routed to the function automatically.

**Admin access:** send the token in the `x-admin-token` header. Query-string tokens are not accepted.

**Shared state:** daily quotas and the news and digest cache are stored in Netlify Blobs (`server/quotaBlobsBackend.ts`, `server/blobsKvBackend.ts`) and mirrored in memory per instance. If the Blobs backend is unavailable, the app falls back to per-instance memory, so quotas become approximate for that period.

For a VPS or Docker, run `npm run build` then `NODE_ENV=production node --import tsx server.ts` (or `npm start`) with the same environment variables.

## 🛠️ Contributing / Pushing Changes

```bash
# Create a feature branch from the latest main
git checkout main && git pull origin main
git checkout -b feature/your-change

# Verify before pushing (same checks as CI)
npm run lint && npm test && npm run build

git add -A
git commit -m "feat: describe your change"
git push -u origin feature/your-change
```

Open a pull request into `main`. Do not force-push to `main`.

---

## 🔐 Security

Do not commit secrets. Keep `.env` out of git (it is ignored) and set `ADMIN_SECRET`, `AI_SETTINGS_ENCRYPTION_KEY`, and any provider keys only in your hosting provider. The Admin AI Provider Manager requires `AI_SETTINGS_ENCRYPTION_KEY` to persist UI-entered API keys securely. Keep this encryption key stable; if it is changed, previously stored provider keys cannot be decrypted. To report a vulnerability, see [SECURITY.md](SECURITY.md).

## 📄 License
MIT License © 2026 Mamirbekov Shohruxbek. See the [LICENSE](LICENSE) file for the full text.
