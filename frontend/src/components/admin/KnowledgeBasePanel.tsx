import React from "react";
import { BookOpen, FileText, Sparkles } from "lucide-react";

const KPIS = [
  { label: "Documents", value: "1,284" },
  { label: "Published", value: "1,090" },
  { label: "Pending Review", value: "38" },
  { label: "Search Success", value: "96%" },
];

const CATEGORIES = ["Architecture", "Development", "Deployment", "Operations", "Security", "Database", "API", "Business", "HR", "Support"];

const RECENT = [
  { title: "System Architecture Overview", status: "Published", updated: "2d ago" },
  { title: "API Authentication Guide (v2)", status: "In Review", updated: "5h ago" },
  { title: "Disaster Recovery Runbook", status: "Published", updated: "1w ago" },
  { title: "Prisma Migration Standards", status: "Draft", updated: "1d ago" },
];

const KnowledgeBasePanel: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {KPIS.map((k) => (
        <div key={k.label} className="rounded-xl border border-white/5 bg-white/5 p-4">
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gray-500"><BookOpen className="h-3.5 w-3.5 text-accent" /> {k.label}</span>
          <span className="mt-1 block font-number text-xl font-bold text-white">{k.value}</span>
        </div>
      ))}
    </div>

    <div className="grid gap-6 lg:grid-cols-3">
      <div className="glass-panel rounded-2xl border border-white/5 bg-black/40 p-5 lg:col-span-2">
        <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">
          <FileText className="h-5 w-5 text-accent" /> Recent Documents
        </h3>
        <div className="space-y-2">
          {RECENT.map((d) => (
            <div key={d.title} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3">
              <span className="text-[11px] font-semibold text-white">{d.title}</span>
              <div className="flex items-center gap-3">
                <span className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase ${d.status === "Published" ? "bg-emerald-500/15 text-emerald-400" : d.status === "In Review" ? "bg-luxuryGold/15 text-luxuryGold" : "bg-white/10 text-gray-400"}`}>{d.status}</span>
                <span className="text-[9px] text-gray-500">{d.updated}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 bg-black/40 p-5">
        <h3 className="mb-4 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">Knowledge Base</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <span key={c} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-gray-300">{c}</span>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-luxuryGold/20 bg-luxuryGold/5 p-3 text-[11px] text-gray-300">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-luxuryGold" />
          AI flagged 3 outdated deploy docs after the Kubernetes 1.32 upgrade — suggest refresh.
        </div>
      </div>
    </div>
  </div>
);

export default KnowledgeBasePanel;
