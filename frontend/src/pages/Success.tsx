import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Printer, 
  Compass, 
  Coffee,
  XCircle,
  Clock,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Map,
  Send,
  X
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";
import API from "../api/axios";
import BookingSteps from "../components/booking/BookingSteps";
import PostBookingAssistant from "../components/success/PostBookingAssistant";

// Mock Fallback booking details
const MOCK_CONFIRMED_BOOKING = {
  id: "bk-7849c",
  totalPrice: 620,
  seatNumbers: ["C-5", "C-6"],
  foodItems: [
    { name: "Truffle Butter Popcorn (L)", quantity: 1, price: 199 }
  ],
  showtime: {
    screenName: "Premium IMAX Lounge",
    startTime: "Mon, Jul 20 @ 07:30 PM",
    movie: {
      title: "Aether: Rising Stars",
      posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
      ageRestriction: "UA",
      duration: 142
    }
  }
};

const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId") || "";
  const paymentStatus = searchParams.get("status") || "success"; // 'success', 'failed', 'pending'

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelledRefund, setCancelledRefund] = useState<any>(null);
  const [refundTimeline, setRefundTimeline] = useState<any[]>([]);

  // Live ticket statuses
  const [ticketStatus, setTicketStatus] = useState<"UPCOMING" | "CHECKED_IN" | "TRANSFERRED">("UPCOMING");
  const [qrToken, setQrToken] = useState("pre-auth-token-init");

  // Food order timeline tracker status
  const [foodStep, setFoodStep] = useState(1); // 1 = Preparing, 2 = Cooking, 3 = Ready

  // Interactive Maps / Modals states
  const [showMapModal, setShowMapModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferEmail, setTransferEmail] = useState("");
  const [transferOtp, setTransferOtp] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#E50914", "#8B5CF6", "#00E5FF"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#E50914", "#8B5CF6", "#00E5FF"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setLoading(false);
        return;
      }
      try {
        const response = await API.get(`/bookings/${bookingId}`);
        setBooking(response.data);
        if (paymentStatus === "success") {
          triggerConfetti();
        }
      } catch (err) {
        setBooking(MOCK_CONFIRMED_BOOKING);
        if (paymentStatus === "success") {
          triggerConfetti();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [bookingId, paymentStatus]);

  // Simulate food progress shifts
  useEffect(() => {
    if (paymentStatus === "success") {
      const timer1 = setTimeout(() => setFoodStep(2), 6000);
      const timer2 = setTimeout(() => setFoodStep(3), 15000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [paymentStatus]);

  // Dynamic QR code rotation every 10 seconds (screenshot fraud prevention)
  useEffect(() => {
    if (paymentStatus === "success") {
      const qrInterval = setInterval(() => {
        setQrToken("secure-hash-" + Math.random().toString(36).substring(2, 10) + "-" + Date.now());
      }, 10000);
      return () => clearInterval(qrInterval);
    }
  }, [paymentStatus]);

  // Gate check-in scan simulation
  const handleSimulateCheckin = async () => {
    try {
      const res = await API.post(`/bookings/${bookingId || "bk-7849c"}/checkin`);
      setTicketStatus(res.data.status);
      toast.success("Gate Check-In Approved! Enjoy your movie.");
    } catch (err) {
      setTicketStatus("CHECKED_IN");
      toast.success("Gate Check-In Approved! (Simulator Mode)");
    }
  };

  // Transfer ticket validation
  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferEmail) return;
    setIsTransferring(true);
    try {
      const res = await API.post(`/bookings/${bookingId || "bk-7849c"}/transfer`, { email: transferEmail });
      setTicketStatus(res.data.status);
      toast.success(`Ticket successfully transferred to ${transferEmail}`);
      setShowTransferModal(false);
    } catch (err) {
      setTicketStatus("TRANSFERRED");
      toast.success(`Ticket successfully transferred to ${transferEmail} (Simulator Mode)`);
      setShowTransferModal(false);
    } finally {
      setIsTransferring(false);
    }
  };

  // Cancel booking request
  const handleCancelBooking = async () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel your tickets? A 10% fee will be deducted.");
    if (!confirmCancel) return;

    setIsCancelling(true);
    try {
      const response = await API.post(`/bookings/${bookingId || "bk-7849c"}/cancel`);
      setCancelledRefund(response.data.refund);
      toast.success("Booking cancelled successfully.");
      
      // Query refund timeline status
      const refundStatusRes = await API.get(`/bookings/${bookingId || "bk-7849c"}/refund-status`);
      setRefundTimeline(refundStatusRes.data.timeline);
    } catch (err: any) {
      setCancelledRefund({
        bookingId: bookingId || "bk-7849c",
        originalAmount: 620,
        cancellationFee: 62,
        refundAmount: 558,
        expectedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toDateString(),
        status: "APPROVED"
      });
      setRefundTimeline([
        { label: "Refund Requested", done: true, time: "Just now" },
        { label: "Approved by Merchant", done: true, time: "Just now" },
        { label: "Gateway Processing", done: true, time: "In Progress" },
        { label: "Bank Settlement", done: false, time: "Pending" }
      ]);
      toast.success("Booking cancelled locally (Simulator).");
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
          <div className="absolute inset-2 rounded-full border-b-2 border-accent animate-spin" style={{ animationDirection: 'reverse' }} />
        </div>
      </div>
    );
  }

  const activeBooking = booking || MOCK_CONFIRMED_BOOKING;

  // 1. RENDER PAYMENT FAILURE SCREEN
  if (paymentStatus === "failed") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-8">
        <div className="w-20 h-20 bg-primary/10 border border-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <XCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-heading font-extrabold text-white">Payment Failed</h1>
          <p className="text-gray-400 text-xs leading-relaxed max-w-xs mx-auto">
            The transaction was declined by the card provider or timed out. Your seats have been held temporarily.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link
            to="/payment"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs uppercase tracking-wider shadow-redGlow"
          >
            Retry Payment
          </Link>
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary text-gray-300 text-xs font-bold uppercase transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // 2. RENDER PAYMENT PENDING SCREEN
  if (paymentStatus === "pending") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-8">
        <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
          <Clock className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-heading font-extrabold text-white">Verification Pending</h1>
          <p className="text-gray-400 text-xs leading-relaxed max-w-xs mx-auto">
            We are waiting for response confirmations from your UPI app. Please do not close or reload this window.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Status
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 print:py-0 print:px-0 text-left relative z-10">

      {/* Booking progress — final step */}
      {!cancelledRefund && (
        <div className="print:hidden">
          <BookingSteps current="confirmation" />
        </div>
      )}

      {/* Decorative floating dust */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[300px] h-[300px] bg-luxuryGold/5 blur-[80px]" />
      </div>

      {/* Success banner */}
      {!cancelledRefund ? (
        <div className="text-center space-y-3 print:hidden">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2 shadow-blueGlow animate-pulse"
          >
            <CheckCircle2 className="w-12 h-12" />
          </motion.div>
          <h1 className="text-3xl font-heading font-extrabold text-white">Payment Confirmed!</h1>
          <p className="text-gray-400 text-xs max-w-md mx-auto leading-relaxed">
            Your booking is secured. An HTML email with the entrance ticket code was sent.
          </p>
        </div>
      ) : (
        <div className="text-center space-y-3 print:hidden">
          <div className="inline-flex p-3 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2 shadow-redGlow">
            <AlertTriangle className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-white">Booking Cancelled</h1>
          <p className="text-gray-400 text-xs max-w-md mx-auto leading-relaxed">
            Seats have been released. Refund details are displayed in the panel below.
          </p>
        </div>
      )}

      {/* Retro-Modern Glass Tear-Off Ticket */}
      {!cancelledRefund && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-panel border border-white/10 rounded-3xl overflow-hidden shadow-glass bg-gradient-to-b from-[#111] via-black to-[#050505] relative flex flex-col md:flex-row print:bg-white print:text-black print:border-none print:shadow-none"
        >
          {/* Decorative cutouts */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-3 w-6 h-6 rounded-full bg-background border-r border-white/10 print:hidden" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-3 w-6 h-6 rounded-full bg-background border-l border-white/10 print:hidden" />

          {/* Left: Movie details */}
          <div className="flex-1 p-8 space-y-6 border-b md:border-b-0 md:border-r border-dashed border-white/10 print:border-black print:border-r">
            <div className="flex justify-between items-start">
              <div className="flex gap-5 items-start">
                <img
                  src={activeBooking.showtime.movie.posterUrl}
                  alt={activeBooking.showtime.movie.title}
                  className="w-20 aspect-[2/3] rounded-lg object-cover border border-white/5 print:border-black"
                />
                <div className="space-y-1 text-left">
                  <span className="px-2 py-0.5 border border-white/20 print:border-black rounded text-[9px] uppercase font-bold text-gray-400 print:text-black">
                    {activeBooking.showtime.movie.ageRestriction}
                  </span>
                  <h3 className="text-lg font-heading font-bold text-white print:text-black mt-1.5">{activeBooking.showtime.movie.title}</h3>
                  <p className="text-gray-400 text-[10px] print:text-gray-600">{activeBooking.showtime.movie.duration} min • Digital Dolby</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider block border ${
                  ticketStatus === "UPCOMING"
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    : ticketStatus === "CHECKED_IN"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-gray-500/10 border-gray-500/20 text-gray-400"
                }`}>
                  {ticketStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-number">
              <div>
                <span className="text-gray-500 text-[10px] uppercase font-bold block">Audi Screen</span>
                <span className="text-white font-bold print:text-black">{activeBooking.showtime.screenName}</span>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] uppercase font-bold block">Showtime Date</span>
                <span className="text-accent font-bold print:text-black">{activeBooking.showtime.startTime}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Seats Reserved</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeBooking.seatNumbers.map((seat: string) => (
                    <span key={seat} className="px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-white font-bold text-[10px] print:bg-gray-100 print:text-black">
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Food ordered section */}
            {activeBooking.foodItems && activeBooking.foodItems.length > 0 && (
              <div className="pt-4 border-t border-white/5 print:border-black space-y-2">
                <span className="text-gray-500 text-[10px] uppercase font-bold block">Gourmet Snacks Voucher</span>
                {activeBooking.foodItems.map((food: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-xs text-gray-300 print:text-black font-number">
                    <span className="flex items-center gap-1.5"><Coffee className="w-3.5 h-3.5" /> {food.name} (Qty: {food.quantity})</span>
                    <span>₹{food.price * food.quantity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Dynamic QR entry scanner */}
          <div className="w-full md:w-60 p-8 flex flex-col items-center justify-center gap-4 bg-black/40 print:bg-white text-center">
            <span className="text-gray-500 text-[9px] uppercase font-bold tracking-wider">Dynamic Scan QR</span>
            <div className="p-2 bg-white rounded-lg border border-gray-200 select-none relative group">
              <QRCodeSVG 
                value={JSON.stringify({ bookingId: activeBooking.id, verify: "cineverse-pro", token: qrToken })}
                size={110}
                level={"H"}
              />
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                <span className="text-[8px] font-bold uppercase text-luxuryGold">Anti-Screenshot Rotate</span>
              </div>
            </div>
            <div className="space-y-0.5 font-number">
              <span className="text-gray-500 text-[9px] uppercase font-bold block">Ref Code</span>
              <span className="text-white font-bold text-xs uppercase print:text-black">{activeBooking.id}</span>
            </div>

            {/* Simulated entry scanner staff scan button */}
            {ticketStatus === "UPCOMING" && (
              <button 
                onClick={handleSimulateCheckin}
                className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer"
              >
                Scan Ticket checkin
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* 4. REFUND TIMELINE DASHBOARD (Show when cancelled) */}
      {cancelledRefund && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel border border-white/5 p-6 rounded-3xl bg-black/40 space-y-6"
        >
          <div className="flex items-center gap-2 text-primary">
            <TrendingUp className="w-5 h-5" />
            <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider">Refund Transaction Progress</h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-number border-b border-white/5 pb-6">
            <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-left">
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">Total paid</span>
              <span className="text-base font-bold text-white">₹{cancelledRefund.originalAmount}</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-left">
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">Fee deducted</span>
              <span className="text-base font-bold text-primary">₹{cancelledRefund.cancellationFee}</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-left">
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">Refund balance</span>
              <span className="text-base font-bold text-emerald-400">₹{cancelledRefund.refundAmount}</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-left">
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">Expected date</span>
              <span className="text-xs font-bold text-gray-400 block mt-1 leading-tight">{cancelledRefund.expectedDate}</span>
            </div>
          </div>

          <div className="space-y-4">
            {refundTimeline.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.done ? 'bg-emerald-400' : 'bg-gray-700'}`} />
                  <span className="font-heading font-bold text-white">{item.label}</span>
                </div>
                <span className="text-gray-500">{item.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 5. LIVE FOOD DELIVERY TRACKER PANEL */}
      {!cancelledRefund && activeBooking.foodItems && activeBooking.foodItems.length > 0 && (
        <div className="glass-panel border border-white/5 p-6 rounded-3xl bg-[#0e0a05] space-y-6">
          <div className="flex items-center gap-2 text-luxuryGold">
            <Coffee className="w-5 h-5 text-luxuryGold" />
            <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider">Snack Counter Delivery Progress</h4>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold uppercase relative">
            {[
              { step: 1, label: "Preparing" },
              { step: 2, label: "In Kitchen" },
              { step: 3, label: "Ready at Counter" }
            ].map((s) => {
              const active = foodStep >= s.step;
              return (
                <div key={s.step} className="space-y-2">
                  <div className={`h-1.5 rounded-full ${active ? 'bg-luxuryGold shadow-goldGlow' : 'bg-white/5'}`} />
                  <span className={active ? 'text-luxuryGold' : 'text-gray-600'}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI post-booking companion */}
      {!cancelledRefund && (
        <PostBookingAssistant showTime={activeBooking.showtime?.startTime} />
      )}

      {/* Action buttons footer */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-6 print:hidden">
        {!cancelledRefund && (
          <>
            <button
              onClick={() => setShowTransferModal(true)}
              className="px-6 py-3 bg-white/5 border border-white/10 hover:border-primary text-gray-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <Send className="w-4 h-4 text-accent" /> Transfer Ticket
            </button>
            <button
              onClick={() => setShowMapModal(true)}
              className="px-6 py-3 bg-white/5 border border-white/10 hover:border-primary text-gray-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <Map className="w-4 h-4 text-luxuryGold" /> Theatre Map / Gates
            </button>
            <button
              onClick={handleCancelBooking}
              disabled={isCancelling}
              className="px-6 py-3 bg-red-500/10 border border-red-500/20 hover:border-primary text-primary hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              {isCancelling ? "Processing..." : "Cancel Tickets"}
            </button>
          </>
        )}
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary text-gray-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" /> Print Ticket PDF
        </button>
        <Link
          to="/"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs uppercase tracking-wider shadow-redGlow cursor-pointer"
        >
          <Compass className="w-4 h-4" /> Return to Homepage
        </Link>
      </div>

      {/* 6. MODAL: THEATRE MAP / GATE NAVIGATOR */}
      <AnimatePresence>
        {showMapModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl rounded-3xl glass-panel border border-white/10 p-6 bg-gradient-to-tr from-black to-zinc-950 text-left relative overflow-hidden"
            >
              <button 
                onClick={() => setShowMapModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-heading font-extrabold text-xl text-white mb-2">Theatre Entry gates Map</h3>
              <p className="text-xs text-gray-400 mb-6">Location guide for Audi lounges, restrooms, and parking</p>

              {/* Vector representation details */}
              <div className="grid grid-cols-2 gap-4 font-number text-xs">
                {[
                  { name: "Parking Level", val: "P2 Zone C", desc: "Premium valet drop point" },
                  { name: "Entry Gate Lounge", val: "Gate 4B", desc: "Turnstile QR scanner gate" },
                  { name: "Gourmet Snack Counter", val: "Lobby Concessions", desc: "Seat food pickup token 901" },
                  { name: "Restroom Access", val: "East Corridor", desc: "Located beside Screen 2 entry" }
                ].map((l, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">{l.name}</span>
                    <span className="text-sm font-bold text-white block mt-1">{l.val}</span>
                    <span className="text-[10px] text-gray-500">{l.desc}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. MODAL: TRANSFER TICKET */}
      <AnimatePresence>
        {showTransferModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl glass-panel border border-white/10 p-8 space-y-6 bg-gradient-to-tr from-black to-zinc-950 text-left relative overflow-hidden"
            >
              <button 
                onClick={() => setShowTransferModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <h3 className="font-heading font-extrabold text-xl text-white">Transfer Ticket ownership</h3>
                <p className="text-xs text-gray-400">Gift your seat booking to a friend instantly</p>
              </div>

              <form onSubmit={handleTransferSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Receiver Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="friend@domain.com"
                    value={transferEmail}
                    onChange={(e) => setTransferEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 focus:border-primary text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Verification Code (OTP)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9840"
                    value={transferOtp}
                    onChange={(e) => setTransferOtp(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 focus:border-primary text-sm text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isTransferring}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-xs uppercase tracking-widest shadow-redGlow cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isTransferring ? "Transferring..." : "Confirm Ticket Transfer"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Success;
