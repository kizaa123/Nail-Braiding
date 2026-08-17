import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cloudUnavailable, requireStudioAdmin, unauthorized } from '@/lib/studio-auth';
import { studioCloudConfigured } from '@/lib/supabase-admin';
import { dbListStyles, dbUpsertStyle } from '@/lib/studio-db';
import { sanitizeDbError } from '@/lib/studio-pg';
import type { StyleDraft } from '@/lib/studio-styles';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function revalidateCatalog() {
  revalidatePath('/');
  revalidatePath('/styles');
}

export async function GET(request: Request) {
  if (!studioCloudConfigured()) return cloudUnavailable();
  const url = new URL(request.url);
  const asked = url.searchParams.get('scope') === 'all';
  const admin = await requireStudioAdmin(request);
  const scope = asked && admin ? 'all' : 'public';
  try {
    const styles = await dbListStyles(scope, { persistImages: scope === 'all' });
    return NextResponse.json({ cloud: true, styles: styles ?? [] });
  } catch (error) {
    const message = sanitizeDbError(error) || 'Could not load looks.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!studioCloudConfigured()) return cloudUnavailable();
  if (!(await requireStudioAdmin(request))) return unauthorized();
  const draft = (await request.json().catch(() => null)) as StyleDraft | null;
  if (!draft?.name?.trim() || !draft.categoryName?.trim()) {
    return NextResponse.json({ error: 'Name and category are required.' }, { status: 400 });
  }
  try {
    const style = await dbUpsertStyle(draft);
    if (!style) throw new Error('Could not save look.');
    revalidateCatalog();
    return NextResponse.json({ style });
  } catch (error) {
    const message = sanitizeDbError(error) || 'Could not save look.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
