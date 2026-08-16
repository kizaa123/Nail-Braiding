'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  STUDIO_STYLES_EVENT,
  allowLocalCatalog,
  fetchStudioStyles,
  listStudioStyles,
  syncLocalStylesToCloud,
  type StudioStyle,
} from '@/lib/studio-styles';
import { readStudioWriteToken } from '@/lib/studio-session';

export function useStudioCatalog(initialStyles: StudioStyle[] = []) {
  const seed = useRef(initialStyles);
  if (initialStyles.length) seed.current = initialStyles;
  const [styles, setStyles] = useState<StudioStyle[]>(initialStyles);
  const [ready, setReady] = useState(initialStyles.length > 0);

  useEffect(() => {
    let active = true;
    const apply = (rows: StudioStyle[]) => {
      if (!active) return;
      if (rows.length) {
        setStyles(rows);
      } else if (allowLocalCatalog()) {
        setStyles(listStudioStyles());
      } else {
        setStyles(seed.current);
      }
      setReady(true);
    };
    void (async () => {
      if (readStudioWriteToken()) {
        await syncLocalStylesToCloud();
      }
      apply(await fetchStudioStyles());
    })();
    const refresh = () => {
      void fetchStudioStyles().then(apply);
    };
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
