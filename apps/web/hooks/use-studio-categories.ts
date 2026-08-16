'use client';

import { useEffect, useState } from 'react';
import {
  STUDIO_CATEGORIES_EVENT,
  fetchStudioCategories,
  listStudioCategories,
  type StudioCategoryMap,
} from '@/lib/studio-categories';

export function useStudioCategories() {
  const [categories, setCategories] = useState<StudioCategoryMap>({ HAIR: [], NAILS: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const refresh = () => setCategories(listStudioCategories());
    refresh();
    setReady(true);
    void fetchStudioCategories().then((rows) => {
      if (active) setCategories(rows);
    });
    window.addEventListener(STUDIO_CATEGORIES_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      active = false;
      window.removeEventListener(STUDIO_CATEGORIES_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return { categories, ready };
}
