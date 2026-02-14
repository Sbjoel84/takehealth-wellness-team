import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Activity, Brain, Salad, Users, Calendar, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/takehealth homepage.png";

const features = [
  {
    icon: Calendar,
    title: "Monthly Body Assessments & Progress Reviews",
    description: "Regular check-ins to track your fitness journey and make data-driven adjustments to your plan.",
  },
  {
    icon: Activity,
    title: "Customized Fitness + Therapy Plans",
    description: "Personalized workout and therapy programs designed specifically for your goals and needs.",
  },
  {
    icon: Brain,
    title: "Mental Health Check-ins",
    description: "Scheduled counselling sessions to support your emotional well-being and stress management.",
  },
  {
    icon: Salad,
    title: "Nutrition Guidance",
    description: "Expert nutritional counseling and meal plans to fuel your body and optimize performance.",
  },
  {
    icon: Users,
    title: "Exclusive Community Events",
    description: "Connect with like-minded members through group activities, workshops, and wellness retreats.",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics Dashboard",
    description: "Track your wellness metrics and celebrate milestones with our comprehensive analytics.",
  },
];

const benefits = [
  "All-inclusive access to gym, spa, and wellness facilities",
  "Priority booking for all services and specialists",
  "Dedicated wellness coordinator assigned to you",
  "Exclusive member discounts on products and additional services",
  "Access to premium mobile app features",
  "Complimentary guest passes each month",
];

const Health360 = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative hero-gradient text-primary-foreground py-24 lg:py-32">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={heroImage}
            alt="Health360 Wellness"
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
              Signature Program
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Health360+ Program
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-primary-foreground/90 mb-4"
            >
              Where Fitness Meets Function and Feelings
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-primary-foreground/80"
            >
              Our signature Health360+ Program combines all our services into a single, adaptive
              plan tailored to your goals. Designed for busy professionals, post-op clients,
              athletes, and anyone seeking true balance.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              What's Included
            </h2>
            <p className="text-muted-foreground text-lg">
              A comprehensive wellness experience that covers every aspect of your health journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-wellness p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                Member Benefits
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                As a Health360+ member, you get exclusive access to premium benefits designed to
                maximize your wellness journey.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-3xl p-8 shadow-wellness-lg border border-border"
            >
              <div className="text-center mb-6">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Membership
                </span>
                <h3 className="font-serif text-4xl font-bold text-foreground mt-2">
                  Health360+
                </h3>
                <p className="text-muted-foreground mt-2">
                  Live better with an integrated path to health
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-foreground">Gym Access</span>
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-foreground">Spa & Massage</span>
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-foreground">Counselling Sessions</span>
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-foreground">Nutrition Guidance</span>
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-foreground">Community Events</span>
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
              </div>

              <Button size="lg" className="w-full group" asChild>
                <Link to="/contact">
                  Join Health360+ Today
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Health360;
