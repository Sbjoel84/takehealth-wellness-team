// ─── Centralised API Service ──────────────────────────────────────────────────
// Single source of truth for all HTTP calls.
// Reads base URL from VITE_API_URL so the same build works across environments.

// In development the Vite proxy forwards /api and /auth to the backend,
// avoiding CORS. In production set VITE_API_URL to the real backend URL.
const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  (import.meta.env.DEV ? "" : "https://take-health-web-api.onrender.com");

const REQUEST_TIMEOUT_MS = 60_000;

// ─── Typed error ──────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── Token helpers ────────────────────────────────────────────────────────────

export const getToken = (): string | undefined =>
  localStorage.getItem("token") ?? undefined;

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ─── Status-specific messages ─────────────────────────────────────────────────

const STATUS_MESSAGES: Record<number, string> = {
  400: "Invalid request data.",
  403: "Permission denied.",
  404: "Resource not found.",
  409: "Conflict — resource already exists.",
  422: "Validation failed.",
  429: "Too many requests. Please slow down.",
  500: "Server error. Please try again later.",
  502: "Bad gateway. The server is temporarily unavailable.",
  503: "Service unavailable. Please try again later.",
};

// ─── Core request ─────────────────────────────────────────────────────────────

export const apiRequest = async <T = unknown>(
  endpoint: string,
  method = "GET",
  data?: unknown,
  token?: string
): Promise<T> => {
  if (!navigator.onLine) {
    throw new ApiError("You are offline. Please check your connection.", 0);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const authToken = token ?? getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: data != null ? JSON.stringify(data) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if ((err as Error).name === "AbortError") {
      throw new ApiError("Request timed out — the server may be waking up. Please wait a moment and try again.", 408);
    }
    throw new ApiError("Network error. Check your connection.", 0);
  }

  clearTimeout(timeoutId);

  // Handle 401 — only redirect when there was an active session to expire.
  // If there was never a session (e.g. dev mode, no credentials) just throw so
  // pages can show an empty state instead of bouncing the user to login.
  if (res.status === 401) {
    const hadSession = !!(localStorage.getItem("token") || localStorage.getItem("user"));
    clearSession();
    if (hadSession) window.location.href = "/login";
    throw new ApiError("Session expired. Please log in again.", 401);
  }

  // Parse body (guard against empty responses e.g. 204 No Content)
  let result: unknown;
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json") && res.status !== 204) {
    result = await res.json();
  } else {
    result = null;
  }

  if (!res.ok) {
    const serverMessage = (result as { message?: string })?.message;
    const fallback = STATUS_MESSAGES[res.status] ?? `Request failed (${res.status})`;
    throw new ApiError(serverMessage || fallback, res.status, result);
  }

  // Dev-mode logging
  if (import.meta.env.DEV) {
    console.debug(`[API] ${method} ${endpoint} →`, res.status);
  }

  return result as T;
};
