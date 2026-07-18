import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Ticket,
  Coins,
  Wallet,
  PiggyBank,
  Film,
  Popcorn,
  Gift,
  UserPlus,
  Crown,
  LifeBuoy,
} from "lucide-react";

interface Stat {
  icon: React.ReactNode;
  value: number;
  prefix?: string;
  label: string;
}

const useCountUp = (target: number, run: boolean, duration = 1200) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);
  return n;
};

const StatCard: React.FC<{ stat: Stat; run: boolean; delay: number }> = ({ stat, run, delay }) => {
  const n = useCountUp(stat.value, run);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={run ? { opacity: 1, y: 0 } : {}}
      transition={{ delay }}
      className="cpm-glass flex items-center gap-4 p-5"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold">
        {stat.icon}
      </span>
      <div>
        <p className="font-number text-2xl font-extrabold text-white">
          {stat.prefix}
          {n}
        </p>
        <p className="text-[11px] uppercase tracking-cpm text-cpm-muted">{stat.label}</p>
      </div>
    </motion.div>
  );
};

export interface DashboardExtrasProps {
  totalBookings: number;
  totalSpent: number;
}

const QUICK_ACTIONS = [
  { icon: <Film className="h-4 w-4" />, label: "Book Tickets", to: "/movies" },
  { icon: <Popcorn className="h-4 w-4" />, label: "Order Food", to: "/food" },
  { icon: <Crown className="h-4 w-4" />, label: "Upgrade Plan", to: "/membership" },
  { icon: <Gift className="h-4 w-4" />, label: "Offers", to: "/offers" },
  { icon: <UserPlus className="h-4 w-4" />, label: "Refer a Friend", to: "/membership" },
  { icon: <LifeBuoy className="h-4 w-4" />, label: "Support", to: "/contact" },
];

/**
 * Dashboard quick statistics, digital wallet snapshot and quick actions.
 */
const DashboardExtras: React.FC<DashboardExtrasProps> = ({ totalBookings, totalSpent }) => {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const points = totalBookings * 120;
  const saved = Math.round(totalSpent * 0.12);

  const stats: Stat[] = [
    { icon: <Ticket className="h-5 w-5" />, value: totalBookings, label: "Total Bookings" },
    { icon: <Coins className="h-5 w-5" />, value: points, label: "Reward Points" },
    { icon: <PiggyBank className="h-5 w-5" />, value: saved, prefix: "₹", label: "Money Saved" },
    { icon: <Wallet className="h-5 w-5" />, value: 750, prefix: "₹", label: "Wallet Balance" },
  ];

  return (
    <div ref={ref} className="space-y-10">
      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} stat={s} run={inView} delay={i * 0.08} />
        ))}
      </div>

      {/* Wallet + quick actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="cpm-glass relative overflow-hidden p-6 lg:col-span-1">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
          <div className="flex items-center gap-2 text-gold">
            <Wallet className="h-5 w-5" />
            <h3 className="font-heading font-bold text-white">Digital Wallet</h3>
          </div>
          <p className="mt-4 font-number text-3xl font-extrabold text-white">₹750.00</p>
          <p className="text-xs text-cpm-muted">Cashback ₹120 · {points} reward coins</p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => navigate("/membership")}
              className="flex-1 rounded-lg bg-gradient-to-r from-gold to-gold-premium py-2 text-xs font-bold text-black"
            >
              Add Money
            </button>
            <button
              onClick={() => navigate("/membership")}
              className="flex-1 rounded-lg border border-cpm-border py-2 text-xs font-semibold text-white hover:border-gold/40"
            >
              Redeem
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="mb-4 font-heading font-bold text-white">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {QUICK_ACTIONS.map((a) => (
              <button
                key={a.label}
                onClick={() => navigate(a.to)}
                className="flex flex-col items-center gap-2 rounded-cpm border border-cpm-border bg-white/5 p-4 text-center transition-all hover:border-gold/40 hover:shadow-goldGlow"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
                  {a.icon}
                </span>
                <span className="text-xs font-semibold text-white">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardExtras;
