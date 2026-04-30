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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, ApiError } from "../services/api";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2, CreditCard, Phone, Mail, Copy, Check } from "lucide-react";

// ─── Service/Plan catalogue (mirrors Services.tsx) ───────────────────────────

const SERVICE_LABELS: Record<string, string> = {
  gym: "Gym Services",
  spa: "Spa and Wellness",
  skincare: "Skin Care Services",
  dental: "Dental Care Services",
  elite: "Elite Sport Care",
  rehab: "Rehabilitative Care",
  nutrition: "Nutritional Care",
  counselling: "Counselling Services",
  health360: "Health360+ Program",
  corporate: "Corporate / Enterprise Plan",
};

const SERVICE_TYPES: { value: string; label: string }[] = Object.entries(SERVICE_LABELS).map(
  ([value, label]) => ({ value: value.toUpperCase(), label })
);

const PLAN_PRICES: Record<string, Record<string, { name: string; price: string; period: string }>> = {
  gym:        { basic: { name: "Basic Package",   price: "₦20,000",    period: "/ Month" },
                premium:{ name: "Premium Package", price: "₦30,000",    period: "/ Month" },
                elite:  { name: "Elite Package",   price: "₦40,000",    period: "/ Month" } },
  spa:        { basic: { name: "Basic Membership",   price: "₦80,000",   period: "/ Month" },
                premium:{ name: "Premium Membership",price: "₦150,000",  period: "/ Month" },
                elite:  { name: "Elite Membership",  price: "₦250,000",  period: "/ Month" } },
  skincare:   { basic: { name: "Basic Glow",         price: "₦30,000",   period: "/ Month" },
                premium:{ name: "Premium Radiance",  price: "₦75,000",   period: "/ Month" },
                elite:  { name: "Elite Luminance",   price: "₦150,000",  period: "/ Month" } },
  dental:     { basic: { name: "Basic Dental Plan",  price: "₦120,000",  period: "/ Year"  },
                premium:{ name: "Premium Dental Plan",price: "₦250,000", period: "/ Year"  },
                elite:  { name: "Elite Dental Plan",  price: "₦600,000", period: "/ Year"  } },
  elite:      { basic: { name: "Elite Basic",        price: "₦55,000",   period: "/ Month" },
                premium:{ name: "Elite Premium",      price: "₦110,000",  period: "/ Month" },
                elite:  { name: "Elite Elite",        price: "₦195,000",  period: "/ Month" } },
  rehab:      { basic: { name: "Basic Rehab",        price: "₦380,000",  period: "/ 1 Month" },
                premium:{ name: "Premium Rehab",      price: "₦420,000",  period: "/ 2 Months" },
                elite:  { name: "Elite Rehab",        price: "₦540,000",  period: "/ 3 Months" } },
  nutrition:  { basic: { name: "Fit Start Bundle",   price: "From ₦50,000",  period: "" },
                premium:{ name: "Health Boost Bundle",price: "From ₦120,000", period: "" },
                elite:  { name: "New You Bundle",     price: "From ₦150,000", period: "" } },
  counselling:{ basic: { name: "Basic",              price: "₦75,000",   period: "/ Month" },
                premium:{ name: "Premium",            price: "₦150,000",  period: "/ Month" },
                elite:  { name: "Elite",              price: "₦295,000",  period: "/ Month" } },
  health360:  { basic: { name: "Health360+ Basic",   price: "₦260,000",  period: "/ Month" },
                premium:{ name: "Health360+ Premium", price: "₦470,000",  period: "/ Month" },
                elite:  { name: "Health360+ Elite",   price: "₦795,000",  period: "/ Month" } },
  corporate:  { starter:{ name: "Corporate Starter", price: "₦500,000",  period: "/ Month" },
                growth: { name: "Corporate Growth",   price: "₦1,200,000",period: "/ Month" },
                enterprise:{ name: "Enterprise",      price: "₦2,000,000",period: "/ Month" } },
};

const BANK_DETAILS = {
  bankName:      "First Bank of Nigeria",
  accountName:   "Takehealth Global Ltd",
  accountNumber: "3156789012",
};

const CONTACT = {
  phone: "+2349135893755",
  email: "info@takehealthglobal.com",
};

const genderMap: Record<string, string> = { male: "MALE", female: "FEMALE", other: "OTHER" };
const maritalMap: Record<string, string> = { single: "SINGLE", married: "MARRIED", divorced: "DIVORCED", widowed: "WIDOWED" };

