import { NextResponse } from 'next/server';
import { cloudUnavailable, requireStudioAdmin, unauthorized } from '@/lib/studio-auth';
import { studioCloudConfigured, studioImageConfigured } from '@/lib/supabase-admin';
import { dbUploadLook } from '@/lib/studio-db';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type UploadBody = {
  image?: string;
  contentType?: string;
};

function fromDataUrl(raw: string) {
  const match = raw.match(/^data:(image\/[\w.+-]+);base64,([A-Za-z0-9+/=\s]+)$/);
  if (!match) return null;
  const bytes = Buffer.from(match[2].replace(/\s/g, ''), 'base64');
  return { bytes, type: match[1] };
}

async function readUpload(request: Request) {
  const header = request.headers.get('content-type') || '';
  if (header.includes('application/json')) {
    const body = (await request.json().catch(() => null)) as UploadBody | null;
    const raw = body?.image?.trim() ?? '';
    if (!raw) return null;
    if (raw.startsWith('data:image/')) return fromDataUrl(raw);
    try {
      const bytes = Buffer.from(raw.replace(/\s/g, ''), 'base64');
      return {
        bytes,
        type: body?.contentType?.startsWith('image/') ? body.contentType : 'image/jpeg',
      };
    } catch {
      return null;
    }
  }

  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof Blob) || file.size < 20) return null;
    const type = 'type' in file && typeof file.type === 'string' && file.type.startsWith('image/') ? file.type : 'image/jpeg';
    return { bytes: Buffer.from(await file.arrayBuffer()), type };
  } catch {
    throw new Error('Could not read that photo. Choose the image again.');
  }
}

export async function POST(request: Request) {
  if (!studioCloudConfigured()) return cloudUnavailable();
  if (!(await requireStudioAdmin(request))) return unauthorized();
  try {
    const upload = await readUpload(request);
    if (!upload || upload.bytes.length < 20) {
      return NextResponse.json({ error: 'Choose a photo to upload.' }, { status: 400 });
    }
    if (upload.bytes.length > 6 * 1024 * 1024) {
      return NextResponse.json({ error: 'Photo is too large. Use a smaller image.' }, { status: 400 });
    }
    if (!studioImageConfigured()) {
      return NextResponse.json(
        { error: 'Photo storage is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on Vercel.' },
        { status: 503 },
      );
    }
    const type = upload.type.startsWith('image/') ? upload.type : 'image/jpeg';
    const url = await dbUploadLook(upload.bytes, type);
    if (!url) {
      return NextResponse.json({ error: 'Could not upload photo.' }, { status: 500 });
    }
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not upload photo.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
