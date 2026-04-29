import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { FileText, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import heroImage from "@/assets/takehealth homepage.png";

// Service data with plans
const servicesData: Record<string, { title: string; plans: Array<{ id: string; name: string; price: string; period: string; description: string }> }> = {
  gym: {
    title: "Gym Services",
    plans: [
      { id: "gym-basic", name: "BASIC PACKAGE", price: "₦20,000", period: "/ Month", description: "Full gym access with standard equipment" },
      { id: "gym-premium", name: "PREMIUM PACKAGE", price: "₦30,000", period: "/ Month", description: "Full gym access + personal coaching" },
      { id: "gym-elite", name: "ELITE PACKAGE", price: "₦40,000", period: "/ Month", description: "Comprehensive gym + tracking + priority support" },
    ],
  },
  spa: {
    title: "Spa & Massage Therapy",
    plans: [
      { id: "spa-basic", name: "BASIC MEMBERSHIP", price: "₦80,000", period: "/ Month", description: "2 massages per month + 10% discount" },
      { id: "spa-premium", name: "PREMIUM MEMBERSHIP", price: "₦150,000", period: "/ Month", description: "4 massages + body treatments + priority booking" },
      { id: "spa-elite", name: "ELITE MEMBERSHIP", price: "₦250,000", period: "/ Month", description: "Weekly massages + VIP treatment + advisor" },
    ],
  },
  skincare: {
    title: "Skin Care",
    plans: [
      { id: "skin-basic", name: "BASIC GLOW MEMBERSHIP", price: "₦30,000", period: "/ Month", description: "1 facial per month + quarterly assessment" },
      { id: "skin-premium", name: "PREMIUM RADIANCE MEMBERSHIP", price: "₦75,000", period: "/ Month", description: "2 treatments per month + dermatology consultation" },
      { id: "skin-elite", name: "ELITE LUMINANCE MEMBERSHIP", price: "₦150,000", period: "/ Month", description: "Unlimited treatments + monthly consultations" },
    ],
  },
  dental: {
    title: "Dental Care",
    plans: [
      { id: "dental-basic", name: "BASIC DENTAL CARE", price: "₦50,000", period: "/ Month", description: "Check-ups + basic cleaning" },
      { id: "dental-premium", name: "PREMIUM DENTAL CARE", price: "₦100,000", period: "/ Month", description: "Comprehensive care + cosmetic treatments" },
      { id: "dental-elite", name: "ELITE DENTAL CARE", price: "₦200,000", period: "/ Month", description: "Full service + priority appointments" },
    ],
  },
  elite: {
    title: "Elite Sport Care",
    plans: [
      { id: "elite-basic", name: "BASIC ELITE", price: "₦75,000", period: "/ Month", description: "Basic athletic training + support" },
      { id: "elite-premium", name: "PREMIUM ELITE", price: "₦150,000", period: "/ Month", description: "Advanced training + nutrition + recovery" },
      { id: "elite-elite", name: "ELITE PERFORMANCE", price: "₦300,000", period: "/ Month", description: "Full athlete program + physiotherapy" },
    ],
  },
  rehab: {
    title: "Rehabilitative Care",
    plans: [
      { id: "rehab-basic", name: "BASIC REHAB", price: "₦60,000", period: "/ Month", description: "2 sessions per month" },
      { id: "rehab-premium", name: "PREMIUM REHAB", price: "₦120,000", period: "/ Month", description: "4 sessions + progress tracking" },
      { id: "rehab-elite", name: "ELITE REHAB", price: "₦200,000", period: "/ Month", description: "Unlimited sessions + comprehensive therapy" },
    ],
  },
  nutrition: {
    title: "Nutritional Care",
    plans: [
      { id: "nutr-basic", name: "BASIC NUTRITION", price: "₦40,000", period: "/ Month", description: "Monthly consultation + meal plan" },
      { id: "nutr-premium", name: "PREMIUM NUTRITION", price: "₦80,000", period: "/ Month", description: "Bi-weekly consultations + custom plans" },
      { id: "nutr-elite", name: "ELITE NUTRITION", price: "₦150,000", period: "/ Month", description: "Weekly consultations + full support" },
    ],
  },
  counselling: {
    title: "Counselling",
    plans: [
      { id: "counsel-basic", name: "BASIC COUNSELLING", price: "₦75,000", period: "/ Month", description: "2 sessions per month" },
      { id: "counsel-premium", name: "PREMIUM COUNSELLING", price: "₦150,000", period: "/ Month", description: "4 sessions + crisis support" },
      { id: "counsel-elite", name: "ELITE COUNSELLING", price: "₦295,000", period: "/ Month", description: "Unlimited sessions + family therapy" },
    ],
  },
  health360: {
    title: "Health360+ Integrated Programme",
    plans: [
      { id: "h360-basic", name: "HEALTH360+ BASIC", price: "₦260,000", period: "/ Month", description: "Integrated fitness + nutrition + mental wellness" },
      { id: "h360-premium", name: "HEALTH360+ PREMIUM", price: "₦470,000", period: "/ Month", description: "Full integration + spa + premium support" },
      { id: "h360-elite", name: "HEALTH360+ ELITE", price: "₦795,000", period: "/ Month", description: "Complete wellness + VIP access + concierge" },
    ],
  },
  corporate: {
    title: "Corporate / Enterprise Plan",
    plans: [
      { id: "corp-starter", name: "CORPORATE STARTER (20 STAFF)", price: "₦500,000", period: "/ Month", description: "Wellness program for 20 staff members - fitness sessions, health screenings, nutrition workshops" },
      { id: "corp-growth", name: "CORPORATE GROWTH (50 STAFF)", price: "₦1,200,000", period: "/ Month", description: "Expanded wellness for 50 staff - on-site gym, monthly health assessments, mental wellness" },
      { id: "corp-enterprise", name: "ENTERPRISE (100+ STAFF)", price: "₦2,000,000", period: "/ Month", description: "Full enterprise wellness - dedicated facilities, 24/7 support, customized programs" },
    ],
  },
};

const GetStarted = () => {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    emergencyContact: "",
    preferredDays: "",
    preferredTime: "",
  });

  // Auto-select service from URL query parameter
  useEffect(() => {
    const serviceParam = searchParams.get("service");
    if (serviceParam && servicesData[serviceParam]) {
      setSelectedService(serviceParam);
      setCurrentStep(2); // Skip to plan selection
    }
  }, [searchParams]);

  const handleServiceChange = (service: string) => {
    setSelectedService(service);
    setSelectedPlan("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast({ title: "Please fill in your name, email and phone number", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    // GetStarted collects plan/service interest but no password.
    // Hand off to /register with pre-filled query params so the user
    // can complete their account creation there.
    navigate(
      `/register?service=${encodeURIComponent(selectedService)}` +
        `&plan=${encodeURIComponent(selectedPlan)}` +
        `&name=${encodeURIComponent(formData.fullName)}` +
        `&email=${encodeURIComponent(formData.email)}` +
        `&phone=${encodeURIComponent(formData.phone)}`
    );
    setIsSubmitting(false);
  };

  const selectedServiceData = selectedService ? servicesData[selectedService] : null;
  const selectedPlanData = selectedServiceData?.plans.find((p) => p.id === selectedPlan);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative hero-gradient text-primary-foreground py-16 lg:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <img src={heroImage} alt="Get Started" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              takehealth - INTEGRATED FITNESS, LIFESTYLE & WELLNESS
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg md:text-xl text-primary-foreground/90">
              Client Registration & Service Selection
            </motion.p>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="bg-muted/30 py-4">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${currentStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 4 && <div className={`w-12 h-1 mx-2 ${currentStep > step ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-8 mt-2 text-sm text-muted-foreground">
            <span>Select Service</span>
            <span>Choose Plan</span>
            <span>Your Details</span>
            <span>Review & Submit</span>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <Card className="card-wellness">
              <CardContent className="pt-6">
                {/* Step 1: Service Selection */}
                {currentStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="text-center mb-6">
                      <h2 className="font-serif text-2xl font-bold text-foreground">Step 1: Select Your Service</h2>
                      <p className="text-muted-foreground">Choose the wellness service you are interested in</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service">Primary Service</Label>
                      <Select value={selectedService} onValueChange={handleServiceChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gym">Gym Services</SelectItem>
                          <SelectItem value="spa">Spa & Massage Therapy</SelectItem>
                          <SelectItem value="skincare">Skin Care</SelectItem>
                          <SelectItem value="dental">Dental Care</SelectItem>
                          <SelectItem value="elite">Elite Sport Care</SelectItem>
                          <SelectItem value="rehab">Rehabilitative Care</SelectItem>
                          <SelectItem value="nutrition">Nutritional Care</SelectItem>
                          <SelectItem value="counselling">Counselling</SelectItem>
                          <SelectItem value="health360">Health360+ Integrated Programme</SelectItem>
                          <SelectItem value="corporate">Corporate / Enterprise Plan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedService && (
                      <div className="flex justify-end mt-6">
                        <Button onClick={handleNextStep} disabled={!selectedService}>
                          Next: Choose Plan <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 2: Plan Selection */}
                {currentStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Button variant="ghost" size="sm" onClick={handlePrevStep}>
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-foreground">Step 2: Choose Your Plan</h2>
                        <p className="text-muted-foreground">{selectedServiceData?.title}</p>
                      </div>
                    </div>
                    <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                      <div className="grid gap-4">
                        {selectedServiceData?.plans.map((plan) => (
                          <div
                            key={plan.id}
                            className={`flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${selectedPlan === plan.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                            onClick={() => setSelectedPlan(plan.id)}
                          >
                            <RadioGroupItem value={plan.id} id={plan.id} />
                            <div className="flex-1">
                              <Label htmlFor={plan.id} className="cursor-pointer flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold">{plan.name}</span>
                                  <span className="text-primary font-bold">{plan.price}{plan.period}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                              </Label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={handlePrevStep}>
                        <ArrowLeft className="mr-2 w-4 h-4" /> Back
                      </Button>
                      <Button onClick={handleNextStep} disabled={!selectedPlan}>
                        Next: Your Details <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Client Information */}
                {currentStep === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Button variant="ghost" size="sm" onClick={handlePrevStep}>
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-foreground">Step 3: Your Details</h2>
                        <p className="text-muted-foreground">Please provide your information</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" placeholder="Enter full name" value={formData.fullName} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="email@example.com" value={formData.email} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone/WhatsApp</Label>
                        <Input id="phone" type="tel" placeholder="+234..." value={formData.phone} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input id="dob" type="date" value={formData.dob} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={formData.gender} onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" placeholder="Residential address" value={formData.address} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="emergencyContact">Emergency Contact (Name & Phone)</Label>
                        <Input id="emergencyContact" placeholder="Name and phone number" value={formData.emergencyContact} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferredDays">Preferred Days</Label>
                        <Input id="preferredDays" placeholder="e.g., Mon, Wed, Fri" value={formData.preferredDays} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferredTime">Preferred Time</Label>
                        <Input id="preferredTime" placeholder="e.g., 6:00-7:30 am" value={formData.preferredTime} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={handlePrevStep}>
                        <ArrowLeft className="mr-2 w-4 h-4" /> Back
                      </Button>
                      <Button onClick={handleNextStep} disabled={!formData.fullName || !formData.email || !formData.phone}>
                        Next: Review <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Review & Submit */}
                {currentStep === 4 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Button variant="ghost" size="sm" onClick={handlePrevStep}>
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-foreground">Step 4: Review & Submit</h2>
                        <p className="text-muted-foreground">Please review your information before submitting</p>
                      </div>
                    </div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Registration Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-semibold mb-2">Selected Service</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Service:</span>
                              <p className="font-medium">{selectedServiceData?.title}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Plan:</span>
                              <p className="font-medium">{selectedPlanData?.name}</p>
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">Price:</span>
                              <p className="font-medium text-primary">{selectedPlanData?.price}{selectedPlanData?.period}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-semibold mb-2">Client Information</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
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
                              <span className="text-muted-foreground">Date of Birth:</span>
                              <p className="font-medium">{formData.dob || "Not provided"}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Gender:</span>
                              <p className="font-medium">{formData.gender || "Not provided"}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Address:</span>
                              <p className="font-medium">{formData.address || "Not provided"}</p>
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">Emergency Contact:</span>
                              <p className="font-medium">{formData.emergencyContact || "Not provided"}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Preferred Days:</span>
                              <p className="font-medium">{formData.preferredDays || "Not provided"}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Preferred Time:</span>
                              <p className="font-medium">{formData.preferredTime || "Not provided"}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="terms" />
                          <Label htmlFor="terms" className="cursor-pointer">I agree to the terms and conditions</Label>
                        </div>
                      </CardContent>
                    </Card>
                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={handlePrevStep}>
                        <ArrowLeft className="mr-2 w-4 h-4" /> Back
                      </Button>
                      <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span> Submitting...
                          </>
                        ) : (
                          <>
                            Submit Registration <CheckCircle className="ml-2 w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GetStarted;
