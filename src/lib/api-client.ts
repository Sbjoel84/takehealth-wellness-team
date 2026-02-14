import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Dashboard API Types
export interface DashboardStats {
  clients: {
    total: number;
    pending: number;
  };
  appointments: {
    total: number;
    pending: number;
    completed: number;
  };
  intakeForms: {
    total: number;
    pending: number;
  };
}

export interface Client {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  status: string;
  dateOfBirth?: string;
  address?: string;
  createdAt: string;
  serviceType?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  appointmentDate: string;
  startTime: string;
  serviceType: string;
  status: string;
  notes?: string;
  createdAt: string;
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post("/auth/login/admin", { email, password });
    return response.data;
  },

  loginUser: async (email: string, password: string) => {
    const response = await apiClient.post("/auth/login/user", { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  refresh: async (refreshToken: string) => {
    const response = await apiClient.post("/auth/refresh", { refreshToken });
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get("/auth/profile");
    return response.data;
  },
};

// Admin Dashboard API
export const adminApi = {
  // Dashboard stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get("/admin/dashboard");
    return response.data;
  },

  // Clients management
  getAllClients: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    serviceType?: string;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.serviceType) queryParams.append("serviceType", params.serviceType);
    if (params?.search) queryParams.append("search", params.search);

    const response = await apiClient.get(`/admin/clients?${queryParams.toString()}`);
    return response.data;
  },

  getPendingClients: async (params?: {
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const response = await apiClient.get(`/admin/clients/pending?${queryParams.toString()}`);
    return response.data;
  },

  getClientById: async (id: string) => {
    const response = await apiClient.get(`/admin/clients/${id}`);
    return response.data;
  },

  approveClient: async (id: string, notes?: string) => {
    const response = await apiClient.post(`/admin/clients/${id}/approve`, { notes });
    return response.data;
  },

  rejectClient: async (id: string, reason?: string) => {
    const response = await apiClient.post(`/admin/clients/${id}/reject`, { reason });
    return response.data;
  },

  deleteClient: async (id: string) => {
    const response = await apiClient.delete(`/admin/clients/${id}`);
    return response.data;
  },

  // Appointments management
  getAllAppointments: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    serviceType?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.serviceType) queryParams.append("serviceType", params.serviceType);

    const response = await apiClient.get(`/admin/appointments?${queryParams.toString()}`);
    return response.data;
  },

  updateAppointmentStatus: async (id: string, status: string, reason?: string) => {
    const response = await apiClient.put(`/admin/appointments/${id}/status`, { status, reason });
    return response.data;
  },

  confirmAppointment: async (id: string) => {
    const response = await apiClient.post(`/admin/appointments/${id}/confirm`);
    return response.data;
  },

  cancelAppointment: async (id: string, reason?: string) => {
    const response = await apiClient.post(`/admin/appointments/${id}/cancel`, { reason });
    return response.data;
  },

  rescheduleAppointment: async (id: string, newDate: string, newTime: string, reason?: string) => {
    const response = await apiClient.post(`/admin/appointments/${id}/reschedule`, {
      newDate,
      newTime,
      reason,
    });
    return response.data;
  },

  // Admin notes
  addAdminNote: async (clientId: string, note: string, isPrivate?: boolean) => {
    const response = await apiClient.post(`/admin/clients/${clientId}/notes`, { note, isPrivate });
    return response.data;
  },

  getAdminNotes: async (clientId: string) => {
    const response = await apiClient.get(`/admin/clients/${clientId}/notes`);
    return response.data;
  },

  // Audit logs
  getAuditLogs: async (limit?: number) => {
    const response = await apiClient.get(`/admin/audit-logs?limit=${limit || 50}`);
    return response.data;
  },

  // Intake forms
  getIntakeForms: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    formType?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.formType) queryParams.append("formType", params.formType);

    const response = await apiClient.get(`/admin/intake-forms?${queryParams.toString()}`);
    return response.data;
  },

  reviewIntakeForm: async (id: string, status: string, notes?: string) => {
    const response = await apiClient.post(`/admin/intake-forms/${id}/review`, { status, notes });
    return response.data;
  },
};

// Clients API (Public + Protected)
export const clientsApi = {
  // Public registration
  register: async (data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    serviceType?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
  }) => {
    const response = await apiClient.post("/clients/register", data);
    return response.data;
  },

  // Protected endpoints
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    serviceType?: string;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.serviceType) queryParams.append("serviceType", params.serviceType);
    if (params?.status) queryParams.append("status", params.status);

    const response = await apiClient.get(`/clients?${queryParams.toString()}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/clients/${id}`);
    return response.data;
  },

  // Intake forms
  getIntakeForms: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    formType?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.formType) queryParams.append("formType", params.formType);

    const response = await apiClient.get(`/clients/intake?${queryParams.toString()}`);
    return response.data;
  },

  submitIntakeForm: async (data: {
    clientId?: string;
    email?: string;
    formType: string;
    formData: Record<string, unknown>;
  }) => {
    const response = await apiClient.post("/clients/intake/submit", data);
    return response.data;
  },
};

// Appointments API
export const appointmentsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    serviceType?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.serviceType) queryParams.append("serviceType", params.serviceType);

    const response = await apiClient.get(`/appointments?${queryParams.toString()}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data;
  },

  create: async (data: {
    client_id: string;
    appointment_date: string;
    start_time: string;
    service_type: string;
    notes?: string;
  }) => {
    const response = await apiClient.post("/appointments", data);
    return response.data;
  },
};

export default apiClient;
