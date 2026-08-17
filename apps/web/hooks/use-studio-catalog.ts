'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  STUDIO_STYLES_EVENT,
  allowLocalCatalog,
  fetchStudioStyles,
  isPublicLookImageUrl,
  listStudioStyles,
  syncLocalStylesToCloud,
  type StudioStyle,
} from '@/lib/studio-styles';
import { readStudioSession, readStudioWriteToken } from '@/lib/studio-session';

function preferPublicImages(remote: StudioStyle[], seed: StudioStyle[]) {
  if (!remote.length) return seed;
  const seedById = new Map(seed.map((style) => [style.id, style]));
  return remote.map((style) => {
    if (isPublicLookImageUrl(style.imageUrl)) return style;
    const fallback = seedById.get(style.id)?.imageUrl ?? '';
    return isPublicLookImageUrl(fallback) ? { ...style, imageUrl: fallback } : { ...style, imageUrl: '' };
  });
}

export function useStudioCatalog(initialStyles: StudioStyle[] = []) {
  const seed = useRef(initialStyles);
  if (initialStyles.length) seed.current = initialStyles;
  const [styles, setStyles] = useState<StudioStyle[]>(() => initialStyles);
  const [ready, setReady] = useState(true);

  useEffect(() => {
    let active = true;
    const apply = (rows: StudioStyle[]) => {
      if (!active) return;
      const next = preferPublicImages(rows, seed.current);
      if (next.length) {
        setStyles(next);
        seed.current = next;
      } else if (allowLocalCatalog()) {
        const local = listStudioStyles();
        setStyles(local.length ? local : seed.current);
      } else if (seed.current.length) {
        setStyles(seed.current);
      } else {
        setStyles([]);
      }
      setReady(true);
    };
    const localSnapshot = listStudioStyles();
    apply(seed.current.length ? seed.current : allowLocalCatalog() ? localSnapshot : []);
    void (async () => {
      try {
        apply(await fetchStudioStyles());
      } catch {
        apply(seed.current.length ? seed.current : allowLocalCatalog() ? localSnapshot : []);
      }
      if (readStudioWriteToken() || readStudioSession()) {
        try {
          await syncLocalStylesToCloud(localSnapshot);
          if (active) apply(await fetchStudioStyles());
        } catch {
          /* catalog already showing the cloud copy */
        }
      }
    })();
    const refresh = () => {
      void fetchStudioStyles()
        .then(apply)
        .catch(() => apply(seed.current.length ? seed.current : allowLocalCatalog() ? listStudioStyles() : []));
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
