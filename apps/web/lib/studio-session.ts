export const STUDIO_SESSION_KEY = 'luxe-studio-session';
export const STUDIO_WRITE_TOKEN_KEY = 'kas-studio-write-token';
export const STUDIO_SESSION_EVENT = 'luxe-session-changed';

export type StudioRole = 'ADMIN' | 'PROFESSIONAL';

export interface StudioSession {
  email: string;
  role: StudioRole;
  signedInAt: string;
}

const STUDIO_OWNERS = [
  { email: 'admin@luxe.studio', password: 'LuxeStudio123!', role: 'ADMIN' as const },
  { email: 'admin@noir-atelier.dev', password: 'ChangeMe_Admin_123!', role: 'ADMIN' as const },
];

export const STUDIO_OWNER_HINT = {
  email: STUDIO_OWNERS[0].email,
  password: STUDIO_OWNERS[0].password,
};

function notify() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(STUDIO_SESSION_EVENT));
}

export function readStudioSession(): StudioSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STUDIO_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StudioSession;
    if (!parsed?.email || (parsed.role !== 'ADMIN' && parsed.role !== 'PROFESSIONAL')) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveStudioSession(session: StudioSession) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STUDIO_SESSION_KEY, JSON.stringify(session));
  notify();
}

export function readStudioWriteToken() {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(STUDIO_WRITE_TOKEN_KEY) ?? '';
}

export function saveStudioWriteToken(token: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STUDIO_WRITE_TOKEN_KEY, token);
}

export function clearStudioSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STUDIO_SESSION_KEY);
  window.localStorage.removeItem(STUDIO_WRITE_TOKEN_KEY);
  notify();
}

export function verifyStudioOwner(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  return STUDIO_OWNERS.find((owner) => owner.email === normalized && owner.password === password) ?? null;
}

export function signInStudioOwner(email: string, password: string): StudioSession | null {
  const match = verifyStudioOwner(email, password);
  if (!match) return null;
  const session: StudioSession = {
    email: match.email,
    role: match.role,
    signedInAt: new Date().toISOString(),
  };
  saveStudioSession(session);
  return session;
}

export function pathForRole(role: string) {
  if (role === 'ADMIN' || role === 'PROFESSIONAL') return '/admin';
  return '/styles';
}
