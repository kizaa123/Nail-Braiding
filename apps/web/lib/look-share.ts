export type LookShare = {
  u: string;
  n: string;
};

export function encodeLookShareToken(imageUrl: string, name: string) {
  const json = JSON.stringify({ u: imageUrl, n: name.trim().slice(0, 80) || 'Look' });
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(json, 'utf8').toString('base64url');
  }
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function decodeLookShareToken(token: string): LookShare | null {
  try {
    const json =
      typeof Buffer !== 'undefined'
        ? Buffer.from(token, 'base64url').toString('utf8')
        : decodeURIComponent(
            Array.from(atob(token.replace(/-/g, '+').replace(/_/g, '/')), (char) =>
              `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`,
            ).join(''),
          );
    const parsed = JSON.parse(json) as LookShare;
    if (!parsed?.u || typeof parsed.u !== 'string') return null;
    return { u: parsed.u.trim(), n: String(parsed.n || 'Look').slice(0, 80) };
  } catch {
    return null;
  }
}

export function lookSharePath(imageUrl: string, name: string) {
  return `/l/${encodeLookShareToken(imageUrl, name)}`;
}

export function publicLookImageUrl(imageUrl: string | undefined, origin: string) {
  const raw = imageUrl?.trim() ?? '';
  if (!raw || raw.startsWith('data:') || raw.startsWith('blob:')) return '';
  const base = origin.replace(/\/$/, '');
  if (raw.startsWith('https://')) return raw;
  if (raw.startsWith('/') && base && !/localhost|127\.0\.0\.1/i.test(base)) {
    return `${base}${raw}`;
  }
  return '';
}

export async function requestOrigin() {
  const { headers } = await import('next/headers');
  const headerList = await headers();
  const host = (headerList.get('x-forwarded-host') || headerList.get('host') || '').split(',')[0]?.trim();
  const proto = (headerList.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https'))
    .split(',')[0]
    ?.trim();
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (env && !/localhost|127\.0\.0\.1/i.test(env)) return env;
  if (host) return `${proto}://${host}`;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return env || 'http://localhost:3000';
}

export function siteOrigin() {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (env && !/localhost|127\.0\.0\.1/i.test(env)) return env;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return env || 'http://localhost:3000';
}
