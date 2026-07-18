import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CursorLight: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Softer, snappier spring for the follow effect
  const springConfig = { damping: 45, stiffness: 150, mass: 0.4 };
  const lightX = useSpring(mouseX, springConfig);
  const lightY = useSpring(mouseY, springConfig);

  // Skip entirely on touch devices / reduced-motion (no cursor + saves paint cost)
  const enabled =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!enabled) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 210);
      mouseY.set(e.clientY - 210);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, enabled]);

  if (!enabled) return null;

  return (
    <motion.div
      style={{ x: lightX, y: lightY, willChange: "transform" }}
      className="fixed top-0 left-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.05)_0%,rgba(139,92,246,0.025)_50%,rgba(0,0,0,0)_100%)] pointer-events-none z-10 blur-[45px]"
    />
  );
};

export default CursorLight;
