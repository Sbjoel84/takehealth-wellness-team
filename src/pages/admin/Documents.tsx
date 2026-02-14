import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, FileImage, File, FileCheck, Eye, Download, Upload, Search } from "lucide-react";

// Mock data for demonstration
const mockDocuments = [
  {
    id: "1",
    original_name: "Blood_Test_Results.pdf",
    client_name: "John Doe",
    client_email: "john@example.com",
    document_type: "LAB_RESULT",
    file_size: 1048576,
    mime_type: "application/pdf",
    is_verified: true,
    created_at: "2024-02-10T10:00:00Z",
  },
  {
    id: "2",
    original_name: "Medical_Certificate.pdf",
    client_name: "Jane Smith",
    client_email: "jane@example.com",
    document_type: "MEDICAL_RECORD",
    file_size: 524288,
    mime_type: "application/pdf",
    is_verified: false,
    created_at: "2024-02-11T09:00:00Z",
  },
  {
    id: "3",
    original_name: "ID_Card.jpg",
    client_name: "Bob Wilson",
    client_email: "bob@example.com",
    document_type: "ID_VERIFICATION",
    file_size: 2097152,
    mime_type: "image/jpeg",
    is_verified: true,
    created_at: "2024-02-09T14:30:00Z",
  },
];

const documentTypeLabels: Record<string, string> = {
  MEDICAL_RECORD: "Medical Record",
  LAB_RESULT: "Lab Result",
  PRESCRIPTION: "Prescription",
  ID_VERIFICATION: "ID Verification",
  INSURANCE_DOC: "Insurance Document",
  CONSENT_FORM: "Consent Form",
  PHOTO: "Photo",
  OTHER: "Other",
};

const DocumentsPage = () => {
  const [documents] = useState(mockDocuments);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = documents.filter((doc) => {
    const matchesType = filterType === "all" || doc.document_type === filterType;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "verified" && doc.is_verified) ||
      (filterStatus === "pending" && !doc.is_verified);
    const matchesSearch =
      doc.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.client_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <FileImage className="h-5 w-5 text-blue-500" />;
    if (mimeType === "application/pdf") return <FileText className="h-5 w-5 text-red-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
              <p className="text-gray-600">Manage and verify client documents</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Documents</p>
                    <p className="text-2xl font-bold">{documents.length}</p>
                  </div>
                  <File className="h-8 w-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Verification</p>
                    <p className="text-2xl font-bold text-yellow-500">
                      {documents.filter((d) => !d.is_verified).length}
                    </p>
                  </div>
                  <FileCheck className="h-8 w-8 text-yellow-500/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Verified</p>
                    <p className="text-2xl font-bold text-green-500">
                      {documents.filter((d) => d.is_verified).length}
                    </p>
                  </div>
                  <FileCheck className="h-8 w-8 text-green-500/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Medical Records</p>
                    <p className="text-2xl font-bold text-blue-500">
                      {documents.filter((d) => d.document_type === "MEDICAL_RECORD").length}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500/20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex gap-4">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    title="Filter by document type"
                  >
                    <option value="all">All Types</option>
                    <option value="MEDICAL_RECORD">Medical Records</option>
                    <option value="LAB_RESULT">Lab Results</option>
                    <option value="ID_VERIFICATION">ID Verification</option>
                    <option value="PRESCRIPTION">Prescriptions</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    title="Filter by status"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Documents</CardTitle>
              <CardDescription>
                Viewing {filteredDocuments.length} of {documents.length} documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No documents found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {getFileIcon(doc.mime_type)}
                            <div>
                              <p className="font-medium truncate max-w-[200px]">
                                {doc.original_name}
                              </p>
                              <p className="text-xs text-gray-500">{doc.mime_type}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{doc.client_name}</p>
                            <p className="text-xs text-gray-500">{doc.client_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {documentTypeLabels[doc.document_type] || doc.document_type}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                        <TableCell>
                          <Badge className={doc.is_verified ? "bg-green-500" : "bg-yellow-500"}>
                            {doc.is_verified ? "Verified" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(doc.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            {!doc.is_verified && (
                              <Button variant="ghost" size="sm">
                                <FileCheck className="h-4 w-4 text-green-500" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DocumentsPage;
