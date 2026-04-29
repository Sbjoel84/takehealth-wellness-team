import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ComingSoon } from "@/components/ui/ComingSoon";

interface OnboardingForm {
  id: string;
  assessmentId: string;
  client: { fullName: string; email: string };
  formType: string;
  status: string;
  createdAt: string;
  formData: Record<string, unknown>;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500",
  APPROVED: "bg-green-500",
  CANCELLED: "bg-red-500",
  COMPLETED: "bg-blue-500",
};

const serviceLabels: Record<string, string> = {
  COUNSELLING: "Counselling",
  DENTAL: "Dental Care",
  ELITE_SPORT: "Elite Sport",
  FITNESS: "Fitness & Gym",
  REHAB: "Rehabilitative",
  SPA: "Spa & Massage",
  NUTRITION: "Nutritional",
  GENERAL: "General",
};

const OnboardingList = () => {
  const [onboardingForms, setOnboardingForms] = useState<OnboardingForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<OnboardingForm | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviewStatus, setReviewStatus] = useState("APPROVED");
  const [reviewNotes, setReviewNotes] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    status: "",
    formType: "",
    search: "",
  });

  useEffect(() => {
    setLoading(false);
    setOnboardingForms([]);
  }, [pagination.page, filters]);

  const handleViewForm = (form: OnboardingForm) => {
    setSelectedForm(form);
    setReviewStatus(form.status === "PENDING" ? "APPROVED" : form.status);
    setReviewNotes("");
    setIsDialogOpen(true);
  };

  const handleReviewForm = () => {
    if (selectedForm) {
      setOnboardingForms((prev) =>
        prev.map((f) => (f.id === selectedForm.id ? { ...f, status: reviewStatus } : f))
      );
      setSelectedForm((prev) => (prev ? { ...prev, status: reviewStatus } : null));
    }
    setIsDialogOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="relative space-y-6">
      <ComingSoon title="Onboarding Forms" description="Client onboarding form management is coming soon." />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Onboarding Forms</h1>
          <p className="text-muted-foreground">Review and manage client onboarding forms</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  id="search"
                  placeholder="Search by client name or email..."
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                />
                <Button type="submit">Search</Button>
              </form>
            </div>
            <div className="w-full md:w-48">
              <Label>Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => {
                  setFilters((prev) => ({ ...prev, status: value }));
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Label>Service Type</Label>
              <Select
                value={filters.formType}
                onValueChange={(value) => {
                  setFilters((prev) => ({ ...prev, formType: value }));
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Services</SelectItem>
                  {Object.entries(serviceLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Onboarding Forms</CardTitle>
          <CardDescription>
            Showing {onboardingForms.length} of {pagination.total} forms
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : onboardingForms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No onboarding forms found
            </div>
          ) : (
            <div className="space-y-4">
              {onboardingForms.map((form) => (
                <div
                  key={form.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{form.client.fullName}</p>
                        <p className="text-sm text-muted-foreground">{form.client.email}</p>
                      </div>
                      <Badge variant="outline">{serviceLabels[form.formType] || form.formType}</Badge>
                      <Badge className={statusColors[form.status] || "bg-gray-500"}>
                        {form.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">ID: {form.assessmentId}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(form.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4">
                    <Button variant="outline" onClick={() => handleViewForm(form)}>
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Onboarding Form Details</DialogTitle>
          </DialogHeader>
          {selectedForm && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Assessment ID</Label>
                  <p className="font-medium">{selectedForm.assessmentId}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={statusColors[selectedForm.status] || "bg-gray-500"}>
                    {selectedForm.status}
                  </Badge>
                </div>
                <div>
                  <Label>Client Name</Label>
                  <p className="font-medium">{selectedForm.client.fullName}</p>
                </div>
                <div>
                  <Label>Client Email</Label>
                  <p className="font-medium">{selectedForm.client.email}</p>
                </div>
                <div>
                  <Label>Service Type</Label>
                  <p className="font-medium">{serviceLabels[selectedForm.formType] || selectedForm.formType}</p>
                </div>
                <div>
                  <Label>Submitted At</Label>
                  <p className="font-medium">
                    {selectedForm.createdAt ? new Date(selectedForm.createdAt).toLocaleString() : "N/A"}
                  </p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Form Data</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  {JSON.stringify(selectedForm.formData, null, 2)}
                </pre>
              </div>
              {selectedForm.status === "PENDING" && (
                <div className="border-t pt-4 space-y-4">
                  <h3 className="font-semibold">Review Form</h3>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={reviewStatus} onValueChange={setReviewStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="APPROVED">Approve</SelectItem>
                        <SelectItem value="CANCELLED">Cancel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input
                      placeholder="Add review notes..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            {selectedForm?.status === "PENDING" && (
              <Button onClick={handleReviewForm}>
                Submit Review
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OnboardingList;
