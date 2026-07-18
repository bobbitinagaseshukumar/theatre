import React from "react";
import { motion } from "framer-motion";
import { Check, Crown, Sparkles } from "lucide-react";

interface Plan {
  name: string;
  tier: string;
  monthly: number;
  yearly: number;
  highlight?: boolean;
  perks: string[];
}

const PLANS: Plan[] = [
  { name: "Silver", tier: "Starter", monthly: 99, yearly: 999, perks: ["2% cashback", "Birthday coupon", "Early notifications"] },
  { name: "Gold", tier: "Popular", monthly: 199, yearly: 1999, highlight: true, perks: ["5% cashback", "Priority booking", "Food discounts", "Premium support"] },
  { name: "Platinum", tier: "Premium", monthly: 349, yearly: 3499, perks: ["10% cashback", "Lounge access", "Monthly free popcorn", "Faster refunds"] },
  { name: "Diamond", tier: "Elite", monthly: 599, yearly: 5999, perks: ["15% cashback", "VIP lounge", "Recliner upgrades", "Concierge support"] },
];

const FEATURES = [
  { label: "Cashback", vals: ["2%", "5%", "10%", "15%"] },
  { label: "Reward Multiplier", vals: ["1x", "1.5x", "2x", "3x"] },
  { label: "Priority Booking", vals: [false, true, true, true] },
  { label: "VIP Lounge", vals: [false, false, true, true] },
  { label: "Free Snacks", vals: [false, false, true, true] },
  { label: "Exclusive Events", vals: [false, false, false, true] },
];

const TIER_COLS = ["Silver", "Gold", "Platinum", "Diamond"];

/**
 * Subscription plans, tier comparison table and an AI savings tip.
 */
const PlansAndComparison: React.FC = () => {
  const [annual, setAnnual] = React.useState(true);

  return (
    <div className="space-y-12">
      {/* AI savings tip */}
      <div className="relative overflow-hidden rounded-cpm p-[1.5px]">
        <motion.div
          aria-hidden
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-gold via-gold-premium to-gold"
        />
        <div className="relative flex items-center gap-3 rounded-[15px] bg-cpm-surface/95 p-4 backdrop-blur">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/15 text-gold animate-cpmGlow">
            <Sparkles className="h-4 w-4" />
          </span>
          <p className="text-sm text-white">
            <span className="font-bold text-gold">AI Tip:</span> Upgrade to Platinum today and save approximately
            <span className="font-bold"> ₹3,000</span> over the next 12 months based on your booking pattern.
          </p>
        </div>
      </div>

      {/* Subscription plans */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-heading text-xl font-extrabold uppercase tracking-wide text-white">Subscription Plans</h3>
          <div className="flex items-center gap-2 rounded-full border border-cpm-border bg-white/5 p-1 text-xs">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-3 py-1 font-semibold ${!annual ? "bg-gold text-black" : "text-cpm-muted"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`rounded-full px-3 py-1 font-semibold ${annual ? "bg-gold text-black" : "text-cpm-muted"}`}
            >
              Annual · Save 15%
            </button>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => (
            <motion.div
              key={p.name}
              whileHover={{ y: -6 }}
              className={`relative rounded-cpm border p-6 ${
                p.highlight ? "border-gold bg-gold/5 shadow-goldGlow" : "border-cpm-border bg-white/5"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold to-gold-premium px-3 py-0.5 text-[10px] font-bold uppercase tracking-cpm text-black">
                  Most Popular
                </span>
              )}
              <div className="flex items-center gap-2">
                <Crown className={`h-5 w-5 ${p.highlight ? "text-gold" : "text-cpm-muted"}`} />
                <h4 className="font-heading text-lg font-bold text-white">{p.name}</h4>
              </div>
              <p className="mt-3 font-number text-3xl font-extrabold text-white">
                ₹{annual ? p.yearly : p.monthly}
                <span className="text-xs font-normal text-cpm-muted">/{annual ? "yr" : "mo"}</span>
              </p>
              <ul className="mt-4 space-y-2">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-xs text-cpm-muted">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                    {perk}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-6 w-full rounded-lg py-2.5 text-xs font-bold uppercase tracking-cpm transition-transform hover:scale-[1.02] ${
                  p.highlight
                    ? "bg-gradient-to-r from-gold to-gold-premium text-black shadow-goldGlow"
                    : "border border-cpm-border text-white hover:border-gold/40"
                }`}
              >
                {p.highlight ? "Upgrade Now" : "Choose Plan"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Benefits comparison */}
      <div>
        <h3 className="mb-6 font-heading text-xl font-extrabold uppercase tracking-wide text-white">Benefits Comparison</h3>
        <div className="overflow-x-auto rounded-cpm border border-cpm-border">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-cpm-border bg-white/5">
                <th className="p-4 text-left text-xs uppercase tracking-cpm text-cpm-muted">Benefit</th>
                {TIER_COLS.map((t) => (
                  <th key={t} className={`p-4 text-center text-xs font-bold ${t === "Gold" ? "text-gold" : "text-white"}`}>
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f) => (
                <tr key={f.label} className="border-b border-white/5 last:border-0">
                  <td className="p-4 text-cpm-muted">{f.label}</td>
                  {f.vals.map((v, i) => (
                    <td key={i} className="p-4 text-center">
                      {typeof v === "boolean" ? (
                        v ? (
                          <Check className="mx-auto h-4 w-4 text-gold" />
                        ) : (
                          <span className="text-cpm-muted/40">—</span>
                        )
                      ) : (
                        <span className={i === 1 ? "font-bold text-gold" : "text-white"}>{v}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlansAndComparison;
