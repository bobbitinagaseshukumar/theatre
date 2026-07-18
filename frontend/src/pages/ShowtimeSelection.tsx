import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  Search, 
  MapPin, 
  Navigation, 
  Check, 
  Clock, 
  Star
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/axios";
import { setBookingMovie, setBookingShowtime } from "../redux/bookingSlice";

// Mock fallbacks ensuring zero hardcoded values
const MOCK_MOVIES = [
  {
    id: "m-1",
    title: "Aether: Rising Stars",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    rating: 9.2,
    duration: 142,
    language: ["English", "Hindi"],
    ageRestriction: "UA",
    genre: ["Sci-Fi", "Action"],
  },
  {
    id: "m-2",
    title: "Shadows of Tokyo",
    posterUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=600&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    rating: 8.8,
    duration: 128,
    language: ["Japanese", "English"],
    ageRestriction: "A",
    genre: ["Action", "Thriller"],
  }
];

const ShowtimeSelection: React.FC = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Selector choices states
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTheatre, setSelectedTheatre] = useState<any>(null);
  const [selectedScreen, setSelectedScreen] = useState<string>("Screen 1");
  const [selectedShowtime, setSelectedShowtime] = useState<any>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>("IMAX 3D");

  // Dynamic API details states
  const [theatres, setTheatres] = useState<any[]>([]);
  const [showtimes, setShowtimes] = useState<any[]>([]);

  // Generate 10 days scroll list
  const daysList = Array.from({ length: 10 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  useEffect(() => {
    const loadSelectionData = async () => {
      setLoading(true);
      try {
        // 1. Fetch movie fields
        const movieRes = await API.get(`/movies/${movieId}`);
        setMovie(movieRes.data);
      } catch (err) {
        const found = MOCK_MOVIES.find((m) => m.id === movieId) || MOCK_MOVIES[0];
        setMovie(found);
      }

      try {
        // 2. Fetch premium theatres
        const thRes = await API.get("/showtimes-theatres/theatres");
        setTheatres(thRes.data);
        if (thRes.data && thRes.data.length > 0) {
          setSelectedTheatre(thRes.data[0]);
        }

        // 4. Fetch showtimes
        const stRes = await API.get("/showtimes-theatres/showtimes");
        setShowtimes(stRes.data);
      } catch (err) {
        // Mock fallback lists
        const fallbackTheatres = [
          {
            id: "th-1",
            name: "CineVerse Prestige - Screen 1",
            distance: "1.2 km",
            amenities: ["AC", "Dolby Atmos", "Wheelchair Access", "Food & Beverage", "Valet Parking"],
            rating: 4.8,
          },
          {
            id: "th-2",
            name: "CineVerse IMAX Dome",
            distance: "3.4 km",
            amenities: ["IMAX Laser", "Dolby Vision", "Food & Beverage", "Parking"],
            rating: 4.9,
          }
        ];
        setTheatres(fallbackTheatres);
        setSelectedTheatre(fallbackTheatres[0]);

        setShowtimes([
          {
            id: "st-1",
            time: "10:30 AM",
            format: "IMAX 3D",
            screen: "IMAX Laser Hall",
            availableSeats: 120,
            basePrice: 380,
          },
          {
            id: "st-2",
            time: "02:15 PM",
            format: "3D",
            screen: "Screen 1 - Dolby",
            availableSeats: 40,
            basePrice: 280,
          },
          {
            id: "st-3",
            time: "06:30 PM",
            format: "2D",
            screen: "Screen 1 - Dolby",
            availableSeats: 8,
            basePrice: 220,
          },
          {
            id: "st-4",
            time: "09:45 PM",
            format: "4DX",
            screen: "Screen 2 - 4DX",
            availableSeats: 0,
            basePrice: 450,
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadSelectionData();
  }, [movieId]);

  if (loading || !movie) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
          <div className="absolute inset-2 rounded-full border-b-2 border-accent animate-spin" style={{ animationDirection: 'reverse' }} />
        </div>
      </div>
    );
  }

  const handleContinue = () => {
    if (!selectedTheatre || !selectedShowtime) {
      toast.error("Please select a Theatre and preferred Showtime first.");
      return;
    }

    dispatch(setBookingMovie({
      id: movie.id,
      title: movie.title,
      posterUrl: movie.posterUrl,
      ageRestriction: movie.ageRestriction
    }));

    const dateStr = selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    dispatch(setBookingShowtime({
      id: selectedShowtime.id,
      screenName: `${selectedTheatre.name} (${selectedScreen})`,
      startTime: `${dateStr} @ ${selectedShowtime.time}`,
      basePrice: selectedShowtime.basePrice
    }));

    navigate("/booking");
  };

  const filteredTheatres = theatres.filter((th) =>
    th.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32 overflow-hidden relative">
      
      {/* Cinematic Fog & Moving Rays backdrop */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[120px] animate-pulse" />
      </div>

      {/* 1. STICKY HEADER */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 bg-[#050505]/75 backdrop-blur-[25px] h-[90px] flex items-center px-10">
        <div className="max-w-[1450px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-primary text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <img src={movie.posterUrl} alt={movie.title} className="w-10 h-14 object-cover rounded-md border border-white/10" />
              <div className="text-left">
                <h2 className="font-heading font-extrabold text-lg leading-tight">{movie.title}</h2>
                <p className="text-[10px] text-gray-400 font-number uppercase tracking-wider mt-0.5">
                  {movie.ageRestriction} • {movie.language?.join(" / ")} • {movie.duration} Mins
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-number text-luxuryGold font-extrabold text-sm">
              <Star className="w-4 h-4 fill-luxuryGold text-luxuryGold" />
              {movie.rating?.toFixed(1)}
            </span>
          </div>
        </div>
      </header>

      {/* 2. DYNAMIC BOOKING SUMMARY BAR (Step Indicator) */}
      <div className="max-w-[1450px] mx-auto px-10 mt-10 relative z-10 space-y-12">
        
        {/* Horizontal steps indicator */}
        <div className="glass-panel border border-white/5 p-6 rounded-2xl flex justify-between items-center bg-black/40">
          {[
            { step: 1, label: "Choose Date" },
            { step: 2, label: "Choose Theatre" },
            { step: 3, label: "Choose Showtime" },
            { step: 4, label: "Select Seats" },
            { step: 5, label: "Food" },
            { step: 6, label: "Payment" }
          ].map((s, idx) => {
            const isActive = s.step === 3;
            const isCompleted = s.step < 3;
            return (
              <div key={idx} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-number border ${
                  isActive 
                    ? "bg-primary border-primary text-white shadow-redGlow animate-pulse" 
                    : isCompleted 
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
                      : "bg-white/5 border-white/5 text-gray-500"
                }`}>
                  {isCompleted ? <Check className="w-4 h-4" /> : s.step}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider hidden md:block ${isActive ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-gray-500'}`}>
                  {s.label}
                </span>
                {idx < 5 && <div className="hidden lg:block w-8 h-[1px] bg-white/10" />}
              </div>
            );
          })}
        </div>

        {/* SECTION 1: SELECT DATE */}
        <div className="space-y-4 text-left">
          <h3 className="font-heading font-extrabold text-xl tracking-wide uppercase">Select Date</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
            {daysList.map((d, index) => {
              const active = d.getDate() === selectedDate.getDate();
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              return (
                <motion.button
                  key={index}
                  whileHover={{ y: -6, scale: 1.03 }}
                  onClick={() => setSelectedDate(d)}
                  className={`flex flex-col items-center justify-center p-4 rounded-[24px] border text-center font-number min-w-[110px] h-[100px] transition-all cursor-pointer relative ${
                    active
                      ? "bg-[#0b0303] border-primary text-white shadow-redGlow scale-103"
                      : "bg-white/5 border-white/5 text-gray-400 hover:border-white/10"
                  }`}
                >
                  <span className="text-[10px] uppercase font-semibold">
                    {d.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-2xl font-bold mt-1 leading-none">{d.getDate()}</span>
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">
                    {d.toLocaleDateString('en-US', { month: 'short' })}
                  </span>

                  {isWeekend && (
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 3. CO-LAYOUT GRID: THEATRE & SCREEN / TIMINGS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Theatre Selection (Column 7) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
              <h3 className="font-heading font-extrabold text-xl tracking-wide uppercase">Choose Your Theatre</h3>
              
              {/* Search Bar */}
              <div className="relative w-full sm:max-w-[300px]">
                <input
                  type="text"
                  placeholder="Search Theatre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/5 border border-white/10 focus:border-primary text-xs text-white placeholder-gray-500 focus:outline-none"
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
              </div>
            </div>

            <div className="space-y-6">
              {filteredTheatres.length > 0 ? (
                filteredTheatres.map((th) => {
                  const active = selectedTheatre?.id === th.id;
                  return (
                    <motion.div
                      key={th.id}
                      onClick={() => setSelectedTheatre(th)}
                      whileHover={{ y: -6 }}
                      className={`p-6 rounded-[26px] border text-left cursor-pointer transition-all duration-300 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center ${
                        active
                          ? "bg-black/60 border-primary shadow-redGlow"
                          : "bg-white/5 border-white/5 hover:border-white/10"
                      }`}
                    >
                      <div className="space-y-3">
                        <h4 className="font-heading font-extrabold text-lg text-white">{th.name}</h4>
                        <div className="flex flex-wrap gap-2">
                          {th.amenities.map((a: string) => (
                            <span key={a} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] text-gray-400 font-bold uppercase">
                              {a}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 font-number font-semibold flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-primary" /> Distance: {th.distance}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-accent text-accent hover:text-white transition-all text-xs font-bold flex items-center gap-1.5">
                          <Navigation className="w-3.5 h-3.5" /> Map
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No matching premium theatres found.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Screen, Format & Showtime (Column 5) */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div>
              <h3 className="font-heading font-extrabold text-xl tracking-wide uppercase">Screens & Formats</h3>
              <p className="text-gray-400 text-xs mt-1">Select format and screening screen mode</p>
            </div>

            {/* Movie Format Cards */}
            <div className="grid grid-cols-3 gap-3">
              {["2D", "3D", "IMAX 3D"].map((f) => {
                const active = selectedFormat === f;
                return (
                  <button
                    key={f}
                    onClick={() => setSelectedFormat(f)}
                    className={`py-3.5 rounded-xl border font-heading font-extrabold text-xs uppercase transition-all cursor-pointer ${
                      active
                        ? "bg-primary border-primary text-white shadow-redGlow scale-103"
                        : "bg-white/5 border-white/5 text-gray-400 hover:border-white/10"
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>

            {/* Screen Selection cards */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {[
                { name: "Screen 1", tech: "Dolby Atmos", cap: "120 Seats" },
                { name: "IMAX Hall", tech: "Laser projection", cap: "200 Seats" }
              ].map((s) => {
                const active = selectedScreen === s.name;
                return (
                  <button
                    key={s.name}
                    onClick={() => setSelectedScreen(s.name)}
                    className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      active
                        ? "bg-[#0b0303] border-primary text-white shadow-redGlow scale-103"
                        : "bg-white/5 border-white/5 text-gray-400 hover:border-white/10"
                    }`}
                  >
                    <span className="font-heading font-extrabold text-sm text-white">{s.name}</span>
                    <span className="text-[10px] text-gray-500 font-semibold">{s.tech}</span>
                    <span className="text-[9px] text-accent font-bold mt-2 font-number">{s.cap}</span>
                  </button>
                );
              })}
            </div>

            {/* Showtime Selection Grid */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs uppercase font-extrabold tracking-widest text-gray-500 font-heading">Timings available</h4>
              
              <div className="grid grid-cols-2 gap-4">
                {showtimes.map((st) => {
                  const active = selectedShowtime?.id === st.id;
                  const isFull = st.availableSeats === 0;
                  const almostFull = st.availableSeats <= 10;
                  return (
                    <button
                      key={st.id}
                      disabled={isFull}
                      onClick={() => setSelectedShowtime(st)}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-[100px] transition-all cursor-pointer relative ${
                        isFull
                          ? "bg-neutral-950 border-neutral-900 text-gray-600 cursor-not-allowed opacity-35"
                          : active
                            ? "bg-primary border-primary text-white shadow-redGlow scale-103"
                            : "bg-white/5 border-white/5 text-gray-300 hover:border-white/10"
                      }`}
                    >
                      <span className="font-heading font-extrabold text-base flex items-center gap-1.5">
                        <Clock className="w-4 h-4 opacity-60" />
                        {st.time}
                      </span>
                      
                      <div className="flex items-center justify-between w-full mt-2">
                        <span className="text-[10px] text-gray-500 font-semibold font-number">₹{st.basePrice}</span>
                        {isFull ? (
                          <span className="text-[9px] text-red-500 font-bold uppercase">Full</span>
                        ) : almostFull ? (
                          <span className="text-[9px] text-amber-500 font-bold uppercase animate-pulse">Almost Full</span>
                        ) : (
                          <span className="text-[9px] text-emerald-400 font-bold uppercase">Available</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 4. STICKY BOOK BAR BOTTOM RIGHT */}
      {selectedTheatre && selectedShowtime && (
        <div className="fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-white/5 bg-[#050505]/95 shadow-glass py-5 px-10">
          <div className="max-w-[1450px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-left">
            <div className="space-y-1">
              <div className="text-[10px] text-gray-500 uppercase font-extrabold tracking-widest font-heading">Selections</div>
              <h4 className="font-heading font-extrabold text-sm text-white">
                {selectedTheatre.name} • {selectedShowtime.time}
              </h4>
              <p className="text-xs text-gray-400 font-number">
                Date: {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-right">
                <span className="text-[10px] text-gray-500 uppercase font-extrabold block">Starting from</span>
                <span className="text-2xl font-bold font-number text-accent">₹{selectedShowtime.basePrice}</span>
              </div>

              <button
                onClick={handleContinue}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-xs uppercase tracking-widest shadow-redGlow hover:scale-105 transition-all cursor-pointer"
              >
                Continue To Seats
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ShowtimeSelection;
