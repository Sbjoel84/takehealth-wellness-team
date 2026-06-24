import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import registrationsRouter from "./routes/registrations.js";
import patientsRouter from "./routes/patients.js";
import appointmentsRouter from "./routes/appointments.js";
import providersRouter from "./routes/providers.js";
import dashboardRouter from "./routes/dashboard.js";

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:8080",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://take-health-wellness.vercel.app",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Render health checks)
      if (!origin) return callback(null, true);
      if (allowedOrigins.some((o) => origin.startsWith(o)) || origin.endsWith(".onrender.com")) {
        return callback(null, true);
      }
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// Better Auth must be mounted BEFORE express.json() so it can parse its own body
app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (_req, res) => res.json({ status: "ok", service: "TakeHealth API", version: "1.0.0" }));
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Routes
app.use("/api/registrations", registrationsRouter);
app.use("/api/patients", patientsRouter);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/health-service-providers", providersRouter);
app.use("/api/dashboard", dashboardRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.message);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`TakeHealth API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
