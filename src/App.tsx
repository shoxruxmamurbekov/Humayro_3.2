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
import { synthesizeAiQuery, generateAiArticle, fetchLiveFeed, fetchServerQuota } from './services/api';
import { useLiveIntelligence } from './services/useLiveIntelligence';

import { CursorGlow } from './components/CursorGlow';
import { Navbar } from './components/Navbar';
import { SignalBar } from './components/SignalBar';
import { SignalMetrics } from './components/SignalMetrics';
import { IntelligenceCommandCenter } from './components/IntelligenceCommandCenter';
import { IntelligenceHero } from './components/IntelligenceHero';
import { ChatSection, ChatMessage } from './components/ChatSection';
import { FeedSection } from './components/FeedSection';
import { Footer } from './components/Footer';
import { ArticleModal } from './components/ArticleModal';
import { AuthModal } from './components/AuthModal';
import { AdminModal } from './components/AdminModal';
import { BottomNav } from './components/BottomNav';

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

  // Article Reader state (right-side drawer)
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [activeArticleTopic, setActiveArticleTopic] = useState('');
  const [activeArticleData, setActiveArticleData] = useState<AiArticleResponse | null>(null);
  const [articleLoading, setArticleLoading] = useState(false);

  // Fallback ticker articles
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
    }
  ]);

  // AI Chat Conversation Stream state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Subscribe to persistent User Store & sync quota from server
  useEffect(() => {
    fetchServerQuota().then(quota => {
      if (quota) {
        setUser(getUserProfile());
      }
    });

    const unsub = subscribeUserStore(() => {
      setUser(getUserProfile());
    });
    return unsub;
  }, []);

  // Sync theme mode to DOM data-theme attribute
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', themeMode);
    }
    updateThemePref(themeMode);
  }, [themeMode]);

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setCurrentLang(newLang);
    updateLanguagePref(newLang);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open Full Article / Deep Dive Brief in right-side Intelligence Reader
  const openArticle = async (title: string, category?: string, fallbackId?: string) => {
    setActiveArticleTopic(title);
    setArticleModalOpen(true);
    setArticleLoading(true);
    setActiveArticleData(null);

    const generated = await generateAiArticle(title, category || 'global', currentLang);
    setArticleLoading(false);

    if (generated) {
      setActiveArticleData(generated);
    } else {
      // Offline fallback
      setActiveArticleData({
        title,
        dek: "Ushbu mavzu bo'yicha mustaqil xalqaro agentliklar va tahliliy markazlar hisoboti tayyorlandi.",
        paragraphs: [
          `${title} bo'yicha global axborot agentliklari va tahliliy platformalar tomonidan so'nggi 24 soat ichida bir nechta muhim hisobotlar e'lon qilindi.`,
          "Iqtisodiy va geosiyosiy ta'sirlar doirasida mazkur masala mintaqaviy barqarorlik va bozor dinamikasiga sezilarli darajada ta'sir ko'rsatmoqda.",
          "Ekspertlar keyingi rivojlanish bosqichida tomonlarning o'zaro kelishuvlari va xalqaro me'yorlarga amal qilinishini asosiy omil sifatida ko'rsatishmoqda."
        ],
        keyPoints: [
          "Xalqaro mustaqil monitoring agentliklari voqealar rivojini yaqindan kuzatmoqda.",
          "Bozor va makroiqtisodiy ko'rsatkichlarga dastlabki ta'sirlar qayd etildi.",
          "Keyingi 48 soat davomida rasmiy bayonotlar e'lon qilinishi kutilmoqda."
        ],
        sources: [
          { name: 'Reuters Global Feed' },
          { name: 'Bloomberg Terminal Dispatch' },
          { name: 'Associated Press World' }
        ],
        historicalParallel: {
          eventName: '2008-yilgi Global Moliyaviy Va Mintaqaviy Moslashuv Inqirozi',
          yearOrEra: '2008',
          similarity: 'Strukturaviy oʻzgarishlar va narx shakllanishidagi bosim darajasi oʻxshash.',
          historicalLesson: 'Zaruriy moliyaviy barqarorlashtirish choralari qisqa muddatda joriy qilinmasa, bozor noaniqligi uzoq vaqt saqlanib qoladi.',
          quote: {
            text: "Tarix aynan takrorlanmaydi, lekin ko'pincha qofiyalanadi.",
            author: 'Mark Tven'
          }
        },
        region: category || 'global',
        publishedAt: new Date().toISOString(),
        isFallback: true
      });
    }
  };

  const closeArticle = () => {
    setArticleModalOpen(false);
  };

  const handleBookmarkActiveArticle = () => {
    if (!activeArticleData) return;
    const art: Article = {
      id: `saved-${Date.now()}`,
      title: activeArticleData.title,
      description: activeArticleData.dek,
      url: window.location.href,
      source: activeArticleData.sources?.[0]?.name || 'Humayro AI',
      publishedAt: activeArticleData.publishedAt || new Date().toISOString(),
      category: activeArticleData.region
    };
    toggleBookmark(art);
    setUser(getUserProfile());
  };

  const handleSelectBookmarkArticle = (art: Article) => {
    setAuthModalOpen(false);
    openArticle(art.title, art.category, art.id);
  };

  // AI Search & Autonomous Query Synthesizer
  const handleSearchSubmit = async (queryText: string) => {
    if (!queryText.trim()) return;

    recordAiQuery();
    addSearchHistory(queryText.trim());
    setUser(getUserProfile());

    const userMsgId = `msg-user-${Date.now()}`;
    const aiMsgId = `msg-ai-${Date.now()}`;

    setChatMessages(prev => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: queryText,
        timestamp: new Date().toLocaleTimeString()
      },
      {
        id: aiMsgId,
        sender: 'ai',
        isLoading: true,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);

    setChatLoading(true);
    scrollToSection('ai');

    let synthesisResult: AiSynthesisResponse | null = null;
    let errorMessage: string | null = null;

    try {
      synthesisResult = await synthesizeAiQuery(queryText, currentLang);
    } catch (err: any) {
      errorMessage = err?.message || "Kechirasiz, sun'iy intellekt tahlilini amalga oshirishda uzilish yuz berdi.";
    } finally {
      setChatLoading(false);
      setUser(getUserProfile());
    }

    setChatMessages(prev =>
      prev.map(msg => {
        if (msg.id === aiMsgId) {
          if (synthesisResult) {
            return {
              ...msg,
              isLoading: false,
              synthesis: synthesisResult
            };
          } else {
            return {
              ...msg,
              isLoading: false,
              error: errorMessage || "Kechirasiz, sun'iy intellekt tahlilini amalga oshirishda uzilish yuz berdi. Iltimos, qayta urinib ko'ring."
            };
          }
        }
        return msg;
      })
    );
  };

  return (
    <div id="home" className="min-h-screen bg-[#05070A] text-[#F5F7FA] font-['Inter'] relative selection:bg-[#FF6A00] selection:text-black">
      {/* Subtle cursor glow */}
      <CursorGlow />

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

      {/* Live Signal Bar */}
      <SignalBar
        articles={liveArticles.length > 0 ? liveArticles : tickerArticles}
        currentLang={currentLang}
        onSelectArticle={(a) => openArticle(a.title, a.category, a.id)}
      />

      {/* Main Page Content */}
      <main className="pb-20 md:pb-0">
        {/* Intelligence Hero & AI Search */}
        <IntelligenceHero
          dict={dict}
          currentLang={currentLang}
          onSearch={handleSearchSubmit}
          isLoading={chatLoading}
          trendingHotspots={trendingHotspots}
        />

        {/* Global Intelligence Metrics */}
        <SignalMetrics
          totalArticlesCount={liveArticles.length}
          trendingCount={trendingHotspots?.uzbekistan?.length || 18}
          aiAnalyzedCount={liveArticles.length * 3}
          currentLang={currentLang}
        />

        {/* Interactive HUMAYRO Intelligence Command Center */}
        <IntelligenceCommandCenter
          articles={liveArticles}
          regionalArticles={regionalArticles}
          trendingHotspots={trendingHotspots}
          isRefreshing={isLiveRefreshing}
          lastUpdated={lastLiveUpdated}
          currentLang={currentLang}
          onSelectArticle={(a) => openArticle(a.title, a.category, a.id)}
        />

        {/* Live Intelligence Feed & Cards */}
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

        {/* HUMAYRO AI Intelligence Brief */}
        <ChatSection
          dict={dict}
          activeConversation={chatMessages}
          onSendMessage={handleSearchSubmit}
          isLoading={chatLoading}
          currentLang={currentLang}
        />
      </main>

      {/* Footer */}
      <Footer dict={dict} onOpenAdmin={() => setAdminModalOpen(true)} />

      {/* Mobile Bottom Navigation */}
      <BottomNav
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenBookmarks={() => setAuthModalOpen(true)}
        currentLang={currentLang}
      />

      {/* Right-Side Intelligence Reader Drawer */}
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
