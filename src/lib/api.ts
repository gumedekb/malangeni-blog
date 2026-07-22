/**
 * Central API client for the Spring Boot backend.
 *
 * Point the frontend at your backend by setting NEXT_PUBLIC_API_URL in
 * `.env.local` (e.g. NEXT_PUBLIC_API_URL=https://api.malangenihub.co.za).
 * In `next dev` this is read live; for a production build (`next build`)
 * the value is baked in, so rebuild after changing it.
 *
 * All endpoint paths live here so they are trivial to align with the real
 * backend routes if they differ.
 */

// Default is the same-origin `/api` path, which the Next dev server proxies
// to the backend (see next.config.ts) — no CORS, and the browser only ever
// talks to its own origin. Set NEXT_PUBLIC_API_URL to an absolute URL to call
// the backend directly and bypass the proxy. Endpoint paths below are relative
// to this base (e.g. base `/api` + `/auth/login` → `/api/auth/login`).
export const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ?? "/api"
).replace(/\/$/, "");

export const AUTH_ENDPOINTS = {
  login: "/auth/login",
  register: "/auth/register",
  me: "/auth/me",
} as const;

/** Error carrying the HTTP status so callers can branch on 401 vs 409 etc. */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

type ApiFetchOptions = RequestInit & { token?: string };

/**
 * Thin fetch wrapper: prefixes the base URL, sends/receives JSON, attaches a
 * bearer token when provided, and throws an ApiError with the server's message
 * on non-2xx responses.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { token, headers, ...rest } = options;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch {
    throw new ApiError(
      "Could not reach the server. Check that the backend is running and NEXT_PUBLIC_API_URL is correct.",
      0,
    );
  }

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const body = (data ?? {}) as { message?: unknown; error?: unknown };
    const fromBody =
      typeof body.message === "string"
        ? body.message
        : typeof body.error === "string"
          ? body.error
          : "";
    const message = fromBody || res.statusText || "Request failed";
    throw new ApiError(message, res.status);
  }

  return data as T;
}
