import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const newsEvents = [
  {
    date: "February 2026",
    title: "Launch and Commissioning of the Kubwa Centre",
    description: "Walk4Love event on February 14 to celebrate our new facility opening.",
    tag: "Launch",
  },
  {
    date: "February 2026",
    title: "30-Day Nutritional Healing Challenge",
    description: "Join our comprehensive nutrition program to transform your eating habits.",
    tag: "Challenge",
  },
  {
    date: "March 2026",
    title: "Free Community Wellness Sessions",
    description: "Virtual and physical wellness sessions open to the community.",
    tag: "Community",
  },
  {
    date: "April 2026",
    title: "Launch of Corporate Wellness Partnerships",
    description: "New programs designed specifically for corporate organizations.",
    tag: "Partnership",
  },
];

export function NewsSection() {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeader
          label="News & Events"
          title="Stay Connected. Stay Inspired."
          description="Be the first to know about workshops, special offers, and wellness trends."
        />

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsEvents.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-wellness p-6"
            >
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                <Calendar className="w-4 h-4" />
                <span>{event.date}</span>
              </div>
              <span className="inline-block bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium mb-3">
                {event.tag}
              </span>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                {event.title}
              </h3>
              <p className="text-muted-foreground text-sm">{event.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Button variant="outline" asChild className="group">
            <Link to="/news">
              View Full Calendar
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
