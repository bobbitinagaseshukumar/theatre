import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Lock } from "lucide-react";

const STEPS = [
  "Verifying booking",
  "Connecting to gateway",
  "Authorizing payment",
  "Generating ticket",
  "Sending confirmation",
];

export interface PaymentProcessingOverlayProps {
  active: boolean;
  onComplete: () => void;
  /** ms per step */
  stepDuration?: number;
}

/**
 * Full-screen secure payment processing sequence with a rotating gold ring and
 * step-by-step progress. Calls onComplete after the final step.
 */
const PaymentProcessingOverlay: React.FC<PaymentProcessingOverlayProps> = ({
  active,
  onComplete,
  stepDuration = 1100,
}) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) {
      setStep(0);
      return;
    }
    if (step >= STEPS.length) {
      const done = window.setTimeout(onComplete, 500);
      return () => window.clearTimeout(done);
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), stepDuration);
    return () => window.clearTimeout(t);
  }, [active, step, stepDuration, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
          role="alertdialog"
          aria-label="Processing payment"
        >
          {/* Rotating gold ring with secure lock */}
          <div className="relative mb-10 h-28 w-28">
            <motion.span
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold border-r-gold-premium"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.span
              className="absolute inset-3 rounded-full border-2 border-transparent border-b-gold/60"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-gold">
              <Lock className="h-8 w-8" />
            </span>
          </div>

          <h3 className="mb-1 font-heading text-xl font-extrabold text-white">Processing Payment</h3>
          <p className="mb-8 text-xs text-cpm-muted">Please don't close this window</p>

          <ol className="w-full max-w-xs space-y-3">
            {STEPS.map((label, i) => {
              const done = i < step;
              const activeStep = i === step;
              return (
                <li key={label} className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] ${
                      done
                        ? "border-gold bg-gold text-black"
                        : activeStep
                        ? "border-gold text-gold"
                        : "border-cpm-border text-cpm-muted"
                    }`}
                  >
                    {done ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : activeStep ? (
                      <motion.span
                        className="h-2 w-2 rounded-full bg-gold"
                        animate={{ scale: [1, 1.6, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span
                    className={`text-sm ${
                      done ? "text-white" : activeStep ? "text-gold" : "text-cpm-muted"
                    }`}
                  >
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentProcessingOverlay;
