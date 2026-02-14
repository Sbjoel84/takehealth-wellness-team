import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceCard } from "@/components/ui/ServiceCard";

import gymImage from "@/assets/service-gym.jpeg";
import spaImage from "@/assets/massage.jpg";
import skinImage from "@/assets/service-skincare.jpg";
import dentalImage from "@/assets/service-dental.jpg";
import eliteImage from "@/assets/service-elite.jpg";
import rehabImage from "@/assets/service-rehab.jpeg";
import nutritionImage from "@/assets/Nutrition Care.jpg";
import counsellingImage from "@/assets/Counselling.jpg";

const services = [
  {
    title: "Gym Services",
    description:
      "Unlock your potential at our fully equipped gym. Expert trainers and modern equipment ensure every workout is safe, effective, and fun.",
    image: gymImage,
    href: "/services",
  },
  {
    title: "Spa & Massage Therapy",
    description:
      "Experience deep relaxation and healing with our Massage Therapy services. Our certified therapists use a variety of techniques tailored to your needs.",
    image: spaImage,
    href: "/services",
  },
  {
    title: "Skin Care",
    description:
      "Glow from the outside in with our comprehensive Skin Care services. Advanced treatments like facials, peels, and dermatology consultations.",
    image: skinImage,
    href: "/services",
  },
  {
    title: "Dental Care",
    description:
      "A bright, healthy smile is vital for overall wellness. From routine cleanings to cosmetic dentistry in a comfortable environment.",
    image: dentalImage,
    href: "/services",
  },
  {
    title: "Elite Sport Care",
    description:
      "Achieve peak performance with our Elite Sport Care services, designed for athletes and serious fitness enthusiasts.",
    image: eliteImage,
    href: "/services",
  },
  {
    title: "Rehabilitative Care",
    description:
      "Recover stronger with our specialised Rehabilitative Care. Personalized programs to help you heal from injuries or manage chronic conditions.",
    image: rehabImage,
    href: "/services",
  },
  {
    title: "Nutritional Care",
    description:
      "Nourish Your Body. Fuel Your Life. Expert-led nutritional services to prevent disease, enhance performance, and build sustainable habits.",
    image: nutritionImage,
    href: "/services",
  },
  {
    title: "Counselling",
    description:
      "Your mental health matters. Support through one-on-one therapy, group sessions, and wellness coaching for balance and resilience.",
    image: counsellingImage,
    href: "/services",
  },
];

export function ServicesSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeader
          label="Our Services"
          title="Holistic 360° Wellness"
          description="From fitness to mental well-being, rehabilitation to lifestyle services — we offer a complete ecosystem for your health journey."
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.title} {...service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
