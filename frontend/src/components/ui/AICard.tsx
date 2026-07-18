import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "../../lib/cn";

export interface AICardProps {
  title: string;
  children?: React.ReactNode;
  /** Optional confidence 0..1 shown as a bar */
  confidence?: number;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * AI-inspired insight/recommendation card with animated gradient border glow.
 */
const AICard: React.FC<AICardProps> = ({ title, children, confidence, icon, className }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cn(
        "relative overflow-hidden rounded-cpm p-[1px]",
        "bg-gradient-to-br from-gold/40 via-secondary/30 to-accent/40",
        className
      )}
    >
      <div className="rounded-[15px] bg-cpm-surface/95 p-5 backdrop-blur">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15 text-gold animate-cpmGlow">
            {icon ?? <Sparkles className="h-4 w-4" />}
          </span>
          <h3 className="font-heading text-sm font-bold text-white">{title}</h3>
          <span className="ml-auto text-[10px] font-semibold uppercase tracking-cpm text-gold/80">
            AI
          </span>
        </div>
        <div className="text-sm text-cpm-muted">{children}</div>

        {typeof confidence === "number" && (
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-[10px] text-cpm-muted">
              <span>Confidence</span>
              <span className="text-gold">{Math.round(confidence * 100)}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gold to-gold-premium"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(Math.max(confidence, 0), 1) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AICard;
