import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface FabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string; // accessible label (required)
  position?: "bottom-right" | "bottom-left";
}

const positions = {
  "bottom-right": "bottom-6 right-6",
  "bottom-left": "bottom-6 left-6",
};

/**
 * Floating Action Button — fixed, gold, with continuous soft glow.
 */
const Fab: React.FC<FabProps> = ({ icon, label, position = "bottom-right", className, ...props }) => (
  <motion.button
    aria-label={label}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.92 }}
    className={cn(
      "fixed z-50 flex h-14 w-14 items-center justify-center rounded-full",
      "bg-gradient-to-br from-gold to-gold-premium text-black shadow-goldGlowStrong animate-cpmGlow",
      positions[position],
      className
    )}
    {...(props as React.ComponentProps<typeof motion.button>)}
  >
    {icon}
  </motion.button>
);

export default Fab;
