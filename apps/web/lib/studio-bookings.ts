import { formatCedis } from '@/lib/api';

export const STUDIO_BOOKINGS_KEY = 'luxe-studio-bookings';
export const STUDIO_NAME = 'KAS Beauty Plus';
export const STUDIO_LOCATION = 'Cape Coast, UCC Campus';
export const WHATSAPP_PHONE = '233559535682';
export const DISPLAY_PHONE = '0559535682';

export interface BookableLook {
  id: string;
  name: string;
  categoryName: string;
  kind: 'HAIR' | 'NAILS';
  imageUrl: string;
  durationMinutes: number;
  startingPriceMinor: number;
}

export const STUDIO_BOOKINGS_EVENT = 'luxe-bookings-changed';

export type BookingStatus = 'WAITING' | 'APPROVED' | 'SERVED' | 'DECLINED';

export const BOOKING_TIME_SLOTS = Array.from({ length: 17 }, (_, index) => {
  const minutes = 9 * 60 + index * 30;
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
});

export interface StudioBooking {
  id: string;
  reference: string;
  clientName: string;
  clientPhone: string;
  location?: string;
  styleId: string;
  styleName: string;
  styleKind: 'HAIR' | 'NAILS';
  categoryName: string;
  imageUrl: string;
  durationMinutes: number;
  priceMinor: number;
  scheduledAt: string;
  scheduledDate?: string;
  scheduledTime?: string;
  notes: string;
  destination: 'PORTAL' | 'WHATSAPP';
  status: BookingStatus;
  createdAt: string;
}

export function formatBookingDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours && mins) return `${hours}hr ${mins}min`;
  if (hours) return `${hours}hr`;
  return `${mins}min`;
}

export function formatBookingDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return dateStr;
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
}

export function formatBookingTime(timeStr: string) {
  const [hour, minute] = timeStr.split(':').map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return timeStr;
  return new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(2000, 0, 1, hour, minute));
}

export function formatBookingWhen(booking?: string | {
  scheduledAt?: string;
  scheduledDate?: string;
  scheduledTime?: string;
} | null) {
  if (!booking) {
    return { day: 'Date to be confirmed', time: '' };
  }

  if (typeof booking === 'string') {
    const date = new Date(booking);
    if (Number.isNaN(date.getTime())) {
      return { day: booking, time: '' };
    }
    return {
      day: new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date),
      time: new Intl.DateTimeFormat('en-GB', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date),
    };
  }

  if (booking.scheduledDate) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(booking.scheduledDate)) {
      return {
        day: formatBookingDate(booking.scheduledDate),
        time: booking.scheduledTime ? formatBookingTime(booking.scheduledTime) : '',
      };
    }
    return { day: booking.scheduledDate, time: booking.scheduledTime || '' };
  }

  if (!booking.scheduledAt) {
    return { day: 'Date to be confirmed', time: '' };
  }

  const date = new Date(booking.scheduledAt);
  return {
    day: new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date),
    time: new Intl.DateTimeFormat('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date),
  };
}

function isLocalHostUrl(url: string) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(url);
}

