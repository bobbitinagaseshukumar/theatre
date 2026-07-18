import React from "react";
import { Gauge, Clock, Users, Armchair, Popcorn, Smile } from "lucide-react";
import { AICard } from "../ui";

export interface AIFeaturesPanelProps {
  rating?: number;
  genres?: string[];
}

/**
 * AI insight panel for the movie details page. Values are illustrative
 * (client-side heuristics) until the recommendation API is wired in.
 */
const AIFeaturesPanel: React.FC<AIFeaturesPanelProps> = ({ rating = 8, genres = [] }) => {
  const score = Math.min(0.99, rating / 10 + 0.05);
  const familyFriendly = genres.some((g) => ["Family", "Animation", "Comedy"].includes(g));
  const crowd = rating >= 9 ? "High" : rating >= 7.5 ? "Moderate" : "Low";

  return (
    <section className="mt-[120px]">
      <div className="mb-8">
        <span className="cpm-gold-text font-number text-xs font-extrabold uppercase tracking-cpm">
          Powered by AI
        </span>
        <h2 className="mt-1 font-heading text-3xl font-extrabold uppercase tracking-wide text-white">
          Smart Insights
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AICard title="Your Match Score" confidence={score} icon={<Gauge className="h-4 w-4" />}>
          Based on your genres and watch history, this looks like a strong pick for you.
        </AICard>

        <AICard title="Best Time to Watch" icon={<Clock className="h-4 w-4" />}>
          <p className="text-white">Weekday matinee (12–3 PM)</p>
          <p className="mt-1 text-xs">Lower crowds, better seat availability and lower prices.</p>
        </AICard>

        <AICard title="Expected Crowd Level" icon={<Users className="h-4 w-4" />}>
          <p className="text-white">{crowd}</p>
          <p className="mt-1 text-xs">Opening-weekend demand is trending {crowd.toLowerCase()}.</p>
        </AICard>

        <AICard title="Suggested Seat" icon={<Armchair className="h-4 w-4" />}>
          <p className="text-white">Row H, seats 10–11 (Premium)</p>
          <p className="mt-1 text-xs">Optimal screen distance and center-aligned viewing angle.</p>
        </AICard>

        <AICard title="Food Recommendation" icon={<Popcorn className="h-4 w-4" />}>
          <p className="text-white">Couple Combo + Nachos</p>
          <p className="mt-1 text-xs">Popular pairing for {genres[0] ?? "this"} movies at your usual show time.</p>
        </AICard>

        <AICard title="Family Friendly" icon={<Smile className="h-4 w-4" />}>
          <p className="text-white">{familyFriendly ? "Great for families" : "Best for teens & adults"}</p>
          <p className="mt-1 text-xs">Based on certification and genre analysis.</p>
        </AICard>
      </div>
    </section>
  );
};

export default AIFeaturesPanel;
