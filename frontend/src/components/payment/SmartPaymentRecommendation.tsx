import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";

export interface SmartPaymentRecommendationProps {
  method?: string;
  saving?: number;
  reason?: string;
  onUse?: () => void;
}

/**
 * AI "Best Choice" payment nudge, e.g. "Use Google Pay and save ₹150".
 */
const SmartPaymentRecommendation: React.FC<SmartPaymentRecommendationProps> = ({
  method = "Google Pay (UPI)",
  saving = 150,
  reason = "Fastest checkout + highest cashback tonight",
  onUse,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden rounded-cpm p-[1.5px]"
  >
    <motion.div
      aria-hidden
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-0 bg-gradient-to-r from-gold via-gold-premium to-gold"
    />
    <div className="relative flex items-center gap-4 rounded-[15px] bg-cpm-surface/95 p-4 backdrop-blur">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold animate-cpmGlow">
        <Sparkles className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-cpm text-gold">
            Best Choice
          </span>
          {saving > 0 && (
            <span className="text-[11px] font-bold text-success">Save ₹{saving}</span>
          )}
        </div>
        <p className="mt-1 truncate text-sm font-semibold text-white">
          Pay with {method}
        </p>
        <p className="truncate text-[11px] text-cpm-muted">{reason}</p>
      </div>
      <button
        onClick={onUse}
        className="flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-gold to-gold-premium px-3 py-2 text-xs font-bold text-black shadow-goldGlow transition-transform hover:scale-105"
      >
        <Zap className="h-3.5 w-3.5" />
        Use
      </button>
    </div>
  </motion.div>
);

export default SmartPaymentRecommendation;
