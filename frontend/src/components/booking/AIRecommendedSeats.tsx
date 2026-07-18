import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Check } from "lucide-react";

export interface AIRecommendedSeatsProps {
  seats: string[];
  score?: number;
  reasons?: string[];
  onApply: () => void;
  applied?: boolean;
}

const DEFAULT_REASONS = [
  "Best center position",
  "Balanced audio sweet spot",
  "Minimal neck movement",
  "Fast exit access",
];

/**
 * "Best Viewing Experience" AI seat recommendation card with a pulsing gold
 * border and a one-tap apply action.
 */
const AIRecommendedSeats: React.FC<AIRecommendedSeatsProps> = ({
  seats,
  score = 98,
  reasons = DEFAULT_REASONS,
  onApply,
  applied = false,
}) => {
  if (!seats.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mx-auto max-w-xl overflow-hidden rounded-cpm p-[1.5px]"
    >
      {/* pulsing gold gradient border */}
      <motion.div
        aria-hidden
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-gold via-gold-premium to-gold"
      />
      <div className="relative rounded-[15px] bg-cpm-surface/95 p-5 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15 text-gold animate-cpmGlow">
            <Sparkles className="h-4 w-4" />
          </span>
          <h4 className="font-heading text-sm font-bold text-white">Best Viewing Experience</h4>
          <span className="ml-auto rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-bold text-gold">
            {score}% match
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-cpm-muted">Suggested seats:</span>
          {seats.map((s) => (
            <span
              key={s}
              className="rounded-md border border-gold/40 bg-gold/10 px-2 py-1 text-xs font-bold text-gold"
            >
              {s}
            </span>
          ))}
        </div>

        <ul className="mt-4 grid grid-cols-2 gap-2">
          {reasons.map((r) => (
            <li key={r} className="flex items-center gap-1.5 text-[11px] text-cpm-muted">
              <Check className="h-3 w-3 text-success" />
              {r}
            </li>
          ))}
        </ul>

        <button
          onClick={onApply}
          disabled={applied}
          className="mt-5 w-full rounded-lg bg-gradient-to-r from-gold to-gold-premium py-2.5 text-xs font-bold uppercase tracking-cpm text-black shadow-goldGlow transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {applied ? "AI Seats Selected" : "Select These Seats"}
        </button>
      </div>
    </motion.div>
  );
};

export default AIRecommendedSeats;
