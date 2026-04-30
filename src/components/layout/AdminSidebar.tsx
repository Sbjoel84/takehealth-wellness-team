import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  FileStack,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Shield,
  Stethoscope,
  Activity,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authService } from "@/services/authService";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const menuItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/clients", icon: Users, label: "Clients" },
  { path: "/admin/onboarding", icon: FileStack, label: "Onboarding" },
  { path: "/admin/appointments", icon: Calendar, label: "Appointments" },
  { path: "/admin/providers", icon: Stethoscope, label: "Providers" },
  { path: "/admin/progress", icon: Activity, label: "Progress" },
  { path: "/admin/communications", icon: MessageSquare, label: "Messages" },
  { path: "/admin/documents", icon: FileText, label: "Documents" },
  { path: "/admin/settings", icon: Settings, label: "Settings" },
];

const AdminSidebar = ({ open, setOpen }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Read stored user for display
  const storedUser = authService.getStoredUser<{ name?: string; email?: string }>();
  const displayName = storedUser?.name || "Admin User";
  const displayEmail = storedUser?.email || "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ensure local session is always cleared even if server call fails
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      navigate("/login");
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-primary text-primary-foreground flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-primary/20 flex-shrink-0">
          <Link to="/admin" className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="TakeHealth Logo"
              className="h-14 w-auto object-contain"
            />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-primary-foreground hover:bg-primary/20"
            onClick={() => setOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-primary-foreground/10 text-primary-foreground"
                  : "text-primary-foreground/70 hover:bg-primary/10 hover:text-primary-foreground"
              }`}
              onClick={() => setOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Menu */}
        <div className="p-4 border-t border-primary/20 flex-shrink-0">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src="" alt={displayName} />
                <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium truncate">{displayName}</p>
                <p className="text-xs text-primary-foreground/60 truncate">{displayEmail}</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 flex-shrink-0 transition-transform ${
                  userMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-card rounded-lg shadow-lg border overflow-hidden z-10">
                <Link
                  to="/admin/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted w-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

// Mobile Header
export const AdminHeader = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-primary text-primary-foreground z-30 lg:hidden flex items-center px-4">
      <Button
        variant="ghost"
        size="icon"
        className="text-primary-foreground hover:bg-primary/20"
        onClick={() => setOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </Button>
      <div className="flex items-center gap-2 ml-4">
        <Shield className="w-6 h-6" />
        <span className="font-serif text-lg font-bold">TakeHealth Admin</span>
      </div>
    </header>
  );
};

export default AdminSidebar;
