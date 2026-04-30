import { apiRequest } from "./api";

export const authService = {
  async login(credentials: { email: string; password: string }) {
    const data = await apiRequest<{ token: string | null; user: Record<string, unknown> }>(
      "/auth/sign-in/email",
      "POST",
      { ...credentials, rememberMe: true }
    );
    if (data.token) localStorage.setItem("token", data.token);
    if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  },

  async register(payload: { name: string; email: string; password: string }) {
    const data = await apiRequest<{ token: string | null; user: Record<string, unknown> }>(
      "/auth/sign-up/email",
      "POST",
      { ...payload, rememberMe: true }
    );
    if (data.token) localStorage.setItem("token", data.token);
    if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  },

  async logout() {
    await apiRequest("/auth/sign-out", "POST");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  async getCurrentUser() {
    return apiRequest("/auth/get-session");
  },

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    return apiRequest("/auth/change-password", "POST", data);
  },

  getStoredUser<T = unknown>(): T | null {
    try {
      const raw = localStorage.getItem("user");
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  getStoredToken(): string | null {
    return localStorage.getItem("token");
  },

  getStoredAuth() {
    return {
      user: this.getStoredUser(),
      token: this.getStoredToken(),
    };
  },

  storeAuthData(response: { token?: string | null; user?: unknown }) {
    if (response.token) localStorage.setItem("token", response.token);
    if (response.user)  localStorage.setItem("user", JSON.stringify(response.user));
  },

  clearStoredAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export default authService;
