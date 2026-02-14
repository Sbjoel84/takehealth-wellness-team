import React from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

interface Feature {
  text: string;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  subtext?: string;
  features: string[];
  tier: "basic" | "premium" | "elite" | "enterprise";
  ctaLink?: string;
  isPopular?: boolean;
}

interface PricingCardProps {
  plan: Plan;
  onSelect?: (planId: string) => void;
}

function PricingCard({ plan, onSelect }: PricingCardProps) {
  const tierStyles = {
    basic: {
      border: "border-blue-200",
      badge: "bg-blue-100 text-blue-700",
      badgeIcon: "bg-blue-500",
      header: "bg-blue-50",
      button: "bg-blue-600 text-white hover:bg-blue-700",
      icon: "text-blue-500",
    },
    premium: {
      border: "border-amber-200",
      badge: "bg-amber-100 text-amber-700",
      badgeIcon: "bg-amber-500",
      header: "bg-amber-50",
      button: "bg-amber-500 text-white hover:bg-amber-600",
      icon: "text-amber-500",
    },
    elite: {
      border: "border-green-200",
      badge: "bg-green-100 text-green-700",
      badgeIcon: "bg-green-500",
      header: "bg-green-50",
      button: "bg-green-600 text-white hover:bg-green-700",
      icon: "text-green-500",
    },
    enterprise: {
      border: "border-yellow-300",
      badge: "bg-yellow-100 text-yellow-700",
      badgeIcon: "bg-yellow-500",
      header: "bg-yellow-50",
      button: "bg-yellow-500 text-white hover:bg-yellow-600",
      icon: "text-yellow-500",
    },
  };

  const style = tierStyles[plan.tier];

  return (
    <div className={`flex flex-col rounded-2xl border-2 ${style.border} bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300`}>
      {/* Plan Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.badge}`}>
          <span className={`w-2 h-2 rounded-full ${style.badgeIcon}`} />
          {plan.tier.charAt(0).toUpperCase() + plan.tier.slice(1)} Membership
        </span>
      </div>

      {/* Plan Title */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
      </div>

      {/* Short Description */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">{plan.description}</p>
      </div>

      {/* Pricing Section */}
      <div className="mb-2">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
          <span className="text-gray-500">{plan.period}</span>
        </div>
        {plan.subtext && (
          <p className="text-xs text-gray-500 mt-1">{plan.subtext}</p>
        )}
      </div>

      {/* Primary Action Button */}
      <div className="mb-6">
        <Link
          to={plan.ctaLink || "#"}
          onClick={() => onSelect?.(plan.id)}
          className={`block w-full py-3 px-4 rounded-xl text-center font-medium transition-colors duration-200 ${style.button}`}
        >
          Join Now
        </Link>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-6" />

      {/* Feature List */}
      <div className="flex-1">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className={`w-5 h-5 ${style.icon} shrink-0 mt-0.5`} />
              <span className="text-sm text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface ServicesPlanSectionProps {
  title?: string;
  subtitle?: string;
  plans: Plan[];
  onPlanSelect?: (planId: string) => void;
}

export function ServicesPlanSection({
  title = "Membership Plans",
  subtitle,
  plans,
  onPlanSelect,
}: ServicesPlanSectionProps) {
  return (
    <div className="w-full py-12">
      {/* Section Header */}
      {(title || subtitle) && (
        <div className="text-center mb-10">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          )}
          {subtitle && (
            <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} onSelect={onPlanSelect} />
        ))}
      </div>
    </div>
  );
}

export default ServicesPlanSection;
