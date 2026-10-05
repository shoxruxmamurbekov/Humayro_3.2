import React, { useState, useEffect, useCallback } from 'react';
import { translations, TranslationDict } from './i18n/translations';
import { Article, SupportedLanguage, ThemeMode, UserProfile, AiArticleResponse, AiSynthesisResponse } from './types';
import {
  getUserProfile,
  subscribeUserStore,
  recordAiQuery,
  addSearchHistory,
  toggleBookmark,
  isArticleBookmarked,
  updateLanguagePref,
  updateThemePref
} from './services/userStore';
import { synthesizeAiQuery, generateAiArticle, fetchLiveFeed } from './services/api';
import { useLiveIntelligence } from './services/useLiveIntelligence';

import { CursorGlow } from './components/CursorGlow';
import { ParticleCanvas } from './components/ParticleCanvas';
import { Navbar } from './components/Navbar';
import { BreakingTicker } from './components/BreakingTicker';
import { HeroSection } from './components/HeroSection';
import { SearchSection } from './components/SearchSection';
import { FeaturesSection } from './components/FeaturesSection';
import { WorldMapSection } from './components/WorldMapSection';
import { ChatSection } from './components/ChatSection';
import { FeedSection } from './components/FeedSection';
import { Footer } from './components/Footer';
import { ArticleModal } from './components/ArticleModal';
import { AuthModal } from './components/AuthModal';
import { AdminModal } from './components/AdminModal';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  synthesis?: AiSynthesisResponse;
  isLoading?: boolean;
  error?: string;
  timestamp: string;
}

