import React from "react";
import { motion } from "framer-motion";
import { Globe2, Languages, Coins, Sparkles } from "lucide-react";

const KPIS = [
  { label: "Countries", value: "42" },
  { label: "Languages", value: "26" },
  { label: "Currencies", value: "18" },
  { label: "Localization", value: "94%" },
];

const LANGS = [
  { name: "English", pct: 100 },
  { name: "Hindi", pct: 96 },
  { name: "Telugu", pct: 88 },
  { name: "Tamil", pct: 82 },
  { name: "Arabic (RTL)", pct: 74 },
  { name: "Spanish", pct: 68 },
];

const CURRENCIES = ["INR ₹", "USD $", "EUR €", "GBP £", "AED د.إ", "JPY ¥", "SGD $", "AUD $"];

const GlobalizationPanel: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {KPIS.map((k) => (
        <div key={k.label} className="rounded-xl border border-white/5 bg-white/5 p-4">
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gray-500">
            <Globe2 className="h-3.5 w-3.5 text-accent" /> {k.label}
          </span>
          <span className="mt-1 block font-number text-xl font-bold text-white">{k.value}</span>
        </div>
      ))}
    </div>

    <div className="flex items-start gap-3 rounded-xl border border-luxuryGold/20 bg-luxuryGold/5 p-4 text-[11px] text-gray-300">
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-luxuryGold" />
      <span><span className="font-bold text-luxuryGold">AI i18n:</span> The Telugu Booking Confirmation page is outdated after the latest UI update — 14 labels need re-translation before release.</span>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="glass-panel rounded-2xl border border-white/5 bg-black/40 p-5">
        <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">
          <Languages className="h-5 w-5 text-accent" /> Translation Coverage
        </h3>
        <div className="space-y-3">
          {LANGS.map((l) => (
            <div key={l.name}>
              <div className="mb-1 flex justify-between text-[11px] text-gray-400">
                <span>{l.name}</span>
                <span className="font-number text-white">{l.pct}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${l.pct}%` }} viewport={{ once: true }} transition={{ duration: 0.6 }} className={`h-full rounded-full ${l.pct >= 90 ? "bg-emerald-400" : l.pct >= 75 ? "bg-luxuryGold" : "bg-amber-400"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 bg-black/40 p-5">
        <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">
          <Coins className="h-5 w-5 text-luxuryGold" /> Multi-Currency & Regional
        </h3>
        <div className="flex flex-wrap gap-2">
          {CURRENCIES.map((c) => (
            <span key={c} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-number text-[11px] text-white">{c}</span>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] text-gray-400">
          {["GST / VAT engine", "Auto timezone (DST)", "RTL layout support", "Geo payment routing", "Regional compliance (GDPR/CCPA)", "Live FX conversion"].map((f) => (
            <span key={f} className="rounded border border-white/5 bg-white/5 px-2 py-1.5">{f}</span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default GlobalizationPanel;
