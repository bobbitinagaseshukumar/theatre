import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  ShieldAlert, 
  Loader2, 
  ShieldCheck, 
  CheckCircle,
  ChevronLeft,
  Smartphone,
  QrCode,
  Globe,
  Wallet,
  Coins
} from "lucide-react";
import toast from "react-hot-toast";
import type { RootState } from "../redux/store";
import { resetBooking } from "../redux/bookingSlice";
import API from "../api/axios";
import BookingSteps from "../components/booking/BookingSteps";
import SmartPaymentRecommendation from "../components/payment/SmartPaymentRecommendation";
import PaymentSecurityPanel from "../components/payment/PaymentSecurityPanel";
import PaymentProcessingOverlay from "../components/payment/PaymentProcessingOverlay";

const Payment: React.FC = () => {
  const { movie, showtime, selectedSeats, foodItems, appliedCoupon } = useSelector(
    (state: RootState) => state.booking
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // states
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [mockStatus, setMockStatus] = useState<"idle" | "verifying" | "success" | "failed">("idle");
  const [pendingBookingId, setPendingBookingId] = useState("");
  const [processingActive, setProcessingActive] = useState(false);

  // Payment methods states
  const [activeTab, setActiveTab] = useState<"UPI" | "CARD" | "NET_BANKING" | "WALLETS">("CARD");

  // Credit card 3D states
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cvvFocused, setCvvFocused] = useState(false);

  const [useWalletBalance, setUseWalletBalance] = useState(false);
  const walletBalance = 750; // mock client balance

  // UPI variables
  const [upiId, setUpiId] = useState("");
  const [showUpiQr, setShowUpiQr] = useState(false);

  // 10-Minute Countdown state
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      toast.error("Checkout session expired. Seats released.");
      dispatch(resetBooking());
      navigate("/");
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, navigate, dispatch]);

  useEffect(() => {
    if (!movie || !showtime || selectedSeats.length === 0 || !user) {
      toast.error("Invalid checkout details.");
      navigate("/");
    }
  }, [movie, showtime, selectedSeats, user, navigate]);

  if (!movie || !showtime || !user) return null;

  // Totals calculations
  const ticketsSubtotal = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
  const convenienceFee = selectedSeats.length * 30;
  const foodSubtotal = foodItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const subtotal = ticketsSubtotal + convenienceFee + foodSubtotal;
  const deliveryCharge = 0;
  const taxTotal = Math.round(subtotal * 0.18);
  
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.isPercentage) {
      discount = parseFloat((subtotal * (appliedCoupon.discountValue / 100)).toFixed(2));
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  // Deduct wallet balance if split is checked
  const walletDeduction = useWalletBalance ? Math.min(walletBalance, subtotal + taxTotal - discount) : 0;
  const finalTotal = parseFloat((subtotal + taxTotal - discount - walletDeduction).toFixed(2));

  const startCheckout = async () => {
    setPaymentLoading(true);
    try {
      // 1. Create Pending Booking on Backend
      const bookingData = {
        showtimeId: showtime.id,
        seatNumbers: selectedSeats.map((s) => s.id),
        foodItems: foodItems.map((f) => ({ foodItemId: f.id, quantity: f.quantity, price: f.price })),
        couponCode: appliedCoupon?.code,
        totalPrice: finalTotal + walletDeduction, // total booking value
      };

      let response;
      try {
        response = await API.post("/bookings", bookingData);
      } catch {
        response = { data: { bookingId: "mock-bk-" + Math.floor(Math.random() * 100000) } };
      }

      const bookingId = response.data.bookingId;
      setPendingBookingId(bookingId);

      // Trigger CineVerse premium mock checkout simulator
      setShowSimulator(true);
      setPaymentLoading(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate payment transaction.");
      setPaymentLoading(false);
    }
  };

  const handleMockPaymentSuccess = async () => {
    // Close the simulator and run the full-screen processing sequence
    setShowSimulator(false);
    setMockStatus("idle");
    setProcessingActive(true);
    try {
      await API.post(`/payments/mock-success`, { bookingId: pendingBookingId });
    } catch {
      /* mock verification handled locally */
    }
  };

  const handleProcessingComplete = () => {
    setProcessingActive(false);
    toast.success("Payment completed successfully!");
    dispatch(resetBooking());
    navigate(`/success?bookingId=${pendingBookingId}`);
  };

  const handleMockPaymentFail = () => {
    setMockStatus("verifying");
    setTimeout(() => {
      setMockStatus("failed");
      toast.error("Payment failed. Try another checkout option.");
      setTimeout(() => {
        setMockStatus("idle");
        setShowSimulator(false);
      }, 2000);
    }, 1500);
  };

  // Helper card branding check
  const getCardType = (num: string) => {
    if (num.startsWith("4")) return "Visa";
    if (num.startsWith("5")) return "Mastercard";
    if (num.startsWith("6")) return "RuPay";
    return "Credit Card";
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white pb-36 overflow-hidden">
      
      {/* Volumetric background security lights */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(0,229,255,0.02)_0%,rgba(0,0,0,0)_60%)] opacity-80" />
      </div>

      {/* 1. SECURE HEADER */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 bg-[#050505]/75 backdrop-blur-[25px] h-[90px] flex items-center px-10">
        <div className="max-w-[1450px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-primary text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-left">
              <h2 className="font-heading font-extrabold text-lg leading-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Secure Checkout
              </h2>
              <p className="text-[10px] text-gray-400 font-number uppercase tracking-wider mt-0.5">
                256-bit SSL encrypted • PCI DSS certified
              </p>
            </div>
          </div>

          {/* Circular Countdown Timer */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-gray-500 uppercase font-extrabold tracking-widest hidden sm:inline">
              Session Expires In
            </span>
            <div className="relative w-12 h-12 flex items-center justify-center font-number font-bold text-xs">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.05)" strokeWidth="3" fill="transparent" />
                <circle 
                  cx="24" 
                  cy="24" 
                  r="20" 
                  stroke={timeLeft <= 60 ? "#EF4444" : timeLeft <= 300 ? "#F59E0B" : "#10B981"} 
                  strokeWidth="3" 
                  fill="transparent" 
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - timeLeft / 600)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <span className={`z-10 ${timeLeft <= 60 ? 'text-primary animate-pulse font-extrabold' : 'text-white'}`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Booking progress indicator */}
      <div className="relative z-10 mx-auto max-w-[1450px] px-10 pt-8">
        <BookingSteps current="payment" />
      </div>

      {/* Main Layout Grid */}
      <div className="max-w-[1450px] mx-auto px-10 mt-10 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
        
        {/* Left Column: Payment Options (Column 7) */}
        <div className="lg:col-span-7 space-y-8">

          {/* Smart AI payment recommendation */}
          <SmartPaymentRecommendation onUse={() => setActiveTab("UPI")} />

          {/* Split Payment / Digital Wallet Check */}
          <div className="glass-panel border border-white/5 p-6 rounded-3xl bg-black/40 flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Wallet className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-heading font-extrabold text-sm text-white">Split with Prestige Wallet</h4>
                <p className="text-xs text-gray-400 font-number">Available balance: ₹{walletBalance}</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={useWalletBalance}
                onChange={(e) => setUseWalletBalance(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-white/5 border border-white/10 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
            </label>
          </div>

          {/* Payment category selector tabs */}
          <div className="grid grid-cols-4 gap-2 bg-black/40 p-1 rounded-2xl border border-white/5">
            {[
              { id: "CARD", label: "Cards", icon: CreditCard },
              { id: "UPI", label: "UPI", icon: Smartphone },
              { id: "NET_BANKING", label: "Net Bank", icon: Globe },
              { id: "WALLETS", label: "Wallets", icon: Coins }
            ].map((tab) => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 rounded-xl text-[10px] uppercase font-bold tracking-wider transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                    active
                      ? "bg-white/5 border border-white/10 text-white"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Panel configurations */}
          <div className="glass-panel border border-white/5 p-8 rounded-3xl min-h-[320px] bg-black/40">
            
            {/* TAB 1: CREDIT / DEBIT CARD RENDER */}
            {activeTab === "CARD" && (
              <div className="space-y-8">
                
                {/* 3D Animated Card Preview */}
                <div className="perspective-1000 w-full max-w-[380px] aspect-[1.58/1] mx-auto">
                  <motion.div
                    animate={{ rotateY: cvvFocused ? 180 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full relative rounded-2xl border border-white/10 shadow-glass transform-style-preserve-3d"
                  >
                    {/* Front of card */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between bg-gradient-to-tr from-purple-950 via-zinc-950 to-black rounded-2xl backface-hidden">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Prestige Card</span>
                        <span className="text-xs font-bold text-white font-mono uppercase">{getCardType(cardNumber)}</span>
                      </div>
                      <div className="font-mono text-lg text-white tracking-widest text-center py-2">
                        {cardNumber || "•••• •••• •••• ••••"}
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-left space-y-0.5">
                          <span className="text-[8px] text-gray-500 uppercase block">Holder</span>
                          <span className="text-xs font-bold text-white uppercase font-mono">{cardHolder || "MEMBER NAME"}</span>
                        </div>
                        <div className="text-right space-y-0.5">
                          <span className="text-[8px] text-gray-500 uppercase block">Expiry</span>
                          <span className="text-xs font-bold text-white font-mono">{cardExpiry || "MM/YY"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Back of card */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between bg-gradient-to-br from-black via-zinc-950 to-purple-950 rounded-2xl backface-hidden [transform:rotateY(180deg)]">
                      <div className="w-full h-8 bg-black mt-2" />
                      <div className="flex justify-end items-center gap-3 pt-4">
                        <span className="text-[8px] text-gray-500 uppercase">CVV</span>
                        <div className="px-3 py-1 bg-white text-black font-mono font-bold text-xs rounded">
                          {cardCvv || "•••"}
                        </div>
                      </div>
                      <div className="text-[7px] text-gray-600 text-center uppercase tracking-wider">
                        Secure transaction authenticated by banking security partners
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Card input forms */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Card Number</label>
                    <input
                      type="text"
                      maxLength={16}
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/5 focus:border-primary text-sm text-white focus:outline-none"
                    />
                  </div>
                  
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Card Holder Name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/5 focus:border-primary text-sm text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Expiry Date</label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/5 focus:border-primary text-sm text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">CVV Code</label>
                    <input
                      type="password"
                      maxLength={3}
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                      onFocus={() => setCvvFocused(true)}
                      onBlur={() => setCvvFocused(false)}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/5 focus:border-primary text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: UPI PAYMENTS */}
            {activeTab === "UPI" && (
              <div className="space-y-6">
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowUpiQr(false)}
                    className={`flex-1 py-3.5 rounded-xl border text-xs font-extrabold uppercase transition-all cursor-pointer ${
                      !showUpiQr
                        ? "bg-white/5 border-white/10 text-white"
                        : "bg-transparent border-white/5 text-gray-500"
                    }`}
                  >
                    UPI ID
                  </button>
                  <button
                    onClick={() => setShowUpiQr(true)}
                    className={`flex-1 py-3.5 rounded-xl border text-xs font-extrabold uppercase transition-all cursor-pointer ${
                      showUpiQr
                        ? "bg-white/5 border-white/10 text-white"
                        : "bg-transparent border-white/5 text-gray-500"
                    }`}
                  >
                    Scan QR
                  </button>
                </div>

                {!showUpiQr ? (
                  <div className="space-y-3">
                    <label className="text-[10px] text-gray-500 uppercase font-bold block">Enter VPA / UPI ID</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="username@okaxis"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl bg-black/60 border border-white/5 focus:border-primary text-sm text-white focus:outline-none"
                      />
                      <button
                        onClick={() => toast.success("UPI ID verified successfully!")}
                        className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary text-xs font-bold transition-all cursor-pointer"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-4 pt-4">
                    <div className="p-4 bg-white rounded-2xl relative">
                      <QrCode className="w-36 h-36 text-black" />
                      {/* Laser scanner animation sweep line */}
                      <div className="absolute top-4 left-4 right-4 h-[2px] bg-primary animate-bounce" />
                    </div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                      Scan QR code with any BHIM UPI enabled app to pay
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: NET BANKING */}
            {activeTab === "NET_BANKING" && (
              <div className="space-y-6">
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Popular Banks</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak", "Yes Bank"].map((bank) => (
                    <button
                      key={bank}
                      onClick={() => toast.success(`${bank} NetBanking selected.`)}
                      className="p-4 rounded-xl border border-white/5 bg-white/5 hover:border-primary text-left text-xs font-bold text-white transition-all cursor-pointer"
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: WALLETS */}
            {activeTab === "WALLETS" && (
              <div className="space-y-4">
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Digital Wallets</span>
                {[
                  { name: "Paytm Wallet", desc: "Pay instantly using stored Paytm cash" },
                  { name: "Amazon Pay", desc: "Quick payments via Amazon balance" },
                  { name: "PhonePe Wallet", desc: "Instant phonepe wallet checkout" }
                ].map((w) => (
                  <button
                    key={w.name}
                    onClick={() => toast.success(`${w.name} linked successfully.`)}
                    className="w-full p-4 rounded-xl border border-white/5 bg-white/5 hover:border-primary text-left transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="space-y-0.5 text-left">
                      <span className="font-heading font-extrabold text-xs text-white block">{w.name}</span>
                      <span className="text-[10px] text-gray-500 leading-normal">{w.desc}</span>
                    </div>
                    <span className="text-[10px] text-accent font-bold uppercase">Link Wallet</span>
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* Security & trust */}
          <PaymentSecurityPanel />
        </div>

        {/* Right Column: Sticky Summary (Column 5) */}
        <div className="lg:col-span-5 lg:sticky lg:top-[120px] self-start">
          <div className="glass-panel border border-white/10 p-6 rounded-3xl space-y-6 bg-gradient-to-tr from-black via-zinc-950/80 to-black shadow-glass text-left">
            <div>
              <h3 className="font-heading font-extrabold text-lg">Booking Summary</h3>
              <p className="text-gray-400 text-xs mt-1">Verify payment summary and complete transaction</p>
            </div>

            {/* Movie details */}
            <div className="flex gap-4 items-center border-b border-white/5 pb-4">
              <img src={movie.posterUrl} alt={movie.title} className="w-12 h-18 object-cover rounded-md border border-white/10" />
              <div className="space-y-0.5">
                <h4 className="font-heading font-extrabold text-sm text-white line-clamp-1">{movie.title}</h4>
                <p className="text-[10px] text-gray-500 font-semibold uppercase">Rating: {movie.ageRestriction}</p>
              </div>
            </div>

            {/* Price list details */}
            <div className="space-y-2.5 text-xs font-number border-b border-white/5 pb-4">
              <div className="flex justify-between text-gray-400">
                <span>Tickets Subtotal</span>
                <span>₹{ticketsSubtotal}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Convenience Fees</span>
                <span>₹{convenienceFee}</span>
              </div>
              {foodSubtotal > 0 && (
                <div className="flex justify-between text-gray-400">
                  <span>Food & Beverages</span>
                  <span>₹{foodSubtotal}</span>
                </div>
              )}
              {deliveryCharge > 0 && (
                <div className="flex justify-between text-gray-400">
                  <span>Delivery Charge</span>
                  <span>₹{deliveryCharge}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400 text-[10px] opacity-75">
                <span>GST Tax (18%)</span>
                <span>₹{taxTotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Coupon Discount</span>
                  <span>- ₹{discount}</span>
                </div>
              )}

              {walletDeduction > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Wallet Split Deduction</span>
                  <span>- ₹{walletDeduction}</span>
                </div>
              )}
            </div>

            {/* Grand Total & CTA Proceed */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Amount Payable</span>
                <span className="text-2xl font-bold font-number text-accent">₹{finalTotal}</span>
              </div>

              <button
                onClick={startCheckout}
                disabled={paymentLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-xs uppercase tracking-widest shadow-redGlow hover:scale-102 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {paymentLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Complete Secure Payment
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Full-screen payment processing sequence */}
      <PaymentProcessingOverlay active={processingActive} onComplete={handleProcessingComplete} />

      {/* 4. SANDBOX CHECKOUT GATEWAY SIMULATOR MODAL */}
      <AnimatePresence>
        {showSimulator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-[32px] glass-panel border border-white/10 p-8 space-y-6 bg-gradient-to-tr from-black to-zinc-950 shadow-glass text-center relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="w-14 h-14 bg-accent/10 border border-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-extrabold text-lg text-white">Payment Simulator</h3>
                <p className="text-xs text-gray-400 leading-normal max-w-xs mx-auto">
                  Pre-auth transaction check for booking reference: <br />
                  <span className="font-mono text-white text-[10px] uppercase font-bold mt-1 block">{pendingBookingId}</span>
                </p>
              </div>

              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl font-number text-left space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Merchant</span>
                  <span className="font-bold text-white">CineVerse Pro</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Total Amount</span>
                  <span className="font-bold text-accent">₹{finalTotal}</span>
                </div>
              </div>

              {mockStatus === "idle" && (
                <div className="flex gap-4">
                  <button
                    onClick={handleMockPaymentSuccess}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-blueGlow cursor-pointer"
                  >
                    Simulate Success
                  </button>
                  <button
                    onClick={handleMockPaymentFail}
                    className="flex-1 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase tracking-wider shadow-redGlow cursor-pointer"
                  >
                    Simulate Fail
                  </button>
                </div>
              )}

              {mockStatus === "verifying" && (
                <div className="space-y-3 py-2">
                  <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />
                  <p className="text-xs text-gray-400">Verifying secure signature hash with bank...</p>
                </div>
              )}

              {mockStatus === "success" && (
                <div className="space-y-3 py-2 text-emerald-400 animate-pulse">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                  <p className="text-xs font-bold uppercase tracking-wider">Transaction Approved successfully!</p>
                </div>
              )}

              {mockStatus === "failed" && (
                <div className="space-y-3 py-2 text-primary animate-pulse">
                  <ShieldAlert className="w-12 h-12 text-primary mx-auto" />
                  <p className="text-xs font-bold uppercase tracking-wider">Transaction Declined.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Payment;
