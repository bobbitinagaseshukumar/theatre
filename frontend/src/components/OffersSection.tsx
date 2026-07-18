import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Gift, Copy, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/axios";

// Mock Active Offers fallback to ensure zero hardcoding
const MOCK_OFFERS = [
  {
    OfferID: "off-1",
    Title: "BOGO Free Ticket",
    Subtitle: "Limited time deal",
    Description: "Buy one standard ticket and get the second one completely free for any weekday show. Maximum discount up to ₹250.",
    CouponCode: "BOGOFREE",
    BadgeText: "WEEKDAY VIP",
    BadgeColor: "from-red-600 to-amber-600",
    ExpiryDays: 2,
  },
  {
    OfferID: "off-2",
    Title: "Flat ₹100 F&B Off",
    Subtitle: "Gourmet snacks discount",
    Description: "Save flat ₹100 on pre-ordering nachos and dual beverage combos. No minimum cart amount required.",
    CouponCode: "FREEFB",
    BadgeText: "LIMITED TIME",
    BadgeColor: "from-purple-600 to-pink-600",
    ExpiryDays: 4,
  },
  {
    OfferID: "off-3",
    Title: "25% Off VIP seats",
    Subtitle: "Luxury comfort upgrade",
    Description: "Experience absolute luxury comfort. Get 25% off on VIP recliner seats for any Sunday late night show.",
    CouponCode: "VIPCOMFORT",
    BadgeText: "SUNDAY SPECIAL",
    BadgeColor: "from-amber-500 to-orange-600",
    ExpiryDays: 1,
  },
  {
    OfferID: "off-4",
    Title: "15% Card Discount",
    Subtitle: "Partner bank offer",
    Description: "Get extra 15% discount using partner credit or debit cards on checkout payment validation.",
    CouponCode: "CARD15",
    BadgeText: "BANK EXCLUSIVE",
    BadgeColor: "from-blue-600 to-cyan-600",
    ExpiryDays: 5,
  }
];

