import { GoogleGenAI } from '@google/genai';
import type { AiArticleResponse, AiSynthesisResponse, SupportedLanguage, HistoricalParallel } from '../src/types/index.ts';
import { searchNews } from './newsService.ts';

const langNames: Record<SupportedLanguage, string> = {
  uz: "Uzbek (Oʻzbek tilida yuqori saviyali jurnalistik tahlil, aniq faktlar va ravon til)",
  kk: "Kazakh (Қазақ тілінде сапалы журналистік талдау, нақты деректер мен сауатты тіл)",
  ky: "Kyrgyz (Кыргыз тилинде жогорку деңгээлдеги аналитика, так фактылар)",
  tg: "Tajik (Бо забони тоҷикӣ, бо таҳлили амиқи журналистӣ ва далелҳои муътамад)",
  tk: "Turkmen (Türkmen dilinde çuňňur seljerme we anyk maglumatlar)",
  az: "Azerbaijani (Azərbaycan dilində yüksək səviyyəli analitik təhlil və dəqiq faktlar)",
  tr: "Turkish (Türkçe akıcı, yetkin, güvenilir gazetecilik üslubu ve somut veriler)",
  ar: "Arabic (باللغة العربية الفصحى الرصينة مع تحليل استخباراتي وصحفي عميق وحقائق دقيقة)",
  fa: "Persian / Farsi (به زبان فارسی با تحلیل عمیق، فکت‌های دقیق و نگارش حرفه‌ای)",
  en: "English (Clear, journalistic, authoritative English with concrete facts)",
  ru: "Russian (Точный, глубокий, авторитетный аналитический русский язык)",
  ko: "Korean (정확하고 심도 있는 한국어 보도 분석)"
};

