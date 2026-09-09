import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOVEFEST_REGISTRATION_URL } from "@/lib/events";
import moveFestFlyer from "@/assets/MoveFest flyer.jpeg";

// MoveFest — Season 1 kick-off: October 1, 2026, 6:30 AM (WAT, UTC+1).
const MOVEFEST_DATE = new Date("2026-10-01T06:30:00+01:00");

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(): TimeLeft | null {
  const diff = MOVEFEST_DATE.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  };
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!timeLeft) {
    return (
      <p className="mb-8 text-lg font-semibold text-primary">
        MoveFest is live — see you at the Arena!
      </p>
    );
  }

  const units: { label: string; value: number }[] = [
    { label: "Days", value: timeLeft.days },
    { label: "Hrs", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className="mb-8">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
        Countdown to kick-off
      </p>
      <div className="flex justify-center lg:justify-start gap-2 sm:gap-3">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="min-w-[3.75rem] rounded-xl bg-primary/10 border border-primary/20 px-2 py-2 text-center"
          >
            <div className="font-serif text-2xl sm:text-3xl font-bold text-primary tabular-nums">
              {String(unit.value).padStart(2, "0")}
            </div>
            <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
              <p className="text-muted-foreground text-lg mb-6">
                Hosted by the Fitness & Wellness Department. Join us for a morning of movement,
                community, and wellness — spots are limited, register now!
              </p>
              <Countdown />
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
