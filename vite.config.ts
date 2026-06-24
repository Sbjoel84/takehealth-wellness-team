import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      // In development, set VITE_BACKEND_PROXY=http://localhost:5000 to hit a local backend.
      // In CI / staging it falls back to the live Render service.
      "/api": {
        target: process.env.VITE_BACKEND_PROXY || "https://take-health-web-api.onrender.com",
        changeOrigin: true,
        secure: true,
        proxyTimeout: 120_000,
        timeout: 120_000,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
