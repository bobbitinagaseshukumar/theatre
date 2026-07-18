import React from "react";
import { cn } from "../../lib/cn";

type Tone = "gold" | "red" | "success" | "warning" | "error" | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  dot?: boolean;
}

const tones: Record<Tone, string> = {
  gold: "bg-gold/15 text-gold border-gold/30",
  red: "bg-cinemaRed/15 text-cinemaRed border-cinemaRed/30",
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  error: "bg-error/15 text-error border-error/30",
  neutral: "bg-white/8 text-cpm-muted border-cpm-border",
};

const Badge: React.FC<BadgeProps> = ({ tone = "neutral", dot = false, className, children, ...props }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-cpm",
      tones[tone],
      className
    )}
    {...props}
  >
    {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
    {children}
  </span>
);

export default Badge;
