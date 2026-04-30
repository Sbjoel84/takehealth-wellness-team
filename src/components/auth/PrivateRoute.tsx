import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

// In development, skip auth so the dashboard is accessible without credentials.
// In production this guard is enforced.
const DEV_BYPASS = import.meta.env.DEV;

const PrivateRoute = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (DEV_BYPASS) return <Outlet />;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
