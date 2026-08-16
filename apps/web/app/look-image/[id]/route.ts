import { NextResponse } from 'next/server';
import { getLookImage } from '@/lib/look-image-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const image = getLookImage(id);
  if (!image) {
    return new NextResponse('Not found', { status: 404 });
  }
  return new NextResponse(new Uint8Array(image.bytes), {
    status: 200,
    headers: {
      'Content-Type': image.type,
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function HEAD(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const image = getLookImage(id);
  if (!image) return new NextResponse(null, { status: 404 });
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': image.type,
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