// ─── Component ───────────────────────────────────────────────────────────────

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const urlService = searchParams.get("service") || "";
  const urlPlan    = searchParams.get("plan")    || "";
  const planInfo   = urlService && urlPlan ? PLAN_PRICES[urlService]?.[urlPlan] : null;

  const [isLoading, setIsLoading]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep]             = useState(1);
  const [copied, setCopied]         = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const [formData, setFormData] = useState({
    fullName:            "",
    email:               "",
    password:            "",
    phone:               "",
    dateOfBirth:         "",
    gender:              "",
    address:             "",
    maritalStatus:       "",
    emergencyContact:    "",
    emergencyPhone:      "",
    serviceType:         urlService ? urlService.toUpperCase() : "",
    currentMedications:  "",
    allergies:           "",
    medicalHistory:      "",
    agreeToTerms:        false,
    agreeToMedicalConsent: false,
  });

  const set = (field: string, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

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
      const authResponse = await apiRequest("/auth/sign-up/email", "POST", {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        rememberMe: true,
      });

      if ((authResponse as Record<string, unknown>).token)
        localStorage.setItem("token", String((authResponse as Record<string, unknown>).token));
      if ((authResponse as Record<string, unknown>).user)
        localStorage.setItem("user", JSON.stringify((authResponse as Record<string, unknown>).user));

      await apiRequest("/api/patients", "POST", {
        firstName: formData.fullName.split(" ")[0],
        lastName:  formData.fullName.split(" ").slice(1).join(" ") || formData.fullName.split(" ")[0],
        dateOfBirth:          formData.dateOfBirth   || undefined,
        gender:               genderMap[formData.gender] || "NOT_SPECIFIED",
        maritalStatus:        maritalMap[formData.maritalStatus] || "NOT_SPECIFIED",
        phone:                formData.phone         || undefined,
        allergies:            formData.allergies ? formData.allergies.split(",").map((a) => a.trim()) : [],
        medicalHistory:       formData.medicalHistory || undefined,
        emergencyContactName: formData.emergencyContact || undefined,
        emergencyContactPhone:formData.emergencyPhone   || undefined,
      });

      setRegisteredEmail(formData.email);
      setStep(4); // payment/confirmation step
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "An error occurred. Please try again.";
      toast({ title: "Registration Failed", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(BANK_DETAILS.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedServiceLabel = SERVICE_LABELS[urlService] || formData.serviceType;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src="/logo.svg" alt="takehealth Logo" className="h-24 md:h-28 object-contain" />
            </Link>
          </motion.div>

          {/* Selected Plan Banner */}
          {planInfo && step < 4 && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Registering for</p>
                <p className="font-semibold text-foreground">{selectedServiceLabel} — {planInfo.name}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{planInfo.price}</p>
                {planInfo.period && <p className="text-sm text-muted-foreground">{planInfo.period}</p>}
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">Client Registration</h1>
            <p className="text-muted-foreground text-lg">Complete the form below to register for our services</p>
          </motion.div>

          {/* Step indicators */}
          {step < 4 && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    s < step ? "bg-primary text-primary-foreground" :
                    s === step ? "bg-primary text-primary-foreground" :
                    "bg-muted text-muted-foreground"
                  }`}>{s < step ? <Check className="w-4 h-4" /> : s}</div>
                  {s < 3 && <div className={`w-12 h-0.5 ${s < step ? "bg-primary" : "bg-muted"}`} />}
                </div>
              ))}
            </div>
          )}

          <Card className="shadow-lg">
            <CardHeader>
              {step < 4 && (
                <>
                  <CardTitle>Step {step} of 3</CardTitle>
                  <CardDescription>
                    {step === 1 && "Personal Information & Account Setup"}
                    {step === 2 && "Service Selection & Medical Information"}
                    {step === 3 && "Review & Submit"}
                  </CardDescription>
                </>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>

                {/* ── Step 1: Personal Info ─────────────────────────────── */}
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input id="fullName" placeholder="Enter your full name" value={formData.fullName}
                          onChange={(e) => set("fullName", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" placeholder="Enter your email" value={formData.email}
                          onChange={(e) => set("email", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <div className="relative">
                          <Input id="password" type={showPassword ? "text" : "password"}
                            placeholder="Min. 8 characters" value={formData.password}
                            onChange={(e) => set("password", e.target.value)} required />
                          <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" type="tel" placeholder="e.g. +2348012345678" value={formData.phone}
                          onChange={(e) => set("phone", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input id="dateOfBirth" type="date" value={formData.dateOfBirth}
                          onChange={(e) => set("dateOfBirth", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <RadioGroup value={formData.gender} onValueChange={(v) => set("gender", v)} className="flex gap-4">
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
                        <Select value={formData.maritalStatus} onValueChange={(v) => set("maritalStatus", v)}>
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
                          onChange={(e) => set("address", e.target.value)} />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="button" onClick={handleNextStep}>Next Step</Button>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 2: Service & Medical ─────────────────────────── */}
                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="space-y-2">
                      <Label>Select Service *</Label>
                      <Select value={formData.serviceType} onValueChange={(v) => set("serviceType", v)}>
                        <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
                        <SelectContent>
                          {SERVICE_TYPES.map((s) => (
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
                            onChange={(e) => set("emergencyContact", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergencyPhone">Contact Phone</Label>
                          <Input id="emergencyPhone" type="tel" placeholder="Emergency contact phone" value={formData.emergencyPhone}
                            onChange={(e) => set("emergencyPhone", e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">Medical Information</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="allergies">Allergies (comma-separated)</Label>
                          <Textarea id="allergies" placeholder="e.g. Penicillin, Peanuts" value={formData.allergies}
                            onChange={(e) => set("allergies", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="medicalHistory">Medical History</Label>
                          <Textarea id="medicalHistory" placeholder="Relevant medical history" value={formData.medicalHistory}
                            onChange={(e) => set("medicalHistory", e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>Previous</Button>
                      <Button type="button" onClick={handleNextStep}>Next Step</Button>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 3: Review & Submit ───────────────────────────── */}
                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="bg-muted rounded-lg p-6 space-y-4">
                      <h3 className="font-semibold text-lg">Review Your Information</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        {[
                          ["Full Name",    formData.fullName],
                          ["Email",        formData.email],
                          ["Phone",        formData.phone],
                          ["Service",      SERVICE_LABELS[urlService] || formData.serviceType],
                          ["Plan",         planInfo ? `${planInfo.name} — ${planInfo.price} ${planInfo.period}` : "—"],
                          ["Date of Birth",formData.dateOfBirth || "—"],
                          ["Gender",       formData.gender || "—"],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <span className="text-muted-foreground">{label}:</span>
                            <p className="font-medium">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {planInfo && (
                      <div className="border border-primary/30 bg-primary/5 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{planInfo.name}</p>
                          <p className="text-sm text-muted-foreground">{selectedServiceLabel}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{planInfo.price}</p>
                          {planInfo.period && <p className="text-xs text-muted-foreground">{planInfo.period}</p>}
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="agreeToTerms" checked={formData.agreeToTerms}
                          onCheckedChange={(c) => set("agreeToTerms", !!c)} />
                        <Label htmlFor="agreeToTerms" className="text-sm">
                          I agree to the <Link to="/terms" className="text-primary underline">Terms and Conditions</Link> *
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="agreeToMedicalConsent" checked={formData.agreeToMedicalConsent}
                          onCheckedChange={(c) => set("agreeToMedicalConsent", !!c)} />
                        <Label htmlFor="agreeToMedicalConsent" className="text-sm">
                          I consent to the collection and processing of my medical information *
                        </Label>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(2)}>Previous</Button>
                      <Button type="submit" disabled={isLoading || !formData.agreeToTerms || !formData.agreeToMedicalConsent}>
                        {isLoading ? "Submitting…" : "Complete Registration"}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 4: Payment & Confirmation ───────────────────── */}
                {step === 4 && (
                  <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 py-4">
                    {/* Success header */}
                    <div className="text-center space-y-3">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                      </div>
                      <h2 className="font-serif text-2xl font-bold">Registration Successful!</h2>
                      <p className="text-muted-foreground">
                        Welcome, <strong>{formData.fullName}</strong>! Your account has been created.
                        Complete your payment below to activate your membership.
                      </p>
                      {registeredEmail && (
                        <Badge variant="outline" className="text-xs">{registeredEmail}</Badge>
                      )}
                    </div>

                    {/* Selected plan summary */}
                    {planInfo && (
                      <div className="border-2 border-primary/20 bg-primary/5 rounded-xl p-5 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Your Plan</p>
                          <p className="font-bold text-lg">{planInfo.name}</p>
                          <p className="text-sm text-muted-foreground">{selectedServiceLabel}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-primary">{planInfo.price}</p>
                          {planInfo.period && <p className="text-sm text-muted-foreground">{planInfo.period}</p>}
                        </div>
                      </div>
                    )}

                    {/* Payment instructions */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-lg">Payment Instructions</h3>
                      </div>

                      <p className="text-muted-foreground text-sm">
                        Please make a bank transfer of <strong>{planInfo?.price || "the plan amount"}</strong> to the account
                        below. Send your proof of payment to us via phone or email to activate your account within 24 hours.
                      </p>

                      {/* Bank details card */}
                      <div className="bg-muted rounded-xl p-5 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Bank</span>
                          <span className="font-medium">{BANK_DETAILS.bankName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Account Name</span>
                          <span className="font-medium">{BANK_DETAILS.accountName}</span>
                        </div>
                        <div className="flex justify-between items-center border-t pt-3">
                          <span className="text-sm text-muted-foreground">Account Number</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg tracking-widest">{BANK_DETAILS.accountNumber}</span>
                            <button
                              type="button"
                              onClick={copyAccountNumber}
                              className="text-primary hover:text-primary/80 transition-colors"
                              title="Copy account number"
                            >
                              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Contact to confirm */}
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                        <p className="text-sm font-medium text-blue-800">After payment, send your proof of payment to:</p>
                        <div className="space-y-2">
                          <a href={`tel:${CONTACT.phone}`}
                            className="flex items-center gap-2 text-sm text-blue-700 hover:underline">
                            <Phone className="w-4 h-4" />{CONTACT.phone} (WhatsApp / Call)
                          </a>
                          <a href={`mailto:${CONTACT.email}`}
                            className="flex items-center gap-2 text-sm text-blue-700 hover:underline">
                            <Mail className="w-4 h-4" />{CONTACT.email}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button className="flex-1" onClick={() => navigate("/login")}>
                        Go to Login
                      </Button>
                      <Button variant="outline" className="flex-1" asChild>
                        <Link to="/services">Browse Other Services</Link>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </form>
            </CardContent>
          </Card>

          {step < 4 && (
            <p className="text-center text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Register;
