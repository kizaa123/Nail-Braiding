import { NextResponse } from 'next/server';
import { cloudUnavailable, requireStudioAdmin, unauthorized } from '@/lib/studio-auth';
import { studioCloudConfigured, studioImageConfigured } from '@/lib/supabase-admin';
import { dbUploadLook } from '@/lib/studio-db';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: Request) {
  if (!studioCloudConfigured()) return cloudUnavailable();
  if (!(await requireStudioAdmin(request))) return unauthorized();
  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File) || file.size < 20) {
    return NextResponse.json({ error: 'Choose a photo to upload.' }, { status: 400 });
  }
  if (file.size > 6 * 1024 * 1024) {
    return NextResponse.json({ error: 'Photo is too large. Use a smaller image.' }, { status: 400 });
  }
  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const type = file.type?.startsWith('image/') ? file.type : 'image/jpeg';
    if (!studioImageConfigured()) {
      return NextResponse.json(
        { error: 'Photo storage is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on Vercel.' },
        { status: 503 },
      );
    }
    const url = await dbUploadLook(bytes, type);
    if (!url) {
      return NextResponse.json({ error: 'Could not upload photo.' }, { status: 500 });
    }
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not upload photo.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
