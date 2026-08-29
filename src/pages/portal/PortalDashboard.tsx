import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format, formatDistanceToNow, isAfter } from "date-fns";
import {
  CalendarClock, CheckCircle2, ClipboardList, MapPin, Stethoscope,
  UserRound, XCircle, CalendarPlus, RefreshCw, Sparkles, Clock,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/services/api";
import {
  meService, type MeResponse, type MeAppointment, type ActivityEntry,
} from "@/services/meService";

const SERVICE_LABELS: Record<string, string> = {
  gym: "Gym Services",
  spa: "Spa & Massage Therapy",
  skincare: "Skin Care Services",
  dental: "Dental Care Services",
  elite: "Elite Sport Care",
  rehab: "Rehabilitative Care",
  nutrition: "Nutritional Care",
  counselling: "Counselling Services",
  health360: "Health360+ Program",
  corporate: "Corporate / Enterprise Plan",
};

const APPT_STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  RESCHEDULED: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  CANCELLED: "bg-red-100 text-red-800",
  NO_SHOW: "bg-red-100 text-red-800",
};

const ACTIVITY_ICONS: Record<string, typeof CheckCircle2> = {
  REGISTRATION_SUBMITTED: ClipboardList,
  REGISTRATION_APPROVED: CheckCircle2,
  PROVIDER_ASSIGNED: Stethoscope,
  APPOINTMENT_SCHEDULED: CalendarPlus,
  APPOINTMENT_CONFIRMED: CheckCircle2,
  APPOINTMENT_RESCHEDULED: RefreshCw,
  APPOINTMENT_CANCELLED: XCircle,
  APPOINTMENT_COMPLETED: CheckCircle2,
};

function serviceLabel(serviceType?: string | null) {
  if (!serviceType) return "—";
  return SERVICE_LABELS[serviceType.toLowerCase()] || serviceType;
}

function planLabel(planId?: string | null) {
  if (!planId) return null;
  return planId
    .split(/[-_]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function prettyType(type: string) {
  return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

const PortalDashboard = () => {
  const { toast } = useToast();

  const [me, setMe] = useState<MeResponse | null>(null);
  const [appointments, setAppointments] = useState<MeAppointment[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [meRes, apptRes, actRes] = await Promise.all([
        meService.getMe(),
        meService.getMyAppointments(),
        meService.getMyActivity(),
      ]);
      setMe(meRes);
      setAppointments(apptRes.data || []);
      setActivity(actRes.data || []);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not load your dashboard.";
      setError(message);
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    const up: MeAppointment[] = [];
    const pa: MeAppointment[] = [];
    for (const a of appointments) {
      const when = new Date(a.scheduledAt);
      if (isAfter(when, now) && a.status !== "CANCELLED" && a.status !== "COMPLETED") up.push(a);
      else pa.push(a);
    }
    pa.reverse(); // most recent first
    return { upcoming: up, past: pa };
  }, [appointments]);

  const patient = me?.patient;
  const membershipActive = (patient?.status || "").toUpperCase() === "ACTIVE";
  const displayName = patient
    ? `${patient.firstName} ${patient.lastName}`.trim()
    : me?.user.name || "there";
  const provider = patient?.assignedProvider;

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-8 py-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-1">
              My Dashboard
            </p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Welcome back, {displayName.split(" ")[0]}
            </h1>
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </motion.div>

        {error && !loading && (
          <Card className="mb-8 border-destructive/40">
            <CardContent className="pt-6 flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button size="sm" onClick={load}>Try again</Button>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="grid gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-40 rounded-xl bg-muted/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Membership / profile */}
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Membership
                </CardTitle>
                <Badge className={membershipActive ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                  {membershipActive ? "Active" : "Pending activation"}
                </Badge>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Service</p>
                  <p className="font-medium">{serviceLabel(patient?.serviceType || me?.registration?.serviceType)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Plan</p>
                  <p className="font-medium">
                    {planLabel(patient?.planId || me?.registration?.planId) || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Member since</p>
                  <p className="font-medium">
                    {patient?.createdAt ? format(new Date(patient.createdAt), "d MMM yyyy") : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium break-all">{me?.user.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{patient?.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Emergency contact</p>
                  <p className="font-medium">
                    {patient?.emergencyContactName
                      ? `${patient.emergencyContactName}${patient.emergencyContactPhone ? ` · ${patient.emergencyContactPhone}` : ""}`
                      : "—"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Assigned instructor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserRound className="w-5 h-5 text-primary" />
                  Your instructor
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {provider ? (
                  <div className="space-y-2">
                    <p className="font-semibold text-base">{provider.name}</p>
                    <p className="text-muted-foreground">
                      {prettyType(provider.type)}
                      {provider.specialty ? ` · ${provider.specialty}` : ""}
                    </p>
                    {provider.location && (
                      <p className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {provider.location}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Not yet assigned — your team will match you with an instructor shortly.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarClock className="w-5 h-5 text-primary" />
                  At a glance
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-2xl font-bold text-foreground">{upcoming.length}</p>
                  <p className="text-xs text-muted-foreground">Upcoming</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {appointments.filter((a) => a.status === "COMPLETED").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{activity.length}</p>
                  <p className="text-xs text-muted-foreground">Activity events</p>
                </div>
              </CardContent>
            </Card>

            {/* Appointment schedule */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarClock className="w-5 h-5 text-primary" />
                  Appointment schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upcoming">
                  <TabsList className="mb-4">
                    <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
                    <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upcoming">
                    <AppointmentTable rows={upcoming} emptyText="You have no upcoming appointments. Your instructor will schedule your sessions." />
                  </TabsContent>
                  <TabsContent value="past">
                    <AppointmentTable rows={past} emptyText="No past appointments yet." />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Activity timeline */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  Recent activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
                ) : (
                  <ul className="space-y-4">
                    {activity.map((entry) => {
                      const Icon = ACTIVITY_ICONS[entry.type] || Clock;
                      return (
                        <li key={entry.id} className="flex gap-3">
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Icon className="w-4 h-4 text-primary" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm text-foreground">{entry.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <p className="text-center text-sm text-muted-foreground mt-10">
          Need to change something?{" "}
          <Link to="/contact" className="text-primary font-medium hover:underline">
            Contact your wellness team
          </Link>
        </p>
      </div>
    </Layout>
  );
};

function AppointmentTable({ rows, emptyText }: { rows: MeAppointment[]; emptyText: string }) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">{emptyText}</p>;
  }
  return (
    <div className="divide-y divide-border">
      {rows.map((a) => {
        const when = new Date(a.scheduledAt);
        return (
          <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3">
            <div>
              <p className="font-medium text-sm">
                {format(when, "EEE d MMM yyyy")} · {format(when, "HH:mm")}
              </p>
              <p className="text-xs text-muted-foreground">
                {prettyType(a.type)}
                {a.provider?.name ? ` · ${a.provider.name}` : ""}
                {a.duration ? ` · ${a.duration} min` : ""}
              </p>
              {a.status === "CANCELLED" && a.cancelReason && (
                <p className="text-xs text-red-600 mt-0.5">Reason: {a.cancelReason}</p>
              )}
            </div>
            <Badge className={APPT_STATUS_STYLES[a.status] || "bg-gray-100 text-gray-800"}>
              {prettyType(a.status)}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}

export default PortalDashboard;
