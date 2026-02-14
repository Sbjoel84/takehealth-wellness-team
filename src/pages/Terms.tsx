 import { Layout } from "@/components/layout/Layout";
 import { motion } from "framer-motion";
 
 const Terms = () => {
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
               Terms of Service
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
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                 <p className="text-muted-foreground leading-relaxed">
                   By accessing or using the services of takehealth Global Ltd ("takehealth," "we," "our," or "us"), including our website, mobile applications, facilities, and wellness services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                 </p>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">2. Services Overview</h2>
                 <p className="text-muted-foreground leading-relaxed">
                   takehealth provides integrated wellness and fitness services including, but not limited to, gym facilities, spa and massage therapy, skin care, dental care, elite sport care, rehabilitative care, nutritional care, counselling, and the Health360+ program. All services are subject to availability and may vary by location.
                 </p>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">3. Membership and Registration</h2>
                 <p className="text-muted-foreground leading-relaxed mb-4">
                   To access certain services, you must register for an account and/or purchase a membership. By registering, you agree to:
                 </p>
                 <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                   <li>Provide accurate, current, and complete information</li>
                   <li>Maintain and promptly update your information</li>
                   <li>Keep your account credentials confidential</li>
                   <li>Accept responsibility for all activities under your account</li>
                   <li>Notify us immediately of any unauthorized access</li>
                 </ul>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">4. Health and Safety</h2>
                 <p className="text-muted-foreground leading-relaxed mb-4">
                   Your health and safety are our priority. By using our services, you acknowledge that:
                 </p>
                 <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                   <li>You have disclosed all relevant medical conditions and health concerns</li>
                   <li>You have consulted with a physician before starting any fitness or wellness program if necessary</li>
                   <li>You understand the inherent risks associated with physical activities and treatments</li>
                   <li>You will follow all safety guidelines and instructions from our staff</li>
                   <li>You will use equipment properly and report any damage or safety concerns</li>
                 </ul>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">5. Payment and Billing</h2>
                 <p className="text-muted-foreground leading-relaxed mb-4">
                   By purchasing a membership or service, you agree to the following payment terms:
                 </p>
                 <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                   <li>All fees are quoted in Nigerian Naira (₦) unless otherwise stated</li>
                   <li>Payment is due at the time of purchase or as specified in your membership agreement</li>
                   <li>Prices are subject to change with reasonable notice</li>
                   <li>All payments are non-refundable unless otherwise stated</li>
                   <li>You are responsible for any taxes applicable to your purchases</li>
                 </ul>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">6. Cancellation and Refund Policy</h2>
                 <p className="text-muted-foreground leading-relaxed mb-4">
                   Our cancellation policies are as follows:
                 </p>
                 <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                   <li><strong>Appointments:</strong> Must be cancelled at least 24 hours in advance. Late cancellations may be charged or count as used sessions.</li>
                   <li><strong>Memberships:</strong> Monthly memberships may be cancelled with 30 days' written notice. Annual memberships are non-refundable but may be transferable.</li>
                   <li><strong>Packages:</strong> Unused package sessions expire as per the package terms and are generally non-refundable.</li>
                   <li><strong>Medical Freeze:</strong> Memberships may be paused with valid medical documentation.</li>
                 </ul>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">7. Code of Conduct</h2>
                 <p className="text-muted-foreground leading-relaxed mb-4">
                   All members and visitors must adhere to our code of conduct:
                 </p>
                 <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                   <li>Treat all staff, members, and visitors with respect</li>
                   <li>Maintain appropriate hygiene and dress code</li>
                   <li>Use facilities and equipment responsibly</li>
                   <li>Do not engage in disruptive, abusive, or illegal behavior</li>
                   <li>Do not solicit other members for personal or commercial purposes</li>
                   <li>Follow all posted rules and staff instructions</li>
                 </ul>
                 <p className="text-muted-foreground leading-relaxed mt-4">
                   Violation of this code may result in suspension or termination of membership without refund.
                 </p>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">8. Intellectual Property</h2>
                 <p className="text-muted-foreground leading-relaxed">
                   All content on our website, applications, and materials, including text, graphics, logos, images, and software, is the property of takehealth Global Ltd and protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our written permission.
                 </p>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">9. Limitation of Liability</h2>
                 <p className="text-muted-foreground leading-relaxed">
                   To the maximum extent permitted by law, takehealth Global Ltd shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our total liability shall not exceed the amount you paid for the specific service giving rise to the claim.
                 </p>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">10. Disclaimer</h2>
                 <p className="text-muted-foreground leading-relaxed">
                   Our services are provided "as is" without warranties of any kind. We do not guarantee specific results from our fitness, wellness, or therapeutic services. Counselling and health services are supportive in nature and do not replace professional medical treatment. In emergencies, please contact emergency services immediately.
                 </p>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">11. Indemnification</h2>
                 <p className="text-muted-foreground leading-relaxed">
                   You agree to indemnify and hold harmless takehealth Global Ltd, its officers, directors, employees, and agents from any claims, losses, damages, liabilities, and expenses arising from your use of our services or violation of these terms.
                 </p>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">12. Privacy</h2>
                 <p className="text-muted-foreground leading-relaxed">
                   Your use of our services is also governed by our Privacy Policy, which is incorporated into these Terms of Service by reference. Please review our Privacy Policy to understand our data collection and use practices.
                 </p>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">13. Modifications to Terms</h2>
                 <p className="text-muted-foreground leading-relaxed">
                   We reserve the right to modify these Terms of Service at any time. Changes will be effective upon posting to our website. Your continued use of our services after changes constitutes acceptance of the modified terms.
                 </p>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">14. Governing Law</h2>
                 <p className="text-muted-foreground leading-relaxed">
                   These Terms of Service shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in the courts of the Federal Capital Territory, Abuja.
                 </p>
               </div>
 
               <div>
                 <h2 className="font-serif text-2xl font-bold text-foreground mb-4">15. Contact Information</h2>
                 <p className="text-muted-foreground leading-relaxed">
                   For questions about these Terms of Service, please contact us:
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
 
 export default Terms;