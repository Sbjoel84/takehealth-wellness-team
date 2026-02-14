import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Users, Activity, Heart, CheckCircle, Calendar, User, Phone, Mail, MapPin, Search, Filter, Brain, Stethoscope, Trophy, Utensils, Dumbbell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Import images for intake forms
import counsellingHero from "@/assets/Counselling.jpg";
import dentalHero from "@/assets/service-dental.jpg";
import eliteHero from "@/assets/service-elite.jpg";
import massageHero from "@/assets/massage.jpg";
import nutritionHero from "@/assets/Nutrition Care.jpg";
import rehabHero from "@/assets/service-rehab.jpeg";

// Intake Hero Component
const IntakeHero = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  image 
}: { 
  title: string; 
  subtitle: string; 
  icon: React.ComponentType<{ className?: string }>; 
  image?: string 
}) => (
  <div className="relative rounded-xl overflow-hidden mb-6">
    {image && (
      <div className="absolute inset-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      </div>
    )}
    {!image && <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />}
    <div className="relative p-6 md:p-8 text-primary-foreground">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-white/20 rounded-lg">
          <Icon className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold">{title}</h2>
      </div>
      <p className="text-primary-foreground/90">{subtitle}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [searchParams] = useSearchParams();
  const urlTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(urlTab || "counselling");

  useEffect(() => {
    if (urlTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-2xl md:text-3xl font-bold"
              >
                Admin Dashboard
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-primary-foreground/80 mt-1"
              >
                Client Registration & Intake Management
              </motion.p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm">
                <Users className="w-4 h-4" />
                <span>Admin Access Only</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="py-6 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Clients</p>
                    <p className="text-2xl font-bold">248</p>
                  </div>
                  <Users className="w-8 h-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">New This Month</p>
                    <p className="text-2xl font-bold">32</p>
                  </div>
                  <Calendar className="w-8 h-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Forms</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <FileText className="w-8 h-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Cases</p>
                    <p className="text-2xl font-bold">89</p>
                  </div>
                  <Activity className="w-8 h-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 px-4 md:px-8">
        <div className="container mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <TabsList className="grid grid-cols-6 w-full md:w-auto">
                <TabsTrigger value="counselling">Counselling</TabsTrigger>
                <TabsTrigger value="dental">Dental Care</TabsTrigger>
                <TabsTrigger value="elite-sport">Elite Sport</TabsTrigger>
                <TabsTrigger value="fitness">Fitness Test</TabsTrigger>
                <TabsTrigger value="rehab">Rehab</TabsTrigger>
                <TabsTrigger value="spa">Spa</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search clients..." className="pl-9" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Counselling Intake Tab */}
            <TabsContent value="counselling" className="space-y-6">
              <IntakeHero 
                title="Counselling Services"
                subtitle="Mental health matters. Your confidential space for healing and growth."
                icon={Brain}
                image={counsellingHero}
              />
              <Card>
                <CardHeader className="bg-primary/5 border-b">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    <CardTitle>Counselling Assessment & Intake Form</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    For admin use only - Client registration and bio data collection
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  <form className="space-y-8">
                    {/* Client & Session Details */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        1) Client & Session Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="counselling-date">Intake Date</Label>
                          <Input id="counselling-date" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="counselling-clientId">Client ID</Label>
                          <Input id="counselling-clientId" value="TH-CNS-0001" readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="counselling-clientName">Client Name</Label>
                          <Input id="counselling-clientName" placeholder="Enter full name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="counselling-phone">Phone/WhatsApp</Label>
                          <Input id="counselling-phone" type="tel" placeholder="+234..." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="counselling-email">Email</Label>
                          <Input id="counselling-email" type="email" placeholder="email@example.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="counselling-dob">D.O.B/Age</Label>
                          <Input id="counselling-dob" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="counselling-nin">NIN</Label>
                          <Input id="counselling-nin" placeholder="National ID Number" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="counselling-address">Address</Label>
                          <Input id="counselling-address" placeholder="Residential address" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="counselling-gender">Gender</Label>
                          <Select>
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
                          <Label htmlFor="counselling-marital">Marital Status</Label>
                          <Select>
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
                        <div className="space-y-2">
                          <Label htmlFor="counselling-occupation">Occupation</Label>
                          <Input id="counselling-occupation" placeholder="Your profession" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="counselling-counsellor">Counsellor/Therapist</Label>
                          <Input id="counselling-counsellor" placeholder="Assigned counsellor" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="counselling-session">Session Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="individual">One-on-one Therapy</SelectItem>
                              <SelectItem value="group">Group Sessions</SelectItem>
                              <SelectItem value="wellness-coaching">Wellness Coaching</SelectItem>
                              <SelectItem value="faith-based">Faith-Based Option</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Presenting Concerns */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        2) Presenting Concerns
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {[
                          "Stress/burnout",
                          "Anxiety/worry",
                          "Low mood/sadness",
                          "Sleep problems",
                          "Anger/irritability",
                          "Relationship issues",
                          "Parenting/family issues",
                          "Work/career challenges",
                          "Trauma experiences",
                          "Self-esteem/confidence",
                          "Addiction concerns",
                          "Grief/bereavement",
                        ].map((concern, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox id={`counselling-concern-${index}`} />
                            <Label htmlFor={`counselling-concern-${index}`} className="text-sm cursor-pointer">
                              {concern}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="counselling-summary">Client summary of concerns:</Label>
                        <Textarea id="counselling-summary" placeholder="Describe concerns in their words..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="counselling-goals">Goals for counselling:</Label>
                        <Textarea id="counselling-goals" placeholder="What are the goals?" />
                      </div>
                    </div>

                    {/* Risk & Safety Screening */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        3) Risk & Safety Screening (Confidential)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                        {[
                          "Thoughts of self-harm or suicide",
                          "Plan/intent to self-harm (current)",
                          "Thoughts of harming others",
                          "Recent violence/abuse",
                          "Severe substance use",
                          "Psychotic symptoms",
                          "Recent major crisis",
                        ].map((risk, index) => (
                          <div key={index} className="flex items-center space-x-4 py-2">
                            <span className="text-sm w-1/2">{risk}</span>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <Checkbox id={`counselling-risk-yes-${index}`} />
                                <Label htmlFor={`counselling-risk-yes-${index}`} className="text-sm cursor-pointer">YES</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id={`counselling-risk-no-${index}`} />
                                <Label htmlFor={`counselling-risk-no-${index}`} className="text-sm cursor-pointer">NO</Label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mental Health History */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        4) Mental Health & Treatment History
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {[
                          "Previous counselling/therapy",
                          "Previous psychiatric diagnosis",
                          "Hospitalisation for mental health",
                          "Currently on psychiatric medication",
                        ].map((history, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox id={`counselling-history-${index}`} />
                            <Label htmlFor={`counselling-history-${index}`} className="text-sm cursor-pointer">
                              {history}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="counselling-medications">Current medications:</Label>
                        <Textarea id="counselling-medications" placeholder="List current medications..." />
                      </div>
                    </div>

                    {/* Consent & Signatures */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        5) Consent & Signatures
                      </h3>
                      <div className="space-y-2">
                        {[
                          "Information provided is accurate",
                          "Understand confidentiality limits",
                          "Consent to assessment data recording",
                          "Agree to booking policy",
                        ].map((consent, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <Checkbox id={`counselling-consent-${index}`} />
                            <Label htmlFor={`counselling-consent-${index}`} className="text-sm cursor-pointer">
                              {consent}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline">Save as Draft</Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90">Submit Client Record</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dental Intake Tab */}
            <TabsContent value="dental" className="space-y-6">
              <IntakeHero 
                title="Dental Care Services"
                subtitle="Smile better with us. Lasting confidence starts here."
                icon={Stethoscope}
                image={dentalHero}
              />
              <Card>
                <CardHeader className="bg-primary/5 border-b">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    <CardTitle>Dental Care Assessment Form</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    For admin use only - Client registration and dental records
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  <form className="space-y-8">
                    {/* Client Information */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        1) Client Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dental-date">Assessment Date</Label>
                          <Input id="dental-date" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dental-assessmentId">Assessment ID</Label>
                          <Input id="dental-assessmentId" value="TH-DEN-0001" readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dental-fullName">Full Name</Label>
                          <Input id="dental-fullName" placeholder="Enter full name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dental-phone">Phone/WhatsApp</Label>
                          <Input id="dental-phone" type="tel" placeholder="+234..." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dental-email">Email</Label>
                          <Input id="dental-email" type="email" placeholder="email@example.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dental-dob">D.O.B/Age</Label>
                          <Input id="dental-dob" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dental-nin">NIN</Label>
                          <Input id="dental-nin" placeholder="National ID Number" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dental-gender">Gender</Label>
                          <Select>
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
                          <Label htmlFor="dental-address">Address</Label>
                          <Input id="dental-address" placeholder="Residential address" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dental-emergency">Emergency Contact</Label>
                          <Input id="dental-emergency" placeholder="Name and phone number" />
                        </div>
                      </div>
                    </div>

                    {/* Reason for Visit */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        2) Reason for Visit & Dental History
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="dental-reason">Reason for visit:</Label>
                        <Textarea id="dental-reason" placeholder="Describe dental concerns..." />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dental-lastVisit">Last dental visit</Label>
                          <Input id="dental-lastVisit" placeholder="When was last visit?" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dental-gumBleed">Gums bleed when brushing?</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                              <SelectItem value="sometimes">Sometimes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dental-pain">Dental pain currently?</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                              <SelectItem value="occasional">Occasional</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Oral Hygiene */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        3) Oral Hygiene & Habits
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dental-brush">Brush frequency/day</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="once">Once a day</SelectItem>
                              <SelectItem value="twice">Twice a day</SelectItem>
                              <SelectItem value="more">More than twice</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dental-floss">Flossing</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="never">Never</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dental-smoking">Smoking</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                              <SelectItem value="former">Former smoker</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dental-anxiety">Dental anxiety?</Label>
                          <Textarea id="dental-anxiety" placeholder="Any fears?" />
                        </div>
                      </div>
                    </div>

                    {/* Medical History */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        4) Medical History (Relevant to Dental Care)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                        {[
                          "Hypertension",
                          "Diabetes",
                          "Heart condition",
                          "Asthma",
                          "Bleeding disorder",
                          "Pregnancy",
                          "Allergies",
                        ].map((condition, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox id={`dental-medical-${index}`} />
                            <Label htmlFor={`dental-medical-${index}`} className="text-sm cursor-pointer">
                              {condition}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dental-medications">Current medications:</Label>
                        <Textarea id="dental-medications" placeholder="List current medications..." />
                      </div>
                    </div>

                    {/* Services Required */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        5) Services Required
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {[
                          "Consultation & Examination",
                          "Scaling & Polishing",
                          "Curettage (Deep Cleaning)",
                          "Dental X-ray",
                          "Permanent Filling",
                          "Crown & Bridge",
                          "Teeth Whitening",
                          "Braces",
                          "Tooth Extraction",
                          "Gum Disease Assessment",
                          "Referral / Specialist",
                        ].map((service, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox id={`dental-service-${index}`} />
                            <Label htmlFor={`dental-service-${index}`} className="text-sm cursor-pointer">
                              {service}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Treatment Plan */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        6) Treatment Plan & Follow-up
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="dental-plan">Treatment plan:</Label>
                        <Textarea id="dental-plan" placeholder="Document treatment plan..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dental-next">Next appointment:</Label>
                        <Input id="dental-next" type="date" />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline">Save as Draft</Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90">Submit Client Record</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Elite Sport Intake Tab */}
            <TabsContent value="elite-sport" className="space-y-6">
              <IntakeHero 
                title="Elite Sport Care"
                subtitle="Peak performance. No limits. For athletes who demand excellence."
                icon={Trophy}
                image={eliteHero}
              />
              <Card>
                <CardHeader className="bg-primary/5 border-b">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    <CardTitle>Elite Sport Care (ESC) Assessment Form</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    For admin use only - Athlete registration and performance records
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  <form className="space-y-8">
                    {/* Athlete Profile */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        1) Athlete Profile & Assessment Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="elite-date">Assessment Date</Label>
                          <Input id="elite-date" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="elite-assessmentId">Assessment ID</Label>
                          <Input id="elite-assessmentId" value="TH-ESC-0001" readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="elite-athleteName">Athlete Name</Label>
                          <Input id="elite-athleteName" placeholder="Enter full name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="elite-phone">Phone/WhatsApp</Label>
                          <Input id="elite-phone" type="tel" placeholder="+234..." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="elite-dob">Date of Birth / Age</Label>
                          <Input id="elite-dob" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="elite-gender">Gender</Label>
                          <Select>
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
                          <Label htmlFor="elite-sport">Sport</Label>
                          <Input id="elite-sport" placeholder="Your sport" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="elite-position">Position</Label>
                          <Input id="elite-position" placeholder="Your position" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="elite-level">Level</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="youth">Youth/Junior</SelectItem>
                              <SelectItem value="amateur">Amateur</SelectItem>
                              <SelectItem value="semi-pro">Semi-Professional</SelectItem>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="elite">Elite</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="elite-club">Club/School</Label>
                          <Input id="elite-club" placeholder="Club or School name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="elite-address">Address</Label>
                          <Input id="elite-address" placeholder="Residential address" />
                        </div>
                      </div>
                    </div>

                    {/* Assessment Purpose */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        2) Assessment Purpose
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {[
                          "Baseline / Pre-season profiling",
                          "In-season monitoring",
                          "Pre-competition readiness",
                          "Return-to-play (post injury)",
                          "Post-season review",
                          "Talent/selection screening",
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox id={`elite-purpose-${index}`} />
                            <Label htmlFor={`elite-purpose-${index}`} className="text-sm cursor-pointer">
                              {item}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="elite-season">Season phase & upcoming competitions:</Label>
                        <Textarea id="elite-season" placeholder="Describe current season phase..." />
                      </div>
                    </div>

                    {/* Medical Screening */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        3) Medical Screening & Injury History
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {[
                          "Heart condition/chest pain",
                          "Asthma/breathing difficulty",
                          "Hypertension",
                          "Diabetes",
                          "History of concussion",
                          "Recent surgery (within 12 months)",
                          "Current injury or pain",
                          "Allergies",
                          "Sickle cell trait",
                        ].map((condition, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox id={`elite-medical-${index}`} />
                            <Label htmlFor={`elite-medical-${index}`} className="text-sm cursor-pointer">
                              {condition}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="elite-injury">Injury history:</Label>
                        <Textarea id="elite-injury" placeholder="Document past injuries..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="elite-symptoms">Current symptoms/pain:</Label>
                        <Textarea id="elite-symptoms" placeholder="Describe current symptoms..." />
                      </div>
                    </div>

                    {/* Anthropometrics */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        4) Anthropometrics & Vitals
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="elite-height">Height (cm)</Label>
                          <Input id="elite-height" type="number" placeholder="Height in cm" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="elite-weight">Weight (kg)</Label>
                          <Input id="elite-weight" type="number" placeholder="Weight in kg" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="elite-bmi">BMI</Label>
                          <Input id="elite-bmi" type="number" placeholder="BMI" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="elite-bp">Blood Pressure</Label>
                          <Input id="elite-bp" placeholder="Blood pressure" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="elite-restingHR">Resting HR (bpm)</Label>
                          <Input id="elite-restingHR" type="number" placeholder="Resting heart rate" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="elite-pain">Pain Score (0–10)</Label>
                          <Input id="elite-pain" type="number" min="0" max="10" placeholder="0-10" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="elite-rpe">RPE Today (0–10)</Label>
                          <Input id="elite-rpe" type="number" min="0" max="10" placeholder="0-10" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="elite-sleep">Sleep (hrs/night)</Label>
                          <Input id="elite-sleep" type="number" placeholder="Hours of sleep" />
                        </div>
                      </div>
                    </div>

                    {/* Performance Goals */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        5) Performance Goals & Key Metrics
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                        {[
                          "Strength (lower/upper)",
                          "Speed (acceleration)",
                          "Agility",
                          "Power (jump/throw)",
                          "Endurance",
                          "Mobility",
                          "Body composition",
                          "Injury prevention",
                        ].map((goal, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox id={`elite-goal-${index}`} />
                            <Label htmlFor={`elite-goal-${index}`} className="text-sm cursor-pointer">
                              {goal}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ESC Care Plan */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        6) ESC Care Plan
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="elite-findings">Summary of findings:</Label>
                        <Textarea id="elite-findings" placeholder="Summarize assessment findings..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="elite-plan">Training/rehab plan:</Label>
                        <Textarea id="elite-plan" placeholder="Document training and rehab plan..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="elite-next">Next assessment:</Label>
                        <Input id="elite-next" type="date" />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline">Save as Draft</Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90">Submit Athlete Record</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Fitness Test Tab */}
            <TabsContent value="fitness" className="space-y-6">
              <Card>
                <CardHeader className="bg-primary/5 border-b">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    <CardTitle>Fitness Test & Assessment Form</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Baseline & Progress Tracking – Recommended before starting and every 8–12 weeks
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  <form className="space-y-8">
                    {/* Client & Session Details */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        1) Client & Session Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fitness-date">Assessment Date</Label>
                          <Input id="fitness-date" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fitness-assessmentId">Assessment ID</Label>
                          <Input id="fitness-assessmentId" value="TH-FT-0001" readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fitness-clientName">Client Name</Label>
                          <Input id="fitness-clientName" placeholder="Enter full name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fitness-phone">Phone/WhatsApp</Label>
                          <Input id="fitness-phone" type="tel" placeholder="+234..." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fitness-dob">D.O.B/Age</Label>
                          <Input id="fitness-dob" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fitness-gender">Gender</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fitness-nin">NIN</Label>
                          <Input id="fitness-nin" placeholder="National ID Number" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fitness-marital">Marital Status</Label>
                          <Select>
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
                        <div className="space-y-2">
                          <Label htmlFor="fitness-assessor">Assessor / Coach</Label>
                          <Input id="fitness-assessor" placeholder="Assessor name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fitness-location">Location</Label>
                          <Input id="fitness-location" placeholder="Assessment location" />
                        </div>
                      </div>
                    </div>

                    {/* Readiness & Medical Screening (PAR-Q) */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        2) Readiness & Medical Screening (PAR-Q)
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        If any answer is YES, consult a clinician/physio before high-intensity training. Document details below.
                      </p>
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          "Has your doctor ever said you have a heart condition or that you should only do physical activity recommended by a doctor?",
                          "Do you feel pain in your chest during physical activity?",
                          "In the past month, have you had chest pain when not doing physical activity?",
                          "Do you lose balance because of dizziness, or do you ever lose consciousness?",
                          "Do you have a bone/joint problem (back, knee, hip, shoulder) that could worsen with exercise?",
                          "Are you currently taking medication for blood pressure or a heart condition?",
                          "Are you pregnant or less than 6 months postpartum?",
                          "Do you have any other medical reason why you should not do physical activity?",
                        ].map((question, index) => (
                          <div key={index} className="flex items-start space-x-4 py-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox id={`fitness-parq-yes-${index}`} />
                              <Label htmlFor={`fitness-parq-yes-${index}`} className="cursor-pointer">YES</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id={`fitness-parq-no-${index}`} />
                              <Label htmlFor={`fitness-parq-no-${index}`} className="cursor-pointer">NO</Label>
                            </div>
                            <Label htmlFor={`fitness-parq-${index}`} className="text-sm flex-1">
                              {question}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fitness-parq-details">If YES to any above, details:</Label>
                        <Textarea id="fitness-parq-details" placeholder="Document any YES responses..." />
                      </div>
                    </div>

                    {/* Goals & Training Background */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        3) Goals & Training Background
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="fitness-goals">Primary goals:</Label>
                        <Textarea id="fitness-goals" placeholder="What are the client's primary fitness goals?" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fitness-activity">Current activity level:</Label>
                        <Textarea id="fitness-activity" placeholder="Describe current activity level..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fitness-injuries">Injuries/pain:</Label>
                        <Textarea id="fitness-injuries" placeholder="Document any injuries or pain concerns..." />
                      </div>
                    </div>

                    {/* Vitals & Anthropometrics */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        4) Vitals & Anthropometrics
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fitness-bp">Resting BP (mmHg)</Label>
                          <Input id="fitness-bp" placeholder="Blood pressure" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fitness-hr">Resting HR (bpm)</Label>
                          <Input id="fitness-hr" type="number" placeholder="Heart rate" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fitness-height">Height (cm)</Label>
                          <Input id="fitness-height" type="number" placeholder="Height in cm" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fitness-weight">Weight (kg)</Label>
                          <Input id="fitness-weight" type="number" placeholder="Weight in kg" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fitness-bmi">BMI</Label>
                          <Input id="fitness-bmi" type="number" placeholder="BMI" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fitness-waist">Waist (cm)</Label>
                          <Input id="fitness-waist" type="number" placeholder="Waist circumference" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fitness-hip">Hip (cm)</Label>
                          <Input id="fitness-hip" type="number" placeholder="Hip circumference" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fitness-waistHip">Waist–Hip Ratio</Label>
                          <Input id="fitness-waistHip" type="number" placeholder="Ratio" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fitness-spo2">SpO₂ (%)</Label>
                          <Input id="fitness-spo2" type="number" placeholder="Oxygen saturation" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fitness-temp">Temperature (°C)</Label>
                          <Input id="fitness-temp" type="number" placeholder="Body temperature" />
                        </div>
                      </div>
                    </div>

                    {/* Body Composition */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        5) Body Composition (InBody or equivalent)
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">Record results if available:</p>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Metric</TableHead>
                              <TableHead>Result</TableHead>
                              <TableHead>Notes / Target</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[
                              { id: "bodyFat", label: "Body Fat %" },
                              { id: "smm", label: "Skeletal Muscle Mass" },
                              { id: "visceralFat", label: "Visceral Fat Level" },
                              { id: "tbw", label: "Total Body Water" },
                            ].map((row, index) => (
                              <TableRow key={index}>
                                <TableCell>{row.label}</TableCell>
                                <TableCell>
                                  <Input id={`fitness-${row.id}`} placeholder="Result" />
                                </TableCell>
                                <TableCell>
                                  <Input id={`fitness-${row.id}-notes`} placeholder="Notes" />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Posture, Mobility & Functional Movement */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        6) Posture, Mobility & Functional Movement Screen
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Score 0–3 where applicable; note pain, asymmetry, compensation patterns.
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="fitness-movement-summary">Movement screen summary:</Label>
                        <Textarea id="fitness-movement-summary" placeholder="Overall movement assessment..." />
                      </div>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Test</TableHead>
                              <TableHead>Score / Result</TableHead>
                              <TableHead>Observations</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[
                              "Posture Check (head/shoulders/hips/knees/feet)",
                              "Overhead Squat",
                              "Hinge / Hip Flexion Pattern",
                              "Lunge Pattern",
                              "Shoulder Mobility",
                              "Core Stability (dead bug/brace)",
                              "Balance (single-leg stance 30s)",
                            ].map((test, index) => (
                              <TableRow key={index}>
                                <TableCell>{test}</TableCell>
                                <TableCell>
                                  <Input id={`fitness-screen-score-${index}`} placeholder="Score" />
                                </TableCell>
                                <TableCell>
                                  <Input id={`fitness-screen-notes-${index}`} placeholder="Observations" />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Flexibility & Mobility Tests */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        7) Flexibility & Mobility Tests
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Test</TableHead>
                              <TableHead>Right</TableHead>
                              <TableHead>Left</TableHead>
                              <TableHead>Notes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[
                              "Sit-and-Reach (cm)",
                              "Shoulder Reach (cm)",
                              "Ankle Dorsiflexion (knee-to-wall cm)",
                              "Hip Flexor Length (Thomas test)",
                            ].map((test, index) => (
                              <TableRow key={index}>
                                <TableCell>{test}</TableCell>
                                <TableCell>
                                  <Input id={`fitness-flex-r-${index}`} placeholder="Right" />
                                </TableCell>
                                <TableCell>
                                  <Input id={`fitness-flex-l-${index}`} placeholder="Left" />
                                </TableCell>
                                <TableCell>
                                  <Input id={`fitness-flex-notes-${index}`} placeholder="Notes" />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Strength & Muscular Endurance */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        8) Strength & Muscular Endurance
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Choose appropriate tests. Skip any test that causes pain or unsafe technique.
                      </p>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Test</TableHead>
                              <TableHead>Result</TableHead>
                              <TableHead>Notes / Technique</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[
                              "Push-ups (max reps or 1-min)",
                              "Plank hold (seconds)",
                              "Wall-sit (seconds)",
                              "Grip strength (kg) – R/L",
                              "Squat / Leg press estimate",
                            ].map((test, index) => (
                              <TableRow key={index}>
                                <TableCell>{test}</TableCell>
                                <TableCell>
                                  <Input id={`fitness-strength-${index}`} placeholder="Result" />
                                </TableCell>
                                <TableCell>
                                  <Input id={`fitness-strength-notes-${index}`} placeholder="Notes" />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Cardiovascular Endurance */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        9) Cardiovascular Endurance
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Select ONE main endurance test appropriate to client status (submax preferred for beginners):
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                        {[
                          "3-Min Step Test (recovery HR)",
                          "Rockport 1-mile walk (time + HR)",
                          "6-Min Walk Test (distance)",
                          "Cooper 12-Min Run (distance)",
                          "Treadmill/Bike Submax Test",
                        ].map((test, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox id={`fitness-cardio-${index}`} />
                            <Label htmlFor={`fitness-cardio-${index}`} className="text-sm cursor-pointer">
                              {test}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Selected Test</TableHead>
                              <TableHead>Result</TableHead>
                              <TableHead>Interpretation / Zones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                <Input id="fitness-cardio-selected" placeholder="Selected test" />
                              </TableCell>
                              <TableCell>
                                <Input id="fitness-cardio-result" placeholder="Result" />
                              </TableCell>
                              <TableCell>
                                <Input id="fitness-cardio-interpretation" placeholder="Interpretation" />
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Power, Speed & Agility */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        10) Power, Speed & Agility (Optional – Athletes/Advanced Clients)
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Test</TableHead>
                              <TableHead>Result</TableHead>
                              <TableHead>Notes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[
                              "Vertical Jump (cm)",
                              "10m Sprint (s)",
                              "20m Sprint (s)",
                              "T-Test Agility (s)",
                            ].map((test, index) => (
                              <TableRow key={index}>
                                <TableCell>{test}</TableCell>
                                <TableCell>
                                  <Input id={`fitness-power-${index}`} placeholder="Result" />
                                </TableCell>
                                <TableCell>
                                  <Input id={`fitness-power-notes-${index}`} placeholder="Notes" />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Summary, Risk Notes & Recommendations */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        11) Summary, Risk Notes & Recommendations
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="fitness-findings">Key findings:</Label>
                        <Textarea id="fitness-findings" placeholder="Document key assessment findings..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fitness-focus">Training focus:</Label>
                        <Textarea id="fitness-focus" placeholder="Recommend training focus areas..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fitness-retest">Retest date:</Label>
                        <Input id="fitness-retest" type="date" />
                      </div>
                    </div>

                    {/* Consent */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        12) Consent
                      </h3>
                      <div className="space-y-2">
                        {[
                          "I confirm the information provided is accurate to the best of my knowledge.",
                          "I understand fitness testing involves physical activity, and I will stop if I feel pain, dizziness, or discomfort.",
                          "I consent to Takehealth recording my assessment data for progress tracking and care planning (confidential and secure).",
                          "I understand results are for wellness/fitness guidance and not a medical diagnosis.",
                        ].map((consent, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <Checkbox id={`fitness-consent-${index}`} />
                            <Label htmlFor={`fitness-consent-${index}`} className="text-sm cursor-pointer">
                              {consent}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="fitness-clientSig">Client Signature</Label>
                          <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg h-20 flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">Sign here</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fitness-assessorSig">Assessor Signature</Label>
                          <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg h-20 flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">Sign here</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline">Save as Draft</Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90">Submit Fitness Record</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rehabilitative Care Tab */}
            <TabsContent value="rehab" className="space-y-6">
              <IntakeHero 
                title="Rehabilitative Care"
                subtitle="Restore movement. Regain confidence in your body."
                icon={Activity}
                image={rehabHero}
              />
              <Card>
                <CardHeader className="bg-primary/5 border-b">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    <CardTitle>Rehabilitative Care Assessment Form</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Client Intake • Pain & Function • Therapy Plan
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Restore Movement. Regain Confidence.
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  <form className="space-y-8">
                    {/* Client Information */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        1) Client Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="rehab-date">Assessment Date</Label>
                          <Input id="rehab-date" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rehab-clientId">Client ID</Label>
                          <Input id="rehab-clientId" value="TH-REH-0001" readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rehab-fullName">Full Name</Label>
                          <Input id="rehab-fullName" placeholder="Enter full name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rehab-dob">Date of Birth</Label>
                          <Input id="rehab-dob" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rehab-age">Age</Label>
                          <Input id="rehab-age" type="number" placeholder="Age" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rehab-gender">Gender</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rehab-nin">NIN</Label>
                          <Input id="rehab-nin" placeholder="National ID Number" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rehab-marital">Marital Status</Label>
                          <Select>
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
                        <div className="space-y-2">
                          <Label htmlFor="rehab-phone">Phone Number</Label>
                          <Input id="rehab-phone" type="tel" placeholder="+234..." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rehab-email">Email Address</Label>
                          <Input id="rehab-email" type="email" placeholder="email@example.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rehab-emergency">Emergency Contact</Label>
                          <Input id="rehab-emergency" placeholder="Name and phone number" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rehab-occupation">Occupation (demands)</Label>
                          <Input id="rehab-occupation" placeholder="Job and physical demands" />
                        </div>
                      </div>
                    </div>

                    {/* Medical & Injury History */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        2) Medical & Injury History
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="rehab-injury">Primary injury/condition</Label>
                          <Textarea id="rehab-injury" placeholder="Describe primary injury or condition..." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rehab-onset">Date of onset/injury</Label>
                          <Input id="rehab-onset" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rehab-cause">Cause of injury</Label>
                          <Textarea id="rehab-cause" placeholder="How did the injury occur?" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rehab-surgery">Post-surgery?</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                        <Label className="font-medium">Medical conditions:</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                          {[
                            "Hypertension",
                            "Diabetes",
                            "Arthritis",
                            "Stroke",
                            "Cardiac condition",
                            "Neurological condition",
                            "Respiratory condition",
                            "None",
                          ].map((condition, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Checkbox id={`rehab-medical-${index}`} />
                              <Label htmlFor={`rehab-medical-${index}`} className="text-sm cursor-pointer">
                                {condition}
                              </Label>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Checkbox id="rehab-medical-other" />
                          <Label htmlFor="rehab-medical-other" className="text-sm cursor-pointer">
                            Other (specify)
                          </Label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rehab-medical-details">Other medical conditions:</Label>
                        <Textarea id="rehab-medical-details" placeholder="Specify other conditions..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rehab-medications">Current medications:</Label>
                        <Textarea id="rehab-medications" placeholder="List current medications..." />
                      </div>
                    </div>

                    {/* Pain & Functional Status */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        3) Pain & Functional Status
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="rehab-pain-location">Pain location(s)</Label>
                          <Input id="rehab-pain-location" placeholder="Where is the pain?" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rehab-pain-intensity">Pain intensity (0–10)</Label>
                          <Input id="rehab-pain-intensity" type="number" min="0" max="10" placeholder="0-10" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rehab-pain-frequency">Pain frequency</Label>
                          <Input id="rehab-pain-frequency" placeholder="How often?" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rehab-pain-desc">Pain description</Label>
                          <Textarea id="rehab-pain-desc" placeholder="Describe the pain..." />
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                        <Label className="font-medium">Affected activities:</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {[
                            "Walking",
                            "Standing",
                            "Sitting",
                            "Lifting",
                            "Bending",
                            "Reaching",
                            "Balance",
                            "Daily activities",
                            "Sports",
                          ].map((activity, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Checkbox id={`rehab-activity-${index}`} />
                              <Label htmlFor={`rehab-activity-${index}`} className="text-sm cursor-pointer">
                                {activity}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rehab-functional-notes">Functional notes:</Label>
                        <Textarea id="rehab-functional-notes" placeholder="Document functional limitations..." />
                      </div>
                    </div>

                    {/* Physical Activity & Lifestyle */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        4) Physical Activity & Lifestyle
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="rehab-activity-level">Current activity level</Label>
                          <Input id="rehab-activity-level" placeholder="Activity level" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rehab-exercise">Do you currently exercise?</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rehab-exercise-type">If yes, type/frequency</Label>
                          <Input id="rehab-exercise-type" placeholder="Exercise type and frequency" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rehab-sleep">Sleep (hrs/night)</Label>
                          <Input id="rehab-sleep" type="number" placeholder="Hours of sleep" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rehab-lifestyle-notes">Lifestyle notes:</Label>
                        <Textarea id="rehab-lifestyle-notes" placeholder="Additional lifestyle information..." />
                      </div>
                    </div>

                    {/* Rehabilitative Assessment */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        5) Rehabilitative Assessment (Clinical Use)
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Clinician to complete: posture, range of motion, strength, balance/coordination, red flags, contraindications.
                      </p>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Domain</TableHead>
                              <TableHead>Rating/Result</TableHead>
                              <TableHead>Notes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[
                              "Posture",
                              "Range of Motion",
                              "Muscle Strength",
                              "Balance/Coordination",
                              "Red Flags",
                              "Contraindications",
                            ].map((domain, index) => (
                              <TableRow key={index}>
                                <TableCell>{domain}</TableCell>
                                <TableCell>
                                  <Input id={`rehab-domain-${index}`} placeholder="Rating/Result" />
                                </TableCell>
                                <TableCell>
                                  <Input id={`rehab-domain-notes-${index}`} placeholder="Notes" />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rehab-clinical-notes">Clinical notes:</Label>
                        <Textarea id="rehab-clinical-notes" placeholder="Additional clinical observations..." />
                      </div>
                    </div>

                    {/* Treatment Goals */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        6) Treatment Goals
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="rehab-short-goals">Short-term goals:</Label>
                        <Textarea id="rehab-short-goals" placeholder="What are the short-term treatment goals?" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rehab-long-goals">Long-term goals:</Label>
                        <Textarea id="rehab-long-goals" placeholder="What are the long-term treatment goals?" />
                      </div>
                    </div>

                    {/* Plan of Care */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        7) Plan of Care (Clinician)
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="rehab-treatment-plan">Treatment plan:</Label>
                        <Textarea id="rehab-treatment-plan" placeholder="Document the treatment plan..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rehab-home-programme">Home programme:</Label>
                        <Textarea id="rehab-home-programme" placeholder="Describe home exercise programme..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rehab-review">Review/retest date:</Label>
                        <Input id="rehab-review" type="date" />
                      </div>
                    </div>

                    {/* Consent */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        8) Consent & Acknowledgement
                      </h3>
                      <div className="space-y-2">
                        {[
                          "I confirm the information provided is accurate to the best of my knowledge.",
                          "I understand rehabilitative care involves physical activity and therapeutic interventions, and outcomes may vary.",
                          "I agree to disclose any changes in my health status during treatment.",
                          "I consent to takehealth recording my assessment data for care planning (confidential and secure).",
                        ].map((consent, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <Checkbox id={`rehab-consent-${index}`} />
                            <Label htmlFor={`rehab-consent-${index}`} className="text-sm cursor-pointer">
                              {consent}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="rehab-clientSig">Client Signature</Label>
                          <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg h-20 flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">Sign here</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rehab-therapistSig">Therapist/Practitioner Signature</Label>
                          <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg h-20 flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">Sign here</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline">Save as Draft</Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90">Submit Rehab Record</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Spa, Massage & Skin Care Tab */}
            <TabsContent value="spa" className="space-y-6">
              <IntakeHero 
                title="Spa & Massage Services"
                subtitle="Relax. Recover. Glow."
                icon={Sparkles}
                image={massageHero}
              />
              <Card>
                <CardHeader className="bg-primary/5 border-b">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    <CardTitle>Spa, Massage & Skin Care Assessment Form</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Intake • Contraindications Screening • Service Selection • Practitioner Notes
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Relax. Recover. Glow.
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  <form className="space-y-8">
                    {/* Client & Booking Details */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        1) Client & Booking Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="spa-date">Assessment Date</Label>
                          <Input id="spa-date" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spa-assessmentId">Assessment ID</Label>
                          <Input id="spa-assessmentId" value="TH-SPA-0002" readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spa-fullName">Full Name</Label>
                          <Input id="spa-fullName" placeholder="Enter full name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spa-phone">Phone/WhatsApp</Label>
                          <Input id="spa-phone" type="tel" placeholder="+234..." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spa-email">Email</Label>
                          <Input id="spa-email" type="email" placeholder="email@example.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spa-dob">D.O.B/Age</Label>
                          <Input id="spa-dob" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spa-nin">NIN</Label>
                          <Input id="spa-nin" placeholder="National ID Number" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spa-marital">Marital Status</Label>
                          <Select>
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
                        <div className="space-y-2">
                          <Label htmlFor="spa-gender">Gender</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spa-contact">Preferred Contact</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select preference" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="phone">Phone/WhatsApp</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="sms">SMS</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spa-bookedDate">Booked Date/Time</Label>
                          <Input id="spa-bookedDate" type="datetime-local" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spa-practitioner">Practitioner</Label>
                          <Input id="spa-practitioner" placeholder="Practitioner name" />
                        </div>
                      </div>
                    </div>

                    {/* Goals & Preferences */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        2) Goals & Preferences
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {[
                          "Relaxation/stress relief",
                          "Muscle tension relief",
                          "Pain relief (neck/back/shoulder)",
                          "Sports recovery / post-training recovery",
                          "Improve sleep",
                          "Skin glow/hydration",
                          "Acne & congestion support",
                          "Pigmentation / uneven tone support",
                          "Anti-ageing / fine lines support",
                        ].map((goal, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox id={`spa-goal-${index}`} />
                            <Label htmlFor={`spa-goal-${index}`} className="text-sm cursor-pointer">
                              {goal}
                            </Label>
                          </div>
                        ))}
                        <div className="flex items-center space-x-2">
                          <Checkbox id="spa-goal-other" />
                          <Label htmlFor="spa-goal-other" className="text-sm cursor-pointer">Other (specify)</Label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="spa-tension">Areas of tension/pain:</Label>
                        <Textarea id="spa-tension" placeholder="Describe areas of tension or pain..." />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="spa-pressure">Pressure preference</Label>
                          <Input id="spa-pressure" placeholder="Light, Medium, Firm" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spa-scent">Scent preference (aromatherapy)</Label>
                          <Input id="spa-scent" placeholder="Lavender, Eucalyptus, etc." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spa-avoid">Any areas to avoid?</Label>
                          <Input id="spa-avoid" placeholder="Areas to avoid during treatment" />
                        </div>
                      </div>
                    </div>

                    {/* Health Screening */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        3) Health Screening (Massage/Spa Contraindications)
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Tick all that apply. Some conditions may require modification or medical clearance.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {[
                          "Pregnant / recently postpartum",
                          "High blood pressure/heart condition",
                          "Diabetes",
                          "History of blood clots (DVT) / on blood thinners",
                          "Recent surgery (within 6 months)",
                          "Open wounds/burns / recent skin infection",
                          "Severe varicose veins/swelling",
                          "Fever/infection/flu symptoms",
                          "Epilepsy/seizures",
                          "Cancer treatment or recent diagnosis",
                          "Fracture / acute injury",
                          "Allergies (oils/lotions/latex)",
                          "Asthma or strong sensitivity to scents",
                          "Skin conditions (eczema, psoriasis)",
                        ].map((condition, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox id={`spa-health-${index}`} />
                            <Label htmlFor={`spa-health-${index}`} className="text-sm cursor-pointer">
                              {condition}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="spa-health-other" />
                        <Label htmlFor="spa-health-other" className="text-sm cursor-pointer">Other medical condition (specify)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="spa-health-none" />
                        <Label htmlFor="spa-health-none" className="text-sm cursor-pointer">None of the above</Label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="spa-health-details">If selected above, details:</Label>
                          <Textarea id="spa-health-details" placeholder="Provide details..." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spa-medications">Current medications</Label>
                          <Textarea id="spa-medications" placeholder="List medications..." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spa-pain">Pain level today (0–10)</Label>
                          <Input id="spa-pain" type="number" min="0" max="10" placeholder="0-10" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spa-hydration">Hydration today</Label>
                          <Input id="spa-hydration" placeholder="Hydration status" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spa-injuries">Any recent injuries?</Label>
                          <Input id="spa-injuries" placeholder="Recent injuries..." />
                        </div>
                      </div>
                    </div>

                    {/* Skin Profile */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        4) Skin Profile (For Skin Care Treatments)
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Select your skin type and concerns to help us customise treatments safely.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {["Normal", "Dry", "Oily", "Combination", "Sensitive", "Not sure"].map((type, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox id={`spa-skinType-${index}`} />
                            <Label htmlFor={`spa-skinType-${index}`} className="text-sm cursor-pointer">Skin type: {type}</Label>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                        {[
                          "Acne/breakouts",
                          "Blackheads/whiteheads",
                          "Hyperpigmentation/dark spots",
                          "Uneven tone/dullness",
                          "Fine lines/wrinkles",
                          "Texture/roughness",
                          "Dryness/dehydration",
                          "Oily shine/large pores",
                          "Under-eye concerns",
                        ].map((concern, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox id={`spa-concern-${index}`} />
                            <Label htmlFor={`spa-concern-${index}`} className="text-sm cursor-pointer">
                              {concern}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Checkbox id="spa-concern-other" />
                        <Label htmlFor="spa-concern-other" className="text-sm cursor-pointer">Other (specify)</Label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="spa-routine">Current skincare routine/products:</Label>
                          <Textarea id="spa-routine" placeholder="List current products..." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spa-allergies">Known allergies/irritants:</Label>
                          <Textarea id="spa-allergies" placeholder="List known allergies..." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spa-recent-treatments">Recent skin treatments (last 4 weeks):</Label>
                          <Input id="spa-recent-treatments" placeholder="Recent treatments..." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spa-retinoids">Do you use retinoids/Retin-A?</Label>
                          <Input id="spa-retinoids" placeholder="Yes/No/Details" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spa-waxing">Recent waxing/laser (last 7 days)?</Label>
                          <Input id="spa-waxing" placeholder="Yes/No" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spa-sunburn">Sunburn in the last 7 days?</Label>
                          <Input id="spa-sunburn" placeholder="Yes/No" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spa-spf">SPF use</Label>
                          <Input id="spa-spf" placeholder="SPF frequency..." />
                        </div>
                      </div>
                    </div>

                    {/* Skin Care Safety Screening */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        5) Skin Care Safety Screening (For Peels/Advanced Treatments)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {[
                          "Currently pregnant or breastfeeding (for certain treatments)",
                          "History of keloids/poor wound healing",
                          "Active cold sores/herpes on face",
                          "Active skin infection or severe acne flare",
                          "Use of isotretinoin/Accutane (last 6 months)",
                          "Known photosensitivity / on photosensitising medication",
                          "Recent chemical peel/microneedling/laser (last 4 weeks)",
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox id={`spa-safety-${index}`} />
                            <Label htmlFor={`spa-safety-${index}`} className="text-sm cursor-pointer">
                              {item}
                            </Label>
                          </div>
                        ))}
                        <div className="flex items-center space-x-2">
                          <Checkbox id="spa-safety-none" />
                          <Label htmlFor="spa-safety-none" className="text-sm cursor-pointer">None of the above</Label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="spa-safety-details">If any are selected, provide details:</Label>
                        <Textarea id="spa-safety-details" placeholder="Provide details..." />
                      </div>
                    </div>

                    {/* Service Selection */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        6) Service Selection (Tick all that apply)
                      </h3>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium mt-4">Massage Therapy</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {[
                            "Swedish Massage (60 mins) – ₦25,000",
                            "Deep Tissue Massage (60 mins) – ₦30,000",
                            "Sports Massage (60 mins) – ₦35,000",
                            "Hot Stone Massage (75 mins) – ₦40,000",
                            "Aromatherapy Massage (60 mins) – ₦30,000",
                          ].map((service, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Checkbox id={`spa-massage-${index}`} />
                              <Label htmlFor={`spa-massage-${index}`} className="text-sm cursor-pointer">
                                {service}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium mt-4">Spa & Body Care</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {[
                            "Body Scrub & Polish (45 mins) – ₦20,000",
                            "Body Wrap (Detox / Hydrating) (60 mins) – ₦30,000",
                            "Signature Relaxation Package (2 hours) – ₦55,000",
                          ].map((service, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Checkbox id={`spa-spa-${index}`} />
                              <Label htmlFor={`spa-spa-${index}`} className="text-sm cursor-pointer">
                                {service}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium mt-4">Skin Care Services</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {[
                            "Express Facial (30 mins) – ₦20,000",
                            "Signature Facial (60 mins) – ₦35,000",
                            "Advanced / Anti-Ageing Facial – ₦50,000",
                            "Chemical Peel: Light – ₦40,000",
                            "Chemical Peel: Medium – ₦65,000",
                            "Chemical Peel: Advanced/Medical-Grade – ₦90,000",
                            "Dermatology Consultation: Initial – ₦30,000",
                            "Dermatology Consultation: Follow-up – ₦20,000",
                            "Corrective/Advanced Treatment Session – ₦60,000–₦120,000",
                            "Lifestyle & Skin Health Coaching (1:1) – ₦25,000",
                          ].map((service, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Checkbox id={`spa-skin-${index}`} />
                              <Label htmlFor={`spa-skin-${index}`} className="text-sm cursor-pointer">
                                {service}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Practitioner Notes */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        7) Practitioner Notes (Clinical Use)
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        For massage: body map/focus areas. For skin care: skin analysis, products used, and reaction monitoring.
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Massage Focus Areas:</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Region</TableHead>
                              <TableHead>Tension Level (Low/Med/High)</TableHead>
                              <TableHead>Notes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {["Neck", "Shoulders/Upper back", "Lower back", "Hips/Glutes", "Legs/Calves"].map((region, index) => (
                              <TableRow key={index}>
                                <TableCell>{region}</TableCell>
                                <TableCell>
                                  <Input id={`spa-tension-${index}`} placeholder="Level" />
                                </TableCell>
                                <TableCell>
                                  <Input id={`spa-region-notes-${index}`} placeholder="Notes" />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <div className="space-y-2 mt-4">
                        <h4 className="font-medium">Skin Analysis & Treatment Record:</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item</TableHead>
                              <TableHead>Result</TableHead>
                              <TableHead>Notes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {["Skin type", "Primary concerns", "Treatment delivered", "Products used", "Reaction/irritation"].map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item}</TableCell>
                                <TableCell>
                                  <Input id={`spa-skin-result-${index}`} placeholder="Result" />
                                </TableCell>
                                <TableCell>
                                  <Input id={`spa-skin-notes-${index}`} placeholder="Notes" />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="spa-outcome">Session outcome & recommendations:</Label>
                        <Textarea id="spa-outcome" placeholder="Document session outcome and recommendations..." />
                      </div>
                    </div>

                    {/* Aftercare & Next Visit */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        8) Aftercare & Next Visit
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="spa-aftercare">Aftercare instructions given:</Label>
                        <Textarea id="spa-aftercare" placeholder="Document aftercare instructions..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="spa-next">Suggested next appointment:</Label>
                        <Input id="spa-next" type="date" />
                      </div>
                    </div>

                    {/* Consent */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-foreground border-b pb-2">
                        9) Consent & Declaration
                      </h3>
                      <div className="space-y-2">
                        {[
                          "I confirm the information provided is accurate to the best of my knowledge.",
                          "I understand spa/massage/skin care treatments are for wellness and do not replace medical care.",
                          "I understand some skin treatments (e.g., peels) may cause temporary redness, dryness, or sensitivity.",
                          "I agree to communicate discomfort and request adjustments during treatment.",
                          "I consent to Takehealth recording my assessment information for service delivery (confidential and secure).",
                        ].map((consent, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <Checkbox id={`spa-consent-${index}`} />
                            <Label htmlFor={`spa-consent-${index}`} className="text-sm cursor-pointer">
                              {consent}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="spa-clientSig">Client Signature</Label>
                          <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg h-20 flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">Sign here</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spa-practitionerSig">Practitioner Signature</Label>
                          <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg h-20 flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">Sign here</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline">Save as Draft</Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90">Submit Spa Record</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Client Records Table */}
          <Card className="mt-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Client Records</CardTitle>
                <Button variant="outline" size="sm">View All Records</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>TH-CNS-0001</TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell>Counselling</TableCell>
                    <TableCell>2024-01-15</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>TH-DEN-0001</TableCell>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>Dental Care</TableCell>
                    <TableCell>2024-01-14</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        New
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>TH-ESC-0001</TableCell>
                    <TableCell>Mike Johnson</TableCell>
                    <TableCell>Elite Sport</TableCell>
                    <TableCell>2024-01-13</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Follow-up
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
