import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Globe, Zap, FileCheck2, DatabaseBackup, Brain } from "lucide-react";

const KPIS = [
  { label: "Security Score", value: "94/100", tone: "text-emerald-400" },
  { label: "Critical Threats", value: "0", tone: "text-emerald-400" },
  { label: "Active Incidents", value: "2", tone: "text-amber-400" },
  { label: "Blocked (24h)", value: "1,284", tone: "text-white" },
  { label: "Fraud Attempts", value: "37", tone: "text-primary" },
  { label: "Bot Traffic", value: "6.2%", tone: "text-white" },
];

const ATTACKS = [
  { x: 20, y: 40, sev: "high" },
  { x: 46, y: 28, sev: "med" },
  { x: 62, y: 60, sev: "high" },
  { x: 78, y: 44, sev: "low" },
  { x: 34, y: 66, sev: "med" },
];

const SOAR = [
  "Blocked IP 203.0.113.9 (credential stuffing)",
  "Locked 3 sessions · geo-mismatch login",
  "Rotated API keys after anomaly on /payments",
  "Isolated POS-Terminal-12 (malware signature)",
];

const COMPLIANCE = [
  { name: "PCI DSS", ok: true },
  { name: "ISO 27001", ok: true },
  { name: "SOC 2", ok: true },
  { name: "GDPR", ok: true },
  { name: "OWASP ASVS", ok: false },
];

const sevColor: Record<string, string> = {
  high: "bg-primary",
  med: "bg-amber-400",
  low: "bg-accent",
};

/**
 * Security Operations Center panel: KPIs, global attack map, SOAR automated
 * response, compliance status and backup/recovery objectives.
 */
const SocPanel: React.FC = () => (
  <div className="space-y-6">
    {/* AI security assistant */}
    <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-[11px] leading-relaxed text-gray-300">
      <Brain className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <span>
        <span className="font-bold text-primary">AI SOC:</span> Detected abnormal login behavior from multiple countries.
        Automatically enforcing MFA and temporarily locking suspicious sessions. Zero-Trust policies active.
      </span>
    </div>

    {/* KPIs */}
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {KPIS.map((k) => (
        <div key={k.label} className="rounded-xl border border-white/5 bg-white/5 p-3">
          <span className="text-[10px] uppercase tracking-wider text-gray-500">{k.label}</span>
          <span className={`mt-1 block font-number text-lg font-bold ${k.tone}`}>{k.value}</span>
        </div>
      ))}
    </div>

    <div className="grid gap-6 lg:grid-cols-3">
      {/* Global attack map */}
      <div className="lg:col-span-2">
        <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">
          <Globe className="h-5 w-5 text-accent" /> Live Global Threat Map
        </h3>
        <div className="relative h-[220px] overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0a]">
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.08) 1px,transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          {ATTACKS.map((a, i) => (
            <div key={i} className="absolute" style={{ left: `${a.x}%`, top: `${a.y}%` }}>
              <span className="relative flex h-3 w-3">
                <motion.span
                  className={`absolute inline-flex h-full w-full rounded-full ${sevColor[a.sev]} opacity-60`}
                  animate={{ scale: [1, 3, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
                <span className={`relative inline-flex h-3 w-3 rounded-full ${sevColor[a.sev]}`} />
              </span>
            </div>
          ))}
          <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-1.5 text-[10px] text-gray-400 backdrop-blur">
            {ATTACKS.length} live threat sources · auto-mitigation on
          </div>
        </div>

        {/* Backup & recovery */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "RPO", value: "5 min" },
            { label: "RTO", value: "18 min" },
            { label: "Backup Success", value: "100%" },
            { label: "Multi-Region", value: "3 zones" },
          ].map((b) => (
            <div key={b.label} className="rounded-xl border border-white/5 bg-black/40 p-3 text-center">
              <DatabaseBackup className="mx-auto h-4 w-4 text-emerald-400" />
              <span className="mt-1 block font-number text-sm font-bold text-white">{b.value}</span>
              <span className="text-[9px] uppercase tracking-wider text-gray-500">{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SOAR + compliance */}
      <div className="space-y-4">
        <div className="glass-panel rounded-2xl border border-white/5 bg-black/40 p-4">
          <h3 className="mb-3 flex items-center gap-2 font-heading text-xs font-extrabold uppercase tracking-wider text-gray-300">
            <Zap className="h-4 w-4 text-luxuryGold" /> SOAR Automated Response
          </h3>
          <div className="space-y-2">
            {SOAR.map((s, i) => (
              <div key={i} className="rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-[10px] text-gray-300">
                {s}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-2xl border border-white/5 bg-black/40 p-4">
          <h3 className="mb-3 flex items-center gap-2 font-heading text-xs font-extrabold uppercase tracking-wider text-gray-300">
            <FileCheck2 className="h-4 w-4 text-emerald-400" /> Compliance
          </h3>
          <div className="flex flex-wrap gap-2">
            {COMPLIANCE.map((c) => (
              <span
                key={c.name}
                className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                  c.ok
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                }`}
              >
                <ShieldCheck className="h-3 w-3" /> {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SocPanel;
