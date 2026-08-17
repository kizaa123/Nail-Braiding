'use client';

import { useEffect, useState } from 'react';
import {
  STUDIO_PROFILE_EVENT,
  defaultStudioProfile,
  readCachedStudioProfile,
  saveCachedStudioProfile,
  type StudioPublicProfile,
} from '@/lib/studio-profile';

export function useStudioProfile() {
  const [profile, setProfile] = useState<StudioPublicProfile>(defaultStudioProfile);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const cached = readCachedStudioProfile();
    setProfile(cached);
    setReady(true);
    const refresh = () => setProfile(readCachedStudioProfile());
    window.addEventListener(STUDIO_PROFILE_EVENT, refresh);
    window.addEventListener('storage', refresh);
    void fetch('/api/studio/profile', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data: { profile?: StudioPublicProfile }) => {
        if (data?.profile) {
          saveCachedStudioProfile(data.profile);
          setProfile(readCachedStudioProfile());
        }
      })
      .catch(() => {
        /* keep cached defaults */
      });
    return () => {
      window.removeEventListener(STUDIO_PROFILE_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return { profile, ready };
}
