export const STUDIO_PROFILE_KEY = 'kas-studio-profile';
export const STUDIO_PROFILE_EVENT = 'kas-studio-profile-changed';
export const DEFAULT_DISPLAY_PHONE = '0559535682';
export const DEFAULT_WHATSAPP_PHONE = '233559535682';
export const DEFAULT_STUDIO_LOCATION = 'Cape Coast, UCC Campus';
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
  };
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
    hours: row?.hours?.trim() || defaults.hours,
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
