export const STUDIO_PROFILE_KEY = 'kas-studio-profile';
export const STUDIO_PROFILE_EVENT = 'kas-studio-profile-changed';
export const DEFAULT_DISPLAY_PHONE = '0559535682';
export const DEFAULT_WHATSAPP_PHONE = '233559535682';
export const DEFAULT_STUDIO_LOCATION = 'Cape Coast, UCC Campus';
export const DEFAULT_OPEN_TIME = '09:00';
export const DEFAULT_CLOSE_TIME = '17:00';
export const DEFAULT_STUDIO_HOURS = 'Monday – Sunday · 9:00 AM – 5:00 PM';
export const DEFAULT_STUDIO_EMAIL = 'admin@luxe.studio';

export type StudioPublicProfile = {
  ownerName: string;
  email: string;
  displayPhone: string;
  whatsappPhone: string;
  profileImageUrl: string;
  location: string;
  hours: string;
  openTime: string;
  closeTime: string;
};

export type StudioAdminSettings = StudioPublicProfile & {
  hasPassword: boolean;
};

export function defaultStudioProfile(): StudioPublicProfile {
  return {
    ownerName: 'Studio owner',
    email: DEFAULT_STUDIO_EMAIL,
    displayPhone: DEFAULT_DISPLAY_PHONE,
    whatsappPhone: DEFAULT_WHATSAPP_PHONE,
    profileImageUrl: '',
    location: DEFAULT_STUDIO_LOCATION,
    hours: DEFAULT_STUDIO_HOURS,
    openTime: DEFAULT_OPEN_TIME,
    closeTime: DEFAULT_CLOSE_TIME,
  };
}

export function normalizeClock(value: string | undefined, fallback: string) {
  const match = value?.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return fallback;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return fallback;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function formatClockLabel(value: string) {
  const [hour, minute] = normalizeClock(value, DEFAULT_OPEN_TIME).split(':').map(Number);
  return new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(2000, 0, 1, hour, minute));
}

export function formatStudioHours(openTime: string, closeTime: string) {
  return `Monday – Sunday · ${formatClockLabel(openTime)} – ${formatClockLabel(closeTime)}`;
}

export function toWhatsAppDigits(value: string) {
  const digits = value.replace(/\D/g, '');
  if (!digits) return DEFAULT_WHATSAPP_PHONE;
  if (digits.startsWith('233') && digits.length >= 12) return digits;
  if (digits.startsWith('0') && digits.length >= 10) return `233${digits.slice(1)}`;
  if (digits.length === 9) return `233${digits}`;
  return digits;
}

export function normalizeStudioProfile(row?: Partial<StudioPublicProfile> | null): StudioPublicProfile {
  const defaults = defaultStudioProfile();
  const displayPhone = row?.displayPhone?.trim() || defaults.displayPhone;
  return {
    ownerName: row?.ownerName?.trim() || defaults.ownerName,
    email: (row?.email || defaults.email).trim().toLowerCase(),
    displayPhone,
    whatsappPhone: row?.whatsappPhone?.replace(/\D/g, '') || toWhatsAppDigits(displayPhone),
    profileImageUrl: row?.profileImageUrl?.trim() || '',
    location: row?.location?.trim() || defaults.location,
    openTime: normalizeClock(row?.openTime, defaults.openTime),
    closeTime: normalizeClock(row?.closeTime, defaults.closeTime),
    hours: formatStudioHours(
      normalizeClock(row?.openTime, defaults.openTime),
      normalizeClock(row?.closeTime, defaults.closeTime),
    ),
  };
}

function notify() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(STUDIO_PROFILE_EVENT));
}

export function readCachedStudioProfile(): StudioPublicProfile {
  if (typeof window === 'undefined') return defaultStudioProfile();
  try {
    const raw = window.localStorage.getItem(STUDIO_PROFILE_KEY);
    if (!raw) return defaultStudioProfile();
    return normalizeStudioProfile(JSON.parse(raw) as StudioPublicProfile);
  } catch {
    return defaultStudioProfile();
  }
}

export function saveCachedStudioProfile(profile: StudioPublicProfile) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STUDIO_PROFILE_KEY, JSON.stringify(normalizeStudioProfile(profile)));
  notify();
}

export function cachedDisplayPhone() {
  return readCachedStudioProfile().displayPhone;
}

export function cachedWhatsAppPhone() {
  return readCachedStudioProfile().whatsappPhone;
}

export function cachedStudioLocation() {
  return readCachedStudioProfile().location;
}
