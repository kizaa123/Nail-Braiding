import { NextResponse } from 'next/server';
import { studioCloudConfigured } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ cloud: studioCloudConfigured() });
}
