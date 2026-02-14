 import { Layout } from "@/components/layout/Layout";
 import { motion } from "framer-motion";
 import { SectionHeader } from "@/components/ui/SectionHeader";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Link } from "react-router-dom";
 import {
   Building2,
   Handshake,
   Globe,
   Heart,
   Users,
   ArrowRight,
   CheckCircle2,
 } from "lucide-react";
 
 const partnershipTypes = [
   {
     icon: Building2,
     title: "Corporate Wellness Partners",
     description: "Partner with us to bring comprehensive wellness programs to your employees. Our corporate wellness solutions include on-site fitness programs, health screenings, nutrition workshops, and mental health support.",
     benefits: [
       "Customized employee wellness packages",
       "On-site health assessments and screenings",
       "Group fitness classes and training sessions",
       "Mental health and stress management workshops",
       "Discounted membership rates for employees"
     ]
   },
   {
     icon: Handshake,
     title: "Healthcare Providers",
     description: "Join our network of healthcare professionals and institutions. We collaborate with hospitals, clinics, and independent practitioners to provide seamless patient care and referrals.",
     benefits: [
       "Integrated referral systems",
       "Collaborative care protocols",
       "Shared patient management platform",
       "Professional development opportunities",
       "Joint health campaigns and initiatives"
     ]
   },
   {
     icon: Globe,
     title: "Technology Partners",
     description: "Collaborate with us on digital health solutions. We're seeking technology partners to enhance our telehealth, patient management, and wellness tracking platforms.",
     benefits: [
       "API integration opportunities",
       "Joint product development",
       "Data sharing agreements (compliant)",
       "Co-branded solutions",
       "Innovation labs and pilot programs"
     ]
   },
   {
     icon: Heart,
     title: "NGOs & Government",
     description: "Partner with us on public health initiatives and community wellness programs. We work with non-profits and government agencies to extend healthcare access to underserved populations.",
     benefits: [
       "Community health outreach programs",
       "Grant-funded wellness initiatives",
       "Health education campaigns",
       "Mobile health clinics",
       "Population health management"
     ]
   },
   {
     icon: Users,
     title: "Channel & Distribution Partners",
     description: "Become a distributor or reseller of our wellness products and services. We offer opportunities for businesses to expand their portfolio with our proven health solutions.",
     benefits: [
       "Exclusive territory agreements",
       "Marketing and sales support",
       "Training and certification programs",
       "Competitive commission structures",
       "Product and service bundling options"
     ]
   }
 ];
 
 const partnershipProcess = [
   {
     step: "01",
     title: "Initial Inquiry",
     description: "Submit your partnership inquiry through our contact form or reach out directly to our partnerships team."
   },
   {
     step: "02",
     title: "Discovery Call",
     description: "We'll schedule a call to understand your goals, capabilities, and how we might work together."
   },
   {
     step: "03",
     title: "Proposal & Alignment",
     description: "Our team develops a customized partnership proposal aligned with mutual objectives."
   },
   {
     step: "04",
     title: "Agreement & Onboarding",
     description: "Finalize partnership terms and begin the onboarding process with dedicated support."
   },
   {
     step: "05",
     title: "Launch & Growth",
     description: "Activate the partnership and work together for continuous improvement and growth."
   }
 ];
 
 const Partners = () => {
   return (
     <Layout>
       {/* Hero Section */}
       <section className="hero-gradient text-primary-foreground py-24 lg:py-32">
         <div className="container mx-auto px-4 md:px-8">
           <div className="max-w-3xl">
             <motion.span
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-block bg-primary-foreground/20 px-4 py-2 rounded-full text-sm font-medium mb-4"
             >
               Partnerships
             </motion.span>
             <motion.h1
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
             >
               Partner With Us
             </motion.h1>
             <motion.p
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="text-xl text-primary-foreground/90"
             >
               Join our ecosystem of wellness partners. Together, we can create healthier communities and transform lives.
             </motion.p>
           </div>
         </div>
       </section>
 
       {/* Why Partner Section */}
       <section className="section-padding">
         <div className="container mx-auto px-4 md:px-8">
           <div className="max-w-3xl mx-auto text-center mb-16">
             <SectionHeader
               label="Why Partner"
               title="Build a Healthier World Together"
               description="At takehealth Global Ltd, we believe that meaningful partnerships amplify impact. Whether you're a corporation, healthcare provider, technology company, or non-profit, there's a place for you in our wellness ecosystem."
             />
           </div>
 
           <div className="grid gap-8">
             {partnershipTypes.map((type, index) => (
               <motion.div
                 key={type.title}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.1 }}
               >
                 <Card className="overflow-hidden">
                   <div className="md:flex">
                     <div className="md:w-1/3 bg-primary/5 p-8 flex flex-col justify-center">
                       <type.icon className="w-12 h-12 text-primary mb-4" />
                       <h3 className="font-serif text-2xl font-bold text-foreground">
                         {type.title}
                       </h3>
                     </div>
                     <CardContent className="md:w-2/3 p-8">
                       <p className="text-muted-foreground mb-6">{type.description}</p>
                       <h4 className="font-semibold text-foreground mb-3">Key Benefits:</h4>
                       <ul className="grid sm:grid-cols-2 gap-2">
                         {type.benefits.map((benefit, benefitIndex) => (
                           <li key={benefitIndex} className="flex items-start gap-2">
                             <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                             <span className="text-sm text-foreground">{benefit}</span>
                           </li>
                         ))}
                       </ul>
                     </CardContent>
                   </div>
                 </Card>
               </motion.div>
             ))}
           </div>
         </div>
       </section>
 
       {/* Partnership Process */}
       <section className="section-padding bg-muted/30">
         <div className="container mx-auto px-4 md:px-8">
           <SectionHeader
             label="How It Works"
             title="Partnership Process"
             description="Our streamlined process makes it easy to become a takehealth partner."
           />
 
           <div className="mt-12 grid md:grid-cols-5 gap-6">
             {partnershipProcess.map((step, index) => (
               <motion.div
                 key={step.step}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.1 }}
                 className="relative"
               >
                 <div className="bg-background rounded-xl p-6 h-full shadow-sm">
                   <span className="text-4xl font-bold text-primary/20">{step.step}</span>
                   <h3 className="font-semibold text-foreground mt-2 mb-2">{step.title}</h3>
                   <p className="text-sm text-muted-foreground">{step.description}</p>
                 </div>
                 {index < partnershipProcess.length - 1 && (
                   <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                     <ArrowRight className="w-6 h-6 text-primary/30" />
                   </div>
                 )}
               </motion.div>
             ))}
           </div>
         </div>
       </section>
 
       {/* CTA Section */}
       <section className="section-padding hero-gradient text-primary-foreground">
         <div className="container mx-auto px-4 md:px-8 text-center">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="max-w-3xl mx-auto"
           >
             <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
               Ready to Make an Impact Together?
             </h2>
             <p className="text-xl text-primary-foreground/90 mb-8">
               Let's discuss how a partnership with takehealth can benefit your organization and the communities you serve.
             </p>
             <div className="flex flex-wrap justify-center gap-4">
               <Button size="lg" variant="secondary" asChild>
                 <Link to="/contact">
                   Start Partnership Discussion
                   <ArrowRight className="ml-2 w-5 h-5" />
                 </Link>
               </Button>
               <Button
                 size="lg"
                 variant="outline"
                 className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                 asChild
               >
                 <a href="mailto:hello@takehealthglobal.com">
                   Email Our Team
                 </a>
               </Button>
             </div>
           </motion.div>
         </div>
       </section>
     </Layout>
   );
 };
 
 export default Partners;