import React from "react";
import { cn } from "../../lib/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Shape helper */
  variant?: "line" | "rect" | "circle";
}

/**
 * Loading skeleton with shimmer. Compose freely for card/list placeholders.
 */
const Skeleton: React.FC<SkeletonProps> = ({ variant = "rect", className, ...props }) => (
  <div
    aria-hidden
    className={cn(
      "cpm-skeleton",
      variant === "line" && "h-3 w-full rounded-full",
      variant === "circle" && "rounded-full",
      className
    )}
    {...props}
  />
);

export default Skeleton;
