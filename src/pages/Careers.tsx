 import { Layout } from "@/components/layout/Layout";
 import { motion } from "framer-motion";
 import { SectionHeader } from "@/components/ui/SectionHeader";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent } from "@/components/ui/card";
 import { Link } from "react-router-dom";
 import {
   Heart,
   Users,
   Lightbulb,
   TrendingUp,
   Award,
   Clock,
   MapPin,
   ArrowRight,
   Briefcase,
 } from "lucide-react";
 
 const coreValues = [
   {
     icon: Heart,
     title: "Compassion",
     description: "We care deeply about the well-being of our clients, colleagues, and communities."
   },
   {
     icon: Lightbulb,
     title: "Innovation",
     description: "We embrace new ideas and technologies to deliver better wellness outcomes."
   },
   {
     icon: Users,
     title: "Collaboration",
     description: "We believe in the power of teamwork and interdisciplinary approaches."
   },
   {
     icon: TrendingUp,
     title: "Excellence",
     description: "We strive for the highest standards in everything we do."
   }
 ];
 
 const benefits = [
   "Competitive salary and performance bonuses",
   "Comprehensive health insurance",
   "Free access to all takehealth services",
   "Professional development and training",
   "Flexible work arrangements",
   "Paid time off and wellness days",
   "Career growth opportunities",
   "Supportive and inclusive work environment"
 ];
 
 const openPositions = [
   {
     title: "Senior Fitness Coach",
     department: "Gym Services",
     type: "Full-time",
     location: "Kubwa, FCT",
     description: "Lead fitness programs and coach clients toward their health goals."
   },
   {
     title: "Licensed Massage Therapist",
     department: "Spa & Wellness",
     type: "Full-time",
     location: "Kubwa, FCT",
     description: "Provide therapeutic massage services to our growing client base."
   },
   {
     title: "Clinical Psychologist",
     department: "Counselling Services",
     type: "Full-time",
     location: "Kubwa, FCT",
     description: "Deliver evidence-based therapy and mental health support."
   },
   {
     title: "Registered Dietitian/Nutritionist",
     department: "Nutritional Care",
     type: "Full-time",
     location: "Kubwa, FCT",
     description: "Create personalized nutrition plans and conduct wellness workshops."
   },
   {
     title: "Dental Hygienist",
     department: "Dental Care",
     type: "Full-time",
     location: "Kubwa, FCT",
     description: "Provide preventive dental care and patient education."
   },
   {
     title: "Physiotherapist",
     department: "Rehabilitative Care",
     type: "Full-time",
     location: "Kubwa, FCT",
     description: "Help clients recover from injuries and improve mobility."
   },
   {
     title: "Client Experience Specialist",
     department: "Operations",
     type: "Full-time",
     location: "Kubwa, FCT",
     description: "Ensure exceptional service delivery and client satisfaction."
   },
   {
     title: "Digital Marketing Specialist",
     department: "Marketing",
     type: "Full-time",
     location: "Kubwa, FCT / Remote",
     description: "Drive our digital presence and wellness brand awareness."
   }
 ];
 
 const Careers = () => {
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
               Join Our Team
             </motion.span>
             <motion.h1
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
             >
               Careers at takehealth
             </motion.h1>
             <motion.p
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="text-xl text-primary-foreground/90"
             >
               Join a passionate team dedicated to transforming lives through holistic wellness. Build your career while making a meaningful impact on health and well-being.
             </motion.p>
           </div>
         </div>
       </section>
 
       {/* Culture Section */}
       <section className="section-padding">
         <div className="container mx-auto px-4 md:px-8">
           <div className="grid lg:grid-cols-2 gap-12 items-center">
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
             >
               <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium mb-4">
                 Our Culture
               </span>
               <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                 Where Passion Meets Purpose
               </h2>
               <p className="text-muted-foreground mb-6 leading-relaxed">
                 At takehealth Global Ltd, we don't just offer jobs—we offer opportunities to be part of something transformative. Our team is united by a shared belief that everyone deserves access to holistic wellness care.
               </p>
               <p className="text-muted-foreground mb-6 leading-relaxed">
                 We foster a culture of continuous learning, innovation, and mutual respect. Whether you're a seasoned professional or just starting your career, you'll find mentorship, growth opportunities, and a supportive community here.
               </p>
               <p className="text-muted-foreground leading-relaxed">
                 Our diverse, multidisciplinary team includes fitness professionals, therapists, healthcare practitioners, technologists, and business experts—all working together toward a common goal: helping people move better, feel better, and live fully.
               </p>
             </motion.div>
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="grid grid-cols-2 gap-6"
             >
               {coreValues.map((value, index) => (
                 <div
                   key={value.title}
                   className="bg-muted/30 rounded-xl p-6"
                 >
                   <value.icon className="w-10 h-10 text-primary mb-4" />
                   <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                   <p className="text-sm text-muted-foreground">{value.description}</p>
                 </div>
               ))}
             </motion.div>
           </div>
         </div>
       </section>
 
       {/* Benefits Section */}
       <section className="section-padding bg-muted/30">
         <div className="container mx-auto px-4 md:px-8">
           <SectionHeader
             label="Why Join Us"
             title="Benefits & Perks"
             description="We invest in our team members' well-being because we practice what we preach."
           />
 
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
           >
             {benefits.map((benefit, index) => (
               <div
                 key={index}
                 className="flex items-center gap-3 bg-background rounded-lg p-4"
               >
                 <Award className="w-5 h-5 text-primary flex-shrink-0" />
                 <span className="text-foreground text-sm">{benefit}</span>
               </div>
             ))}
           </motion.div>
         </div>
       </section>
 
       {/* Open Positions */}
       <section className="section-padding">
         <div className="container mx-auto px-4 md:px-8">
           <SectionHeader
             label="Opportunities"
             title="Open Positions"
             description="Explore current opportunities to join the takehealth team."
           />
 
           <div className="mt-12 space-y-4">
             {openPositions.map((position, index) => (
               <motion.div
                 key={position.title}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.05 }}
               >
                 <Card className="hover:shadow-md transition-shadow">
                   <CardContent className="p-6">
                     <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                       <div className="flex-1">
                         <div className="flex flex-wrap items-center gap-3 mb-2">
                           <h3 className="font-semibold text-lg text-foreground">
                             {position.title}
                           </h3>
                           <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">
                             {position.department}
                           </span>
                         </div>
                         <p className="text-muted-foreground text-sm mb-3">
                           {position.description}
                         </p>
                         <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                           <span className="flex items-center gap-1">
                             <Briefcase className="w-4 h-4" />
                             {position.type}
                           </span>
                           <span className="flex items-center gap-1">
                             <MapPin className="w-4 h-4" />
                             {position.location}
                           </span>
                         </div>
                       </div>
                       <Button variant="outline" asChild>
                         <Link to="/contact">
                           Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                         </Link>
                       </Button>
                     </div>
                   </CardContent>
                 </Card>
               </motion.div>
             ))}
           </div>
         </div>
       </section>
 
       {/* Application Process */}
       <section className="section-padding bg-muted/30">
         <div className="container mx-auto px-4 md:px-8">
           <SectionHeader
             label="How to Apply"
             title="Application Process"
             description="Our hiring process is designed to be transparent and respectful of your time."
           />
 
           <div className="mt-12 grid md:grid-cols-4 gap-6">
             {[
               { step: "01", title: "Apply", description: "Submit your resume and cover letter through our application form." },
               { step: "02", title: "Review", description: "Our HR team reviews your application within 1-2 weeks." },
               { step: "03", title: "Interview", description: "Selected candidates participate in interviews with hiring managers." },
               { step: "04", title: "Offer", description: "Successful candidates receive an offer to join our team." }
             ].map((item, index) => (
               <motion.div
                 key={item.step}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.1 }}
                 className="bg-background rounded-xl p-6 text-center"
               >
                 <span className="text-4xl font-bold text-primary/20">{item.step}</span>
                 <h3 className="font-semibold text-foreground mt-2 mb-2">{item.title}</h3>
                 <p className="text-sm text-muted-foreground">{item.description}</p>
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
               Ready to Make a Difference?
             </h2>
             <p className="text-xl text-primary-foreground/90 mb-8">
               Join our team and help us build a healthier world. Send your CV and cover letter to start the conversation.
             </p>
             <div className="flex flex-wrap justify-center gap-4">
               <Button size="lg" variant="secondary" asChild>
                 <a href="mailto:careers@takehealthglobal.com">
                   Send Your Application
                   <ArrowRight className="ml-2 w-5 h-5" />
                 </a>
               </Button>
               <Button
                 size="lg"
                 variant="outline"
                 className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                 asChild
               >
                 <Link to="/contact">
                   Contact HR Team
                 </Link>
               </Button>
             </div>
             <p className="mt-6 text-primary-foreground/70 text-sm">
               Email: careers@takehealthglobal.com
             </p>
           </motion.div>
         </div>
       </section>
     </Layout>
   );
 };
 
 export default Careers;