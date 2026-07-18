import React, { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, AlertTriangle, Sparkles } from "lucide-react";

type Fmt = "2D" | "3D" | "IMAX" | "4DX";

interface Show {
  day: number; // 0..6
  time: string;
  movie: string;
  screen: string;
  format: Fmt;
  occupancy: number;
  conflict?: boolean;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const FMT_COLOR: Record<Fmt, string> = {
  "2D": "border-accent/40 bg-accent/10 text-accent",
  "3D": "border-secondary/40 bg-secondary/10 text-secondary",
  IMAX: "border-luxuryGold/40 bg-luxuryGold/10 text-luxuryGold",
  "4DX": "border-primary/40 bg-primary/10 text-primary",
};

const SHOWS: Show[] = [
  { day: 0, time: "10:00", movie: "Aether", screen: "S1", format: "IMAX", occupancy: 62 },
  { day: 0, time: "13:30", movie: "Shadows", screen: "S2", format: "2D", occupancy: 44 },
  { day: 1, time: "18:00", movie: "Aether", screen: "S1", format: "IMAX", occupancy: 88 },
  { day: 2, time: "19:30", movie: "Chronicles", screen: "S3", format: "3D", occupancy: 71 },
  { day: 3, time: "21:00", movie: "Shadows", screen: "S1", format: "4DX", occupancy: 95, conflict: true },
  { day: 4, time: "16:00", movie: "Aether", screen: "S2", format: "2D", occupancy: 53 },
  { day: 5, time: "12:00", movie: "Chronicles", screen: "S4", format: "3D", occupancy: 80 },
  { day: 5, time: "20:00", movie: "Aether", screen: "S1", format: "IMAX", occupancy: 92 },
  { day: 6, time: "15:00", movie: "Shadows", screen: "S3", format: "2D", occupancy: 39 },
];

/**
 * Weekly show calendar with format color-coding, conflict highlighting and an
 * AI scheduling suggestion.
 */
const ShowCalendar: React.FC = () => {
  const [view, setView] = useState<"week" | "day" | "month">("week");
  const hasConflict = SHOWS.some((s) => s.conflict);

  return (
    <div className="glass-panel border border-white/5 p-6 rounded-2xl bg-black/40">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">
          <CalendarDays className="h-5 w-5 text-accent" /> Show Calendar
        </h3>
        <div className="flex gap-1 rounded-lg border border-white/10 bg-black/40 p-1 text-[10px] font-bold uppercase">
          {(["day", "week", "month"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded px-3 py-1.5 transition-colors ${
                view === v ? "bg-primary text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* AI suggestion */}
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-luxuryGold/20 bg-luxuryGold/5 p-3 text-[11px] text-gray-300">
        <Sparkles className="h-4 w-4 shrink-0 text-luxuryGold" />
        Move the 21:00 show to Screen 5 to increase expected occupancy by 14% and resolve the 4DX screen conflict.
      </div>

      {/* Week grid */}
      <div className="grid grid-cols-7 gap-2">
        {DAYS.map((d, di) => (
          <div key={d} className="min-h-[160px] rounded-xl border border-white/5 bg-white/5 p-2">
            <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-wider text-gray-500">{d}</p>
            <div className="space-y-1.5">
              {SHOWS.filter((s) => s.day === di).map((s, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  className={`rounded-lg border p-1.5 text-[9px] ${FMT_COLOR[s.format]} ${
                    s.conflict ? "ring-1 ring-primary" : ""
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{s.time}</span>
                    {s.conflict && <AlertTriangle className="h-3 w-3 text-primary" />}
                  </div>
                  <p className="truncate font-semibold text-white">{s.movie}</p>
                  <p className="text-gray-400">{s.screen} · {s.format} · {s.occupancy}%</p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {hasConflict && (
        <div className="mt-4 flex items-center gap-2 text-[11px] text-primary">
          <AlertTriangle className="h-3.5 w-3.5" /> 1 scheduling conflict detected · one-click resolution available
        </div>
      )}
    </div>
  );
};

export default ShowCalendar;
