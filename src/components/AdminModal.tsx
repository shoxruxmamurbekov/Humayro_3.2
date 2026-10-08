import React, { useState, useEffect } from 'react';
import { X, Shield, Activity, RefreshCw, Server, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { SystemMetrics } from '../types';
import { fetchSystemMetrics } from '../services/api';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [tokenInput, setTokenInput] = useState('');
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('humayro31_admin_token'));
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadMetrics = async (token: string) => {
    setLoading(true);
    setError(null);
    const data = await fetchSystemMetrics(token);
    setLoading(false);
    if (!data) {
      setError('Invalid admin secret key or unauthorized access.');
      setAuthToken(null);
      localStorage.removeItem('humayro31_admin_token');
    } else {
      setMetrics(data);
      setAuthToken(token);
      localStorage.setItem('humayro31_admin_token', token);
    }
  };

  useEffect(() => {
    if (isOpen && authToken) {
      loadMetrics(authToken);
    }
  }, [isOpen, authToken]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    loadMetrics(tokenInput.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-[620px] rounded-3xl bg-[#0d0d0f] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FF6A00]/20 flex items-center justify-center text-[#FF6A00]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] font-bold text-base sm:text-lg text-white">
                Humayro 3.3 · System Intelligence Desk
              </h3>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
                Protected Observability Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {authToken && (
              <button
                onClick={() => loadMetrics(authToken)}
                disabled={loading}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="Refresh Metrics"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#FF6A00]' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {!authToken || !metrics ? (
            /* Passkey Authenticate */
            <form onSubmit={handleLogin} className="flex flex-col gap-4 py-4">
              <p className="text-xs text-zinc-400 leading-relaxed">
                Enter the system admin secret token configured in your server environment to inspect real-time news ingestion metrics, AI provider status, and request counts.
              </p>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 font-mono">
                  Admin Passkey
                </label>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={e => setTokenInput(e.target.value)}
                  placeholder="Enter admin secret..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-sm outline-none focus:border-[#FF6A00]"
                />
              </div>

              {error && <p className="text-xs text-rose-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-[#FF6A00] text-black font-semibold text-sm hover:bg-[#FF8A24] transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Access System Desk'}
              </button>
            </form>
          ) : (
            /* System Telemetry Dashboard */
            <div className="flex flex-col gap-6">
              {/* Top Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                    Searches
                  </span>
                  <span className="font-['Space_Grotesk'] text-2xl font-bold text-white">
                    {metrics.totalSearches}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                    AI Queries
                  </span>
                  <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#FF6A00]">
                    {metrics.aiRequests}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                    Cache Keys
                  </span>
                  <span className="font-['Space_Grotesk'] text-2xl font-bold text-cyan-400">
                    {metrics.cachedQueries}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                    Uptime
                  </span>
                  <span className="font-['Space_Grotesk'] text-lg font-bold text-emerald-400 font-mono">
                    {Math.floor(metrics.uptimeSeconds / 60)}m {metrics.uptimeSeconds % 60}s
                  </span>
                </div>
              </div>

              {/* Provider Health Matrix */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-white/5">
                  <span className="font-semibold uppercase tracking-wider text-zinc-400">AI Provider</span>
                  <span className="font-semibold uppercase tracking-wider text-zinc-400">Health State</span>
                </div>

                {/* Gemini Status */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#FF6A00]" />
                    <span className="font-medium text-white">Google Gemini 2.5 Flash</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-400 font-mono">Primary</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 font-mono text-[11px] ${
                    metrics.geminiConfigured ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {metrics.geminiConfigured ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready (Search Grounding Active)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Not Configured</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Groq / OpenRouter Fallback */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-purple-400" />
                    <span className="font-medium text-white">Groq / OpenRouter</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-400 font-mono">Fallback</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 font-mono text-[11px] ${
                    metrics.groqConfigured || metrics.openRouterConfigured ? 'text-emerald-400' : 'text-zinc-500'
                  }`}>
                    {metrics.groqConfigured || metrics.openRouterConfigured ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Standby Ready</span>
                      </>
                    ) : (
                      <span>RSS Auto-Fallback</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Ingestion & Wire Feed Stats */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Active Live Feed Count:</span>
                  <span className="font-bold text-white">{metrics.feedCount} articles</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Failed / Throttled Requests:</span>
                  <span className={`font-bold ${metrics.failedRequests > 0 ? 'text-rose-400' : 'text-zinc-400'}`}>
                    {metrics.failedRequests}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Last Telemetry Sync:</span>
                  <span className="font-mono text-zinc-500 text-[11px]">
                    {new Date(metrics.lastIngestedAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Logout Token */}
              <button
                onClick={() => {
                  setAuthToken(null);
                  localStorage.removeItem('humayro31_admin_token');
                }}
                className="text-xs text-zinc-500 hover:text-white text-center cursor-pointer transition-colors"
              >
                Sign out of Admin Console
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
