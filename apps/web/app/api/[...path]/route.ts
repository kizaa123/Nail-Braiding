import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const BACKEND = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function proxy(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  if (path[0] === 'studio') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const incoming = new URL(req.url);
  const target = `${BACKEND}/api/${path.join('/')}${incoming.search}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (key === 'host' || key === 'connection' || key === 'content-length') return;
    headers.set(key, value);
  });

  try {
    const res = await fetch(target, {
      method: req.method,
      headers,
      body: req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.arrayBuffer(),
      cache: 'no-store',
      redirect: 'manual',
    });

    const out = new Headers();
    res.headers.forEach((value, key) => {
      if (['transfer-encoding', 'content-encoding', 'connection', 'set-cookie'].includes(key)) {
        return;
      }
      out.set(key, value);
    });

    const response = new NextResponse(res.body, { status: res.status, headers: out });
    const cookies =
      typeof res.headers.getSetCookie === 'function' ? res.headers.getSetCookie() : [];
    for (const cookie of cookies) {
      response.headers.append('set-cookie', cookie);
    }
    return response;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'API_UNAVAILABLE',
          message: 'Cannot reach the booking API. Start it with npm run dev:api.',
        },
      },
      { status: 503 },
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
