import { Client } from "./types";

// Mock clients database
const mockClients: Client[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "+2348012345678",
    serviceInterest: "Wellness Program",
    status: "APPROVED",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@email.com",
    phone: "+2348012345679",
    serviceInterest: "Fitness Training",
    status: "PENDING",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.b@email.com",
    phone: "+2348012345680",
    serviceInterest: "Medical Checkup",
    status: "APPROVED",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.d@email.com",
    phone: "+2348012345681",
    serviceInterest: "Spa Treatment",
    status: "REJECTED",
    notes: "Not available in their area",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Wilson",
    email: "david.w@email.com",
    phone: "+2348012345682",
    serviceInterest: "Dental Care",
    status: "PENDING",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Check if using mock mode
const isMockMode = () => import.meta.env.VITE_USE_MOCK === "true";

// Client Service
export const clientService = {
  // Get all clients
  async getClients(): Promise<Client[]> {
    if (isMockMode()) {
      await delay(500);
      return [...mockClients].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    throw new Error("Backend not available");
  },

  // Get pending clients
  async getPendingClients(): Promise<Client[]> {
    if (isMockMode()) {
      await delay(500);
      return mockClients
        .filter((client) => client.status === "PENDING")
        .sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
    throw new Error("Backend not available");
  },

  // Get recent clients
  async getRecentClients(limit: number = 5): Promise<Client[]> {
    if (isMockMode()) {
      await delay(300);
      return [...mockClients]
        .sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, limit);
    }
    throw new Error("Backend not available");
  },

  // Approve client
  async approveClient(id: string): Promise<Client> {
    if (isMockMode()) {
      await delay(300);
      const clientIndex = mockClients.findIndex((c) => c.id === id);
      if (clientIndex === -1) {
        throw new Error("Client not found");
      }
      mockClients[clientIndex] = {
        ...mockClients[clientIndex],
        status: "APPROVED",
        updatedAt: new Date().toISOString(),
      };
      return mockClients[clientIndex];
    }
    throw new Error("Backend not available");
  },

  // Reject client
  async rejectClient(id: string): Promise<Client> {
    if (isMockMode()) {
      await delay(300);
      const clientIndex = mockClients.findIndex((c) => c.id === id);
      if (clientIndex === -1) {
        throw new Error("Client not found");
      }
      mockClients[clientIndex] = {
        ...mockClients[clientIndex],
        status: "REJECTED",
        updatedAt: new Date().toISOString(),
      };
      return mockClients[clientIndex];
    }
    throw new Error("Backend not available");
  },

  // Delete client
  async deleteClient(id: string): Promise<void> {
    if (isMockMode()) {
      await delay(300);
      const clientIndex = mockClients.findIndex((c) => c.id === id);
      if (clientIndex === -1) {
        throw new Error("Client not found");
      }
      mockClients.splice(clientIndex, 1);
      return;
    }
    throw new Error("Backend not available");
  },

  // Add new client
  async addClient(data: Omit<Client, "id" | "createdAt" | "updatedAt" | "status">): Promise<Client> {
    if (isMockMode()) {
      await delay(500);
      const newClient: Client = {
        ...data,
        id: String(mockClients.length + 1),
        status: "PENDING",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockClients.push(newClient);
      return newClient;
    }
    throw new Error("Backend not available");
  },

  // Get client by ID
  async getClientById(id: string): Promise<Client | null> {
    if (isMockMode()) {
      await delay(300);
      return mockClients.find((c) => c.id === id) || null;
    }
    throw new Error("Backend not available");
  },

  // Get clients count by status
  async getClientsCountByStatus(): Promise<{ pending: number; approved: number; rejected: number }> {
    if (isMockMode()) {
      await delay(200);
      return {
        pending: mockClients.filter((c) => c.status === "PENDING").length,
        approved: mockClients.filter((c) => c.status === "APPROVED").length,
        rejected: mockClients.filter((c) => c.status === "REJECTED").length,
      };
    }
    throw new Error("Backend not available");
  },
};

export default clientService;
