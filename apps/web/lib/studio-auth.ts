import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyStudioOwner } from '@/lib/studio-session';
import { dbGetStudioSettings } from '@/lib/studio-db';

export const STUDIO_ADMIN_COOKIE = 'kas_studio_admin';

function secret() {
  return process.env.STUDIO_AUTH_SECRET || process.env.AUTH_SECRET || 'kas-beauty-plus-change-this-secret';
}

export function signStudioAdminToken(email: string) {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `${email}|${exp}`;
  const sig = createHmac('sha256', secret()).update(payload).digest('hex');
  return `${payload}|${sig}`;
}

export function readStudioAdminEmail(token?: string | null) {
  if (!token) return null;
  const parts = token.split('|');
  if (parts.length !== 3) return null;
  const [email, expRaw, sig] = parts;
  const payload = `${email}|${expRaw}`;
  const expected = createHmac('sha256', secret()).update(payload).digest('hex');
  const a = Buffer.from(sig, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(expRaw) < Date.now()) return null;
  return email;
}

export function studioCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.VERCEL === '1',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  };
}

export async function requireStudioAdmin(request?: Request) {
  const auth = request?.headers.get('authorization');
  const bearer = auth?.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : '';
  const fromHeader = readStudioAdminEmail(bearer);
  if (fromHeader) return fromHeader;
  const store = await cookies();
  return readStudioAdminEmail(store.get(STUDIO_ADMIN_COOKIE)?.value);
}

export function unauthorized() {
  return NextResponse.json({ error: 'Sign in as the studio owner first.' }, { status: 401 });
}

export function cloudUnavailable() {
  return NextResponse.json(
    { cloud: false, error: 'Studio cloud is not configured. Set DATABASE_URL on Vercel, then redeploy.' },
    { status: 503 },
  );
}

export function hashStudioPassword(password: string) {
  return createHmac('sha256', secret()).update(`kas-pw:${password}`).digest('hex');
}

export function studioPasswordsMatch(password: string, hash: string) {
  if (!password || !hash) return false;
  const a = Buffer.from(hashStudioPassword(password), 'utf8');
  const b = Buffer.from(hash, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function currentPasswordValid(password: string, storedHash?: string) {
  if (storedHash && studioPasswordsMatch(password, storedHash)) return true;
  return Boolean(
    verifyStudioOwner('admin@luxe.studio', password) ||
      verifyStudioOwner('admin@noir-atelier.dev', password),
  );
}

export async function loginStudioOwner(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  try {
    const settings = await dbGetStudioSettings();
    const settingsEmail = settings.email.trim().toLowerCase();
    if (settings.passwordHash) {
      if (normalized === settingsEmail && studioPasswordsMatch(password, settings.passwordHash)) {
        return { email: settings.email, password, role: 'ADMIN' as const };
      }
      const seedEmail = (process.env.SEED_ADMIN_EMAIL || '').trim().toLowerCase();
      const seedPassword = process.env.SEED_ADMIN_PASSWORD || '';
      if (seedEmail && seedPassword && normalized === seedEmail && password === seedPassword) {
        return { email: seedEmail, password: seedPassword, role: 'ADMIN' as const };
      }
      return null;
    }
    if (settingsEmail && normalized === settingsEmail && currentPasswordValid(password)) {
      return { email: settings.email, password, role: 'ADMIN' as const };
    }
  } catch {
    /* fall through to built-in owners */
  }
  return verifyStudioOwner(email, password);
}
