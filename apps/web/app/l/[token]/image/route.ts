import { NextResponse } from 'next/server';
import { decodeLookShareToken, requestOrigin } from '@/lib/look-share';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function imageHeaders(contentType: string) {
  return {
    'Content-Type': contentType,
    'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    'Access-Control-Allow-Origin': '*',
  };
}

async function loadLookImage(token: string) {
  const look = decodeLookShareToken(token);
  if (!look?.u) return null;
  const raw = look.u.trim();

  if (raw.startsWith('data:image/')) {
    const match = raw.match(/^data:(image\/[\w.+-]+);base64,([A-Za-z0-9+/=\s]+)$/);
    if (!match) return null;
    return {
      bytes: Buffer.from(match[2].replace(/\s/g, ''), 'base64'),
      type: match[1],
    };
  }

  const origin = await requestOrigin();
  const src = raw.startsWith('/') ? `${origin}${raw}` : raw;
  const response = await fetch(src, { cache: 'no-store' });
  if (!response.ok) return null;
  const bytes = Buffer.from(await response.arrayBuffer());
  const type = response.headers.get('content-type') || 'image/jpeg';
  return { bytes, type: type.startsWith('image/') ? type : 'image/jpeg' };
}

export async function GET(_request: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const image = await loadLookImage(token);
  if (!image) return new NextResponse('Not found', { status: 404 });
  return new NextResponse(new Uint8Array(image.bytes), {
    status: 200,
    headers: imageHeaders(image.type),
  });
}

export async function HEAD(_request: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const image = await loadLookImage(token);
  if (!image) return new NextResponse(null, { status: 404 });
  return new NextResponse(null, { status: 200, headers: imageHeaders(image.type) });
}
