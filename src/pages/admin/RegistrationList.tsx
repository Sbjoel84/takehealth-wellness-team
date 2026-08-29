import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { apiRequest, ApiError } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  serviceType: string | null;
  planId: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNotes: string | null;
  address: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  emergencyContact: string | null;
  emergencyPhone: string | null;
  allergies: string | null;
  medicalHistory: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500",
  APPROVED: "bg-green-600",
  REJECTED: "bg-red-500",
};

const RegistrationList = () => {
  const { toast } = useToast();

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<Registration | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [decision, setDecision] = useState<"APPROVE" | "REJECT">("APPROVE");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ status: "", search: "" });

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = new URLSearchParams();
      q.set("page", String(pagination.page));
      q.set("limit", String(pagination.limit));
      if (filters.status) q.set("status", filters.status);
      if (filters.search) q.set("search", filters.search);

      const res = await apiRequest<{ data: Registration[]; meta?: { total: number; totalPages: number } }>(
        `/api/registrations?${q}`
      );
      setRegistrations(res.data || []);
      setPagination((prev) => ({
        ...prev,
        total: res.meta?.total ?? (res.data || []).length,
        totalPages: res.meta?.totalPages ?? 1,
      }));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => { fetchRegistrations(); }, [fetchRegistrations]);

  const openReview = (reg: Registration) => {
    setSelected(reg);
    setDecision("APPROVE");
    setNotes("");
    setIsDialogOpen(true);
  };

  const submitReview = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      const path = decision === "APPROVE" ? "approve" : "reject";
      await apiRequest(`/api/registrations/${selected.id}/${path}`, "POST", { notes: notes || undefined });
      const nextStatus = decision === "APPROVE" ? "APPROVED" : "REJECTED";
      setRegistrations((prev) =>
        prev.map((r) => (r.id === selected.id ? { ...r, status: nextStatus as Registration["status"] } : r))
      );
      toast({
        title: decision === "APPROVE" ? "Registration approved" : "Registration rejected",
        description:
          decision === "APPROVE"
            ? "A client login account has been created. They can now sign in."
            : undefined,
      });
      setIsDialogOpen(false);
    } catch (err) {
      toast({
        title: "Action failed",
        description: err instanceof ApiError ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold">Registrations</h1>
          <p className="text-muted-foreground mt-1">
            Review client sign-ups. Approving one creates their login account and profile.
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchRegistrations} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  id="search"
                  placeholder="Search by name, email or phone..."
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                />
                <Button type="submit">Search</Button>
              </form>
            </div>
            <div className="w-full md:w-48">
              <Label>Status</Label>
              <Select
                value={filters.status || "all"}
                onValueChange={(value) => {
                  setFilters((prev) => ({ ...prev, status: value === "all" ? "" : value }));
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
              >
                <SelectTrigger><SelectValue placeholder="All Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Registrations</CardTitle>
          <CardDescription>
            {loading ? "Loading…" : `Showing ${registrations.length} of ${pagination.total}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No registrations found</div>
          ) : (
            <div className="space-y-4">
              {registrations.map((reg) => (
                <div
                  key={reg.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <p className="font-medium">{reg.fullName}</p>
                      <p className="text-sm text-muted-foreground">{reg.email}</p>
                    </div>
                    {reg.serviceType && <Badge variant="outline">{reg.serviceType}</Badge>}
                    <Badge className={statusColors[reg.status] || "bg-gray-500"}>{reg.status}</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-muted-foreground">
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => openReview(reg)}
                      disabled={reg.status !== "PENDING"}
                    >
                      {reg.status === "PENDING" ? "Review" : "Reviewed"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={pagination.page === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPagination((prev) => ({ ...prev, page }))}
                >
                  {page}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review registration</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ["Name", selected.fullName],
                  ["Email", selected.email],
                  ["Phone", selected.phone],
                  ["Service", selected.serviceType || "—"],
                  ["Plan", selected.planId || "—"],
                  ["Gender", selected.gender || "—"],
                  ["Date of birth", selected.dateOfBirth || "—"],
                  ["Address", selected.address || "—"],
                  ["Emergency contact", selected.emergencyContact || "—"],
                  ["Emergency phone", selected.emergencyPhone || "—"],
                  ["Allergies", selected.allergies || "—"],
                  ["Medical history", selected.medicalHistory || "—"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-muted-foreground">{label}</p>
                    <p className="font-medium break-words">{value}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="space-y-2">
                  <Label>Decision</Label>
                  <Select value={decision} onValueChange={(v) => setDecision(v as "APPROVE" | "REJECT")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APPROVE">Approve — create login account &amp; profile</SelectItem>
                      <SelectItem value="REJECT">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notes (optional)</Label>
                  <Textarea
                    placeholder="Internal notes about this decision…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={submitReview} disabled={submitting}>
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting…</>
              ) : decision === "APPROVE" ? (
                <><CheckCircle2 className="w-4 h-4 mr-2" />Approve</>
              ) : (
                <><XCircle className="w-4 h-4 mr-2" />Reject</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegistrationList;
