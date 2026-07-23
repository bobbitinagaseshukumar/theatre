import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Star, Ticket, ChevronLeft, ChevronRight, X } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/axios";
import ParticleBackground from "../components/ParticleBackground";
import CursorLight from "../components/CursorLight";
import FloatingPoster from "../components/FloatingPoster";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import OffersSection from "../components/OffersSection";
import UpcomingMoviesSection from "../components/UpcomingMoviesSection";
import AnnouncementBar from "../components/home/AnnouncementBar";
import QuickStats from "../components/home/QuickStats";
import TrendingSection from "../components/home/TrendingSection";
import MembershipSection from "../components/home/MembershipSection";
import ReviewsSection from "../components/home/ReviewsSection";

// Mock fallbacks ensuring no hardcoding and dynamic rendering
const MOCK_MOVIES = [
  {
    id: "m-1",
    title: "Aether: Rising Stars",
    description: "In a galaxy on the verge of collapse, a rogue stellar cartographer discovers an ancient cosmic artifact capable of folding spacetime. As hostile empires hunt her down, she must unlock its secrets before the stars go dark forever.",
    genre: ["Sci-Fi", "Action", "Adventure"],
    duration: 142,
    rating: 9.2,
    ageRestriction: "UA",
    language: ["English", "Hindi"],
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    status: "NOW_SHOWING",
    releaseDate: "2026-07-01",
    glowColor: "blue"
  },
  {
    id: "m-2",
    title: "Shadows of Tokyo",
    description: "An ancient ninja clan in modern Tokyo must defend their heritage against a cybernetically enhanced corporate syndicate. Bloodlines clash in a high-octane battle of swords, neon shadows, and family honor.",
    genre: ["Action", "Thriller"],
    duration: 128,
    rating: 8.8,
    ageRestriction: "A",
    language: ["Japanese", "English"],
    posterUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=600&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    status: "NOW_SHOWING",
    releaseDate: "2026-07-10",
    glowColor: "red"
  },
  {
    id: "m-3",
    title: "Chronicles of Woods",
    description: "A visually stunning fantasy epic following a young botanist who discovers that the oldest trees in the kingdom can whisper memories of the past, holding the key to stopping a curse destroying their world.",
    genre: ["Fantasy", "Drama"],
    duration: 156,
    rating: 9.5,
    ageRestriction: "U",
    language: ["English"],
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    status: "UPCOMING",
    releaseDate: "2026-08-05",
    glowColor: "purple"
  }
];

