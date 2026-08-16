import { NextResponse } from 'next/server';
import { cloudUnavailable, requireStudioAdmin, unauthorized } from '@/lib/studio-auth';
import { studioCloudConfigured } from '@/lib/supabase-admin';
import { dbCreateBooking, dbListBookings } from '@/lib/studio-db';
import type { StudioBooking } from '@/lib/studio-bookings';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!studioCloudConfigured()) return cloudUnavailable();
  if (!(await requireStudioAdmin())) return unauthorized();
  try {
    const bookings = await dbListBookings();
    return NextResponse.json({ cloud: true, bookings: bookings ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load bookings.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!studioCloudConfigured()) return cloudUnavailable();
  const booking = (await request.json().catch(() => null)) as StudioBooking | null;
  if (!booking?.clientName || !booking.styleName || booking.destination !== 'PORTAL') {
    return NextResponse.json({ error: 'Invalid booking.' }, { status: 400 });
  }
  try {
    const saved = await dbCreateBooking(booking);
    return NextResponse.json({ booking: saved });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not save booking.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
