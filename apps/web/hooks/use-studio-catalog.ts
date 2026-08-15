'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  STUDIO_STYLES_EVENT,
  listStudioStyles,
  type StudioStyle,
} from '@/lib/studio-styles';

export function useStudioCatalog() {
  const [styles, setStyles] = useState<StudioStyle[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const refresh = () => setStyles(listStudioStyles());
    refresh();
    setReady(true);
    window.addEventListener(STUDIO_STYLES_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
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
