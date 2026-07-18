import React from "react";
import { motion } from "framer-motion";
import { Check, Film, MapPin, Armchair, Popcorn, CreditCard, Ticket } from "lucide-react";
import { cn } from "../../lib/cn";

export type BookingStepKey = "movie" | "theatre" | "seats" | "food" | "payment" | "confirmation";

const STEPS: { key: BookingStepKey; label: string; icon: React.ReactNode }[] = [
  { key: "movie", label: "Movie", icon: <Film className="h-4 w-4" /> },
  { key: "theatre", label: "Theatre", icon: <MapPin className="h-4 w-4" /> },
  { key: "seats", label: "Seats", icon: <Armchair className="h-4 w-4" /> },
  { key: "food", label: "Food", icon: <Popcorn className="h-4 w-4" /> },
  { key: "payment", label: "Payment", icon: <CreditCard className="h-4 w-4" /> },
  { key: "confirmation", label: "Confirm", icon: <Ticket className="h-4 w-4" /> },
];

export interface BookingStepsProps {
  current: BookingStepKey;
  className?: string;
}

/**
 * Horizontal booking progress indicator. Completed steps show an animated gold
 * checkmark, the current step is gold-highlighted, upcoming steps are grey.
 */
const BookingSteps: React.FC<BookingStepsProps> = ({ current, className }) => {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <nav aria-label="Booking progress" className={cn("mx-auto max-w-3xl px-4", className)}>
      <ol className="flex items-center">
        {STEPS.map((step, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <li key={step.key} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  initial={false}
                  animate={{ scale: active ? 1.1 : 1 }}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors",
                    done && "border-gold bg-gold text-black",
                    active && "border-gold bg-gold/15 text-gold shadow-goldGlow",
                    !done && !active && "border-cpm-border bg-white/5 text-cpm-muted"
                  )}
                  aria-current={active ? "step" : undefined}
                >
                  {done ? (
                    <motion.span
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    >
                      <Check className="h-4 w-4" />
                    </motion.span>
                  ) : (
                    step.icon
                  )}
                </motion.div>
                <span
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-cpm",
                    active ? "text-gold" : done ? "text-white" : "text-cpm-muted"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div className="mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: done ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ transformOrigin: "0%" }}
                    className="h-full bg-gradient-to-r from-gold to-gold-premium"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BookingSteps;
