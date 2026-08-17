import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  STUDIO_ADMIN_COOKIE,
  loginStudioOwner,
  signStudioAdminToken,
  studioCookieOptions,
} from '@/lib/studio-auth';
import { studioCloudConfigured } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;
  const owner = await loginStudioOwner(String(body?.email ?? ''), String(body?.password ?? ''));
  if (!owner) {
    return NextResponse.json({ error: 'Wrong email or password.' }, { status: 401 });
  }
  const token = signStudioAdminToken(owner.email);
  const response = NextResponse.json({
    ok: true,
    cloud: studioCloudConfigured(),
    token,
    user: { email: owner.email, role: owner.role },
  });
  response.cookies.set(STUDIO_ADMIN_COOKIE, token, studioCookieOptions());
  return response;
}

export async function DELETE() {
  const store = await cookies();
  store.delete(STUDIO_ADMIN_COOKIE);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(STUDIO_ADMIN_COOKIE, '', { ...studioCookieOptions(), maxAge: 0 });
  return response;
}
