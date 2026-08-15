'use client';

import { useEffect, useState } from 'react';
import {
  STUDIO_CATEGORIES_EVENT,
  listStudioCategories,
  type StudioCategoryMap,
} from '@/lib/studio-categories';

export function useStudioCategories() {
  const [categories, setCategories] = useState<StudioCategoryMap>({ HAIR: [], NAILS: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const refresh = () => setCategories(listStudioCategories());
    refresh();
    setReady(true);
    window.addEventListener(STUDIO_CATEGORIES_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(STUDIO_CATEGORIES_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return { categories, ready };
}
