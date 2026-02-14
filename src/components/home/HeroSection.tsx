import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SVGOverlay } from "./SVGOverlay";

// Slides data
const slides = [
  {
    src: "/assets/hero 1.jpeg",
    title: "Your Health, Our Priority",
    subtitle: "Book trusted professionals in seconds.",
  },
  {
    src: "/assets/hero 2.jpeg",
    title: "Seamless Appointments",
    subtitle: "Manage your healthcare effortlessly.",
  },
  {
    src: "/assets/hero 3.jpeg",
    title: "Secure Medical Records",
    subtitle: "Your data protected and accessible anytime.",
  },
  {
    src: "/assets/hero 4.jpeg",
    title: "Wellness That Fits Your Life",
    subtitle: "Book trusted professionals in seconds.",
  },
  {
    src: "/assets/hero 5.jpeg",
    title: "Stronger Every Day",
    subtitle: "Personalized fitness programs designed for real results.",
  },
  {
    src: "/assets/hero 6.jpg",
    title: "Mind and Body in Balance",
    subtitle: "Improve energy, focus, and overall wellbeing naturally.",
  },
];

// Throttle function for performance
function throttle<T extends (...args: Parameters<T>) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position for parallax (normalized 0-1)
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  // Motion values for smooth parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring animations for smooth parallax
  const springConfig = { damping: 20, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Throttled mouse move handler
  const handleMouseMove = useCallback(
    throttle((e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / rect.width;
      const mouseY = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x: mouseX, y: mouseY });
      x.set((e.clientX - rect.left - rect.width / 2) / rect.width);
      y.set((e.clientY - rect.top - rect.height / 2) / rect.height);
    }, 16),
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    setMousePosition({ x: 0.5, y: 0.5 });
    setIsHovering(false);
    x.set(0);
    y.set(0);
  }, [x, y]);

  // Auto-rotate slides
  useEffect(() => {
    if (isHovering) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      goToNext();
    }, 6000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovering, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrev();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  const goToNext = useCallback(() => {
    if (isFlipping) return;
    setDirection("next");
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
      setIsFlipping(false);
    }, 600);
  }, [isFlipping]);

  const goToPrev = useCallback(() => {
    if (isFlipping) return;
    setDirection("prev");
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
      setIsFlipping(false);
    }, 600);
  }, [isFlipping]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isFlipping || index === currentIndex) return;
      setDirection(index > currentIndex ? "next" : "prev");
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsFlipping(false);
      }, 600);
    },
    [isFlipping, currentIndex]
  );

  // Memoize slide variants
  const slideVariants = useMemo(
    () => ({
      enter: (dir: "next" | "prev") => ({
        rotateY: dir === "next" ? 90 : -90,
        opacity: 0,
        scale: 1.1,
      }),
      center: {
        rotateY: 0,
        opacity: 1,
        scale: 1,
      },
      exit: (dir: "next" | "prev") => ({
        rotateY: dir === "next" ? -90 : 90,
        opacity: 0,
        scale: 1.05,
      }),
    }),
    []
  );

  // Caption animation variants
  const captionVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: 30,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          delay: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
      },
      exit: {
        opacity: 0,
        y: -20,
        transition: {
          duration: 0.3,
        },
      },
    }),
    []
  );

  return (
    <section
      ref={containerRef}
      className="relative h-[100vh] min-h-[600px] overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="Hero carousel"
    >
      {/* Background Layer with 3D Flip */}
      <div className="absolute inset-0 perspective-[1500px]">
        <AnimatePresence
          mode="wait"
          custom={direction}
          initial={false}
        >
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              rotateY: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94] as const,
              },
              opacity: {
                duration: 0.4,
              },
              scale: {
                duration: 0.6,
              },
            }}
            className="absolute inset-0 will-change-transform"
            style={{
              transformStyle: "preserve-3d",
              perspective: "1500px",
            }}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slides[currentIndex].src}
                alt={slides[currentIndex].title}
                className="w-full h-full object-cover"
                loading={currentIndex === 0 ? "eager" : "lazy"}
              />
              {/* Subtle dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/30" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* SVG Overlay Layer */}
      <SVGOverlay mousePosition={mousePosition} />

      {/* Caption Content Layer with Parallax */}
      <div className={`relative z-20 h-full flex ${currentIndex === 5 ? 'items-center justify-center' : currentIndex === 1 ? 'items-end justify-end' : 'items-end justify-start'}`}>
        <motion.div
          className={`container mx-auto px-4 md:px-8 pb-20 md:pb-12 ${currentIndex === 5 ? 'text-center' : currentIndex === 1 ? 'text-right' : ''}`}
          style={{
            x: springX,
            y: springY,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`caption-${currentIndex}`}
              variants={captionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`max-w-xl ${currentIndex === 5 ? 'mx-auto text-center' : currentIndex === 1 ? 'mr-0 ml-auto text-right' : 'text-left'}`}
            >
              {/* Welcome Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: currentIndex === 5 ? 0 : 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 200 }}
                className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-6 ${currentIndex === 5 ? 'mx-auto' : ''}`}
              >
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-white">
                  Welcome to TakeHealth
                </span>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, x: currentIndex === 5 ? 0 : 100, rotateY: currentIndex === 5 ? 0 : -15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-4 ${currentIndex === 5 ? 'text-center' : ''}`}
              >
                {slides[currentIndex].title}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, x: currentIndex === 5 ? 0 : 80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className={`text-xl md:text-2xl font-medium text-white/90 mb-6 ${currentIndex === 5 ? 'text-center' : ''}`}
              >
                {slides[currentIndex].subtitle}
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, x: currentIndex === 5 ? 0 : 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className={`text-lg md:text-xl text-white/80 mb-8 leading-relaxed ${currentIndex === 5 ? 'text-center mx-auto' : ''}`}
                style={currentIndex !== 5 ? { marginLeft: 'auto' } : {}}
              >
                Experience a holistic approach to wellness with our integrated
                fitness, lifestyle medicine, and personalized care programs
                designed to transform your life.
              </motion.p>

              {/* CTA Buttons - Only show on slides 0-4 (not center slide) */}
              {currentIndex !== 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.45, type: "spring", stiffness: 150 }}
                  className="flex flex-col sm:flex-row gap-4 mb-8"
                >
                  <Button
                    size="lg"
                    className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl backdrop-blur-sm transition-all duration-300 group"
                    asChild
                  >
                    <Link to="/register">
                      Get Started
                      <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-lime-300 text-lime-300 hover:text-white hover:bg-white/10 hover:border-white/50 rounded-full px-8 py-6 text-lg font-semibold backdrop-blur-sm transition-all duration-300"
                    asChild
                  >
                    <Link to="/services">Explore Services</Link>
                  </Button>
                </motion.div>
              )}

              {/* Trust Indicators - Only show on slides 0-4 (not center slide) */}
              {currentIndex !== 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.55 }}
                  className="flex flex-wrap gap-6"
                >
                  {[
                    "Trusted by 20,000+ Members",
                    "15+ Years of Excellence",
                    "1K+ Expert Practitioners",
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-2 text-white/90">
                      <span className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                      <span className="text-sm font-medium">{text}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-0 right-0 z-30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            {/* Pagination Dots */}
            <div className="flex items-center gap-2" aria-label="Slide navigation">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`relative h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-teal-400"
                      : "w-2 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {index === currentIndex && (
                    <motion.div
                      layoutId="activeDot"
                      className="absolute inset-0 bg-teal-300 rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Arrow Navigation */}
            <div className="flex items-center gap-3">
              <button
                onClick={goToPrev}
                disabled={isFlipping}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous slide"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNext}
                disabled={isFlipping}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next slide"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 md:hidden"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
