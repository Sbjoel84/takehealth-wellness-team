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
import { apiClient } from "@/lib/api-client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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

const Register = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    nin: "",
    maritalStatus: "",
    occupation: "",
    
    // Emergency Contact
    emergencyContact: "",
    emergencyPhone: "",
    
    // Service Selection
    serviceType: "",
    
    // Medical Information
    currentMedications: "",
    allergies: "",
    medicalHistory: "",
    
    // Consent
    agreeToTerms: false,
    agreeToMedicalConsent: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Register client
      const registerResponse = await apiClient.post("/clients/register", {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        serviceType: formData.serviceType,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        medicalHistory: formData.medicalHistory,
        currentMedications: formData.currentMedications,
        allergies: formData.allergies,
      });

      // Submit intake form
      const intakeResponse = await apiClient.post("/clients/intake/submit", {
        clientId: registerResponse.data.id,
        formType: formData.serviceType,
        formData: {
          personalInfo: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            address: formData.address,
            nin: formData.nin,
            maritalStatus: formData.maritalStatus,
            occupation: formData.occupation,
          },
          emergencyContact: {
            name: formData.emergencyContact,
            phone: formData.emergencyPhone,
          },
          medicalInfo: {
            currentMedications: formData.currentMedications,
            allergies: formData.allergies,
            medicalHistory: formData.medicalHistory,
          },
          submissionDate: new Date().toISOString(),
        },
      });

      toast({
        title: "Registration Successful!",
        description: `Your assessment ID is: ${intakeResponse.data.assessmentId}`,
        variant: "default",
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
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
      setStep(1);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred during registration",
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
          {/* Logo at the very top - centered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Link to="/" className="inline-flex items-center gap-2">
              <img
                src="/logo.svg"
                alt="takehealth Logo"
                className="h-24 md:h-28 object-contain"
              />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Client Registration
            </h1>
            <p className="text-muted-foreground text-lg">
              Complete the form below to register for our services
            </p>
          </motion.div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Step {step} of 3</CardTitle>
              <CardDescription>
                {step === 1 && "Personal Information"}
                {step === 2 && "Service Selection & Medical Information"}
                {step === 3 && "Review & Submit"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {/* Step 1: Personal Information */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <RadioGroup
                          value={formData.gender}
                          onValueChange={(value) => handleInputChange("gender", value)}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female">Female</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other" />
                            <Label htmlFor="other">Other</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maritalStatus">Marital Status</Label>
                        <Select
                          value={formData.maritalStatus}
                          onValueChange={(value) => handleInputChange("maritalStatus", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
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
                        <Textarea
                          id="address"
                          placeholder="Enter your residential address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nin">National ID Number (NIN)</Label>
                        <Input
                          id="nin"
                          placeholder="Enter your NIN"
                          value={formData.nin}
                          onChange={(e) => handleInputChange("nin", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="occupation">Occupation</Label>
                        <Input
                          id="occupation"
                          placeholder="Enter your occupation"
                          value={formData.occupation}
                          onChange={(e) => handleInputChange("occupation", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="button" onClick={() => setStep(2)}>
                        Next Step
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Service Selection & Medical Information */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="serviceType">Select Service *</Label>
                      <Select
                        value={formData.serviceType}
                        onValueChange={(value) => handleInputChange("serviceType", value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map((service) => (
                            <SelectItem key={service.value} value={service.value}>
                              {service.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">Emergency Contact</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContact">Contact Name</Label>
                          <Input
                            id="emergencyContact"
                            placeholder="Enter emergency contact name"
                            value={formData.emergencyContact}
                            onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergencyPhone">Contact Phone</Label>
                          <Input
                            id="emergencyPhone"
                            type="tel"
                            placeholder="Enter emergency contact phone"
                            value={formData.emergencyPhone}
                            onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">Medical Information</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentMedications">Current Medications</Label>
                          <Textarea
                            id="currentMedications"
                            placeholder="List any current medications"
                            value={formData.currentMedications}
                            onChange={(e) => handleInputChange("currentMedications", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="allergies">Allergies</Label>
                          <Textarea
                            id="allergies"
                            placeholder="List any allergies"
                            value={formData.allergies}
                            onChange={(e) => handleInputChange("allergies", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="medicalHistory">Medical History</Label>
                          <Textarea
                            id="medicalHistory"
                            placeholder="Provide relevant medical history"
                            value={formData.medicalHistory}
                            onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>
                        Previous
                      </Button>
                      <Button type="button" onClick={() => setStep(3)}>
                        Next Step
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Review & Submit */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-muted rounded-lg p-6 space-y-4">
                      <h3 className="font-semibold text-lg">Review Your Information</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Full Name:</span>
                          <p className="font-medium">{formData.fullName}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Email:</span>
                          <p className="font-medium">{formData.email}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Phone:</span>
                          <p className="font-medium">{formData.phone}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Service:</span>
                          <p className="font-medium">{serviceTypes.find(s => s.value === formData.serviceType)?.label}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                        />
                        <Label htmlFor="agreeToTerms" className="text-sm">
                          I agree to the Terms and Conditions *
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="agreeToMedicalConsent"
                          checked={formData.agreeToMedicalConsent}
                          onCheckedChange={(checked) => handleInputChange("agreeToMedicalConsent", checked)}
                        />
                        <Label htmlFor="agreeToMedicalConsent" className="text-sm">
                          I consent to the collection and processing of my medical information *
                        </Label>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(2)}>
                        Previous
                      </Button>
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
