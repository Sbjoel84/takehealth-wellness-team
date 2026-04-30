import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { authService } from "@/services/authService";

function mockFetch(status: number, body: unknown) {
  const headers = new Headers({ "content-type": "application/json" });
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
    new Response(JSON.stringify(body), { status, headers })
  );
}

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe("authService.login", () => {
  it("stores token and user in localStorage on success", async () => {
    mockFetch(200, { token: "tok123", user: { id: "1", name: "Joel", email: "j@test.com" } });

    await authService.login({ email: "j@test.com", password: "pass" });

    expect(localStorage.getItem("token")).toBe("tok123");
    expect(JSON.parse(localStorage.getItem("user") ?? "{}")).toMatchObject({ name: "Joel" });
  });

  it("calls the correct endpoint", async () => {
    mockFetch(200, { token: "t", user: {} });
    await authService.login({ email: "a@b.com", password: "x" });

    const url: string = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(url).toContain("/auth/sign-in/email");
  });

  it("throws on invalid credentials (401)", async () => {
    mockFetch(401, { message: "Invalid credentials" });
    // 401 triggers session clear + redirect mock
    vi.spyOn(window, "location", "get").mockReturnValue({ ...window.location, href: "" } as Location);
    await expect(authService.login({ email: "x@y.com", password: "wrong" })).rejects.toThrow();
  });
});

describe("authService.logout", () => {
  it("clears token and user from localStorage", async () => {
    localStorage.setItem("token", "tok");
    localStorage.setItem("user", JSON.stringify({ name: "Joel" }));

    mockFetch(200, {});
    await authService.logout();

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });
});

describe("authService.getStoredUser", () => {
  it("returns null when nothing stored", () => {
    expect(authService.getStoredUser()).toBeNull();
  });

  it("returns parsed user object", () => {
    localStorage.setItem("user", JSON.stringify({ name: "Joel", role: "ADMIN" }));
    expect(authService.getStoredUser()).toMatchObject({ name: "Joel", role: "ADMIN" });
  });

  it("returns null on malformed JSON", () => {
    localStorage.setItem("user", "not-json{{{");
    expect(authService.getStoredUser()).toBeNull();
  });
});

describe("authService.getStoredToken", () => {
  it("returns null when no token", () => {
    expect(authService.getStoredToken()).toBeNull();
  });

  it("returns stored token string", () => {
    localStorage.setItem("token", "abc");
    expect(authService.getStoredToken()).toBe("abc");
  });
});
