import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowRight, Check, ChevronDown, ChevronUp, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ServicesPlanSection } from "@/components/ui/ServicesPlanSection";

import gymImage from "@/assets/service-gym.jpeg";
import spaImage from "@/assets/spa.png";
import skinImage from "@/assets/service-skincare.jpg";
import dentalImage from "@/assets/service-dental.jpg";
import eliteImage from "@/assets/service-elite.jpg";
import rehabImage from "@/assets/service-rehab.jpeg";
import nutritionImage from "@/assets/Nutrition Care.jpg";
import counsellingImage from "@/assets/Counselling.jpg";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  tier: "basic" | "premium" | "elite" | "enterprise";
  ctaLink?: string;
}

interface ServiceData {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  features: string[];
  plans: Plan[];
}

const servicesData: ServiceData[] = [
  {
    id: "gym",
    title: "Gym Services",
    shortDescription: "Move Better. Feel Stronger Live Fully.",
    fullDescription: "At takehealth Global Ltd, our gym is more than a workout space; it is a results-driven wellness environment designed to help you build strength, flexibility, endurance, and confidence at every stage of your fitness journey.",
    image: gymImage,
    features: ["State-of-the-art equipment", "Certified fitness professionals", "Personalized programs", "Supportive atmosphere"],
    plans: [
      {
        id: "gym-basic",
        name: "BASIC PACKAGE - Move Better",
        price: "₦20,000",
        period: "/ Month",
        description: "Perfect for individuals who prefer self-guided workouts with professional facilities.",
        tier: "basic",
        features: [
          "Full gym access (strength, cardio and functional zones)",
          "Use of all standard gym equipment",
          "Clean, safe, and supportive workout environment",
          "Access to member-only fitness tips and updates"
        ],
        ctaLink: "/register?service=gym&plan=basic"
      },
      {
        id: "gym-premium",
        name: "PREMIUM PACKAGE - Feel Stronger",
        price: "₦30,000",
        period: "/ Month",
        description: "For members who want structure, guidance, and consistent progress.",
        tier: "premium",
        features: [
          "Full gym access",
          "Personal fitness coaching",
          "Customised workout plan",
          "Monthly progress check-ins",
          "Basic fitness assessment"
        ],
        ctaLink: "/register?service=gym&plan=premium"
      },
      {
        id: "gym-elite",
        name: "ELITE PACKAGE - Live Fully",
        price: "₦40,000",
        period: "/ Month",
        description: "Our most comprehensive gym experience for maximum results and performance.",
        tier: "elite",
        features: [
          "Full gym access",
          "Personal fitness coaching",
          "Comprehensive fitness testing and body assessment",
          "Performance tracking and goal reviews",
          "Priority booking and trainer support",
          "Integrated wellness referrals"
        ],
        ctaLink: "/register?service=gym&plan=elite"
      }
    ]
  },
  {
    id: "spa",
    title: "Spa and Wellness",
    shortDescription: "Relax. Refresh. Rejuvenate.",
    fullDescription: "At takehealth Global Ltd, our Spa and Massage Therapy services are designed to rejuvenate your body, calm your mind, and elevate your confidence.",
    image: spaImage,
    features: ["Professional therapists", "Premium products", "Tranquil environment", "Customised treatments"],
    plans: [
      {
        id: "spa-basic",
        name: "BASIC MEMBERSHIP",
        price: "₦80,000",
        period: "/ Month",
        description: "Ideal for light wellness maintenance.",
        tier: "basic",
        features: [
          "2 Swedish or Aromatherapy Massages (60 mins each)",
          "10% discount on additional spa services",
          "Complimentary wellness consultation (quarterly)"
        ],
        ctaLink: "/register?service=spa&plan=basic"
      },
      {
        id: "spa-premium",
        name: "PREMIUM MEMBERSHIP",
        price: "₦150,000",
        period: "/ Month",
        description: "Perfect for active individuals and professionals.",
        tier: "premium",
        features: [
          "4 Massage Sessions (Swedish, Deep Tissue, or Sports)",
          "1 Body Scrub or Body Wrap",
          "Priority booking and flexible scheduling",
          "15% discount on all spa services",
          "Complimentary wellness consultation (monthly)"
        ],
        ctaLink: "/register?service=spa&plan=premium"
      },
      {
        id: "spa-elite",
        name: "ELITE MEMBERSHIP",
        price: "₦250,000",
        period: "/ Month",
        description: "Designed for high-performance lifestyles and total rejuvenation.",
        tier: "elite",
        features: [
          "Weekly Massage Therapy (any massage type)",
          "2 Spa Treatments (body scrub or wrap)",
          "1 Signature Relaxation Package monthly",
          "VIP treatment room access",
          "Priority and same-day booking",
          "20% discount on all spa services",
          "Dedicated wellness advisor"
        ],
        ctaLink: "/register?service=spa&plan=elite"
      }
    ]
  },
  {
    id: "skincare",
    title: "Skin Care Services",
    shortDescription: "Healthy Skin. Confident You.",
    fullDescription: "At takehealth Global Ltd, our Skin Care services are designed to do more than improve appearance; they support overall health, confidence, and well-being.",
    image: skinImage,
    features: ["Advanced treatments", "Expert estheticians", "Personalised care", "Medical-grade products"],
    plans: [
      {
        id: "skincare-basic",
        name: "BASIC GLOW MEMBERSHIP",
        price: "₦30,000",
        period: "/ Month",
        description: "Ideal for maintenance and first-time clients.",
        tier: "basic",
        features: [
          "1 professional facial per month",
          "Quarterly skin assessment",
          "Personalised home-care routine guidance",
          "Member-only treatment discounts"
        ],
        ctaLink: "/register?service=skincare&plan=basic"
      },
      {
        id: "skincare-premium",
        name: "PREMIUM RADIANCE MEMBERSHIP",
        price: "₦75,000",
        period: "/ Month",
        description: "For visible transformation and corrective care.",
        tier: "premium",
        features: [
          "2 professional treatments per month (facials or peels)",
          "Bi-monthly skin analysis",
          "Dermatology consultation (quarterly)",
          "Lifestyle and skincare coaching",
          "Priority booking and exclusive discounts"
        ],
        ctaLink: "/register?service=skincare&plan=premium"
      },
      {
        id: "skincare-elite",
        name: "ELITE LUMINANCE MEMBERSHIP",
        price: "₦150,000",
        period: "/ Month",
        description: "Our most comprehensive skin wellness experience.",
        tier: "elite",
        features: [
          "Unlimited monthly treatments (within care plan)",
          "Monthly dermatology consultations",
          "Advanced corrective and rejuvenation treatments",
          "Full lifestyle, nutrition, and skin health integration",
          "VIP priority access and concierge booking"
        ],
        ctaLink: "/register?service=skincare&plan=elite"
      }
    ]
  },
  {
    id: "dental",
    title: "Dental Care Services",
    shortDescription: "Smile Better with Us. Lasting Confidence.",
    fullDescription: "At takehealth Global Ltd, we believe oral health is a vital part of whole-body wellness. A healthy mouth supports proper nutrition, boosts confidence, and reduces the risk of systemic health issues.",
    image: dentalImage,
    features: ["Family-friendly care", "Modern technology", "Comprehensive services", "Comfortable environment"],
    plans: [
      {
        id: "dental-basic",
        name: "BASIC DENTAL PLAN",
        price: "₦120,000",
        period: "/ Year",
        description: "Ideal for individuals seeking routine care.",
        tier: "basic",
        features: [
          "1 Dental Consultation",
          "1 Scaling and Polishing",
          "Oral Hygiene Instruction",
          "10% Discount on Fillings and X-Rays"
        ],
        ctaLink: "/register?service=dental&plan=basic"
      },
      {
        id: "dental-premium",
        name: "PREMIUM DENTAL PLAN",
        price: "₦250,000",
        period: "/ Year",
        description: "For individuals and families prioritising consistent care.",
        tier: "premium",
        features: [
          "2 Dental Consultations",
          "2 Scaling and Polishing Sessions",
          "1 Deep Cleaning (Curettage)",
          "1 Dental X-Ray",
          "15% Discount on Fillings, Whitening and Dentures"
        ],
        ctaLink: "/register?service=dental&plan=premium"
      },
      {
        id: "dental-elite",
        name: "ELITE DENTAL PLAN",
        price: "₦600,000",
        period: "/ Year",
        description: "Comprehensive dental wellness and cosmetic support.",
        tier: "elite",
        features: [
          "Unlimited Dental Consultations",
          "2 Scaling and Polishing",
          "1 Deep Cleaning (Curettage)",
          "Teeth Whitening (1 Session)",
          "Priority Booking",
          "20% Discount on Crowns, Braces and Veneers"
        ],
        ctaLink: "/register?service=dental&plan=elite"
      }
    ]
  },
  {
    id: "elite",
    title: "Elite Sport Care",
    shortDescription: "Peak Performance. No Limits.",
    fullDescription: "Achieve peak performance with Elite Sport Care, designed for athletes and serious fitness enthusiasts.",
    image: eliteImage,
    features: ["Sports scientists", "Elite coaches", "Physiotherapy", "Recovery specialists"],
    plans: [
      {
        id: "elite-basic",
        name: "ELITE BASIC",
        price: "₦55,000",
        period: "/ Month",
        description: "Foundational performance support for emerging athletes.",
        tier: "basic",
        features: [
          "Athlete Intake + Goal Mapping (Month 1)",
          "Movement and Injury-Risk Screen (Quarterly)",
          "Performance Testing (1 per Quarter)",
          "2 x 1:1 Coaching Sessions per month",
          "1 x Physio Treatment per month",
          "Personalised Training Plan",
          "10% discount on add-ons"
        ],
        ctaLink: "/register?service=elite&plan=basic"
      },
      {
        id: "elite-premium",
        name: "ELITE PREMIUM",
        price: "₦110,000",
        period: "/ Month",
        description: "Comprehensive performance package.",
        tier: "premium",
        features: [
          "Movement and Injury-Risk Screen (Bi-monthly)",
          "Performance Testing (1 per Month)",
          "4 x 1:1 Coaching Sessions per month",
          "4 x Group Performance Sessions per month",
          "2 x Physio Treatment per month",
          "Detailed Training Plan",
          "15% discount on add-ons"
        ],
        ctaLink: "/register?service=elite&plan=premium"
      },
      {
        id: "elite-elite",
        name: "ELITE ELITE",
        price: "₦195,000",
        period: "/ Month",
        description: "Maximum performance support for serious athletes.",
        tier: "elite",
        features: [
          "Movement and Injury-Risk Screen (Monthly)",
          "Performance Testing (2 per Month)",
          "8 x 1:1 Coaching Sessions per month",
          "8 x Group Performance Sessions per month",
          "4 x Physio Treatment per month",
          "High-performance periodisation plan",
          "20% discount on add-ons"
        ],
        ctaLink: "/register?service=elite&plan=elite"
      }
    ]
  },
  {
    id: "rehab",
    title: "Rehabilitative Care",
    shortDescription: "Recover Stronger.",
    fullDescription: "Recover stronger with our specialised Rehabilitative Care. Our physical therapists and rehab specialists provide personalised programs to help you heal from injuries.",
    image: rehabImage,
    features: ["Customised Therapy Plans", "Expert Techniques", "Integrated Approach", "Supportive Environment"],
    plans: [
      {
        id: "rehab-basic",
        name: "BASIC REHAB",
        price: "₦380,000",
        period: "/ 1 Month",
        description: "Essential rehabilitation support.",
        tier: "basic",
        features: [
          "Initial assessment and personalised therapy plan",
          "2 rehab sessions per week",
          "Access to group rehab classes"
        ],
        ctaLink: "/register?service=rehab&plan=basic"
      },
      {
        id: "rehab-premium",
        name: "PREMIUM REHAB",
        price: "₦420,000",
        period: "/ 2 Months",
        description: "Enhanced recovery with progress tracking.",
        tier: "premium",
        features: [
          "All Basic features",
          "3 rehab sessions per week",
          "Progress tracking and weekly review with therapist",
          "Access to rehabilitation resources and home exercise plan"
        ],
        ctaLink: "/register?service=rehab&plan=premium"
      },
      {
        id: "rehab-elite",
        name: "ELITE REHAB",
        price: "₦540,000",
        period: "/ 3 Months",
        description: "Comprehensive daily rehabilitation.",
        tier: "elite",
        features: [
          "All Premium features",
          "Daily therapy sessions (6 per week)",
          "One-on-one coaching with a senior rehab specialist",
          "Priority booking and ongoing lifestyle support"
        ],
        ctaLink: "/register?service=rehab&plan=elite"
      }
    ]
  },
  {
    id: "nutrition",
    title: "Nutritional Care Services",
    shortDescription: "Nourish Your Body. Fuel Your Life.",
    fullDescription: "At takehealth Global Ltd, Nutritional Care is more than food plans; it is a lifestyle strategy.",
    image: nutritionImage,
    features: ["Personalized Meal Plans", "Weight Management", "Sports Nutrition", "Therapeutic Nutrition"],
    plans: [
      {
        id: "nutr-basic",
        name: "FIT START BUNDLE",
        price: "From ₦50,000",
        period: "",
        description: "Ideal for beginners starting their wellness journey.",
        tier: "basic",
        features: [
          "Regular: 1 month gym + 1 nutrition session - ₦50,000",
          "Premium: 2 months gym + 2 nutrition sessions - ₦100,000",
          "Classic: 3 months gym + 3 nutrition sessions - ₦150,000"
        ],
        ctaLink: "/register?service=nutrition&plan=basic"
      },
      {
        id: "nutr-premium",
        name: "HEALTH BOOST BUNDLE",
        price: "From ₦120,000",
        period: "",
        description: "For consistency, accountability, and steady progress.",
        tier: "premium",
        features: [
          "Regular: 1 month gym + weekly nutrition check-ins - ₦120,000",
          "Premium: 2 months gym + weekly nutrition check-ins - ₦150,000",
          "Classic: 3 months gym + weekly nutrition check-ins - ₦180,000"
        ],
        ctaLink: "/register?service=nutrition&plan=premium"
      },
      {
        id: "nutr-elite",
        name: "NEW YOU BUNDLE",
        price: "From ₦150,000",
        period: "",
        description: "Total lifestyle reset with personalised nutrition support.",
        tier: "elite",
        features: [
          "Regular: 1 month gym + personalised meal plan + weekly check-ins - ₦150,000",
          "Premium: 2 months gym + personalised meal plan + weekly check-ins - ₦180,000",
          "Classic: 3 months gym + personalised meal plan + weekly check-ins - ₦200,000"
        ],
        ctaLink: "/register?service=nutrition&plan=elite"
      }
    ]
  },
  {
    id: "counselling",
    title: "Counselling Services",
    shortDescription: "Your Mental Health Matters.",
    fullDescription: "Your mental health matters. Our Counselling services provide a confidential, caring space to work through stress, anxiety, relationship challenges, grief, burnout, and life transitions.",
    image: counsellingImage,
    features: ["Individual Therapy", "Group Sessions", "Wellness Coaching", "Online Sessions"],
    plans: [
      {
        id: "counsel-basic",
        name: "BASIC",
        price: "₦75,000",
        period: "/ Month",
        description: "Best for maintenance and mild to moderate stress support.",
        tier: "basic",
        features: [
          "1x Intake/Review session (Month 1 only)",
          "2x 1:1 therapy sessions (50 mins)",
          "1x group session (any available group)",
          "1x mindfulness mini-session (20-30 mins)",
          "10% discount on extra sessions"
        ],
        ctaLink: "/register?service=counselling&plan=basic"
      },
      {
        id: "counsel-premium",
        name: "PREMIUM",
        price: "₦150,000",
        period: "/ Month",
        description: "Best for active goals, anxiety/stress management, and consistent coaching.",
        tier: "premium",
        features: [
          "1x intake/review (Month 1) + monthly progress review",
          "4x 1:1 therapy sessions",
          "2x group sessions",
          "2x mindfulness/coaching sessions",
          "Between-session support (business hours) via check-in messages",
          "15% discount on add-ons"
        ],
        ctaLink: "/register?service=counselling&plan=premium"
      },
      {
        id: "counsel-elite",
        name: "ELITE",
        price: "₦295,000",
        period: "/ Month",
        description: "Best for high-pressure professionals, athletes, founders, or complex life transitions.",
        tier: "elite",
        features: [
          "1x intake + monthly structured care plan",
          "8x 1:1 therapy sessions",
          "4x group sessions",
          "4x mindfulness/coaching sessions",
          "Priority booking + faster rescheduling options",
          "20% discount on add-ons",
          "Quarterly wellbeing review report"
        ],
        ctaLink: "/register?service=counselling&plan=elite"
      }
    ]
  },
  {
    id: "health360",
    title: "Health360+ Program",
    shortDescription: "Where Fitness Meets Function and Feelings",
    fullDescription: "Health360+ is your all-in-one, adaptive wellness plan, built around monthly body assessments and progress reviews.",
    image: gymImage,
    features: ["Monthly Assessments", "Customised Plans", "Mental Health Check-ins", "Nutrition Guidance"],
    plans: [
      {
        id: "health-basic",
        name: "HEALTH360+ BASIC",
        price: "₦260,000",
        period: "/ Month",
        description: "Best for busy professionals, wellness starters, weight loss + stress control.",
        tier: "basic",
        features: [
          "Gym (Premium): coaching + progress check-ins",
          "Nutrition (Health Boost style): weekly nutrition check-ins",
          "Mental wellness (Counselling Basic): 2x 1:1 therapy",
          "Recovery (Spa Basic): 2x massages",
          "Monthly Health360+ review",
          "Community access"
        ],
        ctaLink: "/register?service=health360&plan=basic"
      },
      {
        id: "health-premium",
        name: "HEALTH360+ PREMIUM",
        price: "₦470,000",
        period: "/ Month",
        description: "Best for transformation goals, high-pressure lifestyles, consistent results.",
        tier: "premium",
        features: [
          "Gym (Elite): comprehensive fitness testing + tracking",
          "Nutrition (New You style): personalised meal plan + weekly check-ins",
          "Mental wellness (Counselling Premium): 4x 1:1 therapy",
          "Recovery (Spa Premium): 4x massage sessions + 1x body scrub",
          "Skin (Basic Glow): 1 professional facial/month",
          "Community access"
        ],
        ctaLink: "/register?service=health360&plan=premium"
      },
      {
        id: "health-elite",
        name: "HEALTH360+ ELITE",
        price: "₦795,000",
        period: "/ Month",
        description: "Best for executives, athletes, post-op clients wanting full integration.",
        tier: "elite",
        features: [
          "Gym (Elite): testing + performance tracking + goal reviews",
          "Nutrition (New You + clinical flexibility): meal plan + therapeutic diets",
          "Mental wellness (Counselling Elite): 8x 1:1 therapy",
          "Recovery (Spa Elite): weekly massage + 2 spa treatments",
          "Skin (Elite Luminance): advanced corrective care",
          "Community access"
        ],
        ctaLink: "/register?service=health360&plan=elite"
      }
    ]
  },
  {
    id: "corporate",
    title: "Corporate / Enterprise Plan",
    shortDescription: "Comprehensive Wellness Solutions for Your Organization",
    fullDescription: "Takehealth Corporate/Enterprise Plan provides tailored wellness programs for organizations. We help businesses invest in their most valuable asset - their people. Our corporate solutions include fitness facilities, health screenings, nutrition workshops, mental wellness programs, and dedicated support staff.",
    image: gymImage,
    features: ["Dedicated Account Manager", "Customized Wellness Programs", "Regular Health Assessments", "Staff Training Sessions", "On-site Facilities", "24/7 Support"],
    plans: [
      {
        id: "corp-starter",
        name: "CORPORATE STARTER (20 STAFF)",
        price: "₦500,000",
        period: "/ Month",
        description: "Perfect for small teams starting their wellness journey. Ideal for organizations with 20 employees.",
        tier: "basic",
        features: [
          "Wellness program for 20 staff members",
          "Weekly fitness sessions (group)",
          "Monthly health screenings",
          "Nutrition workshops (quarterly)",
          "Mental wellness awareness",
          "Dedicated account manager",
          "Monthly progress reports"
        ],
        ctaLink: "/register?service=corporate&plan=starter"
      },
      {
        id: "corp-growth",
        name: "CORPORATE GROWTH (50 STAFF)",
        price: "₦1,200,000",
        period: "/ Month",
        description: "Expanded wellness solution for growing companies. Perfect for organizations with up to 50 employees.",
        tier: "premium",
        features: [
          "Wellness program for 50 staff members",
          "On-site gym access",
          "Monthly individual health assessments",
          "Monthly nutrition workshops",
          "Mental wellness program (group sessions)",
          "Stress management workshops",
          "Bi-weekly progress reviews",
          "Priority booking for services"
        ],
        ctaLink: "/register?service=corporate&plan=growth"
      },
      {
        id: "corp-enterprise",
        name: "ENTERPRISE (100+ STAFF)",
        price: "₦2,000,000",
        period: "/ Month",
        description: "Full enterprise wellness solution for large organizations. Comprehensive coverage for 100+ employees.",
        tier: "elite",
        features: [
          "Wellness program for 100+ staff members",
          "Dedicated on-site fitness facilities",
          "Full-time wellness coordinator",
          "Comprehensive health assessments (monthly)",
          "Personalized nutrition plans",
          "Full mental wellness program",
          "24/7 priority support",
          "Customized corporate wellness events",
          "Quarterly executive health summaries",
          "Family add-on packages available"
        ],
        ctaLink: "/register?service=corporate&plan=enterprise"
      }
    ]
  }
];

