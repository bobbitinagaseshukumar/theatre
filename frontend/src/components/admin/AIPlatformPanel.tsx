import React from "react";
import { motion } from "framer-motion";
import { Brain, Boxes, GitBranch, ShieldCheck, Cpu } from "lucide-react";

const KPIS = [
  { label: "Active Models", value: "12" },
  { label: "Avg Accuracy", value: "92.4%" },
  { label: "Inference/day", value: "8.1M" },
  { label: "GPU Util", value: "63%" },
  { label: "AI Cost/day", value: "₹18.4k" },
  { label: "Impact Score", value: "A+" },
];

const REGISTRY = [
  { name: "Churn Engine", ver: "v4.2", acc: 0.94, status: "Prod" },
  { name: "Dynamic Pricing", ver: "v3.1", acc: 0.91, status: "Prod" },
  { name: "Recommender", ver: "v6.0", acc: 0.95, status: "Canary" },
  { name: "Fraud Detector", ver: "v2.8", acc: 0.96, status: "Staging" },
];

const PIPELINE = ["Ingest", "Validate", "Feature Store", "Train", "Evaluate", "Registry", "Deploy", "Monitor"];
const GOVERNANCE = ["Explainable AI", "Bias Detection", "Data Lineage", "Model Approval", "Audit Trail"];

const AIPlatformPanel: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {KPIS.map((k) => (
        <div key={k.label} className="rounded-xl border border-white/5 bg-white/5 p-3">
          <span className="text-[10px] uppercase tracking-wider text-gray-500">{k.label}</span>
          <span className="mt-1 block font-number text-lg font-bold text-white">{k.value}</span>
        </div>
      ))}
    </div>

    <div className="glass-panel rounded-2xl border border-white/5 bg-black/40 p-5">
      <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">
        <GitBranch className="h-5 w-5 text-accent" /> MLOps Pipeline
      </h3>
      <div className="flex flex-wrap items-center gap-2">
        {PIPELINE.map((s, i) => (
          <React.Fragment key={s}>
            <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-accent">{s}</span>
            {i < PIPELINE.length - 1 && <span className="text-gray-600">›</span>}
          </React.Fragment>
        ))}
      </div>
    </div>

    <div className="grid gap-6 lg:grid-cols-3">
      <div className="glass-panel rounded-2xl border border-white/5 bg-black/40 p-5 lg:col-span-2">
        <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">
          <Boxes className="h-5 w-5 text-luxuryGold" /> Model Registry
        </h3>
        <div className="space-y-2">
          {REGISTRY.map((m) => (
            <motion.div key={m.name} whileHover={{ x: 2 }} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-accent" />
                <span className="text-[11px] font-bold text-white">{m.name}</span>
                <span className="font-number text-[10px] text-gray-500">{m.ver}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-number text-[11px] text-emerald-400">{Math.round(m.acc * 100)}%</span>
                <span className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase ${m.status === "Prod" ? "bg-emerald-500/15 text-emerald-400" : m.status === "Canary" ? "bg-luxuryGold/15 text-luxuryGold" : "bg-white/10 text-gray-400"}`}>{m.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 bg-black/40 p-5">
        <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">
          <ShieldCheck className="h-5 w-5 text-emerald-400" /> AI Governance
        </h3>
        <div className="flex flex-wrap gap-2">
          {GOVERNANCE.map((g) => (
            <span key={g} className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">{g}</span>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-luxuryGold/20 bg-luxuryGold/5 p-3 text-[11px] text-gray-300">
          <Brain className="mt-0.5 h-3.5 w-3.5 shrink-0 text-luxuryGold" />
          Recommender v6.0 canary at 10% traffic · CTR +8% vs v5.4. Promote to production?
        </div>
      </div>
    </div>
  </div>
);

export default AIPlatformPanel;
