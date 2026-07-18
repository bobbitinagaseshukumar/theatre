import React from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingDown, Users, Gauge } from "lucide-react";

const KPIS = [
  { label: "Avg CLV", value: "₹18,400", color: "text-white" },
  { label: "Retention", value: "82%", color: "text-emerald-400" },
  { label: "NPS", value: "+64", color: "text-accent" },
  { label: "CSAT", value: "4.7/5", color: "text-luxuryGold" },
];

const SEGMENTS = [
  { name: "VIP", count: 1240, color: "border-luxuryGold/40 bg-luxuryGold/10 text-luxuryGold" },
  { name: "High Spenders", count: 3180, color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
  { name: "Weekend Visitors", count: 8420, color: "border-accent/30 bg-accent/10 text-accent" },
  { name: "Families", count: 5610, color: "border-secondary/30 bg-secondary/10 text-secondary" },
  { name: "Students", count: 4290, color: "border-white/10 bg-white/5 text-gray-300" },
  { name: "Inactive (30d+)", count: 1870, color: "border-primary/30 bg-primary/10 text-primary" },
];

const LIFECYCLE = [
  { stage: "Visitor", pct: 100 },
  { stage: "Registered", pct: 74 },
  { stage: "First Booking", pct: 58 },
  { stage: "Regular", pct: 39 },
  { stage: "Loyal / Member", pct: 22 },
  { stage: "At-Risk", pct: 8 },
];

const CHURN = [
  { name: "Ananya Patel", prob: 0.72, ltv: 8900, action: "Send PRESTIGE50 coupon" },
  { name: "Vikram Mehta", prob: 0.45, ltv: 14200, action: "Manager courtesy call" },
  { name: "Deepak Nair", prob: 0.38, ltv: 22100, action: "Complimentary upgrade" },
];

/**
 * Customer 360 intelligence: KPIs, AI-driven segments, lifecycle funnel,
 * churn/retention center and an AI prediction.
 */
const CustomerIntelligencePanel: React.FC = () => (
  <div className="space-y-6">
    {/* KPIs */}
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {KPIS.map((k) => (
        <div key={k.label} className="rounded-xl border border-white/5 bg-white/5 p-4">
          <span className="text-[10px] uppercase tracking-wider text-gray-500">{k.label}</span>
          <span className={`mt-1 block font-number text-xl font-bold ${k.color}`}>{k.value}</span>
        </div>
      ))}
    </div>

    {/* AI prediction */}
    <div className="flex items-start gap-3 rounded-xl border border-luxuryGold/20 bg-luxuryGold/5 p-4 text-[11px] leading-relaxed text-gray-300">
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-luxuryGold" />
      <span>
        <span className="font-bold text-luxuryGold">AI Insight:</span> Priya Sharma has an 87% probability of booking an
        action movie this weekend. Offer a combo package with premium seating and popcorn.
      </span>
    </div>

    <div className="grid gap-6 lg:grid-cols-3">
      {/* Segments */}
      <div className="glass-panel rounded-2xl border border-white/5 bg-black/40 p-5 lg:col-span-2">
        <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">
          <Users className="h-5 w-5 text-accent" /> AI Customer Segments
        </h3>
        <div className="flex flex-wrap gap-2">
          {SEGMENTS.map((s) => (
            <motion.span
              key={s.name}
              whileHover={{ y: -2 }}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${s.color}`}
            >
              {s.name}
              <span className="font-number opacity-80">{s.count.toLocaleString("en-IN")}</span>
            </motion.span>
          ))}
        </div>

        {/* Lifecycle funnel */}
        <h3 className="mb-4 mt-6 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">
          <Gauge className="h-5 w-5 text-emerald-400" /> Lifecycle Funnel
        </h3>
        <div className="space-y-2">
          {LIFECYCLE.map((l, i) => (
            <div key={l.stage} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-[11px] text-gray-400">{l.stage}</span>
              <div className="h-4 flex-1 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${l.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  className={`h-full rounded-full ${
                    l.stage === "At-Risk"
                      ? "bg-gradient-to-r from-primary to-red-700"
                      : "bg-gradient-to-r from-accent to-secondary"
                  }`}
                />
              </div>
              <span className="w-10 text-right font-number text-[11px] text-white">{l.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Retention center */}
      <div className="glass-panel rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-primary">
          <TrendingDown className="h-5 w-5" /> Churn & Retention
        </h3>
        <div className="space-y-3">
          {CHURN.map((c) => (
            <div key={c.name} className="rounded-xl border border-white/5 bg-black/40 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white">{c.name}</span>
                <span className="font-number text-[11px] font-bold text-primary">{Math.round(c.prob * 100)}%</span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-primary" style={{ width: `${c.prob * 100}%` }} />
              </div>
              <p className="mt-1.5 text-[10px] text-gray-500">
                LTV ₹{c.ltv.toLocaleString("en-IN")} · <span className="text-accent">{c.action}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default CustomerIntelligencePanel;
