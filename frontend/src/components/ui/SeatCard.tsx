import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export type SeatStatus = "available" | "selected" | "booked" | "locked";
export type SeatType = "standard" | "premium" | "vip";

export interface SeatCardProps {
  label: string;
  status?: SeatStatus;
  type?: SeatType;
  onSelect?: () => void;
  className?: string;
}

const statusStyles: Record<SeatStatus, string> = {
  available: "border-cpm-border bg-white/5 text-cpm-muted hover:border-gold hover:text-gold",
  selected: "border-gold bg-gold text-black shadow-goldGlow",
  booked: "border-transparent bg-white/5 text-white/20 cursor-not-allowed",
  locked: "border-warning/50 bg-warning/10 text-warning cursor-not-allowed",
};

const typeAccent: Record<SeatType, string> = {
  standard: "",
  premium: "ring-1 ring-inset ring-secondary/40",
  vip: "ring-1 ring-inset ring-gold/50",
};

/**
 * Individual seat cell for the seat-map grid. Disabled when booked/locked.
 */
const SeatCard: React.FC<SeatCardProps> = ({
  label,
  status = "available",
  type = "standard",
  onSelect,
  className,
}) => {
  const disabled = status === "booked" || status === "locked";
  return (
    <motion.button
      type="button"
      disabled={disabled}
      aria-label={`Seat ${label} — ${status}`}
      aria-pressed={status === "selected"}
      whileHover={disabled ? undefined : { scale: 1.12 }}
      whileTap={disabled ? undefined : { scale: 0.92 }}
      onClick={onSelect}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg border text-[10px] font-semibold transition-colors",
        statusStyles[status],
        typeAccent[type],
        className
      )}
    >
      {label}
    </motion.button>
  );
};

export default SeatCard;
