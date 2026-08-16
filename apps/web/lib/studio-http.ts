import { readStudioWriteToken } from '@/lib/studio-session';

export async function studioRequest<T>(path: string, init: RequestInit = {}) {
  const isForm = typeof FormData !== 'undefined' && init.body instanceof FormData;
  const headers = new Headers(init.headers);
  if (!isForm && init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const token = readStudioWriteToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  try {
    const response = await fetch(path, {
      ...init,
      headers,
      credentials: 'include',
      cache: 'no-store',
    });
    const data = (await response.json().catch(() => null)) as T | null;
    return { ok: response.ok, status: response.status, data };
  } catch {
    return { ok: false, status: 0, data: null as T | null };
  }
}

export function cloudMissing(status: number, data?: unknown) {
  return (
    status === 0 ||
    (status === 503 &&
      Boolean(data && typeof data === 'object' && 'cloud' in data && (data as { cloud?: boolean }).cloud === false))
  );
}
