import React from "react";
import { motion } from "framer-motion";
import { ChefHat, Sparkles, Timer } from "lucide-react";

interface Order {
  id: string;
  items: string;
  seat?: string;
  mins: number;
  vip?: boolean;
}

const COLUMNS: { title: string; tone: string; orders: Order[] }[] = [
  {
    title: "Incoming",
    tone: "text-accent",
    orders: [
      { id: "#5821", items: "2× Popcorn, 1× Pepsi", seat: "C5", mins: 0 },
      { id: "#5822", items: "1× Nachos", seat: "F2", mins: 0, vip: true },
    ],
  },
  {
    title: "Preparing",
    tone: "text-amber-400",
    orders: [
      { id: "#5818", items: "1× Pizza, 1× Coffee", seat: "H8", mins: 4 },
      { id: "#5819", items: "3× Popcorn", seat: "A1", mins: 2 },
    ],
  },
  {
    title: "Ready",
    tone: "text-emerald-400",
    orders: [
      { id: "#5814", items: "Couple Combo", seat: "J10", mins: 0 },
    ],
  },
];

/**
 * Kitchen Display System (KDS) columns + AI demand forecast.
 */
const KitchenDisplayPanel: React.FC = () => (
  <div className="space-y-6">
    <div className="glass-panel rounded-2xl border border-white/5 bg-black/40 p-5">
      <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">
        <ChefHat className="h-5 w-5 text-luxuryGold" /> Kitchen Display System
      </h3>
      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => (
          <div key={col.title} className="rounded-xl border border-white/5 bg-white/5 p-3">
            <div className="mb-3 flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider ${col.tone}`}>{col.title}</span>
              <span className="text-[10px] text-gray-500">{col.orders.length}</span>
            </div>
            <div className="space-y-2">
              {col.orders.map((o) => (
                <motion.div
                  key={o.id}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-lg border border-white/5 bg-black/40 p-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-number text-[11px] font-bold text-white">{o.id}</span>
                    {o.vip && (
                      <span className="rounded bg-luxuryGold/15 px-1.5 py-0.5 text-[8px] font-bold text-luxuryGold">VIP</span>
                    )}
                  </div>
                  <p className="mt-1 text-[10px] text-gray-400">{o.items}</p>
                  <div className="mt-1 flex items-center justify-between text-[9px] text-gray-500">
                    <span>Seat {o.seat}</span>
                    {o.mins > 0 && (
                      <span className="flex items-center gap-1 text-amber-400">
                        <Timer className="h-2.5 w-2.5" /> {o.mins}m
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="flex items-center gap-2 rounded-xl border border-luxuryGold/20 bg-luxuryGold/5 p-3 text-[11px] text-gray-300">
      <Sparkles className="h-4 w-4 shrink-0 text-luxuryGold" />
      AI Demand: Increase popcorn inventory by 28% for Friday evening due to expected blockbuster occupancy. Truffle Oil
      critically low — auto-reorder suggested.
    </div>
  </div>
);

export default KitchenDisplayPanel;
