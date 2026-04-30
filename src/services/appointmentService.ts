import { apiRequest } from "./api";

export const appointmentService = {
  async getAppointments(params?: {
    page?: number;
    limit?: number;
    status?: string;
    from?: string;
    to?: string;
  }) {
    const q = new URLSearchParams();
    if (params?.page)   q.set("page",   String(params.page));
    if (params?.limit)  q.set("limit",  String(params.limit));
    if (params?.status) q.set("status", params.status);
    if (params?.from)   q.set("from",   params.from);
    if (params?.to)     q.set("to",     params.to);
    return apiRequest(`/api/appointments?${q}`);
  },

  async getAppointmentById(id: string) {
    return apiRequest(`/api/appointments/${id}`);
  },

  async createAppointment(data: {
    patientId: string;
    providerId: string;
    serviceId?: string;
    scheduledAt: string;
    type: "IN_PERSON" | "VIRTUAL" | "HOME_VISIT";
    notes?: string;
    duration?: number;
  }) {
    return apiRequest("/api/appointments", "POST", data);
  },

  async confirmAppointment(id: string) {
    return apiRequest(`/api/appointments/${id}/confirm`, "PATCH");
  },

  async cancelAppointment(id: string, reason?: string) {
    return apiRequest(`/api/appointments/${id}/cancel`, "PATCH", { reason });
  },

  async rescheduleAppointment(id: string, scheduledAt: string, reason?: string) {
    return apiRequest(`/api/appointments/${id}/reschedule`, "PATCH", { scheduledAt, reason });
  },

  async completeAppointment(id: string) {
    return apiRequest(`/api/appointments/${id}/complete`, "PATCH");
  },

  async deleteAppointment(id: string) {
    return apiRequest(`/api/appointments/${id}`, "DELETE");
  },
};

export default appointmentService;
