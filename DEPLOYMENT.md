# Humayro 3.3 — Ishga tushirish va Deploy qo'llanmasi (Deployment Guide)

Ushbu hujjat **Humayro 3.3 Global News Intelligence** platformasini turli xil ochiq va professional muhitlarga (Netlify, Vercel, Docker, Cloud Run, VPS/PM2, GitHub Pages) muvaffaqiyatli deploy qilish bo'yicha to'liq qo'llanmadir.

---

## 1. Talab qilinadigan Muhit O'zgaruvchilari (Environment Variables)

Loyihani har qanday platformaga deploy qilishdan oldin quyidagi o'zgaruvchilarni hosting panelida (Environment Variables) sozlang:

| O'zgaruvchi | Majburiyligi | Tavsif |
|---|---|---|
| `GEMINI_API_KEY` | Tavsiya etiladi | Google Gemini AI tahlillari va xabarlar sintezi uchun kalit |
| `ADMIN_SECRET` | **Majburiy** | Admin metrikalar va boshqaruv xavfsizlik tokeni (masalan: `x7F8k9P2wQ...`) |
| `NODE_ENV` | Avtomatik | `production` qilib belgilanadi |
| `PORT` | Ixtiyoriy | Server porti (standart: `3000` yoki hosting tomonidan belgilanadi) |
| `YOUTUBE_API_KEY` | Ixtiyoriy | Mintaqaviy video yangiliklar integratsiyasi uchun |
| `AI_PROVIDER` | Ixtiyoriy | Birlamchi AI provayderi (`gemini`, `groq`, `openrouter`) |

---

## 2. Deploy Variantlari

### Variant A: Netlify (Tavsiya etiladi — Serverless Full-Stack)
Loyihada tayyor `netlify.toml` va `netlify/functions/api.ts` mavjud:
1. GitHub repozitoriyangizni Netlify bilan ulang.
2. Netlify quyidagi sozlamalarni avtomatik taniydi:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
3. Netlify panelida `Site configuration > Environment variables` bo'limiga `GEMINI_API_KEY` va `ADMIN_SECRET` ni kiriting.
4. **Deploy Site** tugmasini bosing.

---

### Variant B: Docker & Cloud Run / Railway / Render
Loyihada ko'p bosqichli (multi-stage) yengil `Dockerfile` va `docker-compose.yml` mavjud.

#### Docker bilan ishga tushirish:
```bash
# Image yaratish
docker build -t humayro:latest .

# Konteynerni ishga tushirish
docker run -d -p 3000:3000 \
  -e NODE_ENV=production \
  -e ADMIN_SECRET="sizning-maxfiy-tokeningiz" \
  -e GEMINI_API_KEY="sizning-gemini-kalitingiz" \
  humayro:latest
```

#### Docker Compose orqali:
```bash
docker compose up -d
```

#### Google Cloud Run:
```bash
gcloud run deploy humayro-intelligence \
  --source . \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,ADMIN_SECRET=sizning-tokeningiz"
```

---

### Variant C: Vercel (Frontend & SPA)
Loyihada maxsus `vercel.json` sozlangan:
1. Vercel dashboardiga kiring va loyihani import qiling.
2. **Framework Preset**: Vite
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. Environment Variables bo'limida `GEMINI_API_KEY` va `ADMIN_SECRET` ni qo'shing va **Deploy** tugmasini bosing.

---

### Variant D: Linux VPS (Ubuntu, Debian + PM2 + Nginx)
Agar o'z shaxsiy serveringizga deploy qilmoqchi bo'lsangiz:

1. Repozitoriyni klonlang va kiring:
   ```bash
   git clone <repo-url> /var/www/humayro
   cd /var/www/humayro
   ```

2. Paketlarni o'rnating va build qiling:
   ```bash
   npm ci
   npm run build
   ```

3. `.env` faylini yarating:
   ```bash
   cp .env.example .env
   nano .env
   ```

4. PM2 orqali fon rejimida ishga tushiring:
   ```bash
   npm install -g pm2
   pm2 start "npm start" --name humayro
   pm2 save
   pm2 startup
   ```

5. Nginx konfiguratsiyasi (`/etc/nginx/sites-available/humayro`):
   ```nginx
   server {
       listen 80;
       server_name sizning-domeningiz.uz;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. SSL sertifikatini (HTTPS) o'rnatish:
   ```bash
   sudo certbot --nginx -d sizning-domeningiz.uz
   ```

---

### Variant E: GitHub Pages (Faqat statik versiya)
Loyiha `.github/workflows/deploy.yml` orqali GitHub Pages'ga avtomatik deploy bo'lishi mumkin:
1. Repozitoriy sozlamalariga kiring (`Settings > Pages`).
2. **Build and deployment > Source**: `GitHub Actions` qilib tanlang.
3. `main` tarmog'iga har bir `git push` qilganingizda, sayt avtomatik yangilanadi.

---

## 3. Ishga tushirishdan oldingi tekshiruvlar (Checklist)

- [x] `npm run build` muvaffaqiyatli o'tadi (barcha resurslar `dist/` jildiga yig'iladi)
- [x] `npm run lint` 0 ta xato bilan yakunlanadi
- [x] `npm test` barcha 19 ta integratsion testdan o'tadi
- [x] `robots.txt` va `sitemap.xml` qidiruv tizimlari uchun tayyorlangan
- [x] Xavfsizlik sarlavhalari (CSP, nosniff, frame-options) sozlangan
- [x] Dockerfile va Graceful shutdown (`SIGTERM`/`SIGINT`) qo'shilgan
- [x] `/api/health` monitoring va salomatlik tekshiruvi mavjud
