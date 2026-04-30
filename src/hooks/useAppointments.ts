import { useApi } from "./useApi";
import { appointmentService } from "@/services/appointmentService";

export function useAppointments(params?: {
  page?: number;
  limit?: number;
  status?: string;
  patientId?: string;
}) {
  return useApi(
    () => appointmentService.getAppointments(params),
    [params?.page, params?.limit, params?.status, params?.patientId]
  );
}

export function useAppointment(id: string) {
  return useApi(() => appointmentService.getAppointmentById(id), [id]);
}
