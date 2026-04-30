import { apiRequest } from "./api";

export interface ProviderPayload {
  name: string;
  email?: string;
  phone?: string;
  type: string;
  specialty?: string;
  location?: string;
}

export const providerService = {
  async getProviders(params?: { page?: number; limit?: number; status?: string }) {
    const q = new URLSearchParams();
    if (params?.page)   q.set("page",   String(params.page));
    if (params?.limit)  q.set("limit",  String(params.limit));
    if (params?.status) q.set("status", params.status);
    return apiRequest(`/api/health-service-providers?${q}`);
  },

  async getProviderById(id: string) {
    return apiRequest(`/api/health-service-providers/${id}`);
  },

  async createProvider(data: ProviderPayload) {
    return apiRequest("/api/health-service-providers", "POST", data);
  },

  async updateProvider(id: string, data: Partial<ProviderPayload>) {
    return apiRequest(`/api/health-service-providers/${id}`, "PATCH", data);
  },

  async deleteProvider(id: string) {
    return apiRequest(`/api/health-service-providers/${id}`, "DELETE");
  },

  async activateProvider(id: string) {
    return apiRequest(`/api/health-service-providers/${id}/activate`, "PATCH");
  },

  async deactivateProvider(id: string) {
    return apiRequest(`/api/health-service-providers/${id}/deactivate`, "PATCH");
  },
};

export default providerService;
