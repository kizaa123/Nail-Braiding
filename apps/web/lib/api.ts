export const API_URL =
  typeof window === 'undefined'
    ? (process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000')
    : '';

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly error: ApiError,
  ) {
    super(error.message);
  }
}

export async function api<T>(
  path: string,
  init?: RequestInit & { next?: { revalidate?: number } },
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        ...(init?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...init?.headers,
      },
      cache: init?.cache,
    });
  } catch {
    throw new ApiRequestError(503, {
      code: 'API_UNAVAILABLE',
      message: 'Cannot reach the booking API. Start it with npm run dev:api.',
    });
  }

  let payload: {
    success: boolean;
    data?: T;
    meta?: unknown;
    error?: ApiError;
  };
  try {
    payload = (await response.json()) as typeof payload;
  } catch {
    throw new ApiRequestError(response.status, {
      code: 'HTTP_ERROR',
      message: 'The booking API returned an invalid response.',
    });
  }

  if (!payload.success || !response.ok) {
    throw new ApiRequestError(
      response.status,
      payload.error ?? { code: 'HTTP_ERROR', message: 'Request failed' },
    );
  }

  if (payload.meta) {
    return { ...(payload as unknown as T) };
  }
  return payload.data as T;
}

export function formatCedis(amountMinor: number | null | undefined): string {
  if (amountMinor == null) return 'Price on request';
  const value = amountMinor / 100;
  return `GH₵${value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)}`;
}
