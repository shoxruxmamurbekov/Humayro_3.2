import { SupportedLanguage } from '../types';

export interface UiDictionary {
  brand_name: string;
  brand_sub: string;
  nav_intelligence: string;
  nav_world: string;
  nav_markets: string;
  nav_technology: string;
  nav_regions: string;
  nav_search: string;
  nav_live: string;

  hero_eyebrow: string;
  hero_title_1: string;
  hero_title_2: string;
  hero_sub: string;
  hero_placeholder: string;
  hero_analyze: string;
  hero_analyzing: string;
  hero_trending: string;
  tab_uzbekistan: string;
  tab_global: string;

  signal_live: string;
  signal_stream_active: string;
  signal_monitoring_247: string;
  signal_label: string;

  metrics_activity: string;
  metrics_activity_sub: string;
  metrics_analyzed: string;
  metrics_analyzed_sub: string;
  metrics_trending: string;
  metrics_trending_sub: string;

  map_eyebrow: string;
  map_title: string;
  map_sub: string;
  map_view_3d: string;
  map_view_2d: string;
  map_select_region: string;
  map_region_intel: string;
  map_open_workspace: string;
  map_active_events: string;
  map_debates: string;
  map_video_reports: string;
  map_stats_facts: string;
  map_ask_ai: string;
  map_live_weather: string;

  feed_eyebrow: string;
  feed_title: string;
  feed_all: string;
  feed_uzbekistan: string;
  feed_world: string;
  feed_technology: string;
  feed_economy: string;
  feed_science: string;
  feed_loading: string;
  feed_sync: string;
  feed_refresh_btn: string;
  feed_refreshing: string;

  card_verified: string;
  card_trending: string;
  card_ai_analysis: string;

  brief_eyebrow: string;
  brief_title: string;
  brief_sub: string;
  brief_status_ready: string;
  brief_autonomous: string;
  brief_empty_title: string;
  brief_empty_sub: string;
  brief_top_signal: string;
  brief_summary: string;
  brief_sentiment: string;
  brief_keypoints: string;
  brief_timeline: string;
  brief_sources: string;
  brief_send: string;
  brief_placeholder: string;

  reader_title: string;
  reader_verified: string;
  reader_confidence: string;
  reader_keypoints: string;
  reader_sources: string;
  reader_engine: string;

  bnav_home: string;
  bnav_signals: string;
  bnav_ai: string;
  bnav_saved: string;
  bnav_profile: string;

  time_just_now: string;
  time_min_ago: string;
  time_hour_ago: string;
  time_day_ago: string;
}

