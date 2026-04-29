import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Health360+", href: "/health360" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  // Dynamic classes based on scroll and page
  const getNavBgClass = () => {
    if (isHomePage && !isScrolled) {
      return "bg-white";
    }
    return "bg-white";
  };

  const getTextColorClass = () => {
    if (isHomePage && !isScrolled) {
      return "text-gray-800";
    }
    return "text-gray-800";
  };

  const getLinkHoverClass = () => {
    if (isHomePage && !isScrolled) {
      return "hover:text-gray-900 hover:bg-gray-100";
    }
    return "hover:text-gray-900 hover:bg-gray-100";
  };

  const getActiveLinkClass = () => {
    if (isHomePage && !isScrolled) {
      return "bg-gray-200 text-gray-900";
    }
    return "bg-gray-200 text-gray-900";
  };

  const getMobileMenuBgClass = () => {
    if (isHomePage && !isScrolled) {
      return "bg-white";
    }
    return "bg-white";
  };

  const getMobileTextColorClass = () => {
    if (isHomePage && !isScrolled) {
      return "text-gray-800";
    }
    return "text-gray-800";
  };

  const getMobileLinkHoverClass = () => {
    if (isHomePage && !isScrolled) {
      return "hover:text-gray-900";
    }
    return "hover:text-gray-900";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getNavBgClass()} ${
        isScrolled ? "shadow-lg shadow-emerald-900/20" : ""
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <nav className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="takehealth Logo"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${getTextColorClass()} ${getLinkHoverClass()} ${
                  isActive(link.href)
                    ? getActiveLinkClass()
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="ghost"
              asChild
              className={`${getTextColorClass()} hover:bg-gray-100 hover:text-gray-900`}
            >
              <Link to="/login">Sign In</Link>
            </Button>
            <Button
              asChild
              className="bg-[#7FB25A] hover:bg-[#6a9f4b] text-white border-0"
            >
              <Link to="/get-started">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`lg:hidden p-2 ${getTextColorClass()}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden ${getMobileMenuBgClass()} border-t border-gray-200`}
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-gray-900 font-bold"
                      : `${getMobileTextColorClass()} ${getMobileLinkHoverClass()}`
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 space-y-3 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-800 hover:bg-gray-100"
                  asChild
                >
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button
                  className="w-full bg-[#7FB25A] hover:bg-[#6a9f4b] text-white"
                  asChild
                >
                  <Link to="/get-started" onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
