import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Clock, 
  ShoppingBag,
  Sparkles,
  WifiOff,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import toast from "react-hot-toast";
import type { RootState } from "../redux/store";
import { toggleSeatSelection, clearSelectedSeats } from "../redux/bookingSlice";
import API from "../api/axios";
import BookingSteps from "../components/booking/BookingSteps";
import AIRecommendedSeats from "../components/booking/AIRecommendedSeats";

// SVG Cinema Seat Component
interface CinemaSeatProps {
  id: string;
  type: "STANDARD" | "VIP" | "RECLINER" | "COUPLE" | "WHEELCHAIR" | "BLOCKED" | "BOOKED";
  seatNumber: string;
  isSelected: boolean;
  onClick: () => void;
}

const CinemaSeatIcon: React.FC<CinemaSeatProps> = ({ type, seatNumber, isSelected, onClick }) => {
  let color = "#404040"; 
  let border = "rgba(255,255,255,0.1)";
  
  if (isSelected) {
    color = "#e50914"; 
    border = "#e50914";
  } else if (type === "VIP") {
    color = "#1a1305";
    border = "#d4af37"; 
  } else if (type === "RECLINER") {
    color = "#120a1c";
    border = "#8b5cf6"; 
  } else if (type === "WHEELCHAIR") {
    color = "#081b33";
    border = "#00e5ff"; 
  } else if (type === "BLOCKED") {
    color = "#1f1f1f";
    border = "rgba(255,255,255,0.05)";
  } else if (type === "BOOKED") {
    color = "#2d080b";
    border = "#7f1d1d";
  }

  if (type === "COUPLE") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`${seatNumber} couple seat, ${isSelected ? "selected" : "available"}`}
        aria-pressed={isSelected}
        className={`flex h-11 w-16 items-center justify-center rounded-md transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 ${
          isSelected ? "filter drop-shadow-[0_0_8px_rgba(229,9,20,0.5)] animate-pulse" : ""
        }`} 
      >
        <svg aria-hidden className="h-9 w-14" viewBox="0 0 100 50">
          <rect x="2" y="10" width="96" height="35" rx="10" fill={color} stroke={border} strokeWidth="2" />
          <rect x="8" y="2" width="84" height="15" rx="6" fill={color} stroke={border} strokeWidth="2" />
          <rect x="2" y="15" width="8" height="25" rx="3" fill="#262626" opacity="0.6" />
          <rect x="90" y="15" width="8" height="25" rx="3" fill="#262626" opacity="0.6" />
          <rect x="46" y="15" width="8" height="25" rx="3" fill="#262626" opacity="0.6" />
          <path d="M50 25 C48 22, 45 22, 45 25 C45 28, 50 31, 50 31 C50 31, 55 28, 55 25 C55 22, 52 22, 50 25 Z" fill={isSelected ? "#ffffff" : "#f43f5e"} />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={type === "BOOKED" || type === "BLOCKED"}
      aria-label={`${seatNumber} ${type.toLowerCase()} seat, ${
        type === "BOOKED" || type === "BLOCKED" ? "unavailable" : isSelected ? "selected" : "available"
      }`}
      aria-pressed={isSelected}
      className={`flex h-11 w-11 items-center justify-center rounded-md transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-75 ${
        isSelected ? "filter drop-shadow-[0_0_8px_rgba(229,9,20,0.5)]" : ""
      }`} 
    >
      <svg aria-hidden className="h-8 w-8" viewBox="0 0 40 40">
        <rect x="4" y="2" width="32" height="24" rx="8" fill={color} stroke={border} strokeWidth="1.5" />
        <rect x="2" y="16" width="36" height="18" rx="6" fill={color} stroke={border} strokeWidth="1.5" />
        <rect x="1" y="14" width="5" height="18" rx="2" fill="#262626" opacity="0.7" />
        <rect x="34" y="14" width="5" height="18" rx="2" fill="#262626" opacity="0.7" />
        <line x1="8" y1="26" x2="32" y2="26" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round" />

        {type === "BLOCKED" && (
          <path d="M16 16 H24 V22 H16 Z M18 16 V13 A2 2 0 0 1 22 13 V16" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        )}
        {type === "BOOKED" && (
          <path d="M12 12 L28 28 M28 12 L12 28" stroke="#7f1d1d" strokeWidth="2" strokeLinecap="round" />
        )}
        {isSelected && (
          <path d="M14 20 L18 24 L26 16" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        )}
        {type === "VIP" && !isSelected && (
          <circle cx="20" cy="10" r="3" fill="#d4af37" />
        )}
      </svg>
    </button>
  );
};

