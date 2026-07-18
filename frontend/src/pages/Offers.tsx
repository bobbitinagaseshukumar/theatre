import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Clock, CreditCard, PartyPopper, Coins, Percent } from "lucide-react";
import { OfferCard, Badge } from "../components/ui";
import SectionHeader from "../components/home/SectionHeader";

const FEATURED = [
  { title: "Flat ₹250 OFF", subtitle: "On weekend blockbuster bookings above ₹800", code: "BIG250", gradient: "from-cinemaRed/30 to-gold/20" },
  { title: "Buy 1 Get 1 Ticket", subtitle: "Every Wednesday · all 2D shows", code: "BOGO", gradient: "from-secondary/30 to-gold/20" },
  { title: "Free Large Popcorn", subtitle: "For Gold members on any combo", code: "GOLDPOP", gradient: "from-gold/30 to-cinemaRed/20" },
];

const PERSONALIZED = [
  { title: "Weekend Action Special", description: "You watch a lot of action — 20% off this weekend.", code: "ACTION20", discountLabel: "20% OFF" },
  { title: "Loyal Customer Reward", description: "Flat ₹150 off, just for you.", code: "LOYAL150", discountLabel: "₹150 OFF" },
  { title: "Family Combo Discount", description: "Save on 4+ tickets + food.", code: "FAMILY", discountLabel: "25% OFF" },
];

const COUPONS = [
  { title: "Monsoon Magic", description: "20% off tickets + combos", code: "CINE20", discountLabel: "20% OFF" },
  { title: "Gourmet Welcome", description: "Flat ₹100 off food orders", code: "FREEFB", discountLabel: "₹100 OFF" },
  { title: "First Booking", description: "New users get 50% off (max ₹200)", code: "WELCOME50", discountLabel: "50% OFF" },
  { title: "Snack Feast", description: "Flat ₹50 off popcorn & drinks", code: "POPCORN50", discountLabel: "₹50 OFF" },
];

const PAYMENT_OFFERS = [
  { bank: "HDFC Credit Cards", offer: "10% instant discount up to ₹150", icon: <CreditCard className="h-5 w-5" /> },
  { bank: "Google Pay UPI", offer: "₹100 cashback on ₹500+", icon: <Percent className="h-5 w-5" /> },
  { bank: "Amazon Pay", offer: "5% cashback to wallet", icon: <Coins className="h-5 w-5" /> },
];

const FESTIVALS = [
  { name: "Diwali Dhamaka", tag: "Festival", ends: "in 3 days" },
  { name: "New Year Blast", tag: "Flash Sale", ends: "in 12 days" },
  { name: "Anniversary Fest", tag: "Limited", ends: "in 6 days" },
];

const Offers: React.FC = () => {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => setSlide((s) => (s + 1) % FEATURED.length), 5000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className="mx-auto max-w-[1450px] space-y-16 px-4 py-10 sm:px-6 lg:px-10">
      {/* Header */}
      <div>
        <h1 className="font-heading text-4xl font-extrabold tracking-tight">
          Offers & <span className="cpm-gold-text">Coupons</span>
        </h1>
        <p className="mt-1 text-sm text-cpm-muted">
          Smart, personalized deals — always the best price, automatically.
        </p>
      </div>

      {/* Featured banner (auto slider) */}
      <div className="relative h-56 overflow-hidden rounded-cpm border border-cpm-border">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${FEATURED[slide].gradient} text-center`}
          >
            <div className="pointer-events-none absolute inset-0 bg-black/40" />
            <div className="relative">
              <Badge tone="gold" dot>Limited time</Badge>
              <h2 className="mt-3 font-heading text-4xl font-extrabold text-white">{FEATURED[slide].title}</h2>
              <p className="mt-1 text-sm text-white/80">{FEATURED[slide].subtitle}</p>
              <span className="mt-4 inline-block rounded-lg border border-dashed border-gold/50 bg-black/40 px-4 py-1.5 text-sm font-bold tracking-cpm text-gold">
                {FEATURED[slide].code}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {FEATURED.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all ${i === slide ? "w-8 bg-gold" : "w-2 bg-white/30"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* AI auto-apply banner */}
      <div className="relative overflow-hidden rounded-cpm p-[1.5px]">
        <motion.div
          aria-hidden
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-gold via-gold-premium to-gold"
        />
        <div className="relative flex items-center gap-3 rounded-[15px] bg-cpm-surface/95 p-4 backdrop-blur">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/15 text-gold animate-cpmGlow">
            <Sparkles className="h-4 w-4" />
          </span>
          <p className="text-sm text-white">
            <span className="font-bold text-gold">Auto-Apply on:</span> we'll pick the best coupon at checkout —
            <span className="font-bold"> save up to ₹450</span> on your next booking. Offer valid for the next 6 hours.
          </p>
        </div>
      </div>

      {/* Personalized offers */}
      <section>
        <SectionHeader eyebrow="Just For You" title="Personalized Offers" />
        <div className="grid gap-6 md:grid-cols-3">
          {PERSONALIZED.map((o) => (
            <OfferCard key={o.code} {...o} />
          ))}
        </div>
      </section>

      {/* Coupon center */}
      <section>
        <SectionHeader eyebrow="Coupon Center" title="Available Coupons" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {COUPONS.map((o) => (
            <OfferCard key={o.code} {...o} />
          ))}
        </div>
      </section>

      {/* Payment offers */}
      <section>
        <SectionHeader eyebrow="Pay & Save" title="Payment Offers" />
        <div className="grid gap-4 md:grid-cols-3">
          {PAYMENT_OFFERS.map((p) => (
            <motion.div
              key={p.bank}
              whileHover={{ y: -4 }}
              className="flex items-center gap-4 rounded-cpm border border-cpm-border bg-white/5 p-5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold">
                {p.icon}
              </span>
              <div>
                <p className="text-sm font-bold text-white">{p.bank}</p>
                <p className="text-xs text-cpm-muted">{p.offer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Festival campaigns */}
      <section>
        <SectionHeader eyebrow="Seasonal" title="Festival Campaigns" />
        <div className="grid gap-6 md:grid-cols-3">
          {FESTIVALS.map((f) => (
            <motion.div
              key={f.name}
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-cpm border border-cpm-border bg-gradient-to-br from-cpm-surface to-cpm-bg2 p-6"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gold/10 blur-2xl" />
              <PartyPopper className="h-7 w-7 text-gold" />
              <h3 className="mt-3 font-heading text-lg font-bold text-white">{f.name}</h3>
              <div className="mt-2 flex items-center gap-2">
                <Badge tone="red">{f.tag}</Badge>
                <span className="flex items-center gap-1 text-[11px] text-cpm-muted">
                  <Clock className="h-3 w-3" /> Ends {f.ends}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cashback center */}
      <section>
        <SectionHeader eyebrow="Wallet" title="Cashback Center" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Pending Cashback", value: "₹80", tone: "warning" as const },
            { label: "Available Cashback", value: "₹120", tone: "success" as const },
            { label: "Lifetime Cashback", value: "₹1,240", tone: "gold" as const },
          ].map((c) => (
            <div key={c.label} className="cpm-glass flex items-center justify-between p-5">
              <div>
                <p className="text-[11px] uppercase tracking-cpm text-cpm-muted">{c.label}</p>
                <p className="font-number text-2xl font-extrabold text-white">{c.value}</p>
              </div>
              <Badge tone={c.tone}>Cashback</Badge>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Offers;
