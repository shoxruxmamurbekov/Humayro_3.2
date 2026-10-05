import { SupportedLanguage } from '../types';
import { extraTranslations } from './extraTranslations';

export interface TranslationDict {
  brand_name: string;
  brand_sub: string;
  nav_home: string;
  nav_features: string;
  nav_ai: string;
  nav_explore: string;
  nav_pricing: string;
  nav_about: string;
  nav_contact: string;
  nav_login: string;
  nav_profile: string;
  nav_bookmarks: string;
  nav_admin: string;
  nav_get_started: string;

  hero_eyebrow: string;
  hero_title1: string;
  hero_title2: string;
  hero_sub: string;
  hero_cta_primary: string;
  hero_cta_ghost: string;
  hero_meta_articles: string;
  hero_meta_countries: string;
  hero_meta_live: string;
  scroll_label: string;

  search_label: string;
  search_placeholder: string;
  search_btn: string;
  search_try_label: string;
  chip1: string;
  chip2: string;
  chip3: string;
  chip4: string;
  search_note: string;
  search_shortcut: string;

  features_eyebrow: string;
  features_title1: string;
  features_title2: string;
  features_sub: string;
  f1_title: string;
  f1_desc: string;
  f1_tag: string;
  f2_title: string;
  f2_desc: string;
  f2_tag: string;
  f3_title: string;
  f3_desc: string;
  f3_tag: string;
  f4_title: string;
  f4_desc: string;
  f4_tag: string;
  f5_title: string;
  f5_desc: string;
  f5_tag: string;
  f6_title: string;
  f6_desc: string;
  f6_tag: string;
  f7_title: string;
  f7_desc: string;
  f7_tag: string;
  f8_title: string;
  f8_desc: string;
  f8_tag: string;

  map_eyebrow: string;
  map_title1: string;
  map_title2: string;
  map_hint: string;
  legend_live: string;
  legend_streams: string;

  chat_eyebrow: string;
  chat_title1: string;
  chat_title2: string;
  chat_title3: string;
  chat_session: string;
  chat_online: string;
  chat_you_avatar: string;
  chat_user_msg: string;
  chat_summary_label: string;
  chat_summary_text: string;
  chat_timeline_label: string;
  chat_tl1: string;
  chat_tl2: string;
  chat_tl3: string;
  chat_sources_label: string;
  chat_input_placeholder: string;
  chat_note: string;

  feed_eyebrow: string;
  feed_title1: string;
  feed_title2: string;
  trending_now: string;
  stories_word: string;

  stat1_label: string;
  stat2_label: string;
  stat3_label: string;
  stat4_label: string;

  testi_eyebrow: string;
  testi_title1: string;
  testi_title2: string;
  testi1_text: string;
  testi1_role: string;
  testi2_text: string;
  testi2_role: string;
  testi3_text: string;
  testi3_role: string;

  pricing_eyebrow: string;
  pricing_title1: string;
  pricing_title2: string;
  pricing_sub: string;
  price_free_name: string;
  price_free_desc: string;
  price_free_1: string;
  price_free_2: string;
  price_free_3: string;
  price_free_4: string;
  price_free_cta: string;
  price_pro_badge: string;
  price_pro_name: string;
  price_pro_desc: string;
  price_pro_1: string;
  price_pro_2: string;
  price_pro_3: string;
  price_pro_4: string;
  price_pro_5: string;
  price_pro_6: string;
  price_pro_cta: string;
  price_ent_name: string;
  price_ent_amount: string;
  price_ent_desc: string;
  price_ent_1: string;
  price_ent_2: string;
  price_ent_3: string;
  price_ent_4: string;
  price_ent_5: string;
  price_ent_cta: string;
  coming_soon: string;
  per_mo: string;

  article_back: string;
  article_loading: string;
  article_disclosure: string;
  article_share: string;
  article_share_copied: string;
  article_bookmark: string;
  article_bookmarked: string;
  article_view_source: string;
  keypoints_label: string;
  historical_parallel_title: string;
  historical_similarity_label: string;
  historical_lesson_label: string;
  historical_quote_label: string;
  ticker_label: string;
  ticker_live_badge: string;
  audio_listen: string;
  audio_playing: string;
  audio_pause: string;
  audio_stop: string;
  mode_magazine: string;
  mode_terminal: string;
  history_vs_today_title: string;
  today_column: string;
  history_column: string;
  heatmap_active_hotspots: string;
  heatmap_view_intel: string;

  region_na: string;
  region_eu: string;
  region_asia: string;
  region_oceania: string;
  region_africa: string;

  ai_loading: string;
  ai_error: string;
  ai_rate_limit: string;
  ai_empty_query: string;

  voice_listening: string;
  voice_unsupported: string;

  auth_title_signin: string;
  auth_title_signup: string;
  auth_title_profile: string;
  auth_email: string;
  auth_password: string;
  auth_name: string;
  auth_submit_signin: string;
  auth_submit_signup: string;
  auth_switch_to_signup: string;
  auth_switch_to_signin: string;
  auth_logout: string;
  auth_anonymous_notice: string;
  auth_quota_label: string;
  auth_saved_articles: string;
  auth_history: string;
  auth_no_saved: string;
  auth_clear_history: string;
  auth_supabase_sync: string;

  footer_tagline: string;
  footer_product: string;
  footer_company: string;
  footer_legal: string;
  footer_connect: string;
  footer_features: string;
  footer_pricing: string;
  footer_changelog: string;
  footer_about: string;
  footer_careers: string;
  footer_contact: string;
  footer_privacy: string;
  footer_terms: string;
  footer_security: string;
  footer_copy: string;
  theme_light: string;
  theme_dark: string;
  theme_system: string;
}

