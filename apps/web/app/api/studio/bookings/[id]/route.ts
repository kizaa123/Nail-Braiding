import { NextResponse } from 'next/server';
import { cloudUnavailable, requireStudioAdmin, unauthorized } from '@/lib/studio-auth';
import { studioCloudConfigured } from '@/lib/supabase-admin';
import { dbDeleteBooking, dbPatchBooking } from '@/lib/studio-db';
import type { StudioBooking } from '@/lib/studio-bookings';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!studioCloudConfigured()) return cloudUnavailable();
  if (!(await requireStudioAdmin(request))) return unauthorized();
  const { id } = await ctx.params;
  const patch = (await request.json().catch(() => null)) as Partial<StudioBooking> | null;
  if (!patch) return NextResponse.json({ error: 'Invalid update.' }, { status: 400 });
  try {
    const booking = await dbPatchBooking(id, patch);
    return NextResponse.json({ booking });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not update booking.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!studioCloudConfigured()) return cloudUnavailable();
  if (!(await requireStudioAdmin(request))) return unauthorized();
  const { id } = await ctx.params;
  try {
    await dbDeleteBooking(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not delete booking.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
