import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SectionHeader from "./SectionHeader";
import { MovieCard } from "../ui";

export interface TrendingMovie {
  id: string;
  title: string;
  posterUrl: string;
  rating?: number;
  genre?: string[];
}

export interface TrendingSectionProps {
  movies: TrendingMovie[];
}

/**
 * Trending movies grid. Cards appear sequentially with a soft rise (scroll
 * animation rule) and use the design-system MovieCard (3D tilt + gold glow).
 */
const TrendingSection: React.FC<TrendingSectionProps> = ({ movies }) => {
  const navigate = useNavigate();
  if (!movies.length) return null;

  return (
    <section className="mx-auto max-w-[1600px] px-10 py-16">
      <SectionHeader eyebrow="Hot Right Now" title="Trending Movies" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {movies.slice(0, 5).map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.08, type: "spring", stiffness: 120 }}
          >
            <MovieCard
              title={m.title}
              posterUrl={m.posterUrl}
              rating={m.rating}
              genres={m.genre}
              badgeText={i === 0 ? "#1 Trending" : undefined}
              onClick={() => navigate(`/movies/${m.id}`)}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;
