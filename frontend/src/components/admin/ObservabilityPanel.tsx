import React from "react";
import { motion } from "framer-motion";
import { Activity, Radar, AlertTriangle, GitCommitHorizontal, Gauge } from "lucide-react";

const AVAILABILITY = [
  { label: "Application", value: "99.98%" },
  { label: "API Gateway", value: "99.99%" },
  { label: "Database", value: "100%" },
  { label: "Payments", value: "99.95%" },
];

const GOLDEN = [
  { label: "Error Rate", value: "0.12%", tone: "text-emerald-400" },
  { label: "Avg Latency", value: "88ms", tone: "text-white" },
  { label: "Throughput", value: "18.2k/s", tone: "text-accent" },
  { label: "Apdex", value: "0.97", tone: "text-emerald-400" },
];

const SLO = [
  { label: "Availability SLO", target: "99.9%", current: 99.98 },
  { label: "Latency SLO (<200ms)", target: "99%", current: 98.4 },
  { label: "Error Budget", target: "monthly", current: 76 },
];

const INCIDENTS = [
  { sev: "SEV-3", text: "Notification service p95 latency elevated", time: "18m", tone: "text-amber-400" },
  { sev: "SEV-4", text: "Redis cache hit ratio dipped to 91%", time: "1h", tone: "text-accent" },
];

/**
 * Enterprise observability: health score, availability, golden signals, SLO/MTTR,
 * live incidents and an AI root-cause insight.
 */
const ObservabilityPanel: React.FC = () => (
  <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
          <Radar className="h-6 w-6" />
        </span>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Platform Health Score</p>
          <p className="font-number text-2xl font-extrabold text-emerald-400">98 / 100</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {AVAILABILITY.map((a) => (
          <div key={a.label} className="rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-center">
            <span className="block font-number text-sm font-bold text-white">{a.value}</span>
            <span className="text-[9px] uppercase tracking-wider text-gray-500">{a.label}</span>
          </div>
        ))}
      </div>
    </div>

    {/* AI observability assistant */}
    <div className="flex items-start gap-3 rounded-xl border border-luxuryGold/20 bg-luxuryGold/5 p-4 text-[11px] leading-relaxed text-gray-300">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-luxuryGold" />
      <span>
        <span className="font-bold text-luxuryGold">AI RCA:</span> Booking API latency increased by 27% after the latest
        deployment. Root cause is a slow query in the Seat Reservation Service. Recommended action: rollback deployment or
        add a composite index.
      </span>
    </div>

    {/* Golden signals */}
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {GOLDEN.map((g) => (
        <div key={g.label} className="rounded-xl border border-white/5 bg-white/5 p-4">
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gray-500">
            <Activity className="h-3.5 w-3.5 text-accent" /> {g.label}
          </span>
          <span className={`mt-1 block font-number text-xl font-bold ${g.tone}`}>{g.value}</span>
        </div>
      ))}
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      {/* SLO / error budget */}
      <div className="glass-panel rounded-2xl border border-white/5 bg-black/40 p-5">
        <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">
          <Gauge className="h-5 w-5 text-emerald-400" /> SRE · SLO & Error Budget
        </h3>
        <div className="space-y-3">
          {SLO.map((s) => (
            <div key={s.label}>
              <div className="mb-1 flex justify-between text-[11px] text-gray-400">
                <span>{s.label} <span className="text-gray-600">({s.target})</span></span>
                <span className="font-number text-white">{s.current}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.current}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`h-full rounded-full ${s.current >= 99 ? "bg-emerald-400" : "bg-amber-400"}`}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-4 border-t border-white/5 pt-3 font-number text-[11px] text-gray-400">
          <span>MTTD <span className="font-bold text-white">42s</span></span>
          <span>MTTR <span className="font-bold text-white">14m</span></span>
          <span>Reliability <span className="font-bold text-emerald-400">A+</span></span>
        </div>
      </div>

      {/* Active incidents */}
      <div className="glass-panel rounded-2xl border border-white/5 bg-black/40 p-5">
        <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">
          <GitCommitHorizontal className="h-5 w-5 text-accent" /> Active Incidents
        </h3>
        <div className="space-y-2">
          {INCIDENTS.map((i, idx) => (
            <div key={idx} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 px-3 py-2.5">
              <span className={`font-number text-[10px] font-bold ${i.tone}`}>{i.sev}</span>
              <span className="flex-1 text-[11px] text-gray-300">{i.text}</span>
              <span className="text-[10px] text-gray-500">{i.time}</span>
            </div>
          ))}
          <p className="pt-1 text-center text-[10px] text-gray-500">Synthetic checks green · RUM p75 LCP 1.4s</p>
        </div>
      </div>
    </div>
  </div>
);

export default ObservabilityPanel;
