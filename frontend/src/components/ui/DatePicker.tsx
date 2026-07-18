import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface DatePickerProps {
  /** Number of upcoming days to show */
  days?: number;
  value?: string; // ISO yyyy-mm-dd
  onChange?: (iso: string) => void;
  startDate?: Date;
  className?: string;
}

const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/**
 * Horizontal date strip picker — the common pattern for cinema showtime
 * selection. Renders `days` upcoming days from `startDate`.
 */
const DatePicker: React.FC<DatePickerProps> = ({
  days = 7,
  value,
  onChange,
  startDate = new Date(),
  className,
}) => {
  const list = Array.from({ length: days }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d;
  });

  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-2", className)} role="radiogroup" aria-label="Select date">
      {list.map((d) => {
        const iso = toISO(d);
        const active = iso === value;
        return (
          <motion.button
            key={iso}
            role="radio"
            aria-checked={active}
            whileTap={{ scale: 0.96 }}
            onClick={() => onChange?.(iso)}
            className={cn(
              "flex min-w-[64px] flex-col items-center rounded-cpm border px-3 py-2 transition-colors",
              active
                ? "border-gold bg-gold/15 text-gold shadow-goldGlow"
                : "border-cpm-border bg-white/5 text-cpm-muted hover:border-gold/40 hover:text-white"
            )}
          >
            <span className="text-[10px] font-semibold uppercase tracking-cpm">{WEEK[d.getDay()]}</span>
            <span className="font-heading text-xl font-bold">{d.getDate()}</span>
            <span className="text-[10px] text-current/80">{MONTH[d.getMonth()]}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default DatePicker;
