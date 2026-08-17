import { readStudioWriteToken } from '@/lib/studio-session';

function timeoutSignal(ms: number) {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(ms);
  }
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

export async function studioRequest<T>(
  path: string,
  init: RequestInit & { timeoutMs?: number } = {},
) {
  const { timeoutMs = 20000, signal, ...rest } = init;
  const isForm = typeof FormData !== 'undefined' && rest.body instanceof FormData;
  const headers = new Headers(rest.headers);
  if (!isForm && rest.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const token = readStudioWriteToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  try {
    const response = await fetch(path, {
      ...rest,
      headers,
      credentials: 'include',
      cache: 'no-store',
      signal: signal ?? timeoutSignal(timeoutMs),
    });
    const data = (await response.json().catch(() => null)) as T | null;
    return { ok: response.ok, status: response.status, data };
  } catch {
    return { ok: false, status: 0, data: null as T | null };
  }
}

export function cloudMissing(status: number, data?: unknown) {
  return (
    status === 503 &&
    Boolean(data && typeof data === 'object' && 'cloud' in data && (data as { cloud?: boolean }).cloud === false)
  );
}

export function requestError(
  result: { status: number; data?: { error?: string } | null },
  fallback: string,
) {
  if (result.status === 401) return 'Sign in again, then save the look.';
  if (result.status === 0) return 'The request timed out. Check your connection and try again.';
  return result.data?.error || fallback;
}
