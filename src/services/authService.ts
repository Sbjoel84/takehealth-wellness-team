import { AuthResponse, LoginCredentials, RegisterData, User } from "./types";

// Mock users database
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@takehealth.com",
    firstName: "Admin",
    lastName: "User",
    phone: "+2341234567",
    role: "ADMIN",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "client@takehealth.com",
    firstName: "John",
    lastName: "Doe",
    phone: "+2341234568",
    role: "CLIENT",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock JWT token
const mockToken = "mock-jwt-token-" + Date.now();
const mockRefreshToken = "mock-refresh-token-" + Date.now();

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Check if using mock mode
const isMockMode = () => import.meta.env.VITE_USE_MOCK === "true";

// Auth Service
export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (isMockMode()) {
      await delay(500);
      
      const user = mockUsers.find(
        (u) => u.email === credentials.email
      );

      if (user && credentials.password === "password123") {
        return {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          accessToken: mockToken,
          refreshToken: mockRefreshToken,
        };
      }
      
      throw new Error("Invalid email or password");
    }
    
    throw new Error("Backend not available - enable mock mode");
  },

  // Register
  async register(data: RegisterData): Promise<AuthResponse> {
    if (isMockMode()) {
      await delay(500);
      
      // Check if user already exists
      const existingUser = mockUsers.find((u) => u.email === data.email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }
      
      // Create new user
      const newUser: User = {
        id: String(mockUsers.length + 1),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: "CLIENT",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      mockUsers.push(newUser);
      
      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
        },
        accessToken: mockToken,
        refreshToken: mockRefreshToken,
      };
    }
    
    throw new Error("Backend not available - enable mock mode");
  },

  // Logout
  async logout(): Promise<void> {
    if (isMockMode()) {
      await delay(200);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      return;
    }
    
    throw new Error("Backend not available - enable mock mode");
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    if (isMockMode()) {
      await delay(300);
      
      const userStr = localStorage.getItem("user");
      if (userStr) {
        return JSON.parse(userStr);
      }
      return null;
    }
    
    throw new Error("Backend not available - enable mock mode");
  },

  // Refresh token
  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    if (isMockMode()) {
      await delay(200);
      return {
        accessToken: mockToken,
        refreshToken: mockRefreshToken,
      };
    }
    
    throw new Error("Backend not available - enable mock mode");
  },

  // Store auth data in localStorage
  storeAuthData(authResponse: AuthResponse): void {
    localStorage.setItem("accessToken", authResponse.accessToken);
    localStorage.setItem("refreshToken", authResponse.refreshToken);
    localStorage.setItem("user", JSON.stringify(authResponse.user));
  },

  // Get stored auth data
  getStoredAuth(): { user: User | null; token: string | null } {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");
    return {
      user: userStr ? JSON.parse(userStr) : null,
      token,
    };
  },
};

export default authService;
