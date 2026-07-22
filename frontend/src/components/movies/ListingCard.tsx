import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, Play, Heart, Ticket, Clock } from "lucide-react";
import { cn } from "../../lib/cn";
import { Badge } from "../ui";

export interface ListingMovie {
  id: string;
  title: string;
  posterUrl: string;
  rating?: number;
  genre?: string[];
  language?: string[];
  duration?: number;
  ageRestriction?: string;
  releaseDate?: string;
  status?: string;
  aiPick?: boolean;
  trending?: boolean;
}

export interface ListingCardProps {
  movie: ListingMovie;
  onTrailer?: (movie: ListingMovie) => void;
  wishlisted?: boolean;
  onToggleWishlist?: (id: string) => void;
}

/**
 * Rich listing card: 3D tilt, gold glow, poster zoom, wishlist spin,
 * and a "Book Now" bar that slides up on hover.
 */
const ListingCard: React.FC<ListingCardProps> = ({
  movie,
  onTrailer,
  wishlisted = false,
  onToggleWishlist,
}) => {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const isUpcoming = movie.status === "UPCOMING";

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: py * -10, y: px * 10 });
  };

  return (
    <div className="cpm-perspective">
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        style={{ rotateX: tilt.x, rotateY: tilt.y, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-cpm border border-cpm-border bg-cpm-surface hover:border-gold/40 hover:shadow-goldGlow"
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

          {/* Top badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {movie.aiPick && <Badge tone="gold" dot>AI Pick</Badge>}
            {movie.trending && <Badge tone="red">🔥 Trending</Badge>}
          </div>

          {/* Rating / release */}
          <div className="absolute right-3 top-3">
            {isUpcoming && movie.releaseDate ? (
              <span className="rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-accent backdrop-blur">
                {new Date(movie.releaseDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            ) : (
              typeof movie.rating === "number" && (
                <span className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-gold backdrop-blur">
                  <Star className="h-3 w-3 fill-gold" />
                  {movie.rating.toFixed(1)}
                </span>
              )
            )}
          </div>

          {/* Wishlist */}
          <button
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlisted}
            onClick={() => onToggleWishlist?.(movie.id)}
            className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-transform hover:scale-110 active:rotate-[360deg]"
            style={{ transition: "transform 0.5s" }}
          >
            <Heart className={cn("h-4 w-4", wishlisted ? "fill-cinemaRed text-cinemaRed" : "text-white")} />
          </button>

          {/* Slide-up action bar */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
            <div className="flex gap-2">
              <button
                onClick={() => navigate(isUpcoming ? `/movies/${movie.id}` : `/showtimes/${movie.id}`)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-gold to-gold-premium py-2 text-xs font-bold text-black shadow-goldGlow cursor-pointer"
              >
                <Ticket className="h-3.5 w-3.5" />
                {isUpcoming ? "Details" : "Book Now"}
              </button>
              <button
                onClick={() => onTrailer?.(movie)}
                aria-label="Watch trailer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-black/50 text-white hover:border-gold hover:text-gold"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <h3 className="font-heading text-sm font-bold text-white line-clamp-1 group-hover:text-gold">
              {movie.title}
            </h3>
            {movie.genre?.length ? (
              <p className="mt-0.5 text-[11px] uppercase tracking-cpm text-cpm-muted line-clamp-1">
                {movie.genre.join(" / ")}
              </p>
            ) : null}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-cpm-muted">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {movie.duration ?? "—"} min
            </span>
            {movie.ageRestriction && (
              <span className="rounded border border-white/15 px-1.5 py-0.5">{movie.ageRestriction}</span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ListingCard;
