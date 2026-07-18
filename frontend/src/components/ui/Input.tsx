import React, { useId } from "react";
import { cn } from "../../lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Accessible glass input with label, hint, error state and optional icons.
 * Errors are announced to screen readers via aria-describedby + role="alert".
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-xs font-semibold uppercase tracking-cpm text-cpm-muted"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cpm-muted">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className={cn(
              "h-11 w-full rounded-cpm border bg-white/5 px-4 text-sm text-white placeholder:text-cpm-muted/60",
              "transition-colors duration-200 focus:outline-none focus:ring-2",
              leftIcon ? "pl-10" : "",
              rightIcon ? "pr-10" : "",
              error
                ? "border-error/60 focus:ring-error/40"
                : "border-cpm-border focus:border-gold/50 focus:ring-gold/30",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-cpm-muted">
              {rightIcon}
            </span>
          )}
        </div>
        {error ? (
          <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-xs text-error">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-cpm-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
