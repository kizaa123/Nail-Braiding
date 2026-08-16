import { NextResponse } from 'next/server';
import {
  studioCloudMissingParts,
  studioDatabaseConfigured,
  studioImageConfigured,
  studioSupabaseConfigured,
} from '@/lib/supabase-admin';
import { pingStudioDatabase, sanitizeDbError } from '@/lib/studio-pg';
import { dbListStyles } from '@/lib/studio-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const missing = studioCloudMissingParts();
  let database = false;
  let error: string | undefined;

  try {
    if (studioDatabaseConfigured()) {
      await pingStudioDatabase();
      database = true;
    } else if (studioSupabaseConfigured()) {
      const styles = await dbListStyles('public');
      database = Array.isArray(styles);
    }
  } catch (err) {
    error = sanitizeDbError(err);
  }

  return NextResponse.json({
    cloud: database,
    database,
    images: studioImageConfigured(),
    missing: database ? missing.filter((item) => !item.startsWith('DATABASE_URL')) : missing,
    error,
  });
}

export const runtime = 'nodejs';
