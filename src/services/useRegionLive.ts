import { useState, useEffect, useCallback, useRef } from 'react';
import { SupportedLanguage } from '../types';
import { fetchRegionLive, RegionLiveResponse } from './api';

const REGION_REFRESH_SECONDS = 30;

export interface RegionLiveState {
  data: RegionLiveResponse | null;
  isLoading: boolean;
  error: boolean;
  lastUpdated: Date | null;
  countdown: number;
  refreshNow: () => Promise<void>;
}

/**
 * Fetches and auto-refreshes live news + weather for the currently selected map region.
 * Pass null when no region is selected (no requests are made).
 */
export function useRegionLive(regionKey: string | null, lang: SupportedLanguage): RegionLiveState {
  const [data, setData] = useState<RegionLiveResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(REGION_REFRESH_SECONDS);
  const requestId = useRef(0);

  const load = useCallback(
    async (silent: boolean) => {
      if (!regionKey) return;
      const id = ++requestId.current;
      if (!silent) setIsLoading(true);
      try {
        const res = await fetchRegionLive(regionKey, lang);
        if (id !== requestId.current) return; // stale response (region/lang changed)
        setData(res);
        setError(false);
        setLastUpdated(new Date());
        setCountdown(REGION_REFRESH_SECONDS);
      } catch {
        if (id !== requestId.current) return;
        setError(true);
      } finally {
        if (id === requestId.current) setIsLoading(false);
      }
    },
    [regionKey, lang]
  );

  // Reset + load when region or language changes
  useEffect(() => {
    setData(null);
    setError(false);
    setLastUpdated(null);
    setCountdown(REGION_REFRESH_SECONDS);
    if (regionKey) load(false);
    return () => {
      requestId.current++;
    };
  }, [regionKey, lang, load]);

  // Poll while a region is selected and the tab is visible
  useEffect(() => {
    if (!regionKey) return;
    const timer = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      setCountdown(prev => {
        if (prev <= 1) {
          load(true);
          return REGION_REFRESH_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [regionKey, load]);

  return { data, isLoading, error, lastUpdated, countdown, refreshNow: () => load(false) };
}
