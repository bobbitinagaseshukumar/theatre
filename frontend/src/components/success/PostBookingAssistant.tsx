import React from "react";
import { Clock, Car, CloudSun, Navigation, Coins } from "lucide-react";
import { AICard } from "../ui";

export interface PostBookingAssistantProps {
  showTime?: string;
  pointsEarned?: number;
}

/**
 * AI post-booking companion: arrival reminder, crowd, parking, weather and
 * loyalty earned. Client-side heuristics until backend AI is wired.
 */
const PostBookingAssistant: React.FC<PostBookingAssistantProps> = ({
  showTime = "07:30 PM",
  pointsEarned = 120,
}) => (
  <section className="space-y-4 print:hidden">
    <div className="flex items-center gap-2">
      <span className="cpm-gold-text font-number text-xs font-extrabold uppercase tracking-cpm">
        AI Cinema Companion
      </span>
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <AICard title="Leave On Time" icon={<Clock className="h-4 w-4" />}>
        <p className="text-white">Leave home by 6:20 PM</p>
        <p className="mt-1 text-xs">Traffic is light; you'll reach comfortably before your {showTime} show.</p>
      </AICard>
      <AICard title="Parking" icon={<Car className="h-4 w-4" />}>
        <p className="text-white">Level P2 recommended</p>
        <p className="mt-1 text-xs">65% full — spaces near the lobby elevator are open.</p>
      </AICard>
      <AICard title="Weather" icon={<CloudSun className="h-4 w-4" />}>
        <p className="text-white">28°C, clear skies</p>
        <p className="mt-1 text-xs">No umbrella needed for tonight's show.</p>
      </AICard>
      <AICard title="Best Route" icon={<Navigation className="h-4 w-4" />}>
        <p className="text-white">Via MG Road — 18 min</p>
        <p className="mt-1 text-xs">Avoids the flyover bottleneck near the mall.</p>
      </AICard>
      <AICard title="Loyalty Earned" icon={<Coins className="h-4 w-4" />}>
        <p className="text-white">+{pointsEarned} reward points</p>
        <p className="mt-1 text-xs">Credited to your wallet after the show.</p>
      </AICard>
    </div>
  </section>
);

export default PostBookingAssistant;
