import { apiRequest } from "./api";

export interface PatientPayload {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  phone?: string;
  allergies?: string[];
  medicalHistory?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export const clientService = {
  async getClients(params?: { page?: number; limit?: number; search?: string }) {
    const q = new URLSearchParams();
    if (params?.page)   q.set("page",   String(params.page));
    if (params?.limit)  q.set("limit",  String(params.limit));
    if (params?.search) q.set("search", params.search);
    return apiRequest(`/api/patients?${q}`);
  },

  async getClientById(id: string) {
    return apiRequest(`/api/patients/${id}`);
  },

  async addClient(data: PatientPayload) {
    return apiRequest("/api/patients", "POST", data);
  },

  async updateClient(id: string, data: Partial<PatientPayload>) {
    return apiRequest(`/api/patients/${id}`, "PATCH", data);
  },

  async deleteClient(id: string) {
    return apiRequest(`/api/patients/${id}`, "DELETE");
  },
};

export default clientService;
