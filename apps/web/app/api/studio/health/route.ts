import { NextResponse } from 'next/server';
import { studioCloudConfigured, studioCloudMissingParts } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const missing = studioCloudMissingParts();
  return NextResponse.json({
    cloud: studioCloudConfigured(),
    missing,
  });
}
