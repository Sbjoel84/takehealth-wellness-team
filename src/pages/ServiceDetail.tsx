import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
 import { CheckCircle2, ArrowRight, ArrowLeft, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { serviceDetails } from "@/data/serviceDetails";

const ServiceDetail = () => {
  const { serviceSlug } = useParams<{ serviceSlug: string }>();
   const service = serviceSlug ? serviceDetails[serviceSlug] : null;

  if (!service) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              Service Not Found
            </h1>
            <Button asChild>
              <Link to="/services">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Services
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Link>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
              {service.title}
            </h1>
             <p className="text-xl md:text-2xl text-primary-foreground/90 font-medium">{service.tagline}</p>
          </motion.div>
        </div>
      </section>

       {/* Hero Description */}
       <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
           <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto text-center leading-relaxed"
           >
             {service.heroDescription}
           </motion.p>
         </div>
       </section>

       {/* Content Sections */}
       <section className="section-padding">
         <div className="container mx-auto px-4 md:px-8">
           <div className="max-w-4xl mx-auto space-y-12">
             {service.sections.map((section, index) => (
               <motion.div
                 key={section.title}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.1 }}
               >
                 <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
                   {section.title}
                 </h2>
                 {section.content && (
                   <p className="text-muted-foreground mb-4 leading-relaxed">
                     {section.content}
                   </p>
                 )}
                 {section.bullets && section.bullets.length > 0 && (
                   <ul className="space-y-3">
                     {section.bullets.map((bullet, bulletIndex) => (
                       <li key={bulletIndex} className="flex items-start gap-3">
                         <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                         <span className="text-foreground">{bullet}</span>
                       </li>
                     ))}
                   </ul>
                 )}
               </motion.div>
             ))}
           </div>
         </div>
       </section>

       {/* Service Categories / Pricing Tables */}
       {service.serviceCategories && service.serviceCategories.length > 0 && (
         <section className="section-padding bg-muted/30">
           <div className="container mx-auto px-4 md:px-8">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-center mb-12"
             >
               <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                 Our Services & Fees
               </h2>
               <p className="text-muted-foreground max-w-2xl mx-auto">
                 Transparent pricing for all our services
               </p>
             </motion.div>

             <div className="space-y-8">
               {service.serviceCategories.map((category, catIndex) => (
                 <motion.div
                   key={category.title}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: catIndex * 0.1 }}
                 >
                   <Card>
                     <CardHeader className="bg-primary/5">
                       <CardTitle className="font-serif text-xl">{category.title}</CardTitle>
                     </CardHeader>
                     <CardContent className="p-0">
                       <div className="divide-y divide-border">
                         {category.items.map((item, itemIndex) => (
                           <div
                             key={itemIndex}
                             className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 hover:bg-muted/50 transition-colors"
                           >
                             <div className="flex-1">
                               <h4 className="font-semibold text-foreground">{item.name}</h4>
                               {item.description && (
                                 <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                               )}
                               {item.duration && (
                                 <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                   <Clock className="w-3 h-3" />
                                   <span>{item.duration}</span>
                                 </div>
                               )}
                             </div>
                             <div className="text-right">
                               <span className="font-bold text-primary text-lg">{item.price}</span>
                               {item.period && (
                                 <span className="text-sm text-muted-foreground ml-1">{item.period}</span>
                               )}
                             </div>
                           </div>
                         ))}
                       </div>
                     </CardContent>
                   </Card>
                 </motion.div>
               ))}
             </div>
           </div>
         </section>
       )}

       {/* Membership/Pricing Tiers */}
       {service.pricingTiers && service.pricingTiers.length > 0 && (
         <section className="section-padding">
           <div className="container mx-auto px-4 md:px-8">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-center mb-12"
             >
               <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                 Membership Packages
               </h2>
               <p className="text-muted-foreground max-w-2xl mx-auto">
                 Choose the plan that fits your lifestyle and goals
               </p>
            </motion.div>

             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
               {service.pricingTiers.map((tier, index) => (
                 <motion.div
                   key={tier.name}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: index * 0.1 }}
                 >
                   <Card className={`h-full flex flex-col ${tier.highlighted ? 'border-primary border-2 shadow-lg relative' : ''}`}>
                     {tier.highlighted && (
                       <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                         <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                           <Star className="w-3 h-3" /> Most Popular
                         </span>
                       </div>
                     )}
                     <CardHeader className="text-center pb-4">
                       <CardTitle className="font-serif text-xl mb-2">{tier.name}</CardTitle>
                       <div className="flex items-baseline justify-center gap-1">
                         <span className="text-3xl md:text-4xl font-bold text-primary">{tier.price}</span>
                         {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                       </div>
                       {tier.description && (
                         <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
                       )}
                     </CardHeader>
                     <CardContent className="flex-1 flex flex-col">
                       <ul className="space-y-3 flex-1">
                         {tier.features.map((feature, featureIndex) => (
                           <li key={featureIndex} className="flex items-start gap-2">
                             <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                             <span className="text-sm text-foreground">{feature}</span>
                           </li>
                         ))}
                       </ul>
                       <Button 
                         className="w-full mt-6" 
                         variant={tier.highlighted ? "default" : "outline"}
                         asChild
                       >
                         <Link to="/contact">{tier.cta}</Link>
                       </Button>
                     </CardContent>
                   </Card>
                 </motion.div>
               ))}
             </div>
          </div>
         </section>
       )}

       {/* Additional Info */}
       {service.additionalInfo && service.additionalInfo.length > 0 && (
         <section className="section-padding bg-muted/30">
           <div className="container mx-auto px-4 md:px-8">
             <div className="max-w-4xl mx-auto space-y-8">
               {service.additionalInfo.map((info, index) => (
                 <motion.div
                   key={info.title}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: index * 0.1 }}
                   className="bg-background rounded-xl p-6 md:p-8 shadow-sm"
                 >
                   <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                     {info.title}
                   </h3>
                   {info.content && (
                     <p className="text-muted-foreground mb-4">{info.content}</p>
                   )}
                   {info.bullets && info.bullets.length > 0 && (
                     <ul className="space-y-2">
                       {info.bullets.map((bullet, bulletIndex) => (
                         <li key={bulletIndex} className="flex items-start gap-2">
                           <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                           <span className="text-foreground text-sm">{bullet}</span>
                         </li>
                       ))}
                     </ul>
                   )}
                 </motion.div>
               ))}
             </div>
           </div>
         </section>
       )}

       {/* CTA Section */}
       <section className="section-padding hero-gradient text-primary-foreground">
         <div className="container mx-auto px-4 md:px-8 text-center">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="max-w-3xl mx-auto"
           >
             <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
               {service.cta.text}
             </p>
             <div className="flex flex-wrap justify-center gap-4">
               {service.cta.buttons.map((button, index) => (
                 <Button
                   key={index}
                   size="lg"
                   variant={button.primary ? "secondary" : "outline"}
                   className={button.primary ? "" : "border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"}
                   asChild
                 >
                   <Link to={button.href}>
                     {button.label}
                     {button.primary && <ArrowRight className="ml-2 w-5 h-5" />}
                   </Link>
                 </Button>
               ))}
             </div>
           </motion.div>
         </div>
       </section>
    </Layout>
  );
};

export default ServiceDetail;
