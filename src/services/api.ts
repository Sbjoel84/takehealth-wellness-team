// ─── Centralised API Service ──────────────────────────────────────────────────
// Single source of truth for all HTTP calls.
// Reads base URL from VITE_API_URL so the same build works across environments.

// In development the Vite proxy forwards /api and /auth to the backend,
// avoiding CORS. In production set VITE_API_URL to the real backend URL.
const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  (import.meta.env.DEV ? "" : "https://take-health-web-api.onrender.com");

const REQUEST_TIMEOUT_MS = 90_000; // 90 s — enough for a Render cold start
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 4_000;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

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

  const authToken = token ?? getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };

  let lastNetworkError: ApiError | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let res: Response;
    try {
      res = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers,
        credentials: "include",
        body: data != null ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeoutId);
      if ((err as Error).name === "AbortError") {
        throw new ApiError(
          "Request timed out — the server may be waking up. Please try again in a moment.",
          408
        );
      }
      // Network-level failure (server sleeping, connection dropped, etc.)
      // Retry automatically before giving up.
      lastNetworkError = new ApiError(
        attempt < MAX_RETRIES
          ? "Server is starting up — please wait…"
          : "Unable to reach the server. Please check your connection and try again.",
        0
      );
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      throw lastNetworkError;
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
  }

  throw lastNetworkError!;
};
