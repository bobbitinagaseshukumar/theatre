import React from "react";
import { motion } from "framer-motion";

export interface GenreItem {
  name: string;
  emoji: string;
  gradient: string;
}

const GENRES: GenreItem[] = [
  { name: "Action", emoji: "💥", gradient: "from-red-500/30 to-orange-500/20" },
  { name: "Comedy", emoji: "😂", gradient: "from-yellow-400/30 to-amber-500/20" },
  { name: "Thriller", emoji: "🔪", gradient: "from-slate-500/30 to-gray-700/20" },
  { name: "Horror", emoji: "👻", gradient: "from-purple-600/30 to-black/30" },
  { name: "Romance", emoji: "❤️", gradient: "from-pink-500/30 to-rose-500/20" },
  { name: "Sci-Fi", emoji: "🚀", gradient: "from-cyan-500/30 to-blue-600/20" },
  { name: "Family", emoji: "👨‍👩‍👧", gradient: "from-emerald-500/30 to-teal-500/20" },
  { name: "Animation", emoji: "🎨", gradient: "from-fuchsia-500/30 to-indigo-500/20" },
  { name: "Adventure", emoji: "🗺️", gradient: "from-lime-500/30 to-green-600/20" },
  { name: "Drama", emoji: "🎭", gradient: "from-amber-600/30 to-yellow-700/20" },
];

export interface GenreGridProps {
  onSelect?: (genre: string) => void;
  active?: string;
}

/**
 * Genre discovery grid with hover glow/scale and gradient backgrounds.
 */
const GenreGrid: React.FC<GenreGridProps> = ({ onSelect, active }) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
    {GENRES.map((g, i) => (
      <motion.button
        key={g.name}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.04 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onSelect?.(g.name)}
        className={`relative flex h-24 flex-col items-center justify-center gap-1 overflow-hidden rounded-cpm border bg-gradient-to-br ${g.gradient} transition-all hover:shadow-goldGlow ${
          active === g.name ? "border-gold" : "border-cpm-border hover:border-gold/40"
        }`}
      >
        <span className="text-2xl">{g.emoji}</span>
        <span className="font-heading text-sm font-bold text-white">{g.name}</span>
      </motion.button>
    ))}
  </div>
);

export default GenreGrid;
