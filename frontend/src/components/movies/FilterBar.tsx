import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, RotateCcw, Search } from "lucide-react";
import { cn } from "../../lib/cn";

export interface MovieFilters {
  search: string;
  genre: string;
  language: string;
  format: string;
  minRating: number;
  sort: string;
}

export const EMPTY_FILTERS: MovieFilters = {
  search: "",
  genre: "All",
  language: "All",
  format: "All",
  minRating: 0,
  sort: "popular",
};

const FORMATS = ["All", "2D", "3D", "IMAX", "4DX"];
const LANGUAGES = ["All", "English", "Telugu", "Hindi", "Tamil", "Kannada", "Malayalam", "Others"];
const SORTS = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

export interface FilterBarProps {
  filters: MovieFilters;
  genres: string[];
  onChange: (next: MovieFilters) => void;
  onReset: () => void;
  resultCount: number;
}

const Pill: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({
  active,
  onClick,
  children,
}) => (
  <button
    onClick={onClick}
    className={cn(
      "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-cpm transition-colors",
      active
        ? "border-gold bg-gold/15 text-gold shadow-goldGlow"
        : "border-cpm-border bg-white/5 text-cpm-muted hover:border-gold/40 hover:text-white"
    )}
  >
    {children}
  </button>
);

/**
 * Sticky glass filter bar. Collapsible advanced filters with a gold active
 * state. Filtering is applied live on change; Reset restores defaults.
 */
const FilterBar: React.FC<FilterBarProps> = ({ filters, genres, onChange, onReset, resultCount }) => {
  const [expanded, setExpanded] = React.useState(false);
  const set = (patch: Partial<MovieFilters>) => onChange({ ...filters, ...patch });

  return (
    <div className="sticky top-20 z-30 -mx-4 mb-8 px-4">
      <div className="cpm-glass p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cpm-muted" />
            <input
              value={filters.search}
              onChange={(e) => set({ search: e.target.value })}
              placeholder="Search movies, actors, theatres..."
              className="h-10 w-full rounded-cpm border border-cpm-border bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-cpm-muted/60 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
          </div>

          <button
            onClick={() => setExpanded((e) => !e)}
            className={cn(
              "flex h-10 items-center gap-2 rounded-cpm border px-4 text-sm font-semibold transition-colors",
              expanded ? "border-gold bg-gold/15 text-gold" : "border-cpm-border text-cpm-muted hover:text-white"
            )}
            aria-expanded={expanded}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>

          <select
            value={filters.sort}
            onChange={(e) => set({ sort: e.target.value })}
            className="h-10 rounded-cpm border border-cpm-border bg-white/5 px-3 text-sm text-white focus:border-gold/50 focus:outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value} className="bg-cpm-surface">
                {s.label}
              </option>
            ))}
          </select>

          <button
            onClick={onReset}
            className="flex h-10 items-center gap-2 rounded-cpm border border-cpm-border px-4 text-sm text-cpm-muted transition-colors hover:border-cinemaRed/50 hover:text-cinemaRed"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-4">
                <FilterRow label="Genre">
                  {genres.map((g) => (
                    <Pill key={g} active={filters.genre === g} onClick={() => set({ genre: g })}>
                      {g}
                    </Pill>
                  ))}
                </FilterRow>
                <FilterRow label="Language">
                  {LANGUAGES.map((l) => (
                    <Pill key={l} active={filters.language === l} onClick={() => set({ language: l })}>
                      {l}
                    </Pill>
                  ))}
                </FilterRow>
                <FilterRow label="Format">
                  {FORMATS.map((f) => (
                    <Pill key={f} active={filters.format === f} onClick={() => set({ format: f })}>
                      {f}
                    </Pill>
                  ))}
                </FilterRow>
                <FilterRow label="Min Rating">
                  {[0, 6, 7, 8, 9].map((r) => (
                    <Pill key={r} active={filters.minRating === r} onClick={() => set({ minRating: r })}>
                      {r === 0 ? "Any" : `${r}+`}
                    </Pill>
                  ))}
                </FilterRow>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-3 border-t border-white/5 pt-3 text-xs text-cpm-muted">
          {resultCount} {resultCount === 1 ? "movie" : "movies"} found
        </div>
      </div>
    </div>
  );
};

const FilterRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-start gap-3">
    <span className="mt-1.5 w-20 shrink-0 text-[11px] font-bold uppercase tracking-cpm text-cpm-muted">
      {label}
    </span>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

export default FilterBar;
