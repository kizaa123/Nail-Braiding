'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  STUDIO_STYLES_EVENT,
  fetchStudioStyles,
  listStudioStyles,
  syncLocalStylesToCloud,
  type StudioStyle,
} from '@/lib/studio-styles';
import { readStudioWriteToken } from '@/lib/studio-session';

export function useStudioCatalog() {
  const [styles, setStyles] = useState<StudioStyle[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const refresh = () => setStyles(listStudioStyles());
    refresh();
    setReady(true);
    void (async () => {
      if (readStudioWriteToken()) {
        await syncLocalStylesToCloud();
      }
      const rows = await fetchStudioStyles();
      if (active) setStyles(rows);
    })();
    window.addEventListener(STUDIO_STYLES_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      active = false;
      window.removeEventListener(STUDIO_STYLES_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const publicStyles = useMemo(
    () =>
      styles
        .filter((style) => style.published && !style.archived)
        .sort((a, b) => Number(b.featured) - Number(a.featured) || b.updatedAt.localeCompare(a.updatedAt)),
    [styles],
  );

  return { styles, publicStyles, ready };
}
