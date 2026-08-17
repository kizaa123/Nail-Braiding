import { NextResponse } from 'next/server';
import { dbGetStudioSettings } from '@/lib/studio-db';
import { normalizeStudioProfile } from '@/lib/studio-profile';
import { studioCloudConfigured } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!studioCloudConfigured()) {
    return NextResponse.json({ profile: normalizeStudioProfile() });
  }
  try {
    const settings = await dbGetStudioSettings();
    return NextResponse.json({
      profile: normalizeStudioProfile(settings),
    });
  } catch {
    return NextResponse.json({ profile: normalizeStudioProfile() });
  }
}
