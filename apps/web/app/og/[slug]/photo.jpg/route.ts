import { NextResponse } from 'next/server';
import { publicLookImageUrl, requestOrigin } from '@/lib/look-share';
import { dbGetPublicStyleBySlug } from '@/lib/studio-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function imageHeaders(contentType: string) {
  return {
    'Content-Type': contentType.startsWith('image/') ? contentType : 'image/jpeg',
    'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    'Access-Control-Allow-Origin': '*',
  };
}

async function loadStylePhoto(slug: string) {
  const style = await dbGetPublicStyleBySlug(slug);
  if (!style?.imageUrl) return null;
  const origin = await requestOrigin();
  const src = publicLookImageUrl(style.imageUrl, origin);
  if (!src) return null;
  const response = await fetch(src, { cache: 'no-store' });
  if (!response.ok) return null;
  const bytes = Buffer.from(await response.arrayBuffer());
  const type = response.headers.get('content-type') || 'image/jpeg';
  return { bytes, type };
}

export async function GET(_request: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const image = await loadStylePhoto(slug);
  if (!image) return new NextResponse('Not found', { status: 404 });
  return new NextResponse(new Uint8Array(image.bytes), {
    status: 200,
    headers: imageHeaders(image.type),
  });
}

export async function HEAD(_request: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const image = await loadStylePhoto(slug);
  if (!image) return new NextResponse(null, { status: 404 });
  return new NextResponse(null, { status: 200, headers: imageHeaders(image.type) });
}
