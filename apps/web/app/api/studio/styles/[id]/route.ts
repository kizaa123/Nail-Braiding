import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cloudUnavailable, requireStudioAdmin, unauthorized } from '@/lib/studio-auth';
import { studioCloudConfigured } from '@/lib/supabase-admin';
import { dbDeleteStyle, dbPatchStyle } from '@/lib/studio-db';
import type { StudioStyle } from '@/lib/studio-styles';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function revalidateCatalog() {
  revalidatePath('/');
  revalidatePath('/styles');
}

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!studioCloudConfigured()) return cloudUnavailable();
  if (!(await requireStudioAdmin(request))) return unauthorized();
  const { id } = await ctx.params;
  const patch = (await request.json().catch(() => null)) as Partial<StudioStyle> | null;
  if (!patch) return NextResponse.json({ error: 'Invalid update.' }, { status: 400 });
  try {
    const style = await dbPatchStyle(id, patch);
    revalidateCatalog();
    return NextResponse.json({ style });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not update look.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!studioCloudConfigured()) return cloudUnavailable();
  if (!(await requireStudioAdmin(request))) return unauthorized();
  const { id } = await ctx.params;
  try {
    await dbDeleteStyle(id);
    revalidateCatalog();
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not delete look.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
