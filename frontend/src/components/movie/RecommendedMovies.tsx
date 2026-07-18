import React, { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import ListingCard, { type ListingMovie } from "../movies/ListingCard";
import SectionHeader from "../home/SectionHeader";

export interface RecommendedMoviesProps {
  currentId: string;
  currentGenres?: string[];
  onTrailer?: (m: ListingMovie) => void;
}

const FALLBACK: ListingMovie[] = [
  {
    id: "rec-1",
    title: "Neon Horizon",
    genre: ["Sci-Fi", "Action"],
    rating: 8.6,
    duration: 133,
    posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "rec-2",
    title: "The Last Overture",
    genre: ["Drama"],
    rating: 8.1,
    duration: 118,
    posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "rec-3",
    title: "Crimson Protocol",
    genre: ["Thriller", "Action"],
    rating: 7.9,
    duration: 126,
    posterUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "rec-4",
    title: "Whispers in Frame",
    genre: ["Horror"],
    rating: 7.4,
    duration: 101,
    posterUrl: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "rec-5",
    title: "Golden Hour",
    genre: ["Romance", "Drama"],
    rating: 8.3,
    duration: 112,
    posterUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=600&auto=format&fit=crop",
  },
];

/**
 * "Because You Liked This" — genre-aware recommendations. Self-contained:
 * fetches /movies and falls back to curated mocks.
 */
const RecommendedMovies: React.FC<RecommendedMoviesProps> = ({ currentId, currentGenres = [], onTrailer }) => {
  const [movies, setMovies] = useState<ListingMovie[]>(FALLBACK);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await API.get("/movies");
        if (active && res.data?.length) setMovies(res.data);
      } catch {
        /* keep fallback */
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const recommendations = useMemo(() => {
    const others = movies.filter((m) => m.id !== currentId);
    const sameGenre = others.filter((m) => (m.genre ?? []).some((g) => currentGenres.includes(g)));
    const pool = sameGenre.length >= 3 ? sameGenre : others;
    return pool.slice(0, 5);
  }, [movies, currentId, currentGenres]);

  if (!recommendations.length) return null;

  return (
    <section className="mt-[120px]">
      <SectionHeader eyebrow="Because You Liked This" title="Recommended Movies" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {recommendations.map((m) => (
          <ListingCard key={m.id} movie={m} onTrailer={onTrailer} />
        ))}
      </div>
    </section>
  );
};

export default RecommendedMovies;
