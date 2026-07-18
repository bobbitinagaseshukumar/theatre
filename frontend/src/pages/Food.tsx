import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Plus, 
  Minus, 
  CreditCard,
  Search,
  Truck,
  Sparkles,
  X,
  Calendar,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import type { RootState } from "../redux/store";
import { addFoodItem, removeFoodItem, applyCoupon, removeCoupon } from "../redux/bookingSlice";
import API from "../api/axios";
import BookingSteps from "../components/booking/BookingSteps";
import LiveKitchenStatus from "../components/food/LiveKitchenStatus";

const Food: React.FC = () => {
  const { movie, showtime, selectedSeats, foodItems, appliedCoupon } = useSelector(
    (state: RootState) => state.booking
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // states
  const [foods, setFoods] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Popcorn");
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryOption, setDeliveryOption] = useState<"PICKUP" | "SEAT_DELIVERY">("PICKUP");

  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // AI recommendations state
  const [recommendations, setRecommendations] = useState<any[]>([]);

  // Enterprise Coupon Engine states
  const [showCouponsModal, setShowCouponsModal] = useState(false);
  const [couponsList, setCouponsList] = useState<any[]>([]);
  const [couponSearchText, setCouponSearchText] = useState("");

  // Safety navigation check
  useEffect(() => {
    if (!movie || !showtime || selectedSeats.length === 0) {
      toast.error("Please complete your seat selection.");
      navigate("/");
    }
  }, [movie, showtime, selectedSeats, navigate]);

  // Load food categories, items, and AI recommendations
  useEffect(() => {
    const fetchSnacksData = async () => {
      try {
        const catRes = await API.get("/food/categories");
        setCategories(catRes.data);
      } catch (err) {
        setCategories(["Popcorn", "Drinks", "Combos", "Pizza", "Nachos", "Ice Cream", "Coffee & Tea"]);
      }

      try {
        const itemsRes = await API.get("/food/items");
        setFoods(itemsRes.data);
      } catch (err) {
        setFoods([
          {
            id: "f-1",
            name: "Truffle Butter Popcorn (L)",
            description: "Infused with premium white truffle oil and organic sea salt.",
            price: 240,
            offerPrice: 199,
            calories: 380,
            prepTime: "2 Mins",
            rating: 4.8,
            badge: "Best Seller",
            category: "Popcorn",
            imageUrl: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=400&auto=format&fit=crop"
          },
          {
            id: "f-2",
            name: "Caramel Gold Crunch (L)",
            description: "Crispy popcorn coated in luxury brown sugar caramel sauce.",
            price: 280,
            offerPrice: 240,
            calories: 420,
            prepTime: "3 Mins",
            rating: 4.9,
            badge: "Chef Special",
            category: "Popcorn",
            imageUrl: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=400&auto=format&fit=crop"
          },
          {
            id: "f-3",
            name: "Loaded Avocado Nachos",
            description: "Crispy corn tortillas topped with fresh guacamole, warm cheddar, and pickled jalapenos.",
            price: 320,
            offerPrice: 280,
            calories: 550,
            prepTime: "4 Mins",
            rating: 4.7,
            badge: "Most Ordered",
            category: "Nachos",
            imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=400&auto=format&fit=crop"
          },
          {
            id: "f-4",
            name: "Fountain Pepsi Luxe (XL)",
            description: "Extra cold fountain sparkling soda served with lemon slices.",
            price: 150,
            offerPrice: 120,
            calories: 180,
            prepTime: "1 Min",
            rating: 4.6,
            badge: "Popular",
            category: "Drinks",
            imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400&auto=format&fit=crop"
          },
          {
            id: "f-5",
            name: "Wild Mushroom Flatbread Pizza",
            description: "Stone-baked thin crust flatbread pizza topped with truffle glaze.",
            price: 450,
            offerPrice: 380,
            calories: 680,
            prepTime: "7 Mins",
            rating: 4.9,
            badge: "New",
            category: "Pizza",
            imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop"
          }
        ]);
      }

      try {
        const recRes = await API.get("/recommendation-engine/recommendations", {
          params: {
            movieId: movie?.id,
            showTime: showtime?.startTime,
            seatCategory: selectedSeats[0]?.type,
            groupSize: selectedSeats.length
          }
        });
        setRecommendations(recRes.data);
      } catch (err) {
        setRecommendations([
          {
            id: "f-rec-1",
            name: "CineVerse Movie Combo Saver",
            description: "1 Large Popcorn + 1 Medium Drink of choice.",
            price: 320,
            offerPrice: 280,
            badge: "Top Pick",
            whyMsg: "Recommended based on Action/Sci-Fi genre profile.",
            rating: 4.7,
            prepTime: "2 Mins",
            imageUrl: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=400&auto=format&fit=crop"
          }
        ]);
      }
    };
    fetchSnacksData();
  }, [movie, showtime, selectedSeats]);

  if (!movie || !showtime) return null;

  // Pricing math
  const ticketsSubtotal = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
  const convenienceFee = selectedSeats.length * 30; 
  const foodSubtotal = foodItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryCharge = deliveryOption === "SEAT_DELIVERY" ? 50 : 0;

  const subtotal = ticketsSubtotal + convenienceFee + foodSubtotal + deliveryCharge;
  const taxTotal = Math.round(subtotal * 0.18); 

  // Coupon Discount
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.isPercentage) {
      discount = parseFloat((subtotal * (appliedCoupon.discountValue / 100)).toFixed(2));
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  const finalTotal = parseFloat((subtotal + taxTotal - discount).toFixed(2));

  // Validate entered coupon code
  const handleApplyCoupon = async (codeToApply?: string) => {
    const targetCode = codeToApply || couponCode;
    if (!targetCode) return;
    setIsApplyingCoupon(true);
    try {
      const response = await API.post("/coupon-engine/validate", { code: targetCode, amount: subtotal });
      dispatch(applyCoupon(response.data.coupon));
      toast.success(`Coupon "${targetCode}" applied successfully!`);
      setShowCouponsModal(false);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Invalid or expired coupon code.";
      toast.error(errorMsg);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Open eligible coupons list modal
  const handleOpenCouponsList = async () => {
    setShowCouponsModal(true);
    try {
      const couponsRes = await API.get("/coupon-engine/eligible", { params: { amount: subtotal } });
      setCouponsList(couponsRes.data);
    } catch (err) {
      // Mock Fallbacks
      setCouponsList([
        {
          id: "cp-gold",
          code: "CINEGOLD",
          name: "Gold Class Privilege",
          discountValue: 150,
          isPercentage: false,
          minOrder: 500,
          badge: "Luxe Tier",
          description: "Get flat ₹150 off on gourmet snacks & tickets above ₹500.",
          expiryDate: "2026-12-31",
          terms: "Valid on all NOW_SHOWING movie ticket purchases.",
          isEligible: subtotal >= 500,
          shortage: subtotal < 500 ? 500 - subtotal : 0
        },
        {
          id: "cp-festive",
          code: "FESTIVE40",
          name: "Festival Carnival Promo",
          discountValue: 40,
          isPercentage: true,
          minOrder: 800,
          maxDiscount: 400,
          badge: "Carnival Special",
          description: "Enjoy 40% discount up to ₹400 on bookings above ₹800.",
          expiryDate: "2026-08-15",
          terms: "Single use code per registered customer.",
          isEligible: subtotal >= 800,
          shortage: subtotal < 800 ? 800 - subtotal : 0
        },
        {
          id: "cp-popcorn",
          code: "POPCORN50",
          name: "Movie Snack Special",
          discountValue: 50,
          isPercentage: false,
          minOrder: 300,
          badge: "Snack Feast",
          description: "Flat ₹50 off on select popcorn and beverages.",
          expiryDate: "2026-10-30",
          terms: "Requires at least 1 Popcorn item in cart.",
          isEligible: subtotal >= 300,
          shortage: subtotal < 300 ? 300 - subtotal : 0
        }
      ]);
    }
  };

  const handleProceedPayment = () => {
    navigate("/payment");
  };

  // Add recommendation click/conversion logging
  const handleAddRec = async (rec: any) => {
    dispatch(addFoodItem({
      id: rec.id,
      name: rec.name,
      price: rec.offerPrice,
      imageUrl: rec.imageUrl
    }));

    try {
      await API.post("/recommendation-engine/recommendation-click", { id: rec.id });
      await API.post("/recommendation-engine/recommendation-conversion", { id: rec.id });
    } catch (err) {
      // safe logging fallback
    }
    toast.success(`Added recommended item: ${rec.name}`);
  };

  const filteredFoods = foods.filter((f) => {
    const matchesCat = f.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredCoupons = couponsList.filter((c) => 
    c.code.toLowerCase().includes(couponSearchText.toLowerCase()) ||
    c.name.toLowerCase().includes(couponSearchText.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-[#050505] text-white pb-36 overflow-hidden">
      
      {/* Concession backdrop */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-5%] w-[450px] h-[450px] bg-luxuryGold/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[-5%] w-[450px] h-[450px] bg-primary/5 blur-[120px] animate-pulse" />
      </div>

      {/* 1. STICKY HEADER */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 bg-[#050505]/75 backdrop-blur-[25px] h-[90px] flex items-center px-10">
        <div className="max-w-[1450px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate("/booking")}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-primary text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-left space-y-0.5">
              <h2 className="font-heading font-extrabold text-lg leading-tight">Gourmet Treats</h2>
              <p className="text-xs text-gray-400 font-number">
                Seats: {selectedSeats.map(s => s.seatNumber).join(", ")}
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full max-w-[320px] hidden md:block">
            <input
              type="text"
              placeholder="Search gourmet popcorn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/5 border border-white/10 focus:border-primary text-xs text-white placeholder-gray-500 focus:outline-none"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
          </div>
        </div>
      </header>

      {/* Booking progress indicator */}
      <div className="relative z-10 mx-auto max-w-[1450px] px-10 pt-8">
        <BookingSteps current="food" />
      </div>

      {/* Main layout */}
      <div className="max-w-[1450px] mx-auto px-10 mt-10 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
        
        {/* Left Column (Column 8) */}
        <div className="lg:col-span-8 space-y-8">

          {/* Live kitchen status */}
          <LiveKitchenStatus load="BUSY" etaMinutes={10} />

          {/* AI Recommended Section */}
          {recommendations.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-luxuryGold">
                <Sparkles className="w-5 h-5 animate-pulse text-luxuryGold" />
                <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider">AI Recommended Compositions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((rec) => {
                  const cartItem = foodItems.find((item) => item.id === rec.id);
                  const qty = cartItem ? cartItem.quantity : 0;
                  return (
                    <motion.div
                      key={rec.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-5 rounded-2xl border border-white/10 bg-gradient-to-br from-black/80 to-zinc-950/80 shadow-glass flex gap-4 items-center justify-between"
                    >
                      <div className="flex gap-4 items-center flex-1">
                        <img src={rec.imageUrl} alt={rec.name} className="w-16 h-16 object-contain rounded-lg bg-black/40 p-1" />
                        <div className="space-y-1 text-left">
                          <span className="text-[9px] uppercase font-bold text-luxuryGold px-2 py-0.5 bg-luxuryGold/10 rounded-full border border-luxuryGold/20">
                            {rec.badge}
                          </span>
                          <h4 className="font-heading font-extrabold text-xs text-white line-clamp-1">{rec.name}</h4>
                          <p className="text-[10px] text-gray-500 line-clamp-1">{rec.description}</p>
                          <p className="text-[9px] text-accent font-semibold">{rec.whyMsg}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-sm font-bold font-number text-accent">₹{rec.offerPrice}</span>
                        {qty > 0 ? (
                          <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-full px-2 py-0.5">
                            <button onClick={() => dispatch(removeFoodItem(rec.id))} className="text-[10px] text-gray-400 hover:text-primary"><Minus className="w-2.5 h-2.5" /></button>
                            <span className="font-number font-bold text-xs">{qty}</span>
                            <button onClick={() => handleAddRec(rec)} className="text-[10px] text-gray-400 hover:text-accent"><Plus className="w-2.5 h-2.5" /></button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddRec(rec)}
                            className="px-3 py-1 rounded-full bg-primary hover:bg-primary-hover text-white text-[10px] uppercase font-bold transition-all cursor-pointer"
                          >
                            Add +
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Horizontal Categories Menu */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none border-b border-white/5">
            {categories.map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-3 rounded-full border text-xs font-heading font-extrabold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? "bg-primary border-primary text-white shadow-redGlow"
                      : "bg-white/5 border-white/5 text-gray-400 hover:border-white/10"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Foods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredFoods.length > 0 ? (
              filteredFoods.map((food) => {
                const cartItem = foodItems.find((item) => item.id === food.id);
                const qty = cartItem ? cartItem.quantity : 0;

                return (
                  <motion.div
                    key={food.id}
                    whileHover={{ y: -6 }}
                    className="p-5 rounded-[28px] border border-white/5 bg-white/5 backdrop-blur-[22px] flex flex-col justify-between h-[420px] transition-all relative overflow-hidden"
                  >
                    {/* Badge */}
                    {food.badge && (
                      <span className="absolute top-4 left-4 px-2.5 py-0.5 rounded bg-luxuryGold/10 border border-luxuryGold/20 text-[9px] text-luxuryGold font-extrabold uppercase tracking-wide">
                        {food.badge}
                      </span>
                    )}

                    {/* Image */}
                    <div className="w-full h-44 flex items-center justify-center pt-4">
                      <img 
                        src={food.imageUrl} 
                        alt={food.name} 
                        className="h-full object-contain rounded-2xl filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform duration-500" 
                      />
                    </div>

                    {/* Body */}
                    <div className="space-y-2 mt-4">
                      <h4 className="font-heading font-extrabold text-sm text-white line-clamp-1">{food.name}</h4>
                      <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2">{food.description}</p>
                      
                      <div className="flex gap-4 text-[10px] text-gray-400 font-number pt-1">
                        <span>{food.prepTime}</span>
                        <span>•</span>
                        <span>{food.calories} Calories</span>
                      </div>
                    </div>

                    {/* Price and Add Control */}
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 line-through font-number">₹{food.price}</span>
                        <span className="text-base font-bold font-number text-accent">₹{food.offerPrice}</span>
                      </div>

                      {qty > 0 ? (
                        <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-full px-3 py-1">
                          <button
                            onClick={() => dispatch(removeFoodItem(food.id))}
                            className="text-gray-400 hover:text-primary transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-number font-bold text-xs w-4 text-center">{qty}</span>
                          <button
                            onClick={() => dispatch(addFoodItem({ ...food, price: food.offerPrice }))}
                            className="text-gray-400 hover:text-accent transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => dispatch(addFoodItem({ ...food, price: food.offerPrice }))}
                          className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-xs uppercase tracking-wider shadow-redGlow hover:scale-105 transition-all cursor-pointer"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500">
                No gourmet items found in this category.
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Live Checkout Cart (Column 4) */}
        <div className="lg:col-span-4 lg:sticky lg:top-[120px] self-start">
          <div className="glass-panel border border-white/10 p-6 rounded-3xl space-y-6 bg-gradient-to-tr from-black via-zinc-950/80 to-black shadow-glass">
            <div>
              <h3 className="font-heading font-extrabold text-lg">Booking Summary</h3>
              <p className="text-gray-400 text-xs mt-1">Review ticket quantities and charges</p>
            </div>

            {/* Service Delivery Modes */}
            <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setDeliveryOption("PICKUP")}
                className={`py-2 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all ${
                  deliveryOption === "PICKUP"
                    ? "bg-white/5 text-white"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                Counter Pickup
              </button>
              <button
                onClick={() => setDeliveryOption("SEAT_DELIVERY")}
                className={`py-2 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  deliveryOption === "SEAT_DELIVERY"
                    ? "bg-primary text-white shadow-redGlow"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                Seat Delivery
              </button>
            </div>

            {/* Tickets & Food Cart listing */}
            <div className="space-y-4 text-xs">
              <div className="border-b border-white/5 pb-3">
                <h4 className="font-bold text-white text-sm line-clamp-1">{movie.title}</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">{showtime.screenName} • {showtime.startTime}</p>
                <p className="text-[10px] text-gray-400 mt-1">Seats: <span className="text-white font-bold">{selectedSeats.map(s => s.seatNumber).join(", ")}</span></p>
              </div>

              {/* Food Items List */}
              {foodItems.length > 0 && (
                <div className="space-y-3 border-b border-white/5 pb-3">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">Gourmet snacks</span>
                  {foodItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-[11px]">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-white">{item.name}</span>
                        <span className="text-[9px] text-gray-500 block">Qty: {item.quantity}</span>
                      </div>
                      <span className="font-number font-bold text-white">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bill calculator */}
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
                  <span>Seat Delivery Charge</span>
                  <span>₹{deliveryCharge}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400 text-[10px] opacity-75">
                <span>GST Tax (18%)</span>
                <span>₹{taxTotal}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-primary font-semibold border-t border-dashed border-white/10 pt-2 pb-1">
                  <span className="flex items-center gap-1">
                    Discount ({appliedCoupon.code})
                    <button 
                      onClick={() => dispatch(removeCoupon())}
                      className="text-[10px] text-gray-500 hover:text-white"
                    >
                      (Remove)
                    </button>
                  </span>
                  <span>- ₹{discount}</span>
                </div>
              )}
            </div>

            {/* Promo Codes */}
            <div className="pt-2 space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
                  Promo Code
                </label>
                <button
                  onClick={handleOpenCouponsList}
                  className="text-[10px] text-accent hover:underline font-bold uppercase cursor-pointer"
                >
                  View Offers
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. CINEGOLD"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-primary uppercase"
                />
                <button
                  onClick={() => handleApplyCoupon()}
                  disabled={isApplyingCoupon || !couponCode}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Grand Total & CTA Proceed */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Amount Payable</span>
                <span className="text-2xl font-bold font-number text-accent">₹{finalTotal}</span>
              </div>

              <button
                onClick={handleProceedPayment}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-xs uppercase tracking-widest shadow-redGlow hover:scale-102 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Proceed to Payment
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* 5. COUPONS & OFFERS VOUCHERS MODAL */}
      <AnimatePresence>
        {showCouponsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl rounded-[32px] glass-panel border border-white/10 p-8 space-y-6 bg-gradient-to-tr from-black to-zinc-950 shadow-glass text-left relative overflow-hidden"
            >
              <button
                onClick={() => setShowCouponsModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <h3 className="font-heading font-extrabold text-2xl text-white">Coupons & Offers</h3>
                <p className="text-xs text-gray-400">Apply premium vouchers to maximize your savings</p>
              </div>

              {/* Coupon code filter input inside modal */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search available vouchers..."
                  value={couponSearchText}
                  onChange={(e) => setCouponSearchText(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary text-xs text-white placeholder-gray-500 focus:outline-none"
                />
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
              </div>

              {/* Vouchers list */}
              <div className="max-h-[380px] overflow-y-auto space-y-4 pr-2 scrollbar-thin">
                {filteredCoupons.length > 0 ? (
                  filteredCoupons.map((c) => {
                    const progressVal = Math.min((subtotal / c.minOrder) * 100, 100);
                    return (
                      <div
                        key={c.id}
                        className={`p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                          c.isEligible 
                            ? "bg-white/5 border-white/10 hover:border-luxuryGold/30" 
                            : "bg-neutral-950 border-neutral-900 opacity-60"
                        }`}
                      >
                        <div className="space-y-2 flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded bg-luxuryGold/10 border border-luxuryGold/20 text-[9px] font-bold text-luxuryGold uppercase">
                              {c.badge}
                            </span>
                            <span className="font-heading font-extrabold text-sm text-white">{c.name}</span>
                          </div>
                          
                          <p className="text-[11px] text-gray-400 leading-relaxed">{c.description}</p>
                          
                          <div className="flex items-center gap-4 text-[10px] text-gray-500 pt-1 font-number">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Expiry: {c.expiryDate}</span>
                            <span>Min Order: ₹{c.minOrder}</span>
                          </div>

                          {/* Progress bar to unlock coupon if not eligible */}
                          {!c.isEligible && (
                            <div className="space-y-1.5 pt-2">
                              <div className="flex justify-between text-[9px] font-semibold text-amber-500">
                                <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Add ₹{c.shortage} more to unlock this coupon</span>
                                <span>{Math.round(progressVal)}%</span>
                              </div>
                              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${progressVal}%` }} />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0 w-full md:w-auto">
                          <div className="px-4 py-2 border border-dashed border-white/20 bg-white/5 rounded-xl font-mono text-xs font-bold text-white uppercase tracking-widest text-center select-all">
                            {c.code}
                          </div>
                          {c.isEligible ? (
                            <button
                              onClick={() => handleApplyCoupon(c.code)}
                              className="w-full md:w-auto px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer"
                            >
                              Apply Coupon
                            </button>
                          ) : (
                            <button
                              disabled
                              className="w-full md:w-auto px-4 py-1.5 rounded-lg bg-neutral-900 border border-white/5 text-gray-600 text-[10px] uppercase font-bold tracking-wider cursor-not-allowed"
                            >
                              Locked
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No active discount vouchers match your query.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Food;