interface ServiceCardProps {
  service: ServiceData;
  index: number;
}

function ServiceCard({ service, index }: ServiceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showAllPlans, setShowAllPlans] = useState(false);

  const displayPlans = showAllPlans ? service.plans : service.plans.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="mb-12"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative w-full aspect-[21/9] overflow-hidden">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-3xl font-bold text-white mb-2">{service.title}</h3>
            <p className="text-white/90 text-xl">{service.shortDescription}</p>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              <p className="text-muted-foreground mb-4">{service.fullDescription}</p>
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                  >
                    <Check className="w-3 h-3" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Quick Overview</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>{service.plans.length} Membership Plans</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Starting from ₦{Math.min(...service.plans.map(p => parseInt(p.price.replace(/[^0-9]/g, '')))).toLocaleString()}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-6">
            <ServicesPlanSection 
              title="Membership Plans"
              plans={displayPlans}
              onPlanSelect={(_planId) => {}}
            />

            {service.plans.length > 3 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllPlans(!showAllPlans)}
                className="w-full mt-4"
              >
                {showAllPlans ? (
                  <>
                    Show Less Plans <ChevronUp className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    Show All Plans ({service.plans.length}) <ChevronDown className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Services() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = servicesData.filter((service) => {
    const matchesCategory = selectedCategory === "all" || service.id === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <SectionHeader
          title="Our Services"
          description="Comprehensive wellness solutions tailored to your needs"
        />

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Search services"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Filter by category"
          >
            <option value="all">All Services</option>
            <option value="gym">Gym</option>
            <option value="spa">Spa and Wellness</option>
            <option value="skincare">Skin Care</option>
            <option value="dental">Dental Care</option>
            <option value="elite">Elite Sport</option>
            <option value="rehab">Rehabilitation</option>
            <option value="nutrition">Nutrition</option>
            <option value="counselling">Counselling</option>
            <option value="health360">Health360+</option>
          </select>
        </div>

        <div className="grid gap-6">
          {filteredServices.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No services found matching your criteria.</p>
          </div>
        )}

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h3 className="text-xl font-bold mb-4">Need Help Choosing a Service?</h3>
          <p className="text-muted-foreground mb-4">
            Our team of wellness experts is here to help you find the perfect services for your needs.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/get-started"
              className="inline-flex items-center gap-2 px-4 py-2 border border-input bg-background rounded-lg hover:bg-accent transition-colors"
            >
              Get Started <Info className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Services;
