// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "ADMIN" | "CLIENT" | "SERVICE_PROVIDER";
  createdAt: string;
  updatedAt: string;
}

// Client Types
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceInterest: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Appointment Types
export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  serviceProviderId: string;
  serviceProviderName: string;
  serviceName: string;
  date: string;
  time: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalClients: number;
  pendingApprovals: number;
  totalAppointments: number;
  completedAppointments: number;
  revenue: number;
  newClientsThisMonth: number;
}

// Auth Types
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "CLIENT" | "SERVICE_PROVIDER";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
