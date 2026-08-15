'use client';

import { useEffect, useState } from 'react';
import {
  STUDIO_BOOKINGS_EVENT,
  listStudioBookings,
  type StudioBooking,
} from '@/lib/studio-bookings';

export function useStudioBookings() {
  const [bookings, setBookings] = useState<StudioBooking[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const refresh = () => setBookings(listStudioBookings());
    refresh();
    setReady(true);
    window.addEventListener(STUDIO_BOOKINGS_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(STUDIO_BOOKINGS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return { bookings, ready };
}
