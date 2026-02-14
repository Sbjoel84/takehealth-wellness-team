 import { Layout } from "@/components/layout/Layout";
 import { motion } from "framer-motion";
 import { SectionHeader } from "@/components/ui/SectionHeader";
 import { Card, CardContent } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Link } from "react-router-dom";
 import { Calendar, ArrowRight, Tag } from "lucide-react";
 
 const newsItems = [
   {
     date: "February 14, 2026",
     category: "Launch Event",
     title: "Launch and Commissioning of the Kubwa Centre – Walk4Love",
     excerpt: "Join us for the grand opening of our flagship wellness centre in Kubwa. The Walk4Love event celebrates health, love, and community wellness on Valentine's Day.",
     featured: true
   },
   {
     date: "February 2026",
     category: "Health Challenge",
     title: "30-Day Nutritional Healing Challenge Begins",
     excerpt: "Embark on a transformative journey with our 30-Day Nutritional Healing Challenge. 'Food as Medicine. Healing from Within.' Experience the power of evidence-based nutrition.",
     featured: true
   },
   {
     date: "March 2026",
     category: "Community",
     title: "Free Community Wellness Sessions – Virtual and Physical",
     excerpt: "takehealth is giving back to the community with free wellness sessions. Access expert guidance on fitness, nutrition, and mental health at no cost.",
     featured: false
   },
   {
     date: "April 2026",
     category: "Partnerships",
     title: "Launch of Our Corporate Wellness Partnerships",
     excerpt: "We're excited to announce our new corporate wellness program, designed to bring comprehensive health solutions to organizations across Nigeria.",
     featured: false
   }
 ];
 
 const pressReleases = [
   {
     date: "January 2026",
     title: "takehealth Global Ltd Announces Comprehensive Wellness Ecosystem",
     excerpt: "New integrated platform combines fitness, healthcare, and digital wellness solutions."
   },
   {
     date: "December 2025",
     title: "Health360+ Program: Redefining Holistic Wellness",
     excerpt: "Revolutionary program integrates physical fitness, mental health, and lifestyle services."
   },
   {
     date: "November 2025",
     title: "takehealth Partners with Leading Healthcare Institutions",
     excerpt: "Strategic partnerships expand access to quality wellness services across Nigeria."
   }
 ];
 
 const mediaHighlights = [
   {
     outlet: "Business Day Nigeria",
     title: "The Future of Wellness: How takehealth is Changing Healthcare",
     date: "January 2026"
   },
   {
     outlet: "Guardian Life",
     title: "Integrated Wellness: A New Approach to Health in Nigeria",
     date: "December 2025"
   },
   {
     outlet: "TechCabal",
     title: "Digital Health Startups Transforming Healthcare Delivery",
     date: "November 2025"
   }
 ];
 
 const Newsroom = () => {
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
               Media
             </motion.span>
             <motion.h1
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
             >
               Newsroom
             </motion.h1>
             <motion.p
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="text-xl text-primary-foreground/90"
             >
               Stay updated with the latest news, events, press releases, and media coverage from takehealth Global Ltd.
             </motion.p>
           </div>
         </div>
       </section>
 
       {/* News & Events */}
       <section className="section-padding">
         <div className="container mx-auto px-4 md:px-8">
           <SectionHeader
             label="Stay Connected. Stay Inspired."
             title="News & Events"
             description="Discover what's happening at takehealth and join us in our wellness journey."
           />
 
           <div className="mt-12 grid md:grid-cols-2 gap-8">
             {newsItems.map((item, index) => (
               <motion.div
                 key={item.title}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.1 }}
               >
                 <Card className={`h-full ${item.featured ? 'border-primary/50 bg-primary/5' : ''}`}>
                   <CardContent className="p-6">
                     <div className="flex items-center gap-4 mb-4">
                       <span className="flex items-center gap-1 text-sm text-muted-foreground">
                         <Calendar className="w-4 h-4" />
                         {item.date}
                       </span>
                       <span className="flex items-center gap-1 text-sm text-primary">
                         <Tag className="w-4 h-4" />
                         {item.category}
                       </span>
                     </div>
                     <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                       {item.title}
                     </h3>
                     <p className="text-muted-foreground mb-4">{item.excerpt}</p>
                     {item.featured && (
                       <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                         Featured Event
                       </span>
                     )}
                   </CardContent>
                 </Card>
               </motion.div>
             ))}
           </div>
         </div>
       </section>
 
       {/* Press Releases */}
       <section className="section-padding bg-muted/30">
         <div className="container mx-auto px-4 md:px-8">
           <SectionHeader
             label="Official Statements"
             title="Press Releases"
             description="Official announcements and communications from takehealth Global Ltd."
           />
 
           <div className="mt-12 space-y-6">
             {pressReleases.map((release, index) => (
               <motion.div
                 key={release.title}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.1 }}
                 className="bg-background rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center gap-4"
               >
                 <div className="md:w-32 flex-shrink-0">
                   <span className="text-sm text-muted-foreground">{release.date}</span>
                 </div>
                 <div className="flex-1">
                   <h3 className="font-semibold text-foreground mb-1">{release.title}</h3>
                   <p className="text-sm text-muted-foreground">{release.excerpt}</p>
                 </div>
                 <Button variant="ghost" size="sm" className="self-start md:self-center">
                   Read More <ArrowRight className="ml-2 w-4 h-4" />
                 </Button>
               </motion.div>
             ))}
           </div>
         </div>
       </section>
 
       {/* Media Coverage */}
       <section className="section-padding">
         <div className="container mx-auto px-4 md:px-8">
           <SectionHeader
             label="In The Media"
             title="Media Coverage"
             description="See what the media is saying about takehealth Global Ltd."
           />
 
           <div className="mt-12 grid md:grid-cols-3 gap-6">
             {mediaHighlights.map((media, index) => (
               <motion.div
                 key={media.title}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.1 }}
               >
                 <Card className="h-full">
                   <CardContent className="p-6">
                     <span className="text-sm font-semibold text-primary">{media.outlet}</span>
                     <h3 className="font-serif text-lg font-bold text-foreground mt-2 mb-3">
                       {media.title}
                     </h3>
                     <span className="text-sm text-muted-foreground">{media.date}</span>
                   </CardContent>
                 </Card>
               </motion.div>
             ))}
           </div>
         </div>
       </section>
 
       {/* Media Contact */}
       <section className="section-padding bg-muted/30">
         <div className="container mx-auto px-4 md:px-8">
           <div className="max-w-3xl mx-auto text-center">
             <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
               Media Inquiries
             </h2>
             <p className="text-muted-foreground mb-6">
               For press inquiries, interview requests, or media partnerships, please contact our communications team.
             </p>
             <div className="bg-background rounded-xl p-8 shadow-sm">
               <p className="font-semibold text-foreground mb-2">Press Contact</p>
               <p className="text-muted-foreground">Email: hello@takehealthglobal.com</p>
               <p className="text-muted-foreground">Phone: +234 901 358 9375</p>
             </div>
           </div>
         </div>
       </section>
 
       {/* Newsletter CTA */}
       <section className="section-padding hero-gradient text-primary-foreground">
         <div className="container mx-auto px-4 md:px-8 text-center">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="max-w-2xl mx-auto"
           >
             <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
               Stay Connected. Stay Inspired.
             </h2>
             <p className="text-xl text-primary-foreground/90 mb-8">
               Be the first to know about workshops, special offers, and wellness trends.
             </p>
             <div className="flex flex-wrap justify-center gap-4">
               <Button size="lg" variant="secondary" asChild>
                 <Link to="/contact">
                   Subscribe to Our Newsletter
                 </Link>
               </Button>
               <Button
                 size="lg"
                 variant="outline"
                 className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
               >
                 View Full Calendar
               </Button>
             </div>
           </motion.div>
         </div>
       </section>
     </Layout>
   );
 };
 
 export default Newsroom;