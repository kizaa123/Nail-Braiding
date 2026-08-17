import { NextResponse } from 'next/server';
import { studioImageConfigured } from '@/lib/supabase-admin';
import { dbUploadLook } from '@/lib/studio-db';
import { saveLookImageFromBytes } from '@/lib/look-image-store';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File) || file.size < 20) {
    return NextResponse.json({ error: 'Missing look photo.' }, { status: 400 });
  }
  if (file.size > 6 * 1024 * 1024) {
    return NextResponse.json({ error: 'Photo is too large.' }, { status: 400 });
  }

  const type = file.type || 'image/jpeg';
  const bytes = Buffer.from(await file.arrayBuffer());

  if (studioImageConfigured()) {
    try {
      const url = await dbUploadLook(bytes, type);
      if (url) return NextResponse.json({ url });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not upload photo.';
      return NextResponse.json({ error: message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Could not upload photo.' }, { status: 500 });
  }

  const id = saveLookImageFromBytes(bytes, type);
  return NextResponse.json({ url: `/look-image/${id}` });
}