function absoluteUrl(imageUrl?: string) {
  const raw = imageUrl?.trim() ?? '';
  if (!raw || raw.startsWith('data:') || raw.startsWith('blob:')) return '';
  if (raw.startsWith('/') && typeof window !== 'undefined') {
    return new URL(raw, window.location.origin).href;
  }
  if (/^https?:\/\//i.test(raw)) return raw;
  return '';
}

function isDurablePublicImageUrl(url: string) {
  if (!/^https:\/\//i.test(url) || isLocalHostUrl(url)) return false;
  if (/\/look-image\//i.test(url)) return false;
  return true;
}

function messagePhotoLine(imageUrl?: string) {
  const raw = absoluteUrl(imageUrl);
  if (!raw || isLocalHostUrl(raw)) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  return '';
}

function syncLookPreviewUrl(imageUrl?: string) {
  const raw = imageUrl?.trim() ?? '';
  if (!raw || raw.startsWith('data:') || raw.startsWith('blob:') || typeof window === 'undefined') return '';
  const abs = raw.startsWith('/') ? new URL(raw, window.location.origin).href : raw;
  return isDurablePublicImageUrl(abs) ? abs : '';
}

export function buildWhatsAppBookingMessage(input: {
  studioName: string;
  reference?: string;
  clientName: string;
  clientPhone?: string;
  location?: string;
  styleName: string;
  categoryName: string;
  imageUrl?: string;
  durationMinutes: number;
  priceMinor: number;
  scheduledAt?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  notes?: string;
}) {
  const { day, time } = formatBookingWhen(input);
  const photo = messagePhotoLine(input.imageUrl);
  const lines = [
    ...(photo ? [photo, ''] : []),
    `Hello ${input.studioName}`,
    '',
    'I would like to book this look:',
    '',
    `*Style:* ${input.styleName}`,
    `*Category:* ${input.categoryName}`,
    `*Duration:* ${formatBookingDuration(input.durationMinutes)}`,
    `*Price:* ${formatCedis(input.priceMinor)}`,
    '',
    `*Name:* ${input.clientName}`,
  ];
  if (input.location?.trim()) {
    lines.push(`*Location:* ${input.location.trim()}`);
  }
  if (input.clientPhone?.trim()) {
    lines.push(`*Phone:* ${input.clientPhone.trim()}`);
  }
  lines.push('', `*Date & time:* ${time ? `${day} · ${time}` : day}`);
  if (input.reference?.trim()) {
    lines.push(`*Reference:* ${input.reference.trim()}`);
  }
  if (input.notes?.trim()) {
    lines.push('', `*Note:* ${input.notes.trim()}`);
  }
  lines.push('', 'Please confirm my appointment. Thank you.');
  return lines.join('\n');
}

export function buildWhatsAppUrl(text: string) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

export function openWhatsAppBooking(input: Parameters<typeof buildWhatsAppBookingMessage>[0]) {
  if (typeof window === 'undefined') return '#';
  try {
    const text = buildWhatsAppBookingMessage({
      ...input,
      reference: undefined,
      imageUrl: syncLookPreviewUrl(input.imageUrl),
    });
    const href = buildWhatsAppUrl(text);
    const mobile = /Android|iPhone|iPad|iPod|webOS|Mobile/i.test(navigator.userAgent);
    if (mobile) {
      window.location.href = href;
      return href;
    }
    const popup = window.open(href, '_blank');
    if (!popup || popup.closed) {
      window.location.href = href;
    } else {
      try {
        popup.opener = null;
      } catch {
        /* ignore */
      }
    }
    return href;
  } catch {
    const fallback = `https://wa.me/${WHATSAPP_PHONE}`;
    try {
      window.location.href = fallback;
    } catch {
      /* ignore */
    }
    return fallback;
  }
}

function notifyBookings() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(STUDIO_BOOKINGS_EVENT));
}

function normalizeBooking(row: StudioBooking): StudioBooking {
  const legacy = row.status as string;
  const status: BookingStatus =
    legacy === 'PENDING' || legacy === 'CONFIRMED'
      ? legacy === 'CONFIRMED'
        ? 'APPROVED'
        : 'WAITING'
      : row.status;
  return { ...row, status };
}

export function listStudioBookings(): StudioBooking[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STUDIO_BOOKINGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StudioBooking[];
    return Array.isArray(parsed)
      ? parsed.map(normalizeBooking).filter((booking) => booking.destination !== 'WHATSAPP')
      : [];
  } catch {
    return [];
  }
}

export function saveStudioBookings(bookings: StudioBooking[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STUDIO_BOOKINGS_KEY, JSON.stringify(bookings));
  notifyBookings();
}

export function saveStudioBooking(booking: StudioBooking) {
  saveStudioBookings([booking, ...listStudioBookings().filter((item) => item.id !== booking.id)]);
}

export function patchStudioBooking(id: string, patch: Partial<StudioBooking>) {
  saveStudioBookings(
    listStudioBookings().map((booking) => (booking.id === id ? { ...booking, ...patch } : booking)),
  );
  void import('@/lib/studio-http').then(({ studioRequest }) =>
    studioRequest(`/api/studio/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),
  );
}

export function deleteStudioBooking(id: string) {
  saveStudioBookings(listStudioBookings().filter((booking) => booking.id !== id));
}

export function parseBookingDateTime(value: string) {
  const label = value.trim().replace(/\s+/g, ' ');
  const parsed = Date.parse(label);
  if (!Number.isNaN(parsed)) {
    const date = new Date(parsed);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return {
      date: `${year}-${month}-${day}`,
      time: `${hour}:${minute}`,
      label,
    };
  }
  return { date: label, time: '', label };
}

export function createStudioBooking(input: {
  look: BookableLook;
  clientName: string;
  clientPhone?: string;
  location: string;
  when: string;
  notes: string;
  destination: 'PORTAL' | 'WHATSAPP';
}) {
  const reference = `NA-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const parsed = parseBookingDateTime(input.when);
  const booking: StudioBooking = {
    id: crypto.randomUUID(),
    reference,
    clientName: input.clientName.trim(),
    clientPhone: input.clientPhone?.trim() ?? '',
    location: input.location.trim(),
    styleId: input.look.id,
    styleName: input.look.name,
    styleKind: input.look.kind,
    categoryName: input.look.categoryName,
    imageUrl: input.look.imageUrl,
    durationMinutes: input.look.durationMinutes,
    priceMinor: input.look.startingPriceMinor,
    scheduledAt: parsed.time ? `${parsed.date}T${parsed.time}:00` : parsed.label,
    scheduledDate: parsed.date,
    scheduledTime: parsed.time,
    notes: input.notes.trim(),
    destination: input.destination,
    status: 'WAITING',
    createdAt: new Date().toISOString(),
  };
  if (input.destination === 'PORTAL') {
    saveStudioBooking(booking);
    void import('@/lib/studio-http').then(({ studioRequest }) =>
      studioRequest('/api/studio/bookings', {
        method: 'POST',
        body: JSON.stringify(booking),
      }),
    );
  }
  return booking;
}

export async function fetchStudioBookings() {
  const { studioRequest } = await import('@/lib/studio-http');
  const result = await studioRequest<{ bookings?: StudioBooking[] }>('/api/studio/bookings');
  if (result.ok && Array.isArray(result.data?.bookings)) {
    saveStudioBookings(result.data.bookings.map(normalizeBooking));
    return listStudioBookings();
  }
  return listStudioBookings();
}
