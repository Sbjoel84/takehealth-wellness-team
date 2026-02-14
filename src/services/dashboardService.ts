import { DashboardStats } from "./types";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Check if using mock mode
const isMockMode = () => import.meta.env.VITE_USE_MOCK === "true";

// Dashboard Service
export const dashboardService = {
  // Get dashboard statistics
  async getStats(): Promise<DashboardStats> {
    if (isMockMode()) {
      await delay(500);
      
      // These values would normally come from the database
      // For now, we return mock data
      return {
        totalClients: 156,
        pendingApprovals: 12,
        totalAppointments: 89,
        completedAppointments: 67,
        revenue: 456000,
        newClientsThisMonth: 23,
      };
    }
    throw new Error("Backend not available");
  },

  // Get recent activity
  async getRecentActivity(): Promise<{
    recentClients: number;
    recentAppointments: number;
    pendingTasks: number;
  }> {
    if (isMockMode()) {
      await delay(300);
      return {
        recentClients: 5,
        recentAppointments: 8,
        pendingTasks: 3,
      };
    }
    throw new Error("Backend not available");
  },

  // Get monthly revenue data
  async getMonthlyRevenue(): Promise<{ month: string; revenue: number }[]> {
    if (isMockMode()) {
      await delay(400);
      return [
        { month: "Jan", revenue: 45000 },
        { month: "Feb", revenue: 52000 },
        { month: "Mar", revenue: 48000 },
        { month: "Apr", revenue: 61000 },
        { month: "May", revenue: 55000 },
        { month: "Jun", revenue: 67000 },
      ];
    }
    throw new Error("Backend not available");
  },

  // Get service distribution
  async getServiceDistribution(): Promise<{ service: string; count: number }[]> {
    if (isMockMode()) {
      await delay(400);
      return [
        { service: "Wellness Programs", count: 45 },
        { service: "Fitness Training", count: 38 },
        { service: "Medical Checkup", count: 32 },
        { service: "Dental Care", count: 28 },
        { service: "Spa Treatment", count: 22 },
      ];
    }
    throw new Error("Backend not available");
  },
};

export default dashboardService;
