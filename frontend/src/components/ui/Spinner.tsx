import React from "react";
import { cn } from "../../lib/cn";

export interface SpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

/**
 * Gold cinematic loading spinner. Includes an SR-only label.
 */
const Spinner: React.FC<SpinnerProps> = ({ size = 28, className, label = "Loading" }) => (
  <div role="status" className={cn("inline-flex items-center justify-center", className)}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      className="animate-spin"
      aria-hidden
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="4"
      />
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="#FFD700"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="90 150"
      />
    </svg>
    <span className="sr-only">{label}</span>
  </div>
);

export default Spinner;
