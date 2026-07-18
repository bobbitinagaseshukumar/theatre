import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/cn";

export interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  /** Adds hover lift + gold border glow */
  interactive?: boolean;
  /** Gentle continuous float animation */
  floating?: boolean;
  /** Inner padding preset */
  padding?: "none" | "sm" | "md" | "lg";
}

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**
 * Glassmorphism surface card. Core building block of the design system.
 */
const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ interactive = false, floating = false, padding = "md", className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={
          interactive
            ? { y: -4, boxShadow: "0 12px 40px rgba(255,215,0,0.12)" }
            : undefined
        }
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className={cn(
          "cpm-glass",
          paddings[padding],
          interactive && "cursor-pointer hover:border-gold/30",
          floating && "animate-cpmFloat",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
export default GlassCard;
