import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Search,
  Navigation,
  Star,
  Phone,
  Sparkles,
  Car,
  Utensils,
  Accessibility,
  Wifi,
  Check,
  ChevronRight,
} from "lucide-react";
import { Button, Badge } from "../components/ui";
import SectionHeader from "../components/home/SectionHeader";

interface Theatre {
  id: string;
  name: string;
  area: string;
  distanceKm: number;
  travelMins: number;
  rating: number;
  reviews: number;
  priceFrom: number;
  crowd: "Available" | "Busy" | "Almost Full";
  amenities: string[];
  formats: string[];
  aiScore?: number;
}

const THEATRES: Theatre[] = [
  {
    id: "t-1",
    name: "Cinema Pro Max IMAX",
    area: "Central Mall, MG Road",
    distanceKm: 3.2,
    travelMins: 12,
    rating: 4.8,
    reviews: 2140,
    priceFrom: 220,
    crowd: "Available",
    amenities: ["IMAX", "Dolby Atmos", "Recliners", "Parking", "Food Court", "Wheelchair", "Wi-Fi"],
    formats: ["2D", "3D", "IMAX", "4DX"],
    aiScore: 98,
  },
  {
    id: "t-2",
    name: "Cinema Pro Max Luxe",
    area: "Riverside Avenue",
    distanceKm: 5.6,
    travelMins: 19,
    rating: 4.6,
    reviews: 1385,
    priceFrom: 180,
    crowd: "Busy",
    amenities: ["Dolby Atmos", "Recliners", "Parking", "Food Court"],
    formats: ["2D", "3D", "Dolby Atmos"],
    aiScore: 91,
  },
  {
    id: "t-3",
    name: "Cinema Pro Max Metro",
    area: "Tech Park Boulevard",
    distanceKm: 8.1,
    travelMins: 26,
    rating: 4.4,
    reviews: 902,
    priceFrom: 150,
    crowd: "Almost Full",
    amenities: ["Recliners", "Parking", "Wheelchair", "Wi-Fi"],
    formats: ["2D", "3D"],
    aiScore: 84,
  },
];

const COMPARE_FEATURES = ["IMAX", "Dolby Atmos", "4DX", "Recliners", "Parking", "Food Court", "Wheelchair", "Wi-Fi"];

const AMENITY_ICON: Record<string, React.ReactNode> = {
  Parking: <Car className="h-3.5 w-3.5" />,
  "Food Court": <Utensils className="h-3.5 w-3.5" />,
  Wheelchair: <Accessibility className="h-3.5 w-3.5" />,
  "Wi-Fi": <Wifi className="h-3.5 w-3.5" />,
};

const crowdTone: Record<Theatre["crowd"], "success" | "warning" | "error"> = {
  Available: "success",
  Busy: "warning",
  "Almost Full": "error",
};

