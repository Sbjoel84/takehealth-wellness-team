import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Calendar, Clock, User, Stethoscope, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { appointmentService } from "@/services/appointmentService";
import { clientService } from "@/services/clientService";
import { providerService } from "@/services/providerService";
import { apiRequest, ApiError } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface PatientOption  { id: string; label: string; }
interface ProviderOption { id: string; label: string; type: string; }
interface ServiceOption  { id: string; label: string; }

interface FormState {
  patientId:  string;
  providerId: string;
  serviceId:  string;
  type: "IN_PERSON" | "VIRTUAL" | "HOME_VISIT" | "";
  date:     string;
  time:     string;
  duration: string;
  notes:    string;
}

const EMPTY_FORM: FormState = {
  patientId: "", providerId: "", serviceId: "",
  type: "", date: "", time: "", duration: "60", notes: "",
};

function validate(form: FormState, hasServices: boolean): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!form.patientId)               errors.patientId  = "Please select a patient.";
  if (!form.providerId)              errors.providerId = "Please select a provider.";
  if (hasServices && !form.serviceId) errors.serviceId = "Please select a service.";
  if (!form.type)                    errors.type       = "Please select an appointment type.";
  if (!form.date)                    errors.date       = "Please select a date.";
  if (!form.time)                    errors.time       = "Please select a time.";
  return errors;
}

const AddAppointment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm]               = useState<FormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading]     = useState(false);

  const [patients,  setPatients]  = useState<PatientOption[]>([]);
  const [providers, setProviders] = useState<ProviderOption[]>([]);
  const [services,  setServices]  = useState<ServiceOption[]>([]);
  const [dropdownsLoading, setDropdownsLoading] = useState(true);
  const [dropdownError,    setDropdownError]    = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setDropdownsLoading(true);
      try {
        const [patientsRes, providersRes] = await Promise.all([
          clientService.getClients({ page: 1, limit: 100 }),
          providerService.getProviders({ limit: 100 }),
        ]);

        setPatients(
          (patientsRes.data || []).map((p: Record<string, string>) => ({
            id: p.id,
            label: `${p.firstName} ${p.lastName}${p.phone ? ` — ${p.phone}` : ""}`,
          }))
        );

        setProviders(
          (providersRes.data || []).map((p: Record<string, string>) => ({
            id: p.id,
            label: p.name,
            type: p.type || "",
          }))
        );

        // Try to load services — silently ignore if endpoint doesn't exist yet
        try {
          const servicesRes = await apiRequest<unknown>("/api/services");
          const list: unknown[] = Array.isArray(servicesRes)
            ? servicesRes
            : Array.isArray((servicesRes as Record<string, unknown>)?.data)
            ? ((servicesRes as Record<string, unknown>).data as unknown[])
            : [];
          if (list.length > 0) {
            setServices(
              list.map((s) => {
                const svc = s as Record<string, string>;
                return { id: svc.id, label: svc.name || svc.title || svc.id };
              })
            );
          }
        } catch {
          // /api/services not available — serviceId will be omitted from the request
        }
      } catch (error) {
        const msg = error instanceof ApiError ? error.message : "Failed to load patients or providers";
        setDropdownError(msg);
      } finally {
        setDropdownsLoading(false);
      }
    };
    load();
  }, []);

  const set = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate(form, services.length > 0);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast({ title: "Please fix the errors below", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const scheduledAt = `${form.date}T${form.time}:00`;
      await appointmentService.createAppointment({
        patientId:  form.patientId,
        providerId: form.providerId,
        ...(form.serviceId ? { serviceId: form.serviceId } : {}),
        type:       form.type as "IN_PERSON" | "VIRTUAL" | "HOME_VISIT",
        scheduledAt,
        duration:   parseInt(form.duration, 10) || 60,
        notes:      form.notes || undefined,
      });

      toast({ title: "Appointment scheduled successfully" });
      navigate("/admin/appointments");
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Failed to create appointment";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const FieldError = ({ name }: { name: string }) =>
    fieldErrors[name] ? (
      <p className="text-xs text-destructive flex items-center gap-1 mt-1">
        <AlertCircle className="w-3 h-3" />{fieldErrors[name]}
      </p>
    ) : null;

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/appointments"><ArrowLeft className="w-5 h-5" /></Link>
        </Button>
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold">Schedule Appointment</h1>
          <p className="text-muted-foreground mt-1">Create a new appointment for a client</p>
        </div>
      </div>

      {dropdownError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{dropdownError}</AlertDescription>
        </Alert>
      )}

      {Object.keys(fieldErrors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please correct the highlighted fields before submitting.</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Participants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Participants
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Patient <span className="text-destructive">*</span></Label>
                <Select value={form.patientId} onValueChange={(v) => set("patientId", v)} disabled={dropdownsLoading}>
                  <SelectTrigger className={fieldErrors.patientId ? "border-destructive" : ""}>
                    <SelectValue placeholder={dropdownsLoading ? "Loading patients…" : "Select patient"} />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError name="patientId" />
              </div>

              <div className="space-y-2">
                <Label>Provider <span className="text-destructive">*</span></Label>
                <Select value={form.providerId} onValueChange={(v) => set("providerId", v)} disabled={dropdownsLoading}>
                  <SelectTrigger className={fieldErrors.providerId ? "border-destructive" : ""}>
                    <SelectValue placeholder={dropdownsLoading ? "Loading providers…" : "Select provider"} />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.label}{p.type ? ` — ${p.type}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError name="providerId" />
              </div>

              {/* Service selector — only shown if /api/services returned data */}
              {services.length > 0 && (
                <div className="space-y-2">
                  <Label>Service <span className="text-destructive">*</span></Label>
                  <Select value={form.serviceId} onValueChange={(v) => set("serviceId", v)}>
                    <SelectTrigger className={fieldErrors.serviceId ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError name="serviceId" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Type <span className="text-destructive">*</span></Label>
                <Select value={form.type} onValueChange={(v) => set("type", v)}>
                  <SelectTrigger className={fieldErrors.type ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN_PERSON">In Person</SelectItem>
                    <SelectItem value="VIRTUAL">Virtual</SelectItem>
                    <SelectItem value="HOME_VISIT">Home Visit</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError name="type" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apt-date">Date <span className="text-destructive">*</span></Label>
                <Input
                  id="apt-date"
                  type="date"
                  min={minDate}
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  className={fieldErrors.date ? "border-destructive" : ""}
                />
                <FieldError name="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apt-time">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Time <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="apt-time"
                  type="time"
                  value={form.time}
                  onChange={(e) => set("time", e.target.value)}
                  className={fieldErrors.time ? "border-destructive" : ""}
                />
                <FieldError name="time" />
              </div>

              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Select value={form.duration} onValueChange={(v) => set("duration", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="45">45 min</SelectItem>
                    <SelectItem value="60">60 min</SelectItem>
                    <SelectItem value="90">90 min</SelectItem>
                    <SelectItem value="120">120 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5" />
              Additional Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Any notes for this appointment..."
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" type="button" asChild>
            <Link to="/admin/appointments">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isLoading || dropdownsLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                Scheduling…
              </span>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Schedule Appointment
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddAppointment;
