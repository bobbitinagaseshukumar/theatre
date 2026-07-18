import React, { useRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "gold";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const base =
  "relative inline-flex items-center justify-center gap-2 overflow-hidden font-heading font-semibold tracking-cpm rounded-cpm select-none transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  // Gold is the design-system primary CTA
  primary:
    "bg-gradient-to-r from-gold to-gold-premium text-black hover:shadow-goldGlowStrong shadow-goldGlow",
  gold:
    "bg-gradient-to-r from-gold to-gold-premium text-black hover:shadow-goldGlowStrong shadow-goldGlow",
  secondary:
    "cpm-glass text-white hover:border-gold/40 hover:text-gold",
  danger:
    "bg-cinemaRed text-white hover:brightness-110 shadow-[0_0_20px_rgba(255,59,48,0.4)]",
  ghost:
    "bg-transparent text-cpm-muted hover:text-white hover:bg-white/5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

/**
 * Premium button with hover scale (1.05), tap scale (0.96), gold glow,
 * a material-style ripple on click, and an accessible loading state.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const localRef = useRef<HTMLButtonElement | null>(null);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const el = localRef.current;
      if (el) {
        const circle = document.createElement("span");
        const diameter = Math.max(el.clientWidth, el.clientHeight);
        const rect = el.getBoundingClientRect();
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - diameter / 2}px`;
        circle.style.top = `${e.clientY - rect.top - diameter / 2}px`;
        circle.className = "cpm-ripple";
        el.appendChild(circle);
        window.setTimeout(() => circle.remove(), 600);
      }
      onClick?.(e);
    };

    return (
      <motion.button
        ref={(node) => {
          localRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        whileHover={disabled || loading ? undefined : { scale: 1.05 }}
        whileTap={disabled || loading ? undefined : { scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
        disabled={disabled || loading}
        aria-busy={loading}
        onClick={handleClick}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
