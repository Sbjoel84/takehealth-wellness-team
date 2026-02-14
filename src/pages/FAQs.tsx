 import { Layout } from "@/components/layout/Layout";
 import { motion } from "framer-motion";
 import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
 } from "@/components/ui/accordion";
 import { SectionHeader } from "@/components/ui/SectionHeader";
 
 const faqCategories = [
   {
     category: "General Questions",
     faqs: [
       {
         question: "What is takehealth Global Ltd?",
         answer: "takehealth Global Ltd is a comprehensive wellness and fitness centre offering integrated services including gym facilities, spa & massage therapy, skin care, dental care, elite sport care, rehabilitative care, nutritional care, and counselling. Our mission is to help individuals live healthier lives through connected physical services and secure digital platforms."
       },
       {
         question: "Where are you located?",
         answer: "We are located at B02 - B09 Premium Plaza, Plot 759 Akpabuyo Street, Off Dutse Bwarri Expressway, Kubwa, FCT Nigeria 901101. You can reach us via phone at +234 901 358 9375 or email at hello@takehealthglobal.com."
       },
       {
         question: "What are your operating hours?",
         answer: "Our facility operates from 6:00 AM to 10:00 PM on weekdays, and 7:00 AM to 8:00 PM on weekends. Some services like counselling and consultations may have specific scheduling requirements. Please contact us to confirm availability for specific services."
       },
       {
         question: "Do I need an appointment?",
         answer: "For gym access with a valid membership, no appointment is needed. However, services like massage therapy, skin care treatments, dental care, counselling, and specialised consultations require prior booking. You can book online through our website or contact us directly."
       }
     ]
   },
   {
     category: "Membership & Pricing",
     faqs: [
       {
         question: "What membership packages do you offer?",
         answer: "We offer Basic, Premium, and Elite packages across all our service categories. Each package is designed to meet different needs and budgets. Our Health360+ Program combines multiple services into comprehensive wellness plans starting from ₦260,000/month."
       },
       {
         question: "Can I try before I commit to a membership?",
         answer: "Yes! We offer free consultations for most services and trial sessions for our gym. This allows you to experience our facilities and meet our team before making a commitment."
       },
       {
         question: "What payment methods do you accept?",
         answer: "We accept bank transfers, debit/credit cards, and cash payments. For memberships and packages, we offer flexible payment plans. Please speak with our team about payment options that work best for you."
       },
       {
         question: "Can I pause or cancel my membership?",
         answer: "Yes, memberships can be paused for medical reasons with proper documentation. Cancellation policies vary by package type. Please review your membership agreement or contact our support team for specific terms."
       },
       {
         question: "Are there family or group discounts?",
         answer: "Yes, we offer special rates for families and groups. Our Group & Family Deals provide discounts when you sign up with friends, family, or colleagues. Contact us for customized group pricing."
       }
     ]
   },
   {
     category: "Services",
     faqs: [
       {
         question: "What is the Health360+ Program?",
         answer: "Health360+ is our signature integrated wellness program that combines gym access, nutrition counselling, mental wellness support, recovery services, and more into a single adaptive plan. It includes monthly body assessments, progress reviews, customized fitness and therapy plans, mental health check-ins, and exclusive community events."
       },
       {
         question: "Do you offer virtual consultations?",
         answer: "Yes! We offer online consultations for nutrition, counselling, and certain health assessments via Zoom, WhatsApp, or our takehealth Wellness App. This is ideal for busy professionals or clients who prefer remote access."
       },
       {
         question: "Can services be combined or customized?",
         answer: "Absolutely. Our approach is holistic, and we encourage combining services for optimal results. Our team can create customized wellness plans that integrate fitness, nutrition, therapy, and recovery based on your specific goals."
       },
       {
         question: "Do you provide services for athletes?",
         answer: "Yes, our Elite Sport Care program is specifically designed for professional athletes, competitive amateurs, and serious fitness enthusiasts. It includes performance testing, specialized coaching, sports medicine, and recovery services."
       }
     ]
   },
   {
     category: "Health & Safety",
     faqs: [
       {
         question: "Are your therapists and trainers certified?",
         answer: "Yes, all our professionals are certified and licensed in their respective fields. Our team includes licensed therapists, physiotherapists, certified fitness coaches, skin and dental specialists, and qualified counsellors."
       },
       {
         question: "What safety measures do you have in place?",
         answer: "We maintain the highest standards of hygiene and safety. Our facilities are regularly sanitized, equipment is properly maintained, and we follow all health protocols. All medical services are provided by qualified professionals with proper referral systems in place."
       },
       {
         question: "Is counselling confidential?",
         answer: "Absolutely. All counselling sessions are strictly confidential. We maintain professional ethics and privacy standards. Session information is never shared without your explicit consent, except in cases where there is immediate risk of harm."
       }
     ]
   },
   {
     category: "Booking & Support",
     faqs: [
       {
         question: "How do I book an appointment?",
         answer: "You can book appointments through our website, by calling +234 901 358 9375, via WhatsApp, or by visiting our facility. For online bookings, select your preferred service, choose a time slot, and confirm your appointment."
       },
       {
         question: "What is your cancellation policy?",
         answer: "We require 24 hours' notice for cancellations. Late cancellations may count as used sessions for membership holders. Emergency situations are handled on a case-by-case basis."
       },
       {
         question: "How can I contact customer support?",
         answer: "You can reach our support team via phone at +234 901 358 9375, email at hello@takehealthglobal.com, or through our social media channels (Facebook: takehealth NG, Instagram: @takehealthng, X: @takehealthNG). We're here to help!"
       }
     ]
   }
 ];
 
 const FAQs = () => {
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
               Support
             </motion.span>
             <motion.h1
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
             >
               Frequently Asked Questions
             </motion.h1>
             <motion.p
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="text-xl text-primary-foreground/90"
             >
               Find answers to common questions about our services, memberships, and more.
             </motion.p>
           </div>
         </div>
       </section>
 
       {/* FAQ Content */}
       <section className="section-padding">
         <div className="container mx-auto px-4 md:px-8">
           <div className="max-w-4xl mx-auto">
             {faqCategories.map((category, catIndex) => (
               <motion.div
                 key={category.category}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: catIndex * 0.1 }}
                 className="mb-12"
               >
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-6 pb-2 border-b border-border">
                   {category.category}
                 </h2>
                 <Accordion type="single" collapsible className="space-y-4">
                   {category.faqs.map((faq, faqIndex) => (
                     <AccordionItem
                       key={faqIndex}
                       value={`${catIndex}-${faqIndex}`}
                       className="bg-muted/30 rounded-lg px-6 border-none"
                     >
                       <AccordionTrigger className="text-left font-semibold hover:no-underline">
                         {faq.question}
                       </AccordionTrigger>
                       <AccordionContent className="text-muted-foreground">
                         {faq.answer}
                       </AccordionContent>
                     </AccordionItem>
                   ))}
                 </Accordion>
               </motion.div>
             ))}
           </div>
         </div>
       </section>
 
       {/* Still Have Questions */}
       <section className="section-padding bg-muted/30">
         <div className="container mx-auto px-4 md:px-8 text-center">
           <SectionHeader
             label="Need More Help?"
             title="Still Have Questions?"
             description="Our team is here to help. Reach out and we'll get back to you as soon as possible."
           />
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="mt-8"
           >
             <a
               href="/contact"
               className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
             >
               Contact Us
             </a>
           </motion.div>
         </div>
       </section>
     </Layout>
   );
 };
 
 export default FAQs;