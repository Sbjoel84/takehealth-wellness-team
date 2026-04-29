import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Phone, Mail, Clock, Send, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import contactImage from "@/assets/Spa & Massage.jpeg";

const FORMSPREE_URL = import.meta.env.VITE_FORMSPREE_URL as string | undefined;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      if (FORMSPREE_URL) {
        const res = await fetch(FORMSPREE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error((json as { error?: string }).error || "Submission failed");
        }

        toast({
          title: "Message Sent!",
          description: "Thank you for reaching out. We'll get back to you within 24 hours.",
        });
        form.reset();
      } else {
        // No Formspree configured — open mailto as fallback
        const subject = encodeURIComponent(`Contact from ${data.firstName} ${data.lastName}`);
        const body = encodeURIComponent(
          `Name: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nPhone: ${data.phone || "N/A"}\nService: ${data.service || "N/A"}\n\n${data.message}`
        );
        window.open(`mailto:hello@takehealthglobal.com?subject=${subject}&body=${body}`);
        toast({
          title: "Opening your email client",
          description: "Your default email app will open with the message pre-filled.",
        });
        form.reset();
      }
    } catch (err) {
      toast({
        title: "Failed to send message",
        description: err instanceof Error ? err.message : "Please try again or email us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative hero-gradient text-primary-foreground py-24 lg:py-32">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={contactImage}
            alt="Contact Us"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block bg-primary-foreground/20 px-4 py-2 rounded-full text-sm font-medium mb-4"
            >
              Contact Us
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Start Your Wellness Journey Today
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-primary-foreground/90"
            >
              Have a question or want to book a session? We'd love to hear from you.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                Get in Touch
              </h2>
              <p className="text-muted-foreground mb-8">
                Reach out to us through any of the following channels. Our team is ready to
                assist you with any inquiries about our services.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Address</h3>
                    <p className="text-muted-foreground">
                      B02 - B09 Premium Plaza, Plot 759 Akpabuyo Street
                      <br />
                      Off Dutse Bwari Expressway, Kubwa, FCT Nigeria 901101
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                    <p className="text-muted-foreground">+2349135893755</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <p className="text-muted-foreground">info@takehealthglobal.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Working Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 8:00 AM - 8:00 PM
                      <br />
                      Saturday: 9:00 AM - 5:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="card-wellness p-8">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Let's Talk
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+234..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">Service of Interest</Label>
                    <select
                      id="service"
                      name="service"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select a service...</option>
                      <option value="gym">Gym</option>
                      <option value="spa">Spa & Massage Therapy</option>
                      <option value="skincare">Skin Care</option>
                      <option value="dental">Dental Care</option>
                      <option value="elite">Elite Sport Care</option>
                      <option value="rehab">Rehabilitative Care</option>
                      <option value="nutrition">Nutritional Care</option>
                      <option value="counselling">Counselling</option>
                      <option value="health360">Health360+ Program</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="How can we help you?"
                      rows={4}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-96 w-full">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d62778.88610797943!2d7.3624605999999995!3d9.14838895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sng!4v1772622889280!5m2!1sen!2sng"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Takehealth Location"
        />
      </section>
    </Layout>
  );
};

export default Contact;
