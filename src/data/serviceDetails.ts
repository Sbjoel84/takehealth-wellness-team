import gymImage from "@/assets/service-gym.jpeg";
import spaImage from "@/assets/spa.png";
import skinImage from "@/assets/service-skincare.jpg";
import dentalImage from "@/assets/service-dental.jpg";
import eliteImage from "@/assets/service-elite.jpg";
import rehabImage from "@/assets/service-rehab.jpeg";
import nutritionImage from "@/assets/Nutrition Care.jpg";
import counsellingImage from "@/assets/Counselling.jpg";

export interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

export interface ServiceItem {
  name: string;
  description?: string;
  duration?: string;
  price: string;
  period?: string;
}

export interface ServiceCategory {
  title: string;
  items: ServiceItem[];
}

export interface ServiceDetailData {
  title: string;
  tagline: string;
  heroDescription: string;
  image: string;
  sections: {
    title: string;
    content: string;
    bullets?: string[];
  }[];
  serviceCategories?: ServiceCategory[];
  pricingTiers?: PricingTier[];
  additionalInfo?: {
    title: string;
    content: string;
    bullets?: string[];
  }[];
  cta: {
    text: string;
    buttons: { label: string; href: string; primary?: boolean }[];
  };
}

export const serviceDetails: Record<string, ServiceDetailData> = {
  gym: {
    title: "Gym Services",
    tagline: "Move Better. Feel Stronger. Live Fully.",
    heroDescription: "At takehealth Global Ltd, our gym is more than a workout space; it's a results-driven wellness environment designed to help you build strength, flexibility, endurance, and confidence at every stage of your fitness journey.",
    image: gymImage,
    sections: [
      {
        title: "What Makes Our Gym Different",
        content: "Whether you are a beginner taking your first steps or an experienced athlete refining performance, our programs are tailored to meet your goals safely and effectively.",
        bullets: [
          "State-of-the-art equipment for strength, cardio, and functional training",
          "Certified fitness professionals with a holistic wellness mindset",
          "Personalized programs based on fitness level, health history, and lifestyle",
          "Supportive, motivating atmosphere that keeps you consistent and accountable",
          "Integrated wellness approach linking fitness with nutrition, rehabilitation, and mental well-being"
        ]
      },
      {
        title: "Physical Fitness Programs",
        content: "Our gym floor is fully equipped for strength and resistance training, cardiovascular conditioning, flexibility and mobility exercises, functional fitness for everyday movement, and weight management and body toning. Suitable for beginners, intermediates, and advanced members.",
        bullets: []
      },
      {
        title: "Personal Fitness Coaching",
        content: "Work one-on-one with a professional fitness coach who designs and supervises your workouts to ensure proper technique, faster results, and injury prevention.",
        bullets: [
          "Personalised workout plans",
          "Exercise supervision and progression tracking",
          "Motivation, accountability, and lifestyle guidance",
          "Goal-specific programs (fat loss, muscle gain, endurance, rehabilitation support)"
        ]
      },
      {
        title: "Fitness Testing & Assessments",
        content: "We believe that practical fitness starts with understanding your body. Our fitness tests provide a clear baseline and help track progress over time.",
        bullets: [
          "Body composition analysis (BMI, fat %, muscle mass)",
          "Cardiovascular endurance testing",
          "Strength and flexibility assessments",
          "Functional movement screening",
          "Posture and mobility evaluation"
        ]
      },
      {
        title: "Who This Is For",
        content: "",
        bullets: [
          "Individuals starting their fitness journey",
          "Busy professionals seeking structured workouts",
          "Weight loss or body toning goals",
          "Athletes and fitness enthusiasts",
          "Clients transitioning from rehabilitation to active fitness"
        ]
      }
    ],
    serviceCategories: [
      {
        title: "Core Services",
        items: [
          { name: "Monthly Gym Access Fee", price: "₦20,000", period: "per month" },
          { name: "Fitness Coaching Fee", description: "In addition to gym access", price: "₦10,000", period: "per month" },
          { name: "Fitness Test Sessions", description: "Available on booking", price: "Varies by package" }
        ]
      }
    ],
    pricingTiers: [
      {
        name: "BASIC PACKAGE",
        price: "₦20,000",
        period: "/ Month",
        description: "Move Better – Perfect for individuals who prefer self-guided workouts with professional facilities.",
        features: [
          "Full gym access (strength, cardio & functional zones)",
          "Use of all standard gym equipment",
          "Clean, safe, and supportive workout environment",
          "Access to member-only fitness tips and updates"
        ],
        cta: "Join Now"
      },
      {
        name: "PREMIUM PACKAGE",
        price: "₦30,000",
        period: "/ Month",
        description: "Feel Stronger – For members who want structure, guidance, and consistent progress.",
        features: [
          "Full gym access",
          "Personal fitness coaching",
          "Customised workout plan",
          "Monthly progress check-ins",
          "Basic fitness assessment"
        ],
        highlighted: true,
        cta: "Get Started"
      },
      {
        name: "ELITE PACKAGE",
        price: "₦40,000",
        period: "/ Month",
        description: "Live Fully – Our most comprehensive gym experience for maximum results and performance.",
        features: [
          "Full gym access",
          "Personal fitness coaching",
          "Comprehensive fitness testing & body assessment",
          "Performance tracking and goal reviews",
          "Priority booking and trainer support",
          "Integrated wellness referrals (nutrition, recovery, rehab)"
        ],
        cta: "Upgrade to Elite"
      }
    ],
    additionalInfo: [
      {
        title: "Optional Add-Ons",
        content: "Members can enhance any package with:",
        bullets: [
          "Massage therapy & recovery sessions",
          "Nutrition counselling and meal planning",
          "Rehabilitative care programs",
          "Elite sport performance training"
        ]
      },
      {
        title: "Your Fitness, Fully Supported",
        content: "Our gym services integrate seamlessly with nutrition counselling, rehabilitative care, massage therapy and recovery services, and elite sport care programs. This ensures your fitness routine supports your total health, not just appearance.",
        bullets: []
      }
    ],
    cta: {
      text: "Ready to Get Started? Take the first step toward a stronger, healthier you.",
      buttons: [
        { label: "Join Now", href: "/contact", primary: true },
        { label: "Book a Fitness Assessment", href: "/contact" },
        { label: "Start Personal Coaching", href: "/contact" }
      ]
    }
  },
  spa: {
    title: "Spa & Massage Therapy Services",
    tagline: "Rejuvenate Your Body. Restore Your Confidence.",
    heroDescription: "At takehealth Global Ltd, our Spa & Massage Therapy services are designed to rejuvenate your body, calm your mind, and elevate your confidence. Each treatment complements your physical training and mental wellness journey.",
    image: spaImage,
    sections: [
      {
        title: "Why Choose takehealth Spa & Massage?",
        content: "Our spa environment is serene, hygienic, and professionally managed, ensuring every session delivers relaxation, therapeutic benefit, and measurable wellness outcomes.",
        bullets: [
          "Licensed and experienced therapists",
          "Clean, tranquil, and private environment",
          "Seamless integration with gym, rehab, and mental wellness services",
          "Online booking and easy payment options"
        ]
      }
    ],
    serviceCategories: [
      {
        title: "Massage Therapy Services",
        items: [
          { name: "Swedish Massage", description: "A gentle, full-body massage focused on relaxation and stress relief. Improves circulation, reduces stress, enhances sleep.", duration: "60 minutes", price: "₦25,000" },
          { name: "Deep Tissue Massage", description: "Targets deeper muscle layers to relieve chronic pain and tension. Eases muscle stiffness, improves mobility.", duration: "60 minutes", price: "₦30,000" },
          { name: "Sports Massage", description: "Designed for active individuals and athletes before or after training. Faster recovery, reduced muscle soreness.", duration: "60 minutes", price: "₦35,000" },
          { name: "Hot Stone Massage", description: "Uses heated stones to relax muscles and improve energy flow. Deep relaxation, stress relief.", duration: "75 minutes", price: "₦40,000" },
          { name: "Aromatherapy Massage", description: "Combines essential oils with massage techniques for emotional and physical balance.", duration: "60 minutes", price: "₦30,000" }
        ]
      },
      {
        title: "Spa & Body Care Services",
        items: [
          { name: "Body Scrub & Polish", description: "Exfoliating treatment to remove dead skin and restore smoothness.", duration: "45 minutes", price: "₦20,000" },
          { name: "Body Wrap (Detox / Hydrating)", description: "Nourishing wrap to detoxify or deeply moisturise the skin.", duration: "60 minutes", price: "₦30,000" },
          { name: "Signature Relaxation Package", description: "A combination of massage, body scrub, and aromatherapy. Full-body rejuvenation.", duration: "2 hours", price: "₦55,000" }
        ]
      }
    ],
    pricingTiers: [
      {
        name: "BASIC MEMBERSHIP",
        price: "₦80,000",
        period: "/ Month",
        description: "Ideal for light wellness maintenance",
        features: [
          "2 × Swedish or Aromatherapy Massages (60 mins each)",
          "10% discount on additional spa services",
          "Complimentary wellness consultation (quarterly)"
        ],
        cta: "Join Basic"
      },
      {
        name: "PREMIUM MEMBERSHIP",
        price: "₦150,000",
        period: "/ Month",
        description: "Perfect for active individuals and professionals",
        features: [
          "4 × Massage Sessions (Swedish, Deep Tissue, or Sports)",
          "1 × Body Scrub or Body Wrap",
          "Priority booking & flexible scheduling",
          "15% discount on all spa services",
          "Complimentary wellness consultation (monthly)"
        ],
        highlighted: true,
        cta: "Join Premium"
      },
      {
        name: "ELITE MEMBERSHIP",
        price: "₦250,000",
        period: "/ Month",
        description: "Designed for high-performance lifestyles and total rejuvenation",
        features: [
          "Weekly Massage Therapy (any massage type)",
          "2 × Spa Treatments (body scrub or wrap)",
          "1 × Signature Relaxation Package monthly",
          "VIP treatment room access",
          "Priority & same-day booking",
          "20% discount on all spa services",
          "Dedicated wellness advisor"
        ],
        cta: "Join Elite"
      }
    ],
    cta: {
      text: "Relax. Recover. Rejuvenate.",
      buttons: [
        { label: "Book Now", href: "/contact", primary: true },
        { label: "Join a Membership", href: "/contact" },
        { label: "Speak to a Wellness Advisor", href: "/contact" }
      ]
    }
  },
  skincare: {
    title: "Skin Care Services",
    tagline: "Glow from the Outside In",
    heroDescription: "At takehealth Global Ltd, our Skin Care services are designed to do more than improve appearance; they support overall health, confidence, and well-being. Healthy skin reflects what's happening inside the body.",
    image: skinImage,
    sections: [
      {
        title: "Our Approach",
        content: "Our skilled aestheticians and dermatology professionals deliver personalised treatments using safe, evidence-based techniques tailored to your skin type, goals, and lifestyle. Whether you're seeking rejuvenation, correction, or maintenance, we help you achieve lasting, natural results.",
        bullets: [
          "Integrated wellness approach (skin, nutrition, stress, lifestyle)",
          "Qualified aestheticians and medical professionals",
          "Personalised treatment plans",
          "Safe, modern, and hygienic environment",
          "Seamless booking and digital support"
        ]
      }
    ],
    serviceCategories: [
      {
        title: "Professional Facials",
        items: [
          { name: "Express Facial", description: "Quick cleansing and hydration treatment", duration: "30 mins", price: "₦20,000" },
          { name: "Signature Facial", description: "Deep cleansing, exfoliation, hydration and skin barrier repair", duration: "60 mins", price: "₦35,000" },
          { name: "Advanced / Anti-Ageing Facial", description: "Anti-ageing and brightening treatments", duration: "75 mins", price: "₦50,000" }
        ]
      },
      {
        title: "Chemical Peels",
        items: [
          { name: "Light Peel", description: "Mild exfoliation for skin renewal", price: "₦40,000" },
          { name: "Medium Peel", description: "Treatment for hyperpigmentation, acne scars, fine lines", price: "₦65,000" },
          { name: "Advanced / Medical-Grade Peel", description: "Medical-grade treatment for significant skin concerns", price: "₦90,000" }
        ]
      },
      {
        title: "Dermatology Consultations",
        items: [
          { name: "Initial Consultation", description: "Skin analysis, diagnosis, and treatment recommendations", price: "₦30,000" },
          { name: "Follow-up Consultation", description: "Progress review and plan adjustment", price: "₦20,000" }
        ]
      },
      {
        title: "Corrective & Advanced Treatments",
        items: [
          { name: "Corrective Treatment Session", description: "Anti-ageing, scar and pigmentation management, skin tightening", price: "₦60,000 – ₦120,000" }
        ]
      },
      {
        title: "Lifestyle & Skin Health Coaching",
        items: [
          { name: "One-on-One Skin Health Coaching Session", description: "Skincare routines, nutrition, stress management, sleep optimisation", price: "₦25,000" }
        ]
      }
    ],
    pricingTiers: [
      {
        name: "BASIC GLOW MEMBERSHIP",
        price: "₦30,000",
        period: "/ Month",
        description: "Ideal for maintenance and first-time clients",
        features: [
          "1 professional facial per month",
          "Quarterly skin assessment",
          "Personalised home-care routine guidance",
          "Member-only treatment discounts"
        ],
        cta: "Join Basic Glow"
      },
      {
        name: "PREMIUM RADIANCE MEMBERSHIP",
        price: "₦75,000",
        period: "/ Month",
        description: "For visible transformation and corrective care",
        features: [
          "2 professional treatments per month (facials or peels)",
          "Bi-monthly skin analysis",
          "Dermatology consultation (quarterly)",
          "Lifestyle and skincare coaching",
          "Priority booking and exclusive discounts"
        ],
        highlighted: true,
        cta: "Upgrade to Premium Radiance"
      },
      {
        name: "ELITE LUMINANCE MEMBERSHIP",
        price: "₦150,000",
        period: "/ Month",
        description: "Our most comprehensive skin wellness experience",
        features: [
          "Unlimited monthly treatments (within care plan)",
          "Monthly dermatology consultations",
          "Advanced corrective and rejuvenation treatments",
          "Full lifestyle, nutrition, and skin health integration",
          "VIP priority access and concierge booking"
        ],
        cta: "Go Elite"
      }
    ],
    additionalInfo: [
      {
        title: "6-Month Packages",
        content: "Save more with our 6-month membership options:",
        bullets: [
          "Basic Glow: ₦160,000 for 6 months",
          "Premium Radiance: ₦400,000 for 6 months",
          "Elite Luminance: ₦800,000 for 6 months"
        ]
      }
    ],
    cta: {
      text: "Your skin deserves expert care and consistency. Whether you're starting small or going all-in, we have a membership that fits your lifestyle.",
      buttons: [
        { label: "Book a Consultation", href: "/contact", primary: true },
        { label: "Become a Member", href: "/contact" }
      ]
    }
  },
  "service-skincare": {
    title: "Skin Care Services",
    tagline: "Glow from the Outside In",
    heroDescription: "At takehealth Global Ltd, our Skin Care services are designed to do more than improve appearance; they support overall health, confidence, and well-being. Healthy skin reflects what's happening inside the body.",
    image: skinImage,
    sections: [
      {
        title: "Our Approach",
        content: "Our skilled aestheticians and dermatology professionals deliver personalised treatments using safe, evidence-based techniques tailored to your skin type, goals, and lifestyle. Whether you're seeking rejuvenation, correction, or maintenance, we help you achieve lasting, natural results.",
        bullets: [
          "Integrated wellness approach (skin, nutrition, stress, lifestyle)",
          "Qualified aestheticians and medical professionals",
          "Personalised treatment plans",
          "Safe, modern, and hygienic environment",
          "Seamless booking and digital support"
        ]
      }
    ],
    serviceCategories: [
      {
        title: "Professional Facials",
        items: [
          { name: "Express Facial", description: "Quick cleansing and hydration treatment", duration: "30 mins", price: "₦20,000" },
          { name: "Signature Facial", description: "Deep cleansing, exfoliation, hydration and skin barrier repair", duration: "60 mins", price: "₦35,000" },
          { name: "Advanced / Anti-Ageing Facial", description: "Anti-ageing and brightening treatments", duration: "75 mins", price: "₦50,000" }
        ]
      },
      {
        title: "Chemical Peels",
        items: [
          { name: "Light Peel", description: "Mild exfoliation for skin renewal", price: "₦40,000" },
          { name: "Medium Peel", description: "Treatment for hyperpigmentation, acne scars, fine lines", price: "₦65,000" },
          { name: "Advanced / Medical-Grade Peel", description: "Medical-grade treatment for significant skin concerns", price: "₦90,000" }
        ]
      },
      {
        title: "Dermatology Consultations",
        items: [
          { name: "Initial Consultation", description: "Skin analysis, diagnosis, and treatment recommendations", price: "₦30,000" },
          { name: "Follow-up Consultation", description: "Progress review and plan adjustment", price: "₦20,000" }
        ]
      },
      {
        title: "Corrective & Advanced Treatments",
        items: [
          { name: "Corrective Treatment Session", description: "Anti-ageing, scar and pigmentation management, skin tightening", price: "₦60,000 – ₦120,000" }
        ]
      },
      {
        title: "Lifestyle & Skin Health Coaching",
        items: [
          { name: "One-on-One Skin Health Coaching Session", description: "Skincare routines, nutrition, stress management, sleep optimisation", price: "₦25,000" }
        ]
      }
    ],
    pricingTiers: [
      {
        name: "BASIC GLOW MEMBERSHIP",
        price: "₦30,000",
        period: "/ Month",
        description: "Ideal for maintenance and first-time clients",
        features: [
          "1 professional facial per month",
          "Quarterly skin assessment",
          "Personalised home-care routine guidance",
          "Member-only treatment discounts"
        ],
        cta: "Join Basic Glow"
      },
      {
        name: "PREMIUM RADIANCE MEMBERSHIP",
        price: "₦75,000",
        period: "/ Month",
        description: "For visible transformation and corrective care",
        features: [
          "2 professional treatments per month (facials or peels)",
          "Bi-monthly skin analysis",
          "Dermatology consultation (quarterly)",
          "Lifestyle and skincare coaching",
          "Priority booking and exclusive discounts"
        ],
        highlighted: true,
        cta: "Upgrade to Premium Radiance"
      },
      {
        name: "ELITE LUMINANCE MEMBERSHIP",
        price: "₦150,000",
        period: "/ Month",
        description: "Our most comprehensive skin wellness experience",
        features: [
          "Unlimited monthly treatments (within care plan)",
          "Monthly dermatology consultations",
          "Advanced corrective and rejuvenation treatments",
          "Full lifestyle, nutrition, and skin health integration",
          "VIP priority access and concierge booking"
        ],
        cta: "Go Elite"
      }
    ],
    additionalInfo: [
      {
        title: "6-Month Packages",
        content: "Save more with our 6-month membership options:",
        bullets: [
          "Basic Glow: ₦160,000 for 6 months",
          "Premium Radiance: ₦400,000 for 6 months",
          "Elite Luminance: ₦800,000 for 6 months"
        ]
      }
    ],
    cta: {
      text: "Your skin deserves expert care and consistency. Whether you're starting small or going all-in, we have a membership that fits your lifestyle.",
      buttons: [
        { label: "Book a Consultation", href: "/contact", primary: true },
        { label: "Become a Member", href: "/contact" }
      ]
    }
  },
  dental: {
    title: "Dental Care Services",
    tagline: "Smile Better with Us. Lasting Confidence.",
    heroDescription: "At takehealth Global Ltd, we believe oral health is a vital part of whole-body wellness. A healthy mouth supports proper nutrition, boosts confidence, and reduces the risk of systemic health issues.",
    image: dentalImage,
    sections: [
      {
        title: "Our Approach",
        content: "Our Dental Care services combine preventive, restorative, and cosmetic dentistry in a comfortable, client-focused environment, designed for individuals, families, and professionals. Whether you need routine care or a complete smile transformation, our experienced dental team is here to support your health at every stage of life.",
        bullets: [
          "Qualified, patient-centred dental professionals",
          "Modern equipment & hygienic environment",
          "Integrated with your overall wellness plan",
          "Transparent pricing & flexible membership options",
          "Convenient booking & friendly support"
        ]
      }
    ],
    serviceCategories: [
      {
        title: "Preventive & General Dentistry",
        items: [
          { name: "Consultation & Oral Examination", price: "₦15,000" },
          { name: "Scaling & Polishing (Routine Cleaning)", price: "₦40,000" },
          { name: "Curettage (Deep Cleaning / Periodontal Care)", price: "₦60,000 – ₦80,000" },
          { name: "Oral Hygiene Instructions & Preventive Education", price: "Included with consultation" },
          { name: "Dental X-Ray (Per view)", price: "₦20,000" }
        ]
      },
      {
        title: "Restorative Dentistry",
        items: [
          { name: "Permanent Filling", price: "₦35,000" },
          { name: "Temporary Filling", price: "₦25,000" },
          { name: "Crown & Bridge", description: "Depending on material and case", price: "₦100,000 – ₦180,000" },
          { name: "Dentures (Removable Teeth)", price: "₦50,000" }
        ]
      },
      {
        title: "Cosmetic Dentistry",
        items: [
          { name: "Teeth Whitening (Professional)", price: "₦150,000 – ₦200,000" },
          { name: "Veneers (Per Case)", price: "₦8,000,000 – ₦12,000,000" },
          { name: "Smile Design Consultation", price: "₦30,000" }
        ]
      },
      {
        title: "Orthodontics (Braces)",
        items: [
          { name: "Fashion Braces", price: "₦1,200,000" },
          { name: "Corrective/Functional Braces", description: "Monthly adjustment & monitoring included", price: "₦1,500,000 – ₦1,800,000" }
        ]
      },
      {
        title: "Tooth Extraction",
        items: [
          { name: "Simple Tooth Extraction", price: "₦30,000 – ₦40,000" },
          { name: "Surgical Tooth Extraction", description: "Complex cases may attract additional fees", price: "₦60,000 – ₦120,000" }
        ]
      },
      {
        title: "Gum Disease Management",
        items: [
          { name: "Gum Disease Assessment & Treatment Plan", price: "₦25,000" },
          { name: "Non-Surgical Periodontal Therapy", price: "₦50,000 – ₦80,000" },
          { name: "Maintenance & Follow-up Visits (per session)", price: "₦20,000" }
        ]
      },
      {
        title: "Tooth Sensitivity Treatment",
        items: [
          { name: "Sensitivity Assessment & Diagnosis", price: "₦15,000" },
          { name: "Desensitising Treatment (per session)", price: "₦25,000 – ₦40,000" },
          { name: "Protective Sealant Application", price: "₦30,000" }
        ]
      },
      {
        title: "Bad Breath (Halitosis) Management",
        items: [
          { name: "Halitosis Assessment & Oral Health Screening", price: "₦20,000" },
          { name: "Professional Cleaning & Treatment Protocol", price: "₦40,000 – ₦60,000" },
          { name: "Lifestyle & Oral Hygiene Coaching", price: "Included" }
        ]
      },
      {
        title: "Dental Referrals & Specialist Coordination",
        items: [
          { name: "Referral Consultation & Documentation", price: "₦20,000" },
          { name: "Specialist Appointment Coordination & Follow-up", price: "₦30,000" }
        ]
      }
    ],
    pricingTiers: [
      {
        name: "BASIC DENTAL PLAN",
        price: "₦120,000",
        period: "/ Year",
        description: "Ideal for individuals seeking routine care",
        features: [
          "1 Dental Consultation",
          "1 Scaling & Polishing",
          "Oral Hygiene Instruction",
          "10% Discount on Fillings & X-Rays"
        ],
        cta: "Join Basic Plan"
      },
      {
        name: "PREMIUM DENTAL PLAN",
        price: "₦250,000",
        period: "/ Year",
        description: "For individuals and families prioritising consistent care",
        features: [
          "2 Dental Consultations",
          "2 Scaling & Polishing Sessions",
          "1 Deep Cleaning (Curettage)",
          "1 Dental X-Ray",
          "15% Discount on Fillings, Whitening & Dentures"
        ],
        highlighted: true,
        cta: "Upgrade to Premium"
      },
      {
        name: "ELITE DENTAL PLAN",
        price: "₦600,000",
        period: "/ Year",
        description: "Comprehensive dental wellness & cosmetic support",
        features: [
          "Unlimited Dental Consultations",
          "2 Scaling & Polishing",
          "1 Deep Cleaning (Curettage)",
          "Teeth Whitening (1 Session)",
          "Priority Booking",
          "20% Discount on Crowns, Braces & Veneers"
        ],
        cta: "Go Elite"
      }
    ],
    additionalInfo: [
      {
        title: "Pricing Notes",
        content: "",
        bullets: [
          "All fees are subject to clinical assessment",
          "Payment plans available for advanced procedures",
          "Members enjoy discounted rates under Dental Care Membership Packages"
        ]
      }
    ],
    cta: {
      text: "Your Smile Is an Investment in Your Health. Book your consultation today and experience dental care the takehealth way.",
      buttons: [
        { label: "Book Now", href: "/contact", primary: true },
        { label: "Join a Dental Membership", href: "/contact" },
        { label: "Fill Intake Form", href: "/dental-intake" },
        { label: "Speak to a Specialist", href: "/contact" }
      ]
    }
  },
  elite: {
    title: "Elite Sport Care",
    tagline: "Achieve Peak Performance",
    heroDescription: "Achieve peak performance with Elite Sport Care, designed for athletes and serious fitness enthusiasts. We combine sports science, performance technology, sports medicine support, and expert coaching to help you train smarter, reduce injury risk, and compete with confidence.",
    image: eliteImage,
    sections: [
      {
        title: "Who It's For",
        content: "",
        bullets: [
          "Professional & semi-professional athletes",
          "Competitive amateurs (running, football, basketball, combat sports, CrossFit, etc.)",
          "Fitness enthusiasts pursuing measurable performance gains"
        ]
      },
      {
        title: "A) Athlete Screening & Performance Testing",
        content: "Establish your baseline, identify risk factors, set targets, and track progress.",
        bullets: [
          "Athlete Intake + Goal Mapping (training history, competition calendar, lifestyle)",
          "Movement & Injury-Risk Screen (mobility, stability, asymmetry checks)",
          "Strength/Power Testing (e.g., jump tests, force profiling)",
          "Speed & Agility Testing (timing gates/sprint splits / COD tests)",
          "Endurance Metrics (field tests + HR zones; lab options where available)",
          "Body Composition (InBody or equivalent)",
          "Performance Report (action plan + training focus areas)"
        ]
      },
      {
        title: "B) Elite Performance Training & Coaching",
        content: "Improve strength, speed, agility, power, conditioning, and sport-specific performance.",
        bullets: [
          "1:1 Coaching (highly individualised)",
          "Small Group Performance Training (2–6 athletes)",
          "Sport-Specific Blocks (pre-season, in-season, peaking, return-to-play)",
          "Remote Coaching (program + tracking + check-ins)",
          "Competition Prep (taper, readiness, warm-up protocols, travel plan)"
        ]
      },
      {
        title: "C) Sports Medicine, Physiotherapy & Injury Prevention",
        content: "Keep you available for training and competition.",
        bullets: [
          "Physio Assessment & Treatment",
          "Injury Prevention Programs (prehab, joint stability, mobility protocols)",
          "Return-to-Play Planning (graded progression + testing clearance)",
          "Sports Doctor Review (by appointment)"
        ]
      },
      {
        title: "D) Recovery & Regeneration",
        content: "Reduce fatigue, improve recovery quality, and support training load.",
        bullets: [
          "Sports Massage",
          "Assisted Stretch / Mobility",
          "Compression/Boot Therapy",
          "Cold/Heat Recovery Protocols (as available)",
          "Recovery Programming (sleep, hydration, nutrition basics)"
        ]
      },
      {
        title: "E) Performance Analytics & Athlete Monitoring",
        content: "Measure what matters and adapt your plan fast.",
        bullets: [
          "Load monitoring (RPE, session load, readiness checks)",
          "HR/HRV readiness tracking (device-enabled if athlete has one)",
          "Monthly performance dashboards",
          "Technique reviews (video-assisted where appropriate)"
        ]
      }
    ],
    serviceCategories: [
      {
        title: "Assessments & Testing",
        items: [
          { name: "Athlete Intake + Goal Mapping", duration: "45–60 mins", price: "₦20,000" },
          { name: "Movement & Injury-Risk Screen", price: "₦30,000" },
          { name: "Body Composition Scan", price: "₦15,000" },
          { name: "Speed Test (timing + report)", price: "₦25,000" },
          { name: "Agility / Change-of-Direction Test", price: "₦25,000" },
          { name: "Strength & Power Profile (jump tests/field profile)", price: "₦35,000" },
          { name: "Endurance Field Test + HR Zones", price: "₦25,000" },
          { name: "Full Performance Baseline Pack", description: "Intake + movement screen + body comp + speed/agility + strength/power + report", price: "₦95,000" }
        ]
      },
      {
        title: "Training & Coaching",
        items: [
          { name: "1:1 Elite Coaching", duration: "60 mins", price: "₦25,000" },
          { name: "1:1 Elite Coaching", duration: "90 mins", price: "₦35,000" },
          { name: "Small Group Performance Training", description: "Per person", price: "₦12,000/session" },
          { name: "Monthly Remote Coaching", description: "Program + tracking + weekly check-in", price: "₦60,000" },
          { name: "Competition Prep Session", description: "Race/game readiness + warm-up plan", price: "₦30,000" }
        ]
      },
      {
        title: "Sports Medicine & Physiotherapy",
        items: [
          { name: "Physio Assessment", duration: "45–60 mins", price: "₦25,000" },
          { name: "Physio Treatment Session", price: "₦30,000" },
          { name: "Return-to-Play Testing Session", price: "₦40,000" },
          { name: "Sports Doctor Consult (Online)", price: "₦35,000" },
          { name: "Sports Doctor Consult (On-site)", price: "₦50,000" }
        ]
      },
      {
        title: "Recovery",
        items: [
          { name: "Sports Massage", duration: "45 mins", price: "₦20,000" },
          { name: "Sports Massage", duration: "60 mins", price: "₦25,000" },
          { name: "Assisted Stretch / Mobility", duration: "30 mins", price: "₦15,000" },
          { name: "Recovery Boots / Compression", duration: "20–30 mins", price: "₦10,000" },
          { name: "Recovery Combo (boots + stretch)", duration: "45 mins", price: "₦20,000" }
        ]
      }
    ],
    pricingTiers: [
      {
        name: "BASIC",
        price: "₦55,000",
        period: "/ Month",
        description: "Entry-level performance support",
        features: [
          "Athlete Intake + Goal Mapping (Month 1)",
          "Movement & Injury-Risk Screen (Quarterly)",
          "Performance Testing 1× per Quarter",
          "2 × 1:1 Coaching Sessions per month",
          "1 × Physio Treatment per month",
          "1 × Recovery Session per month",
          "Personalised Training Plan",
          "10% discount on add-ons",
          "Priority Booking"
        ],
        cta: "Join Basic"
      },
      {
        name: "PREMIUM",
        price: "₦110,000",
        period: "/ Month",
        description: "Comprehensive performance package",
        features: [
          "Athlete Intake + Goal Mapping (Month 1)",
          "Movement & Injury-Risk Screen (Bi-monthly)",
          "Performance Testing 1× per Month",
          "4 × 1:1 Coaching Sessions per month",
          "4 × Group Performance Sessions per month",
          "2 × Physio Treatment per month",
          "2 × Recovery Sessions per month",
          "Detailed Training Plan",
          "Athlete Monitoring + Monthly Report",
          "Coach Messaging Support (business hours)",
          "Competition Calendar Planning",
          "15% discount on add-ons"
        ],
        highlighted: true,
        cta: "Join Premium"
      },
      {
        name: "ELITE",
        price: "₦195,000",
        period: "/ Month",
        description: "Maximum performance support for serious athletes",
        features: [
          "Athlete Intake + Goal Mapping (Month 1)",
          "Movement & Injury-Risk Screen (Monthly)",
          "Performance Testing 2× per Month",
          "8 × 1:1 Coaching Sessions per month",
          "8 × Group Performance Sessions per month",
          "4 × Physio Treatment per month",
          "4 × Recovery Sessions per month",
          "High-performance periodisation plan",
          "Advanced Athlete Monitoring + Readiness Checks",
          "Priority Coach Messaging Support",
          "Competition Calendar with Peak/Taper Planning",
          "20% discount on add-ons"
        ],
        cta: "Join Elite"
      }
    ],
    additionalInfo: [
      {
        title: "Multi-month Savings",
        content: "",
        bullets: [
          "Quarterly: 5% off",
          "Bi-annual: 8% off",
          "Annual: 12% off"
        ]
      },
      {
        title: "Team / Club Packages",
        content: "Great for football academies, basketball teams, track clubs, and corporate teams.",
        bullets: [
          "Team Baseline Day (up to 15 athletes): ₦450,000",
          "Monthly Team Performance Support (10–20 athletes): from ₦900,000/month"
        ]
      },
      {
        title: "Client Journey",
        content: "1. Baseline Assessment → 2. Personalized Plan → 3. Training + Recovery + Physio → 4. Monthly Testing & Review → 5. Competition Readiness"
      }
    ],
    cta: {
      text: "Ready to elevate your performance? Join our elite athlete community today.",
      buttons: [
        { label: "Get Started", href: "/contact", primary: true },
        { label: "Book Assessment", href: "/contact" },
        { label: "Fill Intake Form", href: "/elite-sport-intake" }
      ]
    }
  },
  "elite-sport": {
    title: "Elite Sport Care",
    tagline: "Achieve Peak Performance",
    heroDescription: "Achieve peak performance with Elite Sport Care, designed for athletes and serious fitness enthusiasts. We combine sports science, performance technology, sports medicine support, and expert coaching to help you train smarter, reduce injury risk, and compete with confidence.",
    image: "/elite-sports-care.jpg.jpeg",
    sections: [
      {
        title: "Who It's For",
        content: "",
        bullets: [
          "Professional & semi-professional athletes",
          "Competitive amateurs (running, football, basketball, combat sports, CrossFit, etc.)",
          "Fitness enthusiasts pursuing measurable performance gains"
        ]
      },
      {
        title: "A) Athlete Screening & Performance Testing",
        content: "Establish your baseline, identify risk factors, set targets, and track progress.",
        bullets: [
          "Athlete Intake + Goal Mapping (training history, competition calendar, lifestyle)",
          "Movement & Injury-Risk Screen (mobility, stability, asymmetry checks)",
          "Strength/Power Testing (e.g., jump tests, force profiling)",
          "Speed & Agility Testing (timing gates/sprint splits / COD tests)",
          "VO2 Max / Cardio Capacity Testing",
          "Body Composition Analysis",
          "Flexibility & Range of Motion Assessment",
          "Sport-Specific Movement Analysis"
        ]
      },
      {
        title: "B) Performance Training & Coaching",
        content: "Expert-led, periodised training programs tailored to your sport and goals.",
        bullets: [
          "1:1 Coaching Sessions (technical, tactical, physical)",
          "Group Performance Sessions (sport-specific drills, conditioning)",
          "Periodisation Planning (pre-season, in-season, post-season)",
          "Sport-Specific Skill Development",
          "Strength & Conditioning",
          "Speed, Agility & Quickness (SAQ)",
          "Endurance Training",
          "Mental Skills & Competition Preparation"
        ]
      },
      {
        title: "C) Physiotherapy & Sports Medicine",
        content: "Prevent, treat, and recover from injuries with expert sports medicine support.",
        bullets: [
          "Injury Assessment & Diagnosis",
          "Manual Therapy & Soft Tissue Work",
          "Sports Massage & Myofascial Release",
          "Joint Mobilisation & Manipulation",
          "Electrotherapy (e.g., TENS, NMES, Shockwave)",
          "Exercise Prescription for Rehabilitation",
          "Return-to-Sport Protocols",
          "On-site / On-call Support for Competitions"
        ]
      },
      {
        title: "D) Recovery & Regeneration",
        content: "Optimise recovery between sessions to train harder and compete better.",
        bullets: [
          "Recovery Sessions (contrast therapy, stretching, mobility)",
          "Nutrition & Hydration Guidance for Athletes",
          "Sleep Optimization Strategies",
          "Stress Management & Mental Resilience",
          "Body Maintenance & Maintenance Massage"
        ]
      },
      {
        title: "E) Athlete Monitoring & Support",
        content: "Track your progress and stay ahead of fatigue, soreness, and overtraining.",
        bullets: [
          "Training Load Monitoring (RPE, heart rate variability)",
          "Readiness to Train Assessments",
          "Wellness Check-ins (weekly / monthly)",
          "Progress Reports & Adjustments"
        ]
      }
    ],
    pricingTiers: [
      {
        name: "BASIC",
        price: "₦65,000",
        period: "/ Month",
        description: "Foundational support for developing athletes",
        features: [
          "Athlete Intake + Goal Mapping (Month 1)",
          "Movement & Injury-Risk Screen (Quarterly)",
          "Performance Testing 1× per Quarter",
          "2 × 1:1 Coaching Sessions per month",
          "1 × Physio Treatment per month",
          "1 × Recovery Session per month",
          "Personalised Training Plan",
          "10% discount on add-ons",
          "Priority Booking"
        ],
        cta: "Join Basic"
      },
      {
        name: "PREMIUM",
        price: "₦110,000",
        period: "/ Month",
        description: "Comprehensive performance package",
        features: [
          "Athlete Intake + Goal Mapping (Month 1)",
          "Movement & Injury-Risk Screen (Bi-monthly)",
          "Performance Testing 1× per Month",
          "4 × 1:1 Coaching Sessions per month",
          "4 × Group Performance Sessions per month",
          "2 × Physio Treatment per month",
          "2 × Recovery Sessions per month",
          "Detailed Training Plan",
          "Athlete Monitoring + Monthly Report",
          "Coach Messaging Support (business hours)",
          "Competition Calendar Planning",
          "15% discount on add-ons"
        ],
        highlighted: true,
        cta: "Join Premium"
      },
      {
        name: "ELITE",
        price: "₦195,000",
        period: "/ Month",
        description: "Maximum performance support for serious athletes",
        features: [
          "Athlete Intake + Goal Mapping (Month 1)",
          "Movement & Injury-Risk Screen (Monthly)",
          "Performance Testing 2× per Month",
          "8 × 1:1 Coaching Sessions per month",
          "8 × Group Performance Sessions per month",
          "4 × Physio Treatment per month",
          "4 × Recovery Sessions per month",
          "High-performance periodisation plan",
          "Advanced Athlete Monitoring + Readiness Checks",
          "Priority Coach Messaging Support",
          "Competition Calendar with Peak/Taper Planning",
          "20% discount on add-ons"
        ],
        cta: "Join Elite"
      }
    ],
    additionalInfo: [
      {
        title: "Multi-month Savings",
        content: "",
        bullets: [
          "Quarterly: 5% off",
          "Bi-annual: 8% off",
          "Annual: 12% off"
        ]
      },
      {
        title: "Team / Club Packages",
        content: "Great for football academies, basketball teams, track clubs, and corporate teams.",
        bullets: [
          "Team Baseline Day (up to 15 athletes): ₦450,000",
          "Monthly Team Performance Support (10–20 athletes): from ₦900,000/month"
        ]
      },
      {
        title: "Client Journey",
        content: "1. Baseline Assessment → 2. Personalized Plan → 3. Training + Recovery + Physio → 4. Monthly Testing & Review → 5. Competition Readiness"
      }
    ],
    cta: {
      text: "Ready to elevate your performance? Join our elite athlete community today.",
      buttons: [
        { label: "Get Started", href: "/contact", primary: true },
        { label: "Book Assessment", href: "/contact" },
        { label: "Fill Intake Form", href: "/elite-sport-intake" }
      ]
    }
  },
  rehab: {
    title: "Rehabilitative Care",
    tagline: "Recover Stronger",
    heroDescription: "Recover stronger with our specialised Rehabilitative Care. Our physical therapists and rehab specialists provide personalised programs to help you heal from injuries, manage chronic conditions, or regain peak mobility.",
    image: rehabImage,
    sections: [
      {
        title: "Why Choose Rehabilitative Care?",
        content: "We integrate rehabilitation with fitness training so you regain strength, flexibility, and confidence while preventing future problems.",
        bullets: [
          "Customised Therapy Plans: Tailored programs for injury recovery, post-surgery rehab, chronic pain management, and mobility improvement",
          "Expert Techniques: Evidence-based methods to restore strength, flexibility, balance, and function",
          "Integrated Approach: Collaboration with our trainers to transition smoothly back to full activity, blending rehab with overall wellness",
          "Supportive Environment: Encouragement and guidance every step of the way, ensuring your recovery journey is empowering and motivating"
        ]
      },
      {
        title: "Additional Benefits Across Packages",
        content: "",
        bullets: [
          "Integrated guidance with fitness and lifestyle coaching",
          "Personalised mobility and recovery exercises",
          "Access to supportive community sessions and wellness events"
        ]
      },
      {
        title: "How to Get Started",
        content: "",
        bullets: [
          "1. Book a Consultation: Schedule your initial assessment online or via WhatsApp",
          "2. Choose Your Package: Select Basic, Premium, or Elite based on your recovery goals",
          "3. Begin Your Journey: Our specialists guide you step by step toward strength, mobility, and confidence"
        ]
      }
    ],
    pricingTiers: [
      {
        name: "BASIC",
        price: "₦380,000",
        period: "/ 1 Month",
        description: "Essential rehabilitation support",
        features: [
          "Initial assessment & personalised therapy plan",
          "2 rehab sessions per week",
          "Access to group rehab classes"
        ],
        cta: "Join Basic"
      },
      {
        name: "PREMIUM",
        price: "₦420,000",
        period: "/ 2 Months",
        description: "Enhanced recovery with progress tracking",
        features: [
          "All Basic features",
          "3 rehab sessions per week",
          "Progress tracking & weekly review with therapist",
          "Access to rehabilitation resources and home exercise plan"
        ],
        highlighted: true,
        cta: "Join Premium"
      },
      {
        name: "ELITE",
        price: "₦540,000",
        period: "/ 3 Months",
        description: "Comprehensive daily rehabilitation",
        features: [
          "All Premium features",
          "Daily therapy sessions (6/week)",
          "One-on-one coaching with a senior rehab specialist",
          "Priority booking & ongoing lifestyle support"
        ],
        cta: "Join Elite"
      }
    ],
    cta: {
      text: "Take the first step towards reclaiming your body. Your recovery is a journey, and we are here to guide you at every stage.",
      buttons: [
        { label: "Book Now", href: "/contact", primary: true },
        { label: "Schedule Consultation", href: "/contact" }
      ]
    }
  },
  nutrition: {
    title: "Nutritional Care Services",
    tagline: "Nourish Your Body. Fuel Your Life.",
    heroDescription: "At takehealth Global Ltd, Nutritional Care is more than food plans; it's a lifestyle strategy. We believe nutrition is the foundation that connects movement, recovery, mental clarity, and long-term health.",
    image: nutritionImage,
    sections: [
      {
        title: "Preventive Nutritional Care",
        content: "Stay ahead of health challenges with proactive, evidence-informed nutrition support.",
        bullets: [
          "Nutrition Workshops: Practical education on healthy eating for disease prevention and long-term vitality",
          "Dietary Assessments: Identify nutritional risk factors linked to high blood pressure, diabetes, and metabolic issues",
          "Basic Health Screenings: BMI, blood pressure, and lifestyle risk profiling",
          "Fitness-Integrated Wellness Sessions: Nutrition support aligned with group fitness programs"
        ]
      },
      {
        title: "Promotive Nutritional Services",
        content: "Optimise your body for performance, energy, and everyday excellence.",
        bullets: [
          "Personalised Meal Plans: Tailored to your fitness goals, work schedule, and lifestyle",
          "Weight Management Programs: Healthy, realistic weight loss or weight gain strategies",
          "Sports Nutrition Counselling: Fueling plans for athletes and active individuals",
          "Mindful Eating Workshops: Build a healthy relationship with food and eating",
          "Nutritional Healing Challenge: 30-Day Nutritional Healing Program – 'Food as Medicine. Healing from Within.'"
        ]
      },
      {
        title: "Curative & Therapeutic Nutrition",
        content: "Targeted nutrition support for medical and recovery needs.",
        bullets: [
          "Therapeutic Diet Plans: For conditions such as diabetes, hypertension, arthritis and metabolic disorders",
          "Medical Nutrition Therapy (MNT): Nutrition care for clinical conditions, including kidney disease",
          "Post-Workout Nutrition Guidance: Enhance recovery, muscle repair, and strength gains",
          "One-on-One Nutrition Counselling: Address specific health concerns with professional guidance"
        ]
      },
      {
        title: "Online & Virtual Nutrition Consultations",
        content: "Expert Care, Anywhere You Are",
        bullets: [
          "One-on-one nutrition sessions via Zoom or WhatsApp",
          "Ideal for busy professionals or remote clients",
          "Same quality care, flexible access"
        ]
      },
      {
        title: "How It Works",
        content: "",
        bullets: [
          "1. Book Online: Choose your preferred time slot",
          "2. Consultation & Assessment: In-person or virtual",
          "3. Personalised Plan: Diet plans and recommendations shared via email or WhatsApp",
          "4. Track Progress: Use our wellness app for fitness and nutrition monitoring",
          "5. Ongoing Support: Regular check-ins and plan adjustments"
        ]
      }
    ],
    pricingTiers: [
      {
        name: "FIT START BUNDLE",
        price: "From ₦50,000",
        period: "",
        description: "Ideal for beginners starting their wellness journey",
        features: [
          "Regular: 1 month gym + 1 nutrition session – ₦50,000",
          "Premium: 2 months gym + 2 nutrition sessions – ₦100,000",
          "Classic: 3 months gym + 3 nutrition sessions – ₦150,000"
        ],
        cta: "Join Fit Start"
      },
      {
        name: "HEALTH BOOST BUNDLE",
        price: "From ₦120,000",
        period: "",
        description: "For consistency, accountability, and steady progress",
        features: [
          "Regular: 1 month gym + weekly nutrition check-ins – ₦120,000",
          "Premium: 2 months gym + weekly nutrition check-ins – ₦150,000",
          "Classic: 3 months gym + weekly nutrition check-ins – ₦180,000"
        ],
        highlighted: true,
        cta: "Boost Your Health"
      },
      {
        name: "NEW YOU BUNDLE",
        price: "From ₦150,000",
        period: "",
        description: "Total lifestyle reset with personalised nutrition support",
        features: [
          "Regular: 1 month gym + personalised meal plan + weekly check-ins – ₦150,000",
          "Premium: 2 months gym + personalised meal plan + weekly check-ins – ₦180,000",
          "Classic: 3 months gym + personalised meal plan + weekly check-ins – ₦200,000"
        ],
        cta: "Start Your New You"
      }
    ],
    additionalInfo: [
      {
        title: "Sports Fit Bundle",
        content: "Designed for athletes and high-performance individuals. Includes gym access, sports nutrition counselling, and fitness and performance tracking.",
        bullets: []
      },
      {
        title: "Manage & Thrive Bundle",
        content: "Support for clients managing chronic health conditions. Includes gym access and therapeutic diet plans for medical conditions. From ₦50,000.",
        bullets: []
      },
      {
        title: "Group & Family Deals",
        content: "Wellness is better together. Special discounts for friends, families, and group sign-ups. Ideal for accountability and shared lifestyle change.",
        bullets: []
      }
    ],
    cta: {
      text: "Nutrition is not about restriction; it's about empowerment. Let our experts help you eat with purpose, fuel your goals, and build habits that last.",
      buttons: [
        { label: "Book Your Nutrition Consultation", href: "/contact", primary: true },
        { label: "Start Your Wellness Journey", href: "/contact" }
      ]
    }
  },
  counselling: {
    title: "Counselling Services",
    tagline: "Your Mental Health Matters",
    heroDescription: "Our Counselling services provide a confidential, caring space to work through stress, anxiety, relationship challenges, grief, burnout, and life transitions, guided by compassionate professionals using evidence-based approaches.",
    image: counsellingImage,
    sections: [
      {
        title: "Who This Is For",
        content: "",
        bullets: [
          "Adults, adolescents, couples, families",
          "Professionals managing stress, burnout, or work-life pressure",
          "Clients seeking faith-based counselling that integrates psychotherapy with spiritual beliefs, scripture, and prayer (optional)"
        ]
      }
    ],
    serviceCategories: [
      {
        title: "Intake & Planning",
        items: [
          { name: "Initial Psychological Intake", description: "History, goals, care plan, referral guidance if needed", duration: "60 mins", price: "₦30,000" },
          { name: "Follow-up Therapy Session", duration: "50 mins", price: "₦30,000" },
          { name: "Extended Therapy Session", duration: "80 mins", price: "₦40,000" }
        ]
      },
      {
        title: "Specialised 1:1 Therapy Tracks (50 mins each)",
        items: [
          { name: "Stress & Anxiety Management (CBT skills)", price: "₦30,000" },
          { name: "Depression Support & Motivation Coaching", price: "₦30,000" },
          { name: "Trauma-Informed Counselling", price: "₦35,000" },
          { name: "Grief & Loss Counselling", price: "₦30,000" },
          { name: "Life Transitions (career, relocation, motherhood/fatherhood)", price: "₦30,000" },
          { name: "Faith-Based Counselling (optional prayer/scripture integration)", price: "₦30,000" }
        ]
      },
      {
        title: "Relationship & Family",
        items: [
          { name: "Couples/Marriage Counselling", duration: "60 mins", price: "₦50,000" },
          { name: "Family Therapy", duration: "75 mins", price: "₦50,000" },
          { name: "Pre-marital Counselling Programme", description: "4 sessions", price: "₦150,000" }
        ]
      },
      {
        title: "Group Therapy & Support Circles (per person)",
        items: [
          { name: "Stress Reset Group (weekly)", price: "₦15,000/session" },
          { name: "Grief Support Circle", price: "₦15,000/session" },
          { name: "Mindfulness & Emotional Regulation Group", price: "₦15,000/session" }
        ]
      },
      {
        title: "Wellness Coaching & Mindfulness",
        items: [
          { name: "Wellness Coaching", description: "Habits, routines, accountability, motivation, productivity", duration: "50 mins", price: "₦30,000" },
          { name: "Mindfulness Coaching", duration: "30 mins", price: "₦15,000" },
          { name: "Breathing & Grounding Skills Session", duration: "20 mins", price: "₦10,000" }
        ]
      },
      {
        title: "Mental Health Check-ups & Screening",
        items: [
          { name: "Stress/Burnout Screening + Brief Report", price: "₦25,000" },
          { name: "Sleep & Fatigue Review + Plan", price: "₦125,000" },
          { name: "Goal & Values Mapping (clarity session)", price: "₦25,000" }
        ]
      },
      {
        title: "Session Bundles (Save More)",
        items: [
          { name: "4 Therapy Sessions (50 mins)", price: "₦92,000" },
          { name: "8 Therapy Sessions", price: "₦176,000" },
          { name: "12 Therapy Sessions", price: "₦252,000" },
          { name: "Couples Bundle (4 sessions)", price: "₦148,000" }
        ]
      }
    ],
    pricingTiers: [
      {
        name: "BASIC",
        price: "₦75,000",
        period: "/ Month",
        description: "Best for maintenance and mild to moderate stress support",
        features: [
          "1× Intake/Review session (Month 1 only)",
          "2× 1:1 therapy sessions (50 mins)",
          "1× group session (any available group)",
          "1× mindfulness mini-session (20–30 mins)",
          "10% discount on extra sessions"
        ],
        cta: "Join Basic"
      },
      {
        name: "PREMIUM",
        price: "₦150,000",
        period: "/ Month",
        description: "Best for active goals, anxiety/stress management, and consistent coaching",
        features: [
          "1× intake/review (Month 1) + monthly progress review",
          "4× 1:1 therapy sessions",
          "2× group sessions",
          "2× mindfulness/coaching sessions",
          "Between-session support (business hours) via check-in messages",
          "15% discount on add-ons"
        ],
        highlighted: true,
        cta: "Join Premium"
      },
      {
        name: "ELITE",
        price: "₦295,000",
        period: "/ Month",
        description: "Best for high-pressure professionals, athletes, founders, or complex life transitions",
        features: [
          "1× intake + monthly structured care plan",
          "8× 1:1 therapy sessions",
          "4× group sessions",
          "4× mindfulness/coaching sessions",
          "Priority booking + faster rescheduling options",
          "20% discount on add-ons",
          "Quarterly wellbeing review report (stress, sleep, habits, progress)"
        ],
        cta: "Join Elite"
      }
    ],
    additionalInfo: [
      {
        title: "Member Add-Ons (Top-ups)",
        content: "",
        bullets: [
          "Extra 1:1 Therapy (50 mins): ₦23,000 / ₦21,000 / ₦19,000 (Basic/Premium/Elite)",
          "Extra Couples Session (60 mins): ₦38,000 / ₦35,000 / ₦32,000",
          "Extra Group Session: ₦9,000 / ₦8,500 / ₦8,000"
        ]
      },
      {
        title: "Online Counselling & Logistics",
        content: "",
        bullets: [
          "Virtual sessions available via Zoom/WhatsApp/takehealth Wellness App",
          "Clients book time slots online",
          "Payment via transfer/bank payment",
          "Session summaries/resources shared via email/WhatsApp"
        ]
      },
      {
        title: "Important Note (Safety)",
        content: "Counselling supports wellbeing but is not an emergency service. If you or someone is in immediate danger, seek urgent help immediately (go to the nearest emergency facility or call your local emergency services).",
        bullets: []
      }
    ],
    cta: {
      text: "Get started on the path to emotional well-being – reach out for support and feel the difference today.",
      buttons: [
        { label: "Book a Session", href: "/contact", primary: true },
        { label: "Fill Intake Form", href: "/counselling-intake" },
        { label: "Join a Membership", href: "/contact" }
      ]
    }
  },
  health360: {
    title: "Health360+ Program",
    tagline: "Where Fitness Meets Function and Feelings",
    heroDescription: "Our signature Health360+ Program combines all our services into a single, adaptive plan tailored to your goals. Designed for busy professionals, post-op clients, athletes, and anyone seeking true balance.",
    image: gymImage,
    sections: [
      {
        title: "What's Included",
        content: "Health360+ is your all-in-one, adaptive wellness plan.",
        bullets: [
          "Monthly Body Assessments & Progress Reviews",
          "Customized Fitness + Therapy Plans",
          "Mental Health Check-ins",
          "Nutrition Guidance",
          "Exclusive Community Events"
        ]
      }
    ],
    pricingTiers: [
      {
        name: "HEALTH360+ BASIC",
        price: "₦260,000",
        period: "/ Month",
        description: "Best for busy professionals, wellness starters, weight loss + stress control",
        features: [
          "Gym (Premium): coaching + progress check-ins",
          "Nutrition (Health Boost style): weekly nutrition check-ins",
          "Mental wellness (Counselling Basic): 2× 1:1 therapy + 1× group + 1× mindfulness",
          "Recovery (Spa Basic): 2× massages + member discounts",
          "Monthly Health360+ review (body metrics + goal reset)",
          "Community access (member wellness events)"
        ],
        cta: "Join Basic"
      },
      {
        name: "HEALTH360+ PREMIUM",
        price: "₦470,000",
        period: "/ Month",
        description: "Best for transformation goals, high-pressure lifestyles, consistent results",
        features: [
          "Gym (Elite): comprehensive fitness testing/body assessment + tracking",
          "Nutrition (New You style): personalised meal plan + weekly check-ins",
          "Mental wellness (Counselling Premium): 4× 1:1 therapy + 2× group + monthly review",
          "Recovery (Spa Premium): 4× massage sessions + 1× body scrub/wrap",
          "Skin (Basic Glow): 1 professional facial/month + quarterly skin assessment",
          "Community access"
        ],
        highlighted: true,
        cta: "Join Premium"
      },
      {
        name: "HEALTH360+ ELITE",
        price: "₦795,000",
        period: "/ Month",
        description: "Best for executives, athletes, post-op/high-support clients wanting full integration",
        features: [
          "Gym (Elite): testing + performance tracking + goal reviews",
          "Nutrition (New You + clinical flexibility): meal plan + therapeutic diets/MNT",
          "Mental wellness (Counselling Elite): 8× 1:1 therapy + 4× group + quarterly wellbeing report",
          "Recovery (Spa Elite): weekly massage + 2 spa treatments + monthly signature package",
          "Skin (Elite Luminance): advanced corrective care + monthly dermatology consults",
          "Community access"
        ],
        cta: "Join Elite"
      }
    ],
    additionalInfo: [
      {
        title: "Optional Track Add-ons",
        content: "",
        bullets: [
          "Athlete / Performance Track (Elite Sport Care): Basic ₦55,000 | Premium ₦110,000 | Elite ₦195,000 per month",
          "Post-op / Rehab Track (Rehabilitative Care): Basic ₦380,000 (1 month) | Premium ₦420,000 (2 months) | Elite ₦540,000 (3 months)",
          "Dental Care Add-on (Annual): Basic ₦120,000/year | Premium ₦250,000/year | Elite ₦600,000/year"
        ]
      },
      {
        title: "Multi-month Savings",
        content: "",
        bullets: [
          "Basic (₦260k/month): Quarterly ₦741,000 | 6 months ₦1,435,200 | Annual ₦2,745,600",
          "Premium (₦470k/month): Quarterly ₦1,339,500 | 6 months ₦2,594,400 | Annual ₦4,963,200",
          "Elite (₦795k/month): Quarterly ₦2,265,750 | 6 months ₦4,388,400 | Annual ₦8,395,200"
        ]
      },
      {
        title: "Pricing Disclaimer",
        content: "All prices listed are indicative and subject to professional assessment. Final plans and fees may vary based on individual condition, treatment goals, and clinical recommendations. Prices are subject to changes without prior notice. A consultation is required before the commencement of advanced or corrective therapy.",
        bullets: []
      }
    ],
    cta: {
      text: "Live better with an integrated path to health.",
      buttons: [
        { label: "Join Health360+ Today", href: "/contact", primary: true },
        { label: "Book Consultation", href: "/contact" }
      ]
    }
  }
};
