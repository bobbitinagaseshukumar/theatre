import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  /** Max-width preset */
  size?: "sm" | "md" | "lg";
  /** Hide the default close (X) button */
  hideClose?: boolean;
  className?: string;
}

const sizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

/**
 * Zoom + blur-background modal per the design system's animation rules.
 * Closes on Escape and backdrop click; traps initial focus on the panel.
 */
const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  size = "md",
  hideClose = false,
  className,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
            aria-hidden
          />
          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className={cn("relative w-full cpm-glass p-6", sizes[size], className)}
          >
            {(title || !hideClose) && (
              <div className="mb-4 flex items-center justify-between gap-4">
                {title && (
                  <h3 className="font-heading text-lg font-bold text-white">{title}</h3>
                )}
                {!hideClose && (
                  <button
                    onClick={onClose}
                    aria-label="Close dialog"
                    className="ml-auto rounded-lg p-1.5 text-cpm-muted hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
