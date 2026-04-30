import { useApi } from "./useApi";
import { clientService } from "@/services/clientService";

export function usePatients(params?: { page?: number; limit?: number; search?: string }) {
  return useApi(
    () => clientService.getClients(params),
    [params?.page, params?.limit, params?.search]
  );
}

export function usePatient(id: string) {
  return useApi(() => clientService.getClientById(id), [id]);
}