export const translations: Record<SupportedLanguage, TranslationDict> = {
  uz: {
    brand_name: "Humayro_3.1",
    brand_sub: "AI News Intelligence",
    nav_home: "Bosh sahifa",
    nav_features: "Imkoniyatlar",
    nav_ai: "AI Tahlil",
    nav_explore: "Xarita",
    nav_pricing: "Narxlar",
    nav_about: "Biz haqimizda",
    nav_contact: "Aloqa",
    nav_login: "Kirish",
    nav_profile: "Profil",
    nav_bookmarks: "Saqlanganlar",
    nav_admin: "Tizim holati",
    nav_get_started: "Boshlash",

    hero_eyebrow: "AI ASOSIDAGI YANGILIKLAR TIZIMI",
    hero_title1: "AI dunyo yangiliklarini",
    hero_title2: "tushunadi.",
    hero_sub: "Millionlab yangilik maqolalari. Bitta tekshirilgan aqlli javob.",
    hero_cta_primary: "Boshlash",
    hero_cta_ghost: "Demoni ko'rish",
    hero_meta_articles: "Maqolalar",
    hero_meta_countries: "Davlatlar",
    hero_meta_live: "Jonli",
    scroll_label: "Pastga suring",

    search_label: "Humayro_3.1'dan so'rang",
    search_placeholder: "Dunyo yangiliklari yoki voqealar haqida so'rang...",
    search_btn: "So'rash",
    search_try_label: "Sinab ko'ring:",
    chip1: "Bugun Yaponiyada nima bo'ldi?",
    chip2: "So'nggi AI yangiliklari",
    chip3: "O'zbekiston iqtisodiyoti",
    chip4: "Yarimo'tkazgichlar bozori",
    search_note: "Real vaqtli AI tahlili — global manbalar asosida mustaqil sintez qilinadi.",
    search_shortcut: "Tezkor qidiruv",

    features_eyebrow: "ASOSIY IMKONIYATLAR",
    features_title1: "Intellekt,",
    features_title2: "hamma joyda.",
    features_sub: "Sizni dunyodan bir qadam oldinda ushlab turuvchi sakkizta premium funksiya.",
    f1_title: "AI Xulosa",
    f1_desc: "Har qanday voqeani soniyalar ichida aniq va lo'nda xulosaga aylantiring.",
    f1_tag: "NLP",
    f2_title: "So'nggi yangiliklar",
    f2_desc: "Dunyoning istalgan nuqtasida voqea sodir bo'lgan zahoti bildirishnoma oling.",
    f2_tag: "Jonli",
    f3_title: "Trendlar",
    f3_desc: "Dunyo nima haqida gapirayotganini ko'ring — shovqin emas, ahamiyat bo'yicha.",
    f3_tag: "Trendlar",
    f4_title: "Dunyo xaritasi",
    f4_desc: "Global voqealarni interaktiv, jonli xaritada tasavvur qiling.",
    f4_tag: "Geo",
    f5_title: "Ovozli qidiruv",
    f5_desc: "Tabiiy so'rang. Tizim eshitadi, tushunadi va javob beradi.",
    f5_tag: "Ovoz",
    f6_title: "Shaxsiy lenta",
    f6_desc: "Qiziqishlaringizni o'rganib, real vaqtda moslashadigan lenta.",
    f6_tag: "Siz",
    f7_title: "Manbalarni solishtirish",
    f7_desc: "Turli nashrlar bir xil voqeani qanday yoritishini yonma-yon ko'ring.",
    f7_tag: "Xolislik",
    f8_title: "Real vaqt tahlili",
    f8_desc: "AI voqealarni rivojlanishi bilan kuzatib boradi — kontekst, kayfiyat, ta'sir.",
    f8_tag: "Jonli",

    map_eyebrow: "JONLI GLOBAL QAMROV",
    map_title1: "Dunyo,",
    map_title2: "real vaqtda.",
    map_hint: "Mintaqani tanlang va real vaqtli tahlilni ko'ring",
    legend_live: "Jonli voqealar",
    legend_streams: "Ma'lumot oqimlari",

    chat_eyebrow: "AI SUHBATI",
    chat_title1: "So'rang.",
    chat_title2: "Tushuning.",
    chat_title3: "Qaror qiling.",
    chat_session: "Humayro_3.1 · Jonli sessiya",
    chat_online: "Onlayn",
    chat_you_avatar: "Siz",
    chat_user_msg: "Janubiy Koreyada bugun nima bo'ldi?",
    chat_summary_label: "Xulosa",
    chat_summary_text: "Hukumat 40 mlrd. dollarlik yarimo'tkazgichlar dasturini e'lon qilgach, Janubiy Koreyaning texnologiya sektori bugun o'sdi. Bozorlar ijobiy reaksiya bildirdi, KOSPI indeksi 2,3% ga oshdi.",
    chat_timeline_label: "Vaqt jadvali",
    chat_tl1: "Hukumat brifingi boshlandi",
    chat_tl2: "Samsung hamkorlikni tasdiqladi",
    chat_tl3: "KOSPI +2,3% bilan yopildi",
    chat_sources_label: "Tasdiqlangan manbalar",
    chat_input_placeholder: "Qo'shimcha savol bering...",
    chat_note: "AI javoblari mustaqil tekshirilgan manbalar bilan quvvatlanadi.",

    feed_eyebrow: "SIZNING LENTANGIZ",
    feed_title1: "Shaxsiylashtirilgan.",
    feed_title2: "Cheksiz.",
    trending_now: "Trendda",
    stories_word: "ta yangilik",

    stat1_label: "Tahlil qilingan maqolalar",
    stat2_label: "Yangilik manbalari",
    stat3_label: "Davlatlar",
    stat4_label: "Jonli monitoring",

    testi_eyebrow: "O'QUVCHILAR ISHONCHI",
    testi_title1: "Yetakchilar",
    testi_title2: "ishonchi.",
    testi1_text: "\"Humayro_3.1 men uchun bir nechta axborot ilovalarini almashtirdi. AI xulosalari hayratlanarli darajada aniq.\"",
    testi1_role: "Mahsulot rahbari, Fintech",
    testi2_text: "\"Dunyo xaritasi orqali mintaqaviy voqealarni bir qarashda tushunish juda qulay. Real vaqtli ma'lumotlar ajoyib.\"",
    testi2_role: "Investitsiya tahlilchisi",
    testi3_text: "\"Shaxsiy axborot tahlilchisiga ega bo'lgandek tuyg'u. Interfeys toza, tezkor va premium darajada.\"",
    testi3_role: "Bosh muharrir",

    pricing_eyebrow: "NARXLAR",
    pricing_title1: "Oddiy.",
    pricing_title2: "Adolatli.",
    pricing_sub: "Bepul boshlang. Barcha asosiy imkoniyatlar $0 narxda mavjud.",
    price_free_name: "Bepul",
    price_free_desc: "Qiziquvchan o'quvchilar va mutaxassislar uchun.",
    price_free_1: "Kuniga 50 ta AI so'rov",
    price_free_2: "Tezkor xulosalar va vaqt jadvali",
    price_free_3: "Tasdiqlangan global manbalar",
    price_free_4: "Mobil va veb to'liq versiya",
    price_free_cta: "Bepul boshlash",
    price_pro_badge: "Kutilmoqda",
    price_pro_name: "Pro",
    price_pro_desc: "Faol tahlilchilar va professional tadqiqotchilar uchun.",
    price_pro_1: "Cheksiz AI so'rovlari",
    price_pro_2: "Chuqurlashtirilgan tahlil + grafiklar",
    price_pro_3: "5000+ barcha manbalar",
    price_pro_4: "Ovozli qidiruv va audio podkastlar",
    price_pro_5: "Manbalar xolisligini solishtirish",
    price_pro_6: "Ustuvor API tezligi",
    price_pro_cta: "Kutilmoqda (Tez kunda)",
    price_ent_name: "Korporativ",
    price_ent_amount: "Individual",
    price_ent_desc: "Jamoalar va tashkilotlar uchun.",
    price_ent_1: "Pro'dagi barcha imkoniyatlar",
    price_ent_2: "SSO va jamoaviy tahlil",
    price_ent_3: "Maxsus ma'lumot oqimlari",
    price_ent_4: "Shaxsiy muhandislik yordami",
    price_ent_5: "SLA va kafolatlangan xavfsizlik",
    price_ent_cta: "Aloqaga chiqish",
    coming_soon: "Tez kunda",
    per_mo: "/oy",

    article_back: "Orqaga",
    article_loading: "Maqola tayyorlanmoqda...",
    article_disclosure: "Ushbu maqola Humayro_3.1 sun'iy intellekti tomonidan tasdiqlangan ochiq manbalar asosida avtomatik sintez qilindi.",
    article_share: "Ulashish",
    article_share_copied: "Havola nusxalandi!",
    article_bookmark: "Saqlash",
    article_bookmarked: "Saqlandi",
    article_view_source: "Asl manbani ochish",
    keypoints_label: "Asosiy nuqtalar",
    historical_parallel_title: "O'xshash tarixiy voqea & dono iqtibos",
    historical_similarity_label: "Tarixiy o'xshashlik",
    historical_lesson_label: "Tarix sabog'i",
    historical_quote_label: "Tarixiy hikmatli iqtibos",
    ticker_label: "JONLI LENTA",
    ticker_live_badge: "TEZKOR",
    audio_listen: "Ovozli eshitish",
    audio_playing: "AI Diktor o'qimoqda...",
    audio_pause: "Pauza",
    audio_stop: "To'xtatish",
    mode_magazine: "Jurnal",
    mode_terminal: "Terminal (Pro)",
    history_vs_today_title: "Tarix va Bugun: Strategik Qiyosiy Matritsa",
    today_column: "Bugungi Dinamika (2026)",
    history_column: "Tarixiy Analog",
    heatmap_active_hotspots: "Faol Geosiyosiy Nuqtalar",
    heatmap_view_intel: "Mintaqa tahlilini ochish",

    region_na: "Shimoliy Amerika",
    region_eu: "Yevropa",
    region_asia: "Osiyo",
    region_oceania: "Avstraliya va Okeaniya",
    region_africa: "Afrika",

    ai_loading: "Javob qidirilmoqda va manbalar tekshirilmoqda...",
    ai_error: "Hozircha javob olib bo'lmadi. Iltimos qayta urinib ko'ring.",
    ai_rate_limit: "Bepul AI quvvati vaqtincha band. Bir necha daqiqadan so'ng urinib ko'ring.",
    ai_empty_query: "Iltimos, so'rov matnini kiriting.",

    voice_listening: "Eshitilmoqda... gapiring",
    voice_unsupported: "Brauzeringiz ovozli qidiruvni qo'llab-quvvatlamaydi.",

    auth_title_signin: "Tizimga kirish",
    auth_title_signup: "Hisob yaratish",
    auth_title_profile: "Foydalanuvchi profili",
    auth_email: "Elektron pochta",
    auth_password: "Parol",
    auth_name: "Ismingiz",
    auth_submit_signin: "Kirish",
    auth_submit_signup: "Ro'yxatdan o'tish",
    auth_switch_to_signup: "Hisobingiz yo'qmi? Yangi ochish",
    auth_switch_to_signin: "Hisobingiz bormi? Kirish",
    auth_logout: "Chiqish",
    auth_anonymous_notice: "Siz anonim rejimdasiz. Maqolalarni saqlash va tarixni ko'rish uchun kiring.",
    auth_quota_label: "Bugungi AI so'rovlari",
    auth_saved_articles: "Saqlangan maqolalar",
    auth_history: "Qidiruv tarixi",
    auth_no_saved: "Hozircha saqlangan maqolalar yo'q.",
    auth_clear_history: "Tarixni tozalash",
    auth_supabase_sync: "Bulutli sinxronizatsiya holati",

    footer_tagline: "Dunyo yangiliklarini sun'iy intellekt orqali tahlil qiluvchi platforma.",
    footer_product: "Mahsulot",
    footer_company: "Kompaniya",
    footer_legal: "Huquqiy",
    footer_connect: "Aloqa",
    footer_features: "Imkoniyatlar",
    footer_pricing: "Narxlar",
    footer_changelog: "Yangilanishlar",
    footer_about: "Biz haqimizda",
    footer_careers: "Karyera",
    footer_contact: "Bog'lanish",
    footer_privacy: "Maxfiylik",
    footer_terms: "Foydalanish shartlari",
    footer_security: "Xavfsizlik",
    footer_copy: "Barcha huquqlar himoyalangan.",
    theme_light: "Kunduzgi",
    theme_dark: "Tungi",
    theme_system: "Tizim"
  },

  en: {
    brand_name: "Humayro_3.1",
    brand_sub: "AI News Intelligence",
    nav_home: "Home",
    nav_features: "Features",
    nav_ai: "AI Insights",
    nav_explore: "Explore",
    nav_pricing: "Pricing",
    nav_about: "About",
    nav_contact: "Contact",
    nav_login: "Login",
    nav_profile: "Profile",
    nav_bookmarks: "Bookmarks",
    nav_admin: "System Status",
    nav_get_started: "Get Started",

    hero_eyebrow: "AI-POWERED NEWS INTELLIGENCE",
    hero_title1: "AI understands the",
    hero_title2: "world's news.",
    hero_sub: "Millions of verified global news articles. One intelligent synthesis.",
    hero_cta_primary: "Get Started",
    hero_cta_ghost: "Watch Demo",
    hero_meta_articles: "Articles",
    hero_meta_countries: "Countries",
    hero_meta_live: "Live",
    scroll_label: "Scroll",

    search_label: "Ask Humayro_3.1",
    search_placeholder: "Ask about current world events, companies, or topics...",
    search_btn: "Ask",
    search_try_label: "Try:",
    chip1: "What happened today in Japan?",
    chip2: "Latest AI news",
    chip3: "Global semiconductor market",
    chip4: "Uzbekistan economy",
    search_note: "Real-time AI news synthesis powered by multi-source news verification.",
    search_shortcut: "Quick Search",

    features_eyebrow: "CORE CAPABILITIES",
    features_title1: "Intelligence,",
    features_title2: "everywhere.",
    features_sub: "Eight premium features engineered to keep you ahead of global developments.",
    f1_title: "AI Summary",
    f1_desc: "Distill complex multi-source stories into an objective summary in seconds.",
    f1_tag: "NLP",
    f2_title: "Breaking News",
    f2_desc: "Real-time updates the moment a major story breaks anywhere on earth.",
    f2_tag: "Live",
    f3_title: "Trending Signal",
    f3_desc: "See what the world is discussing — ranked by verified importance, not noise.",
    f3_tag: "Trends",
    f4_title: "World Map",
    f4_desc: "Visualize global events and regional updates on an interactive living map.",
    f4_tag: "Geo",
    f5_title: "Voice Search",
    f5_desc: "Ask naturally. Humayro_3.1 listens, understands, and synthesizes answers.",
    f5_tag: "Voice",
    f6_title: "Personalized Feed",
    f6_desc: "A feed that adapts to your areas of interest with privacy-first storage.",
    f6_tag: "You",
    f7_title: "Compare Sources",
    f7_desc: "See how different global outlets report on the same event side by side.",
    f7_tag: "Objectivity",
    f8_title: "Real-time Analysis",
    f8_desc: "AI tracks story evolution — geopolitical context, market sentiment, and impact.",
    f8_tag: "Live",

    map_eyebrow: "LIVE GLOBAL COVERAGE",
    map_title1: "The world,",
    map_title2: "in real time.",
    map_hint: "Click any continent hotspot for deep regional intelligence",
    legend_live: "Live events",
    legend_streams: "Data streams",

    chat_eyebrow: "AI CONVERSATION",
    chat_title1: "Ask.",
    chat_title2: "Understand.",
    chat_title3: "Decide.",
    chat_session: "Humayro_3.1 · Live Session",
    chat_online: "Online",
    chat_you_avatar: "You",
    chat_user_msg: "What happened in South Korea today?",
    chat_summary_label: "Summary",
    chat_summary_text: "South Korea's tech sector rallied today as the government announced a $40B semiconductor initiative. Markets responded positively, with KOSPI closing up 2.3%.",
    chat_timeline_label: "Timeline",
    chat_tl1: "Government briefing begins",
    chat_tl2: "Samsung confirms partnership",
    chat_tl3: "KOSPI closes +2.3%",
    chat_sources_label: "Verified Sources",
    chat_input_placeholder: "Ask a follow-up question...",
    chat_note: "AI answers are grounded in real verified global sources.",

    feed_eyebrow: "YOUR FEED",
    feed_title1: "Personalized.",
    feed_title2: "Endless.",
    trending_now: "Trending",
    stories_word: "stories",

    stat1_label: "Articles analyzed",
    stat2_label: "News sources",
    stat3_label: "Countries",
    stat4_label: "Live monitoring",

    testi_eyebrow: "TRUSTED BY READERS",
    testi_title1: "Trusted by",
    testi_title2: "millions.",
    testi1_text: "\"Humayro_3.1 replaced five scattered news apps for me. The AI synthesis is fast and remarkably accurate.\"",
    testi1_role: "Product Lead, Stripe",
    testi2_text: "\"The world map feature is brilliant. I finally grasp geopolitical news across regions in seconds.\"",
    testi2_role: "Investor, Sequoia",
    testi3_text: "\"It feels like having an elite personal news research desk. Clean, lightning fast, premium.\"",
    testi3_role: "Editor, TechCrunch",

    pricing_eyebrow: "PRICING",
    pricing_title1: "Simple.",
    pricing_title2: "Fair.",
    pricing_sub: "Start free. All core intelligence features are $0 with no credit card required.",
    price_free_name: "Free",
    price_free_desc: "For curious readers, students, and professionals.",
    price_free_1: "50 AI queries / day",
    price_free_2: "Real-time summaries & timeline",
    price_free_3: "Verified global sources",
    price_free_4: "Full desktop and mobile access",
    price_free_cta: "Start Free",
    price_pro_badge: "Coming Soon",
    price_pro_name: "Pro",
    price_pro_desc: "For heavy power users and quantitative analysts.",
    price_pro_1: "Unlimited AI queries",
    price_pro_2: "Deep research + multi-step timeline",
    price_pro_3: "5000+ sources & raw archives",
    price_pro_4: "Voice search & audio briefs",
    price_pro_5: "Bias & sentiment comparison",
    price_pro_6: "Priority low-latency API",
    price_pro_cta: "Coming Soon (Waitlist)",
    price_ent_name: "Enterprise",
    price_ent_amount: "Custom",
    price_ent_desc: "For newsrooms, institutions, and teams.",
    price_ent_1: "Everything in Pro",
    price_ent_2: "SSO & admin control panel",
    price_ent_3: "Custom ingestion feeds & webhooks",
    price_ent_4: "Dedicated account manager",
    price_ent_5: "SLA & regulatory compliance",
    price_ent_cta: "Contact Team",
    coming_soon: "Coming Soon",
    per_mo: "/mo",

    article_back: "Back",
    article_loading: "Preparing intelligence brief...",
    article_disclosure: "This article was synthesized by Humayro_3.1 AI based on verified live global news sources.",
    article_share: "Share",
    article_share_copied: "Link copied!",
    article_bookmark: "Bookmark",
    article_bookmarked: "Bookmarked",
    article_view_source: "View Original",
    keypoints_label: "Key Takeaways",
    historical_parallel_title: "Historical Parallel & Wisdom Quote",
    historical_similarity_label: "Historical Context",
    historical_lesson_label: "Historical Lesson",
    historical_quote_label: "Wisdom Quote",
    ticker_label: "LIVE WIRE",
    ticker_live_badge: "BREAKING",
    audio_listen: "Audio Brief",
    audio_playing: "Reading Audio Brief...",
    audio_pause: "Pause",
    audio_stop: "Stop",
    mode_magazine: "Magazine",
    mode_terminal: "Terminal (Pro)",
    history_vs_today_title: "History vs. Today: Strategic Intelligence Matrix",
    today_column: "Modern Dynamics (2026)",
    history_column: "Historical Analog",
    heatmap_active_hotspots: "Active Geopolitical Hotspots",
    heatmap_view_intel: "Inspect Regional Wire",

    region_na: "North America",
    region_eu: "Europe",
    region_asia: "Asia",
    region_oceania: "Australia & Oceania",
    region_africa: "Africa",

    ai_loading: "Retrieving sources and synthesizing response...",
    ai_error: "Unable to synthesize answer at the moment. Please try again.",
    ai_rate_limit: "Free AI capacity is temporarily busy. Please wait a moment.",
    ai_empty_query: "Please enter a valid search query.",

    voice_listening: "Listening... speak now",
    voice_unsupported: "Your browser does not support Speech Recognition.",

    auth_title_signin: "Sign In",
    auth_title_signup: "Create Account",
    auth_title_profile: "User Profile",
    auth_email: "Email address",
    auth_password: "Password",
    auth_name: "Full name",
    auth_submit_signin: "Sign In",
    auth_submit_signup: "Create Account",
    auth_switch_to_signup: "Don't have an account? Sign up",
    auth_switch_to_signin: "Already have an account? Sign in",
    auth_logout: "Sign Out",
    auth_anonymous_notice: "You are currently in guest mode. Sign in to sync bookmarks and preferences.",
    auth_quota_label: "Daily AI Queries",
    auth_saved_articles: "Saved Articles",
    auth_history: "Search History",
    auth_no_saved: "No saved articles yet. Bookmark stories from the feed or map.",
    auth_clear_history: "Clear History",
    auth_supabase_sync: "Cloud Sync Status",

    footer_tagline: "AI-powered global news intelligence and verified synthesis platform.",
    footer_product: "Product",
    footer_company: "Company",
    footer_legal: "Legal",
    footer_connect: "Connect",
    footer_features: "Features",
    footer_pricing: "Pricing",
    footer_changelog: "Changelog",
    footer_about: "About",
    footer_careers: "Careers",
    footer_contact: "Contact",
    footer_privacy: "Privacy",
    footer_terms: "Terms",
    footer_security: "Security",
    footer_copy: "All rights reserved.",
    theme_light: "Daylight",
    theme_dark: "Night",
    theme_system: "System"
  },

  ru: {
    brand_name: "Humayro_3.1",
    brand_sub: "ИИ Новостной Интеллект",
    nav_home: "Главная",
    nav_features: "Возможности",
    nav_ai: "ИИ Анализ",
    nav_explore: "Карта",
    nav_pricing: "Цены",
    nav_about: "О нас",
    nav_contact: "Контакты",
    nav_login: "Войти",
    nav_profile: "Профиль",
    nav_bookmarks: "Закладки",
    nav_admin: "Статус системы",
    nav_get_started: "Начать",

    hero_eyebrow: "НОВОСТНОЙ ИНТЕЛЛЕКТ НА БАЗЕ ИИ",
    hero_title1: "ИИ понимает",
    hero_title2: "новости мира.",
    hero_sub: "Миллионы проверенных мировых новостей. Один точный синтезированный ответ.",
    hero_cta_primary: "Начать",
    hero_cta_ghost: "Смотреть демо",
    hero_meta_articles: "Статей",
    hero_meta_countries: "Стран",
    hero_meta_live: "В эфире",
    scroll_label: "Прокрутите",

    search_label: "Спросите Humayro_3.1",
    search_placeholder: "Задайте вопрос о мировых событиях или новостях...",
    search_btn: "Спросить",
    search_try_label: "Попробуйте:",
    chip1: "Что произошло сегодня в Японии?",
    chip2: "Последние новости об ИИ",
    chip3: "Рынок полупроводников",
    chip4: "Экономика Узбекистана",
    search_note: "Синтез новостей в реальном времени с подтверждением по нескольким источникам.",
    search_shortcut: "Быстрый поиск",

    features_eyebrow: "ОСНОВНЫЕ ВОЗМОЖНОСТИ",
    features_title1: "Интеллект",
    features_title2: "повсюду.",
    features_sub: "Восемь премиальных функций, которые держат вас на шаг впереди мировых событий.",
    f1_title: "ИИ-резюме",
    f1_desc: "Превращайте сложные события в точное и объективное резюме за секунды.",
    f1_tag: "NLP",
    f2_title: "Срочные новости",
    f2_desc: "Мгновенные оповещения при возникновении важных событий в любой точке мира.",
    f2_tag: "Live",
    f3_title: "Тренды",
    f3_desc: "Узнайте, о чем говорит мир — по реальной значимости, а не по шуму.",
    f3_tag: "Тренды",
    f4_title: "Карта мира",
    f4_desc: "Визуализируйте мировые события на интерактивной живой карте.",
    f4_tag: "Гео",
    f5_title: "Голосовой поиск",
    f5_desc: "Спрашивайте естественно. Humayro_3.1 слушает, понимает и отвечает.",
    f5_tag: "Голос",
    f6_title: "Персональная лента",
    f6_desc: "Лента, которая адаптируется под ваши интересы без передачи личных данных.",
    f6_tag: "Вы",
    f7_title: "Сравнение источников",
    f7_desc: "Смотрите, как разные мировые издания освещают одно и то же событие.",
    f7_tag: "Объективность",
    f8_title: "Анализ в реальном времени",
    f8_desc: "ИИ отслеживает развитие сюжета — геополитику, настроение рынков и последствия.",
    f8_tag: "Live",

    map_eyebrow: "ГЛОБАЛЬНОЕ ПОКРЫТИЕ В РЕАЛЬНОМ ВРЕМЕНИ",
    map_title1: "Мир",
    map_title2: "в реальном времени.",
    map_hint: "Нажмите на континент для получения региональной сводки",
    legend_live: "Живые события",
    legend_streams: "Потоки данных",

    chat_eyebrow: "ДИАЛОГ С ИИ",
    chat_title1: "Спросите.",
    chat_title2: "Поймите.",
    chat_title3: "Решите.",
    chat_session: "Humayro_3.1 · Живая сессия",
    chat_online: "В сети",
    chat_you_avatar: "Вы",
    chat_user_msg: "Что произошло сегодня в Южной Корее?",
    chat_summary_label: "Резюме",
    chat_summary_text: "Технологический сектор Южной Кореи вырос после объявления государственной программы по полупроводникам на $40 млрд. Рынки отреагировали ростом — KOSPI вырос на 2,3%.",
    chat_timeline_label: "Хронология",
    chat_tl1: "Начался правительственный брифинг",
    chat_tl2: "Samsung подтвердила соглашение",
    chat_tl3: "KOSPI закрылся с ростом +2,3%",
    chat_sources_label: "Проверенные источники",
    chat_input_placeholder: "Задайте уточняющий вопрос...",
    chat_note: "Ответы ИИ основаны на проверенных мировых источниках информации.",

    feed_eyebrow: "ВАША ЛЕНТА",
    feed_title1: "Персональная.",
    feed_title2: "Бесконечная.",
    trending_now: "В тренде",
    stories_word: "статей",

    stat1_label: "Проанализировано статей",
    stat2_label: "Источников новостей",
    stat3_label: "Стран",
    stat4_label: "Мониторинг 24/7",

    testi_eyebrow: "ДОВЕРИЕ ЧИТАТЕЛЕЙ",
    testi_title1: "Выбор",
    testi_title2: "миллионов.",
    testi1_text: "\"Humayro_3.1 заменил мне пять новостных приложений. ИИ-резюме поразительно точны и экономят время.\"",
    testi1_role: "Product Lead, Финтех",
    testi2_text: "\"Интерактивная карта мира — это шедевр. Позволяет мгновенно оценить международную обстановку.\"",
    testi2_role: "Венчурный инвестор",
    testi3_text: "\"Ощущение, будто с вами работает персональный аналитик. Быстро, стильно, премиально.\"",
    testi3_role: "Главный редактор",

    pricing_eyebrow: "ЦЕНЫ",
    pricing_title1: "Просто.",
    pricing_title2: "Честно.",
    pricing_sub: "Начните бесплатно. Все ключевые функции доступны по тарифу $0.",
    price_free_name: "Бесплатно",
    price_free_desc: "Для читателей, студентов и аналитиков.",
    price_free_1: "50 ИИ-запросов в день",
    price_free_2: "Быстрые резюме и хронология",
    price_free_3: "Проверенные мировые источники",
    price_free_4: "Полный доступ на ПК и смартфонах",
    price_free_cta: "Начать бесплатно",
    price_pro_badge: "Скоро",
    price_pro_name: "Pro",
    price_pro_desc: "Для профессиональных аналитиков и исследователей.",
    price_pro_1: "Неограниченные ИИ-запросы",
    price_pro_2: "Глубокое исследование + детальная хроника",
    price_pro_3: "5000+ источников и полные архивы",
    price_pro_4: "Голосовой поиск и аудио-дайджесты",
    price_pro_5: "Сравнение тональности источников",
    price_pro_6: "Приоритетный доступ к API",
    price_pro_cta: "Скоро (Список ожидания)",
    price_ent_name: "Корпоративный",
    price_ent_amount: "Индивидуально",
    price_ent_desc: "Для команд, редакций и компаний.",
    price_ent_1: "Всё из тарифа Pro",
    price_ent_2: "SSO и панель администрирования",
    price_ent_3: "Индивидуальные потоки данных",
    price_ent_4: "Выделенный менеджер",
    price_ent_5: "SLA и гарантии безопасности",
    price_ent_cta: "Связаться с нами",
    coming_soon: "Скоро",
    per_mo: "/мес",

    article_back: "Назад",
    article_loading: "Подготовка аналитического отчета...",
    article_disclosure: "Статья сформирована ИИ Humayro_3.1 на основе проверенных открытых мировых источников.",
    article_share: "Поделиться",
    article_share_copied: "Ссылка скопирована!",
    article_bookmark: "В закладки",
    article_bookmarked: "В закладках",
    article_view_source: "Оригинал источника",
    keypoints_label: "Ключевые факты",
    historical_parallel_title: "Историческая параллель и мудрая цитата",
    historical_similarity_label: "Историческая параллель",
    historical_lesson_label: "Урок истории",
    historical_quote_label: "Мудрая цитата",
    ticker_label: "ПРЯМОЙ ЭФИР",
    ticker_live_badge: "СРОЧНО",
    audio_listen: "Аудио-брифинг",
    audio_playing: "Диктор читает сводку...",
    audio_pause: "Пауза",
    audio_stop: "Стоп",
    mode_magazine: "Журнал",
    mode_terminal: "Терминал (Pro)",
    history_vs_today_title: "История и современность: Сравнительная матрица",
    today_column: "Динамика сегодня (2026)",
    history_column: "Исторический аналог",
    heatmap_active_hotspots: "Активные геополитические точки",
    heatmap_view_intel: "Открыть сводку региона",

    region_na: "Северная Америка",
    region_eu: "Европа",
    region_asia: "Азия",
    region_oceania: "Австралия и Океания",
    region_africa: "Африка",

    ai_loading: "Поиск в источниках и синтез ответа...",
    ai_error: "Не удалось получить ответ. Пожалуйста, повторите попытку.",
    ai_rate_limit: "Лимит бесплатных запросов временно исчерпан. Пожалуйста, подождите минуту.",
    ai_empty_query: "Пожалуйста, введите текст запроса.",

    voice_listening: "Слушаю... говорите",
    voice_unsupported: "Ваш браузер не поддерживает распознавание речи.",

    auth_title_signin: "Вход в систему",
    auth_title_signup: "Регистрация",
    auth_title_profile: "Профиль пользователя",
    auth_email: "Электронная почта",
    auth_password: "Пароль",
    auth_name: "Ваше имя",
    auth_submit_signin: "Войти",
    auth_submit_signup: "Создать аккаунт",
    auth_switch_to_signup: "Нет аккаунта? Зарегистрироваться",
    auth_switch_to_signin: "Уже есть аккаунт? Войти",
    auth_logout: "Выйти",
    auth_anonymous_notice: "Вы в гостевом режиме. Войдите, чтобы синхронизировать закладки и историю.",
    auth_quota_label: "ИИ-запросы за сегодня",
    auth_saved_articles: "Сохраненные статьи",
    auth_history: "История поиска",
    auth_no_saved: "Сохраненных статей пока нет.",
    auth_clear_history: "Очистить историю",
    auth_supabase_sync: "Синхронизация с облаком",

    footer_tagline: "Интеллектуальная платформа анализа мировых новостей.",
    footer_product: "Продукт",
    footer_company: "Компания",
    footer_legal: "Правовая информация",
    footer_connect: "Связь",
    footer_features: "Возможности",
    footer_pricing: "Цены",
    footer_changelog: "Обновления",
    footer_about: "О нас",
    footer_careers: "Карьера",
    footer_contact: "Контакты",
    footer_privacy: "Конфиденциальность",
    footer_terms: "Условия использования",
    footer_security: "Безопасность",
    footer_copy: "Все права защищены.",
    theme_light: "Дневная",
    theme_dark: "Ночная",
    theme_system: "Системная"
  },

  ko: {
    brand_name: "Humayro_3.1",
    brand_sub: "AI 뉴스 인텔리전스",
    nav_home: "홈",
    nav_features: "기능",
    nav_ai: "AI 분석",
    nav_explore: "지도",
    nav_pricing: "요금제",
    nav_about: "소개",
    nav_contact: "문의",
    nav_login: "로그인",
    nav_profile: "프로필",
    nav_bookmarks: "북마크",
    nav_admin: "시스템 상태",
    nav_get_started: "시작하기",

    hero_eyebrow: "AI 기반 글로벌 뉴스 인텔리전스",
    hero_title1: "AI가 세계의 뉴스를",
    hero_title2: "이해합니다.",
    hero_sub: "수백만 개의 검증된 세계 뉴스. 단 하나의 지능적인 종합 답변.",
    hero_cta_primary: "시작하기",
    hero_cta_ghost: "데모 보기",
    hero_meta_articles: "기사",
    hero_meta_countries: "국가",
    hero_meta_live: "실시간",
    scroll_label: "스크롤",

    search_label: "Humayro_3.1에게 질문하세요",
    search_placeholder: "글로벌 뉴스, 사건, 기업에 대해 질문하세요...",
    search_btn: "질문",
    search_try_label: "추천 질문:",
    chip1: "오늘 일본에서 무슨 일이 있었나요?",
    chip2: "최신 AI 뉴스",
    chip3: "반도체 시장 동향",
    chip4: "우즈베키스탄 경제 현황",
    search_note: "다각도 출처 검증을 통한 실시간 AI 종합 답변을 제공합니다.",
    search_shortcut: "빠른 검색",

    features_eyebrow: "핵심 기능",
    features_title1: "어디서나",
    features_title2: "인텔리전스.",
    features_sub: "세상의 흐름보다 앞서갈 수 있도록 설계된 8가지 프리미엄 기능.",
    f1_title: "AI 요약",
    f1_desc: "복잡한 뉴스를 몇 초 만에 객관적이고 정확한 핵심 요약으로 정리합니다.",
    f1_tag: "NLP",
    f2_title: "속보 알림",
    f2_desc: "지구 어디서든 중요한 사건이 발생하는 즉시 실시간 업데이트를 제공합니다.",
    f2_tag: "실시간",
    f3_title: "트렌드 신호",
    f3_desc: "소음이 아닌 신호 기준으로 선별된 글로벌 주요 이슈를 확인하세요.",
    f3_tag: "트렌드",
    f4_title: "세계 지도",
    f4_desc: "인터랙티브 라이브 지도에서 글로벌 사건과 지역별 뉴스를 시각화합니다.",
    f4_tag: "지리",
    f5_title: "음성 검색",
    f5_desc: "자연스럽게 말하세요. Humayro_3.1가 경청하고 이해하여 답합니다.",
    f5_tag: "음성",
    f6_title: "맞춤형 피드",
    f6_desc: "개인정보를 보호하면서 관심 분야에 맞춰 실시간 적응하는 피드입니다.",
    f6_tag: "나만의",
    f7_title: "출처 비교",
    f7_desc: "동일한 사건에 대해 세계 각국 언론 매체들이 어떻게 보도하는지 비교합니다.",
    f7_tag: "객관성",
    f8_title: "실시간 심층 분석",
    f8_desc: "지정학적 맥락, 시장 심리, 파급 효과 등 사건의 전개 과정을 추적합니다.",
    f8_tag: "실시간",

    map_eyebrow: "실시간 글로벌 커버리지",
    map_title1: "세계를,",
    map_title2: "실시간으로.",
    map_hint: "대륙 핫스팟을 클릭하여 지역별 최신 뉴스를 확인하세요",
    legend_live: "실시간 이벤트",
    legend_streams: "데이터 스트림",

    chat_eyebrow: "AI 대화",
    chat_title1: "질문하고,",
    chat_title2: "이해하고,",
    chat_title3: "결정하세요.",
    chat_session: "Humayro_3.1 · 실시간 세션",
    chat_online: "온라인",
    chat_you_avatar: "나",
    chat_user_msg: "오늘 한국에서 무슨 일이 있었나요?",
    chat_summary_label: "요약",
    chat_summary_text: "정부가 400억 달러 규모의 반도체 이니셔티브를 발표하면서 기술 섹터가 상승세를 보였습니다. 코스피 지수는 2.3% 상승 마감했습니다.",
    chat_timeline_label: "타임라인",
    chat_tl1: "정부 정책 브리핑 시작",
    chat_tl2: "삼성전자 파트너십 확인",
    chat_tl3: "코스피 +2.3% 마감",
    chat_sources_label: "검증된 출처",
    chat_input_placeholder: "후속 질문을 입력하세요...",
    chat_note: "AI 답변은 검증된 글로벌 뉴스 출처를 바탕으로 생성됩니다.",

    feed_eyebrow: "내 피드",
    feed_title1: "맞춤형.",
    feed_title2: "끝없는.",
    trending_now: "트렌드",
    stories_word: "개 기사",

    stat1_label: "분석된 기사",
    stat2_label: "뉴스 출처",
    stat3_label: "국가",
    stat4_label: "24/7 실시간 모니터링",

    testi_eyebrow: "독자들의 신뢰",
    testi_title1: "수많은 리더들의",
    testi_title2: "선택.",
    testi1_text: "\"Humayro_3.1는 여러 뉴스 앱을 완벽하게 대체했습니다. AI 종합 요약이 빠르고 매우 정확합니다.\"",
    testi1_role: "프로덕트 리드, 핀테크",
    testi2_text: "\"세계 지도 인터페이스는 혁신적입니다. 각 대륙의 동향을 단 몇 초 만에 파악할 수 있습니다.\"",
    testi2_role: "투자 심사역",
    testi3_text: "\"엘리트 리서치 팀을 곁에 둔 것 같습니다. 깔끔하고 직관적이며 완성도가 높습니다.\"",
    testi3_role: "수석 에디터",

    pricing_eyebrow: "요금제",
    pricing_title1: "간결하고,",
    pricing_title2: "공정하게.",
    pricing_sub: "무료로 시작하세요. 모든 핵심 인텔리전스 기능을 $0에 이용할 수 있습니다.",
    price_free_name: "무료 플랜",
    price_free_desc: "호기심 많은 독자, 학생, 전문 연구원을 위해.",
    price_free_1: "하루 50회 AI 질문",
    price_free_2: "실시간 요약 및 타임라인",
    price_free_3: "검증된 글로벌 출처",
    price_free_4: "모바일 및 웹 완벽 지원",
    price_free_cta: "무료로 시작하기",
    price_pro_badge: "출시 예정",
    price_pro_name: "Pro",
    price_pro_desc: "전문 애널리스트 및 파워 유저를 위해.",
    price_pro_1: "무제한 AI 질문",
    price_pro_2: "심층 리서치 + 다단계 타임라인",
    price_pro_3: "5000개 이상 전체 출처 및 아카이브",
    price_pro_4: "음성 검색 및 오디오 브리프",
    price_pro_5: "출처별 편향성 및 여론 분석",
    price_pro_6: "우선 처리 전용 API",
    price_pro_cta: "출시 예정 (대기자 등록)",
    price_ent_name: "엔터프라이즈",
    price_ent_amount: "맞춤형",
    price_ent_desc: "언론사, 금융 기관, 기업 팀을 위해.",
    price_ent_1: "Pro의 모든 기능 포함",
    price_ent_2: "SSO 및 팀 관리자 콘솔",
    price_ent_3: "맞춤형 데이터 수집 및 웹훅",
    price_ent_4: "전담 기술 계정 매니저",
    price_ent_5: "SLA 및 엔터프라이즈 보안 보증",
    price_ent_cta: "영업팀 문의",
    coming_soon: "출시 예정",
    per_mo: "/월",

    article_back: "뒤로 가기",
    article_loading: "인텔리전스 리포트 생성 중...",
    article_disclosure: "이 기사는 Humayro_3.1 AI가 검증된 글로벌 뉴스 출처를 기반으로 종합 분석하여 작성되었습니다.",
    article_share: "공유하기",
    article_share_copied: "링크가 복사되었습니다!",
    article_bookmark: "북마크",
    article_bookmarked: "저장됨",
    article_view_source: "원문 출처 보기",
    keypoints_label: "핵심 요점",
    historical_parallel_title: "역사적 유사 사건 및 지혜의 명언",
    historical_similarity_label: "역사적 유사점",
    historical_lesson_label: "역사의 교훈",
    historical_quote_label: "역사적 명언",
    ticker_label: "라이브 속보",
    ticker_live_badge: "속보",
    audio_listen: "오디오 브리핑",
    audio_playing: "AI 아나운서 낭독 중...",
    audio_pause: "일시정지",
    audio_stop: "정지",
    mode_magazine: "매거진",
    mode_terminal: "터미널 (Pro)",
    history_vs_today_title: "역사와 오늘: 전략적 비교 분석",
    today_column: "오늘의 동향 (2026)",
    history_column: "역사적 유사점",
    heatmap_active_hotspots: "활성 지정학적 핫스팟",
    heatmap_view_intel: "지역 정보 브리프 보기",

    region_na: "북미",
    region_eu: "유럽",
    region_asia: "아시아",
    region_oceania: "호주 및 오세아니아",
    region_africa: "아프리카",

    ai_loading: "출처 검색 및 답변 종합 중...",
    ai_error: "현재 응답을 생성할 수 없습니다. 잠시 후 다시 시도해 주세요.",
    ai_rate_limit: "무료 AI 처리 용량이 일시적으로 혼잡합니다. 잠시 후 다시 시도해 주세요.",
    ai_empty_query: "검색어를 입력해 주세요.",

    voice_listening: "듣고 있습니다... 말씀해 주세요",
    voice_unsupported: "사용 중인 브라우저가 음성 인식을 지원하지 않습니다.",

    auth_title_signin: "로그인",
    auth_title_signup: "계정 생성",
    auth_title_profile: "사용자 프로필",
    auth_email: "이메일 주소",
    auth_password: "비밀번호",
    auth_name: "이름",
    auth_submit_signin: "로그인",
    auth_submit_signup: "가입하기",
    auth_switch_to_signup: "계정이 없으신가요? 회원가입",
    auth_switch_to_signin: "이미 계정이 있으신가요? 로그인",
    auth_logout: "로그아웃",
    auth_anonymous_notice: "현재 게스트 모드입니다. 북마크 및 설정을 동기화하려면 로그인하세요.",
    auth_quota_label: "오늘 사용한 AI 질문",
    auth_saved_articles: "저장한 기사",
    auth_history: "검색 기록",
    auth_no_saved: "저장된 기사가 없습니다. 피드나 지도에서 기사를 북마크하세요.",
    auth_clear_history: "기록 삭제",
    auth_supabase_sync: "클라우드 동기화 상태",

    footer_tagline: "실시간 글로벌 뉴스를 AI로 분석하는 차세대 인텔리전스 플랫폼.",
    footer_product: "제품",
    footer_company: "회사",
    footer_legal: "법적 고지",
    footer_connect: "연결",
    footer_features: "기능",
    footer_pricing: "요금제",
    footer_changelog: "업데이트 내역",
    footer_about: "소개",
    footer_careers: "채용",
    footer_contact: "문의",
    footer_privacy: "개인정보처리방침",
    footer_terms: "이용약관",
    footer_security: "보안",
    footer_copy: "All rights reserved.",
    theme_light: "주간 모드",
    theme_dark: "야간 모드",
    theme_system: "시스템 설정"
  },

  // 8 new languages:
  kk: extraTranslations.kk as TranslationDict,
  ky: extraTranslations.ky as TranslationDict,
  tg: extraTranslations.tg as TranslationDict,
  tk: extraTranslations.tk as TranslationDict,
  az: extraTranslations.az as TranslationDict,
  tr: extraTranslations.tr as TranslationDict,
  ar: extraTranslations.ar as TranslationDict,
  fa: extraTranslations.fa as TranslationDict
};
