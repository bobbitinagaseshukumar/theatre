import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import API from "../api/axios";
import FilterBar, { EMPTY_FILTERS, type MovieFilters } from "../components/movies/FilterBar";
import ListingCard, { type ListingMovie } from "../components/movies/ListingCard";
import ListingSkeleton from "../components/movies/ListingSkeleton";
import EmptyState from "../components/movies/EmptyState";
import GenreGrid from "../components/movies/GenreGrid";
import SectionHeader from "../components/home/SectionHeader";
import { Button } from "../components/ui";

const MOCK_MOVIES: ListingMovie[] = [
  {
    id: "m-1",
    title: "Aether: Rising Stars",
    genre: ["Sci-Fi", "Action", "Adventure"],
    duration: 142,
    rating: 9.2,
    ageRestriction: "UA",
    language: ["English", "Hindi"],
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
    status: "NOW_SHOWING",
    releaseDate: "2026-07-01",
  },
  {
    id: "m-2",
    title: "Shadows of the Dynasty",
    genre: ["Action", "Thriller"],
    duration: 128,
    rating: 8.8,
    ageRestriction: "A",
    language: ["English"],
    posterUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=600&auto=format&fit=crop",
    status: "NOW_SHOWING",
    releaseDate: "2026-07-10",
  },
  {
    id: "m-3",
    title: "Chronicles of Whispering Woods",
    genre: ["Fantasy", "Drama"],
    duration: 156,
    rating: 9.5,
    ageRestriction: "U",
    language: ["English"],
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
    status: "UPCOMING",
    releaseDate: "2026-08-05",
  },
];

const PAGE_SIZE = 10;

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<ListingMovie[]>(() => {
    try {
      const cached = window.localStorage.getItem("cpm_movies_cache");
      return cached ? JSON.parse(cached) : MOCK_MOVIES;
    } catch {
      return MOCK_MOVIES;
    }
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<MovieFilters>(EMPTY_FILTERS);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const hasInitialMovies = movies.length > 0;
    const fetchMoviesList = async () => {
      try {
        const res = await API.get("/movies");
        if (active && res.data?.length) {
          setMovies(res.data);
          window.localStorage.setItem("cpm_movies_cache", JSON.stringify(res.data));
        } else if (active && !hasInitialMovies) setMovies(MOCK_MOVIES);
      } catch {
        if (active && !hasInitialMovies) setMovies(MOCK_MOVIES);
      }
    };
    
    if (!hasInitialMovies) setLoading(true);
    fetchMoviesList().finally(() => {
      if (active) setLoading(false);
    });

    const pollInterval = setInterval(fetchMoviesList, 5000);

    return () => {
      active = false;
      clearInterval(pollInterval);
    };
  }, []);

  const genres = useMemo(
    () => ["All", ...Array.from(new Set(movies.flatMap((m) => m.genre ?? [])))],
    [movies]
  );

  // AI + Trending derived strips
  const aiRecommended = useMemo(
    () =>
      [...movies]
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, 5)
        .map((m) => ({ ...m, aiPick: true })),
    [movies]
  );

  const filtered = useMemo(() => {
    const list = movies.filter((m) => {
      const s = filters.search.toLowerCase();
      const matchSearch =
        !s ||
        m.title.toLowerCase().includes(s) ||
        (m.genre ?? []).some((g) => g.toLowerCase().includes(s));
      const matchGenre = filters.genre === "All" || (m.genre ?? []).includes(filters.genre);
      const matchLang =
        filters.language === "All" || (m.language ?? []).includes(filters.language);
      const matchRating = (m.rating ?? 0) >= filters.minRating;
      // Format: only exclude when the movie explicitly lists formats
      const formats = (m as unknown as { formats?: string[] }).formats;
      const matchFormat =
        filters.format === "All" || !formats || formats.includes(filters.format);
      return matchSearch && matchGenre && matchLang && matchRating && matchFormat;
    });

    switch (filters.sort) {
      case "rating":
        return [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case "newest":
        return [...list].sort(
          (a, b) =>
            new Date(b.releaseDate ?? 0).getTime() - new Date(a.releaseDate ?? 0).getTime()
        );
      default:
        return list;
    }
  }, [movies, filters]);

  const toggleWishlist = (id: string) =>
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const resetFilters = () => {
    setFilters(EMPTY_FILTERS);
    setVisible(PAGE_SIZE);
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-white">
          Browse <span className="cpm-gold-text">Movies</span>
        </h1>
        <p className="mt-1 text-sm text-cpm-muted">
          Discover trending blockbusters, upcoming releases and AI-picked recommendations.
        </p>
      </div>

      {/* Sticky filter bar */}
      <FilterBar
        filters={filters}
        genres={genres}
        onChange={(f) => {
          setFilters(f);
          setVisible(PAGE_SIZE);
        }}
        onReset={resetFilters}
        resultCount={filtered.length}
      />

      {loading ? (
        <ListingSkeleton />
      ) : (
        <>
          {/* AI Recommended strip */}
          {aiRecommended.length > 0 && (
            <section className="mb-14">
              <SectionHeader eyebrow="Powered by AI" title="Recommended For You" />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-5">
                {aiRecommended.map((m) => (
                  <ListingCard
                    key={`ai-${m.id}`}
                    movie={m}
                    onTrailer={(mv) =>
                      setTrailerUrl(
                        (mv as unknown as { trailerUrl?: string }).trailerUrl ??
                          "https://www.youtube.com/embed/dQw4w9WgXcQ"
                      )
                    }
                    wishlisted={wishlist.has(m.id)}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Main results */}
          <section className="mb-14">
            <SectionHeader eyebrow="All Titles" title="Now Showing & Upcoming" />
            {filtered.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5">
                  {filtered.slice(0, visible).map((m) => (
                    <ListingCard
                      key={m.id}
                      movie={m}
                      onTrailer={(mv) =>
                        setTrailerUrl(
                          (mv as unknown as { trailerUrl?: string }).trailerUrl ??
                            "https://www.youtube.com/embed/dQw4w9WgXcQ"
                        )
                      }
                      wishlisted={wishlist.has(m.id)}
                      onToggleWishlist={toggleWishlist}
                    />
                  ))}
                </div>
                {visible < filtered.length && (
                  <div className="mt-10 flex justify-center">
                    <Button variant="secondary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                      Load More
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState onReset={resetFilters} />
            )}
          </section>

          {/* Genre discovery */}
          <section className="mb-8">
            <SectionHeader eyebrow="Explore" title="Browse by Genre" />
            <GenreGrid
              active={filters.genre === "All" ? undefined : filters.genre}
              onSelect={(g) => {
                setFilters((f) => ({ ...f, genre: g }));
                setVisible(PAGE_SIZE);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </section>
        </>
      )}

      {/* Trailer modal */}
      <AnimatePresence>
        {trailerUrl && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTrailerUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-cpm border border-white/10 bg-black shadow-glass"
            >
              <button
                onClick={() => setTrailerUrl(null)}
                aria-label="Close trailer"
                className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white hover:text-gold"
              >
                <X className="h-5 w-5" />
              </button>
              <iframe
                src={trailerUrl}
                title="Movie Trailer"
                className="h-full w-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Movies;
