import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../lib/cn";

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

/**
 * Accessible custom select. Closes on outside click / Escape,
 * supports keyboard activation. Styled to the glass design system.
 */
const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className={cn("relative w-full", className)} ref={ref}>
      {label && (
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-cpm text-cpm-muted">
          {label}
        </span>
      )}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-cpm border border-cpm-border bg-white/5 px-4 text-sm",
          "transition-colors hover:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/30",
          selected ? "text-white" : "text-cpm-muted"
        )}
      >
        {selected?.label ?? placeholder}
        <ChevronDown className={cn("h-4 w-4 text-cpm-muted transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 max-h-60 w-full overflow-auto cpm-glass p-1"
          >
            {options.map((opt) => {
              const isSel = opt.value === value;
              return (
                <li key={opt.value} role="option" aria-selected={isSel}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange?.(opt.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm",
                      isSel ? "bg-gold/15 text-gold" : "text-white hover:bg-white/5"
                    )}
                  >
                    {opt.label}
                    {isSel && <Check className="h-4 w-4" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
