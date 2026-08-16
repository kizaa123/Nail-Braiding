import { NextResponse } from 'next/server';
import { cloudUnavailable, requireStudioAdmin, unauthorized } from '@/lib/studio-auth';
import { studioCloudConfigured } from '@/lib/supabase-admin';
import { dbListCategories, dbRenameCategory, dbSaveCategories } from '@/lib/studio-db';
import { DEFAULT_CATEGORIES, type StudioCategoryMap } from '@/lib/studio-categories';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!studioCloudConfigured()) return cloudUnavailable();
  try {
    const categories = (await dbListCategories()) ?? DEFAULT_CATEGORIES;
    return NextResponse.json({ cloud: true, categories });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load categories.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!studioCloudConfigured()) return cloudUnavailable();
  if (!(await requireStudioAdmin())) return unauthorized();
  const body = (await request.json().catch(() => null)) as {
    categories?: StudioCategoryMap;
    rename?: { kind: 'HAIR' | 'NAILS'; from: string; to: string };
  } | null;
  if (!body?.categories) {
    return NextResponse.json({ error: 'Categories are required.' }, { status: 400 });
  }
  try {
    if (body.rename && body.rename.from !== body.rename.to) {
      await dbRenameCategory(body.rename.kind, body.rename.from, body.rename.to);
    }
    const categories = await dbSaveCategories(body.categories);
    return NextResponse.json({ categories });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not save categories.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