const TheatreSelection: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string>(THEATRES[0].id);

  const filtered = useMemo(
    () =>
      THEATRES.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.area.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  const aiPick = [...THEATRES].sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0))[0];
  const selectedTheatre = THEATRES.find((t) => t.id === selected) ?? THEATRES[0];

  return (
    <div className="relative min-h-screen bg-[#050505] pb-32 text-white">
      <div className="mx-auto max-w-[1450px] px-6 py-10 lg:px-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight">
            Choose Your <span className="cpm-gold-text">Theatre</span>
          </h1>
          <p className="mt-1 text-sm text-cpm-muted">
            Smart theatre discovery with live availability and AI recommendations.
          </p>
        </div>

        {/* Location + search */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3 rounded-cpm border border-cpm-border bg-white/5 px-4 py-3">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-gold">
              <MapPin className="h-4 w-4" />
              <span className="absolute inset-0 animate-ping rounded-full bg-gold/20" />
            </span>
            <div>
              <p className="text-xs text-cpm-muted">Your location</p>
              <p className="text-sm font-semibold text-white">Guntur, Andhra Pradesh</p>
            </div>
          </div>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cpm-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search theatre, area, mall or pincode..."
              className="h-12 w-full rounded-cpm border border-cpm-border bg-white/5 pl-11 pr-4 text-sm text-white placeholder:text-cpm-muted/60 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
          </div>
        </div>

        {/* Map placeholder + AI recommended */}
        <div className="mb-12 grid gap-6 lg:grid-cols-3">
          <div className="relative overflow-hidden rounded-cpm border border-cpm-border bg-cpm-surface lg:col-span-2 min-h-[240px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,215,0,0.08),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(255,59,48,0.06),transparent_50%)]" />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.08) 1px,transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            {THEATRES.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.15, type: "spring" }}
                className="absolute"
                style={{ left: `${20 + i * 28}%`, top: `${30 + (i % 2) * 30}%` }}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-black shadow-goldGlow">
                  <MapPin className="h-4 w-4" />
                </span>
              </motion.div>
            ))}
            <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-1.5 text-[11px] text-cpm-muted backdrop-blur">
              Interactive map • {THEATRES.length} theatres nearby
            </div>
          </div>

          {/* AI recommended */}
          <div className="relative overflow-hidden rounded-cpm p-[1.5px]">
            <motion.div
              aria-hidden
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-br from-gold via-gold-premium to-gold"
            />
            <div className="relative flex h-full flex-col rounded-[15px] bg-cpm-surface/95 p-5 backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15 text-gold animate-cpmGlow">
                  <Sparkles className="h-4 w-4" />
                </span>
                <h3 className="font-heading text-sm font-bold text-white">Best Choice For You</h3>
                <span className="ml-auto rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-bold text-gold">
                  {aiPick.aiScore}%
                </span>
              </div>
              <p className="mt-3 font-heading text-lg font-bold text-white">{aiPick.name}</p>
              <p className="text-xs text-cpm-muted">{aiPick.area}</p>
              <ul className="mt-3 space-y-1.5 text-[11px] text-cpm-muted">
                <li className="flex items-center gap-1.5"><Check className="h-3 w-3 text-success" /> {aiPick.travelMins} min away · low traffic</li>
                <li className="flex items-center gap-1.5"><Check className="h-3 w-3 text-success" /> Best seat availability</li>
                <li className="flex items-center gap-1.5"><Check className="h-3 w-3 text-success" /> Highest customer satisfaction</li>
              </ul>
              <Button className="mt-4" size="sm" fullWidth onClick={() => setSelected(aiPick.id)}>
                Select This Theatre
              </Button>
            </div>
          </div>
        </div>

        {/* Theatre list */}
        <section className="mb-12">
          <SectionHeader eyebrow="Nearby" title="All Available Theatres" />
          <div className="space-y-4">
            {filtered.map((t) => {
              const isSel = t.id === selected;
              return (
                <motion.div
                  key={t.id}
                  whileHover={{ y: -3 }}
                  onClick={() => setSelected(t.id)}
                  className={`cursor-pointer rounded-cpm border p-5 transition-all ${
                    isSel ? "border-gold bg-gold/5 shadow-goldGlow" : "border-cpm-border bg-white/5 hover:border-gold/40"
                  }`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-heading text-lg font-bold text-white">{t.name}</h3>
                        <Badge tone={crowdTone[t.crowd]} dot>{t.crowd}</Badge>
                        {isSel && <Badge tone="gold">Selected</Badge>}
                      </div>
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-cpm-muted">
                        <MapPin className="h-3.5 w-3.5" /> {t.area} · {t.distanceKm} km · {t.travelMins} min
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {t.amenities.map((a) => (
                          <span
                            key={a}
                            className="flex items-center gap-1 rounded-md border border-cpm-border bg-black/30 px-2 py-1 text-[10px] text-cpm-muted"
                          >
                            {AMENITY_ICON[a]} {a}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 md:flex-col md:items-end">
                      <div className="flex items-center gap-1 text-sm font-bold text-gold">
                        <Star className="h-4 w-4 fill-gold" /> {t.rating}
                        <span className="text-[11px] font-normal text-cpm-muted">({t.reviews})</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-cpm text-cpm-muted">From</p>
                        <p className="font-number text-lg font-extrabold text-white">₹{t.priceFrom}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-cpm-border text-cpm-muted hover:border-gold hover:text-gold"
                          aria-label="Directions"
                        >
                          <Navigation className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-cpm-border text-cpm-muted hover:border-gold hover:text-gold"
                          aria-label="Call theatre"
                        >
                          <Phone className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Facility comparison */}
        <section className="mb-12">
          <SectionHeader eyebrow="Compare" title="Facilities Comparison" />
          <div className="overflow-x-auto rounded-cpm border border-cpm-border">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-cpm-border bg-white/5">
                  <th className="p-4 text-left font-heading text-xs uppercase tracking-cpm text-cpm-muted">Theatre</th>
                  {COMPARE_FEATURES.map((f) => (
                    <th key={f} className="p-3 text-center text-[11px] font-semibold text-cpm-muted">{f}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {THEATRES.map((t) => (
                  <tr key={t.id} className="border-b border-white/5 last:border-0">
                    <td className="p-4 font-semibold text-white">{t.name}</td>
                    {COMPARE_FEATURES.map((f) => (
                      <td key={f} className="p-3 text-center">
                        {t.amenities.includes(f) ? (
                          <Check className="mx-auto h-4 w-4 text-gold" />
                        ) : (
                          <span className="text-cpm-muted/40">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Sticky continue bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#050505]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1450px] items-center justify-between gap-4 px-6 py-4 lg:px-10">
          <div>
            <p className="text-xs text-cpm-muted">Selected theatre</p>
            <p className="font-heading font-bold text-white">{selectedTheatre.name}</p>
          </div>
          <Button size="lg" rightIcon={<ChevronRight className="h-4 w-4" />} onClick={() => navigate("/movies")}>
            Continue to Showtimes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TheatreSelection;