const UI_TEXT: Record<SupportedLanguage, UiDictionary> = {
  uz: {
    brand_name: "HUMAYRO",
    brand_sub: "GLOBAL INTELLEKT",
    nav_intelligence: "AI Tahlil",
    nav_world: "Dunyo",
    nav_markets: "Bozorlar",
    nav_technology: "Texnologiya",
    nav_regions: "Mintaqalar",
    nav_search: "Qidiruv",
    nav_live: "JONLI",

    hero_eyebrow: "AI ASOSIDAGI GLOBAL AXBOROT TIZIMI",
    hero_title_1: "DUNYO OʻZGARMOQDA.",
    hero_title_2: "HUMAYRO SABABINI TUSHUNTIRADI.",
    hero_sub: "Tasdiqlangan manbalar, AI sintezi va global kontekstga ega real-vaqt yangiliklar intellekti.",
    hero_placeholder: "Humayro'dan har qanday mavzu haqida soʻrang…",
    hero_analyze: "Tahlil qilish",
    hero_analyzing: "Tahlil qilinmoqda…",
    hero_trending: "Trendda:",
    tab_uzbekistan: "Oʻzbekiston",
    tab_global: "Global",

    signal_live: "JONLI SIGNAL",
    signal_stream_active: "Global axborot oqimi faol",
    signal_monitoring_247: "AI monitoring 24/7",
    signal_label: "SIGNAL",

    metrics_activity: "GLOBAL FAOLLIK",
    metrics_activity_sub: "24/7 xalqaro axborot agentliklari monitoringi",
    metrics_analyzed: "AI TAHLIL QILGAN",
    metrics_analyzed_sub: "Fakt-tekshiruv va sintezdan oʻtgan xabarlar",
    metrics_trending: "QAYNOQ SIGNALLAR",
    metrics_trending_sub: "Oʻsish koʻrsatkichi >85% boʻlgan qaynoq mavzular",

    map_eyebrow: "GLOBAL MONITORING VA MINTAQALAR",
    map_title: "Dunyo Intellekt Sferasi va Xaritasi.",
    map_sub: "Real-vaqt global lentalar, qitʼalar monitoringi va shahar ob-havo telemetriyasi.",
    map_view_3d: "3D Sfera (Globus)",
    map_view_2d: "2D Kiber Radar",
    map_select_region: "Mintaqani tanlang:",
    map_region_intel: "Mintaqaviy Tahliliy Markaz",
    map_open_workspace: "Toʻliq tahlil oynasi",
    map_active_events: "Qaynoq hodisalar",
    map_debates: "Jamoatchilik muhokamalari",
    map_video_reports: "YouTube Video hisobotlar",
    map_stats_facts: "Koʻrsatkichlar & Faktlar",
    map_ask_ai: "AI bilan chuqur tahlil",
    map_live_weather: "Real-vaqt ob-havosi",

    feed_eyebrow: "JONLI AXBOROT OQIMI",
    feed_title: "Diqqatga sazovor signallar.",
    feed_all: "Barcha yangiliklar",
    feed_uzbekistan: "Oʻzbekiston",
    feed_world: "Jahon & Diplomatiya",
    feed_technology: "Texnologiya & AI",
    feed_economy: "Iqtisodiyot & Moliya",
    feed_science: "Ilm-fan",
    feed_loading: "Xalqaro agentliklardan yangiliklar olinmoqda…",
    feed_sync: "Avtomatik yangilanish:",
    feed_refresh_btn: "Hoziroq yangilash",
    feed_refreshing: "Yangilanmoqda…",

    card_verified: "Tasdiqlangan",
    card_trending: "Trendda",
    card_ai_analysis: "AI Tahlili",

    brief_eyebrow: "HUMAYRO AI TAHLILIY HISOBOTI",
    brief_title: "Sarlavhalardan intellekt sari.",
    brief_sub: "Sunʼiy intellekt orqali koʻp manbali tekshiruv, jamoatchilik munosabati va tarixiy oʻxshashliklar tahlili.",
    brief_status_ready: "AI SINTEZI TAYYOR",
    brief_autonomous: "AVTONOM TADQIQOT",
    brief_empty_title: "Qiziqtirgan mavzu boʻyicha soʻrov kiriting.",
    brief_empty_sub: "Tizim real-vaqt yangiliklarini oʻrganib, tahliliy hisobot, ijtimoiy munosabat va tarixiy paralellarni taqdim etadi.",
    brief_top_signal: "TOP TREND SIGNALI",
    brief_summary: "YAKUNIY XULOSA",
    brief_sentiment: "Jamoatchilik munosabati va muhokamalar",
    brief_keypoints: "ASOSIY OMILLAR VA DRAYVERLAR",
    brief_timeline: "VOQEALAR XRONOLOGIYASI",
    brief_sources: "TASDIQLANGAN MANBALAR",
    brief_send: "Yuborish",
    brief_placeholder: "Ushbu tahlil boʻyicha qoʻshimcha savol bering yoki yangi mavzu kiriting…",

    reader_title: "TAHLILIY OʻQUVCHI",
    reader_verified: "AI TASDIQLANGAN SIGNAL",
    reader_confidence: "Ishonchlilik darajasi:",
    reader_keypoints: "ASOSIY XULOSALAR",
    reader_sources: "TASDIQLANGAN MANBALAR",
    reader_engine: "HUMAYRO 3.3 INTELLIGENCE ENGINE",

    bnav_home: "Bosh sahifa",
    bnav_signals: "Signallar",
    bnav_ai: "AI",
    bnav_saved: "Saqlangan",
    bnav_profile: "Profil",

    time_just_now: "hozirgina",
    time_min_ago: "daq. oldin",
    time_hour_ago: "soat oldin",
    time_day_ago: "kun oldin"
  },
  ru: {
    brand_name: "HUMAYRO",
    brand_sub: "ГЛОБАЛЬНЫЙ ИНТЕЛЛЕКТ",
    nav_intelligence: "AI Анализ",
    nav_world: "Мир",
    nav_markets: "Рынки",
    nav_technology: "Технологии",
    nav_regions: "Регионы",
    nav_search: "Поиск",
    nav_live: "ПРЯМОЙ ЭФИР",

    hero_eyebrow: "ГЛОБАЛЬНЫЙ ИНТЕЛЛЕКТ НА БАЗЕ ИИ",
    hero_title_1: "МИР МЕНЯЕТСЯ.",
    hero_title_2: "HUMAYRO ОБЪЯСНЯЕТ ПРИЧИНЫ.",
    hero_sub: "Интеллект новостей в реальном времени на основе проверенных источников, синтеза ИИ и глобального контекста.",
    hero_placeholder: "Спросите Humayro о чём угодно…",
    hero_analyze: "Анализировать",
    hero_analyzing: "Анализ…",
    hero_trending: "В тренде:",
    tab_uzbekistan: "Узбекистан",
    tab_global: "В мире",

    signal_live: "ЖИВОЙ СИГНАЛ",
    signal_stream_active: "Поток глобальной информации активен",
    signal_monitoring_247: "AI мониторинг 24/7",
    signal_label: "СИГНАЛ",

    metrics_activity: "МИРОВАЯ АКТИВНОСТЬ",
    metrics_activity_sub: "Круглосуточный мониторинг мировых агентств",
    metrics_analyzed: "ПРОАНАЛИЗИРОВАНО ИИ",
    metrics_analyzed_sub: "Материалы с фактчекингом и синтезом",
    metrics_trending: "ГОРЯЧИЕ СИГНАЛЫ",
    metrics_trending_sub: "События с динамикой роста >85%",

    map_eyebrow: "ГЛОБАЛЬНЫЙ МОНИТОРИНГ И РЕГИОНЫ",
    map_title: "Сфера и карта мирового интеллекта.",
    map_sub: "Ленты в реальном времени, мониторинг континентов и погодная телеметрия.",
    map_view_3d: "3D Сфера (Глобус)",
    map_view_2d: "2D Кибер Радар",
    map_select_region: "Выберите регион:",
    map_region_intel: "Региональный аналитический центр",
    map_open_workspace: "Полный экран аналитики",
    map_active_events: "Горячие события",
    map_debates: "Общественный резонанс",
    map_video_reports: "YouTube Видеоотчеты",
    map_stats_facts: "Показатели и факты",
    map_ask_ai: "Глубокий анализ с AI",
    map_live_weather: "Погода в реальном времени",

    feed_eyebrow: "ПОТОК ЖИВОЙ ИНФОРМАЦИИ",
    feed_title: "Сигналы, заслуживающие внимания.",
    feed_all: "Все новости",
    feed_uzbekistan: "Узбекистан",
    feed_world: "Мир и дипломатия",
    feed_technology: "Технологии и ИИ",
    feed_economy: "Экономика и финансы",
    feed_science: "Наука",
    feed_loading: "Получение данных от международных агентств…",
    feed_sync: "Автообновление:",
    feed_refresh_btn: "Обновить сейчас",
    feed_refreshing: "Обновление…",

    card_verified: "Проверено",
    card_trending: "В тренде",
    card_ai_analysis: "Анализ AI",

    brief_eyebrow: "АНАЛИТИЧЕСКИЙ ОТЧЕТ HUMAYRO AI",
    brief_title: "От заголовков к глубокому смыслу.",
    brief_sub: "Проверка источников, общественный резонанс и исторические параллели через ИИ.",
    brief_status_ready: "СИНТЕЗ AI ГОТОВ",
    brief_autonomous: "АВТОНОМНОЕ ИССЛЕДОВАНИЕ",
    brief_empty_title: "Введите интересующую тему для анализа.",
    brief_empty_sub: "Система изучит глобальные новости в реальном времени и подготовит отчет.",
    brief_top_signal: "ГЛАВНЫЙ СИГНАЛ ТРЕНДА",
    brief_summary: "РЕЗЮМЕ АНАЛИЗА",
    brief_sentiment: "Общественный резонанс и обсуждение",
    brief_keypoints: "КЛЮЧЕВЫЕ ДРАЙВЕРЫ И ФАКТОРЫ",
    brief_timeline: "ХРОНОЛОГИЯ СОБЫТИЙ",
    brief_sources: "ПРОВЕРЕННЫЕ ИСТОЧНИКИ",
    brief_send: "Отправить",
    brief_placeholder: "Задайте уточняющий вопрос или введите новую тему…",

    reader_title: "АНАЛИТИЧЕСКИЙ ЧИТАТЕЛЬ",
    reader_verified: "ПРОВЕРЕННЫЙ СИГНАЛ ИИ",
    reader_confidence: "Уверенность модели:",
    reader_keypoints: "КЛЮЧЕВЫЕ ВЫВОДЫ",
    reader_sources: "ПРОВЕРЕННЫЕ ИСТОЧНИКИ",
    reader_engine: "HUMAYRO 3.3 INTELLIGENCE ENGINE",

    bnav_home: "Главная",
    bnav_signals: "Сигналы",
    bnav_ai: "ИИ",
    bnav_saved: "Сохранённые",
    bnav_profile: "Профиль",

    time_just_now: "только что",
    time_min_ago: "мин. назад",
    time_hour_ago: "ч. назад",
    time_day_ago: "дн. назад"
  },
  en: {
    brand_name: "HUMAYRO",
    brand_sub: "GLOBAL INTELLIGENCE",
    nav_intelligence: "Intelligence",
    nav_world: "World",
    nav_markets: "Markets",
    nav_technology: "Technology",
    nav_regions: "Regions",
    nav_search: "Search",
    nav_live: "LIVE",

    hero_eyebrow: "AI-POWERED GLOBAL INTELLIGENCE",
    hero_title_1: "THE WORLD IS MOVING.",
    hero_title_2: "HUMAYRO EXPLAINS WHY.",
    hero_sub: "Real-time news intelligence powered by AI, verified sources and global context.",
    hero_placeholder: "Ask Humayro about anything…",
    hero_analyze: "Analyze",
    hero_analyzing: "Analyzing…",
    hero_trending: "Trending:",
    tab_uzbekistan: "Uzbekistan",
    tab_global: "Global",

    signal_live: "LIVE SIGNAL",
    signal_stream_active: "Global intelligence stream active",
    signal_monitoring_247: "AI monitoring 24/7",
    signal_label: "SIGNAL",

    metrics_activity: "GLOBAL ACTIVITY",
    metrics_activity_sub: "24/7 global news agency monitoring",
    metrics_analyzed: "AI ANALYZED",
    metrics_analyzed_sub: "Fact-checked and synthesized dispatches",
    metrics_trending: "TRENDING SIGNALS",
    metrics_trending_sub: "Hot signals with growth score >85%",

    map_eyebrow: "GLOBAL MONITORING & REGIONS",
    map_title: "World Intelligence Sphere & Radar.",
    map_sub: "Real-time global feeds, continental analysis and city weather telemetry.",
    map_view_3d: "3D Sphere",
    map_view_2d: "2D Cyber Radar",
    map_select_region: "Select Region:",
    map_region_intel: "Regional Intelligence Hub",
    map_open_workspace: "Full Analysis Workspace",
    map_active_events: "Active Events",
    map_debates: "Public Debates",
    map_video_reports: "YouTube Video Reports",
    map_stats_facts: "Key Indicators & Facts",
    map_ask_ai: "Deep-Dive with AI",
    map_live_weather: "Real-Time Weather",

    feed_eyebrow: "LIVE INTELLIGENCE",
    feed_title: "Signals worth understanding.",
    feed_all: "All Dispatches",
    feed_uzbekistan: "Uzbekistan",
    feed_world: "World & Diplomacy",
    feed_technology: "Technology & AI",
    feed_economy: "Economy & Markets",
    feed_science: "Science",
    feed_loading: "Ingesting live news from global wires…",
    feed_sync: "Auto-refresh in:",
    feed_refresh_btn: "Refresh Now",
    feed_refreshing: "Refreshing…",

    card_verified: "Verified",
    card_trending: "Trending",
    card_ai_analysis: "AI Analysis",

    brief_eyebrow: "HUMAYRO AI INTELLIGENCE BRIEF",
    brief_title: "From headlines to intelligence.",
    brief_sub: "Multi-source verification, public sentiment and historical analogies powered by AI.",
    brief_status_ready: "AI SYNTHESIS READY",
    brief_autonomous: "AUTONOMOUS RESEARCH",
    brief_empty_title: "Enter any topic to synthesize intelligence.",
    brief_empty_sub: "The engine reviews real-time dispatches and compiles an executive brief with timeline and historical parallels.",
    brief_top_signal: "TOP TRENDING SIGNAL",
    brief_summary: "EXECUTIVE SUMMARY",
    brief_sentiment: "Public Discourse & Social Sentiment",
    brief_keypoints: "KEY DRIVERS & FACTORS",
    brief_timeline: "CHRONOLOGICAL TIMELINE",
    brief_sources: "VERIFIED SOURCES",
    brief_send: "Send",
    brief_placeholder: "Ask a follow-up question or enter a new topic…",

    reader_title: "INTELLIGENCE READER",
    reader_verified: "AI VERIFIED SIGNAL",
    reader_confidence: "Model Confidence:",
    reader_keypoints: "KEY TAKEAWAYS",
    reader_sources: "VERIFIED SOURCES",
    reader_engine: "HUMAYRO 3.3 INTELLIGENCE ENGINE",

    bnav_home: "Home",
    bnav_signals: "Signals",
    bnav_ai: "AI",
    bnav_saved: "Saved",
    bnav_profile: "Profile",

    time_just_now: "just now",
    time_min_ago: "m ago",
    time_hour_ago: "h ago",
    time_day_ago: "d ago"
  },
  ko: {
    brand_name: "HUMAYRO",
    brand_sub: "글로벌 인텔리전스",
    nav_intelligence: "AI 분석",
    nav_world: "세계",
    nav_markets: "시장",
    nav_technology: "기술",
    nav_regions: "지역",
    nav_search: "검색",
    nav_live: "라이브",

    hero_eyebrow: "AI 기반 글로벌 인텔리전스",
    hero_title_1: "세상이 움직이고 있습니다.",
    hero_title_2: "HUMAYRO가 그 이유를 설명합니다.",
    hero_sub: "AI, 검증된 출처 및 글로벌 맥락 기반의 실시간 뉴스 인텔리전스.",
    hero_placeholder: "Humayro에게 무엇이든 물어보세요…",
    hero_analyze: "분석하기",
    hero_analyzing: "분석 중…",
    hero_trending: "인기 주제:",
    tab_uzbekistan: "우즈베키스탄",
    tab_global: "글로벌",

    signal_live: "라이브 시그널",
    signal_stream_active: "글로벌 인텔리전스 스트림 활성",
    signal_monitoring_247: "24/7 AI 모니터링",
    signal_label: "시그널",

    metrics_activity: "글로벌 활동",
    metrics_activity_sub: "24/7 글로벌 통신사 모니터링",
    metrics_analyzed: "AI 분석 완료",
    metrics_analyzed_sub: "팩트체크 및 합성 완료된 보고서",
    metrics_trending: "트렌딩 시그널",
    metrics_trending_sub: "상승 점수 85% 이상의 주요 시그널",

    map_eyebrow: "글로벌 모니터링 및 지역",
    map_title: "세계 인텔리전스 구체 및 레이더.",
    map_sub: "실시간 글로벌 피드, 대륙별 분석 및 도시 날씨 텔레메트리.",
    map_view_3d: "3D 구체",
    map_view_2d: "2D 사이버 레이더",
    map_select_region: "지역 선택:",
    map_region_intel: "지역 인텔리전스 센터",
    map_open_workspace: "전체 분석 워크스페이스",
    map_active_events: "주요 사건",
    map_debates: "대중 여론 논쟁",
    map_video_reports: "YouTube 영상 보고서",
    map_stats_facts: "지표 및 팩트",
    map_ask_ai: "AI 심층 분석",
    map_live_weather: "실시간 기상",

    feed_eyebrow: "라이브 인텔리전스",
    feed_title: "주목할 가치가 있는 시그널.",
    feed_all: "전체 뉴스",
    feed_uzbekistan: "우즈베키스탄",
    feed_world: "세계 및 외교",
    feed_technology: "기술 및 AI",
    feed_economy: "경제 및 금융",
    feed_science: "과학",
    feed_loading: "글로벌 통신사 피드 로딩 중…",
    feed_sync: "자동 새로고침:",
    feed_refresh_btn: "지금 새로고침",
    feed_refreshing: "새로고침 중…",

    card_verified: "검증됨",
    card_trending: "트렌딩",
    card_ai_analysis: "AI 분석",

    brief_eyebrow: "HUMAYRO AI 인텔리전스 브리프",
    brief_title: "헤드라인에서 심층 인텔리전스로.",
    brief_sub: "AI 기반의 다중 출처 검증, 대중 여론 및 역사적 유사성 분석.",
    brief_status_ready: "AI 합성 준비 완료",
    brief_autonomous: "자율 연구 모드",
    brief_empty_title: "관심 있는 주제를 입력하세요.",
    brief_empty_sub: "시스템이 실시간 뉴스를 분석하여 요약, 대중 여론 및 역사적 통찰을 제공합니다.",
    brief_top_signal: "최고 트렌드 시그널",
    brief_summary: "핵심 요약",
    brief_sentiment: "대중 반응 및 소셜 여론",
    brief_keypoints: "주요 동인 및 요인",
    brief_timeline: "사건 타임라인",
    brief_sources: "검증된 출처",
    brief_send: "보내기",
    brief_placeholder: "이 분석에 대해 추가 질문을 하거나 새로운 주제를 입력하세요…",

    reader_title: "인텔리전스 리더",
    reader_verified: "AI 검증 완료",
    reader_confidence: "신뢰도:",
    reader_keypoints: "핵심 시사점",
    reader_sources: "검증된 출처",
    reader_engine: "HUMAYRO 3.3 INTELLIGENCE ENGINE",

    bnav_home: "홈",
    bnav_signals: "시그널",
    bnav_ai: "AI",
    bnav_saved: "저장됨",
    bnav_profile: "프로필",

    time_just_now: "방금 전",
    time_min_ago: "분 전",
    time_hour_ago: "시간 전",
    time_day_ago: "일 전"
  },
  kk: {
    brand_name: "HUMAYRO",
    brand_sub: "ЖАҺАНДЫҚ ИНТЕЛЛЕКТ",
    nav_intelligence: "AI Талдау",
    nav_world: "Әлем",
    nav_markets: "Нарықтар",
    nav_technology: "Технология",
    nav_regions: "Аймақтар",
    nav_search: "Іздеу",
    nav_live: "ТІКЕЛЕЙ",

    hero_eyebrow: "AI НЕГІЗІНДЕГІ ЖАҺАНДЫҚ АҚПАРАТ ЖҮЙЕСІ",
    hero_title_1: "ӘЛЕМ ӨЗГЕРУДЕ.",
    hero_title_2: "HUMAYRO СЕБЕБІН ТҮСІНДІРЕДІ.",
    hero_sub: "Тексерілген дереккөздер мен AI талдауы бар нақты уақыттағы жаңалықтар инсайты.",
    hero_placeholder: "Humayro-дан кез келген тақырып бойынша сұраңыз…",
    hero_analyze: "Талдау",
    hero_analyzing: "Талдануда…",
    hero_trending: "Трендте:",
    tab_uzbekistan: "Өзбекстан",
    tab_global: "Әлем",

    signal_live: "ТІКЕЛЕЙ СИГНАЛ",
    signal_stream_active: "Жаһандық ақпарат ағыны белсенді",
    signal_monitoring_247: "AI мониторинг 24/7",
    signal_label: "СИГНАЛ",

    metrics_activity: "ЖАҺАНДЫҚ БЕЛСЕНДІЛІК",
    metrics_activity_sub: "Халықаралық ақпарат агенттіктерін 24/7 бақылау",
    metrics_analyzed: "AI ТАЛДАҒАН",
    metrics_analyzed_sub: "Факт-чекинг пен синтезден өткен деректер",
    metrics_trending: "ӨЗЕКТІ СИГНАЛДАР",
    metrics_trending_sub: "Өсім көрсеткіші >85% қызу тақырыптар",

    map_eyebrow: "ЖАҺАНДЫҚ МОНИТОРИНГ ЖӘНЕ АЙМАҚТАР",
    map_title: "Әлемдік Интеллект Сферасы және Картасы.",
    map_sub: "Нақты уақыттағы жаһандық ленталар және қалалар ауа райы телеметриясы.",
    map_view_3d: "3D Сфера (Глобус)",
    map_view_2d: "2D Кибер Радар",
    map_select_region: "Аймақты таңдаңыз:",
    map_region_intel: "Аймақтық талдау орталығы",
    map_open_workspace: "Толық талдау терезесі",
    map_active_events: "Өзекті оқиғалар",
    map_debates: "Қоғамдық пікірлер",
    map_video_reports: "YouTube Бейне есептер",
    map_stats_facts: "Көрсеткіштер мен деректер",
    map_ask_ai: "AI арқылы терең талдау",
    map_live_weather: "Нақты уақыттағы ауа райы",

    feed_eyebrow: "ТІКЕЛЕЙ АҚПАРАТ АҒЫНЫ",
    feed_title: "Назар аударуға тұрарлық сигналдар.",
    feed_all: "Барлық жаңалықтар",
    feed_uzbekistan: "Өзбекстан",
    feed_world: "Әлем және дипломатия",
    feed_technology: "Технология және AI",
    feed_economy: "Экономика және қаржы",
    feed_science: "Ғылым",
    feed_loading: "Жаңалықтар жүктелуде…",
    feed_sync: "Автожаңарту:",
    feed_refresh_btn: "Қазір жаңарту",
    feed_refreshing: "Жаңаруда…",

    card_verified: "Тексерілген",
    card_trending: "Трендте",
    card_ai_analysis: "AI Талдауы",

    brief_eyebrow: "HUMAYRO AI ТАЛДАУ ЕСЕБІ",
    brief_title: "Тақырыптардан терең мағынаға.",
    brief_sub: "Жасанды интеллект арқылы тексерілген деректер мен тарихи параллельдер.",
    brief_status_ready: "AI СИНТЕЗІ ДАЙЫН",
    brief_autonomous: "АВТОНОМДЫ ЗЕРТТЕУ",
    brief_empty_title: "Талдау үшін сұрау енгізіңіз.",
    brief_empty_sub: "Жүйе нақты уақыттағы жаңалықтарды зерттеп, есеп ұсынады.",
    brief_top_signal: "НЕГІЗГІ ТРЕНД СИГНАЛЫ",
    brief_summary: "НЕГІЗГІ ТҮЙІН",
    brief_sentiment: "Қоғамдық көзқарас пен пікірлер",
    brief_keypoints: "НЕГІЗГІ ҚОЗҒАУШЫ КҮШТЕР",
    brief_timeline: "ОҚИҒАЛАР ХРОНОЛОГИЯСЫ",
    brief_sources: "ТЕКСЕРІЛГЕН ДЕРЕККӨЗДЕР",
    brief_send: "Жіберу",
    brief_placeholder: "Осы талдау бойынша қосымша сұрақ қойыңыз немесе жаңа тақырып жазыңыз…",

    reader_title: "ТАЛДАУ ОҚУЛЫҒЫ",
    reader_verified: "AI ТЕКСЕРГЕН СИГНАЛ",
    reader_confidence: "Сенімділік деңгейі:",
    reader_keypoints: "НЕГІЗГІ ТҰЖЫРЫМДАР",
    reader_sources: "ТЕКСЕРІЛГЕН ДЕРЕККӨЗДЕР",
    reader_engine: "HUMAYRO 3.3 INTELLIGENCE ENGINE",

    bnav_home: "Басты",
    bnav_signals: "Сигналдар",
    bnav_ai: "AI",
    bnav_saved: "Сақталған",
    bnav_profile: "Профиль",

    time_just_now: "жаңа ғана",
    time_min_ago: "мин. бұрын",
    time_hour_ago: "сағ. бұрын",
    time_day_ago: "күн бұрын"
  },
  ky: {
    brand_name: "HUMAYRO",
    brand_sub: "ГЛОБАЛДЫК ИНТЕЛЛЕКТ",
    nav_intelligence: "AI Анализ",
    nav_world: "Дүйнө",
    nav_markets: "Базарлар",
    nav_technology: "Технология",
    nav_regions: "Аймактар",
    nav_search: "Издөө",
    nav_live: "ТҮЗ ЭФИР",

    hero_eyebrow: "AI НЕГИЗИНДЕГИ ГЛОБАЛДЫК МААЛЫМАТ СИСТЕМАСЫ",
    hero_title_1: "ДҮЙНӨ ӨЗГӨРҮҮДӨ.",
    hero_title_2: "HUMAYRO СЕБЕБИН ТҮШҮНДҮРӨТ.",
    hero_sub: "Текшерилген булактар жана AI анализи бар реалдуу убакыттагы жаңылыктар.",
    hero_placeholder: "Humayro'дон каалаган тема боюнча сураңыз…",
    hero_analyze: "Анализдөө",
    hero_analyzing: "Анализделүүдө…",
    hero_trending: "Трендде:",
    tab_uzbekistan: "Өзбекстан",
    tab_global: "Дүйнө",

    signal_live: "ТҮЗ СИГНАЛ",
    signal_stream_active: "Глобалдык маалымат агымы жигердүү",
    signal_monitoring_247: "AI мониторинг 24/7",
    signal_label: "СИГНАЛ",

    metrics_activity: "ГЛОБАЛДЫК ЖАНДУУЛУК",
    metrics_activity_sub: "24/7 эл аралык агенттиктерге мониторинг",
    metrics_analyzed: "AI ТАЛДАГАН",
    metrics_analyzed_sub: "Текшерилген жана синтезделген маалыматтар",
    metrics_trending: "КҮЙГӨН СИГНАЛДАР",
    metrics_trending_sub: "Өсүү көрсөткүчү >85% болгон жаңылыктар",

    map_eyebrow: "ГЛОБАЛДЫК МОНИТОРИНГ ЖАНА АЙМАКТАР",
    map_title: "Дүйнөлүк Интеллект Сферасы жана Картасы.",
    map_sub: "Реалдуу убакыттагы глобалдык ленталар жана шаарлардын аба ырайы.",
    map_view_3d: "3D Сфера (Глобус)",
    map_view_2d: "2D Кибер Радар",
    map_select_region: "Аймакты тандаңыз:",
    map_region_intel: "Аймактык аналитикалык борбор",
    map_open_workspace: "Толук анализ терезеси",
    map_active_events: "Күнгөй окуялар",
    map_debates: "Коомдук талкуулар",
    map_video_reports: "YouTube Видео отчеттор",
    map_stats_facts: "Көрсөткүчтөр жана фактылар",
    map_ask_ai: "AI менен терең анализ",
    map_live_weather: "Реалдуу аба ырайы",

    feed_eyebrow: "ТҮЗ МААЛЫМАТ АГЫМЫ",
    feed_title: "Көңүл бурууга татыктуу сигналдар.",
    feed_all: "Бардык жаңылыктар",
    feed_uzbekistan: "Өзбекстан",
    feed_world: "Дүйнө жана дипломатия",
    feed_technology: "Технология жана AI",
    feed_economy: "Экономика жана каржы",
    feed_science: "Илим",
    feed_loading: "Жаңылыктар жүктөлүүдө…",
    feed_sync: "Авто жаңыртуу:",
    feed_refresh_btn: "Азыр жаңыртуу",
    feed_refreshing: "Жаңыланууда…",

    card_verified: "Текшерилген",
    card_trending: "Трендде",
    card_ai_analysis: "AI Анализи",

    brief_eyebrow: "HUMAYRO AI АНАЛИТИКАЛЫК ОТЧЕТУ",
    brief_title: "Аталыштардан терең маңызга.",
    brief_sub: "AI аркылуу булактарды текшерүү жана тарыхый салыштыруулар.",
    brief_status_ready: "AI СИНТЕЗИ ДАЯР",
    brief_autonomous: "АВТОНОМДУУ ИЗИЛДӨӨ",
    brief_empty_title: "Анализдөө үчүн суроо бериңиз.",
    brief_empty_sub: "Система жаңылыктарды изилдеп, так отчет даярдайт.",
    brief_top_signal: "НЕГИЗГИ ТРЕНД СИГНАЛЫ",
    brief_summary: "НЕГИЗГИ КОРУТУНДУ",
    brief_sentiment: "Коомдук пикир жана талкуулар",
    brief_keypoints: "НЕГИЗГИ ФАКТОРЛОР",
    brief_timeline: "ОКУЯЛАР ХРОНОЛОГИЯСЫ",
    brief_sources: "ТЕКШЕРИЛГЕН БУЛАКТАР",
    brief_send: "Жөнөтүү",
    brief_placeholder: "Бул анализ боюнча кошумча суроо бериңиз же жаңы тема киргизиңиз…",

    reader_title: "АНАЛИТИКАЛЫК ОКУУЧУ",
    reader_verified: "AI ТЕКШЕРГЕН СИГНАЛ",
    reader_confidence: "Ишеним деңгээли:",
    reader_keypoints: "НЕГИЗГИ ТЫЯНАКТАР",
    reader_sources: "ТЕКШЕРИЛГЕН БУЛАКТАР",
    reader_engine: "HUMAYRO 3.3 INTELLIGENCE ENGINE",

    bnav_home: "Башкы",
    bnav_signals: "Сигналдар",
    bnav_ai: "AI",
    bnav_saved: "Сакталган",
    bnav_profile: "Профиль",

    time_just_now: "жаңы эле",
    time_min_ago: "мүн. мурун",
    time_hour_ago: "саат мурун",
    time_day_ago: "күн мурун"
  },
  tg: {
    brand_name: "HUMAYRO",
    brand_sub: "ИНТЕЛЛЕКТИ ГЛОБАЛӢ",
    nav_intelligence: "Таҳлили AI",
    nav_world: "Ҷаҳон",
    nav_markets: "Бозорҳо",
    nav_technology: "Технология",
    nav_regions: "Минтақаҳо",
    nav_search: "Ҷустуҷӯ",
    nav_live: "МУСТАҚИМ",

    hero_eyebrow: "НИЗОМИ ИТТИЛООТИИ ГЛОБАЛИИ AI",
    hero_title_1: "ҶАҲОН ДАР ҲОЛИ ТАҒЙИР АСТ.",
    hero_title_2: "HUMAYRO САБАБРО ШАРҲ МЕДИҲАД.",
    hero_sub: "Иктишофи хабарии вақти воқеӣ бо манбаъҳои тасдиқшуда ва таҳлили AI.",
    hero_placeholder: "Аз Humayro дар бораи ҳар мавзӯъ бипурсед…",
    hero_analyze: "Таҳлил кардан",
    hero_analyzing: "Дар ҳоли таҳлил…",
    hero_trending: "Дар тренд:",
    tab_uzbekistan: "Ӯзбекистон",
    tab_global: "Ҷаҳон",

    signal_live: "СИГНАЛИ ЗИНДА",
    signal_stream_active: "Ҷараёни иттилооти глобалӣ фаъол",
    signal_monitoring_247: "Мониторинги AI 24/7",
    signal_label: "СИГНАЛ",

    metrics_activity: "ФАЪОЛИЯТИ ГЛОБАЛӢ",
    metrics_activity_sub: "Мониторинги 24/7 агентиҳои иттилоотии ҷаҳон",
    metrics_analyzed: "ТАҲЛИЛШУДА БО AI",
    metrics_analyzed_sub: "Ҳисоботҳои санҷидашуда ва синтезшуда",
    metrics_trending: "СИГНАЛҲОИ ДОҒ",
    metrics_trending_sub: "Мавзӯъҳо бо нишондиҳандаи рушд >85%",

    map_eyebrow: "МОНИТОРИНГИ ГЛОБАЛӢ ВА МИНТАҚАҲО",
    map_title: "Сфера ва харитаи зеҳни ҷаҳонӣ.",
    map_sub: "Наворҳои вақти воқеӣ, таҳлили қитъаҳо ва обу ҳавои шаҳрҳо.",
    map_view_3d: "3D Сфера (Глобус)",
    map_view_2d: "2D Кибер Радар",
    map_select_region: "Минтақаро интихоб кунед:",
    map_region_intel: "Маркази таҳлилии минтақавӣ",
    map_open_workspace: "Равзанаи пурраи таҳлил",
    map_active_events: "Рӯйдодҳои фаъол",
    map_debates: "Баҳсҳои ҷамъиятӣ",
    map_video_reports: "YouTube Ҳисоботи видеоӣ",
    map_stats_facts: "Нишондиҳандаҳо ва далелҳо",
    map_ask_ai: "Таҳлили амиқ бо AI",
    map_live_weather: "Обу ҳавои зинда",

    feed_eyebrow: "ҶАРАЁНИ ЗИНДАИ ХАБАРҲО",
    feed_title: "Сигналҳои арзишманд барои фаҳмидан.",
    feed_all: "Ҳамаи хабарҳо",
    feed_uzbekistan: "Ӯзбекистон",
    feed_world: "Ҷаҳон ва дипломатия",
    feed_technology: "Технология ва AI",
    feed_economy: "Иқтисод ва молия",
    feed_science: "Илм",
    feed_loading: "Дарёфти хабарҳо аз агентиҳо…",
    feed_sync: "Навсозии худкор:",
    feed_refresh_btn: "Ҳозир нав кардан",
    feed_refreshing: "Навсозӣ…",

    card_verified: "Тасдиқшуда",
    card_trending: "Дар тренд",
    card_ai_analysis: "Таҳлили AI",

    brief_eyebrow: "ҲИСОБОТИ ТАҲЛИЛИИ HUMAYRO AI",
    brief_title: "Аз сарлавҳаҳо то дарки амиқ.",
    brief_sub: "Тафтиши сарчашмаҳо ва параллелҳои таърихӣ бо зеҳни сунъӣ.",
    brief_status_ready: "СИНТЕЗИ AI ОМОДА АСТ",
    brief_autonomous: "ТАДҚИҚОТИ МУСТАҚИЛ",
    brief_empty_title: "Барои таҳлил мавзӯъро ворид кунед.",
    brief_empty_sub: "Система хабарҳоро омӯхта, ҳисоботи муфассал медиҳад.",
    brief_top_signal: "СИГНАЛИ АСОСИИ ТРЕНД",
    brief_summary: "ХУЛОСАИ АСОСӢ",
    brief_sentiment: "Муносибати ҷомеа ва баҳсҳо",
    brief_keypoints: "ОМИЛҲОИ КАЛИДӢ",
    brief_timeline: "ХРОНОЛОГИЯИ РӮЙДОДҲО",
    brief_sources: "САРЧАШМАҲОИ ТАСДИҚШУДА",
    brief_send: "Фиристодан",
    brief_placeholder: "Дар бораи ин таҳлил савол диҳед ё мавзӯи нав нависед…",

    reader_title: "ХОНАНДАИ ТАҲЛИЛӢ",
    reader_verified: "СИГНАЛИ ТАСДИҚШУДАИ AI",
    reader_confidence: "Боварии модел:",
    reader_keypoints: "ХУЛОСАҲОИ МУҲИМ",
    reader_sources: "САРЧАШМАҲОИ ТАСДИҚШУДА",
    reader_engine: "HUMAYRO 3.3 INTELLIGENCE ENGINE",

    bnav_home: "Асосӣ",
    bnav_signals: "Сигналҳо",
    bnav_ai: "AI",
    bnav_saved: "Захирашуда",
    bnav_profile: "Профил",

    time_just_now: "ҳоло",
    time_min_ago: "дақ. пеш",
    time_hour_ago: "соат пеш",
    time_day_ago: "рӯз пеш"
  },
  tk: {
    brand_name: "HUMAYRO",
    brand_sub: "GLOBAL INTELLEKT",
    nav_intelligence: "AI Seljerme",
    nav_world: "Dünýä",
    nav_markets: "Bazarlar",
    nav_technology: "Tehnologiýa",
    nav_regions: "Sebitler",
    nav_search: "Gözleg",
    nav_live: "GÖNI",

    hero_eyebrow: "AI ESASYNDA GLOBAL MAGLUMAT ULGAMY",
    hero_title_1: "DÜNÝÄ ÜÝTGEYÄR.",
    hero_title_2: "HUMAYRO SEBÄBINI DÜŞÜNDIRÝÄR.",
    hero_sub: "Barlanylan çeşmeler we AI seljermesi bilen hakyky wagt habar intellekti.",
    hero_placeholder: "Humayro-dan islendik mowzuk barada soraň…",
    hero_analyze: "Seljermek",
    hero_analyzing: "Seljerilýär…",
    hero_trending: "Trendde:",
    tab_uzbekistan: "Özbegistan",
    tab_global: "Dünýä",

    signal_live: "GÖNI SIGNAL",
    signal_stream_active: "Global maglumat akymy işjeň",
    signal_monitoring_247: "AI gözegçilik 24/7",
    signal_label: "SIGNAL",

    metrics_activity: "GLOBAL IŞJEŇLIK",
    metrics_activity_sub: "24/7 halkara habar agentliklerine gözegçilik",
    metrics_analyzed: "AI TARAPYNDAN SELJERILEN",
    metrics_analyzed_sub: "Barlanylan we jemlenen maglumatlar",
    metrics_trending: "GYZGYN SIGNALLAR",
    metrics_trending_sub: "Ösüş derejesi >85% bolan mowzuklar",

    map_eyebrow: "GLOBAL GÖZEGÇILIK WE SEBITLER",
    map_title: "Dünýä Intellekt Sferasy we Kartasy.",
    map_sub: "Hakyky wagt dünýä habarlary we şäher howa maglumatlary.",
    map_view_3d: "3D Sfera (Globus)",
    map_view_2d: "2D Kiber Radar",
    map_select_region: "Sebiti saýlaň:",
    map_region_intel: "Sebitleýin seljerme merkezi",
    map_open_workspace: "Doly seljerme penjiresi",
    map_active_events: "Işjeň wakalar",
    map_debates: "Jemgyýetçilik çekişmeleri",
    map_video_reports: "YouTube Wideo hasabatlar",
    map_stats_facts: "Görkezijiler we deliller",
    map_ask_ai: "AI bilen çuňňur seljerme",
    map_live_weather: "Göni howa maglumaty",

    feed_eyebrow: "GÖNI HABAR AKYMY",
    feed_title: "Üns bermäge mynasyp signallar.",
    feed_all: "Ähli habarlar",
    feed_uzbekistan: "Özbegistan",
    feed_world: "Dünýä we diplomatiýa",
    feed_technology: "Tehnologiýa we AI",
    feed_economy: "Ykdysadyýet we maliýe",
    feed_science: "Ylym",
    feed_loading: "Habarlar ýüklenýär…",
    feed_sync: "Awtomatiki täzelenme:",
    feed_refresh_btn: "Häzir täzele",
    feed_refreshing: "Täzelenýär…",

    card_verified: "Barlanylan",
    card_trending: "Trendde",
    card_ai_analysis: "AI Seljermesi",

    brief_eyebrow: "HUMAYRO AI SELJERME HASABATY",
    brief_title: "Sözbaşylardan çuňňur manysyna.",
    brief_sub: "AI arkaly çeşmeleri barlamak we taryhy meňzeşlikler.",
    brief_status_ready: "AI SINTEZI TAÝÝAR",
    brief_autonomous: "GARAŞSYZ BARLAG",
    brief_empty_title: "Seljermek üçin mowzuk giriziň.",
    brief_empty_sub: "Ulgam habarlary öwrenip, hasabat taýýarlaýar.",
    brief_top_signal: "ESASY TREND SIGNALY",
    brief_summary: "ESASY JEMLEME",
    brief_sentiment: "Jemgyýetçilik garaýşy",
    brief_keypoints: "ESASY SEBÄPLER WE FAKTORLAR",
    brief_timeline: "WAKALARYŇ TARYHY",
    brief_sources: "BARLANYLAN ÇEŞMELER",
    brief_send: "Ugrat",
    brief_placeholder: "Bu seljerme barada sorag beriň ýa-da täze mowzuk ýazyň…",

    reader_title: "SELJERME OKYJYSY",
    reader_verified: "AI BARLANAN SIGNAL",
    reader_confidence: "Ynam derejesi:",
    reader_keypoints: "ESASY NETIJELER",
    reader_sources: "BARLANYLAN ÇEŞMELER",
    reader_engine: "HUMAYRO 3.3 INTELLIGENCE ENGINE",

    bnav_home: "Baş sahypa",
    bnav_signals: "Signallar",
    bnav_ai: "AI",
    bnav_saved: "Ýatda saklanan",
    bnav_profile: "Profil",

    time_just_now: "ýaňyja",
    time_min_ago: "min. öň",
    time_hour_ago: "sagat öň",
    time_day_ago: "gün öň"
  },
  az: {
    brand_name: "HUMAYRO",
    brand_sub: "QƏLƏBƏLİK İNTELLEKT",
    nav_intelligence: "AI Analizi",
    nav_world: "Dünya",
    nav_markets: "Bazarlar",
    nav_technology: "Texnologiya",
    nav_regions: "Regionlar",
    nav_search: "Axtarış",
    nav_live: "CANLI",

    hero_eyebrow: "AI ƏSASLI QLOBAL MƏLUMAT SİSTEMİ",
    hero_title_1: "DÜNYA DƏYİŞİR.",
    hero_title_2: "HUMAYRO SƏBƏBİNİ İZAH EDİR.",
    hero_sub: "Yoxlanılmış mənbələr, AI sintezi və qlobal kontekstlə real vaxt xəbər intellekti.",
    hero_placeholder: "Humayro-dan hər hansı mövzu barədə soruşun…",
    hero_analyze: "Analiz et",
    hero_analyzing: "Analiz edilir…",
    hero_trending: "Trenddə:",
    tab_uzbekistan: "Özbəkistan",
    tab_global: "Qlobal",

    signal_live: "CANLI SİQNAL",
    signal_stream_active: "Qlobal məlumat axını aktivdir",
    signal_monitoring_247: "AI monitorinqi 24/7",
    signal_label: "SİQNAL",

    metrics_activity: "QƏLƏBƏLİK FƏALLIQ",
    metrics_activity_sub: "24/7 beynəlxalq xəbər agentliklərinin monitorinqi",
    metrics_analyzed: "AI TƏRƏFİNDƏN ANALİZ EDİLƏN",
    metrics_analyzed_sub: "Fakt-yoxlama və sintezdən keçmiş məlumatlar",
    metrics_trending: "QAYNAR SİQNALLAR",
    metrics_trending_sub: "Artım göstəricisi >85% olan aktual mövzular",

    map_eyebrow: "QƏLƏBƏLİK MONİTORİNQ VƏ REGİONLAR",
    map_title: "Dünya İntellekt Sferası və Xəritəsi.",
    map_sub: "Real vaxt rejimində qlobal xəbərlər və şəhər hava məlumatları.",
    map_view_3d: "3D Sfera (Qlobus)",
    map_view_2d: "2D Kiber Radar",
    map_select_region: "Regionu seçin:",
    map_region_intel: "Regional analiz mərkəzi",
    map_open_workspace: "Tam analiz pəncərəsi",
    map_active_events: "Qaynar hadisələr",
    map_debates: "İctimai müzakirələr",
    map_video_reports: "YouTube Video hesabatlar",
    map_stats_facts: "Göstəricilər və faktlar",
    map_ask_ai: "AI ilə dərindən analiz",
    map_live_weather: "Real vaxt havası",

    feed_eyebrow: "CANLI XƏBƏR AXINI",
    feed_title: "Diqqətəlayiq siqnallar.",
    feed_all: "Bütün xəbərlər",
    feed_uzbekistan: "Özbəkistan",
    feed_world: "Dünya və diplomatiya",
    feed_technology: "Texnologiya və AI",
    feed_economy: "İqtisadiyyat və maliyyə",
    feed_science: "Elm",
    feed_loading: "Xəbərlər yüklənir…",
    feed_sync: "Avtomatik yenilənmə:",
    feed_refresh_btn: "İndi yenilə",
    feed_refreshing: "Yenilənir…",

    card_verified: "Təsdiqlənmiş",
    card_trending: "Trenddə",
    card_ai_analysis: "AI Analizi",

    brief_eyebrow: "HUMAYRO AI ANALİTİK HESABATI",
    brief_title: "Başlıqlardan dərin mənaya.",
    brief_sub: "Süni intellektlə mənbələrin yoxlanılması və tarixi paralellər.",
    brief_status_ready: "AI SİNTEZİ HAZIRDIR",
    brief_autonomous: "MÜSTƏQİL TƏDQİQAT",
    brief_empty_title: "Analiz üçün mövzu daxil edin.",
    brief_empty_sub: "Sistem xəbərləri araşdıraraq dolğun hesabat təqdim edəcək.",
    brief_top_signal: "ƏSAS TREND SİQNALI",
    brief_summary: "ƏSAS XÜLASƏ",
    brief_sentiment: "İctimai münasibət və müzakirələr",
    brief_keypoints: "ƏSAS AMİLLƏR VƏ FAKTORLAR",
    brief_timeline: "HADİSƏLƏRİN XRONOLOGİYASI",
    brief_sources: "TƏSDİQLƏNMİŞ MƏNBƏLƏR",
    brief_send: "Göndər",
    brief_placeholder: "Bu analiz üzrə əlavə sual verin və ya yeni mövzu yazın…",

    reader_title: "ANALİTİK OXUCU",
    reader_verified: "AI TƏSDİQLİ SİQNAL",
    reader_confidence: "İnam dərəcəsi:",
    reader_keypoints: "ƏSAS NƏTİCƏLƏR",
    reader_sources: "TƏSDİQLƏNMİŞ MƏNBƏLƏR",
    reader_engine: "HUMAYRO 3.3 INTELLIGENCE ENGINE",

    bnav_home: "Ana səhifə",
    bnav_signals: "Siqnallar",
    bnav_ai: "AI",
    bnav_saved: "Saxlanılanlar",
    bnav_profile: "Profil",

    time_just_now: "indicə",
    time_min_ago: "dəq. əvvəl",
    time_hour_ago: "saat əvvəl",
    time_day_ago: "gün əvvəl"
  },
  tr: {
    brand_name: "HUMAYRO",
    brand_sub: "KÜRESEL İSTİHBARAT",
    nav_intelligence: "Yapay Zeka",
    nav_world: "Dünya",
    nav_markets: "Piyasalar",
    nav_technology: "Teknoloji",
    nav_regions: "Bölgeler",
    nav_search: "Arama",
    nav_live: "CANLI",

    hero_eyebrow: "YAPAY ZEKA DESTEKLİ KÜRESEL İSTİHBARAT",
    hero_title_1: "DÜNYA DEĞİŞİYOR.",
    hero_title_2: "HUMAYRO NEDENİNİ AÇIKLIYOR.",
    hero_sub: "Doğrulanmış kaynaklar, yapay zeka sentezi ve küresel bağlamla gerçek zamanlı haber istihbaratı.",
    hero_placeholder: "Humayro'ya herhangi bir konuyu sorun…",
    hero_analyze: "Analiz Et",
    hero_analyzing: "Analiz ediliyor…",
    hero_trending: "Gündemde:",
    tab_uzbekistan: "Özbekistan",
    tab_global: "Küresel",

    signal_live: "CANLI SİNYAL",
    signal_stream_active: "Küresel istihbarat akışı aktif",
    signal_monitoring_247: "7/24 Yapay Zeka Takibi",
    signal_label: "SİNYAL",

    metrics_activity: "KÜRESEL AKTİVİTE",
    metrics_activity_sub: "7/24 küresel haber ajansı izleme",
    metrics_analyzed: "YAPAY ZEKA ANALİZİ",
    metrics_analyzed_sub: "Doğrulanmış ve sentezlenmiş raporlar",
    metrics_trending: "SICAK SİNYALLER",
    metrics_trending_sub: "Büyüme skoru >%85 olan sıcak konular",

    map_eyebrow: "KÜRESEL İZLEME VE BÖLGELER",
    map_title: "Dünya İstihbarat Küresi ve Radarı.",
    map_sub: "Gerçek zamanlı küresel akışlar, kıtasal analiz ve şehir hava durumu telemetrisi.",
    map_view_3d: "3D Küre (Glob)",
    map_view_2d: "2D Siber Radar",
    map_select_region: "Bölge Seçin:",
    map_region_intel: "Bölgesel İstihbarat Merkezi",
    map_open_workspace: "Tam Analiz Alanı",
    map_active_events: "Aktif Olaylar",
    map_debates: "Kamuoyu Tartışmaları",
    map_video_reports: "YouTube Video Raporları",
    map_stats_facts: "Göstergeler ve Olgular",
    map_ask_ai: "AI ile Derin Analiz",
    map_live_weather: "Canlı Hava Durumu",

    feed_eyebrow: "CANLI İSTİHBARAT AKIŞI",
    feed_title: "Anlaşılmaya değer sinyaller.",
    feed_all: "Tüm Haberler",
    feed_uzbekistan: "Özbekistan",
    feed_world: "Dünya ve Diplomasi",
    feed_technology: "Teknoloji ve AI",
    feed_economy: "Ekonomi ve Piyasalar",
    feed_science: "Bilim",
    feed_loading: "Küresel ajanslardan haberler alınıyor…",
    feed_sync: "Otomatik yenileme:",
    feed_refresh_btn: "Şimdi Yenile",
    feed_refreshing: "Yenileniyor…",

    card_verified: "Doğrulandı",
    card_trending: "Gündemde",
    card_ai_analysis: "Yapay Zeka Analizi",

    brief_eyebrow: "HUMAYRO AI İSTİHBARAT RAPORU",
    brief_title: "Manşetlerden derin kavrayışa.",
    brief_sub: "Yapay zeka ile çok kaynaklı doğrulama, kamuoyu duyarlılığı ve tarihsel paralellikler.",
    brief_status_ready: "AI SENTEZİ HAZIR",
    brief_autonomous: "OTONOM ARAŞTIRMA",
    brief_empty_title: "Analiz etmek istediğiniz konuyu girin.",
    brief_empty_sub: "Sistem gerçek zamanlı haberleri inceleyerek zaman çizelgesi ve tarihsel içgörüler içeren bir rapor sunar.",
    brief_top_signal: "EN SICAK TREND SİNYALİ",
    brief_summary: "YÖNETİCİ ÖZETİ",
    brief_sentiment: "Kamuoyu Duyarlılığı ve Tartışmalar",
    brief_keypoints: "ANA İTİCİ GÜÇLER VE FAKTÖRLER",
    brief_timeline: "OLAYLAR ZAMAN ÇİZELGESİ",
    brief_sources: "DOĞRULANMIŞ KAYNAKLAR",
    brief_send: "Gönder",
    brief_placeholder: "Bu analiz hakkında ek soru sorun veya yeni konu girin…",

    reader_title: "İSTİHBARAT OKUYUCUSU",
    reader_verified: "AI DOĞRULANMIŞ SİNYAL",
    reader_confidence: "Model Güveni:",
    reader_keypoints: "ÖNEMLİ ÇIKARIMLAR",
    reader_sources: "DOĞRULANMIŞ KAYNAKLAR",
    reader_engine: "HUMAYRO 3.3 INTELLIGENCE ENGINE",

    bnav_home: "Ana Sayfa",
    bnav_signals: "Sinyaller",
    bnav_ai: "AI",
    bnav_saved: "Kaydedilenler",
    bnav_profile: "Profil",

    time_just_now: "az önce",
    time_min_ago: "dk önce",
    time_hour_ago: "saat önce",
    time_day_ago: "gün önce"
  },
  ar: {
    brand_name: "HUMAYRO",
    brand_sub: "الذكاء العالمي",
    nav_intelligence: "تحليل الذكاء",
    nav_world: "العالم",
    nav_markets: "الأسواق",
    nav_technology: "التكنولوجيا",
    nav_regions: "المناطق",
    nav_search: "بحث",
    nav_live: "مباشر",

    hero_eyebrow: "منظومة الاستخبارات العالمية بالذكاء الاصطناعي",
    hero_title_1: "العالم يتغير باستمرار.",
    hero_title_2: "HUMAYRO يشرح لك الأسباب.",
    hero_sub: "استخبارات إخبارية فورية مدعومة بمصادر موثوقة وتحليل متقدم بالذكاء الاصطناعي.",
    hero_placeholder: "اسأل Humayro عن أي موضوع…",
    hero_analyze: "تحليل",
    hero_analyzing: "جار التحليل…",
    hero_trending: "الموضوعات الرائجة:",
    tab_uzbekistan: "أوزبكستان",
    tab_global: "العالم",

    signal_live: "إشارة حية",
    signal_stream_active: "بث الاستخبارات العالمية نشط",
    signal_monitoring_247: "مراقبة ذكية 24/7",
    signal_label: "إشارة",

    metrics_activity: "النشاط العالمي",
    metrics_activity_sub: "مراقبة وكالات الأنباء الدولية على مدار الساعة",
    metrics_analyzed: "تم التحليل بالذكاء",
    metrics_analyzed_sub: "تقارير تم التحقق منها وتلخيصها بدقة",
    metrics_trending: "الإشارات المتصاعدة",
    metrics_trending_sub: "موضوعات ساخنة بنسبة صعود >85%",

    map_eyebrow: "المراقبة العالمية والمناطق",
    map_title: "مجال ورادار الاستخبارات العالمية.",
    map_sub: "بث إخباري فوري وتحليل للقارات ورصد طقس المدن.",
    map_view_3d: "مجسم 3D",
    map_view_2d: "رادار سيبراني 2D",
    map_select_region: "اختر المنطقة:",
    map_region_intel: "مركز الاستخبارات الإقليمي",
    map_open_workspace: "مساحة التحليل الشاملة",
    map_active_events: "الأحداث الجارية",
    map_debates: "النقاشات العامة",
    map_video_reports: "تقارير يوتيوب المصورة",
    map_stats_facts: "المؤشرات والحقائق",
    map_ask_ai: "تحليل معمق بالذكاء",
    map_live_weather: "الطقس المباشر",

    feed_eyebrow: "بث الاستخبارات المباشر",
    feed_title: "إشارات تستحق الفهم.",
    feed_all: "جميع الأخبار",
    feed_uzbekistan: "أوزبكستان",
    feed_world: "العالم والدبلوماسية",
    feed_technology: "التكنولوجيا والذكاء",
    feed_economy: "الاقتصاد والأسواق",
    feed_science: "العلوم",
    feed_loading: "جار جلب الأخبار من الوكالات العالمية…",
    feed_sync: "تحديث تلقائي بعد:",
    feed_refresh_btn: "تحديث الآن",
    feed_refreshing: "جار التحديث…",

    card_verified: "موثق",
    card_trending: "رائج",
    card_ai_analysis: "تحليل AI",

    brief_eyebrow: "تقرير HUMAYRO AI التحليلي",
    brief_title: "من العناوين إلى الفهم العميق.",
    brief_sub: "تحقق متعدد المصادر، نبض الرأي العام ومقارنات تاريخية بالذكاء الاصطناعي.",
    brief_status_ready: "التقرير التحليلي جاهز",
    brief_autonomous: "بحث ذاتي مستقل",
    brief_empty_title: "أدخل أي موضوع للتحليل الفوري.",
    brief_empty_sub: "يقوم النظام بمراجعة الأخبار الدولية وإعداد ملخص تنفيذي دقيق.",
    brief_top_signal: "أبرز إشارة رائجة",
    brief_summary: "الملخص التنفيذي",
    brief_sentiment: "نبض الرأي العام والنقاشات",
    brief_keypoints: "المحركات والدوافع الأساسية",
    brief_timeline: "الجدول الزمني للأحداث",
    brief_sources: "المصادر الموثقة",
    brief_send: "إرسال",
    brief_placeholder: "اطرح سؤالاً إضافياً حول هذا التحليل أو أدخل موضوعاً جديداً…",

    reader_title: "القارئ الاستخباري",
    reader_verified: "إشارة موثقة بالذكاء",
    reader_confidence: "نسبة الثقة:",
    reader_keypoints: "النقاط الجوهرية",
    reader_sources: "المصادر المعتمدة",
    reader_engine: "HUMAYRO 3.3 INTELLIGENCE ENGINE",

    bnav_home: "الرئيسية",
    bnav_signals: "الإشارات",
    bnav_ai: "الذكاء",
    bnav_saved: "المحفوظات",
    bnav_profile: "الملف",

    time_just_now: "الآن",
    time_min_ago: "دقيقة مضت",
    time_hour_ago: "ساعة مضت",
    time_day_ago: "يوم مضى"
  },
  fa: {
    brand_name: "HUMAYRO",
    brand_sub: "اطلاعات جهانی",
    nav_intelligence: "تحلیل هوش مصنوعی",
    nav_world: "جهان",
    nav_markets: "بازارها",
    nav_technology: "فناوری",
    nav_regions: "مناطق",
    nav_search: "جستجو",
    nav_live: "زنده",

    hero_eyebrow: "سیستم هوشمند اخبار جهانی مبتنی بر هوش مصنوعی",
    hero_title_1: "جهان در حال تغییر است.",
    hero_title_2: "HUMAYRO دلایل آن را توضیح می‌دهد.",
    hero_sub: "بینش خبری لحظه‌ای با تکیه بر منابع معتبر و تحلیل هوشمند داده‌ها.",
    hero_placeholder: "از Humayro درباره هر موضوعی بپرسید…",
    hero_analyze: "تحلیل",
    hero_analyzing: "در حال تحلیل…",
    hero_trending: "موضوعات داغ:",
    tab_uzbekistan: "ازبکستان",
    tab_global: "جهان",

    signal_live: "سیگنال زنده",
    signal_stream_active: "جریان اخبار جهانی فعال است",
    signal_monitoring_247: "پایش هوشمند 24/7",
    signal_label: "سیگنال",

    metrics_activity: "فعالیت جهانی",
    metrics_activity_sub: "پایش 24 ساعته خبرگزاری‌های بین‌المللی",
    metrics_analyzed: "تحلیل شده با هوش مصنوعی",
    metrics_analyzed_sub: "گزارش‌های راستی‌آزمایی شده و دقیق",
    metrics_trending: "سیگنال‌های داغ",
    metrics_trending_sub: "رویدادهایی با ضریب رشد >85%",

    map_eyebrow: "پایش جهانی و منطقه‌ای",
    map_title: "کره و رادار اطلاعات جهانی.",
    map_sub: "جریان لحظه‌ای اخبار، تحلیل قاره‌ها و تله‌متری آب و هوای شهرها.",
    map_view_3d: "کره 3D",
    map_view_2d: "رادار سایبری 2D",
    map_select_region: "منطقه را انتخاب کنید:",
    map_region_intel: "مرکز تحلیل منطقه‌ای",
    map_open_workspace: "میزکار تحلیل کامل",
    map_active_events: "رویدادهای جاری",
    map_debates: "مباحث افکار عمومی",
    map_video_reports: "گزارش‌های ویدیویی یوتیوب",
    map_stats_facts: "شاخص‌ها و واقعیت‌ها",
    map_ask_ai: "تحلیل عمیق با هوش مصنوعی",
    map_live_weather: "آب و هوای زنده",

    feed_eyebrow: "جریان زنده اخبار",
    feed_title: "سیگنال‌های قابل درک و مهم.",
    feed_all: "همه اخبار",
    feed_uzbekistan: "ازبکستان",
    feed_world: "جهان و دیپلماسی",
    feed_technology: "فناوری و هوش مصنوعی",
    feed_economy: "اقتصاد و بازارها",
    feed_science: "علم و دانش",
    feed_loading: "در حال بارگیری اخبار بین‌المللی…",
    feed_sync: "به‌روزرسانی خودکار در:",
    feed_refresh_btn: "اکنون به‌روزرسانی کن",
    feed_refreshing: "در حال به‌روزرسانی…",

    card_verified: "تایید شده",
    card_trending: "داغ",
    card_ai_analysis: "تحلیل AI",

    brief_eyebrow: "گزارش تحلیلی HUMAYRO AI",
    brief_title: "از تیترها تا درک عمیق.",
    brief_sub: "راستی‌آزمایی چندمنبعی، بازخورد افکار عمومی و تطبیق تاریخی با هوش مصنوعی.",
    brief_status_ready: "تحلیل آماده است",
    brief_autonomous: "پژوهش خودکار",
    brief_empty_title: "موضوعی را برای تحلیل وارد کنید.",
    brief_empty_sub: "سیستم اخبار لحظه‌ای را بررسی کرده و گزارش تحلیلی جامعی ارائه می‌دهد.",
    brief_top_signal: "سیگنال اصلی ترند",
    brief_summary: "خلاصه اجرایی",
    brief_sentiment: "افکار عمومی و واکنش‌ها",
    brief_keypoints: "عوامل و محرک‌های اصلی",
    brief_timeline: "گاه‌شمار رویدادها",
    brief_sources: "منابع تایید شده",
    brief_send: "ارسال",
    brief_placeholder: "سوالی در مورد این تحلیل بپرسید یا موضوع جدیدی وارد کنید…",

    reader_title: "خواننده تحلیلی",
    reader_verified: "سیگنال تایید شده AI",
    reader_confidence: "میزان اطمینان:",
    reader_keypoints: "نکات کلیدی",
    reader_sources: "منابع معتبر",
    reader_engine: "HUMAYRO 3.3 INTELLIGENCE ENGINE",

    bnav_home: "خانه",
    bnav_signals: "سیگنال‌ها",
    bnav_ai: "هوش مصنوعی",
    bnav_saved: "ذخیره‌شده‌ها",
    bnav_profile: "پروفایل",

    time_just_now: "همین الان",
    time_min_ago: "دقیقه پیش",
    time_hour_ago: "ساعت پیش",
    time_day_ago: "روز پیش"
  }
};

export function getUiText(lang: SupportedLanguage = 'uz'): UiDictionary {
  return UI_TEXT[lang] || UI_TEXT.uz;
}

export function formatTimeAgoLocale(dateStr?: string, lang: SupportedLanguage = 'uz'): string {
  if (!dateStr) return UI_TEXT[lang]?.time_just_now || 'hozirgina';
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000));
  const diffMin = Math.floor(diffSec / 60);
  const t = UI_TEXT[lang] || UI_TEXT.uz;

  if (diffMin < 2) return t.time_just_now;
  if (diffMin < 60) return `${diffMin} ${t.time_min_ago}`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} ${t.time_hour_ago}`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} ${t.time_day_ago}`;
}
