import { useMemo } from "react";
import { motion } from "framer-motion";

interface SVGOverlayProps {
  mousePosition: { x: number; y: number };
}

export function SVGOverlay({ mousePosition }: SVGOverlayProps) {
  // Memoize the animation variants to avoid recalculation
  const floatingVariants = useMemo(
    () => ({
      float: {
        y: [0, -20, 0],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    }),
    []
  );

  const slowFloatVariants = useMemo(
    () => ({
      float: {
        y: [0, -15, 0],
        transition: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    }),
    []
  );

  const fastFloatVariants = useMemo(
    () => ({
      float: {
        y: [0, -25, 0],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    }),
    []
  );

  const rotateVariants = useMemo(
    () => ({
      rotate: {
        rotate: 360,
        transition: {
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        },
      },
    }),
    []
  );

  const pulseVariants = useMemo(
    () => ({
      pulse: {
        scale: [1, 1.2, 1],
        opacity: [0.15, 0.25, 0.15],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    }),
    []
  );

  const curvedLineVariants = useMemo(
    () => ({
      draw: {
        pathLength: [0, 1],
        opacity: [0, 0.2, 0],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    }),
    []
  );

  // Calculate parallax offset based on mouse position
  const parallaxOffset = (baseValue: number) => {
    const offset = (mousePosition.x - 0.5) * baseValue;
    return `${offset}px`;
  };

  const parallaxOffsetY = (baseValue: number) => {
    const offset = (mousePosition.y - 0.5) * baseValue;
    return `${offset}px`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Floating Medical Cross Icons */}
      <motion.div
        className="absolute top-[15%] left-[10%]"
        style={{
          transform: `translate(${parallaxOffset(15)}, ${parallaxOffsetY(10)})`,
        }}
        variants={floatingVariants}
        animate="float"
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          className="text-teal-400"
          style={{ opacity: 0.15 }}
        >
          <rect x="18" y="8" width="12" height="32" rx="2" fill="currentColor" />
          <rect x="8" y="18" width="32" height="12" rx="2" fill="currentColor" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-[25%] right-[15%]"
        style={{
          transform: `translate(${parallaxOffset(-20)}, ${parallaxOffsetY(12)})`,
        }}
        variants={slowFloatVariants}
        animate="float"
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 48 48"
          fill="none"
          className="text-blue-400"
          style={{ opacity: 0.12 }}
        >
          <rect x="18" y="8" width="12" height="32" rx="2" fill="currentColor" />
          <rect x="8" y="18" width="32" height="12" rx="2" fill="currentColor" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-[30%] left-[8%]"
        style={{
          transform: `translate(${parallaxOffset(18)}, ${parallaxOffsetY(-15)})`,
        }}
        variants={fastFloatVariants}
        animate="float"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 48 48"
          fill="none"
          className="text-cyan-400"
          style={{ opacity: 0.18 }}
        >
          <rect x="18" y="8" width="12" height="32" rx="2" fill="currentColor" />
          <rect x="8" y="18" width="32" height="12" rx="2" fill="currentColor" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-[20%] right-[12%]"
        style={{
          transform: `translate(${parallaxOffset(-12)}, ${parallaxOffsetY(-18)})`,
        }}
        variants={floatingVariants}
        animate="float"
      >
        <svg
          width="42"
          height="42"
          viewBox="0 0 48 48"
          fill="none"
          className="text-teal-300"
          style={{ opacity: 0.1 }}
        >
          <rect x="18" y="8" width="12" height="32" rx="2" fill="currentColor" />
          <rect x="8" y="18" width="32" height="12" rx="2" fill="currentColor" />
        </svg>
      </motion.div>

      {/* Abstract Blob Shapes */}
      <motion.div
        className="absolute top-[10%] right-[25%]"
        style={{
          transform: `translate(${parallaxOffset(25)}, ${parallaxOffsetY(8)})`,
        }}
        variants={rotateVariants}
        animate="rotate"
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          fill="none"
          className="text-blue-500"
          style={{ opacity: 0.08 }}
        >
          <path
            d="M90 0C40 0 0 40 0 90C0 140 40 180 90 180C140 180 180 140 180 90C180 40 140 0 90 0Z"
            fill="currentColor"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-[15%] left-[20%]"
        style={{
          transform: `translate(${parallaxOffset(20)}, ${parallaxOffsetY(-20)})`,
        }}
        variants={slowFloatVariants}
        animate="float"
      >
        <svg
          width="140"
          height="140"
          viewBox="0 0 140 140"
          fill="none"
          className="text-teal-500"
          style={{ opacity: 0.06 }}
        >
          <ellipse cx="70" cy="70" rx="70" ry="40" fill="currentColor" />
        </svg>
      </motion.div>

      {/* Circular Pulse Rings */}
      <motion.div
        className="absolute top-[35%] left-[20%]"
        style={{
          transform: `translate(${parallaxOffset(10)}, ${parallaxOffsetY(15)})`,
        }}
        variants={pulseVariants}
        animate="pulse"
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          className="text-cyan-400"
        >
          <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.2" />
          <circle cx="40" cy="40" r="25" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.15" />
          <circle cx="40" cy="40" r="15" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.1" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-[50%] right-[8%]"
        style={{
          transform: `translate(${parallaxOffset(-15)}, ${parallaxOffsetY(10)})`,
        }}
        variants={pulseVariants}
        animate="pulse"
      >
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
          className="text-blue-400"
        >
          <circle cx="30" cy="30" r="25" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.18" />
          <circle cx="30" cy="30" r="15" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.12" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-[40%] right-[25%]"
        style={{
          transform: `translate(${parallaxOffset(-18)}, ${parallaxOffsetY(-12)})`,
        }}
        variants={pulseVariants}
        animate="pulse"
      >
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          className="text-teal-400"
        >
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.12" />
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.1" />
        </svg>
      </motion.div>

      {/* Thin Animated Curved Lines */}
      <motion.div
        className="absolute top-[20%] left-[30%]"
        style={{
          transform: `translate(${parallaxOffset(12)}, ${parallaxOffsetY(8)})`,
        }}
      >
        <svg
          width="120"
          height="60"
          viewBox="0 0 120 60"
          fill="none"
          className="text-blue-300"
          style={{ opacity: 0.15 }}
        >
          <motion.path
            d="M0 30C20 10 40 50 60 30C80 10 100 50 120 30"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            variants={curvedLineVariants}
            animate="draw"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-[25%] left-[35%]"
        style={{
          transform: `translate(${parallaxOffset(15)}, ${parallaxOffsetY(-10)})`,
        }}
      >
        <svg
          width="100"
          height="50"
          viewBox="0 0 100 50"
          fill="none"
          className="text-teal-300"
          style={{ opacity: 0.12 }}
        >
          <motion.path
            d="M0 25C15 5 35 45 50 25C65 5 85 45 100 25"
            stroke="currentColor"
            strokeWidth="0.75"
            fill="none"
            variants={curvedLineVariants}
            animate="draw"
            style={{ animationDelay: "1s" }}
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-[45%] right-[30%]"
        style={{
          transform: `translate(${parallaxOffset(-10)}, ${parallaxOffsetY(12)})`,
        }}
      >
        <svg
          width="80"
          height="40"
          viewBox="0 0 80 40"
          fill="none"
          className="text-cyan-400"
          style={{ opacity: 0.1 }}
        >
          <motion.path
            d="M0 20C10 5 25 35 40 20C55 5 70 35 80 20"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            variants={curvedLineVariants}
            animate="draw"
            style={{ animationDelay: "2s" }}
          />
        </svg>
      </motion.div>

      {/* Additional decorative elements for depth */}
      <motion.div
        className="absolute top-[60%] left-[5%]"
        style={{
          transform: `translate(${parallaxOffset(8)}, ${parallaxOffsetY(5)})`,
        }}
        variants={fastFloatVariants}
        animate="float"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-teal-500"
          style={{ opacity: 0.2 }}
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" fill="none" />
          <circle cx="12" cy="12" r="4" fill="currentColor" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-[8%] left-[50%]"
        style={{
          transform: `translate(${parallaxOffset(6)}, ${parallaxOffsetY(4)})`,
        }}
        variants={slowFloatVariants}
        animate="float"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="text-blue-400"
          style={{ opacity: 0.18 }}
        >
          <rect x="7" y="2" width="6" height="16" rx="1" fill="currentColor" />
          <rect x="2" y="7" width="16" height="6" rx="1" fill="currentColor" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-[10%] right-[5%]"
        style={{
          transform: `translate(${parallaxOffset(-8)}, ${parallaxOffsetY(-6)})`,
        }}
        variants={floatingVariants}
        animate="float"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          className="text-cyan-500"
          style={{ opacity: 0.14 }}
        >
          <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
          <circle cx="16" cy="16" r="8" stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.3" />
        </svg>
      </motion.div>

      {/* Small dots for additional depth */}
      <motion.div
        className="absolute top-[30%] right-[40%]"
        style={{
          transform: `translate(${parallaxOffset(4)}, ${parallaxOffsetY(3)})`,
        }}
      >
        <svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          className="text-teal-400"
          style={{ opacity: 0.25 }}
        >
          <circle cx="4" cy="4" r="3" fill="currentColor" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-[35%] left-[45%]"
        style={{
          transform: `translate(${parallaxOffset(3)}, ${parallaxOffsetY(-4)})`,
        }}
      >
        <svg
          width="6"
          height="6"
          viewBox="0 0 6 6"
          fill="none"
          className="text-blue-400"
          style={{ opacity: 0.2 }}
        >
          <circle cx="3" cy="3" r="2" fill="currentColor" />
        </svg>
      </motion.div>
    </div>
  );
}
