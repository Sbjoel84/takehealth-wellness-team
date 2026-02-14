import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  FileText,
  ArrowRight,
  Activity,
  TrendingUp,
  Heart,
  Dumbbell,
  Sparkles,
  Stethoscope,
  Brain,
  Salad,
  Scissors,
  Eye,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminApi, DashboardStats, Client, Appointment } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
}

const StatsCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
}: StatsCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            <div className="flex items-center gap-1 mt-1">
              {trend && (
                <span
                  className={`text-xs font-medium ${
                    trend === "up"
                      ? "text-green-600"
                      : trend === "down"
                      ? "text-red-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {trend === "up" && "↑"}
                  {trend === "down" && "↓"}
                  {trendValue}
                </span>
              )}
              <span className="text-xs text-muted-foreground">{description}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Recent Client Item
interface RecentClientProps {
  id: string;
  fullName: string;
  email: string;
  serviceType?: string;
  status: string;
  createdAt: string;
}

const RecentClient = ({ fullName, email, serviceType, status, createdAt }: RecentClientProps) => {
  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
    SUSPENDED: "bg-orange-100 text-orange-800",
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b last:border-0">
      <Avatar>
        <AvatarFallback className="bg-primary/10 text-primary">
          {fullName
            ? fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)
            : "N/A"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{fullName || "Unknown"}</p>
        <p className="text-sm text-muted-foreground truncate">{email || "No email"}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">{serviceType?.replace("_", " ") || "GENERAL"}</p>
        <p className="text-xs text-muted-foreground">
          {createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}
        </p>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-100"}`}>
        {status}
      </span>
    </div>
  );
};

const DashboardOverview = () => {
  const [timeRange, setTimeRange] = useState("today");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashboardStats, clientsData, appointmentsData] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getAllClients({ page: 1, limit: 5 }),
        adminApi.getAllAppointments({ page: 1, limit: 5 }),
      ]);

      setStats(dashboardStats);
      setRecentClients(clientsData.data || []);
      setRecentAppointments(appointmentsData.data || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchDashboardData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Clients"
          value={stats?.clients?.total || 0}
          description={`${stats?.clients?.pending || 0} pending`}
          icon={Users}
        />
        <StatsCard
          title="Appointments"
          value={stats?.appointments?.total || 0}
          description={`${stats?.appointments?.pending || 0} pending`}
          icon={Calendar}
        />
        <StatsCard
          title="Onboarding"
          value={stats?.intakeForms?.total || 0}
          description={`${stats?.intakeForms?.pending || 0} pending`}
          icon={FileText}
        />
        <StatsCard
          title="Completed"
          value={stats?.appointments?.completed || 0}
          description="Appointments"
          icon={TrendingUp}
          trend="up"
          trendValue="12%"
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Clients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Clients</CardTitle>
            <Link to="/admin/clients">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : recentClients.length > 0 ? (
              <div className="divide-y">
                {recentClients.map((client) => (
                  <RecentClient
                    key={client.id}
                    id={client.id}
                    fullName={client.fullName}
                    email={client.email}
                    serviceType={client.serviceType}
                    status={client.status}
                    createdAt={client.createdAt}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent clients
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Appointments</CardTitle>
            <Link to="/admin/appointments">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : recentAppointments.length > 0 ? (
              <div className="divide-y">
                {recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center gap-4 p-4 border-b last:border-0">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {appointment.clientName
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2) || "N/A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{appointment.clientName || "Unknown"}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {appointment.serviceType?.replace("_", " ") || "General"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {appointment.appointmentDate
                          ? new Date(appointment.appointmentDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground">{appointment.startTime}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : appointment.status === "CONFIRMED" || appointment.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "CANCELLED"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent appointments
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Service Links - Connected to Admin Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Service Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-9">
            <Link to="/admin/clients?service=COUNSELLING">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2 w-full">
                <Brain className="w-6 h-6 text-primary" />
                <span>Counselling</span>
              </Button>
            </Link>
            <Link to="/admin/appointments?service=DENTAL">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2 w-full">
                <Stethoscope className="w-6 h-6 text-primary" />
                <span>Dental Care</span>
              </Button>
            </Link>
            <Link to="/admin/clients?service=FITNESS">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2 w-full">
                <Dumbbell className="w-6 h-6 text-primary" />
                <span>Gym & Fitness</span>
              </Button>
            </Link>
            <Link to="/admin/clients">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2 w-full">
                <Scissors className="w-6 h-6 text-primary" />
                <span>Skin Care</span>
              </Button>
            </Link>
            <Link to="/admin/appointments?service=ELITE_SPORT">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2 w-full">
                <Activity className="w-6 h-6 text-primary" />
                <span>Elite Sport</span>
              </Button>
            </Link>
            <Link to="/admin/appointments?service=REHAB">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2 w-full">
                <Heart className="w-6 h-6 text-primary" />
                <span>Rehabilitation</span>
              </Button>
            </Link>
            <Link to="/admin/clients?service=NUTRITION">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2 w-full">
                <Salad className="w-6 h-6 text-primary" />
                <span>Nutrition</span>
              </Button>
            </Link>
            <Link to="/admin/appointments?service=SPA">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2 w-full">
                <Sparkles className="w-6 h-6 text-primary" />
                <span>Spa & Massage</span>
              </Button>
            </Link>
            <Link to="/admin/onboarding">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2 w-full">
                <FileText className="w-6 h-6 text-primary" />
                <span>All Forms</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/clients">
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Manage Clients
              </Button>
            </Link>
            <Link to="/admin/appointments">
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                View Appointments
              </Button>
            </Link>
            <Link to="/admin/onboarding">
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Review Applications
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