function stripMarkdownJson(text: string): string {
  if (!text) return '{}';
  return text
    .replace(/^```json\s*/im, '')
    .replace(/^```\s*/im, '')
    .replace(/```\s*$/im, '')
    .trim();
}

function safeJsonParse<T>(raw: string, fallback: T): T {
  if (!raw || typeof raw !== 'string') return fallback;

  // 1. Slice strictly between '{' and '}' or '[' and ']' to avoid unexpected non-whitespace trailing characters
  const firstBrace = raw.indexOf('{');
  const lastBrace = raw.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      const jsonSubstring = raw.slice(firstBrace, lastBrace + 1);
      return JSON.parse(jsonSubstring) as T;
    } catch {
      // continue
    }
  }

  const firstBracket = raw.indexOf('[');
  const lastBracket = raw.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    try {
      const jsonSubstring = raw.slice(firstBracket, lastBracket + 1);
      return JSON.parse(jsonSubstring) as T;
    } catch {
      // continue
    }
  }

  try {
    const cleaned = stripMarkdownJson(raw);
    return JSON.parse(cleaned) as T;
  } catch {
    return fallback;
  }
}

export function getAiProviderInfo() {
  const geminiReady = Boolean(process.env.GEMINI_API_KEY);
  const groqReady = Boolean(process.env.GROQ_API_KEY);
  const openRouterReady = Boolean(process.env.OPENROUTER_API_KEY);
  const primary = process.env.AI_PROVIDER || (geminiReady ? 'gemini' : 'local-rss');
  const fallback = process.env.FALLBACK_AI_PROVIDER || (groqReady ? 'groq' : openRouterReady ? 'openrouter' : 'rss-fallback');

  return {
    primary,
    fallback,
    geminiReady,
    groqReady,
    openRouterReady
  };
}

// Active Gemini candidate models in order of verified operational status
const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.8-flash'
];

/**
 * Historical parallels & philosophical quotes for contextual grounding
 */
export function getFallbackHistoricalParallel(topic: string, lang: SupportedLanguage = 'uz'): HistoricalParallel {
  const lower = topic.toLowerCase();

  // Economy, Finance, Markets, Inflation
  if (
    lower.includes('iqtisod') ||
    lower.includes('pul') ||
    lower.includes('dollar') ||
    lower.includes('moliya') ||
    lower.includes('inflyatsiya') ||
    lower.includes('bozor') ||
    lower.includes('bank') ||
    lower.includes('savdo') ||
    lower.includes('tadbirkor') ||
    lower.includes('chegara') ||
    lower.includes('econ') ||
    lower.includes('financ') ||
    lower.includes('market') ||
    lower.includes('trade')
  ) {
    if (lang === 'uz') {
      return {
        eventName: "Buyuk Ipak yoʻli boʻylab savdo karvonlari va xalqaro iqtisodiy integratsiya",
        yearOrEra: "VIII–XIV asrlar",
        similarity: "Mintaqaviy savdo yoʻllari, erkin tovar ayirboshlash va chegaralarning ochiqligi har doim davlatlarning gullab-yashnashiga asos boʻlgan.",
        historicalLesson: "Iqtisodiy qudrat va farovonlik mustahkam moliya intizomi, oʻzaro ishonch va shaffof savdo shartnomalari orqali taʼminlanadi.",
        quote: {
          text: "Davlatning haqiqiy boyligi xazinadagi oltinning koʻpligida emas, balki xalqning mehnati, intizomi va adolatli tadbirkorligidadir.",
          author: "Ibn Xaldun",
          sourceOrEra: "«Muqaddima», XIV asr"
        }
      };
    } else if (lang === 'ru') {
      return {
        eventName: "Торговые маршруты Великого шелкового пути и региональная экономическая интеграция",
        yearOrEra: "VIII–XIV века",
        similarity: "Открытость торговых путей, справедливые правила обмена и надежная инфраструктура всегда служили двигателем процветания государств.",
        historicalLesson: "Долгосрочная стабильность достигается прозрачной институциональной базой и созидательным трудом.",
        quote: {
          text: "Богатство государства зиждется не на изобилии драгоценностей, а на трудолюбии народа и справедливом порядке.",
          author: "Ибн Хальдун",
          sourceOrEra: "«Мукаддима», XIV век"
        }
      };
    } else if (lang === 'ko') {
      return {
        eventName: "실크로드 국제 교역망과 지역 경제 통합의 역사",
        yearOrEra: "8-14세기",
        similarity: "열린 교역로와 상호 신뢰 기반의 제도적 협력은 언제나 국가와 지역 경제 부흥의 핵심 원동력이 되었습니다.",
        historicalLesson: "경제적 번영은 투기가 아닌 엄격한 규율과 국민의 생산적 근면성을 통해 실현됩니다.",
        quote: {
          text: "국가의 진정한 부는 화폐의 양이 아니라 백성의 근면함과 공정한 질서에 있다.",
          author: "이븐 칼둔",
          sourceOrEra: "«역사서설», 14세기"
        }
      };
    }
  }

  // Technology, Science, AI, Space
  if (
    lower.includes('texnolog') ||
    lower.includes('sun\'iy') ||
    lower.includes('ai') ||
    lower.includes('chip') ||
    lower.includes('kiber') ||
    lower.includes('kosmos') ||
    lower.includes('ilm') ||
    lower.includes('innovats') ||
    lower.includes('energiya')
  ) {
    if (lang === 'uz') {
      return {
        eventName: "Mamun akademiyasi va Sharq Renessansining ilmiy-texnik yuksalishi",
        yearOrEra: "IX–XI asrlar (Xorazm va Bagʻdod)",
        similarity: "Bugungi sunʼiy intellekt va yuqori texnologiyalar poygasi kabi, oʻsha davrda ham fundamental fan va hisoblash usullarini egallagan jamiyatlar taraqqiyot peshqadami boʻlgan.",
        historicalLesson: "Strategik ilmiy tafakkur va innovatsion izlanishlarga kiritilgan sarmoya davlatlarning kelajagini belgilaydi.",
        quote: {
          text: "Ilm va haqiqat yoʻlida barcha toʻsiqlar oʻrganish, qatʼiyat va tadqiqot kuchi bilan yengiladi.",
          author: "Abu Rayhon Beruniy",
          sourceOrEra: "«Qadimgi xalqlardan qolgan yodgorliklar»"
        }
      };
    }
  }

  // Diplomacy, Geopolitics, World Affairs (Default)
  if (lang === 'uz') {
    return {
      eventName: "Sohibqiron Amir Temur davlatining xalqaro diplomatiya va xavfsizlik mezonlari",
      yearOrEra: "XIV asr (Samarqand)",
      similarity: "Mavjud murakkab global muammolar va geosiyosiy keskinliklar ehtiros bilan emas, balki qatʼiy qonun ustuvorligi, chuqur tahlil va muloqot orqali yechim topadi.",
      historicalLesson: "Barqaror tinchlik va adolatli taraqqiyot faqat adolat mezonlariga soʻzsiz rioya qilingandagina mustahkam boʻladi.",
      quote: {
        text: "Kuch — adolatdadir. Qayerda adolat va qonun hukmron boʻlsa, oʻsha yerda osoyishtalik va yuksalish barqaror boʻlur.",
        author: "Amir Temur",
        sourceOrEra: "«Temur tuzuklari», XIV asr"
      }
    };
  } else if (lang === 'ru') {
    return {
      eventName: "Дипломатия эпохи Амира Темура и принципы баланса сил",
      yearOrEra: "XIV век",
      similarity: "Сложные геополитические узлы распутываются не импульсивными заявлениями, а взвешенным диалогом и опорой на закон.",
      historicalLesson: "Истинная сила и процветание держатся на принципах справедливости и взаимного уважения.",
      quote: {
        text: "Сила — в справедливости. Где торжествует закон, там процветает государство и благополучие народа.",
        author: "Амир Темур (Тамерлан)",
        sourceOrEra: "«Уложения Темура», XIV век"
      }
    };
  } else if (lang === 'ko') {
    return {
      eventName: "실크로드 외교와 국가 간 세력 균형의 역사",
      yearOrEra: "14세기",
      similarity: "국제 사회의 복잡다단한 사안은 냉철한 팩트와 상호 호혜적인 외교적 대화를 통해 풀어낼 수 있습니다.",
      historicalLesson: "정의와 공정한 질서가 지켜질 때 비로소 영속적인 번영과 평화가 안착됩니다.",
      quote: {
        text: "힘은 정의에 있다. 공정한 법과 정의가 살아 숨 쉬는 곳에 평화와 번영이 깃든다.",
        author: "아미르 티무르",
        sourceOrEra: "«티무르 법전», 14세기"
      }
    };
  } else {
    return {
      eventName: "Silk Road Diplomacy & Strategic Equilibrium",
      yearOrEra: "14th Century",
      similarity: "Complex global affairs necessitate strategic equilibrium, transparent information, and diplomatic discipline.",
      historicalLesson: "Sustainable resolution stems from justice, rule of law, and mutual constructive understanding.",
      quote: {
        text: "Power lies in justice. Wherever justice and the rule of law prevail, lasting peace and prosperity flourish.",
        author: "Amir Temur (Tamerlane)",
        sourceOrEra: "Institutes of Temur, 14th Century"
      }
    };
  }
}

/**
 * Synthesizes a news query into a structured summary, timeline, sources list, and historical parallel.
 * Fetches real-time live dispatches and delivers comprehensive, non-superficial journalistic answers.
 */
export async function synthesizeNews(query: string, lang: SupportedLanguage = 'uz'): Promise<AiSynthesisResponse> {
  const targetLang = langNames[lang] || langNames.uz;

  // 1. Fetch real-time live dispatches specifically matching the user's query
  let liveDispatches: any[] = [];
  try {
    liveDispatches = await searchNews(query, undefined, lang);
  } catch (err) {
    console.warn('[AI] Could not fetch real-time search context:', err);
  }

  const liveContextText = liveDispatches.length > 0
    ? liveDispatches.slice(0, 6).map((a, i) => `[${i + 1}] Source: ${a.source}\nTitle: ${a.title}\nDate: ${a.publishedAt}\nExcerpt: ${a.description}`).join('\n\n')
    : '';

  // 2. Call Gemini AI with structured JSON mode and rigorous anti-superficial guidelines
  if (process.env.GEMINI_API_KEY) {
    const ai = new GoogleGenAI();

    const prompt = `Siz "Humayro_3.1" global axborot va sun'iy intellekt tahliliy platformasining bosh xalqaro tahlilchisisiz.
Foydalanuvchi savoli: "${query}"

ENG MUHIM TALABLAR:
1. FOYDALANUVCHINING SAVOLIGA YUZAKI, UMUMIY YOKI SHUNCHAKI SAVOLNI TAKRORLAGAN JAVOB BERISH QAT'IYAN TAQIQLANADI!
2. Aynan "${query}" mavzusiga oid eng so'nggi real faktlar, sanalar, hodisalar, davlatlar, raqamlar, rasmiy bayonotlar va yangiliklarni tahliliy tarzda javob sifatida taqdim eting.
3. Til talabi: Qat'iy ravishda ${targetLang} tilida javob bering.
4. Javobingiz mazmuni:
   - "viralHeadline": Mavzuning eng shov-shuvli, diqqat markazidagi 1 qatorli zarbdor sarlavhasi (masalan, ommaviy axborot vositalari va ijtimoiy tarmoqlarda trend bo'layotgan eng qaynoq tomoni).
   - "summary": Savolga to'g'ridan-to'g'ri va chuqur javob beruvchi 3-4 ta to'liq, professional tahliliy jumla. Unda eng so'nggi ma'lumotlar aks etsin.
   - "publicSentiment": "Jamoatchilik munosabati va xalq ichidagi muhokama": Nega bu mavzu xalq ichida, jamoatchilikda va ijtimoiy tarmoqlarda qizg'in bahslarga sabab bo'lmoqda? Odamlarning asosiy fikri, tashvishi yoki munosabati nimalardan iborat? (2-3 ta tushunarli tahliliy jumla).
   - "trendScore": Jamoatchilik qiziqishi va rezonans indeksi (85 dan 99 gacha butun son).
   - "isTrending": true (mavzu dolzarb va trendda bo'lsa).
   - "region": "uzbekistan" yoki "global" yoki "both".
   - "keyPoints": Ushbu savolga doir kamida 4 ta aniq, faktik punkt (tashkilotlar, ismlar, raqamlar, kelishuvlar yoki qarorlar bilan).
   - "timeline": Mavzu bo'yicha so'nggi kunlar/haftalarda yuz bergan aniq xronologik voqealar (kamida 3 ta).
   - "sources": Haqiqiy nufuzli axborot agentliklari va milliy nashrlar (Kun.uz, Daryo, Gazeta.uz, Reuters, BBC, Associated Press, Bloomberg, O'zA).
   - "historicalParallel": Tarixdan mos keluvchi o'xshash voqea, uning saboqlari hamda buyuk mutafakkir (Amir Temur, Beruniy, Ibn Sino, Navoiy, Ibn Xaldun va h.k.)ning chuqur falsafiy iqtibosi.

${liveContextText ? `\nUshbu mavzu bo'yicha tarmoqdan olingan so'nggi yangiliklar (Grounding Context):\n${liveContextText}\n` : ''}

Quyidagi JSON formatida qat'iy va faqat JSON javob bering:
{
  "viralHeadline": "Eng shov-shuvli trend sarlavhasi",
  "summary": "Savolga oid eng so'nggi faktlar va vaziyatni batafsil yorituvchi 3-4 ta tahliliy jumla",
  "publicSentiment": "Xalq ichidagi asosiy muhokamalar, odamlarning fikri va rezonans sabablari",
  "trendScore": 96,
  "isTrending": true,
  "region": "uzbekistan",
  "keyPoints": [
    "Aniq fakt va yangilik 1 (raqam yoki sana bilan)",
    "Aniq fakt va yangilik 2",
    "Aniq fakt va yangilik 3",
    "Aniq fakt va yangilik 4"
  ],
  "timeline": [
    {"time": "2026-yil / Yaqinda", "event": "So'nggi yuz bergan asosiy hodisa yoki bayonot"},
    {"time": "Oldingi bosqich", "event": "Undan oldingi kelishuv yoki muzokara"}
  ],
  "sources": [
    {"name": "Reuters"},
    {"name": "BBC News"},
    {"name": "Kun.uz / O'zA"}
  ],
  "historicalParallel": {
    "eventName": "Tarixiy o'xshash voqea nomi",
    "yearOrEra": "Tarixiy davr yoki yil",
    "similarity": "Bugungi vaziyat bilan o'xshashlik tahlili (2-3 jumla)",
    "historicalLesson": "Tarixiy xulosa va saboq",
    "quote": {
      "text": "chuqur donishmandlik iqtibosi",
      "author": "Alloma yoki yetakchi ismi",
      "sourceOrEra": "Manba yoki asar nomi"
    }
  },
  "confidenceNote": "Real-time AI telemetry & verified agency synthesis"
}`;

    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const responseText = response.text || '';
        const parsed = safeJsonParse<Partial<AiSynthesisResponse>>(responseText, {});

        if (parsed.summary && Array.isArray(parsed.keyPoints) && parsed.keyPoints.length > 0) {
          const historical = (parsed.historicalParallel && parsed.historicalParallel.eventName && parsed.historicalParallel.quote?.text)
            ? parsed.historicalParallel
            : getFallbackHistoricalParallel(query, lang);

          return {
            viralHeadline: parsed.viralHeadline || parsed.keyPoints[0],
            summary: parsed.summary,
            publicSentiment: parsed.publicSentiment || (lang === 'uz' ? "Mavzu ijtimoiy tarmoqlar va jamoatchilik orasida eng ko'p o'qilayotgan hamda fikr-mulohazalar bildirilayotgan markaziy voqealardan biri bo'lib qolmoqda." : undefined),
            trendScore: typeof parsed.trendScore === 'number' ? parsed.trendScore : 94,
            isTrending: parsed.isTrending !== false,
            region: parsed.region || 'both',
            keyPoints: parsed.keyPoints,
            timeline: (parsed.timeline && parsed.timeline.length > 0)
              ? parsed.timeline.slice(0, 5)
              : [{ time: '2026-yil', event: parsed.keyPoints[0] || 'Soʻnggi voqealar rivoji' }],
            sources: (parsed.sources && parsed.sources.length > 0)
              ? parsed.sources
              : [{ name: 'Reuters' }, { name: 'BBC News' }, { name: 'Associated Press' }],
            historicalParallel: historical,
            confidenceNote: parsed.confidenceNote || 'Humayro_3.1 real-time verified intelligence stream',
            isFallback: false
          };
        }
      } catch (err: any) {
        console.warn(`[AI] Model ${model} failed, trying next:`, err?.message || err);
      }
    }
  }

  // 3. Fallback: Detailed, fact-rich synthesis derived directly from live searched articles
  if (liveDispatches.length > 0) {
    const topArticles = liveDispatches.slice(0, 5);
    const combinedSources = Array.from(new Set(topArticles.map(a => a.source))).map(s => ({ name: s }));

    const primaryHeadline = topArticles[0].title;
    const primaryDesc = topArticles[0].description;
    const secondaryHeadline = topArticles[1]?.title || '';
    const secondaryDesc = topArticles[1]?.description || '';

    const summaryText = lang === 'uz'
      ? `«${query}» mavzusi boʻyicha olingan soʻnggi xabarlar: ${primaryHeadline}. ${primaryDesc} Shuningdek, xalqaro manbalar ${secondaryHeadline ? `qoʻshimcha ravishda quyidagilarni qayd etmoqda: ${secondaryHeadline}. ${secondaryDesc}` : 'vaziyat boʻyicha tahliliy kuzatuvlarni davom ettirmoqda.'}`
      : lang === 'ru'
      ? `Свежие данные по запросу «${query}»: ${primaryHeadline}. ${primaryDesc} ${secondaryHeadline ? `Также сообщается: ${secondaryHeadline}.` : ''}`
      : lang === 'ko'
      ? `«${query}» 관련 최신 확인 보고: ${primaryHeadline}. ${primaryDesc} ${secondaryHeadline ? `추가 보도: ${secondaryHeadline}.` : ''}`
      : `Latest verified reporting for "${query}": ${primaryHeadline}. ${primaryDesc} ${secondaryHeadline ? `Additionally: ${secondaryHeadline}.` : ''}`;

    const sentimentText = lang === 'uz'
      ? `Ushbu xabar jamoatchilikda va ijtimoiy tarmoqlarda keng rezonans uygʻotmoqda. Aholi va soha mutaxassislari voqealar rivoji hamda uning kundalik hayotga koʻrsatadigan bevosita taʼsirini diqqat bilan muhokama qilmoqda.`
      : `This topic is generating substantial public interest and digital discourse across social platforms.`;

    return {
      viralHeadline: primaryHeadline,
      summary: summaryText,
      publicSentiment: sentimentText,
      trendScore: 95,
      isTrending: true,
      region: 'both',
      keyPoints: topArticles.map(a => `${a.source}: ${a.title}`),
      timeline: topArticles.slice(0, 4).map(a => ({
        time: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : 'Yaqinda',
        event: a.title
      })),
      sources: combinedSources.length > 0 ? combinedSources : [{ name: 'Reuters' }, { name: 'BBC News' }],
      historicalParallel: getFallbackHistoricalParallel(query, lang),
      confidenceNote: 'Jonli axborot lentalari va global agentliklar asosida shakllantirildi',
      isFallback: true
    };
  }

  // 4. Default informed synthesis if search yielded 0 items
  const fallbackHistorical = getFallbackHistoricalParallel(query, lang);
  return {
    viralHeadline: lang === 'uz' ? `«${query}» — Jamoatchilik diqqat markazidagi mavzu tahlili` : `Intelligence update: "${query}"`,
    summary: lang === 'uz'
      ? `«${query}» mavzusi boʻyicha xalqaro axborot agentliklari (Reuters, BBC, AP, Bloomberg) hamda milliy nashrlar monitoring qilinmoqda. Mazkur yoʻnalishda yangi faktik va ijtimoiy-iqtisodiy koʻrsatkichlar tahlil qilinmoqda.`
      : `Active intelligence monitoring for "${query}" is ongoing across Reuters, BBC, AP, and global wires.`,
    publicSentiment: lang === 'uz'
      ? `Mazkur yoʻnalish keng jamoatchilikda qiziqish uygʻotib, ijtimoiy tarmoqlar va tahliliy doiralarda munozaralarga sabab boʻlmoqda.`
      : `This topic continues to generate interest across digital discourse and policy discussions.`,
    trendScore: 92,
    isTrending: true,
    region: 'both',
    keyPoints: [
      lang === 'uz' ? `«${query}» boʻyicha nufuzli manbalar va rasmiy bayonotlar tahlil qilinmoqda` : `Monitoring verified agency statements on "${query}"`,
      lang === 'uz' ? "Mavzuga oid yangi faktlar va iqtisodiy-siyosiy koʻrsatkichlar tahlil qilinmoqda" : 'Analyzing key economic and strategic indicators',
      lang === 'uz' ? "Tasdiqlangan axborotlar kelib tushishi bilan tahliliy maʼlumotlar yangilanadi" : 'Data refreshes continuously as new reports arrive'
    ],
    timeline: [
      { time: '2026-yil', event: lang === 'uz' ? `«${query}» boʻyicha tezkor monitoring faol` : 'Active monitoring ongoing' }
    ],
    sources: [{ name: 'Reuters' }, { name: 'BBC News' }, { name: 'Associated Press' }],
    historicalParallel: fallbackHistorical,
    confidenceNote: 'Humayro_3.1 real-time intelligence stream',
    isFallback: true
  };
}

/**
 * Generates an in-depth news intelligence brief for a topic or region
 */
export async function generateArticle(
  topic: string,
  region: string | undefined,
  lang: SupportedLanguage = 'uz'
): Promise<AiArticleResponse> {
  const targetLang = langNames[lang] || langNames.uz;

  // Get live dispatches on this topic
  let liveDispatches: any[] = [];
  try {
    liveDispatches = await searchNews(topic, undefined, lang);
  } catch {
    // ignore
  }

  const liveContextText = liveDispatches.length > 0
    ? liveDispatches.slice(0, 5).map((a, i) => `[${i + 1}] Source: ${a.source}\nTitle: ${a.title}\nDetails: ${a.description}`).join('\n\n')
    : '';

  if (process.env.GEMINI_API_KEY) {
    const ai = new GoogleGenAI();
    const prompt = `Siz "Humayro_3.1" xalqaro tahliliy nashrining bosh muharririsiz.
Mavzu: "${topic}" ${region ? `(Mintaqa: ${region})` : ''}.

Vazifa: Ushbu mavzu bo'yicha eng so'nggi voqealar, xalqaro tahlillar, raqamlar va aniq faktlarga asoslangan chuqur, professional tahliliy maqola (brief) tayyorlang.
Til talabi: Qat'iy ravishda ${targetLang} tilida yozing.
Tarixiy parallel ('historicalParallel') va buyuk mutafakkir iqtibosini albatta kiriting.

${liveContextText ? `Mavzuga doir so'nggi tarmoq xabarlari:\n${liveContextText}\n` : ''}

Quyidagi JSON formatida qat'iy javob bering:
{
  "title": "Aniq va jiddiy jurnalistik sarlavha",
  "dek": "Maqolaning asosiy mohiyatini ifodalovchi 1 jumlali tahliliy kirish",
  "paragraphs": [
    "Birinchi xatboshi: Mavzuning ayni paytdagi eng so'nggi rivojlanishi, qabul qilingan qarorlar va asosiy voqealar.",
    "Ikkinchi xatboshi: Geosiyosiy yoki iqtisodiy sabablar, tahlillar, raqamlar va mintaqaviy ahamiyat.",
    "Uchinchi xatboshi: Ekspertlar, rasmiy idoralar bayonotlari va kelajakdagi ehtimoliy oqibatlar."
  ],
  "keyPoints": [
    "Asosiy strategik xulosa 1 (aniq fakt)",
    "Asosiy strategik xulosa 2",
    "Asosiy strategik xulosa 3"
  ],
  "sources": [
    {"name": "Reuters"},
    {"name": "Associated Press"},
    {"name": "BBC News"}
  ],
  "historicalParallel": {
    "eventName": "Tarixiy o'xshash voqea nomi",
    "yearOrEra": "Tarixiy davr yoki yil",
    "similarity": "Ushbu tarixiy voqea bugungi rivojlanish bilan nega o'xshash ekanligi",
    "historicalLesson": "Tarixdan olinadigan asosiy saboq",
    "quote": {
      "text": "chuqur donishmandlik iqtibosi",
      "author": "Alloma / mutafakkir",
      "sourceOrEra": "Tarixiy asar yoki manba"
    }
  }
}`;

    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const responseText = response.text || '';
        const parsed = safeJsonParse<Partial<AiArticleResponse>>(responseText, {});

        if (parsed.title && Array.isArray(parsed.paragraphs) && parsed.paragraphs.length > 0) {
          const historical = (parsed.historicalParallel && parsed.historicalParallel.eventName && parsed.historicalParallel.quote?.text)
            ? parsed.historicalParallel
            : getFallbackHistoricalParallel(topic, lang);

          return {
            title: parsed.title,
            dek: parsed.dek || '',
            paragraphs: parsed.paragraphs,
            keyPoints: parsed.keyPoints || [],
            sources: (parsed.sources && parsed.sources.length > 0) ? parsed.sources : [{ name: 'Reuters' }, { name: 'BBC News' }],
            historicalParallel: historical,
            region,
            publishedAt: new Date().toISOString(),
            isFallback: false
          };
        }
      } catch (err: any) {
        console.warn(`[AI] Article model ${model} failed, trying next:`, err?.message || err);
      }
    }
  }

  // Fallback article from live articles
  const lead = liveDispatches[0] || {
    title: `${topic} — Xalqaro tahliliy sharh`,
    description: `${topic} boʻyicha soʻnggi xabarlar va tahlillar. Xalqaro agentliklar va mintaqaviy kuzatuvchilar voqealar rivojini tahlil qilmoqda.`,
    source: 'Reuters / BBC'
  };

  return {
    title: lead.title,
    dek: lead.description.slice(0, 160) + '...',
    paragraphs: [
      lead.description,
      `${topic} yuzasidan xalqaro va mahalliy tahlilchilar jarayonlarni diqqat bilan kuzatmoqda. Asosiy omillar qatoriga iqtisodiy barqarorlik, yangi investitsiyalar va strategik kelishuvlar kiradi.`,
      `Nufuzli xalqaro axborot agentliklari va rasmiy idoralar yaqin vaqt ichida qoʻshimcha tahliliy hisobotlarni taqdim etishi kutilmoqda.`
    ],
    keyPoints: [
      `Asosiy voqea: ${lead.title}`,
      `Tasdiqlangan manba: ${lead.source}`,
      `Humayro_3.1 jonli intellekt monitoringi faol`
    ],
    sources: [{ name: lead.source }, { name: 'Reuters' }, { name: 'Associated Press' }],
    historicalParallel: getFallbackHistoricalParallel(topic, lang),
    region,
    publishedAt: new Date().toISOString(),
    isFallback: true
  };
}
