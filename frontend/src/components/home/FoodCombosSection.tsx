import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Popcorn } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { Button, Badge } from "../ui";

export interface FoodCombo {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  originalPrice: number;
  comboPrice: number;
  badge?: string;
}

const FALLBACK: FoodCombo[] = [
  {
    id: "c1",
    name: "Couple Combo",
    description: "2 Large Popcorn + 2 Pepsi",
    imageUrl: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=600&auto=format&fit=crop",
    originalPrice: 780,
    comboPrice: 599,
    badge: "Bestseller",
  },
  {
    id: "c2",
    name: "Family Feast",
    description: "3 Popcorn + 4 Drinks + Nachos",
    imageUrl: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=600&auto=format&fit=crop",
    originalPrice: 1400,
    comboPrice: 999,
    badge: "Save 30%",
  },
  {
    id: "c3",
    name: "Solo Binge",
    description: "1 Large Popcorn + 1 Coke + Choco Bar",
    imageUrl: "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?q=80&w=600&auto=format&fit=crop",
    originalPrice: 520,
    comboPrice: 399,
  },
];

const FoodCombosSection: React.FC<{ combos?: FoodCombo[] }> = ({ combos = FALLBACK }) => {
  const navigate = useNavigate();
  return (
    <section className="mx-auto max-w-[1600px] px-10 py-16">
      <SectionHeader eyebrow="Snack Attack" title="Food Combos" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {combos.slice(0, 3).map((c, i) => {
          const savings = Math.max(0, Math.round(((c.originalPrice - c.comboPrice) / c.originalPrice) * 100));
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="cpm-glass group overflow-hidden p-0"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {c.imageUrl ? (
                  <img
                    src={c.imageUrl}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-cpm-surface text-gold">
                    <Popcorn className="h-10 w-10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                {(c.badge || savings > 0) && (
                  <div className="absolute left-3 top-3">
                    <Badge tone="gold">{c.badge ?? `Save ${savings}%`}</Badge>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-bold text-white">{c.name}</h3>
                {c.description && <p className="mt-1 text-xs text-cpm-muted">{c.description}</p>}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-number text-xl font-extrabold text-gold">₹{c.comboPrice}</span>
                    <span className="text-xs text-cpm-muted line-through">₹{c.originalPrice}</span>
                  </div>
                  <Button size="sm" onClick={() => navigate("/food")}>
                    Add
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FoodCombosSection;
