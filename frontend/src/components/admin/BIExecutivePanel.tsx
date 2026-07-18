import React from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";

const PREDICTIONS = [
  { label: "Weekend Revenue", value: "+14.2%", detail: "Blockbuster demand", tone: "text-emerald-400" },
  { label: "Customer Churn", value: "3.1%", detail: "42 at-risk VIPs", tone: "text-primary" },
  { label: "Food Demand", value: "+28%", detail: "Fri evening peak", tone: "text-luxuryGold" },
  { label: "Staff Needed", value: "+6", detail: "Sat 6–10 PM", tone: "text-accent" },
];

const DOMAINS = [
  { label: "Revenue (MTD)", value: "₹4.2Cr" },
  { label: "Occupancy", value: "76%" },
  { label: "Retention", value: "82%" },
  { label: "Marketing ROI", value: "3.8x" },
  { label: "Food Attach", value: "62%" },
  { label: "NPS", value: "+64" },
];

const RISKS = [
  { icon: <AlertTriangle className="h-3.5 w-3.5 text-primary" />, text: "Truffle oil stock critical across 3 theatres — reorder now." },
  { icon: <Lightbulb className="h-3.5 w-3.5 text-luxuryGold" />, text: "Bengaluru shows 22% growth — evaluate a 5th screen." },
  { icon: <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />, text: "Gold membership conversions up 11% — extend the campaign." },
];

/**
 * BI executive layer: AI daily summary, predictive analytics and cross-domain
 * KPIs — the strategic decision-support view.
 */
const BIExecutivePanel: React.FC = () => (
  <div className="space-y-6">
    {/* AI executive summary */}
    <div className="relative overflow-hidden rounded-2xl border border-luxuryGold/20 bg-gradient-to-br from-[#14100a] to-black p-5">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-luxuryGold/10 blur-3xl" />
      <div className="relative flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-luxuryGold/15 text-luxuryGold">
          <Brain className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-heading text-sm font-extrabold uppercase tracking-wider text-luxuryGold">
            AI Executive Assistant
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-300">
            Revenue is projected to increase by <span className="font-bold text-white">14.2%</span> next weekend due to
            high demand for blockbuster releases. Increase premium seat allocation and food inventory. Infrastructure is
            healthy; one supplier risk flagged below.
          </p>
        </div>
      </div>
    </div>

    {/* Predictive analytics */}
    <div>
      <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">
        <TrendingUp className="h-5 w-5 text-accent" /> Predictive Analytics
      </h3>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {PREDICTIONS.map((p, i) => (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl border border-white/5 bg-white/5 p-4"
          >
            <span className="text-[10px] uppercase tracking-wider text-gray-500">{p.label}</span>
            <span className={`mt-1 block font-number text-xl font-bold ${p.tone}`}>{p.value}</span>
            <span className="text-[10px] text-gray-500">{p.detail}</span>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Cross-domain KPIs */}
    <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
      {DOMAINS.map((d) => (
        <div key={d.label} className="rounded-xl border border-white/5 bg-black/40 p-3 text-center">
          <span className="block font-number text-lg font-bold text-white">{d.value}</span>
          <span className="text-[9px] uppercase tracking-wider text-gray-500">{d.label}</span>
        </div>
      ))}
    </div>

    {/* Risks & opportunities */}
    <div className="glass-panel rounded-2xl border border-white/5 bg-black/40 p-5">
      <h3 className="mb-3 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">
        Risks & Opportunities
      </h3>
      <div className="space-y-2">
        {RISKS.map((r, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-[11px] text-gray-300">
            {r.icon}
            {r.text}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default BIExecutivePanel;