const Booking: React.FC = () => {
  const { movie, showtime, selectedSeats } = useSelector((state: RootState) => state.booking);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // states
  const [introActive, setIntroActive] = useState(true);
  const [timerCount, setTimerCount] = useState(600); 
  const [seatLayout, setSeatLayout] = useState<any[]>([]);
  const [liveBlockedSeats] = useState<string[]>([]);
  
  // Intelligent Booking parameters
  const [groupSize, setGroupSize] = useState<number>(2);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Warning Overlay states for Isolated Seat Prevention
  const [isolatedWarning, setIsolatedWarning] = useState<string | null>(null);
  const [pendingSelection, setPendingSelection] = useState<any | null>(null);
  const [pendingIsolatedSeat, setPendingIsolatedSeat] = useState<any | null>(null);

  // Safety navigation check
  useEffect(() => {
    if (!movie || !showtime) {
      toast.error("Please select showtimes details first.");
      navigate("/");
    }
  }, [movie, showtime, navigate]);

  // Intro timer set to 0 for instant interactive rendering
  useEffect(() => {
    setIntroActive(false);
  }, []);

  // Monitor online status to pause reservation timeout
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast.success("Online. Reconnected to booking engine!");
    };
    const handleOffline = () => {
      setIsOffline(true);
      toast.error("Internet disconnected. Booking timer paused!");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 10 minutes Booking Countdown Timer
  useEffect(() => {
    if (introActive || isOffline) return;
    const interval = setInterval(() => {
      setTimerCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          toast.error("Booking time expired. Your seats have been released.");
          dispatch(clearSelectedSeats());
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [introActive, isOffline, navigate, dispatch]);

  // Seeding dynamic seat layout grid (A-K rows, 1-16 columns)
  useEffect(() => {
    if (!showtime) return;
    
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"];
    const seatsList: any[] = [];

    rows.forEach((row) => {
      for (let col = 1; col <= 16; col++) {
        const seatId = `${row}-${col}`;
        let type: "STANDARD" | "VIP" | "RECLINER" | "COUPLE" | "WHEELCHAIR" | "BLOCKED" | "BOOKED" = "STANDARD";
        
        if (["A", "B"].includes(row)) {
          type = "RECLINER";
        } else if (["C", "D"].includes(row)) {
          type = "VIP";
        } else if (row === "K") {
          type = "COUPLE";
        } else if (row === "H" && [1, 16].includes(col)) {
          type = "WHEELCHAIR";
        }

        const isBooked = ["B-3", "B-4", "D-8", "F-9", "F-10", "H-5"].includes(seatId);
        const isBlocked = ["C-1", "J-6"].includes(seatId);

        seatsList.push({
          id: seatId,
          row,
          column: col,
          seatNumber: `${row}${col}`,
          type: isBooked ? "BOOKED" : isBlocked ? "BLOCKED" : type,
          price: type === "RECLINER" ? showtime.basePrice + 200 : type === "VIP" ? showtime.basePrice + 100 : showtime.basePrice
        });
      }
    });

    setSeatLayout(seatsList);
  }, [showtime]);

  if (!movie || !showtime) return null;

  // Format Timer output
  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  let timerColorClass = "text-emerald-400 border-emerald-500/20 bg-emerald-500/5 glow-text-blue";
  if (timerCount < 120) {
    timerColorClass = "text-primary border-primary bg-primary/5 glow-text-red animate-pulse";
  } else if (timerCount < 300) {
    timerColorClass = "text-amber-500 border-amber-500/20 bg-amber-500/5 glow-text-purple";
  }

  // Trigger auto best seat algorithm
  const handleAutoBestSeats = async () => {
    try {
      const bookedIds = [...liveBlockedSeats, ...seatLayout.filter((s) => s.type === "BOOKED").map((s) => s.id)];
      const res = await API.post("/booking-engine/best-seats", {
        groupSize,
        seatLayout,
        bookedSeats: bookedIds
      });

      if (res.data && res.data.bestGroup && res.data.bestGroup.length > 0) {
        dispatch(clearSelectedSeats());
        
        // Select optimal group
        res.data.bestGroup.forEach((id: string) => {
          const seat = seatLayout.find((s) => s.id === id);
          if (seat) {
            dispatch(toggleSeatSelection({
              id: seat.id,
              seatNumber: seat.seatNumber,
              type: seat.type,
              price: seat.price
            }));
          }
        });
        toast.success(`Selected best available group of ${groupSize} seats together!`);
      } else {
        toast.error("Could not find continuous seats matching group size.");
      }
    } catch {
      toast.error("Selection calculation failed. Choose seats manually.");
    }
  };

  // Seat toggle selection dispatch - INSTANT response
  const handleSeatClick = (seat: any) => {
    if (seat.type === "BOOKED" || seat.type === "BLOCKED" || liveBlockedSeats.includes(seat.id)) {
      toast.error(`Seat ${seat.seatNumber} is unavailable.`);
      return;
    }

    const isAlreadySelected = selectedSeats.some((s) => s.id === seat.id);
    if (!isAlreadySelected && selectedSeats.length >= 8) {
      toast.error("You can select a maximum of 8 seats.");
      return;
    }

    // Toggle seat state IMMEDIATELY for zero lag / 0ms visual feedback
    dispatch(toggleSeatSelection({
      id: seat.id,
      seatNumber: seat.seatNumber,
      type: seat.type,
      price: seat.price
    }));
  };

  const handleConfirmIsolatedSelectAll = () => {
    if (!pendingSelection || !pendingIsolatedSeat) return;
    
    // Select both selection and isolated seat
    dispatch(toggleSeatSelection({
      id: pendingSelection.id,
      seatNumber: pendingSelection.seatNumber,
      type: pendingSelection.type,
      price: pendingSelection.price
    }));

    dispatch(toggleSeatSelection({
      id: pendingIsolatedSeat.id,
      seatNumber: pendingIsolatedSeat.seatNumber,
      type: pendingIsolatedSeat.type,
      price: pendingIsolatedSeat.price
    }));

    // Reset warnings
    setPendingSelection(null);
    setPendingIsolatedSeat(null);
    setIsolatedWarning(null);
    toast.success("Added isolated seat to booking combo!");
  };

  const handleKeepOriginalSelection = () => {
    if (!pendingSelection) return;
    
    // Proceed with only selection
    dispatch(toggleSeatSelection({
      id: pendingSelection.id,
      seatNumber: pendingSelection.seatNumber,
      type: pendingSelection.type,
      price: pendingSelection.price
    }));

    setPendingSelection(null);
    setPendingIsolatedSeat(null);
    setIsolatedWarning(null);
  };

  // Pricing math
  const subtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
  const bookingFee = selectedSeats.length * 30; 
  const gstTax = subtotal > 0 ? Math.round((subtotal + bookingFee) * 0.18) : 0; 
  const grandTotal = subtotal + bookingFee + gstTax;

  // AI recommended: first contiguous trio of available (non-couple) seats in a mid row
  const recommendedSeatObjs = (() => {
    const rowsPref = ["F", "G", "E", "H", "J"];
    for (const row of rowsPref) {
      const avail = seatLayout
        .filter(
          (s) =>
            s.row === row &&
            s.type !== "BOOKED" &&
            s.type !== "BLOCKED" &&
            s.type !== "COUPLE" &&
            !liveBlockedSeats.includes(s.id)
        )
        .sort((a, b) => a.column - b.column);
      for (let i = 0; i <= avail.length - 3; i++) {
        if (
          avail[i + 1].column === avail[i].column + 1 &&
          avail[i + 2].column === avail[i].column + 2
        ) {
          return [avail[i], avail[i + 1], avail[i + 2]];
        }
      }
    }
    return [] as any[];
  })();

  const recommendedApplied =
    recommendedSeatObjs.length > 0 &&
    recommendedSeatObjs.every((s) => selectedSeats.some((sel) => sel.id === s.id));

  const applyRecommendedSeats = () => {
    dispatch(clearSelectedSeats());
    recommendedSeatObjs.forEach((seat) =>
      dispatch(
        toggleSeatSelection({
          id: seat.id,
          seatNumber: seat.seatNumber,
          type: seat.type,
          price: seat.price,
        })
      )
    );
    toast.success("AI recommended seats selected!");
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat before proceeding.");
      return;
    }

    if (!user) {
      toast.error("Please login to proceed with booking.");
      navigate(`/login?redirect=${encodeURIComponent("/booking")}`);
      return;
    }

    navigate("/food");
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white pb-36 overflow-hidden">
      
      {/* 1. CURTAINS INTRO TRANSITION */}
      <AnimatePresence>
        {introActive && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 bg-[#020202] flex items-center justify-center pointer-events-none"
          >
            <motion.div 
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-red-950 to-red-900 border-r border-black/45 shadow-glass"
            />
            <motion.div 
              initial={{ x: 0 }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-red-950 to-red-900 border-l border-black/45 shadow-glass"
            />
            <motion.div
              initial={{ scale: 0.1, opacity: 0 }}
              animate={{ scale: [1, 2.5, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, times: [0, 0.7, 1] }}
              className="w-[120px] h-[120px] rounded-full bg-white/95 blur-[40px] shadow-[0_0_100px_rgba(255,255,255,0.8)] z-10"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Volumetric light sweeps */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,rgba(0,229,255,0.01)_50%,transparent_100%)] opacity-80" />
        {Array.from({ length: 15 }).map((_, idx) => (
          <motion.div
            key={idx}
            animate={{
              y: [500, -100],
              x: [idx * 90, idx * 90 + Math.sin(idx) * 20]
            }}
            transition={{
              duration: 20 + (idx % 5) * 5,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-white/20 rounded-full blur-[1px]"
            style={{ left: `${(idx * 7) % 100}%` }}
          />
        ))}
      </div>

      {/* Connection Lost Offline Overlay */}
      {isOffline && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
          <div className="glass-panel border border-white/10 p-8 rounded-3xl max-w-sm text-center space-y-4">
            <WifiOff className="w-12 h-12 text-primary animate-bounce mx-auto" />
            <h3 className="font-heading font-extrabold text-lg">Connection Lost</h3>
            <p className="text-gray-400 text-xs leading-normal">
              Booking timer paused. We are attempting to reconnect to the reservations engine. Keep this window open.
            </p>
            <div className="flex justify-center pt-2">
              <RefreshCw className="w-5 h-5 animate-spin text-accent" />
            </div>
          </div>
        </div>
      )}

      {/* 2. STICKY HEADER */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 bg-[#050505]/75 backdrop-blur-[25px] h-[90px] flex items-center px-10">
        <div className="max-w-[1450px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-primary text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-left space-y-0.5">
              <h2 className="font-heading font-extrabold text-lg leading-tight">{movie.title}</h2>
              <p className="text-xs text-gray-400 font-number">
                {showtime.screenName} • {showtime.startTime}
              </p>
            </div>
          </div>

          {/* Booking Timer Capsule */}
          <div className={`px-4 py-2 rounded-full border flex items-center gap-2 font-number text-sm font-bold shadow-glass ${timerColorClass}`}>
            <Clock className="w-4 h-4" />
            <span>{formatTimer(timerCount)}</span>
          </div>
        </div>
      </header>

      {/* Booking progress indicator */}
      <div className="relative z-10 mx-auto max-w-[1450px] px-10 pt-8">
        <BookingSteps current="seats" />
      </div>

      {/* 3. MAIN HALL GRID LAYOUT */}
      <div className={`max-w-[1450px] mx-auto px-10 mt-10 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 ${timerCount < 60 ? 'shadow-[inset_0_0_30px_rgba(229,9,20,0.15)] rounded-3xl border border-primary/10 transition-all' : ''}`}>
        
        {/* Left Column: Theatre Screen, Intelligent Auto-Select Controls, and Seats Grid */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Curved 3D IMAX Screen with Projection Rays */}
          <div className="flex flex-col items-center gap-3 select-none perspective-1000">
            <div className="w-[90%] h-8 bg-gradient-to-b from-white via-slate-200 to-[#e50914]/20 rounded-b-[120px] shadow-[0_15px_40px_rgba(229,9,20,0.35)] border-b-2 border-primary/50 relative overflow-hidden transform rotateX(-12deg)">
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
              />
            </div>
            <div className="flex items-center gap-2 text-[10px] text-primary font-extrabold tracking-[0.3em] uppercase glow-text-red">
              <span>✦</span> <span>3D IMAX DOLBY ATMOS SCREEN</span> <span>✦</span>
            </div>
          </div>

          {/* Intelligent Seat Selector Engine Controls */}
          <div className="glass-panel border border-white/5 p-4 rounded-2xl bg-black/40 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto text-left">
            <div className="space-y-1">
              <h4 className="font-heading font-extrabold text-xs uppercase text-gray-400">Intelligent Seat Finder</h4>
              <p className="text-[10px] text-gray-500">Auto-scores horizontal coordinate centers and screen distances</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Group Size selection dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Group Size:</span>
                <select
                  value={groupSize}
                  onChange={(e) => setGroupSize(parseInt(e.target.value))}
                  className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num} className="bg-[#050505]">{num}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAutoBestSeats}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-xs uppercase tracking-wider shadow-redGlow hover:scale-102 transition-transform cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                Find Best Seats
              </button>
            </div>
          </div>

          {/* AI Recommended Seats */}
          <AIRecommendedSeats
            seats={recommendedSeatObjs.map((s) => s.seatNumber)}
            onApply={applyRecommendedSeats}
            applied={recommendedApplied}
          />

          {/* Seats Scroll container */}
          <div className="overflow-x-auto pb-6 pt-6 scrollbar-thin">
            <div className="min-w-[650px] mx-auto flex flex-col gap-3 justify-center items-center">
              
              {/* Rows Mapping */}
              {Array.from(new Set(seatLayout.map((s) => s.row))).map((row) => (
                <div key={row} className="flex items-center gap-4">
                  <span className="w-6 text-xs text-gray-500 font-extrabold font-heading text-center">{row}</span>

                  <div className="flex items-center gap-2">
                    {seatLayout
                      .filter((s) => s.row === row)
                      .map((seat) => {
                        const isSelected = selectedSeats.some((s) => s.id === seat.id);
                        const isLiveBlocked = liveBlockedSeats.includes(seat.id);
                        return (
                          <div key={seat.id} className="relative">
                            <CinemaSeatIcon
                              id={seat.id}
                              type={isLiveBlocked ? "BOOKED" : seat.type}
                              seatNumber={seat.seatNumber}
                              isSelected={isSelected}
                              onClick={() => handleSeatClick(seat)}
                            />
                            {/* Live block blink overlay */}
                            {isLiveBlocked && (
                              <span className="absolute inset-0 rounded bg-primary/20 animate-ping pointer-events-none" />
                            )}
                          </div>
                        );
                      })}
                  </div>

                  <span className="w-6 text-xs text-gray-500 font-extrabold font-heading text-center">{row}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-6 pt-4 border-t border-white/5 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#404040]" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#e50914]" />
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#2d080b] border border-[#7f1d1d]" />
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#1a1305] border border-[#d4af37]" />
              <span>VIP</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#120a1c] border border-[#8b5cf6]" />
              <span>Recliner</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#081b33] border border-[#00e5ff]" />
              <span>Wheelchair</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#1f1f1f]" />
              <span>Blocked</span>
            </div>
          </div>

        </div>

        {/* Right Column: Sticky Summary Panel (Column 4) */}
        <div className="lg:col-span-4 lg:sticky lg:top-[120px] self-start">
          <div className="glass-panel border border-white/10 p-6 rounded-3xl space-y-6 bg-gradient-to-tr from-black via-zinc-950/80 to-black shadow-glass text-left">
            <div>
              <h3 className="font-heading font-extrabold text-lg">Booking Summary</h3>
              <p className="text-gray-400 text-xs mt-1">Review ticket quantities and charges</p>
            </div>

            {/* Poster details */}
            <div className="flex gap-4 items-center border-b border-white/5 pb-4">
              <img src={movie.posterUrl} alt={movie.title} className="w-12 h-18 object-cover rounded-md border border-white/10" />
              <div className="space-y-0.5">
                <h4 className="font-heading font-extrabold text-sm text-white line-clamp-1">{movie.title}</h4>
                <p className="text-[10px] text-gray-500 font-semibold uppercase">Rating: {movie.ageRestriction}</p>
              </div>
            </div>

            {/* Ticket timings details */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Date</span>
                <span className="font-bold">{showtime.startTime.split(" @ ")[0]}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Timings</span>
                <span className="font-bold">{showtime.startTime.split(" @ ")[1]}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Screen Layout</span>
                <span className="font-bold">{showtime.screenName.split(" (")[0]}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
                <span className="text-gray-400">Seats selected</span>
                <span className="font-bold text-accent font-number">
                  {selectedSeats.length > 0 ? selectedSeats.map((s) => s.seatNumber).join(", ") : "None"}
                </span>
              </div>
            </div>

            {/* Pricing break downs */}
            {selectedSeats.length > 0 && (
              <div className="space-y-2 text-xs font-number border-b border-white/5 pb-4">
                <div className="flex justify-between items-center text-gray-400">
                  <span>Subtotal tickets</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Booking fees</span>
                  <span className="font-semibold">₹{bookingFee}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>GST Taxes (18%)</span>
                  <span className="font-semibold">₹{gstTax}</span>
                </div>
              </div>
            )}

            {/* Subtotals & Proceed CTA */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-heading font-extrabold text-white">Grand Total</span>
                <span className="text-2xl font-bold font-number text-primary glow-text-red">₹{grandTotal}</span>
              </div>

              <button
                onClick={handleProceed}
                disabled={selectedSeats.length === 0}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-xs uppercase tracking-widest shadow-redGlow hover:scale-102 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:bg-neutral-900 disabled:border disabled:border-white/5 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                Proceed with Booking
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* 4. WARNING DIALOG MODAL FOR ISOLATED SEAT PREVENTION */}
      <AnimatePresence>
        {isolatedWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl glass-panel border border-white/10 p-6 space-y-6 bg-gradient-to-tr from-black to-zinc-950 shadow-glass text-left"
            >
              <div className="flex gap-3 items-start">
                <div className="p-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-extrabold text-base text-white">Isolated Seat Left</h3>
                  <p className="text-xs text-gray-400 leading-normal">
                    {isolatedWarning}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleConfirmIsolatedSelectAll}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-xs uppercase tracking-wider shadow-redGlow cursor-pointer"
                >
                  Select All
                </button>
                <button
                  onClick={handleKeepOriginalSelection}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  No, Keep
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Booking;
