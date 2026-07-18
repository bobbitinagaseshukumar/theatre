import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Tag } from "lucide-react";
import { cn } from "../../lib/cn";

export interface OfferCardProps {
  title: string;
  description?: string;
  code?: string;
  discountLabel?: string;
  className?: string;
}

/**
 * Promotional offer card with copy-to-clipboard coupon code.
 */
const OfferCard: React.FC<OfferCardProps> = ({
  title,
  description,
  code,
  discountLabel,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cn(
        "relative overflow-hidden rounded-cpm border border-cpm-border bg-gradient-to-br from-cpm-surface to-cpm-bg2 p-5",
        className
      )}
    >
      {/* Notch accents */}
      <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-cpm-bg" />
      <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-cpm-bg" />

      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
          <Tag className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          {discountLabel && (
            <span className="cpm-gold-text font-heading text-lg font-extrabold">{discountLabel}</span>
          )}
          <h3 className="font-heading text-sm font-bold text-white">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-cpm-muted">{description}</p>}
        </div>
      </div>

      {code && (
        <button
          onClick={copy}
          className="mt-4 flex w-full items-center justify-between rounded-lg border border-dashed border-gold/40 bg-black/30 px-3 py-2 text-sm font-semibold tracking-cpm text-gold transition-colors hover:bg-gold/10"
        >
          {code}
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      )}
    </motion.div>
  );
};

export default OfferCard;
