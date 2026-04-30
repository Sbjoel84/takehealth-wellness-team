import { useApi } from "./useApi";
import { dashboardService } from "@/services/dashboardService";

export function useDashboardOverview() {
  return useApi(() => dashboardService.getOverview());
}

export function useRecentPatients(limit = 5) {
  return useApi(() => dashboardService.getRecentPatients(limit), [limit]);
}

export function useRecentAppointments(limit = 5) {
  return useApi(() => dashboardService.getRecentAppointments(limit), [limit]);
}
