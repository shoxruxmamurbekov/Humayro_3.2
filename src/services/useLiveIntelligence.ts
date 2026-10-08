import { useState, useEffect, useCallback, useMemo } from 'react';
import { Article, SupportedLanguage } from '../types';
import { fetchLiveFeed, fetchTrendingData, TrendingHotspotItem } from './api';

const REFRESH_INTERVAL_SECONDS = 30;

// Keywords used to assign live articles to geographical regions
const REGION_KEYWORD_MAP: Record<string, string[]> = {
  'central-asia': [
    "o'zbekiston", "oʻzbekiston", "toshkent", "samarqand", "buxoro", "farg'ona",
    "qozog'iston", "qirg'iziston", "tojikiston", "turkmaniston", "markaziy osiyo",
    "узбекистан", "ташкент", "казахстан", "кыргызстан", "таджикистан", "туркменистан",
    "центральная азия", "central asia", "uzbekistan", "tashkent", "o'za", "gazeta.uz", "kun.uz"
  ],
  'east-asia': [
    "koreya", "seul", "yaponiya", "tokio", "xitoy", "pekin", "tayvan", "tinch okeani",
    "корея", "сеул", "япония", "токио", "китай", "пекин", "тайвань",
    "china", "japan", "korea", "taiwan", "seoul", "tokyo", "beijing", "semiconductor", "tsmc"
  ],
  'europe': [
    "yevropa", "bryussel", "germaniya", "fransiya", "london", "berlin", "parij", "ai act",
    "европа", "брюссель", "германия", "франция", "лондон", "берлин", "париж",
    "europe", "eu", "brussels", "germany", "france", "uk", "london", "nato"
  ],
  'north-america': [
    "aqsh", "vashington", "silikon", "amerika", "kanada", "fed", "bayden", "tramp", "nyu-york",
    "сша", "вашингтон", "америка", "канада", "силиконовая", "байден", "трамп",
    "us", "usa", "washington", "silicon valley", "biden", "trump", "new york", "fed", "wall street"
  ],
  'middle-east': [
    "yaqin sharq", "dubay", "saudiya", "riyod", "eron", "isroil", "gaza", "qatar", "baa",
    "ближний восток", "дубай", "саудовская", "эр-рияд", "иран", "израиль", "сектор газа",
    "middle east", "dubai", "saudi", "riyadh", "iran", "israel", "gaza", "qatar", "uae"
  ],
  'africa': [
    "afrika", "misr", "nayrobi", "qohira", "yoxannesburg", "nigeriya", "keniya",
    "африка", "египет", "найроби", "каир", "нигерия", "кения",
    "africa", "egypt", "cairo", "nairobi", "nigeria", "kenya", "johannesburg"
  ],
  'south-america': [
    "janubiy amerika", "braziliya", "argentina", "san-paulu", "buenos-ayres", "chili",
    "южная америка", "бразилия", "аргентина", "сан-паулу",
    "south america", "brazil", "argentina", "sao paulo", "chile"
  ],
  'oceania': [
    "avstraliya", "sidney", "melburn", "okeaniya", "yangi zelandiya",
    "австралия", "сидней", "океания", "новая зеландия",
    "australia", "sydney", "melbourne", "oceania", "new zealand"
  ]
};

export interface LiveIntelligenceState {
  articles: Article[];
  regionalArticles: Record<string, Article[]>;
  latestBreaking: Article | null;
  trendingHotspots: {
    uzbekistan: TrendingHotspotItem[];
    global: TrendingHotspotItem[];
  };
  isRefreshing: boolean;
  lastUpdated: Date;
  countdown: number;
  refreshNow: () => Promise<void>;
}

export function useLiveIntelligence(currentLang: SupportedLanguage): LiveIntelligenceState {
  const [articles, setArticles] = useState<Article[]>([]);
  const [trendingHotspots, setTrendingHotspots] = useState<{
    uzbekistan: TrendingHotspotItem[];
    global: TrendingHotspotItem[];
  }>({ uzbekistan: [], global: [] });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [countdown, setCountdown] = useState<number>(REFRESH_INTERVAL_SECONDS);

  // Core fetch function
  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
    try {
      const [feedData, trendData] = await Promise.all([
        fetchLiveFeed(undefined, currentLang),
        fetchTrendingData(currentLang).catch(() => null)
      ]);

      if (feedData && feedData.length > 0) {
        setArticles(feedData);
      }

      if (trendData?.hotspots) {
        setTrendingHotspots({
          uzbekistan: trendData.hotspots.uzbekistan || [],
          global: trendData.hotspots.global || []
        });
      }

      setLastUpdated(new Date());
      setCountdown(REFRESH_INTERVAL_SECONDS);
    } catch (err) {
      console.warn('[useLiveIntelligence] Live polling error:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [currentLang]);

  // Initial load & when language changes
  useEffect(() => {
    loadData(false);
  }, [loadData]);

  // Automatic periodic polling countdown timer (Every second countdown, fires fetch at 0)
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          loadData(true); // background silent fetch
          return REFRESH_INTERVAL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loadData]);

  // Group live articles by region
  const regionalArticles = useMemo(() => {
    const map: Record<string, Article[]> = {
      'central-asia': [],
      'east-asia': [],
      'europe': [],
      'north-america': [],
      'middle-east': [],
      'africa': [],
      'south-america': [],
      'oceania': []
    };

    for (const art of articles) {
      const textToSearch = `${art.title} ${art.description || ''} ${art.source || ''}`.toLowerCase();
      let matched = false;

      for (const [regionKey, keywords] of Object.entries(REGION_KEYWORD_MAP)) {
        if (keywords.some(k => textToSearch.includes(k))) {
          map[regionKey].push(art);
          matched = true;
          break;
        }
      }

      // Only Uzbekistan-tagged items fall back to central-asia; unmatched items are no longer
      // dumped into arbitrary regions (real per-region data comes from /api/region/:key/live)
      if (!matched && art.category?.toLowerCase() === 'uzbekistan') {
        map['central-asia'].push(art);
      }
    }

    return map;
  }, [articles]);

  const latestBreaking = useMemo(() => {
    if (articles.length === 0) return null;
    return articles.find(a => a.isTrending) || articles[0];
  }, [articles]);

  return {
    articles,
    regionalArticles,
    latestBreaking,
    trendingHotspots,
    isRefreshing,
    lastUpdated,
    countdown,
    refreshNow: () => loadData(false)
  };
}
