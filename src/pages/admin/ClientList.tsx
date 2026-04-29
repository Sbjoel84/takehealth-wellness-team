import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  FileText,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { patientsApi } from "@/lib/api-client";

interface Client {
  id: string;
  fullName: string;
  phone: string;
  gender: string;
  maritalStatus: string;
  createdAt: string;
}

const genderLabels: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
  NOT_SPECIFIED: "—",
};

const ClientList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await patientsApi.getAll({
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery || undefined,
        });

        const transformed: Client[] = (response.data || []).map((p) => ({
          id: p.id,
          fullName: `${p.firstName} ${p.lastName}`.trim(),
          phone: p.phone || "—",
          gender: p.gender || "NOT_SPECIFIED",
          maritalStatus: p.maritalStatus || "NOT_SPECIFIED",
          createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—",
        }));

        setClients(transformed);
        setTotal(response.meta?.total || transformed.length);
        setTotalPages(response.meta?.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [currentPage, searchQuery]);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all registered clients
          </p>
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
                placeholder="Search clients by name, email, or phone..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
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
          <CardTitle className="text-lg">
            Client List ({total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No clients found
            </div>
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
                              {client.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
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
                      <TableCell className="capitalize">{client.maritalStatus.toLowerCase().replace("_", " ")}</TableCell>
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
                            <DropdownMenuItem>
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
                            <DropdownMenuItem className="text-destructive">
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, total)} of {total} clients
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8"
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientList;
