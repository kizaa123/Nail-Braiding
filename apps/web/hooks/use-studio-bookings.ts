'use client';

import { useEffect, useState } from 'react';
import {
  STUDIO_BOOKINGS_EVENT,
  fetchStudioBookings,
  listStudioBookings,
  type StudioBooking,
} from '@/lib/studio-bookings';

export function useStudioBookings() {
  const [bookings, setBookings] = useState<StudioBooking[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const refresh = () => setBookings(listStudioBookings());
    refresh();
    setReady(true);
    void fetchStudioBookings().then((rows) => {
      if (active) setBookings(rows);
    });
    window.addEventListener(STUDIO_BOOKINGS_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      active = false;
      window.removeEventListener(STUDIO_BOOKINGS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return { bookings, ready };
}
