import { useState, useEffect, useCallback } from "react";
import {
  Plus, Search, MoreVertical, Eye, Edit, Trash2, User,
  Mail, Phone, MapPin, RefreshCw, ChevronLeft, ChevronRight, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { providerService, ProviderPayload } from "@/services/providerService";
import { ApiError } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface ApiProvider {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  type: string;
  specialty?: string;
  location?: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  createdAt: string;
}

const typeLabels: Record<string, string> = {
  COUNSELLING: "Counselling",
  DENTAL: "Dental Care",
  GYM: "Fitness & Gym",
  FITNESS: "Fitness & Gym",
  SKINCARE: "Skin Care",
  REHAB: "Rehabilitation",
  NUTRITION: "Nutrition",
  ELITE_SPORT: "Elite Sports",
  ELITE: "Elite Sports",
  SPA: "Spa & Massage",
  GENERAL: "General",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-gray-100 text-gray-800",
  PENDING: "bg-yellow-100 text-yellow-800",
};

const EMPTY_FORM: ProviderPayload = {
  name: "", email: "", phone: "", type: "", specialty: "", location: "",
};

const ServiceProviderManagement = () => {
  const { toast } = useToast();
  const [providers, setProviders] = useState<ApiProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // View dialog
  const [viewProvider, setViewProvider] = useState<ApiProvider | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Create / Edit dialog
  const [editProvider, setEditProvider] = useState<ApiProvider | null>(null);
  const [form, setForm] = useState<ProviderPayload>(EMPTY_FORM);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState<ApiProvider | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const itemsPerPage = 10;

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await providerService.getProviders({
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      const list: ApiProvider[] = response.data || response || [];
      const filtered = searchQuery
        ? list.filter(
            (p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.type?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : list;
      setProviders(filtered);
      setTotal(response.meta?.total ?? filtered.length);
      setTotalPages(response.meta?.totalPages ?? 1);
    } catch {
      setProviders([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchQuery]);

  useEffect(() => { fetchProviders(); }, [fetchProviders]);

  const openCreate = () => {
    setEditProvider(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openEdit = (p: ApiProvider) => {
    setEditProvider(p);
    setForm({
      name: p.name,
      email: p.email || "",
      phone: p.phone || "",
      type: p.type || "",
      specialty: p.specialty || "",
      location: p.location || "",
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Name is required.";
    if (!form.type)        errors.type = "Type is required.";
    return errors;
  };

  const submitForm = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    const id = editProvider?.id;
    setActionLoading(id ?? "new");
    try {
      if (id) {
        await providerService.updateProvider(id, form);
        setProviders((prev) =>
          prev.map((p) => p.id === id ? { ...p, ...form } : p)
        );
        toast({ title: "Provider updated" });
      } else {
        const created = await providerService.createProvider(form);
        setProviders((prev) => [created as ApiProvider, ...prev]);
        setTotal((t) => t + 1);
        toast({ title: "Provider added" });
      }
      setIsFormOpen(false);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Failed to save provider";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const submitDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget.id);
    try {
      await providerService.deleteProvider(deleteTarget.id);
      setProviders((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setTotal((t) => t - 1);
      toast({ title: "Provider removed" });
      setIsDeleteOpen(false);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Failed to remove provider";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const toggleStatus = async (p: ApiProvider) => {
    setActionLoading(p.id);
    try {
      if (p.status === "ACTIVE") {
        await providerService.deactivateProvider(p.id);
        setProviders((prev) => prev.map((pr) => pr.id === p.id ? { ...pr, status: "INACTIVE" } : pr));
        toast({ title: "Provider deactivated" });
      } else {
        await providerService.activateProvider(p.id);
        setProviders((prev) => prev.map((pr) => pr.id === p.id ? { ...pr, status: "ACTIVE" } : pr));
        toast({ title: "Provider activated" });
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Failed to update status";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const activeCount  = providers.filter((p) => p.status === "ACTIVE").length;
  const pendingCount = providers.filter((p) => p.status === "PENDING").length;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold">Service Providers</h1>
          <p className="text-muted-foreground mt-1">Manage doctors, therapists, and specialists</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchProviders} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Provider
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total Providers", value: total, icon: User },
          { label: "Active", value: activeCount, icon: User },
          { label: "Pending Approval", value: pendingCount, icon: User },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold">{loading ? "—" : value}</p>
                </div>
                <Icon className="w-8 h-8 text-muted-foreground/20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or specialty..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Provider List ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : providers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No providers found</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Type / Specialty</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providers.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {p.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(p.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{typeLabels[p.type] || p.type || "—"}</Badge>
                        {p.specialty && (
                          <p className="text-xs text-muted-foreground mt-1">{p.specialty}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {p.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-muted-foreground" />
                              <span className="truncate max-w-[140px]">{p.email}</span>
                            </div>
                          )}
                          {p.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-muted-foreground" />
                              <span>{p.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {p.location ? (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span>{p.location}</span>
                          </div>
                        ) : "—"}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status] || "bg-gray-100 text-gray-800"}`}>
                          {p.status.charAt(0) + p.status.slice(1).toLowerCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={actionLoading === p.id}>
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { setViewProvider(p); setIsViewOpen(true); }}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(p)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Provider
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleStatus(p)}>
                              {p.status === "ACTIVE" ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => { setDeleteTarget(p); setIsDeleteOpen(true); }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, total)} of {total} providers
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button key={page} variant={currentPage === page ? "default" : "outline"} size="icon"
                    onClick={() => setCurrentPage(page)} className="w-8 h-8">{page}</Button>
                ))}
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Provider Details</DialogTitle>
          </DialogHeader>
          {viewProvider && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {viewProvider.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold">{viewProvider.name}</p>
                  <Badge variant="outline">{typeLabels[viewProvider.type] || viewProvider.type}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {viewProvider.email && <div><p className="text-muted-foreground">Email</p><p className="font-medium">{viewProvider.email}</p></div>}
                {viewProvider.phone && <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{viewProvider.phone}</p></div>}
                {viewProvider.specialty && <div><p className="text-muted-foreground">Specialty</p><p className="font-medium">{viewProvider.specialty}</p></div>}
                {viewProvider.location && <div><p className="text-muted-foreground">Location</p><p className="font-medium">{viewProvider.location}</p></div>}
                <div><p className="text-muted-foreground">Status</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[viewProvider.status]}`}>
                    {viewProvider.status}
                  </span>
                </div>
                <div><p className="text-muted-foreground">Joined</p><p className="font-medium">{new Date(viewProvider.createdAt).toLocaleDateString()}</p></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
            <Button onClick={() => { setIsViewOpen(false); if (viewProvider) openEdit(viewProvider); }}>
              <Edit className="w-4 h-4 mr-2" />Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create / Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editProvider ? "Edit Provider" : "Add New Provider"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="p-name">Full Name *</Label>
              <Input id="p-name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={formErrors.name ? "border-destructive" : ""} />
              {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
            </div>
            <div className="space-y-1">
              <Label>Type *</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger className={formErrors.type ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(typeLabels).filter(([k]) => !["GYM","ELITE"].includes(k)).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.type && <p className="text-xs text-destructive">{formErrors.type}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="p-specialty">Specialty</Label>
              <Input id="p-specialty" value={form.specialty || ""}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="p-email">Email</Label>
              <Input id="p-email" type="email" value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="p-phone">Phone</Label>
              <Input id="p-phone" type="tel" value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="p-location">Location</Label>
              <Input id="p-location" value={form.location || ""}
                onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={submitForm} disabled={actionLoading !== null}>
              {actionLoading ? "Saving..." : editProvider ? "Save Changes" : "Add Provider"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Provider</DialogTitle>
            <DialogDescription>
              This will permanently remove {deleteTarget?.name} from the system.
            </DialogDescription>
          </DialogHeader>
          {deleteTarget && (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <div>
                <p className="font-medium">{deleteTarget.name}</p>
                <p className="text-sm text-muted-foreground">{typeLabels[deleteTarget.type] || deleteTarget.type}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={submitDelete} disabled={actionLoading !== null}>
              {actionLoading ? "Removing..." : "Remove Provider"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceProviderManagement;
