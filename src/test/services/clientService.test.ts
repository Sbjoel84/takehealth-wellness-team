import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { clientService } from "@/services/clientService";

function mockFetch(status: number, body: unknown) {
  const headers = new Headers({ "content-type": "application/json" });
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
    new Response(JSON.stringify(body), { status, headers })
  );
}

function captureUrl(): string {
  return (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
}

beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(navigator, "onLine", { value: true, writable: true, configurable: true });
});
afterEach(() => vi.restoreAllMocks());

describe("clientService.getClients", () => {
  it("calls /api/patients", async () => {
    mockFetch(200, { patients: [], total: 0 });
    await clientService.getClients();
    expect(captureUrl()).toContain("/api/patients");
  });

  it("appends page and limit query params", async () => {
    mockFetch(200, { patients: [], total: 0 });
    await clientService.getClients({ page: 2, limit: 20 });
    const url = captureUrl();
    expect(url).toContain("page=2");
    expect(url).toContain("limit=20");
  });

  it("appends search query param when provided", async () => {
    mockFetch(200, { patients: [], total: 0 });
    await clientService.getClients({ search: "Joel" });
    expect(captureUrl()).toContain("search=Joel");
  });
});

describe("clientService.getClientById", () => {
  it("calls /api/patients/:id", async () => {
    mockFetch(200, { id: "42", firstName: "Joel" });
    await clientService.getClientById("42");
    expect(captureUrl()).toContain("/api/patients/42");
  });
});

describe("clientService.addClient", () => {
  it("calls POST /api/patients", async () => {
    mockFetch(201, { id: "new", firstName: "Ada" });
    await clientService.addClient({ firstName: "Ada", lastName: "Lovelace", phone: "+2341234567" });

    const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/api/patients");
    expect((init as RequestInit).method).toBe("POST");
    expect(JSON.parse((init as RequestInit).body as string)).toMatchObject({
      firstName: "Ada",
      lastName: "Lovelace",
    });
  });
});
