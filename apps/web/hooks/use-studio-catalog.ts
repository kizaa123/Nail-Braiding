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
  const [styles, setStyles] = useState<StudioStyle[]>(() => initialStyles);
  const [ready, setReady] = useState(true);

  useEffect(() => {
    let active = true;
    const apply = (rows: StudioStyle[]) => {
      if (!active) return;
      if (rows.length) {
        setStyles(rows);
      } else if (allowLocalCatalog()) {
        const local = listStudioStyles();
        setStyles(local.length ? local : seed.current);
      } else {
        setStyles(seed.current);
      }
      setReady(true);
    };
    apply(seed.current.length ? seed.current : listStudioStyles());
    void (async () => {
      try {
        apply(await fetchStudioStyles());
      } catch {
        apply(listStudioStyles());
      }
      if (readStudioWriteToken()) {
        void syncLocalStylesToCloud()
          .then(() => fetchStudioStyles())
          .then(apply)
          .catch(() => undefined);
      }
    })();
    const refresh = () => {
      const local = listStudioStyles();
      if (local.length) apply(local);
      void fetchStudioStyles().then(apply).catch(() => apply(local));
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
