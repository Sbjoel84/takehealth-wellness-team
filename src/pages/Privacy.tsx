 import { Layout } from "@/components/layout/Layout";
 import { motion } from "framer-motion";
 
 const Privacy = () => {
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
               Legal
             </motion.span>
             <motion.h1
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
             >
               Privacy Policy
             </motion.h1>
             <motion.p
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="text-xl text-primary-foreground/90"
             >
               Last updated: February 2026
             </motion.p>
           </div>
         </div>
       </section>
 
       {/* Content */}
       <section className="section-padding">
         <div className="container mx-auto px-4 md:px-8">
           <div className="max-w-4xl mx-auto prose prose-lg">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-8"
             >
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Introduction</h2>
                 <p className="text-muted-foreground leading-relaxed">
                   takehealth Global Ltd ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us in any way.
                 </p>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Information We Collect</h2>
                 <p className="text-muted-foreground leading-relaxed mb-4">We may collect the following types of information:</p>
                 <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
                 <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                   <li>Name, email address, phone number, and postal address</li>
                   <li>Date of birth and gender</li>
                   <li>Emergency contact information</li>
                   <li>Payment and billing information</li>
                   <li>Government-issued identification (when required)</li>
                 </ul>
                 <h3 className="font-semibold text-foreground mb-2">Health Information</h3>
                 <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                   <li>Medical history and health conditions</li>
                   <li>Fitness assessments and progress data</li>
                   <li>Treatment records and therapy notes</li>
                   <li>Dietary preferences and restrictions</li>
                   <li>Mental health and counselling session notes</li>
                 </ul>
                 <h3 className="font-semibold text-foreground mb-2">Technical Information</h3>
                 <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                   <li>IP address and browser type</li>
                   <li>Device information and operating system</li>
                   <li>Website usage data and cookies</li>
                   <li>App usage statistics</li>
                 </ul>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">How We Use Your Information</h2>
                 <p className="text-muted-foreground leading-relaxed mb-4">We use your information to:</p>
                 <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                   <li>Provide and improve our wellness and fitness services</li>
                   <li>Process appointments, memberships, and payments</li>
                   <li>Communicate with you about your services and account</li>
                   <li>Send promotional materials and newsletters (with your consent)</li>
                   <li>Ensure safety and security of our facilities</li>
                   <li>Comply with legal obligations and regulations</li>
                   <li>Conduct research and analytics to improve our services</li>
                   <li>Respond to inquiries and provide customer support</li>
                 </ul>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Information Sharing and Disclosure</h2>
                 <p className="text-muted-foreground leading-relaxed mb-4">We may share your information with:</p>
                 <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                   <li><strong>Service Providers:</strong> Third parties who assist in providing our services (e.g., payment processors, IT providers)</li>
                   <li><strong>Healthcare Professionals:</strong> When referrals are necessary for your care</li>
                   <li><strong>Legal Authorities:</strong> When required by law or to protect rights and safety</li>
                   <li><strong>Business Partners:</strong> With your consent, for co-branded services or promotions</li>
                 </ul>
                 <p className="text-muted-foreground leading-relaxed mt-4">
                   We do not sell your personal information to third parties.
                 </p>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Data Security</h2>
                 <p className="text-muted-foreground leading-relaxed">
                   We implement appropriate technical and organizational measures to protect your personal information, including encryption, secure servers, access controls, and regular security assessments. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                 </p>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Your Rights</h2>
                 <p className="text-muted-foreground leading-relaxed mb-4">You have the right to:</p>
                 <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                   <li>Access your personal information</li>
                   <li>Correct inaccurate or incomplete data</li>
                   <li>Request deletion of your data (subject to legal requirements)</li>
                   <li>Opt-out of marketing communications</li>
                   <li>Withdraw consent for data processing</li>
                   <li>Request data portability</li>
                   <li>Lodge a complaint with relevant authorities</li>
                 </ul>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Data Retention</h2>
                 <p className="text-muted-foreground leading-relaxed">
                   We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, comply with legal obligations, resolve disputes, and enforce our agreements. Medical records are retained in accordance with applicable healthcare regulations.
                 </p>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Cookies and Tracking</h2>
                 <p className="text-muted-foreground leading-relaxed">
                   Our website uses cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can manage your cookie preferences through your browser settings.
                 </p>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Children's Privacy</h2>
                 <p className="text-muted-foreground leading-relaxed">
                   Our services are not directed to individuals under 18 years of age. For minor clients, we require parental or guardian consent before collecting and processing personal information.
                 </p>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Changes to This Policy</h2>
                 <p className="text-muted-foreground leading-relaxed">
                   We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date. We encourage you to review this policy periodically.
                 </p>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Contact Us</h2>
                 <p className="text-muted-foreground leading-relaxed">
                   If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
                 </p>
                 <div className="mt-4 p-6 bg-muted/30 rounded-lg">
                   <p className="text-foreground font-semibold">takehealth Global Ltd</p>
                   <p className="text-muted-foreground">B02 - B09 Premium Plaza, Plot 759 Akpabuyo Street</p>
                   <p className="text-muted-foreground">Off Dutse Bwarri Expressway, Kubwa, FCT Nigeria 901101</p>
                   <p className="text-muted-foreground mt-2">Email: hello@takehealthglobal.com</p>
                   <p className="text-muted-foreground">Phone: +234 901 358 9375</p>
                 </div>
               </div>
             </motion.div>
           </div>
         </div>
       </section>
     </Layout>
   );
 };
 
 export default Privacy;