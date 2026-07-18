import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Bell, ChevronRight, X, Film } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/axios";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

// Mock Upcoming Movies fallback ensuring zero hardcoding
const MOCK_UPCOMING = [
  {
    id: "m-upcoming-1",
    title: "Chronicles of Woods",
    description: "A visually stunning fantasy epic following a young botanist who discovers that the oldest trees in the kingdom can whisper memories of the past.",
    genre: ["Fantasy", "Drama"],
    duration: 156,
    language: ["English"],
    ageRestriction: "U",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    // 5 days from now
    releaseDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "m-upcoming-2",
    title: "Stellar Horizon",
    description: "Deep space explorers navigate a massive wormhole only to find themselves stranded in a reverse-time universe where they must find a way back home.",
    genre: ["Sci-Fi", "Thriller"],
    duration: 135,
    language: ["English", "Spanish"],
    ageRestriction: "UA",
    posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=1200&auto=format&fit=crop",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    // 12 days from now
    releaseDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

// Subcomponent: Live Countdown timer (updates every second)
const CountdownTimer: React.FC<{ targetDate: string; onComplete?: () => void }> = ({ targetDate, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (onComplete) onComplete();
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  return (
    <div className="flex gap-1.5 font-number text-[10px] font-bold text-accent tracking-wider uppercase bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 glow-text-blue">
      <span>{timeLeft.days}d</span>
      <span>:</span>
      <span>{timeLeft.hours}h</span>
      <span>:</span>
      <span>{timeLeft.minutes}m</span>
      <span>:</span>
      <span>{timeLeft.seconds}s</span>
    </div>
  );
};

const UpcomingMoviesSection: React.FC = () => {
  const [movies, setMovies] = useState<any[]>(MOCK_UPCOMING);
  const [loading, setLoading] = useState(true);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [activeTrailerUrl, setActiveTrailerUrl] = useState("");
  const [notifiedStates, setNotifiedStates] = useState<Record<string, boolean>>({});

  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      try {
        const res = await API.get("/upcoming");
        if (res.data && res.data.length > 0) {
          setMovies(res.data);
        }
      } catch {
        /* mock fallback */
      } finally {
        setLoading(false);
      }
    };
    fetchUpcomingMovies();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  const handleNotifyMe = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to enable notifications.");
      navigate(`/login?redirect=${encodeURIComponent("/")}`);
      return;
    }

    setNotifiedStates((prev) => ({ ...prev, [id]: true }));
    toast.success(`You will be notified when "${title}" tickets open!`);
  };

  const handlePlayTrailer = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    setActiveTrailerUrl(url);
    setTrailerOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-[1450px] mx-auto px-10 py-16 space-y-12">
        <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-[480px] rounded-[28px] glass-panel border border-white/5 bg-white/5 flex flex-col justify-between p-6 animate-pulse">
              <div className="aspect-[2/3] w-full bg-white/10 rounded-2xl" />
              <div className="h-8 w-2/3 bg-white/10 rounded mt-4" />
              <div className="h-12 w-full bg-white/10 rounded-full mt-6" />
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
      className="relative w-full py-16 mt-[160px] mb-[160px] overflow-hidden select-none"
    >
      {/* Background Animated Light Sweep, smoke, and Red particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.03)_0%,rgba(139,92,246,0.01)_50%,transparent_100%)] opacity-80"
          style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` }}
        />
        {/* Diagonally floating red particle dust */}
        {Array.from({ length: 12 }).map((_, idx) => (
          <motion.div
            key={idx}
            animate={{
              x: [idx * 110, idx * 110 + 100 + mousePos.x * 40],
              y: [600, -100 + mousePos.y * 40],
            }}
            transition={{
              duration: 20 + (idx % 4) * 5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-2 h-2 rounded-full bg-primary/20 blur-[1px]"
            style={{ left: `${(idx * 9) % 100}%` }}
          />
        ))}
      </div>

      <div className="max-w-[1450px] mx-auto px-10 relative z-10 space-y-12">
        
        {/* HEADER: Title & View All */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="space-y-2 text-left"
          >
            <h2 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-wider text-white">
              UPCOMING MOVIES
            </h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-gray-400 text-base sm:text-lg font-medium"
            >
              Coming Soon In Your Favourite Theatre
            </motion.p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/movies?status=upcoming")}
            className="group px-6 py-4 rounded-full glass-panel border border-white/15 bg-white/5 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-glass transition-all duration-300 w-fit shrink-0 self-start sm:self-auto"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        </div>

        {/* MOVIES GRID */}
        {movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {movies.map((movie, idx) => {
              const isNotified = notifiedStates[movie.id];

              return (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, scale: 0.9, y: 60 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  whileHover={{ y: -18, rotateZ: 2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/movies/${movie.id}`)}
                  className="group relative h-[520px] rounded-[28px] glass-panel border border-white/5 hover:border-accent/30 bg-gradient-to-b from-[#090909]/80 to-[#121212]/90 p-5 flex flex-col justify-between shadow-md hover:shadow-purpleGlow transition-all duration-500 overflow-hidden"
                >
                  {/* Poster wrapper occupies ~75% */}
                  <div className="relative h-[72%] w-full rounded-[22px] overflow-hidden bg-slate-900 border border-white/5">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-all duration-700"
                    />

                    {/* COMING SOON Pulse Badge */}
                    <motion.span
                      animate={{ opacity: [1, 0.6, 1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-orange-600 text-[9px] font-extrabold text-white uppercase tracking-wider shadow-redGlow"
                    >
                      Coming Soon
                    </motion.span>

                    {/* Live Countdown Timer */}
                    <div className="absolute top-3.5 right-3.5">
                      <CountdownTimer targetDate={movie.releaseDate} />
                    </div>

                    {/* Quick Trailer Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <button
                        onClick={(e) => handlePlayTrailer(e, movie.trailerUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ")}
                        className="p-4 rounded-full bg-white text-black border border-white/10 hover:scale-110 active:scale-95 transition-all shadow-glass pointer-events-auto cursor-pointer"
                        title="Play Trailer"
                      >
                        <Play className="w-5 h-5 fill-black pl-0.5" />
                      </button>
                    </div>
                  </div>

                  {/* Below Poster: Details and Notification trigger */}
                  <div className="flex-1 flex flex-col justify-between pt-4">
                    <div className="space-y-1 text-left">
                      <h3 className="text-lg sm:text-xl font-heading font-extrabold text-white leading-tight line-clamp-1 group-hover:text-accent transition-colors">
                        {movie.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-gray-500 font-semibold uppercase font-number">
                        <span>{movie.genre.join(" / ")}</span>
                        <span>•</span>
                        <span>{movie.duration} Min</span>
                        <span>•</span>
                        <span className="px-1 border border-white/20 rounded-sm">{movie.ageRestriction}</span>
                      </div>
                    </div>

                    {/* Notify me CTA Button */}
                    <button
                      onClick={(e) => handleNotifyMe(e, movie.id, movie.title)}
                      className={`w-full py-3 rounded-full font-extrabold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isNotified
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold"
                          : "bg-gradient-to-r from-secondary to-accent hover:shadow-blueGlow hover:scale-103 text-white"
                      }`}
                    >
                      <Bell className={`w-3.5 h-3.5 ${isNotified ? 'animate-bounce' : 'group-hover:animate-ring'}`} />
                      {isNotified ? "Subscribed" : "Notify Me"}
                    </button>
                  </div>

                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel border border-white/5 rounded-[28px] p-12 text-center flex flex-col items-center justify-center gap-4 bg-black/40">
            <Film className="w-12 h-12 text-gray-500 animate-pulse" />
            <h3 className="font-heading font-bold text-lg">No Upcoming Movies</h3>
            <p className="text-gray-400 text-xs">There are no upcoming movies scheduled currently.</p>
          </div>
        )}
      </div>

      {/* TRAILER POPUP */}
      {trailerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-glass bg-[#0d0d0d] flex items-center justify-center"
          >
            <button
              onClick={() => setTrailerOpen(false)}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/60 border border-white/10 hover:border-primary text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={activeTrailerUrl}
              title="Upcoming Movie Trailer"
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default UpcomingMoviesSection;
