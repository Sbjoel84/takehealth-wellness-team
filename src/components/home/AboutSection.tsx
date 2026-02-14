import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import aboutImage from "@/assets/about-team.jpg";

const features = [
  "State-of-the-art gym facilities and expert trainers",
  "Counselling and mindfulness programs for mental health",
  "Rehabilitative care to restore mobility",
  "Beauty and health services including Spa and Skin Care",
  "AI-powered personalisation for workouts and nutrition",
  "Connected mobile-first platform for progress tracking",
];

export function AboutSection() {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden shadow-wellness-lg">
              <img
                src={aboutImage}
                alt="Our wellness team"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-6 -right-6 md:bottom-8 md:right-8 bg-card p-6 rounded-2xl shadow-wellness-lg border border-border max-w-xs"
            >
              <div className="font-serif text-4xl font-bold text-primary mb-2">360°</div>
              <p className="text-muted-foreground text-sm">
                Complete wellness approach blending fitness, mental health, and lifestyle services.
              </p>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-3">
              About Us
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Your Partner in Total Wellness
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Founded on the belief that health is more than the absence of illness, takehealth
              Global Ltd was created to fill the gap between traditional healthcare and
              sustainable wellness.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              At takehealth, we don't believe in quick fixes. Instead, we combine science,
              compassion, and innovation to create programs that are personalised, preventative,
              and purpose-driven.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our multidisciplinary team includes licensed therapists, physiotherapists, fitness coaches, skin and dental specialists, all united by a shared goal: to help you move better, feel better, and live fully.
            </p>

            {/* Features List */}
            <ul className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </motion.li>
              ))}
            </ul>

            <Button size="lg" asChild className="group">
              <Link to="/about">
                Learn More About Us
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
