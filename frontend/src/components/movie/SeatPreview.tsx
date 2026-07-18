import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SeatCard, Button, type SeatStatus, type SeatType } from "../ui";

export interface SeatPreviewProps {
  movieId: string;
  bookable?: boolean;
}

const ROWS = ["A", "B", "C", "D", "E"];
const COLS = 10;

// Deterministic pseudo-status so the preview is stable per render.
const seededStatus = (r: number, c: number): SeatStatus => {
  const n = (r * 31 + c * 17) % 10;
  if (n === 0 || n === 7) return "booked";
  if (n === 3) return "locked";
  return "available";
};
const seatType = (r: number): SeatType => (r >= 4 ? "vip" : r >= 2 ? "premium" : "standard");

const LEGEND: { label: string; status: SeatStatus }[] = [
  { label: "Available", status: "available" },
  { label: "Selected", status: "selected" },
  { label: "Booked", status: "booked" },
  { label: "Locked", status: "locked" },
];

/**
 * Non-interactive mini seat map preview. "Open full selection" routes to the
 * full booking flow.
 */
const SeatPreview: React.FC<SeatPreviewProps> = ({ movieId, bookable = true }) => {
  const navigate = useNavigate();

  return (
    <section className="mt-[120px]">
      <div className="mb-8">
        <h2 className="font-heading text-3xl font-extrabold uppercase tracking-wide text-white">
          Seat Availability
        </h2>
        <p className="mt-1 text-xs text-cpm-muted">A live preview of a sample screen layout</p>
      </div>

      <div className="cpm-glass p-6">
        {/* Curved screen */}
        <div className="mb-8 flex flex-col items-center">
          <div className="cinema-screen w-2/3" />
          <span className="mt-2 text-[10px] uppercase tracking-cpm text-cpm-muted">Screen this way</span>
        </div>

        <div className="flex flex-col items-center gap-2 overflow-x-auto">
          {ROWS.map((row, r) => (
            <motion.div
              key={row}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: r * 0.05 }}
              className="flex items-center gap-2"
            >
              <span className="w-4 text-[10px] font-bold text-cpm-muted">{row}</span>
              {Array.from({ length: COLS }).map((_, c) => (
                <SeatCard
                  key={`${row}-${c}`}
                  label={`${c + 1}`}
                  status={seededStatus(r, c)}
                  type={seatType(r)}
                />
              ))}
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-5 border-t border-white/5 pt-5">
          {LEGEND.map((l) => (
            <div key={l.label} className="flex items-center gap-2 text-xs text-cpm-muted">
              <SeatCard label="" status={l.status} className="pointer-events-none" />
              {l.label}
            </div>
          ))}
        </div>

        {bookable && (
          <div className="mt-6 flex justify-center">
            <Button size="lg" onClick={() => navigate(`/showtimes/${movieId}`)}>
              Open Full Seat Selection
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SeatPreview;
