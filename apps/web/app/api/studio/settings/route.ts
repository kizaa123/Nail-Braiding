import { NextResponse } from 'next/server';
import {
  cloudUnavailable,
  currentPasswordValid,
  hashStudioPassword,
  requireStudioAdmin,
  unauthorized,
} from '@/lib/studio-auth';
import { dbGetStudioSettings, dbSaveStudioSettings } from '@/lib/studio-db';
import {
  formatStudioHours,
  normalizeClock,
  normalizeStudioProfile,
  toWhatsAppDigits,
  DEFAULT_CLOSE_TIME,
  DEFAULT_OPEN_TIME,
} from '@/lib/studio-profile';
import { studioCloudConfigured } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!studioCloudConfigured()) return cloudUnavailable();
  if (!(await requireStudioAdmin(request))) return unauthorized();
  try {
    const settings = await dbGetStudioSettings();
    const profile = normalizeStudioProfile(settings);
    return NextResponse.json({
      settings: {
        ...profile,
        hasPassword: Boolean(settings.passwordHash),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load settings.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!studioCloudConfigured()) return cloudUnavailable();
  if (!(await requireStudioAdmin(request))) return unauthorized();
  const body = (await request.json().catch(() => null)) as {
    ownerName?: string;
    email?: string;
    displayPhone?: string;
    location?: string;
    hours?: string;
    openTime?: string;
    closeTime?: string;
    profileImageUrl?: string;
    currentPassword?: string;
    newPassword?: string;
  } | null;
  if (!body) return NextResponse.json({ error: 'Invalid settings.' }, { status: 400 });

  try {
    const current = await dbGetStudioSettings();
    const openTime = normalizeClock(body.openTime, current.openTime || DEFAULT_OPEN_TIME);
    const closeTime = normalizeClock(body.closeTime, current.closeTime || DEFAULT_CLOSE_TIME);
    const next = normalizeStudioProfile({
      ...current,
      ownerName: body.ownerName,
      email: body.email,
      displayPhone: body.displayPhone,
      location: body.location,
      openTime,
      closeTime,
      hours: formatStudioHours(openTime, closeTime),
      profileImageUrl: body.profileImageUrl,
    });
    next.whatsappPhone = toWhatsAppDigits(next.displayPhone);

    let passwordHash = current.passwordHash;
    const newPassword = body.newPassword?.trim() ?? '';
    if (newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 });
      }
      if (!currentPasswordValid(String(body.currentPassword ?? ''), current.passwordHash)) {
        return NextResponse.json({ error: 'Current password is not correct.' }, { status: 400 });
      }
      passwordHash = hashStudioPassword(newPassword);
    }

    const saved = await dbSaveStudioSettings({
      ...next,
      passwordHash,
    });
    if (!saved) return cloudUnavailable();
    return NextResponse.json({
      settings: {
        ...normalizeStudioProfile(saved),
        hasPassword: Boolean(saved.passwordHash),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not save settings.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
