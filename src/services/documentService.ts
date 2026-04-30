import { apiRequest } from "./api";

// Document endpoints are not yet available in the backend API.
// This service is structured and ready — swap the placeholder paths
// with real endpoints once they are deployed.

export const documentService = {
  async getDocuments(params?: { page?: number; limit?: number; patientId?: string }) {
    const q = new URLSearchParams();
    if (params?.page)      q.set("page",      String(params.page));
    if (params?.limit)     q.set("limit",     String(params.limit));
    if (params?.patientId) q.set("patientId", params.patientId);
    return apiRequest(`/api/documents?${q}`);
  },

  async getDocumentById(id: string) {
    return apiRequest(`/api/documents/${id}`);
  },

  async uploadDocument(data: {
    patientId: string;
    title: string;
    type: string;
    file: File;
  }) {
    const form = new FormData();
    form.append("patientId", data.patientId);
    form.append("title", data.title);
    form.append("type", data.type);
    form.append("file", data.file);

    // FormData upload — bypass JSON headers in apiRequest
    const token = localStorage.getItem("token");
    const BASE_URL =
      (import.meta.env.VITE_API_URL as string | undefined) ||
      (import.meta.env.DEV ? "" : "https://take-health-web-api.onrender.com");

    const res = await fetch(`${BASE_URL}/api/documents`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { message?: string }).message || "Upload failed");
    }

    return res.json();
  },

  async deleteDocument(id: string) {
    return apiRequest(`/api/documents/${id}`, "DELETE");
  },
};

export default documentService;
