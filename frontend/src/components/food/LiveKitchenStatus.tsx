import React from "react";
import { motion } from "framer-motion";
import { ChefHat, Clock } from "lucide-react";

type Load = "NORMAL" | "BUSY" | "HIGH";

export interface LiveKitchenStatusProps {
  load?: Load;
  etaMinutes?: number;
}

const loadConfig: Record<Load, { label: string; color: string; dot: string }> = {
  NORMAL: { label: "Normal", color: "text-success", dot: "bg-success" },
  BUSY: { label: "Busy", color: "text-warning", dot: "bg-warning" },
  HIGH: { label: "High Demand", color: "text-error", dot: "bg-error" },
};

/**
 * Live kitchen status banner — open state, queue indicator and prep ETA.
 */
const LiveKitchenStatus: React.FC<LiveKitchenStatusProps> = ({ load = "NORMAL", etaMinutes = 10 }) => {
  const cfg = loadConfig[load];
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-cpm border border-cpm-border bg-white/5 px-5 py-3">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 text-gold">
          <ChefHat className="h-5 w-5" />
        </span>
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-white">
            Kitchen Open
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
          </p>
          <p className="text-[11px] text-cpm-muted">Accepting pre-orders now</p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 text-xs">
          <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
          <span className="text-cpm-muted">Queue:</span>
          <span className={`font-semibold ${cfg.color}`}>{cfg.label}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-cpm-muted">
          <Clock className="h-3.5 w-3.5 text-gold" />
          <motion.span
            key={etaMinutes}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-semibold text-white"
          >
            ~{etaMinutes} min
          </motion.span>
        </div>
      </div>
    </div>
  );
};

export default LiveKitchenStatus;
