import { apiRequest } from "./api";

export interface AssignedProvider {
  id: string;
  name: string;
  type: string;
  specialty?: string | null;
  location?: string | null;
}

export interface MePatient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  gender: string;
  maritalStatus: string;
  dateOfBirth?: string | null;
  allergies: string[];
  medicalHistory?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  address?: string | null;
  serviceType?: string | null;
  planId?: string | null;
  status: string;
  assignedProviderId?: string | null;
  assignedProvider?: AssignedProvider | null;
  createdAt: string;
}

export interface MeResponse {
  user: { id: string; name: string; email: string; role: string };
  patient: MePatient | null;
  registration: {
    id: string;
    status: string;
    serviceType?: string | null;
    planId?: string | null;
    createdAt: string;
  } | null;
}

export interface MeAppointment {
  id: string;
  reference: string;
  scheduledAt: string;
  type: "IN_PERSON" | "VIRTUAL" | "HOME_VISIT";
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW" | "RESCHEDULED";
  notes?: string | null;
  duration?: number | null;
  cancelReason?: string | null;
  createdAt: string;
  provider?: { name: string; type: string; specialty?: string | null } | null;
}

export interface ActivityEntry {
  id: string;
  type: string;
  message: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export const meService = {
  getMe() {
    return apiRequest<MeResponse>("/api/me");
  },
  getMyAppointments() {
    return apiRequest<{ data: MeAppointment[] }>("/api/me/appointments");
  },
  getMyActivity() {
    return apiRequest<{ data: ActivityEntry[] }>("/api/me/activity");
  },
};

export default meService;
