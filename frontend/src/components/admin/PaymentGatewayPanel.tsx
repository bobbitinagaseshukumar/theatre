import React from "react";
import { motion } from "framer-motion";
import { Network, Sparkles, CheckCircle2, AlertTriangle, RefreshCcw } from "lucide-react";

interface Gateway {
  name: string;
  success: number;
  latency: number;
  status: "Healthy" | "Degraded" | "Down";
  priority: number;
}

const GATEWAYS: Gateway[] = [
  { name: "Razorpay", success: 98.6, latency: 420, status: "Healthy", priority: 1 },
  { name: "Stripe", success: 97.9, latency: 510, status: "Healthy", priority: 2 },
  { name: "PayU", success: 94.2, latency: 690, status: "Degraded", priority: 3 },
  { name: "Cashfree", success: 0, latency: 0, status: "Down", priority: 4 },
];

const RECON = [
  { label: "Gateway ↔ Bank", matched: 12840, mismatched: 3 },
  { label: "Ledger ↔ Invoices", matched: 12843, mismatched: 0 },
  { label: "Settlements", matched: 412, mismatched: 1 },
];

const STATUS_TONE: Record<Gateway["status"], string> = {
  Healthy: "text-emerald-400",
  Degraded: "text-amber-400",
  Down: "text-primary",
};

/**
 * Multi-gateway orchestration: health/priority, intelligent routing tip and a
 * reconciliation summary.
 */
const PaymentGatewayPanel: React.FC = () => (
  <div className="space-y-6">
    <div className="glass-panel rounded-2xl border border-white/5 bg-black/40 p-5">
      <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">
        <Network className="h-5 w-5 text-accent" /> Multi-Gateway Orchestration
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {GATEWAYS.map((g) => (
          <motion.div key={g.name} whileHover={{ y: -3 }} className="rounded-xl border border-white/5 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <span className="font-heading text-sm font-bold text-white">{g.name}</span>
              <span className={`flex items-center gap-1 text-[10px] font-bold ${STATUS_TONE[g.status]}`}>
                {g.status === "Down" ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                {g.status}
              </span>
            </div>
            <p className="mt-2 text-[10px] uppercase text-gray-500">Priority #{g.priority}</p>
            <div className="mt-2 space-y-1 font-number text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Success</span>
                <span className="text-white">{g.success}%</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Latency</span>
                <span className="text-white">{g.latency ? `${g.latency}ms` : "—"}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-luxuryGold/20 bg-luxuryGold/5 p-3 text-[11px] text-gray-300">
        <Sparkles className="h-4 w-4 shrink-0 text-luxuryGold" />
        Route high-value Visa transactions through Razorpay to improve expected authorization success by 3.8%. Cashfree is
        down — auto-failover active.
      </div>
    </div>

    {/* Reconciliation */}
    <div className="glass-panel rounded-2xl border border-white/5 bg-black/40 p-5">
      <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">
        <RefreshCcw className="h-5 w-5 text-emerald-400" /> Reconciliation Engine
      </h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {RECON.map((r) => (
          <div key={r.label} className="rounded-xl border border-white/5 bg-white/5 p-4">
            <p className="text-[11px] font-semibold text-white">{r.label}</p>
            <div className="mt-2 flex items-center justify-between font-number text-xs">
              <span className="text-emerald-400">{r.matched.toLocaleString("en-IN")} matched</span>
              <span className={r.mismatched ? "text-primary" : "text-gray-500"}>{r.mismatched} diff</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default PaymentGatewayPanel;
