import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Film, MonitorPlay, Users, CalendarClock } from "lucide-react";

interface Stat {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  label: string;
}

const STATS: Stat[] = [
  { icon: <Film className="h-6 w-6" />, value: 48, label: "Movies Running" },
  { icon: <MonitorPlay className="h-6 w-6" />, value: 12, label: "Screens" },
  { icon: <Users className="h-6 w-6" />, value: 250, suffix: "K+", label: "Happy Customers" },
  { icon: <CalendarClock className="h-6 w-6" />, value: 96, label: "Shows Today" },
];

/** Counts up from 0 to `target` once, when triggered. */
const useCountUp = (target: number, run: boolean, duration = 1400) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * target));
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
      initial={{ opacity: 0, y: 30 }}
      animate={run ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="cpm-glass flex flex-col items-center gap-2 p-6 text-center"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
        {stat.icon}
      </span>
      <span className="font-number text-3xl font-extrabold text-white">
        {n}
        {stat.suffix ?? ""}
      </span>
      <span className="text-xs uppercase tracking-cpm text-cpm-muted">{stat.label}</span>
    </motion.div>
  );
};

const QuickStats: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="mx-auto max-w-[1600px] px-10 py-20">
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <StatCard key={s.label} stat={s} run={inView} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
};

export default QuickStats;
