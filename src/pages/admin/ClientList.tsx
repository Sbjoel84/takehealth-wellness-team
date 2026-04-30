import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus, Search, Filter, MoreVertical, Eye, Edit, Trash2,
  FileText, Phone, Calendar, ChevronLeft, ChevronRight, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { clientService, PatientPayload } from "../../services/clientService";
import { ApiError } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  maritalStatus: string;
  dateOfBirth: string;
  allergies: string;
  medicalHistory: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  createdAt: string;
}

const genderLabels: Record<string, string> = {
  MALE: "Male", FEMALE: "Female", OTHER: "Other", NOT_SPECIFIED: "—",
};

const EMPTY_EDIT = {
  firstName: "", lastName: "", phone: "", dateOfBirth: "",
  gender: "", maritalStatus: "", allergies: "", medicalHistory: "",
  emergencyContactName: "", emergencyContactPhone: "",
};

const ClientList = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Edit state
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_EDIT);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Delete state
  const [deleteClient, setDeleteClient] = useState<Client | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await clientService.getClients({
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery || undefined,
        });

        const transformed: Client[] = (response.data || []).map((p: Record<string, string>) => ({
          id: p.id,
          fullName: `${p.firstName} ${p.lastName}`.trim(),
          firstName: p.firstName || "",
          lastName: p.lastName || "",
          phone: p.phone || "—",
          gender: p.gender || "NOT_SPECIFIED",
          maritalStatus: p.maritalStatus || "NOT_SPECIFIED",
          dateOfBirth: p.dateOfBirth || "",
          allergies: Array.isArray(p.allergies) ? (p.allergies as unknown as string[]).join(", ") : "",
          medicalHistory: p.medicalHistory || "",
          emergencyContactName: p.emergencyContactName || "",
          emergencyContactPhone: p.emergencyContactPhone || "",
          createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—",
        }));

        setClients(transformed);
        setTotal(response.meta?.total || transformed.length);
        setTotalPages(response.meta?.totalPages || 1);
      } catch {
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [currentPage, searchQuery]);

  const openEdit = (client: Client) => {
    setEditClient(client);
    setEditForm({
      firstName: client.firstName,
      lastName: client.lastName,
      phone: client.phone === "—" ? "" : client.phone,
      dateOfBirth: client.dateOfBirth,
      gender: client.gender === "NOT_SPECIFIED" ? "" : client.gender,
      maritalStatus: client.maritalStatus === "NOT_SPECIFIED" ? "" : client.maritalStatus,
      allergies: client.allergies,
      medicalHistory: client.medicalHistory,
      emergencyContactName: client.emergencyContactName,
      emergencyContactPhone: client.emergencyContactPhone,
    });
    setIsEditOpen(true);
  };

  const submitEdit = async () => {
    if (!editClient) return;
    if (!editForm.firstName.trim() || !editForm.lastName.trim()) {
      toast({ title: "First and last name are required", variant: "destructive" });
      return;
    }
    setActionLoading(editClient.id);
    try {
      const payload: Partial<PatientPayload> = {
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        phone: editForm.phone.trim() || undefined,
        dateOfBirth: editForm.dateOfBirth || undefined,
        gender: (editForm.gender as PatientPayload["gender"]) || undefined,
        maritalStatus: editForm.maritalStatus || undefined,
        allergies: editForm.allergies ? editForm.allergies.split(",").map((a) => a.trim()).filter(Boolean) : [],
        medicalHistory: editForm.medicalHistory || undefined,
        emergencyContactName: editForm.emergencyContactName || undefined,
        emergencyContactPhone: editForm.emergencyContactPhone || undefined,
      };
      await clientService.updateClient(editClient.id, payload);
      setClients((prev) =>
        prev.map((c) =>
          c.id === editClient.id
            ? {
                ...c,
                fullName: `${editForm.firstName} ${editForm.lastName}`.trim(),
                firstName: editForm.firstName,
                lastName: editForm.lastName,
                phone: editForm.phone || "—",
                gender: editForm.gender || "NOT_SPECIFIED",
                maritalStatus: editForm.maritalStatus || "NOT_SPECIFIED",
                dateOfBirth: editForm.dateOfBirth,
                allergies: editForm.allergies,
                medicalHistory: editForm.medicalHistory,
                emergencyContactName: editForm.emergencyContactName,
                emergencyContactPhone: editForm.emergencyContactPhone,
              }
            : c
        )
      );
      toast({ title: "Client updated successfully" });
      setIsEditOpen(false);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Failed to update client";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const submitDelete = async () => {
    if (!deleteClient) return;
    setActionLoading(deleteClient.id);
    try {
      await clientService.deleteClient(deleteClient.id);
      setClients((prev) => prev.filter((c) => c.id !== deleteClient.id));
      setTotal((t) => t - 1);
      toast({ title: "Client deactivated" });
      setIsDeleteOpen(false);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Failed to deactivate client";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground mt-1">Manage and view all registered clients</p>
        </div>
        <Button asChild>
          <Link to="/admin/clients/add">
            <Plus className="w-4 h-4 mr-2" />
            Add New Client
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search clients by name or phone..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <Button variant="outline" size="icon" title="Filter">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Client Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Client List ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No clients found</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Marital Status</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {client.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{client.fullName}</p>
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {client.phone}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{genderLabels[client.gender] || client.gender}</TableCell>
                      <TableCell className="capitalize">
                        {client.maritalStatus.toLowerCase().replace("_", " ")}
                      </TableCell>
                      <TableCell>{client.createdAt}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(client)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Client
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="w-4 h-4 mr-2" />
                              View Documents
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="w-4 h-4 mr-2" />
                              Schedule Appointment
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => { setDeleteClient(client); setIsDeleteOpen(true); }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Deactivate
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
                {Math.min(currentPage * itemsPerPage, total)} of {total} clients
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button key={page} variant={currentPage === page ? "default" : "outline"} size="icon"
                    onClick={() => setCurrentPage(page)} className="w-8 h-8">
                    {page}
                  </Button>
                ))}
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Client — {editClient?.fullName}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="edit-first">First Name *</Label>
              <Input id="edit-first" value={editForm.firstName}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-last">Last Name *</Label>
              <Input id="edit-last" value={editForm.lastName}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input id="edit-phone" type="tel" value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-dob">Date of Birth</Label>
              <Input id="edit-dob" type="date" value={editForm.dateOfBirth}
                onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Gender</Label>
              <Select value={editForm.gender} onValueChange={(v) => setEditForm({ ...editForm, gender: v })}>
                <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Marital Status</Label>
              <Select value={editForm.maritalStatus} onValueChange={(v) => setEditForm({ ...editForm, maritalStatus: v })}>
                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE">Single</SelectItem>
                  <SelectItem value="MARRIED">Married</SelectItem>
                  <SelectItem value="DIVORCED">Divorced</SelectItem>
                  <SelectItem value="WIDOWED">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="edit-allergies">Allergies (comma-separated)</Label>
              <Input id="edit-allergies" value={editForm.allergies}
                onChange={(e) => setEditForm({ ...editForm, allergies: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-ec-name">Emergency Contact Name</Label>
              <Input id="edit-ec-name" value={editForm.emergencyContactName}
                onChange={(e) => setEditForm({ ...editForm, emergencyContactName: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-ec-phone">Emergency Contact Phone</Label>
              <Input id="edit-ec-phone" type="tel" value={editForm.emergencyContactPhone}
                onChange={(e) => setEditForm({ ...editForm, emergencyContactPhone: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={submitEdit} disabled={actionLoading !== null}>
              {actionLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Client</DialogTitle>
            <DialogDescription>
              This will remove {deleteClient?.fullName} from the system. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteClient && (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <div>
                <p className="font-medium">{deleteClient.fullName}</p>
                <p className="text-sm text-muted-foreground">{deleteClient.phone}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={submitDelete} disabled={actionLoading !== null}>
              {actionLoading ? "Deactivating..." : "Deactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientList;