export default function App() {
  const [user, setUser] = useState<UserProfile>(() => getUserProfile());
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(() => {
    const prof = getUserProfile();
    return prof?.preferences?.language || 'uz';
  });
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const prof = getUserProfile();
    return prof?.preferences?.theme || 'dark';
  });
  const dict: TranslationDict = translations[currentLang] || translations.uz;

  // Real-time continuous live intelligence stream (auto-updates every 30s)
  const {
    articles: liveArticles,
    regionalArticles,
    latestBreaking,
    trendingHotspots,
    isRefreshing: isLiveRefreshing,
    lastUpdated: lastLiveUpdated,
    countdown: liveCountdown,
    refreshNow: refreshLiveNow
  } = useLiveIntelligence(currentLang);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Article Reader state
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [activeArticleTopic, setActiveArticleTopic] = useState('');
  const [activeArticleData, setActiveArticleData] = useState<AiArticleResponse | null>(null);
  const [articleLoading, setArticleLoading] = useState(false);

  // Live breaking news ticker articles
  const [tickerArticles, setTickerArticles] = useState<Article[]>([
    {
      id: 'tick-1',
      title: "O'zbekistonda yangi texnoparklar va sun'iy intellekt infratuzilmasi faoliyati kengaytirildi",
      source: "O'zA",
      description: "Markaziy Osiyoda IT va sun'iy intellekt habi kengaymoqda.",
      publishedAt: new Date().toISOString(),
      url: '#'
    },
    {
      id: 'tick-2',
      title: "Global moliya bozorlarida yangi xalqaro me'yoriy intizom va kapital oqimlari muhokama qilinmoqda",
      source: "Bloomberg",
      description: "Xalqaro kapital bozorlarida yangi qoidalar.",
      publishedAt: new Date().toISOString(),
      url: '#'
    },
    {
      id: 'tick-3',
      title: "Yarimo'tkazgichlar sanoatida keyingi avlod kvant chiplari va hisoblash arxitekturasi taqdim etildi",
      source: "Reuters",
      description: "Hisoblash quvvati va energiya samaradorligi oshirildi.",
      publishedAt: new Date().toISOString(),
      url: '#'
    },
    {
      id: 'tick-4',
      title: "Janubiy Koreyada yashil vodorod va qayta tiklanuvchi energetika bo'yicha global kelishuv imzolandi",
      source: "Yonhap",
      description: "Uglerod neytralligi va toza sanoat dasturi.",
      publishedAt: new Date().toISOString(),
      url: '#'
    }
  ]);

  useEffect(() => {
    fetchLiveFeed(undefined, currentLang)
      .then(articles => {
        if (articles && articles.length > 0) {
          setTickerArticles(articles);
        }
      })
      .catch(() => {});
  }, [currentLang]);

  // Interactive AI Chat conversation state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-1',
      sender: 'user',
      text: dict.chat_user_msg,
      timestamp: new Date().toISOString()
    },
    {
      id: 'init-2',
      sender: 'ai',
      synthesis: {
        summary: dict.chat_summary_text,
        keyPoints: [
          dict.chat_tl1,
          dict.chat_tl2,
          dict.chat_tl3
        ],
        timeline: [
          { time: '09:12', event: dict.chat_tl1 },
          { time: '11:45', event: dict.chat_tl2 },
          { time: '14:30', event: dict.chat_tl3 }
        ],
        sources: [
          { name: 'Reuters' },
          { name: 'Bloomberg' },
          { name: 'Yonhap' },
          { name: 'Korea Herald' }
        ],
        historicalParallel: {
          eventName: "Yarimo'tkazgichlar inqilobi va kremniy vodiysi yuksalishi",
          yearOrEra: "1970-1980-yillar",
          similarity: "Mikrochiplar va kremniy texnologiyasining rivojlanishi bugungi sun'iy intellekt va yuqori texnologiyali investitsiyalar poygasi kabi global sanoatni tubdan qayta shakllantirgan.",
          historicalLesson: "Strategik hisoblash quvvati va ilmiy-tadqiqot bazasiga ega davlatlar kelajak iqtisodiyotining asosiy harakatlantiruvchisiga aylanadi.",
          quote: {
            text: "Ilm yo'lidagi har bir qadam — insoniyat kelajagi uchun qo'yilgan mustahkam poydevordir.",
            author: "Abu Rayhon Beruniy",
            sourceOrEra: "Tarixiy ilmiy meros"
          }
        },
        confidenceNote: 'Verified via live intelligence stream'
      },
      timestamp: new Date().toISOString()
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Subscribe to user store updates
  useEffect(() => {
    return subscribeUserStore(() => {
      setUser(getUserProfile());
    });
  }, []);

  // Sync theme changes with DOM and media query listener
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let activeTheme: 'dark' | 'light' = 'dark';
      if (themeMode === 'system') {
        activeTheme = mediaQuery.matches ? 'dark' : 'light';
      } else {
        activeTheme = themeMode;
      }

      document.documentElement.setAttribute('data-theme', activeTheme);
      const meta = document.getElementById('themeColorMeta');
      if (meta) {
        meta.setAttribute('content', activeTheme === 'light' ? '#f6f7f9' : '#080808');
      }
    };

    applyTheme();
    updateThemePref(themeMode);

    if (themeMode === 'system') {
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [themeMode]);

  // Handle language switch (including RTL for Arabic and Farsi)
  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setCurrentLang(newLang);
    updateLanguagePref(newLang);
    document.documentElement.lang = newLang;
    if (newLang === 'ar' || newLang === 'fa') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  // Open Article by Topic or Region
  const openArticle = useCallback(async (topic: string, region?: string, slug?: string) => {
    setActiveArticleTopic(topic);
    setArticleModalOpen(true);
    setArticleLoading(true);
    setActiveArticleData(null);

    const safeSlug = slug || topic.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
    window.location.hash = `article/${safeSlug}`;

    try {
      const data = await generateAiArticle(topic, region, currentLang);
      setActiveArticleData(data);
    } catch {
      setActiveArticleData({
        title: topic,
        dek: dict.ai_error,
        paragraphs: [dict.ai_error],
        keyPoints: [],
        sources: [{ name: 'Humayro_3.1 Wire' }]
      });
    } finally {
      setArticleLoading(false);
    }
  }, [currentLang, dict.ai_error]);

  const closeArticle = () => {
    setArticleModalOpen(false);
    if (window.location.hash.startsWith('#article')) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  // Handle URL Hash change for deep linking
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#article/')) {
        const queryTopic = decodeURIComponent(hash.replace('#article/', '').replace(/-/g, ' '));
        if (queryTopic && !articleModalOpen) {
          openArticle(queryTopic);
        }
      } else if (!hash && articleModalOpen) {
        setArticleModalOpen(false);
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, [articleModalOpen, openArticle]);

  // Send query to AI synthesis
  const handleSearchSubmit = async (query: string) => {
    if (!query.trim()) return;

    // Quota check
    const quota = recordAiQuery();
    if (!quota.allowed) {
      alert(dict.ai_rate_limit);
      return;
    }

    addSearchHistory(query);

    // Scroll smoothly to chat section
    const chatSec = document.querySelector('.chat-section') || document.getElementById('chatForm');
    if (chatSec) {
      chatSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const userMsgId = `user-${Date.now()}`;
    const aiMsgId = `ai-${Date.now()}`;

    // Add user message & AI placeholder bubble
    setChatMessages(prev => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: query,
        timestamp: new Date().toISOString()
      },
      {
        id: aiMsgId,
        sender: 'ai',
        isLoading: true,
        timestamp: new Date().toISOString()
      }
    ]);

    setChatLoading(true);

    try {
      const result = await synthesizeAiQuery(query, currentLang);
      setChatMessages(prev =>
        prev.map(msg =>
          msg.id === aiMsgId
            ? {
                ...msg,
                isLoading: false,
                synthesis: result
              }
            : msg
        )
      );
    } catch (err: any) {
      setChatMessages(prev =>
        prev.map(msg =>
          msg.id === aiMsgId
            ? {
                ...msg,
                isLoading: false,
                error: err.message || dict.ai_error
              }
            : msg
        )
      );
    } finally {
      setChatLoading(false);
    }
  };

  const handleBookmarkActiveArticle = () => {
    if (!activeArticleData) return;
    const articleObj: Article = {
      id: `saved-${Date.now()}`,
      title: activeArticleData.title,
      description: activeArticleData.dek,
      url: window.location.href,
      source: activeArticleData.sources?.[0]?.name || 'Humayro_3.1',
      publishedAt: new Date().toISOString()
    };
    toggleBookmark(articleObj);
  };

  const handleSelectBookmarkArticle = (article: Article) => {
    openArticle(article.title);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#080808] dark:bg-[#080808] light:bg-[#f7f6f3] text-[#f5f5f7] dark:text-[#f5f5f7] light:text-[#16161a] transition-colors duration-400 font-['Inter'] relative selection:bg-[#FF6A00] selection:text-black">
      {/* Background Interactive Effects */}
      <CursorGlow />
      <ParticleCanvas />

      {/* Navigation Bar */}
      <Navbar
        dict={dict}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        themeMode={themeMode}
        onThemeModeChange={setThemeMode}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* 24/7 Live Breaking News Marquee Ticker & Live Stream Lenta */}
      <BreakingTicker
        articles={liveArticles.length > 0 ? liveArticles : tickerArticles}
        dict={dict}
        currentLang={currentLang}
        onSelectArticle={(a) => openArticle(a.title, a.category, a.id)}
      />

      {/* Main Page Sections */}
      <main>
        {/* Hero Section */}
        <HeroSection
          dict={dict}
          onExploreClick={() => scrollToSection('ai')}
          onDemoClick={() => scrollToSection('features')}
          latestArticle={latestBreaking}
          totalArticlesCount={liveArticles.length}
          refreshCountdown={liveCountdown}
          onSelectArticle={(a) => openArticle(a.title, a.category, a.id)}
        />

        {/* Search Bar & Voice Recognition */}
        <SearchSection
          dict={dict}
          currentLang={currentLang}
          onSearch={handleSearchSubmit}
          isLoading={chatLoading}
          trendingHotspots={trendingHotspots}
          liveArticles={liveArticles}
        />

        {/* 8 Core Capabilities Features */}
        <FeaturesSection dict={dict} />

        {/* Interactive World Map */}
        <WorldMapSection
          dict={dict}
          onSelectRegion={(regId, regLabel) => openArticle(regLabel, regId, `region-${regId.toLowerCase().slice(0, 6)}`)}
          onAskAi={(query) => {
            scrollToSection('ai');
            handleSearchSubmit(query);
          }}
          regionalArticles={regionalArticles}
          onSelectArticle={(a) => openArticle(a.title, a.category, a.id)}
          isRefreshing={isLiveRefreshing}
          lastUpdated={lastLiveUpdated}
        />

        {/* AI Conversation & Terminal Stream */}
        <div className="chat-section">
          <ChatSection
            dict={dict}
            activeConversation={chatMessages}
            onSendMessage={handleSearchSubmit}
            isLoading={chatLoading}
            currentLang={currentLang}
          />
        </div>

        {/* Real-time Continuous Live News Feed */}
        <FeedSection
          dict={dict}
          currentLang={currentLang}
          onSelectTopic={topicName => openArticle(topicName)}
          liveArticles={liveArticles}
          onSelectArticle={(a) => openArticle(a.title, a.category, a.id)}
          isRefreshing={isLiveRefreshing}
          lastUpdated={lastLiveUpdated}
          onRefreshNow={refreshLiveNow}
          countdown={liveCountdown}
        />
      </main>

      {/* Footer */}
      <Footer dict={dict} onOpenAdmin={() => setAdminModalOpen(true)} />

      {/* Full Article Drawer Modal */}
      <ArticleModal
        isOpen={articleModalOpen}
        topicLabel={activeArticleTopic}
        article={activeArticleData}
        isLoading={articleLoading}
        isBookmarked={Boolean(activeArticleData && isArticleBookmarked(activeArticleData.title, activeArticleData.title))}
        onToggleBookmark={handleBookmarkActiveArticle}
        onClose={closeArticle}
        dict={dict}
        currentLang={currentLang}
      />

      {/* User Auth & Profile Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        user={user}
        dict={dict}
        onSelectArticle={handleSelectBookmarkArticle}
        onSelectQuery={query => {
          setAuthModalOpen(false);
          handleSearchSubmit(query);
        }}
      />

      {/* Protected Admin / System Observability Modal */}
      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />
    </div>
  );
}
