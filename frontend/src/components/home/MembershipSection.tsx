import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Crown, Check } from "lucide-react";
import { Button } from "../ui";

const PERKS = [
  "Priority booking & lounge access",
  "Up to 20% off tickets + free parking",
  "Bonus reward points on every order",
  "Exclusive member-only premieres",
];

/**
 * Membership call-to-action band with a gold-glow feature card.
 */
const MembershipSection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="mx-auto max-w-[1600px] px-10 py-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-cpm border border-gold/25 bg-gradient-to-br from-cpm-surface via-cpm-bg2 to-black p-8 sm:p-12"
      >
        {/* ambient glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-cpm text-gold">
              <Crown className="h-4 w-4" /> Gold Membership
            </span>
            <h2 className="mt-4 font-heading text-3xl font-extrabold text-white sm:text-4xl">
              Watch more. <span className="cpm-gold-text">Pay less.</span>
            </h2>
            <p className="mt-3 max-w-md text-sm text-cpm-muted">
              Join Cinema Pro Max Gold and turn every visit into a premium, rewarding experience.
            </p>
            <Button className="mt-6" size="lg" onClick={() => navigate("/membership")}>
              Explore Plans
            </Button>
          </div>

          <ul className="grid gap-3">
            {PERKS.map((p, i) => (
              <motion.li
                key={p}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 rounded-xl border border-cpm-border bg-white/5 px-4 py-3 text-sm text-white"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {p}
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
};

export default MembershipSection;
