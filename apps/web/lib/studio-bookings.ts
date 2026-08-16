import { formatCedis } from '@/lib/api';
import { lookSharePath } from '@/lib/look-share';

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
    return {
      day: formatBookingDate(booking.scheduledDate),
      time: booking.scheduledTime ? formatBookingTime(booking.scheduledTime) : '',
    };
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

async function lookImageToFile(imageUrl: string | undefined, styleName: string) {
  const raw = imageUrl?.trim();
  if (!raw || typeof window === 'undefined') return null;
  const safe = styleName.replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'look';
  try {
    if (raw.startsWith('data:image/')) {
      const match = raw.match(/^data:(image\/[\w.+-]+);base64,([A-Za-z0-9+/=\s]+)$/);
      if (!match) return null;
      const binary = atob(match[2].replace(/\s/g, ''));
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
      const type = match[1];
      const ext = type.split('/')[1]?.split('+')[0] || 'jpg';
      return new File([bytes], `${safe}.${ext}`, { type });
    }
    const src = raw.startsWith('/') ? new URL(raw, window.location.origin).href : raw;
    const response = await fetch(src);
    if (!response.ok) return null;
    const blob = await response.blob();
    if (!blob.type.startsWith('image/') && blob.size < 20) return null;
    const type = blob.type.startsWith('image/') ? blob.type : 'image/jpeg';
    const ext = type.split('/')[1]?.split('+')[0] || 'jpg';
    return new File([blob], `${safe}.${ext}`, { type });
  } catch {
    return null;
  }
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
  if (/^https:\/\//i.test(raw)) return raw;
  return '';
}

async function fileToJpegFile(file: File) {
  try {
    const bitmap = await createImageBitmap(file);
    const max = 1600;
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.fillStyle = '#171211';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (value) => (value ? resolve(value) : reject(new Error('Could not convert image'))),
        'image/jpeg',
        0.86,
      );
    });
    return new File([blob], 'look.jpg', { type: 'image/jpeg' });
  } catch {
    return file;
  }
}

async function ensureWhatsAppPhotoUrl(imageUrl?: string, styleName?: string, preparedFile?: File | null) {
  const existing = absoluteUrl(imageUrl);
  if (existing && isDurablePublicImageUrl(existing)) return existing;
  const file = preparedFile || (await lookImageToFile(imageUrl, styleName || 'look'));
  if (!file) return existing && !isLocalHostUrl(existing) ? existing : '';
  try {
    const jpeg = await fileToJpegFile(file);
    const form = new FormData();
    form.append('file', jpeg, 'look.jpg');
    const response = await fetch('/api/studio/share-look', { method: 'POST', body: form });
    const payload = (await response.json().catch(() => null)) as { url?: string } | null;
    if (!response.ok || !payload?.url) return existing && !isLocalHostUrl(existing) ? existing : '';
    const uploaded = payload.url.startsWith('http') ? payload.url : new URL(payload.url, window.location.origin).href;
    return isDurablePublicImageUrl(uploaded) ? uploaded : existing && !isLocalHostUrl(existing) ? existing : uploaded;
  } catch {
    return existing && !isLocalHostUrl(existing) ? existing : '';
  }
}

function whatsAppPreviewUrl(imageUrl: string, styleName: string) {
  if (!imageUrl || typeof window === 'undefined') return '';
  const origin = window.location.origin;
  if (isLocalHostUrl(origin)) return isDurablePublicImageUrl(imageUrl) ? imageUrl : '';
  return new URL(lookSharePath(imageUrl, styleName), origin).href;
}

async function copyImageFileToClipboard(file: File) {
  if (!navigator.clipboard || typeof ClipboardItem === 'undefined') return;
  try {
    await navigator.clipboard.write([new ClipboardItem({ [file.type]: file })]);
  } catch {
    try {
      const png = await fileToPngFile(file);
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': png })]);
    } catch {
      /* paste fallback unavailable */
    }
  }
}

async function fileToPngFile(file: File) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not convert image');
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => (value ? resolve(value) : reject(new Error('Could not convert image'))), 'image/png');
  });
  return new File([blob], 'look.png', { type: 'image/png' });
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
  lines.push('', `*Date:* ${day}`);
  if (time) {
    lines.push(`*Time:* ${time}`);
  }
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
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(text)}`;
}

function buildWhatsAppAppUrl(text: string) {
  return `whatsapp://send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(text)}`;
}

function clickHiddenLink(href: string) {
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.rel = 'noopener noreferrer';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function launchWhatsAppApp(text: string, tab?: Window | null) {
  const appUrl = buildWhatsAppAppUrl(text);
  const httpsUrl = buildWhatsAppUrl(text);

  clickHiddenLink(appUrl);

  if (tab && !tab.closed) {
    tab.opener = null;
    try {
      tab.location.replace(appUrl);
    } catch {
      tab.location.replace(httpsUrl);
      return httpsUrl;
    }
    window.setTimeout(() => {
      try {
        if (document.hidden || document.visibilityState === 'hidden') {
          tab.close();
          return;
        }
        if (!tab.closed) tab.location.replace(httpsUrl);
      } catch {
        try {
          tab.close();
        } catch {
          /* the native app already took over */
        }
      }
    }, 700);
    return httpsUrl;
  }

  window.setTimeout(() => {
    if (!document.hidden) clickHiddenLink(httpsUrl);
  }, 700);
  return httpsUrl;
}

async function shareLookToWhatsApp(file: File, text: string) {
  const jpeg = await fileToJpegFile(file);
  const payload = { files: [jpeg], text, title: `${STUDIO_NAME} booking` };
  if (!navigator.canShare?.({ files: [jpeg] })) return false;
  try {
    await navigator.share(payload);
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return true;
    return false;
  }
}

export async function openWhatsAppBooking(
  input: Parameters<typeof buildWhatsAppBookingMessage>[0],
) {
  if (typeof window === 'undefined') return '#';
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const tab = isMobile ? null : window.open('about:blank', '_blank');
  const file = await lookImageToFile(input.imageUrl, input.styleName);
  const jpeg = file ? await fileToJpegFile(file) : null;
  const hostedImage = await ensureWhatsAppPhotoUrl(input.imageUrl, input.styleName, jpeg);
  const previewUrl = hostedImage ? whatsAppPreviewUrl(hostedImage, input.styleName || 'Look') : '';
  const text = buildWhatsAppBookingMessage({ ...input, imageUrl: previewUrl || hostedImage });
  if (jpeg) {
    const shareText = `Please send this to ${STUDIO_NAME} (${DISPLAY_PHONE}).\n\n${text}`;
    const shared = await shareLookToWhatsApp(jpeg, shareText);
    if (shared) {
      try {
        tab?.close();
      } catch {
        /* share sheet already took over */
      }
      return buildWhatsAppUrl(text);
    }
    await copyImageFileToClipboard(jpeg);
  }
  return launchWhatsAppApp(text, tab);
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

export function createStudioBooking(input: {
  look: BookableLook;
  clientName: string;
  clientPhone?: string;
  location: string;
  scheduledDate: string;
  scheduledTime: string;
  notes: string;
  destination: 'PORTAL' | 'WHATSAPP';
}) {
  const reference = `NA-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
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
    scheduledAt: `${input.scheduledDate}T${input.scheduledTime}:00`,
    scheduledDate: input.scheduledDate,
    scheduledTime: input.scheduledTime,
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
