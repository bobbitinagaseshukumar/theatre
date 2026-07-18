import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  Award, 
  Wallet, 
  Share2, 
  Copy, 
  Check, 
  TrendingUp, 
  Zap,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";
import toast from "react-hot-toast";
import type { RootState } from "../redux/store";
import API from "../api/axios";
import PlansAndComparison from "../components/membership/PlansAndComparison";

const Membership: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  // states
  const [profile, setProfile] = useState<any>(null);
  const [tiers, setTiers] = useState<any[]>([]);
  const [walletHistory, setWalletHistory] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Interaction states
  const [cardFlipped, setCardFlipped] = useState(false);
  const [tiltRotation, setTiltRotation] = useState({ x: 0, y: 0 });
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Points increment animation state
  const [animatedPoints, setAnimatedPoints] = useState(0);

  // Safety navigation check
  useEffect(() => {
    if (!user) {
      toast.error("Please login to access membership rewards.");
      navigate("/login");
    }
  }, [user, navigate]);

  // Load all loyalty membership metrics
  useEffect(() => {
    const fetchMembershipData = async () => {
      setLoading(true);
      try {
        const profileRes = await API.get("/membership-engine/profile");
        setProfile(profileRes.data);
        
        // Trigger points counter animation
        let count = 0;
        const target = profileRes.data.points || 0;
        const duration = 1000; // 1s
        const step = Math.ceil(target / (duration / 16));
        const timer = setInterval(() => {
          count += step;
          if (count >= target) {
            setAnimatedPoints(target);
            clearInterval(timer);
          } else {
            setAnimatedPoints(count);
          }
        }, 16);

        const tiersRes = await API.get("/membership-engine/tiers");
        setTiers(tiersRes.data);

        const walletRes = await API.get("/membership-engine/wallet/history");
        setWalletHistory(walletRes.data);

        const activityRes = await API.get("/membership-engine/activity");
        setTimeline(activityRes.data);
      } catch (err) {
        // Fallback luxury seeds
        const mockProfile = {
          id: "mem-7849",
          tier: "Gold Member",
          points: 1450,
          lifetimePoints: 3200,
          walletBalance: 750,
          cashbackBalance: 120,
          joinDate: "2026-01-15",
          validUntil: "2027-01-15",
          referralCode: "CINE7849",
        };
        setProfile(mockProfile);

        // Counter animation fallback
        let count = 0;
        const target = mockProfile.points;
        const timer = setInterval(() => {
          count += 35;
          if (count >= target) {
            setAnimatedPoints(target);
            clearInterval(timer);
          } else {
            setAnimatedPoints(count);
          }
        }, 16);

        setTiers([
          { name: "Bronze", minPoints: 0, discount: 5, benefits: ["Standard Support", "Earn 1x Points on bookings"] },
          { name: "Silver", minPoints: 500, discount: 10, benefits: ["Priority Support", "Earn 1.2x Points", "Free Popcorn on Birthdays"] },
          { name: "Gold", minPoints: 1200, discount: 15, benefits: ["Early Booking Access", "Earn 1.5x Points", "Free Lounge Access", "Free Parking"] },
          { name: "Platinum", minPoints: 3000, discount: 20, benefits: ["Free Seat Upgrades", "Earn 2x Points", "VIP Lounge Access", "Exclusive Events Invite"] }
        ]);

        setWalletHistory([
          { id: "txn-901", timestamp: "2026-07-18T10:30:00Z", amount: 150, type: "CREDIT", source: "Cashback Conversion", status: "COMPLETED" },
          { id: "txn-902", timestamp: "2026-07-15T19:00:00Z", amount: 620, type: "DEBIT", source: "Ticket Booking #bk-7849c", status: "COMPLETED" },
          { id: "txn-903", timestamp: "2026-07-10T14:20:00Z", amount: 500, type: "CREDIT", source: "Manual Wallet Topup", status: "COMPLETED" }
        ]);

        setTimeline([
          { id: "act-1", timestamp: "2026-07-18T10:30:00Z", title: "Points Earned", description: "Earned 50 points for reviewing 'Aether: Rising Stars'." },
          { id: "act-2", timestamp: "2026-07-15T19:00:00Z", title: "Booking Completed", description: "Booked 2 tickets for 'Aether: Rising Stars' (Earned 120 points)." },
          { id: "act-3", timestamp: "2026-07-01T12:00:00Z", title: "Membership Upgraded", description: "Congratulations! You upgraded to Gold Membership tier." }
        ]);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchMembershipData();
    }
  }, [user]);

  if (loading || !profile) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
          <div className="absolute inset-2 rounded-full border-b-2 border-accent animate-spin" style={{ animationDirection: 'reverse' }} />
        </div>
      </div>
    );
  }

  // Handle membership card Mouse Tilt matrix
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTiltRotation({ x: -y / 15, y: x / 25 });
  };

  const handleCardMouseLeave = () => {
    setTiltRotation({ x: 0, y: 0 });
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://cineversepro.com/invite?code=${profile.referralCode}`);
    setCopiedReferral(true);
    toast.success("Referral invite link copied!");
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  // Find tier index and progress
  const currentTierInfo = tiers.find((t) => profile.tier.toLowerCase().includes(t.name.toLowerCase())) || tiers[0];
  const nextTierIndex = tiers.indexOf(currentTierInfo) + 1;
  const nextTierInfo = nextTierIndex < tiers.length ? tiers[nextTierIndex] : null;
  
  const progressPercent = nextTierInfo 
    ? Math.min(((profile.points - currentTierInfo.minPoints) / (nextTierInfo.minPoints - currentTierInfo.minPoints)) * 100, 100)
    : 100;

  return (
    <div className="relative min-h-screen bg-[#050505] text-white pb-36 overflow-hidden">
      
      {/* Luxury gold floating ambient particle dust */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-luxuryGold/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
      </div>

      {/* 1. STICKY HEADER */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 bg-[#050505]/75 backdrop-blur-[25px] h-[96px] flex items-center px-10">
        <div className="max-w-[1450px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate("/profile")}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-primary text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-left">
              <h2 className="font-heading font-extrabold text-xl leading-tight">Prestige Club</h2>
              <p className="text-xs text-gray-400 font-number uppercase tracking-wider mt-0.5">
                {profile.tier} • ID: {profile.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-gray-500 uppercase font-extrabold tracking-wider block">Wallet Balance</span>
              <span className="text-lg font-bold font-number text-accent">₹{profile.walletBalance}</span>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-gray-500 uppercase font-extrabold tracking-wider block">Club Points</span>
              <span className="text-lg font-bold font-number text-luxuryGold">⭐ {animatedPoints}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1450px] mx-auto px-10 mt-10 relative z-10 space-y-12">
        
        {/* 2. DIGITAL MEMBERSHIP CARD SECTION (Center) */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-center space-y-1">
            <h3 className="font-heading font-extrabold text-2xl uppercase tracking-wider text-luxuryGold">Your Prestige Card</h3>
            <p className="text-xs text-gray-500">Tap to flip & view tier rewards</p>
          </div>

          {/* Perspective Container */}
          <div 
            className="perspective-1000 w-full max-w-[620px] aspect-[1.8/1] cursor-pointer"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            onClick={() => setCardFlipped(!cardFlipped)}
          >
            <motion.div
              style={{
                rotateX: tiltRotation.x,
                rotateY: tiltRotation.y,
                transformStyle: "preserve-3d"
              }}
              animate={{ rotateY: cardFlipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full relative rounded-3xl overflow-hidden border border-white/10 shadow-glass"
            >
              
              {/* CARD FRONT */}
              <div 
                className="absolute inset-0 p-8 flex flex-col justify-between bg-gradient-to-tr from-[#1b1509] via-zinc-950 to-black select-none backface-hidden"
                style={{ transform: "translateZ(0px)" }}
              >
                {/* Shiny metallic gold strip element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-luxuryGold/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex justify-between items-start">
                  <div className="space-y-1 text-left">
                    <span className="px-3 py-0.5 rounded-full bg-luxuryGold/20 border border-luxuryGold/30 text-[10px] font-extrabold text-luxuryGold uppercase tracking-widest">
                      {profile.tier}
                    </span>
                    <h4 className="font-heading font-extrabold text-xl text-white tracking-wide mt-2">{user?.name}</h4>
                  </div>
                  
                  {/* Glowing NFC symbol */}
                  <Zap className="w-6 h-6 text-luxuryGold animate-pulse" />
                </div>

                <div className="flex justify-between items-end">
                  <div className="text-left space-y-1">
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-bold">Reward Points</span>
                    <span className="text-3xl font-bold font-number text-luxuryGold glow-text-purple">⭐ {animatedPoints}</span>
                  </div>

                  <div className="text-right font-number text-[10px] text-gray-500 space-y-0.5">
                    <span>Valid Until: {profile.validUntil}</span>
                    <span className="block">Member Since: {profile.joinDate}</span>
                  </div>
                </div>
              </div>

              {/* CARD BACK */}
              <div 
                className="absolute inset-0 p-8 flex flex-col justify-between bg-gradient-to-br from-black via-zinc-950 to-[#1b1509] select-none backface-hidden [transform:rotateY(180deg)]"
              >
                <div className="text-left space-y-4">
                  <h4 className="font-heading font-extrabold text-sm text-luxuryGold uppercase tracking-wider">PRESTIGE PRIVILEGES</h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• 15% discount on all movie food combos</li>
                    <li>• Complimentary valet parking & VIP lounge admittance</li>
                    <li>• 1.5x Reward points multiplier on booking bills</li>
                  </ul>
                </div>

                <div className="flex justify-between items-end border-t border-white/5 pt-4">
                  <div className="text-left">
                    <span className="text-[10px] text-gray-500 block font-number font-semibold">Prestige ID: {profile.id}</span>
                  </div>
                  {/* barcode graphic placeholder */}
                  <div className="w-32 h-6 bg-white/10 rounded flex items-center justify-center text-[9px] tracking-[0.4em] font-mono text-gray-400">
                    ||||| ||| || |||
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </div>

        {/* 3. POINT METRICS DASHBOARD (Tiers Progress & Earn Rules) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Points Progress (Column 5) */}
          <div className="lg:col-span-5 glass-panel border border-white/5 p-6 rounded-3xl bg-black/40 text-left flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="font-heading font-extrabold text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-luxuryGold" /> Progress Metrics
              </h4>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-400">Level: {currentTierInfo?.name}</span>
                  {nextTierInfo ? (
                    <span className="text-luxuryGold">Next: {nextTierInfo.name}</span>
                  ) : (
                    <span className="text-emerald-400">Max level reached</span>
                  )}
                </div>

                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className="h-full bg-gradient-to-r from-luxuryGold to-amber-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {nextTierInfo && (
                  <p className="text-[10px] text-gray-500 mt-1 font-number">
                    Earn {nextTierInfo.minPoints - profile.points} more points to unlock {nextTierInfo.name} status.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5 font-number">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-500 uppercase font-semibold block">Lifetime Points</span>
                <span className="text-xl font-bold text-white">{profile.lifetimePoints}</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-500 uppercase font-semibold block">Expiring soon</span>
                <span className="text-xl font-bold text-primary">120 pts</span>
              </div>
            </div>
          </div>

          {/* Points Earn Rules (Column 7) */}
          <div className="lg:col-span-7 glass-panel border border-white/5 p-6 rounded-3xl bg-black/40 text-left">
            <h4 className="font-heading font-extrabold text-lg uppercase tracking-wider text-gray-300 mb-6">How to Earn Points</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Ticket Purchase", detail: "Get 10 points for every ₹100 spent." },
                { title: "Snack Orders", detail: "Get 15 points for every ₹100 spent." },
                { title: "Review Movies", detail: "Write verified movie reviews and get 50 points." },
                { title: "Refer Friends", detail: "Get 200 points for every successful referral invite." }
              ].map((r, idx) => (
                <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-luxuryGold/10 border border-luxuryGold/20 text-luxuryGold font-extrabold text-xs">
                    +{idx * 5 + 10}
                  </div>
                  <div className="space-y-1">
                    <span className="font-heading font-extrabold text-xs text-white block">{r.title}</span>
                    <span className="text-[10px] text-gray-500 leading-normal">{r.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 4. DIGITAL WALLET & TRANSACTION LEDGER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Wallet card (Column 5) */}
          <div className="lg:col-span-5 glass-panel border border-white/5 p-6 rounded-3xl bg-black/40 text-left flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="font-heading font-extrabold text-lg flex items-center gap-2">
                <Wallet className="w-5 h-5 text-accent" /> Digital Wallet Balance
              </h4>
              <p className="text-[10px] text-gray-500">Quick checkout payment cash store</p>

              <div className="py-6 text-center">
                <span className="text-[10px] text-gray-500 uppercase font-extrabold tracking-widest block">Available Balance</span>
                <span className="text-4xl font-extrabold font-number text-accent mt-2 block">₹{profile.walletBalance}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5 font-number">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-500 uppercase font-semibold block">Bonus Cashback</span>
                <span className="text-base font-bold text-white">₹{profile.cashbackBalance}</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-500 uppercase font-semibold block">Recharge Limit</span>
                <span className="text-base font-bold text-gray-500">₹5,000</span>
              </div>
            </div>
          </div>

          {/* Transactions ledger (Column 7) */}
          <div className="lg:col-span-7 glass-panel border border-white/5 p-6 rounded-3xl bg-black/40 text-left">
            <h4 className="font-heading font-extrabold text-lg uppercase tracking-wider text-gray-300 mb-6">Recent Transactions</h4>
            
            <div className="space-y-4">
              {walletHistory.map((txn) => {
                const isCredit = txn.type === "CREDIT";
                return (
                  <div key={txn.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full border ${isCredit ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-primary'}`}>
                        {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div className="text-left space-y-0.5">
                        <span className="font-heading font-bold text-xs text-white block">{txn.source}</span>
                        <span className="text-[9px] text-gray-500 font-number">{new Date(txn.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`font-number font-bold text-sm ${isCredit ? 'text-emerald-400' : 'text-primary'}`}>
                        {isCredit ? "+" : "-"} ₹{txn.amount}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* 5. REFERRAL PROGRAM & ACHIEVEMENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Referral card (Column 5) */}
          <div className="lg:col-span-5 glass-panel border border-white/5 p-6 rounded-3xl bg-black/40 text-left space-y-6">
            <div className="space-y-1">
              <h4 className="font-heading font-extrabold text-lg flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" /> Referral Link
              </h4>
              <p className="text-[10px] text-gray-500">Get ₹200 for every friend who books their first movie</p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`https://cineversepro.com/invite?code=${profile.referralCode}`}
                className="flex-1 px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono text-gray-400 focus:outline-none"
              />
              <button
                onClick={handleCopyReferral}
                className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {copiedReferral ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="pt-4 border-t border-white/5 text-center">
              <span className="text-[10px] text-gray-500 uppercase font-semibold">Prestige Code</span>
              <span className="text-xl font-bold text-white font-mono mt-1 block tracking-wider uppercase select-all">{profile.referralCode}</span>
            </div>
          </div>

          {/* Achievements grid (Column 7) */}
          <div className="lg:col-span-7 glass-panel border border-white/5 p-6 rounded-3xl bg-black/40 text-left">
            <h4 className="font-heading font-extrabold text-lg uppercase tracking-wider text-gray-300 mb-6">Unlocked Badges</h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { title: "First Movie", icon: "🍿", desc: "Booked your first ticket" },
                { title: "Snack Lover", icon: "🍔", desc: "Ordered gourmet food" },
                { title: "Club Builder", icon: "👥", desc: "Referred a friend" }
              ].map((b, idx) => (
                <div key={idx} className="p-4 bg-[#110b05] border border-luxuryGold/10 rounded-2xl text-center space-y-2">
                  <span className="text-3xl block filter drop-shadow-[0_4px_8px_rgba(212,175,55,0.2)]">{b.icon}</span>
                  <div className="space-y-0.5">
                    <span className="font-heading font-extrabold text-xs text-white block">{b.title}</span>
                    <span className="text-[9px] text-gray-500 leading-tight">{b.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Subscription plans, comparison & AI savings */}
        <PlansAndComparison />

        {/* 6. RECENT ACTIVITY TIMELINE */}
        <div className="glass-panel border border-white/5 p-8 rounded-[32px] bg-black/40 text-left space-y-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-luxuryGold" />
            <h3 className="font-heading font-extrabold text-xl uppercase tracking-wider text-white">Prestige Activity Timeline</h3>
          </div>

          <div className="relative border-l border-white/10 pl-6 space-y-6">
            {timeline.map((act) => (
              <div key={act.id} className="relative">
                {/* Dot */}
                <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-luxuryGold border border-black" />
                
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 max-w-2xl text-left space-y-1">
                  <span className="text-[9px] text-gray-500 font-number">{new Date(act.timestamp).toLocaleString()}</span>
                  <h4 className="font-heading font-extrabold text-xs text-white">{act.title}</h4>
                  <p className="text-[10px] text-gray-400">{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Membership;
