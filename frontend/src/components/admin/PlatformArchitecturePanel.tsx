import React from "react";
import { motion } from "framer-motion";
import { Server, GitBranch, Activity, Cloud, CheckCircle2, Loader2 } from "lucide-react";

interface Svc {
  name: string;
  status: "Healthy" | "Degraded";
  latency: number;
  rps: number;
}

const SERVICES: Svc[] = [
  { name: "Auth", status: "Healthy", latency: 42, rps: 1820 },
  { name: "Booking", status: "Healthy", latency: 68, rps: 3410 },
  { name: "Payment", status: "Healthy", latency: 91, rps: 1240 },
  { name: "Seat Inventory", status: "Healthy", latency: 38, rps: 4020 },
  { name: "Notification", status: "Degraded", latency: 210, rps: 980 },
  { name: "Search", status: "Healthy", latency: 55, rps: 2600 },
  { name: "Recommendation", status: "Healthy", latency: 74, rps: 720 },
  { name: "Media", status: "Healthy", latency: 120, rps: 430 },
];

const INFRA = [
  { label: "Availability", value: "99.999%", icon: <Cloud className="h-4 w-4" /> },
  { label: "Regions", value: "3", icon: <Cloud className="h-4 w-4" /> },
  { label: "Pods", value: "148", icon: <Server className="h-4 w-4" /> },
  { label: "API Req/s", value: "18.2k", icon: <Activity className="h-4 w-4" /> },
];

const DEPLOYS = [
  { svc: "booking-service", ver: "v2.14.0", strat: "Canary", status: "Success", time: "12m ago" },
  { svc: "payment-service", ver: "v3.02.1", strat: "Blue-Green", status: "Success", time: "1h ago" },
  { svc: "notification-service", ver: "v1.88.0", strat: "Rolling", status: "In Progress", time: "now" },
];

/**
 * Platform architecture observability: microservice health, infra metrics and
 * a live deployment timeline.
 */
const PlatformArchitecturePanel: React.FC = () => (
  <div className="space-y-6">
    {/* Infra metrics */}
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {INFRA.map((m) => (
        <div key={m.label} className="rounded-xl border border-white/5 bg-white/5 p-4">
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gray-500">
            <span className="text-accent">{m.icon}</span> {m.label}
          </span>
          <span className="mt-1 block font-number text-xl font-bold text-white">{m.value}</span>
        </div>
      ))}
    </div>

    <div className="grid gap-6 lg:grid-cols-3">
      {/* Service health */}
      <div className="glass-panel rounded-2xl border border-white/5 bg-black/40 p-5 lg:col-span-2">
        <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">
          <Server className="h-5 w-5 text-accent" /> Microservice Health
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SERVICES.map((s) => (
            <motion.div
              key={s.name}
              whileHover={{ y: -3 }}
              className={`rounded-xl border p-3 ${
                s.status === "Healthy" ? "border-white/5 bg-white/5" : "border-amber-500/30 bg-amber-500/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white">{s.name}</span>
                <span
                  className={`h-2 w-2 rounded-full ${
                    s.status === "Healthy" ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
                  }`}
                />
              </div>
              <p className="mt-1 font-number text-[10px] text-gray-400">{s.latency}ms · {s.rps}/s</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Deployment timeline */}
      <div className="glass-panel rounded-2xl border border-white/5 bg-black/40 p-5">
        <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">
          <GitBranch className="h-5 w-5 text-luxuryGold" /> Deployment Timeline
        </h3>
        <div className="space-y-3">
          {DEPLOYS.map((d) => (
            <div key={d.svc} className="rounded-xl border border-white/5 bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <span className="font-number text-[11px] font-bold text-white">{d.svc}</span>
                <span className="text-[9px] text-gray-500">{d.time}</span>
              </div>
              <p className="mt-1 text-[10px] text-gray-400">{d.ver} · {d.strat}</p>
              <span
                className={`mt-1 flex items-center gap-1 text-[10px] font-bold ${
                  d.status === "Success" ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {d.status === "Success" ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
                {d.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default PlatformArchitecturePanel;
