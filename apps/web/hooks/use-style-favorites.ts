'use client';

import { useEffect, useState } from 'react';
import {
  STYLE_FAVORITES_EVENT,
  getStyleFavoriteCount,
  isStyleFavorited,
  listStyleFavoriteCounts,
  toggleStyleFavorite,
} from '@/lib/studio-favorites';

export function useStyleFavorite(styleId: string) {
  const [saved, setSaved] = useState(false);
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setSaved(isStyleFavorited(styleId));
      setCount(getStyleFavoriteCount(styleId));
    };
    refresh();
    setReady(true);
    window.addEventListener(STYLE_FAVORITES_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(STYLE_FAVORITES_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [styleId]);

  const toggle = () => {
    const next = toggleStyleFavorite(styleId);
    setSaved(next);
    setCount(getStyleFavoriteCount(styleId));
  };

  return { saved, count, ready, toggle };
}

export function useStyleFavoriteCounts() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const refresh = () => setCounts({ ...listStyleFavoriteCounts() });
    refresh();
    window.addEventListener(STYLE_FAVORITES_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(STYLE_FAVORITES_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return counts;
}