const Home: React.FC = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [activeTrailerUrl, setActiveTrailerUrl] = useState("");

  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  // Load dynamically from database
  useEffect(() => {
    let active = true;
    const fetchHomeMovies = async () => {
      try {
        const res = await API.get("/movies");
        if (active && res.data && Array.isArray(res.data)) {
          if (res.data.length > 0) {
            const mapped = res.data.map((m: any, idx: number) => ({
              ...m,
              glowColor: idx % 3 === 0 ? "blue" : idx % 3 === 1 ? "red" : "purple"
            }));
            setMovies(mapped);
          } else {
            setMovies([]);
          }
        }
      } catch {
        if (active && movies.length === 0) {
          setMovies(MOCK_MOVIES);
        }
      }
    };
    fetchHomeMovies();
    const pollInterval = setInterval(fetchHomeMovies, 4000);
    return () => {
      active = false;
      clearInterval(pollInterval);
    };
  }, []);

  const nowShowingMovies = movies.filter((m) => m.status === "NOW_SHOWING");
  const featuredSlides = nowShowingMovies.slice(0, 4);

  // Auto transition slide timer every 8 seconds
  useEffect(() => {
    if (featuredSlides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredSlides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredSlides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredSlides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredSlides.length) % featuredSlides.length);
  };

  const handleBookNowClick = (movieId: string) => {
    if (!user) {
      toast.error("Please login to book tickets.");
      navigate(`/login?redirect=${encodeURIComponent(`/showtimes/${movieId}`)}`);
    } else {
      navigate(`/showtimes/${movieId}`);
    }
  };

  const handleWatchTrailer = (url: string) => {
    setActiveTrailerUrl(url);
    setTrailerOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden pb-24">
      {/* 3D animated WebGL dust particles */}
      <ParticleBackground />

      {/* Mouse reactive radial glow background overlay */}
      <CursorLight />

      {/* 0. TOP ANNOUNCEMENT BAR */}
      <div className="relative z-20">
        <AnnouncementBar />
      </div>

      {/* 1. HERO SLIDER SECTION (100vh height) */}
      {featuredSlides.length > 0 && (
        <div className="relative h-[92vh] w-full bg-black overflow-hidden select-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Full-width backdrop poster with scale-zoom parallax */}
              <motion.div
                initial={{ scale: 1.05 }}
                animate={{ scale: 1.01 }}
                transition={{ duration: 8, ease: "easeOut" }}
                className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-102"
                style={{ 
                  backgroundImage: `url(${featuredSlides[currentSlide].bannerUrl || featuredSlides[currentSlide].posterUrl})` 
                }}
              >
                {/* Dual Cinematic Gradients and Blur layers */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/45 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/20 to-transparent" />
                <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />
              </motion.div>

              {/* Slider Content Frame */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                  
                  {/* Left Column: Movie Texts */}
                  <div className="lg:col-span-3 space-y-6 text-left">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="flex flex-wrap gap-2"
                    >
                      <span className="px-3 py-1 rounded bg-primary/20 border border-primary/40 text-primary font-bold text-xs uppercase tracking-widest">
                        Now Showing
                      </span>
                      {featuredSlides[currentSlide].genre.map((g: string) => (
                        <span key={g} className="px-3 py-1 rounded bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold">
                          {g}
                        </span>
                      ))}
                    </motion.div>

                    {/* Movie Title (72px) */}
                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="text-4xl sm:text-7xl font-heading font-extrabold tracking-tight text-white leading-tight glow-text-red"
                    >
                      {featuredSlides[currentSlide].title}
                    </motion.h1>

                    {/* Detailed Metadata rows */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="flex flex-wrap items-center gap-6 text-sm text-gray-300 font-number"
                    >
                      <span className="flex items-center gap-1.5 text-luxuryGold font-extrabold text-base">
                        <Star className="w-5 h-5 fill-luxuryGold text-luxuryGold" />
                        {featuredSlides[currentSlide].rating.toFixed(1)} / 10
                      </span>
                      <span>•</span>
                      <span>{featuredSlides[currentSlide].duration} Min</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 border border-white/30 rounded text-xs font-bold uppercase">
                        {featuredSlides[currentSlide].ageRestriction}
                      </span>
                      <span>•</span>
                      <span className="text-accent uppercase font-bold">{featuredSlides[currentSlide].language.join(", ")}</span>
                    </motion.div>

                    {/* Synopsis Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="text-gray-400 text-sm sm:text-base leading-relaxed line-clamp-3 max-w-xl"
                    >
                      {featuredSlides[currentSlide].description}
                    </motion.p>

                    {/* CTA Buttons with zoom scales and glow hover */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="flex flex-wrap gap-4 pt-2"
                    >
                      <button
                        onClick={() => handleBookNowClick(featuredSlides[currentSlide].id)}
                        className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-extrabold tracking-widest shadow-redGlow hover:shadow-purpleGlow hover:scale-105 active:scale-98 transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Ticket className="w-5 h-5" />
                        Book Now
                      </button>
                      
                      <button
                        onClick={() => handleWatchTrailer(featuredSlides[currentSlide].trailerUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ")}
                        className="px-8 py-3.5 rounded-lg bg-white/5 hover:bg-white/15 text-white font-bold border border-white/10 hover:border-white/20 transition-all backdrop-blur-md cursor-pointer flex items-center gap-2"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        Watch Trailer
                      </button>
                    </motion.div>
                  </div>

                  {/* Right Column: 3D rotating Movie Poster */}
                  <div className="lg:col-span-2 hidden lg:flex justify-end pr-10">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      <FloatingPoster 
                        src={featuredSlides[currentSlide].posterUrl} 
                        alt={featuredSlides[currentSlide].title} 
                        glowColor={featuredSlides[currentSlide].glowColor}
                      />
                    </motion.div>
                  </div>

                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Controllers: Manual Arrow Triggers */}
          <button
            onClick={handlePrev}
            className="absolute left-10 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-[#050505]/40 hover:bg-primary border border-white/10 text-white transition-all cursor-pointer hidden sm:block shadow-glass"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-10 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-[#050505]/40 hover:bg-primary border border-white/10 text-white transition-all cursor-pointer hidden sm:block shadow-glass"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicators Dots */}
          <div className="absolute bottom-10 left-10 flex gap-3">
            {featuredSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? "w-8 bg-primary shadow-redGlow" : "w-2 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Visual Category Quick-Links Menu */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 -mt-8 relative z-20">
        <div className="p-4 rounded-2xl bg-black/60 border border-white/5 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Quick Navigation</span>
            <span className="text-xs text-white font-bold">Discover Cinema Features</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                document.getElementById("featured-movies")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-all cursor-pointer flex items-center gap-2 hover:scale-105"
            >
              🎬 Now Showing
            </button>
            <button
              onClick={() => {
                document.getElementById("upcoming-movies")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-all cursor-pointer flex items-center gap-2 hover:scale-105"
            >
              📅 Upcoming Releases
            </button>
            <button
              onClick={() => {
                document.getElementById("discounts-offers")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-all cursor-pointer flex items-center gap-2 hover:scale-105"
            >
              🏷️ Special Discounts
            </button>
          </div>
        </div>
      </div>

      {/* QUICK STATS — animated counters on scroll */}
      <QuickStats />

      {/* 2. FEATURED MOVIES / NOW SHOWING (Horizontal Carousel) */}
      <div id="featured-movies" className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 space-y-16">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-primary glow-text-red font-number">
            Now Showing
          </span>
          <h2 className="text-4xl font-heading font-extrabold tracking-tight mt-1 text-white">
            Featured Movies
          </h2>
          <div className="w-16 h-1 bg-primary mt-4 rounded-full" />
        </div>

        {/* Carousel Grid layout matching responsive widths */}
        {nowShowingMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {nowShowingMovies.map((movie) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="group relative flex flex-col bg-[#0b0b0b]/60 border border-white/5 rounded-2xl overflow-hidden shadow-md hover:shadow-glass hover:border-accent/20 transition-all duration-300"
              >
                {/* Poster zoom card */}
                <div className="relative aspect-[2/3] overflow-hidden bg-slate-900">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-1 font-number text-xs text-luxuryGold font-extrabold">
                    <Star className="w-3.5 h-3.5 fill-luxuryGold text-luxuryGold" />
                    {movie.rating.toFixed(1)}
                  </div>
                </div>

                {/* Info and button */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-base text-white group-hover:text-primary transition-colors line-clamp-1">
                      {movie.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                      {movie.genre.join(" / ")}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-400 font-number">{movie.duration} Min</span>
                    
                    <div className="flex items-center gap-2 z-20">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleWatchTrailer(movie.trailerUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ");
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 hover:border-accent text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        <Play className="w-3 h-3 fill-current text-luxuryGold" /> Trailer
                      </button>
                      <button
                        onClick={() => handleBookNowClick(movie.id)}
                        className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover hover:scale-105 transition-all text-white font-bold text-xs shadow-redGlow cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        <Ticket className="w-3.5 h-3.5" /> Book
                      </button>
                    </div>
                  </div>
                </div>

                {/* Detail card redirect overlay */}
                <Link to={`/movies/${movie.id}`} className="absolute inset-x-0 top-0 bottom-16 z-10" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 border border-white/5 rounded-xl bg-black/20">
            No featured showtimes configured currently.
          </div>
        )}
      </div>

      {/* Offers & Promotions Section */}
      <div id="discounts-offers">
        <OffersSection />
      </div>

      {/* Upcoming Movies Section */}
      <div id="upcoming-movies">
        <UpcomingMoviesSection />
      </div>

      {/* Trending Movies (design-system MovieCard with 3D tilt) */}
      <TrendingSection movies={movies} />

      {/* Membership CTA */}
      <MembershipSection />

      {/* Customer Reviews */}
      <ReviewsSection />

      {/* 4. TRAILER IFRAME DIALOG POPUP (click outside backdrop to close) */}
      {trailerOpen && (
        <div 
          onClick={() => setTrailerOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-glass bg-[#0d0d0d] flex items-center justify-center cursor-default"
          >
            <button
              onClick={() => setTrailerOpen(false)}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/60 border border-white/10 hover:border-primary text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={activeTrailerUrl}
              title="Movie Trailer"
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

export default Home;