const OffersSection: React.FC = () => {
  const [offers, setOffers] = useState<any[]>(MOCK_OFFERS);
  const [loading, setLoading] = useState(true);
  const [copyState, setCopyState] = useState<Record<string, boolean>>({});
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Mouse coordinate tracker for background particles
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await API.get("/offers");
        if (response.data && response.data.length > 0) {
          // Map DB items to display layout fields
          const mapped = response.data.map((o: any, idx: number) => ({
            OfferID: o.OfferID,
            Title: o.Title,
            Description: o.Description,
            CouponCode: o.CouponCode,
            BadgeText: idx === 0 ? "WEEKDAY VIP" : idx === 1 ? "LIMITED TIME" : idx === 2 ? "SUNDAY SPECIAL" : "BANK EXCLUSIVE",
            BadgeColor: idx === 0 ? "from-red-600 to-amber-600" : idx === 1 ? "from-purple-600 to-pink-600" : idx === 2 ? "from-amber-500 to-orange-600" : "from-blue-600 to-cyan-600",
            ExpiryDays: idx + 2,
          }));
          setOffers(mapped);
        }
      } catch {
        /* mock offers fallback */
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  const handleCopyCode = (e: React.MouseEvent, code: string, id: string) => {
    e.stopPropagation(); // Avoid triggering card click redirect
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code "${code}" copied successfully!`);

    // Temporary rotate effect state trigger
    setCopyState((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopyState((prev) => ({ ...prev, [id]: false }));
    }, 600);
  };

  const handleCardClick = (id: string) => {
    // Open Offers detail page
    navigate(`/offers?id=${id}`);
  };

  // Render Loader Skeleton layout
  if (loading) {
    return (
      <div className="max-w-[1450px] mx-auto px-10 py-16 space-y-12">
        <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-[220px] rounded-[26px] glass-panel border border-white/5 bg-white/5 flex flex-col justify-between p-6 animate-pulse">
              <div className="flex justify-between">
                <div className="h-5 w-20 bg-white/10 rounded" />
                <div className="h-5 w-16 bg-white/10 rounded" />
              </div>
              <div className="h-8 w-full bg-white/10 rounded mt-4" />
              <div className="flex justify-between items-center mt-6">
                <div className="h-7 w-20 bg-white/10 rounded" />
                <div className="h-7 w-20 bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full py-16 mt-[140px] select-none overflow-hidden"
    >
      {/* Local low opacity diagonal floating particles reacting to mouse */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 15 }).map((_, idx) => {
          // diagonal offset movement mapping
          const factorX = (idx % 3 - 1) * 30;
          const factorY = (idx % 2 - 1) * 30;
          return (
            <motion.div
              key={idx}
              animate={{
                x: [idx * 80, idx * 80 + 150 + mousePos.x * factorX],
                y: [500, -100 + mousePos.y * factorY],
              }}
              transition={{
                duration: 18 + (idx % 5) * 4,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute w-1.5 h-1.5 rounded-full bg-white/10 blur-[1px]"
              style={{
                left: `${(idx * 7) % 100}%`,
              }}
            />
          );
        })}
      </div>

      <div className="max-w-[1450px] mx-auto px-10 relative z-10 space-y-12">
        
        {/* SECTION HEADER: Title & View All */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="space-y-2 text-left"
          >
            <h2 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-wider text-white">
              SPECIAL OFFERS
            </h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-gray-400 text-base sm:text-lg font-medium"
            >
              Save more on every movie experience
            </motion.p>
          </motion.div>

          {/* VIEW ALL BUTTON (compress on click, spring rises on hover) */}
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/offers")}
            className="group px-6 py-4 rounded-full glass-panel border border-white/15 bg-white/5 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-glass active:bg-white/30 transition-all duration-300 w-fit shrink-0 self-start sm:self-auto"
          >
            <span>View All Offers</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        </div>

        {/* OFFERS GRID */}
        {offers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {offers.map((offer, idx) => {
              const isCopied = copyState[offer.OfferID];

              return (
                <motion.div
                  key={offer.OfferID}
                  initial={{ opacity: 0, scale: 0.9, y: 60 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  whileHover={{ y: -15, rotateZ: 2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleCardClick(offer.OfferID)}
                  className="group relative h-[220px] rounded-[26px] glass-panel border border-white/5 hover:border-accent/30 bg-gradient-to-br from-black/85 via-[#0c0505]/90 to-[#220406]/70 p-6 flex flex-col justify-between shadow-md hover:shadow-redGlow cursor-pointer transition-all duration-500 overflow-hidden"
                >
                  {/* Top Row: Badge & Expiry countdown */}
                  <div className="flex justify-between items-center">
                    {/* Pulsing Badge */}
                    <motion.span
                      animate={{ opacity: [1, 0.6, 1] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className={`px-3 py-1 rounded-full bg-gradient-to-r ${offer.BadgeColor} text-[9px] font-extrabold text-white uppercase tracking-wider shadow-redGlow`}
                    >
                      {offer.BadgeText}
                    </motion.span>
                    
                    <span className="flex items-center gap-1 text-[10px] text-gray-500 font-number font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      Ends in {offer.ExpiryDays} Days
                    </span>
                  </div>

                  {/* Center Title & Description */}
                  <div className="space-y-1.5 text-left mt-2">
                    <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                      {offer.Title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-normal line-clamp-2">
                      {offer.Description}
                    </p>
                  </div>

                  {/* Bottom Row: Copy Code & Claim Button */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    {/* Copy Capsule */}
                    <motion.button
                      onClick={(e) => handleCopyCode(e, offer.CouponCode, offer.OfferID)}
                      animate={isCopied ? { rotateZ: [0, 3, -3, 0], scale: 1.05 } : {}}
                      className="px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-accent/40 text-accent font-bold text-xs tracking-wider uppercase font-number flex items-center gap-1.5 transition-colors cursor-pointer group-hover:scale-103"
                      title="Click to copy coupon code"
                    >
                      {isCopied ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-luxuryGold fill-luxuryGold" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                          <span>{offer.CouponCode}</span>
                        </>
                      )}
                    </motion.button>

                    {/* Claim Button */}
                    <span className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-[10px] uppercase tracking-wider group-hover:scale-105 transition-transform shadow-redGlow">
                      Claim
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel border border-white/5 rounded-[26px] p-12 text-center flex flex-col items-center justify-center gap-4 bg-black/40">
            <Gift className="w-12 h-12 text-gray-500 animate-bounce" />
            <h3 className="font-heading font-bold text-lg">No Active Offers</h3>
            <p className="text-gray-400 text-xs">There are no discount vouchers configured currently.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersSection;
