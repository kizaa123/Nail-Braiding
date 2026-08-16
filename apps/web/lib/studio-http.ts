export async function studioRequest<T>(path: string, init: RequestInit = {}) {
  const isForm = typeof FormData !== 'undefined' && init.body instanceof FormData;
  const headers = new Headers(init.headers);
  if (!isForm && init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
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

export function cloudMissing(status: number) {
  return status === 503 || status === 0;
}
