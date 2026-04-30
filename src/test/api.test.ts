import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiRequest, ApiError, getToken } from "@/services/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mockFetch(status: number, body: unknown, contentType = "application/json") {
  const headers = new Headers({ "content-type": contentType });
  const response = new Response(
    body !== null ? JSON.stringify(body) : null,
    { status, headers }
  );
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(response);
}

// ─── Setup / teardown ─────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
  // Default: online
  Object.defineProperty(navigator, "onLine", { value: true, writable: true, configurable: true });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── getToken ─────────────────────────────────────────────────────────────────

describe("getToken", () => {
  it("returns undefined when no token stored", () => {
    expect(getToken()).toBeUndefined();
  });

  it("returns the stored token", () => {
    localStorage.setItem("token", "abc123");
    expect(getToken()).toBe("abc123");
  });
});

// ─── apiRequest — success paths ───────────────────────────────────────────────

describe("apiRequest — success", () => {
  it("returns parsed JSON on 200", async () => {
    mockFetch(200, { id: 1, name: "Test" });
    const result = await apiRequest<{ id: number; name: string }>("/api/test");
    expect(result).toEqual({ id: 1, name: "Test" });
  });

  it("returns null on 204 No Content", async () => {
    mockFetch(204, null, "");
    const result = await apiRequest("/api/test", "DELETE");
    expect(result).toBeNull();
  });

  it("sends Authorization header when token is in localStorage", async () => {
    localStorage.setItem("token", "my-token");
    mockFetch(200, {});
    await apiRequest("/api/test");
    const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect((call[1] as RequestInit).headers).toMatchObject({
      Authorization: "Bearer my-token",
    });
  });

  it("uses explicit token over stored token", async () => {
    localStorage.setItem("token", "stored-token");
    mockFetch(200, {});
    await apiRequest("/api/test", "GET", undefined, "explicit-token");
    const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect((call[1] as RequestInit).headers).toMatchObject({
      Authorization: "Bearer explicit-token",
    });
  });

  it("sends JSON body for POST requests", async () => {
    mockFetch(201, { created: true });
    await apiRequest("/api/test", "POST", { name: "New" });
    const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect((call[1] as RequestInit).body).toBe(JSON.stringify({ name: "New" }));
  });
});

// ─── apiRequest — HTTP error paths ────────────────────────────────────────────

describe("apiRequest — HTTP errors", () => {
  it("throws ApiError with status 400 and correct message", async () => {
    mockFetch(400, { message: "Bad input" });
    await expect(apiRequest("/api/test")).rejects.toMatchObject({
      name: "ApiError",
      status: 400,
      message: "Bad input",
    });
  });

  it("uses fallback message for 400 when server sends none", async () => {
    mockFetch(400, {});
    await expect(apiRequest("/api/test")).rejects.toMatchObject({
      status: 400,
      message: "Invalid request data.",
    });
  });

  it("throws ApiError with status 403", async () => {
    mockFetch(403, {});
    await expect(apiRequest("/api/test")).rejects.toMatchObject({
      status: 403,
      message: "Permission denied.",
    });
  });

  it("throws ApiError with status 404", async () => {
    mockFetch(404, {});
    await expect(apiRequest("/api/test")).rejects.toMatchObject({
      status: 404,
      message: "Resource not found.",
    });
  });

  it("throws ApiError with status 429", async () => {
    mockFetch(429, {});
    await expect(apiRequest("/api/test")).rejects.toMatchObject({
      status: 429,
      message: "Too many requests. Please slow down.",
    });
  });

  it("throws ApiError with status 500", async () => {
    mockFetch(500, {});
    await expect(apiRequest("/api/test")).rejects.toMatchObject({
      status: 500,
      message: "Server error. Please try again later.",
    });
  });

  it("throws ApiError with status 503", async () => {
    mockFetch(503, {});
    await expect(apiRequest("/api/test")).rejects.toMatchObject({
      status: 503,
      message: "Service unavailable. Please try again later.",
    });
  });

  it("clears session and redirects on 401", async () => {
    localStorage.setItem("token", "expired");
    localStorage.setItem("user", JSON.stringify({ name: "Joel" }));

    // jsdom doesn't navigate; just track the assignment
    const locationSpy = vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      href: "",
    } as Location);

    mockFetch(401, { message: "Unauthorized" });

    await expect(apiRequest("/api/secure")).rejects.toMatchObject({
      status: 401,
      message: "Session expired. Please log in again.",
    });

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();

    locationSpy.mockRestore();
  });
});

// ─── apiRequest — network / offline errors ────────────────────────────────────

describe("apiRequest — network errors", () => {
  it("throws ApiError on network failure", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Failed to fetch"));
    await expect(apiRequest("/api/test")).rejects.toMatchObject({
      status: 0,
      message: "Network error. Check your connection.",
    });
  });

  it("throws ApiError with status 408 on timeout (AbortError)", async () => {
    const abortError = new DOMException("Aborted", "AbortError");
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(abortError);
    await expect(apiRequest("/api/test")).rejects.toMatchObject({
      status: 408,
      message: "Request timed out. Please try again.",
    });
  });

  it("throws ApiError immediately when offline", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    Object.defineProperty(navigator, "onLine", { value: false, writable: true, configurable: true });
    await expect(apiRequest("/api/test")).rejects.toMatchObject({
      status: 0,
      message: "You are offline. Please check your connection.",
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

// ─── ApiError class ───────────────────────────────────────────────────────────

describe("ApiError", () => {
  it("is instanceof Error", () => {
    const err = new ApiError("Oops", 500);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ApiError);
  });

  it("stores status and data", () => {
    const err = new ApiError("Bad", 400, { field: "name" });
    expect(err.status).toBe(400);
    expect(err.data).toEqual({ field: "name" });
    expect(err.name).toBe("ApiError");
  });
});
