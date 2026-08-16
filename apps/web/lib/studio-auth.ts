import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyStudioOwner } from '@/lib/studio-session';

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
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  };
}

export async function requireStudioAdmin() {
  const store = await cookies();
  const email = readStudioAdminEmail(store.get(STUDIO_ADMIN_COOKIE)?.value);
  if (!email) return null;
  return email;
}

export function unauthorized() {
  return NextResponse.json({ error: 'Sign in as the studio owner first.' }, { status: 401 });
}

export function cloudUnavailable() {
  return NextResponse.json({ cloud: false, error: 'Studio cloud is not configured.' }, { status: 503 });
}

export function loginStudioOwner(email: string, password: string) {
  return verifyStudioOwner(email, password);
}
