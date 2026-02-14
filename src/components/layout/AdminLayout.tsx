import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar, { AdminHeader } from "./AdminSidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Sidebar */}
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Mobile Header */}
      <AdminHeader setOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="lg:pl-64 pt-16 lg:pt-0">
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
