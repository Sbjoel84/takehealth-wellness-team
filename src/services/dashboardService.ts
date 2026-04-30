import { apiRequest } from "./api";

export const dashboardService = {
  async getOverview(params?: { from?: string; to?: string }) {
    const q = new URLSearchParams();
    if (params?.from) q.set("from", params.from);
    if (params?.to)   q.set("to",   params.to);
    const qs = q.toString();
    return apiRequest(`/api/dashboard/overview${qs ? `?${qs}` : ""}`);
  },

  async getRecentPatients(limit = 5) {
    return apiRequest(`/api/patients?page=1&limit=${limit}`);
  },

  async getRecentAppointments(limit = 5) {
    return apiRequest(`/api/appointments?page=1&limit=${limit}`);
  },
};

export default dashboardService;
