import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOVEFEST_REGISTRATION_URL } from "@/lib/events";
import moveFestFlyer from "@/assets/MoveFest flyer.jpeg";

export function MoveFestBanner() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-3xl p-8 md:p-12 shadow-wellness-lg border border-primary/20 overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <motion.img
              src={moveFestFlyer}
              alt="MoveFest — Season 1 flyer"
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-full max-w-xs rounded-2xl shadow-xl border border-primary/20 mx-auto lg:mx-0"
            />

            <div className="text-center lg:text-left max-w-xl">
              <span className="inline-block bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium mb-4">
                Featured Event
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                MoveFest — Season 1
              </h2>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-muted-foreground mb-4">
                <Calendar className="w-4 h-4" />
                <span>October 1, 2026 · 6:30 AM · takehealth Facility/Arena</span>
              </div>
              <p className="text-muted-foreground text-lg mb-8">
                Hosted by the Fitness & Wellness Department. Join us for a morning of movement,
                community, and wellness — spots are limited, register now!
              </p>
              <Button size="lg" asChild className="group">
                <a href={MOVEFEST_REGISTRATION_URL} target="_blank" rel="noopener noreferrer">
                  Register for MoveFest
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
