import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, User, Phone, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { clientService } from "@/services/clientService";
import { ApiError } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const serviceTypes = [
  { value: "COUNSELLING",  label: "Counselling" },
  { value: "DENTAL",       label: "Dental Care" },
  { value: "ELITE_SPORT",  label: "Elite Sport" },
  { value: "FITNESS",      label: "Fitness & Gym" },
  { value: "REHAB",        label: "Rehabilitative Care" },
  { value: "SPA",          label: "Spa & Massage" },
  { value: "NUTRITION",    label: "Nutritional Care" },
  { value: "GENERAL",      label: "General Health" },
];

interface FormState {
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  emergencyContact: string;
  emergencyPhone: string;
  allergies: string;
  medicalHistory: string;
  notes: string;
}

const EMPTY_FORM: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  maritalStatus: "",
  emergencyContact: "",
  emergencyPhone: "",
  allergies: "",
  medicalHistory: "",
  notes: "",
};

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(form: FormState): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!form.firstName.trim())  errors.firstName = "First name is required.";
  if (!form.lastName.trim())   errors.lastName  = "Last name is required.";
  if (!form.phone.trim())      errors.phone     = "Phone number is required.";
  else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone.trim()))
    errors.phone = "Enter a valid phone number.";
  return errors;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AddClient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelect = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const errors = validate(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast({ title: "Please fix the errors below", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await clientService.addClient({
        firstName: formData.firstName.trim(),
        lastName:  formData.lastName.trim(),
        phone:     formData.phone.trim() || undefined,
        dateOfBirth:            formData.dateOfBirth || undefined,
        gender:                 (formData.gender as "MALE" | "FEMALE" | "OTHER") || undefined,
        maritalStatus:          formData.maritalStatus || undefined,
        allergies:              formData.allergies
                                  ? formData.allergies.split(",").map((a) => a.trim()).filter(Boolean)
                                  : [],
        medicalHistory:         formData.medicalHistory || undefined,
        emergencyContactName:   formData.emergencyContact || undefined,
        emergencyContactPhone:  formData.emergencyPhone   || undefined,
      });

      toast({
        title: "Client added",
        description: `${formData.firstName} ${formData.lastName} has been registered successfully.`,
      });

      setFormData(EMPTY_FORM);   // reset form
      navigate("/admin/clients");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to add client. Please try again.";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const FieldError = ({ name }: { name: string }) =>
    fieldErrors[name] ? (
      <p className="text-xs text-destructive flex items-center gap-1 mt-1">
        <AlertCircle className="w-3 h-3" />
        {fieldErrors[name]}
      </p>
    ) : null;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/clients">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold">Add New Client</h1>
          <p className="text-muted-foreground mt-1">Register a new patient in the system</p>
        </div>
      </div>

      {Object.keys(fieldErrors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please correct the highlighted fields before submitting.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                <Input
                  id="firstName" name="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={fieldErrors.firstName ? "border-destructive" : ""}
                />
                <FieldError name="firstName" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
                <Input
                  id="lastName" name="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={fieldErrors.lastName ? "border-destructive" : ""}
                />
                <FieldError name="lastName" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                <Input
                  id="phone" name="phone" type="tel"
                  placeholder="+234..."
                  value={formData.phone}
                  onChange={handleChange}
                  className={fieldErrors.phone ? "border-destructive" : ""}
                />
                <FieldError name="phone" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth" name="dateOfBirth" type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={formData.gender} onValueChange={(v) => handleSelect("gender", v)}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Marital Status</Label>
                <Select value={formData.maritalStatus} onValueChange={(v) => handleSelect("maritalStatus", v)}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SINGLE">Single</SelectItem>
                    <SelectItem value="MARRIED">Married</SelectItem>
                    <SelectItem value="DIVORCED">Divorced</SelectItem>
                    <SelectItem value="WIDOWED">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Medical Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies (comma-separated)</Label>
              <Input
                id="allergies" name="allergies"
                placeholder="e.g. Penicillin, Peanuts"
                value={formData.allergies}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory" name="medicalHistory"
                placeholder="Relevant medical history..."
                value={formData.medicalHistory}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Contact Name</Label>
                <Input
                  id="emergencyContact" name="emergencyContact"
                  placeholder="Emergency contact name"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Contact Phone</Label>
                <Input
                  id="emergencyPhone" name="emergencyPhone" type="tel"
                  placeholder="Emergency contact number"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Additional Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="notes" name="notes"
              placeholder="Any additional notes about the client..."
              value={formData.notes}
              onChange={handleChange}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" type="button" asChild>
            <Link to="/admin/clients">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                Saving...
              </span>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Client
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddClient;
