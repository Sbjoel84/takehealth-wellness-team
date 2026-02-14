import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-3xl p-8 md:p-12 lg:p-16 shadow-wellness-lg border border-border relative overflow-hidden"
        >
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-64 h-64 hero-gradient opacity-20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 hero-gradient opacity-10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left max-w-xl">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Start Your Wellness Journey Today
              </h2>
              <p className="text-muted-foreground text-lg">
                Discover your full potential with takehealth. Whether you want to get in shape,
                recover from injury, or simply live a healthier life, we're here to guide you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="group">
                <Link to="/register">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">
                  <Phone className="mr-2 w-5 h-5" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
