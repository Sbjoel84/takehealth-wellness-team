# TakeHealth Wellness

Your journey to better health starts here.

## Project info

**Website**: https://takehealth.com

## ⚠️ Backend Status

**IMPORTANT**: The backend has been intentionally removed from this repository. This is a **frontend-only** application that uses mock services by default.

### Mock Mode Enabled

The application is currently configured to use **mock services** for all data operations. This allows the frontend to function fully without a backend.

#### Test Credentials

- **Admin Login**: `admin@takehealth.com` / `password123`
- **Client Login**: `client@takehealth.com` / `password123`

### How to Switch to Real Backend

To connect a real backend API:

1. Set `VITE_USE_MOCK=false` in your `.env` file
2. Update `VITE_API_URL` to point to your backend URL
3. Implement the API calls in each service file (replace the mock implementations)

---

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Navigate to the project directory
cd takehealth-wellness-main

# Install the necessary dependencies
npm install

# Start the development server
npm run dev
```

### Building for Production

```sh
npm run build
```

---

## Project Structure

```
src/
├── components/        # React components
├── pages/            # Page components
├── services/        # Service layer (API abstraction)
│   ├── authService.ts      # Authentication
│   ├── clientService.ts    # Client management
│   ├── appointmentService.ts # Appointments
│   ├── dashboardService.ts # Dashboard stats
│   └── types.ts            # TypeScript interfaces
├── hooks/            # Custom React hooks
│   └── useAuth.tsx  # Authentication context
├── lib/             # Utilities
└── assets/          # Static assets
```

---

## Services Layer

All API communication is centralized in `src/services/`:

### Current Services

- **authService** - Login, register, logout, token refresh
- **clientService** - Client CRUD operations
- **appointmentService** - Appointment management
- **dashboardService** - Dashboard statistics

### Adding a Real Backend

To replace mock services with a real backend:

1. Update each service file to call your actual API endpoints
2. Use the existing types from `src/services/types.ts`
3. Keep the same function signatures for compatibility

Example pattern:

```typescript
// In authService.ts
async login(credentials: LoginCredentials): Promise<AuthResponse> {
  if (isMockMode()) {
    // Return mock data
  }
  
  // Real API call
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  return response.json();
}
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_USE_MOCK` | Enable mock services | `true` |
| `VITE_API_URL` | Backend API URL | `http://localhost:3000/api/v1` |

---

## Technology Stack

- **Vite** - Build tool
- **TypeScript** - Type safety
- **React** - UI framework
- **shadcn-ui** - Component library
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

---

## Deployment

Deploy to your preferred hosting platform (Vercel, Netlify, etc.).

### Build for Production

```sh
npm run build
```

The output will be in the `dist/` folder.

---

## License

MIT
