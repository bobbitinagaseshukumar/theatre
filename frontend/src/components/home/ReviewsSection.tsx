import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import SectionHeader from "./SectionHeader";

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatar?: string;
}

const FALLBACK: Review[] = [
  { id: "r1", name: "Aarav Mehta", rating: 5, comment: "The Dolby Atmos screen is unreal. Booking took 30 seconds and the recliners are pure luxury." },
  { id: "r2", name: "Sneha Kapoor", rating: 5, comment: "Gold membership pays for itself. Priority seating and the lounge make weekends special." },
  { id: "r3", name: "Rohan Das", rating: 4, comment: "Love the food combos and how fast the seat selection is. Best cinema app I've used." },
];

const ReviewsSection: React.FC<{ reviews?: Review[] }> = ({ reviews = FALLBACK }) => (
  <section className="mx-auto max-w-[1600px] px-10 py-16">
    <SectionHeader eyebrow="Loved By Movie-Goers" title="What Our Guests Say" />
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {reviews.slice(0, 3).map((r, i) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: i * 0.1 }}
          className="cpm-glass relative p-6"
        >
          <Quote className="absolute right-5 top-5 h-8 w-8 text-gold/20" />
          <div className="mb-3 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, s) => (
              <Star
                key={s}
                className={`h-4 w-4 ${s < r.rating ? "fill-gold text-gold" : "text-white/15"}`}
              />
            ))}
          </div>
          <p className="text-sm leading-relaxed text-cpm-muted">“{r.comment}”</p>
          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-premium font-heading font-bold text-black">
              {r.avatar ? (
                <img src={r.avatar} alt={r.name} className="h-full w-full rounded-full object-cover" />
              ) : (
                r.name.charAt(0)
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{r.name}</p>
              <p className="text-[11px] text-cpm-muted">Verified booking</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default ReviewsSection;
