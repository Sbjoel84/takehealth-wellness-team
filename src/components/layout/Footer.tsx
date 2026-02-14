import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  services: [
    { label: "Gym", href: "/services/gym" },
    { label: "Spa & Massage", href: "/services/spa" },
    { label: "Skin Care", href: "/services/skincare" },
    { label: "Dental Care", href: "/services/dental" },
    { label: "Elite Sport Care", href: "/services/elite" },
    { label: "Rehabilitative Care", href: "/services/rehab" },
    { label: "Nutritional Care", href: "/services/nutrition" },
    { label: "Counselling", href: "/services/counselling" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Health360+ Program", href: "/health360" },
    { label: "Careers", href: "/careers" },
    { label: "Newsroom", href: "/news" },
    { label: "Partner With Us", href: "/partners" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faqs" },
    { label: "Help Center", href: "/help" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy-green text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/20">
        <div className="container mx-auto px-4 md:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-2xl font-semibold">Stay Connected. Stay Inspired.</h3>
              <p className="text-white/80 mt-1">
                Get wellness tips, exclusive offers, and updates delivered to your inbox.
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 w-full md:w-72"
              />
              <Button variant="secondary">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img 
                src="/logo.svg" 
                alt="takehealth Logo" 
                className="h-14 object-contain"
              />
            </Link>
            <p className="text-white/80 mb-4 max-w-sm">
              Move Better. Feel Better. Live Fully. Your partner in total wellness through
              integrated fitness, lifestyle medicine, and wellness care.
            </p>
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>B02 - B09 Premium Plaza, Plot 759 Akpabuyo Street, Kubwa, FCT Nigeria</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+234 901 358 9375</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@takehealthglobal.com</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/80">
              © {new Date().getFullYear()} takehealth Global Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com/takehealthNG"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/takehealthng"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/takehealthNG"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
