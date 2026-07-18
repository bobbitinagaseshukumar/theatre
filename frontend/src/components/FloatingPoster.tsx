import React from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

interface FloatingPosterProps {
  src: string;
  alt: string;
  glowColor?: "red" | "blue" | "purple";
}

const FloatingPoster: React.FC<FloatingPosterProps> = ({ src, alt, glowColor = "red" }) => {
  // Track cursor position inside the card coordinate frame
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Configure smooth spring physics for high-end feel
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { damping: 25, stiffness: 200 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { damping: 25, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    
    // Relative coordinates between -0.5 and 0.5
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;

    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    // Return back to center
    x.set(0);
    y.set(0);
  };

  // Border glow selector
  let shadowClass = "shadow-redGlow";
  if (glowColor === "blue") shadowClass = "shadow-blueGlow";
  if (glowColor === "purple") shadowClass = "shadow-purpleGlow";

  return (
    <div 
      className="perspective-1000 w-full max-w-[420px] aspect-[2/3] shrink-0"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-glass ${shadowClass} transition-shadow duration-500`}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover select-none pointer-events-none"
        />

        {/* Cinematic Glare highlight reflection overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"
          style={{ transform: "translateZ(30px)" }}
        />
      </motion.div>
    </div>
  );
};

export default FloatingPoster;
