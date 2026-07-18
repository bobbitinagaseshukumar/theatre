import React from "react";
import { motion } from "framer-motion";
import { Film } from "lucide-react";
import { Button } from "../ui";

export interface EmptyStateProps {
  message?: string;
  onReset?: () => void;
}

/**
 * Animated empty state — a slowly rotating film reel + message.
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No movies found. Try changing your filters.",
  onReset,
}) => (
  <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
    <motion.div
      animate={{ rotate: 360, y: [0, -12, 0] }}
      transition={{
        rotate: { duration: 8, repeat: Infinity, ease: "linear" },
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
      }}
      className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold shadow-goldGlow"
    >
      <Film className="h-12 w-12" />
    </motion.div>
    <p className="max-w-sm text-cpm-muted">{message}</p>
    {onReset && (
      <Button variant="secondary" className="mt-6" onClick={onReset}>
        Reset Filters
      </Button>
    )}
  </div>
);

export default EmptyState;
