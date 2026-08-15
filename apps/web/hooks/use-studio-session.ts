'use client';

import { useEffect, useState } from 'react';
import {
  STUDIO_SESSION_EVENT,
  readStudioSession,
  type StudioSession,
} from '@/lib/studio-session';

export function useStudioSession() {
  const [session, setSession] = useState<StudioSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const refresh = () => setSession(readStudioSession());
    refresh();
    setReady(true);
    window.addEventListener(STUDIO_SESSION_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(STUDIO_SESSION_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return { session, ready };
}
