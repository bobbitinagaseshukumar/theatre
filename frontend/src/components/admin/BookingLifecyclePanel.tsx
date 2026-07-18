import React from "react";
import { motion } from "framer-motion";
import { Activity, ShieldAlert, CheckCircle2, Lock } from "lucide-react";

const LIFECYCLE = [
  "Seat Locked",
  "Payment Pending",
  "Authorized",
  "Confirmed",
  "Ticket Generated",
  "Checked-In",
  "Completed",
];

const LIVE = [
  { label: "Bookings / min", value: "142", color: "text-white" },
  { label: "Concurrent Users", value: "3,410", color: "text-accent" },
  { label: "Active Seat Locks", value: "268", color: "text-amber-400" },
  { label: "Payment Queue", value: "12", color: "text-white" },
  { label: "Avg Response", value: "480ms", color: "text-emerald-400" },
  { label: "Failures (retry)", value: "3", color: "text-primary" },
];

const FRAUD = [
  { case: "Multiple QR usage · bk-8841", score: 0.82, level: "High" },
  { case: "Velocity: 6 bookings/2m · usr-903", score: 0.61, level: "Medium" },
];

/**
 * Booking lifecycle tracker, live reservation metrics and AI fraud screening.
 */
const BookingLifecyclePanel: React.FC = () => (
  <div className="space-y-6">
    {/* Live metrics */}
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {LIVE.map((m) => (
        <div key={m.label} className="rounded-xl border border-white/5 bg-white/5 p-3">
          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live
          </span>
          <span className="mt-1 block text-[10px] uppercase text-gray-500">{m.label}</span>
          <span className={`block font-number text-lg font-bold ${m.color}`}>{m.value}</span>
        </div>
      ))}
    </div>

    <div className="grid gap-6 lg:grid-cols-3">
      {/* Lifecycle */}
      <div className="glass-panel rounded-2xl border border-white/5 bg-black/40 p-5 lg:col-span-2">
        <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">
          <Activity className="h-5 w-5 text-accent" /> Booking Lifecycle
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {LIFECYCLE.map((s, i) => (
            <React.Fragment key={s}>
              <div
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                  i < 4
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : i === 4
                    ? "border-accent/40 bg-accent/10 text-accent"
                    : "border-white/10 bg-white/5 text-gray-500"
                }`}
              >
                {i < 4 ? <CheckCircle2 className="h-3 w-3" /> : i === 4 ? <Lock className="h-3 w-3" /> : null}
                {s}
              </div>
              {i < LIFECYCLE.length - 1 && <span className="text-gray-600">›</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Fraud screening */}
      <div className="glass-panel rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-primary">
          <ShieldAlert className="h-5 w-5" /> AI Fraud Screening
        </h3>
        <div className="space-y-3">
          {FRAUD.map((f) => (
            <motion.div key={f.case} whileHover={{ x: 2 }} className="rounded-xl border border-white/5 bg-black/40 p-3">
              <p className="text-[11px] font-semibold text-white">{f.case}</p>
              <div className="mt-1.5 flex items-center justify-between text-[10px]">
                <span className="text-gray-500">Risk: {f.level}</span>
                <span className="font-number font-bold text-primary">{Math.round(f.score * 100)}%</span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-primary" style={{ width: `${f.score * 100}%` }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default BookingLifecyclePanel;
