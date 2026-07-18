import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star, Play } from "lucide-react";
import { cn } from "../../lib/cn";
import Badge from "./Badge";

export interface MovieCardProps {
  title: string;
  posterUrl: string;
  rating?: number;
  genres?: string[];
  badgeText?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * Movie poster card with 3D tilt on mouse movement (design-system rule),
 * gold glow on hover and a play affordance.
 */
const MovieCard: React.FC<MovieCardProps> = ({
  title,
  posterUrl,
  rating,
  genres = [],
  badgeText,
  onClick,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -12, y: px * 12 });
  };

  const reset = () => setTilt({ x: 0, y: 0 });

  return (
    <div className="cpm-perspective">
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={(e) => onClick && (e.key === "Enter" || e.key === " ") && onClick()}
        style={{ rotateX: tilt.x, rotateY: tilt.y, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "group relative aspect-[2/3] w-full cursor-pointer overflow-hidden rounded-cpm border border-cpm-border bg-cpm-surface",
          "hover:shadow-goldGlow",
          className
        )}
      >
        <img
          src={posterUrl}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {badgeText && (
          <div className="absolute left-3 top-3">
            <Badge tone="gold">{badgeText}</Badge>
          </div>
        )}

        {typeof rating === "number" && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-gold backdrop-blur">
            <Star className="h-3 w-3 fill-gold" />
            {rating.toFixed(1)}
          </div>
        )}

        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-black shadow-goldGlowStrong">
            <Play className="h-6 w-6 fill-black" />
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-heading text-sm font-bold text-white line-clamp-1">{title}</h3>
          {genres.length > 0 && (
            <p className="mt-0.5 text-[11px] text-cpm-muted line-clamp-1">{genres.join(" • ")}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MovieCard;
