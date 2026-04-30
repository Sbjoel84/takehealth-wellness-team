import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '' : 'https://take-health-web-api.onrender.com');

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = 'Bearer ' + token;
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'NOT_SPECIFIED';
  maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | 'NOT_SPECIFIED';
  phone?: string;
  bloodType?: string;
  allergies: string[];
  medicalHistory?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  reference: string;
  userId?: string;
  patientId: string;
  providerId: string;
  serviceId: string;
  scheduledAt: string;
  type: 'IN_PERSON' | 'VIRTUAL' | 'HOME_VISIT';
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW' | 'RESCHEDULED';
  notes?: string;
  duration?: number;
  createdAt: string;
  updatedAt: string;
  patient?: { firstName: string; lastName: string; phone?: string };
  provider?: { name: string };
  service?: { name: string };
}

export interface Provider {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  type: string;
  specialty?: string;
  location?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdAt: string;
}

export interface DashboardOverview {
  generatedAt: string;
  overview: {
    window: { from: string; to: string };
    users: { total: number; active: number; new: number; newDelta: number };
    patients: { total: number; new: number; newDelta: number };
    providers: { total: number; active: number; pendingVerification: number };
    appointments: {
      total: number; new: number; newDelta: number;
      confirmed: number; completed: number; completedDelta: number;
      cancelled: number; pending: number; noShow: number;
      completionRate: number; cancellationRate: number; noShowRate: number;
    };
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  signUp: async (data: { name: string; email: string; password: string }) => {
    const res = await apiClient.post<{ token: string | null; user: ApiUser }>(
      '/auth/sign-up/email', { ...data, rememberMe: true }
    );
    return res.data;
  },

  signIn: async (data: { email: string; password: string }) => {
    const res = await apiClient.post<{ token: string | null; user: ApiUser }>(
      '/auth/sign-in/email', { ...data, rememberMe: true }
    );
    return res.data;
  },

  getSession: async () => {
    const res = await apiClient.get<{ user: ApiUser; session: unknown }>('/auth/get-session');
    return res.data;
  },

  getProfile: async () => {
    const res = await apiClient.get<{ user: ApiUser; session: unknown }>('/auth/get-session');
    return res.data;
  },

  signOut: async () => {
    await apiClient.post('/auth/sign-out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// ─── Patients ─────────────────────────────────────────────────────────────────

export const patientsApi = {
  create: async (data: {
    firstName: string; lastName: string; dateOfBirth?: string;
    gender?: string; maritalStatus?: string; phone?: string;
    bloodType?: string; allergies?: string[]; medicalHistory?: string;
    emergencyContactName?: string; emergencyContactPhone?: string;
  }) => {
    const res = await apiClient.post<Patient>('/api/patients', data);
    return res.data;
  },

  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.search) q.set('search', params.search);
    const res = await apiClient.get<PaginatedResponse<Patient>>(`/api/patients?${q}`);
    return res.data;
  },

  getById: async (id: string) => {
    const res = await apiClient.get<Patient>(`/api/patients/${id}`);
    return res.data;
  },
};

// ─── Appointments ─────────────────────────────────────────────────────────────

export const appointmentsApi = {
  getAll: async (params?: {
    page?: number; limit?: number; status?: string;
    type?: string; from?: string; to?: string;
  }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.status) q.set('status', params.status);
    if (params?.type) q.set('type', params.type);
    if (params?.from) q.set('from', params.from);
    if (params?.to) q.set('to', params.to);
    const res = await apiClient.get<PaginatedResponse<Appointment>>(`/api/appointments?${q}`);
    return res.data;
  },

  getById: async (id: string) => {
    const res = await apiClient.get<Appointment>(`/api/appointments/${id}`);
    return res.data;
  },

  create: async (data: {
    patientId: string; providerId: string; serviceId?: string;
    scheduledAt: string; type: 'IN_PERSON' | 'VIRTUAL' | 'HOME_VISIT';
    notes?: string; duration?: number;
  }) => {
    const res = await apiClient.post<Appointment>('/api/appointments', data);
    return res.data;
  },

  confirm: async (id: string) => {
    const res = await apiClient.patch<Appointment>(`/api/appointments/${id}/confirm`);
    return res.data;
  },

  cancel: async (id: string, reason?: string) => {
    const res = await apiClient.patch<Appointment>(`/api/appointments/${id}/cancel`, { reason });
    return res.data;
  },

  reschedule: async (id: string, scheduledAt: string, reason?: string) => {
    const res = await apiClient.patch<Appointment>(`/api/appointments/${id}/reschedule`, { scheduledAt, reason });
    return res.data;
  },

  complete: async (id: string) => {
    const res = await apiClient.patch<Appointment>(`/api/appointments/${id}/complete`);
    return res.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/api/appointments/${id}`);
  },
};

// ─── Providers ────────────────────────────────────────────────────────────────

export const providersApi = {
  getAll: async (params?: { page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    const res = await apiClient.get<PaginatedResponse<Provider>>(`/api/health-service-providers?${q}`);
    return res.data;
  },

  getById: async (id: string) => {
    const res = await apiClient.get<Provider>(`/api/health-service-providers/${id}`);
    return res.data;
  },
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardApi = {
  getOverview: async () => {
    const res = await apiClient.get<DashboardOverview>('/api/dashboard/overview');
    return res.data;
  },

  getUpcomingAppointments: async () => {
    const res = await apiClient.get<Appointment[]>('/api/dashboard/upcoming-appointments');
    return res.data;
  },

  getRecentActivity: async () => {
    const res = await apiClient.get('/api/dashboard/recent-activity');
    return res.data;
  },
};

// ─── Messaging ────────────────────────────────────────────────────────────────

export const messagingApi = {
  getConversations: async () => {
    const res = await apiClient.get('/api/messaging/conversations');
    return res.data;
  },

  sendMessage: async (conversationId: string, content: string) => {
    const res = await apiClient.post(`/api/messaging/conversations/${conversationId}/messages`, { content });
    return res.data;
  },

  getMessages: async (conversationId: string, cursor?: string) => {
    const q = cursor ? `?cursor=${cursor}` : '';
    const res = await apiClient.get(`/api/messaging/conversations/${conversationId}/messages${q}`);
    return res.data;
  },

  getUnread: async () => {
    const res = await apiClient.get('/api/messaging/unread');
    return res.data;
  },
};

export default apiClient;
