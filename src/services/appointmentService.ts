import { Appointment } from "./types";

// Mock appointments database
const mockAppointments: Appointment[] = [
  {
    id: "1",
    clientId: "1",
    clientName: "John Smith",
    serviceProviderId: "1",
    serviceProviderName: "Dr. Adebayo",
    serviceName: "Wellness Checkup",
    date: "2024-02-15",
    time: "10:00",
    status: "PENDING",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    clientId: "2",
    clientName: "Sarah Johnson",
    serviceProviderId: "2",
    serviceProviderName: "Dr. Chidi",
    serviceName: "Fitness Assessment",
    date: "2024-02-16",
    time: "14:00",
    status: "CONFIRMED",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    clientId: "3",
    clientName: "Michael Brown",
    serviceProviderId: "3",
    serviceProviderName: "Dr. Fatima",
    serviceName: "Dental Cleaning",
    date: "2024-02-10",
    time: "09:00",
    status: "COMPLETED",
    notes: "Patient showed great improvement",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    clientId: "1",
    clientName: "John Smith",
    serviceProviderId: "1",
    serviceProviderName: "Dr. Adebayo",
    serviceName: "Follow-up Visit",
    date: "2024-02-20",
    time: "11:00",
    status: "PENDING",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    clientId: "2",
    clientName: "Sarah Johnson",
    serviceProviderId: "4",
    serviceProviderName: "Dr. Amara",
    serviceName: "Spa Treatment",
    date: "2024-02-18",
    time: "15:00",
    status: "CANCELLED",
    notes: "Client requested cancellation",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Check if using mock mode
const isMockMode = () => import.meta.env.VITE_USE_MOCK === "true";

// Appointment Service
export const appointmentService = {
  // Get all appointments
  async getAppointments(): Promise<Appointment[]> {
    if (isMockMode()) {
      await delay(500);
      return [...mockAppointments].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }
    throw new Error("Backend not available");
  },

  // Get appointments by status
  async getAppointmentsByStatus(status: Appointment["status"]): Promise<Appointment[]> {
    if (isMockMode()) {
      await delay(400);
      return mockAppointments.filter((apt) => apt.status === status);
    }
    throw new Error("Backend not available");
  },

  // Get recent appointments
  async getRecentAppointments(limit: number = 5): Promise<Appointment[]> {
    if (isMockMode()) {
      await delay(300);
      return [...mockAppointments]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
    }
    throw new Error("Backend not available");
  },

  // Create appointment
  async createAppointment(data: Omit<Appointment, "id" | "createdAt" | "updatedAt">): Promise<Appointment> {
    if (isMockMode()) {
      await delay(500);
      const newAppointment: Appointment = {
        ...data,
        id: String(mockAppointments.length + 1),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockAppointments.push(newAppointment);
      return newAppointment;
    }
    throw new Error("Backend not available");
  },

  // Update appointment status
  async updateAppointmentStatus(
    id: string,
    status: Appointment["status"]
  ): Promise<Appointment> {
    if (isMockMode()) {
      await delay(300);
      const aptIndex = mockAppointments.findIndex((a) => a.id === id);
      if (aptIndex === -1) {
        throw new Error("Appointment not found");
      }
      mockAppointments[aptIndex] = {
        ...mockAppointments[aptIndex],
        status,
        updatedAt: new Date().toISOString(),
      };
      return mockAppointments[aptIndex];
    }
    throw new Error("Backend not available");
  },

  // Cancel appointment
  async cancelAppointment(id: string): Promise<Appointment> {
    if (isMockMode()) {
      await delay(300);
      const aptIndex = mockAppointments.findIndex((a) => a.id === id);
      if (aptIndex === -1) {
        throw new Error("Appointment not found");
      }
      mockAppointments[aptIndex] = {
        ...mockAppointments[aptIndex],
        status: "CANCELLED",
        updatedAt: new Date().toISOString(),
      };
      return mockAppointments[aptIndex];
    }
    throw new Error("Backend not available");
  },

  // Delete appointment
  async deleteAppointment(id: string): Promise<void> {
    if (isMockMode()) {
      await delay(300);
      const aptIndex = mockAppointments.findIndex((a) => a.id === id);
      if (aptIndex === -1) {
        throw new Error("Appointment not found");
      }
      mockAppointments.splice(aptIndex, 1);
      return;
    }
    throw new Error("Backend not available");
  },

  // Get appointments count by status
  async getAppointmentsCountByStatus(): Promise<{
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  }> {
    if (isMockMode()) {
      await delay(200);
      return {
        pending: mockAppointments.filter((a) => a.status === "PENDING").length,
        confirmed: mockAppointments.filter((a) => a.status === "CONFIRMED").length,
        completed: mockAppointments.filter((a) => a.status === "COMPLETED").length,
        cancelled: mockAppointments.filter((a) => a.status === "CANCELLED").length,
      };
    }
    throw new Error("Backend not available");
  },
};

export default appointmentService;
