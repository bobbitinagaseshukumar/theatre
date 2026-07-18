import React from "react";
import { motion } from "framer-motion";
import { Rocket, CheckCircle2, CircleDot, Circle } from "lucide-react";

interface Phase {
  n: number;
  title: string;
  detail: string;
  state: "done" | "current" | "future";
}

const PHASES: Phase[] = [
  { n: 1, title: "Enterprise Platform", detail: "Microservices, cloud, payments, CRM, analytics", state: "done" },
  { n: 2, title: "AI Integration", detail: "GenAI assistant, predictive analytics, dynamic pricing", state: "current" },
  { n: 3, title: "Global Expansion", detail: "Multi-country, multi-language & currency, compliance", state: "future" },
  { n: 4, title: "Smart Theatres", detail: "IoT sensors, smart parking, autonomous validation", state: "future" },
  { n: 5, title: "Immersive Entertainment", detail: "AR/VR, metaverse, digital collectibles", state: "future" },
  { n: 6, title: "Autonomous Operations", detail: "Self-healing infra, AI DevOps/Finance/HR", state: "future" },
  { n: 7, title: "Global Super Platform", detail: "Movies, live events, sports, OTT, marketplace", state: "future" },
];

const ICON = {
  done: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
  current: <CircleDot className="h-5 w-5 text-luxuryGold" />,
  future: <Circle className="h-5 w-5 text-gray-600" />,
};

const RoadmapPanel: React.FC = () => (
  <div className="glass-panel rounded-2xl border border-white/5 bg-black/40 p-6">
    <h3 className="mb-6 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">
      <Rocket className="h-5 w-5 text-luxuryGold" /> Cinema Pro Max — 2035 Vision Roadmap
    </h3>
    <div className="relative space-y-4 border-l border-white/10 pl-6">
      {PHASES.map((p, i) => (
        <motion.div
          key={p.n}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          className="relative"
        >
          <span className="absolute -left-[31px] top-0 bg-[#0a0a0a]">{ICON[p.state]}</span>
          <div
            className={`rounded-xl border p-4 ${
              p.state === "current"
                ? "border-luxuryGold/40 bg-luxuryGold/5 shadow-goldGlow"
                : "border-white/5 bg-white/5"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-heading text-sm font-bold text-white">Phase {p.n} · {p.title}</span>
              {p.state === "current" && (
                <span className="rounded-full bg-luxuryGold/15 px-2 py-0.5 text-[9px] font-bold uppercase text-luxuryGold">In Progress</span>
              )}
              {p.state === "done" && (
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-400">Live</span>
              )}
            </div>
            <p className="mt-1 text-[11px] text-gray-400">{p.detail}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default RoadmapPanel;
