import React, { useState } from 'react';
import {
  X,
  User,
  Bookmark,
  History,
  Trash2,
  LogOut,
  Download,
  Cloud,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Article, UserProfile } from '../types';
import { TranslationDict } from '../i18n/translations';
import {
  loginUser,
  logoutUser,
  clearSearchHistory,
  isSupabaseConfigured
} from '../services/userStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  dict: TranslationDict;
  onSelectArticle: (article: Article) => void;
  onSelectQuery: (query: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  dict,
  onSelectArticle,
  onSelectQuery
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'bookmarks' | 'history'>('profile');

  if (!isOpen) return null;

  const isGuest = !user.email;
  const maxQueries = isGuest ? 50 : 200;
  const queriesRemaining = Math.max(0, maxQueries - user.dailyQueriesUsed);
  const quotaPercent = Math.min(100, Math.round((user.dailyQueriesUsed / maxQueries) * 100));
  const supabaseConnected = isSupabaseConfigured();

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    loginUser(email.trim(), name.trim());
    setEmail('');
    setName('');
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `humayro31_data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-[540px] rounded-3xl bg-[#0d0d0f] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FF6A00]/15 flex items-center justify-center text-[#FF6A00]">
              <User className="w-4 h-4" />
            </div>
            <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white">
              {isGuest
                ? isRegister
                  ? dict.auth_title_signup
                  : dict.auth_title_signin
                : dict.auth_title_profile}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation if logged in */}
        {!isGuest && (
          <div className="flex border-b border-white/10 px-6 gap-6 text-xs font-medium">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'border-[#FF6A00] text-[#FF6A00]'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              {dict.nav_profile}
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'bookmarks'
                  ? 'border-[#FF6A00] text-[#FF6A00]'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <span>{dict.auth_saved_articles}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px]">
                {user.savedArticles.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'border-[#FF6A00] text-[#FF6A00]'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <span>{dict.auth_history}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px]">
                {user.searchHistory.length}
              </span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isGuest ? (
            /* Sign In / Sign Up Form */
            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
              <p className="text-xs text-zinc-400 leading-relaxed mb-2">
                {dict.auth_anonymous_notice}
              </p>

              {isRegister && (
                <div>
                  <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                    {dict.auth_name}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Humayro"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-[#FF6A00]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                  {dict.auth_email}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="analyst@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-[#FF6A00]"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-3 rounded-full bg-[#FF6A00] text-black font-semibold text-sm hover:bg-[#FF8A24] transition-colors cursor-pointer"
              >
                {isRegister ? dict.auth_submit_signup : dict.auth_submit_signin}
              </button>

              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs text-zinc-400 hover:text-white text-center mt-2 transition-colors cursor-pointer"
              >
                {isRegister ? dict.auth_switch_to_signin : dict.auth_switch_to_signup}
              </button>
            </form>
          ) : activeTab === 'profile' ? (
            /* Profile & Daily Quota Dashboard */
            <div className="flex flex-col gap-6">
              {/* User badge */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6A00] to-orange-950 flex items-center justify-center font-bold text-white text-base">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-white text-base">{user.name}</h4>
                  <p className="text-xs text-zinc-400">{user.email}</p>
                </div>
              </div>

              {/* Daily Query Quota Meter */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-medium text-zinc-300">{dict.auth_quota_label}</span>
                  <span className="font-mono text-[#FF6A00]">
                    {user.dailyQueriesUsed} / {maxQueries}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF6A00] to-amber-400 transition-all duration-500"
                    style={{ width: `${quotaPercent}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-zinc-500">
                  {queriesRemaining} queries remaining today (resets daily at midnight).
                </p>
              </div>

              {/* Supabase Cloud Sync Status */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Cloud className="w-4 h-4 text-cyan-400" />
                  <span>{dict.auth_supabase_sync}</span>
                </div>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{supabaseConnected ? 'Active Cloud' : 'Local-First'}</span>
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleExportData}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-300 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>

                <button
                  onClick={() => {
                    logoutUser();
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-medium text-rose-300 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{dict.auth_logout}</span>
                </button>
              </div>
            </div>
          ) : activeTab === 'bookmarks' ? (
            /* Saved Articles List */
            <div className="flex flex-col gap-3">
              {user.savedArticles.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-8">{dict.auth_no_saved}</p>
              ) : (
                user.savedArticles.map(art => (
                  <div
                    key={art.id}
                    onClick={() => {
                      onSelectArticle(art);
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#FF6A00]/40 transition-colors cursor-pointer flex flex-col gap-1"
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#FF6A00]">
                      {art.source}
                    </span>
                    <h5 className="text-sm font-medium text-white line-clamp-2">{art.title}</h5>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Search History List */
            <div className="flex flex-col gap-3">
              <div className="flex justify-end">
                <button
                  onClick={clearSearchHistory}
                  className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{dict.auth_clear_history}</span>
                </button>
              </div>

              {user.searchHistory.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-8">No search history recorded.</p>
              ) : (
                user.searchHistory.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectQuery(item.query);
                      onClose();
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <History className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="text-xs text-zinc-200">{item.query}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
