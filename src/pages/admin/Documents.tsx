import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText, FileImage, File, FileCheck, Eye, Download, Upload, Search,
  Trash2, AlertCircle, Loader2, RefreshCw,
} from "lucide-react";
import { documentService } from "@/services/documentService";
import { ApiError } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  original_name: string;
  client_name: string;
  client_email: string;
  document_type: string;
  file_size: number;
  mime_type: string;
  is_verified: boolean;
  created_at: string;
  url?: string;
}

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

function normalizeDoc(raw: Record<string, unknown>): Document {
  return {
    id: String(raw.id || ""),
    original_name: String(raw.original_name || raw.originalName || raw.name || raw.title || "Untitled"),
    client_name: String(
      raw.client_name ||
      raw.clientName ||
      (raw.patient as Record<string, unknown>)?.fullName ||
      (raw.patient as Record<string, unknown>)?.name ||
      ""
    ),
    client_email: String(
      raw.client_email ||
      raw.clientEmail ||
      (raw.patient as Record<string, unknown>)?.email ||
      ""
    ),
    document_type: String(raw.document_type || raw.documentType || raw.type || "OTHER"),
    file_size: Number(raw.file_size || raw.fileSize || raw.size || 0),
    mime_type: String(raw.mime_type || raw.mimeType || raw.contentType || "application/octet-stream"),
    is_verified: Boolean(raw.is_verified ?? raw.isVerified ?? raw.verified ?? false),
    created_at: String(raw.created_at || raw.createdAt || new Date().toISOString()),
    url: (raw.url || raw.fileUrl || raw.downloadUrl) as string | undefined,
  };
}

const EMPTY_UPLOAD = { patientId: "", title: "", type: "OTHER", file: null as File | null };

const DocumentsPage = () => {
  const { toast } = useToast();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState(EMPTY_UPLOAD);
  const [isUploading, setIsUploading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Document | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await documentService.getDocuments({ limit: 100 });
      const list: unknown[] = Array.isArray(res)
        ? res
        : Array.isArray((res as Record<string, unknown>)?.data)
        ? ((res as Record<string, unknown>).data as unknown[])
        : [];
      setDocuments(list.map((d) => normalizeDoc(d as Record<string, unknown>)));
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to load documents";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

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
    if (!bytes) return "—";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <FileImage className="h-5 w-5 text-blue-500" />;
    if (mimeType === "application/pdf") return <FileText className="h-5 w-5 text-red-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const handleUploadSubmit = async () => {
    if (!uploadForm.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    if (!uploadForm.file) {
      toast({ title: "Please select a file", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      await documentService.uploadDocument({
        patientId: uploadForm.patientId,
        title: uploadForm.title,
        type: uploadForm.type,
        file: uploadForm.file,
      });
      toast({ title: "Document uploaded successfully" });
      setUploadOpen(false);
      setUploadForm(EMPTY_UPLOAD);
      fetchDocuments();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Upload failed";
      toast({ title: "Upload failed", description: msg, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await documentService.deleteDocument(deleteTarget.id);
      setDocuments((prev) => prev.filter((d) => d.id !== deleteTarget.id));
      toast({ title: "Document deleted" });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Delete failed";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
            <p className="text-gray-600">Manage and verify client documents</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={fetchDocuments} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button onClick={() => setUploadOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents or clients..."
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
                  <option value="CONSENT_FORM">Consent Forms</option>
                  <option value="OTHER">Other</option>
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
              {loading ? "Loading…" : `Viewing ${filteredDocuments.length} of ${documents.length} documents`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {documents.length === 0 ? "No documents uploaded yet" : "No documents match your filters"}
                </p>
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
                            <p className="font-medium truncate max-w-[200px]">{doc.original_name}</p>
                            <p className="text-xs text-gray-500">{doc.mime_type}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{doc.client_name || "—"}</p>
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
                        <div className="flex justify-end gap-1">
                          {doc.url && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={doc.url} target="_blank" rel="noreferrer">
                                <Eye className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {doc.url && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={doc.url} download>
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(doc)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={(o) => { if (!isUploading) setUploadOpen(o); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Title <span className="text-destructive">*</span></Label>
              <Input
                placeholder="e.g. Blood Test Results"
                value={uploadForm.title}
                onChange={(e) => setUploadForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Patient ID</Label>
              <Input
                placeholder="Patient ID (optional)"
                value={uploadForm.patientId}
                onChange={(e) => setUploadForm((f) => ({ ...f, patientId: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select
                value={uploadForm.type}
                onValueChange={(v) => setUploadForm((f) => ({ ...f, type: v }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(documentTypeLabels).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>File <span className="text-destructive">*</span></Label>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => setUploadForm((f) => ({ ...f, file: e.target.files?.[0] ?? null }))}
              />
              <div className="flex gap-2 items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </Button>
                <span className="text-sm text-muted-foreground truncate">
                  {uploadForm.file ? uploadForm.file.name : "No file selected"}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={handleUploadSubmit} disabled={isUploading}>
              {isUploading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading…</>
              ) : (
                <><Upload className="w-4 h-4 mr-2" />Upload</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.original_name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DocumentsPage;
