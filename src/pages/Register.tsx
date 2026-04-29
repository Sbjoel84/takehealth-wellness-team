import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { authApi, patientsApi } from "@/lib/api-client";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const serviceTypes = [
  { value: "COUNSELLING", label: "Counselling" },
  { value: "DENTAL", label: "Dental Care" },
  { value: "ELITE_SPORT", label: "Elite Sport Care" },
  { value: "FITNESS", label: "Fitness & Gym" },
  { value: "REHAB", label: "Rehabilitative Care" },
  { value: "SPA", label: "Spa & Massage Therapy" },
  { value: "NUTRITION", label: "Nutritional Care" },
  { value: "GENERAL", label: "General Health" },
];

const genderMap: Record<string, string> = {
  male: "MALE",
  female: "FEMALE",
  other: "OTHER",
};

const maritalMap: Record<string, string> = {
  single: "SINGLE",
  married: "MARRIED",
  divorced: "DIVORCED",
  widowed: "WIDOWED",
};

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    nin: "",
    maritalStatus: "",
    occupation: "",
    emergencyContact: "",
    emergencyPhone: "",
    serviceType: "",
    currentMedications: "",
    allergies: "",
    medicalHistory: "",
    agreeToTerms: false,
    agreeToMedicalConsent: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.password || !formData.phone) {
        toast({ title: "Please fill in all required fields", variant: "destructive" });
        return;
      }
      if (formData.password.length < 8) {
        toast({ title: "Password must be at least 8 characters", variant: "destructive" });
        return;
      }
    }
    if (step === 2 && !formData.serviceType) {
      toast({ title: "Please select a service", variant: "destructive" });
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms || !formData.agreeToMedicalConsent) {
      toast({ title: "Please accept both consents to continue", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    try {
      // Step 1: create account
      const authResponse = await authApi.signUp({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      // Store token if returned
      if (authResponse.token) {
        localStorage.setItem("token", authResponse.token);
      }
      if (authResponse.user) {
        localStorage.setItem("user", JSON.stringify(authResponse.user));
      }

      // Step 2: create patient profile
      await patientsApi.create({
        firstName: formData.fullName.split(" ")[0],
        lastName: formData.fullName.split(" ").slice(1).join(" ") || formData.fullName.split(" ")[0],
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: genderMap[formData.gender] || "NOT_SPECIFIED",
        maritalStatus: maritalMap[formData.maritalStatus] || "NOT_SPECIFIED",
        phone: formData.phone || undefined,
        allergies: formData.allergies ? formData.allergies.split(",").map((a) => a.trim()) : [],
        medicalHistory: formData.medicalHistory || undefined,
        emergencyContactName: formData.emergencyContact || undefined,
        emergencyContactPhone: formData.emergencyPhone || undefined,
      });

      toast({
        title: "Registration Successful!",
        description: "Your account has been created. You can now log in.",
      });

      navigate("/login");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Registration Failed",
        description: err.response?.data?.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src="/logo.svg" alt="takehealth Logo" className="h-24 md:h-28 object-contain" />
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">Client Registration</h1>
            <p className="text-muted-foreground text-lg">Complete the form below to register for our services</p>
          </motion.div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Step {step} of 3</CardTitle>
              <CardDescription>
                {step === 1 && "Personal Information & Account Setup"}
                {step === 2 && "Service Selection & Medical Information"}
                {step === 3 && "Review & Submit"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {/* Step 1: Personal Info */}
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input id="fullName" placeholder="Enter your full name" value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" placeholder="Enter your email" value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <div className="relative">
                          <Input id="password" type={showPassword ? "text" : "password"}
                            placeholder="Min. 8 characters" value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)} required />
                          <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" type="tel" placeholder="Enter your phone number" value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input id="dateOfBirth" type="date" value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <RadioGroup value={formData.gender} onValueChange={(v) => handleInputChange("gender", v)} className="flex gap-4">
                          {["male", "female", "other"].map((g) => (
                            <div key={g} className="flex items-center space-x-2">
                              <RadioGroupItem value={g} id={g} />
                              <Label htmlFor={g} className="capitalize">{g}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maritalStatus">Marital Status</Label>
                        <Select value={formData.maritalStatus} onValueChange={(v) => handleInputChange("maritalStatus", v)}>
                          <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married">Married</SelectItem>
                            <SelectItem value="divorced">Divorced</SelectItem>
                            <SelectItem value="widowed">Widowed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea id="address" placeholder="Enter your residential address" value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)} />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="button" onClick={handleNextStep}>Next Step</Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Service & Medical */}
                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="space-y-2">
                      <Label>Select Service *</Label>
                      <Select value={formData.serviceType} onValueChange={(v) => handleInputChange("serviceType", v)}>
                        <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">Emergency Contact</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContact">Contact Name</Label>
                          <Input id="emergencyContact" placeholder="Emergency contact name" value={formData.emergencyContact}
                            onChange={(e) => handleInputChange("emergencyContact", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergencyPhone">Contact Phone</Label>
                          <Input id="emergencyPhone" type="tel" placeholder="Emergency contact phone" value={formData.emergencyPhone}
                            onChange={(e) => handleInputChange("emergencyPhone", e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">Medical Information</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentMedications">Current Medications</Label>
                          <Textarea id="currentMedications" placeholder="List any current medications" value={formData.currentMedications}
                            onChange={(e) => handleInputChange("currentMedications", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="allergies">Allergies (comma-separated)</Label>
                          <Textarea id="allergies" placeholder="e.g. Penicillin, Peanuts" value={formData.allergies}
                            onChange={(e) => handleInputChange("allergies", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="medicalHistory">Medical History</Label>
                          <Textarea id="medicalHistory" placeholder="Relevant medical history" value={formData.medicalHistory}
                            onChange={(e) => handleInputChange("medicalHistory", e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>Previous</Button>
                      <Button type="button" onClick={handleNextStep}>Next Step</Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Review & Submit */}
                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="bg-muted rounded-lg p-6 space-y-4">
                      <h3 className="font-semibold text-lg">Review Your Information</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        {[
                          ["Full Name", formData.fullName],
                          ["Email", formData.email],
                          ["Phone", formData.phone],
                          ["Service", serviceTypes.find((s) => s.value === formData.serviceType)?.label || "—"],
                          ["Date of Birth", formData.dateOfBirth || "—"],
                          ["Gender", formData.gender || "—"],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <span className="text-muted-foreground">{label}:</span>
                            <p className="font-medium">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="agreeToTerms" checked={formData.agreeToTerms}
                          onCheckedChange={(c) => handleInputChange("agreeToTerms", !!c)} />
                        <Label htmlFor="agreeToTerms" className="text-sm">I agree to the Terms and Conditions *</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="agreeToMedicalConsent" checked={formData.agreeToMedicalConsent}
                          onCheckedChange={(c) => handleInputChange("agreeToMedicalConsent", !!c)} />
                        <Label htmlFor="agreeToMedicalConsent" className="text-sm">
                          I consent to the collection and processing of my medical information *
                        </Label>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(2)}>Previous</Button>
                      <Button type="submit" disabled={isLoading || !formData.agreeToTerms || !formData.agreeToMedicalConsent}>
                        {isLoading ? "Submitting..." : "Submit Registration"}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
