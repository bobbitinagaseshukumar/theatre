import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  IndianRupee,
  Ticket,
  Users,
  Film,
  Armchair,
  Popcorn,
  Receipt,
  RotateCcw,
  LifeBuoy,
  ServerCog,
  CreditCard,
  Brain,
  Sparkles,
  MapPin,
} from "lucide-react";

interface Kpi {
  icon: React.ReactNode;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  live?: boolean;
  color?: string;
}

const KPIS: Kpi[] = [
  { icon: <IndianRupee className="h-4 w-4" />, label: "Today's Revenue", value: 0, prefix: "₹", live: true, color: "text-white" },
  { icon: <Ticket className="h-4 w-4" />, label: "Today's Bookings", value: 0, live: true, color: "text-accent" },
  { icon: <Users className="h-4 w-4" />, label: "Active Users", value: 0, live: true, color: "text-emerald-400" },
  { icon: <Film className="h-4 w-4" />, label: "Movies Running", value: 0, color: "text-white" },
  { icon: <Armchair className="h-4 w-4" />, label: "Occupancy Rate", value: 0, suffix: "%", color: "text-luxuryGold" },
  { icon: <Popcorn className="h-4 w-4" />, label: "Food Revenue", value: 0, prefix: "₹", color: "text-white" },
  { icon: <Receipt className="h-4 w-4" />, label: "Avg Ticket Value", value: 0, prefix: "₹", color: "text-accent" },
  { icon: <RotateCcw className="h-4 w-4" />, label: "Refund Rate", value: 0, suffix: "%", decimals: 1, color: "text-white" },
  { icon: <LifeBuoy className="h-4 w-4" />, label: "Open Tickets", value: 0, color: "text-amber-400" },
  { icon: <ServerCog className="h-4 w-4" />, label: "Server Health", value: 0, suffix: "%", decimals: 1, color: "text-emerald-400" },
  { icon: <CreditCard className="h-4 w-4" />, label: "Payment Success", value: 0, suffix: "%", decimals: 1, color: "text-white" },
  { icon: <Brain className="h-4 w-4" />, label: "AI Business Score", value: 0, suffix: "/100", color: "text-luxuryGold" },
];

const REGIONS = [
  { name: "Mumbai", x: 22, y: 58 },
  { name: "Delhi", x: 40, y: 30 },
  { name: "Bengaluru", x: 48, y: 76 },
  { name: "Hyderabad", x: 55, y: 62 },
  { name: "Chennai", x: 60, y: 82 },
  { name: "Kolkata", x: 74, y: 46 },
];

const useCountUp = (target: number, run: boolean, decimals = 0, duration = 1400) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(parseFloat((eased * target).toFixed(decimals)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, decimals, duration]);
  return n;
};

const format = (n: number, decimals = 0) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const KpiCard: React.FC<{ kpi: Kpi; run: boolean; delay: number }> = ({ kpi, run, delay }) => {
  const base = useCountUp(kpi.value, run, kpi.decimals ?? 0);
  const [live, setLive] = useState(0);

  useEffect(() => {
    if (!kpi.live || !run) return;
    const t = window.setInterval(() => setLive((v) => v + Math.floor(Math.random() * 5)), 3000);
    return () => window.clearInterval(t);
  }, [kpi.live, run]);

  const display = kpi.decimals ? format(base, kpi.decimals) : format(base + live);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={run ? { opacity: 1, y: 0 } : {}}
      transition={{ delay }}
      className="relative overflow-hidden rounded-xl border border-white/5 bg-white/5 p-4 hover:border-primary/30 transition-colors"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
          {kpi.icon}
        </span>
        {kpi.live && (
          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live
          </span>
        )}
      </div>
      <span className="block text-[10px] uppercase tracking-wider text-gray-500">{kpi.label}</span>
      <span className={`mt-0.5 block font-number text-lg font-bold ${kpi.color ?? "text-white"}`}>
        {kpi.prefix}
        {display}
        {kpi.suffix}
      </span>
    </motion.div>
  );
};

/**
 * Enterprise executive overview: real-time KPI grid, live business map and an
 * AI business assistant insight — the top of the Super Admin stats tab.
 */
const ExecutiveOverview: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="space-y-8">
      {/* Real-time KPI grid */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-400">
          <Sparkles className="h-5 w-5 text-luxuryGold" /> Real-Time Executive KPIs
        </h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {KPIS.map((k, i) => (
            <KpiCard key={k.label} kpi={k} run={inView} delay={i * 0.05} />
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Live business map */}
        <div className="lg:col-span-2">
          <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-400">
            <MapPin className="h-5 w-5 text-accent" /> Live Business Map
          </h3>
          <div className="relative h-[280px] overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0a]">
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.08) 1px,transparent 1px)",
                backgroundSize: "36px 36px",
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_50%,rgba(229,9,20,0.08),transparent_55%)]" />
            {REGIONS.map((r, i) => (
              <div key={r.name} className="absolute" style={{ left: `${r.x}%`, top: `${r.y}%` }}>
                <span className="relative flex h-3 w-3">
                  <motion.span
                    className="absolute inline-flex h-full w-full rounded-full bg-primary/60"
                    animate={{ scale: [1, 2.8, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.3 }}
                  />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-primary shadow-redGlow" />
                </span>
                <span className="absolute left-4 top-0 whitespace-nowrap text-[9px] font-semibold text-gray-400">
                  {r.name}
                </span>
              </div>
            ))}
            <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-1.5 text-[10px] text-gray-400 backdrop-blur">
              {REGIONS.length} active regions · 0 online customers
            </div>
          </div>
        </div>

        {/* AI business assistant */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-400">
            <Brain className="h-5 w-5 text-luxuryGold" /> AI Business Assistant
          </h3>
          <div className="space-y-3">
            {[
              "No revenue data yet. Add movies and showtimes to start generating insights.",
              "Configure your theatre screens and pricing to enable AI forecasting.",
              "Connect customer data sources to unlock churn prediction and retention tools.",
            ].map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="flex gap-2 rounded-xl border border-luxuryGold/20 bg-luxuryGold/5 p-3 text-[11px] leading-relaxed text-gray-300"
              >
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-luxuryGold" />
                {tip}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveOverview;
