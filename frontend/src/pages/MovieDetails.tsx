import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Heart, 
  Share2, 
  ChevronUp, 
  ChevronDown, 
  X, 
  Copy,
  Ticket,
  Instagram,
  Twitter,
  Award,
  Music,
  Send,
  ThumbsUp,
  Star
} from "lucide-react";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";
import API from "../api/axios";
import { setBookingMovie, setBookingShowtime } from "../redux/bookingSlice";
import MovieStorySection from "../components/movie/MovieStorySection";
import AIFeaturesPanel from "../components/movie/AIFeaturesPanel";
import SeatPreview from "../components/movie/SeatPreview";
import RecommendedMovies from "../components/movie/RecommendedMovies";

// Mock Fallback Movie Database matching various cinematic themes
const MOCK_MOVIES = [
  {
    id: "m-1",
    title: "Aether: Rising Stars",
    tagline: "The universe will go dark unless she folds spacetime.",
    description: "In a galaxy on the verge of collapse, a rogue stellar cartographer discovers an ancient cosmic artifact capable of folding spacetime. As hostile empires hunt her down, she must unlock its secrets before the stars go dark forever.",
    genre: ["Sci-Fi", "Action", "Adventure"],
    duration: 142,
    rating: 9.2,
    ageRestriction: "UA",
    language: ["English", "Hindi"],
    format: ["2D", "3D", "IMAX", "Dolby Atmos"],
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    status: "NOW_SHOWING",
    releaseDate: "2026-07-01",
    director: "Christopher Nolan",
    producer: "Emma Thomas",
    music: "Hans Zimmer",
    theme: "scifi", // blue lighting, floating stars
    tags: ["Trending", "IMAX Popular"],
    votes: "4.5K votes",
    tomatoScore: 94
  },
  {
    id: "m-2",
    title: "Shadows of Tokyo",
    tagline: "Neon bloodlines clash in the modern underworld.",
    description: "An ancient ninja clan in modern Tokyo must defend their heritage against a cybernetically enhanced corporate syndicate. Bloodlines clash in a high-octane battle of swords, neon shadows, and family honor.",
    genre: ["Action", "Thriller"],
    duration: 128,
    rating: 8.8,
    ageRestriction: "A",
    language: ["Japanese", "English"],
    format: ["2D", "Dolby Atmos", "4DX"],
    posterUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=600&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    status: "NOW_SHOWING",
    releaseDate: "2026-07-10",
    director: "Chad Stahelski",
    producer: "Keanu Reeves",
    music: "Tyler Bates",
    theme: "action", // red lighting, flying sparks
    tags: ["Most Booked", "R-Rated Action"],
    votes: "2.8K votes",
    tomatoScore: 89
  },
  {
    id: "m-3",
    title: "Chronicles of Woods",
    tagline: "The trees remember the secrets of the kingdom.",
    description: "A visually stunning fantasy epic following a young botanist who discovers that the oldest trees in the kingdom can whisper memories of the past, holding the key to stopping a curse destroying their world.",
    genre: ["Fantasy", "Drama"],
    duration: 156,
    rating: 9.5,
    ageRestriction: "U",
    language: ["English"],
    format: ["2D", "IMAX"],
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    status: "UPCOMING",
    releaseDate: "2026-08-05",
    director: "Guillermo del Toro",
    producer: "Alfonso Cuarón",
    music: "Alexandre Desplat",
    theme: "romance", // soft pink/gold lighting
    tags: ["New Release", "Family Choice"],
    votes: "1.2K votes",
    tomatoScore: 97
  }
];

const MOCK_SHOWTIMES = [
  { id: "st-1", screenName: "Screen 1 - Dolby Atmos", startTime: "12:30 PM", basePrice: 220 },
  { id: "st-2", screenName: "Screen 1 - Dolby Atmos", startTime: "04:15 PM", basePrice: 250 },
  { id: "st-3", screenName: "Premium IMAX Lounge", startTime: "07:30 PM", basePrice: 420 },
];

const MovieDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showtimes] = useState<any[]>(MOCK_SHOWTIMES);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Dynamic Page Content States (Cast, Gallery, Songs, Reviews)
  const [cast, setCast] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  // Selection Expansions & Overlays
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [showFullscreenPoster, setShowFullscreenPoster] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  const [ratingCircleVal, setRatingCircleVal] = useState(0);

  // Lightbox Image Index
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Selected Actor profile details popup modal state
  const [selectedActor, setSelectedActor] = useState<any | null>(null);

  // Write Review Inputs
  const [reviewerName, setReviewerName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewEmoji, setReviewEmoji] = useState("🍿");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Confetti particles explosion animation state
  const [confettiExplosion, setConfettiExplosion] = useState(false);

  // 3D Mouse tilt coordinates
  const [tiltRotation, setTiltRotation] = useState({ x: 0, y: 0 });

  // Generate date options for the next 5 days
  const dates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  // Track window scroll to toggle Floating Action Bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowFloatingBar(true);
      } else {
        setShowFloatingBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch all database details dynamically
  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      try {
        // Run all API calls in parallel to solve slow loading times
        const [res, castRes, galRes, songRes, revRes] = await Promise.all([
          API.get(`/movies/${id}`),
          API.get(`/movies/${id}/cast`).catch(() => ({ data: [] })),
          API.get(`/movies/${id}/gallery`).catch(() => ({ data: [] })),
          API.get(`/movies/${id}/songs`).catch(() => ({ data: [] })),
          API.get(`/movies/${id}/reviews`).catch(() => ({ data: [] }))
        ]);

        const foundMock = MOCK_MOVIES.find((m) => m.id === id) || MOCK_MOVIES[0];
        const movieObj = {
          ...res.data,
          tagline: res.data.tagline || foundMock.tagline,
          director: res.data.director || foundMock.director,
          producer: res.data.producer || foundMock.producer,
          music: res.data.music || foundMock.music,
          theme: foundMock.theme,
          tags: foundMock.tags,
          votes: foundMock.votes,
          tomatoScore: foundMock.tomatoScore,
          format: res.data.format || foundMock.format,
        };
        setMovie(movieObj);
        setCast(castRes.data || []);
        setGallery(galRes.data || []);
        setSongs(songRes.data || []);
        setReviews(revRes.data || []);
      } catch (err) {
        // Fallbacks
        const found = MOCK_MOVIES.find((m) => m.id === id) || MOCK_MOVIES[0];
        setMovie(found);

        // Dynamic seeding for mock fields
        setCast([
          {
            name: found.id === "m-2" ? "Keanu Reeves" : "Robert Downey Jr.",
            character: found.id === "m-2" ? "John Wick" : "Tony Stark",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
            bio: "Robert John Downey Jr. is an American actor and producer. His career has been characterized by critical and popular success in his youth, followed by a period of substance abuse and legal difficulties, before a resurgence of commercial success later in his career.",
            filmography: ["Iron Man", "Sherlock Holmes", "Oppenheimer", "The Avengers"],
            awards: ["Academy Award Winner (Oppenheimer)", "BAFTA Film Award", "Golden Globe Award"],
            socials: { instagram: "https://instagram.com", twitter: "https://twitter.com", imdb: "https://imdb.com" }
          },
          {
            name: found.id === "m-2" ? "Hiroyuki Sanada" : "Scarlett Johansson",
            character: found.id === "m-2" ? "Shimazu Koji" : "Natasha Romanoff",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
            bio: "Scarlett Ingrid Johansson is an American actress. She was the world's highest-paid actress in 2018 and 2019, and has featured multiple times on the Forbes Celebrity 100 list.",
            filmography: ["Lost in Translation", "Black Widow", "Marriage Story", "Lucy"],
            awards: ["BAFTA Award", "Tony Award", "Academy Award Nominee"],
            socials: { instagram: "https://instagram.com", twitter: "https://twitter.com", imdb: "https://imdb.com" }
          },
          {
            name: found.id === "m-2" ? "Donnie Yen" : "Chris Evans",
            character: found.id === "m-2" ? "Caine" : "Steve Rogers",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
            bio: "Christopher Robert Evans is an American actor. He began his career with roles in television series and has since established himself as a blockbuster action star.",
            filmography: ["Captain America", "Knives Out", "Gifted", "Snowpiercer"],
            awards: ["People's Choice Award", "Teen Choice Award"],
            socials: { instagram: "https://instagram.com", twitter: "https://twitter.com", imdb: "https://imdb.com" }
          },
          {
            name: found.id === "m-2" ? "Rina Sawayama" : "Mark Ruffalo",
            character: found.id === "m-2" ? "Akira" : "Bruce Banner",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
            bio: "Mark Alan Ruffalo is an American actor. He began acting in the early 1990s and first gained recognition for his work in films.",
            filmography: ["Zodiac", "Spotlight", "The Avengers", "Dark Waters"],
            awards: ["Emmy Award", "Screen Actors Guild Award"],
            socials: { instagram: "https://instagram.com", twitter: "https://twitter.com", imdb: "https://imdb.com" }
          }
        ]);

        setGallery([
          { type: "image", url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop" },
          { type: "image", url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop" },
          { type: "image", url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=600&auto=format&fit=crop" },
          { type: "image", url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=600&auto=format&fit=crop" }
        ]);

        setSongs([
          { name: "Starlight Voyage", artist: "Hans Zimmer", duration: "4:12" },
          { name: "Neon Shadow Dancers", artist: "Tyler Bates", duration: "3:45" },
          { name: "Stellar Wind", artist: "Alexandre Desplat", duration: "5:02" }
        ]);

        setReviews([
          {
            id: "rev-1",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
            name: "Aravind Swamy",
            date: "2026-07-12",
            rating: 5,
            comment: "Absolutely mind-blowing cinematic experience! The sound design in Screen 1 was next level.",
            likes: 42,
            emoji: "🔥"
          },
          {
            id: "rev-2",
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop",
            name: "Meera Nair",
            date: "2026-07-15",
            rating: 4,
            comment: "Superb acting performances and top notch visual effects. Highly recommended for premium theatre viewing.",
            likes: 18,
            emoji: "🍿"
          }
        ]);

      } finally {
        setLoading(false);
      }
    };
    fetchMovieData();
  }, [id]);

  // Load rating progress ring values
  useEffect(() => {
    if (!movie) return;
    setRatingCircleVal(0);
    const target = movie.rating * 10;
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= target) {
        setRatingCircleVal(target);
        clearInterval(interval);
      } else {
        setRatingCircleVal(current);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [movie]);

  // Esc key configurations for overlay close buttons
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowFullscreenPoster(false);
        setLightboxIndex(null);
        setSelectedActor(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  const handlePosterMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTiltRotation({ x: y * -8, y: x * 8 });
  };

  const handlePosterMouseLeave = () => {
    setTiltRotation({ x: 0, y: 0 });
  };

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      toast.success("Added to Wishlist!");
    } else {
      toast.success("Removed from Wishlist.");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleShowtimeSelect = (st: any) => {
    dispatch(setBookingMovie({
      id: movie.id,
      title: movie.title,
      posterUrl: movie.posterUrl,
      ageRestriction: movie.ageRestriction
    }));
    
    const dateStr = selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    dispatch(setBookingShowtime({
      id: st.id,
      screenName: st.screenName,
      startTime: `${dateStr} @ ${st.startTime}`,
      basePrice: st.basePrice
    }));

    navigate("/booking");
  };

  // Submit Review triggers
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.error("Please enter a comment.");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await API.post(`/movies/${id}/reviews`, {
        name: reviewerName,
        rating: reviewRating,
        comment: reviewComment,
        emoji: reviewEmoji
      });

      // Add to reviews list local state
      setReviews((prev) => [res.data.review, ...prev]);
      
      // Clear inputs
      setReviewerName("");
      setReviewComment("");
      setReviewRating(5);
      setReviewEmoji("🍿");

      // Trigger local confetti particles explosion
      setConfettiExplosion(true);
      setTimeout(() => setConfettiExplosion(false), 3000);

      toast.success("Review submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Theme variables mapping
  let themeLightClass = "from-accent/5 via-primary/5 to-transparent";
  let particleColor = "rgba(229, 9, 20, 0.05)";

  if (movie.theme === "scifi") {
    themeLightClass = "from-accent/5 via-secondary/5 to-transparent";
    particleColor = "rgba(0, 229, 255, 0.05)";
  } else if (movie.theme === "romance") {
    themeLightClass = "from-pink-500/5 via-amber-500/5 to-transparent";
    particleColor = "rgba(255, 215, 0, 0.05)";
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-white pb-32 overflow-x-hidden">
      
      {/* 1. MOVIE BANNER BACKDROP */}
      <div className="absolute top-0 left-0 right-0 h-[80vh] overflow-hidden pointer-events-none z-0">
        <div 
          className="w-full h-full bg-cover bg-center scale-102 opacity-15 blur-[4px]"
          style={{ backgroundImage: `url(${movie.bannerUrl || movie.posterUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-transparent" />
        <div className={`absolute inset-0 bg-gradient-to-tr ${themeLightClass}`} />
      </div>

      {/* Floating Theme Particles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden h-[90vh]">
        {Array.from({ length: 12 }).map((_, idx) => (
          <motion.div
            key={idx}
            animate={{
              y: [600, -100],
              x: [idx * 90, idx * 90 + Math.sin(idx) * 40]
            }}
            transition={{
              duration: 25 + (idx % 4) * 4,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-2.5 h-2.5 rounded-full blur-[1px]"
            style={{
              backgroundColor: particleColor,
              left: `${(idx * 8) % 100}%`
            }}
          />
        ))}
      </div>

      {/* 2. HERO GRID CONTAINER */}
      <div className="relative z-10 max-w-[1450px] mx-auto px-10 pt-10 space-y-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Poster Section (Column 5) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div 
              className="perspective-1000 w-full max-w-[420px] aspect-[2/3]"
              onMouseMove={handlePosterMouseMove}
              onMouseLeave={handlePosterMouseLeave}
            >
              <motion.div
                style={{
                  rotateX: tiltRotation.x,
                  rotateY: tiltRotation.y,
                  transformStyle: "preserve-3d"
                }}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                onClick={() => setShowFullscreenPoster(true)}
                className="w-full h-full rounded-[32px] overflow-hidden border border-white/10 shadow-glass cursor-zoom-in relative group transition-all duration-300"
              >
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                />
                
                {/* Reflection Sweep */}
                <div 
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                  style={{ transform: "translateZ(30px)" }}
                />
              </motion.div>
            </div>
          </div>

          {/* Details Column (Column 7) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {movie.tags?.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 rounded bg-white/5 border border-white/10 text-gray-300 text-xs font-bold font-number uppercase">
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl sm:text-6xl font-heading font-extrabold tracking-tight text-white leading-tight glow-text-red">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-xl sm:text-2xl text-gray-400 font-medium italic">{movie.tagline}</p>
              )}
            </div>

            {/* Genre Capsules */}
            <div className="flex flex-wrap gap-2.5">
              {movie.genre.map((g: string) => (
                <span 
                  key={g} 
                  className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-extrabold uppercase tracking-wider hover:border-accent hover:text-white hover:shadow-blueGlow hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Ratings Indicators */}
            <div className="flex flex-wrap items-center gap-10 bg-black/40 border border-white/5 p-6 rounded-2xl w-fit">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" className="stroke-white/5 fill-transparent" strokeWidth="4" />
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      className="stroke-primary fill-transparent transition-all duration-500 shadow-redGlow" 
                      strokeWidth="4" 
                      strokeDasharray={176} 
                      strokeDashoffset={176 - (176 * ratingCircleVal) / 100}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-heading font-extrabold text-sm text-white">
                    {movie.rating.toFixed(1)}
                  </span>
                </div>
                <div>
                  <div className="text-xs uppercase font-extrabold tracking-wider text-gray-500">User Rating</div>
                  <div className="text-xs text-gray-300 font-number font-semibold mt-0.5">{movie.votes}</div>
                </div>
              </div>

              {movie.tomatoScore && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-950/20 border border-red-500/30 flex items-center justify-center text-primary font-bold text-xs">
                    🍅
                  </div>
                  <div>
                    <div className="text-xs uppercase font-extrabold tracking-wider text-gray-500">Tomatometer</div>
                    <div className="text-base font-bold font-number mt-0.5 text-white">{movie.tomatoScore}%</div>
                  </div>
                </div>
              )}
            </div>

            {/* Movie Meta Rows */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm font-number border-t border-b border-white/5 py-6">
              <div>
                <span className="text-gray-500 text-xs uppercase font-heading font-semibold block">Runtime</span>
                <span className="text-white font-bold">{movie.duration} Min</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs uppercase font-heading font-semibold block">Languages</span>
                <span className="text-white font-bold">{movie.language.join(", ")}</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs uppercase font-heading font-semibold block">Certificate</span>
                <span className="text-white font-bold">{movie.ageRestriction}</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs uppercase font-heading font-semibold block">Formats</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {movie.format?.map((f: string) => (
                    <span key={f} className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-gray-300 uppercase">{f}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-2 text-sm leading-relaxed">
              <h3 className="text-xs uppercase font-extrabold tracking-widest text-gray-500 font-heading">Synopsis</h3>
              <p className={`text-gray-400 ${isDescExpanded ? "" : "line-clamp-4"}`}>
                {movie.description}
              </p>
              <button
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="text-xs text-accent hover:text-accent-hover font-semibold transition-colors flex items-center gap-0.5 cursor-pointer mt-1"
              >
                {isDescExpanded ? (
                  <>
                    <span>Read Less</span> <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <span>Read More</span> <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* CTA controls */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              {movie.status === "NOW_SHOWING" ? (
                <button
                  onClick={() => {
                    navigate(`/showtimes/${movie.id}`);
                  }}
                  className="w-full sm:w-[320px] h-[72px] rounded-full bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-sm tracking-widest shadow-redGlow hover:scale-103 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Ticket className="w-5 h-5" />
                  BOOK TICKETS
                </button>
              ) : (
                <button
                  disabled
                  className="w-full sm:w-[320px] h-[72px] rounded-full bg-neutral-900 border border-white/5 text-gray-500 font-extrabold text-sm tracking-widest cursor-not-allowed flex items-center justify-center gap-2"
                >
                  PRE-BOOKING CLOSED
                </button>
              )}

              <button
                onClick={() => setShowTrailer(true)}
                className="px-6 h-[72px] rounded-full bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Play className="w-5 h-5 fill-white" />
                Trailer
              </button>

              <button
                onClick={handleFavoriteClick}
                className="w-[72px] h-[72px] rounded-full bg-white/5 border border-white/10 hover:border-primary text-gray-300 hover:text-primary transition-all flex items-center justify-center cursor-pointer shrink-0"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-primary text-primary scale-110' : ''} transition-all duration-300`} />
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="w-[72px] h-[72px] rounded-full bg-white/5 border border-white/10 hover:border-accent text-gray-300 hover:text-accent transition-all flex items-center justify-center cursor-pointer shrink-0"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Director & Crew info */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5 text-xs">
              <div>
                <span className="text-gray-500 block uppercase font-bold tracking-wider mb-1">Director</span>
                <span className="text-gray-300 font-semibold">{movie.director}</span>
              </div>
              <div>
                <span className="text-gray-500 block uppercase font-bold tracking-wider mb-1">Producer</span>
                <span className="text-gray-300 font-semibold">{movie.producer}</span>
              </div>
              <div>
                <span className="text-gray-500 block uppercase font-bold tracking-wider mb-1">Music score</span>
                <span className="text-gray-300 font-semibold">{movie.music}</span>
              </div>
            </div>

          </div>
        </div>

        {/* 3. SHOWTIME SELECTION PANEL */}
        {movie.status === "NOW_SHOWING" && (
          <div 
            id="showtime-selector"
            className="glass-panel border border-white/10 p-8 rounded-3xl flex flex-col gap-8 bg-gradient-to-r from-black via-[#0d0707]/30 to-black scroll-mt-24"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/5 pb-6">
              <div>
                <h3 className="text-2xl font-heading font-extrabold">Select Show Timings</h3>
                <p className="text-gray-400 text-xs mt-1">Select date and preferred screening showtime</p>
              </div>

              {/* Dates Row */}
              <div className="flex gap-2.5 overflow-x-auto py-1 scrollbar-none">
                {dates.map((d, index) => {
                  const active = d.getDate() === selectedDate.getDate();
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(d)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center font-number min-w-[70px] transition-all cursor-pointer ${
                        active
                          ? "bg-primary border-primary text-white shadow-redGlow scale-105"
                          : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      <span className="text-[10px] uppercase font-semibold">
                        {d.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className="text-lg font-bold mt-1">{d.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grouped screens showtimes */}
            <div className="space-y-6">
              {showtimes.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {Array.from(new Set(showtimes.map((st) => st.screenName))).map((screenName) => (
                    <div key={screenName} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center p-5 rounded-2xl border border-white/5 bg-black/40">
                      <div className="font-heading font-extrabold text-sm text-gray-300 md:col-span-1">
                        {screenName}
                      </div>
                      <div className="flex flex-wrap gap-3 md:col-span-3">
                        {showtimes
                          .filter((st) => st.screenName === screenName)
                          .map((st) => (
                            <button
                              key={st.id}
                              onClick={() => handleShowtimeSelect(st)}
                              className="px-6 py-3 rounded-xl bg-[#0f0f0f] border border-white/10 hover:border-primary text-sm font-bold text-accent hover:text-white hover:bg-primary hover:shadow-redGlow transition-all cursor-pointer flex flex-col items-center gap-1"
                            >
                              <span>{st.startTime}</span>
                              <span className="text-[10px] text-gray-500 hover:text-white font-number">₹{st.basePrice}</span>
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No showtimes available for this date.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. CAST & CREW SECTION (Part 2 - Section 1) */}
        {cast.length > 0 && (
          <div className="space-y-10 mt-[140px] text-left">
            <div>
              <h2 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-wider text-white uppercase">
                CAST & CREW
              </h2>
              <p className="text-gray-400 text-sm font-medium mt-1">Meet the people behind the movie</p>
              <div className="w-16 h-1 bg-primary mt-4 rounded-full" />
            </div>

            {/* Cast Horizontal list */}
            <div className="flex gap-8 overflow-x-auto pb-6 pt-2 scrollbar-thin">
              {cast.map((actor, index) => (
                <motion.div
                  key={index}
                  onClick={() => setSelectedActor(actor)}
                  whileHover={{ y: -12 }}
                  className="w-[210px] shrink-0 glass-panel border border-white/5 hover:border-accent/30 p-5 rounded-[24px] flex flex-col items-center text-center gap-4 shadow-glass cursor-pointer transition-all duration-300"
                >
                  {/* Rotating Border and image */}
                  <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden p-[3px] bg-gradient-to-tr from-primary to-accent hover:rotate-6 transition-all duration-500">
                    <img
                      src={actor.image}
                      alt={actor.name}
                      className="w-full h-full object-cover rounded-full hover:scale-108 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-base text-white line-clamp-1">{actor.name}</h4>
                    <p className="text-xs text-gray-500 font-semibold">{actor.character}</p>
                  </div>

                  {/* Social links row */}
                  <div className="flex gap-4 pt-1.5 border-t border-white/5 w-full justify-center">
                    <a
                      href={actor.socials?.instagram || "https://instagram.com"}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded bg-white/5 border border-white/10 hover:border-accent text-gray-400 hover:text-accent transition-colors"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={actor.socials?.twitter || "https://twitter.com"}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded bg-white/5 border border-white/10 hover:border-accent text-gray-400 hover:text-accent transition-colors"
                    >
                      <Twitter className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 5. MOVIE GALLERY (Part 2 - Section 3) */}
        {gallery.length > 0 && (
          <div className="space-y-10 mt-[120px] text-left">
            <div>
              <h2 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-wider text-white uppercase">
                MOVIE GALLERY
              </h2>
              <p className="text-gray-400 text-sm font-medium mt-1">Exclusive high-resolution images</p>
              <div className="w-16 h-1 bg-primary mt-4 rounded-full" />
            </div>

            {/* Pinterest responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gallery.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -6, scale: 1.03 }}
                  onClick={() => setLightboxIndex(index)}
                  className="rounded-2xl overflow-hidden border border-white/5 hover:border-accent/20 cursor-zoom-in relative group aspect-video bg-neutral-900 shadow-md transition-all duration-300"
                >
                  <img
                    src={item.url}
                    alt="Gallery item"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-6 h-6 fill-white text-white drop-shadow-md" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 6. SOUNDTRACKS & AWARDS SECTION (Part 2 - Section 7 & 8) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-[120px] text-left">
          
          {/* Soundtrack column (Column 7) */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <h2 className="text-3xl font-heading font-extrabold uppercase tracking-wide">
                SOUNDTRACK ALBUM
              </h2>
              <p className="text-gray-400 text-xs mt-1">Listen to exclusive background tracks and original scores</p>
            </div>

            <div className="space-y-4">
              {songs.map((song, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between p-4 rounded-2xl glass-panel border border-white/5 hover:border-primary/20 bg-black/30 hover:bg-black/60 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-redGlow">
                      <Music className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-heading font-extrabold text-sm text-white group-hover:text-primary transition-colors">{song.name}</h4>
                      <p className="text-[11px] text-gray-500 font-semibold">{song.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Equalizer animation wave */}
                    <div className="hidden group-hover:flex items-end gap-[3px] h-4">
                      <span className="w-[3px] h-3 bg-primary rounded-full animate-eq1" />
                      <span className="w-[3px] h-4 bg-accent rounded-full animate-eq2" />
                      <span className="w-[3px] h-2 bg-primary rounded-full animate-eq3" />
                    </div>
                    <span className="text-xs font-number text-gray-500 font-semibold">{song.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Awards column (Column 5) */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <h2 className="text-3xl font-heading font-extrabold uppercase tracking-wide">
                ACCOLADES & AWARDS
              </h2>
              <p className="text-gray-400 text-xs mt-1">Honored certifications and awards won</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ rotateY: 5, y: -4 }}
                className="p-5 rounded-2xl border border-white/5 bg-gradient-to-br from-[#1c1809]/40 to-black/90 p-5 flex flex-col gap-3 shadow-glass"
              >
                <Award className="w-10 h-10 text-luxuryGold drop-shadow-md hover:rotate-12 transition-transform" />
                <div>
                  <h4 className="font-heading font-extrabold text-sm text-luxuryGold uppercase tracking-wider">Best VFX Academy</h4>
                  <p className="text-[11px] text-gray-400 leading-normal mt-0.5">Won best cinematic graphics achievement at the Annual Film Awards.</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ rotateY: 5, y: -4 }}
                className="p-5 rounded-2xl border border-white/5 bg-gradient-to-br from-[#1c1809]/40 to-black/90 p-5 flex flex-col gap-3 shadow-glass"
              >
                <Award className="w-10 h-10 text-luxuryGold drop-shadow-md hover:rotate-12 transition-transform" />
                <div>
                  <h4 className="font-heading font-extrabold text-sm text-luxuryGold uppercase tracking-wider">Outstanding Score</h4>
                  <p className="text-[11px] text-gray-400 leading-normal mt-0.5">Critics Choice award winner for best background score compilation.</p>
                </div>
              </motion.div>
            </div>
          </div>

        </div>

        {/* 7. USER REVIEWS & SUBMIT FORM (Part 2 - Section 6) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-[120px] text-left">
          
          {/* Reviews List column (Column 7) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-3xl font-heading font-extrabold uppercase tracking-wide">
                User Reviews
              </h2>
              <p className="text-gray-400 text-xs mt-1">Read what other moviegoers had to say</p>
            </div>

            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl glass-panel border border-white/5 bg-[#0b0b0b]/60 flex gap-4 items-start relative overflow-hidden group shadow-md"
                  >
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="w-10 h-10 rounded-full object-cover border border-white/10"
                    />

                    <div className="space-y-2 flex-grow">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
                            {rev.name}
                            <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[9px] font-bold uppercase tracking-wider scale-95 select-none">
                              Verified
                            </span>
                          </h4>
                          <span className="text-[10px] text-gray-500 font-number">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-luxuryGold font-bold font-number">
                          <Star className="w-3.5 h-3.5 fill-luxuryGold text-luxuryGold" />
                          {rev.rating} / 5
                        </div>
                      </div>

                      <p className="text-gray-400 text-xs leading-relaxed">{rev.comment}</p>
                      
                      <div className="flex items-center gap-4 pt-1 text-[11px] text-gray-500">
                        <button className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
                          <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({rev.likes})
                        </button>
                        <span>•</span>
                        <span className="text-accent/60 cursor-default select-none">Emoji: {rev.emoji}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 border border-white/5 rounded-xl bg-black/20">
                  Be the first to review this movie!
                </div>
              )}
            </div>
          </div>

          {/* Write Review Form column (Column 5) */}
          <div className="lg:col-span-5 space-y-8 bg-gradient-to-tr from-black to-zinc-950/80 p-6 border border-white/5 rounded-3xl shadow-glass relative">
            {confettiExplosion && (
              <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
                {/* Local particles explosion mockup */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.span
                    key={i}
                    animate={{
                      x: [(Math.random() - 0.5) * 400, (Math.random() - 0.5) * 500],
                      y: [(Math.random() - 0.5) * 400, (Math.random() - 0.5) * 500],
                      scale: [1, 0],
                      opacity: [1, 0]
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute w-2 h-2 rounded-full bg-primary"
                    style={{ backgroundColor: i % 2 === 0 ? "rgba(229,9,20,0.8)" : "rgba(0,229,255,0.8)" }}
                  />
                ))}
              </div>
            )}

            <div>
              <h2 className="text-2xl font-heading font-extrabold uppercase">
                Write a Review
              </h2>
              <p className="text-gray-400 text-xs mt-1">Share your experience inside the cinematic universe</p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary/40 text-xs transition-colors"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Rating Score</label>
                <div className="flex gap-2.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-luxuryGold focus:outline-none cursor-pointer"
                    >
                      <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-luxuryGold' : 'opacity-20'} transition-all`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Select Movie Emoji</label>
                <div className="flex gap-3">
                  {["🍿", "🔥", "❤️", "👍", "😮"].map((emo) => (
                    <button
                      key={emo}
                      type="button"
                      onClick={() => setReviewEmoji(emo)}
                      className={`text-xl p-2 rounded-lg border transition-all cursor-pointer ${
                        reviewEmoji === emo ? "bg-white/10 border-primary scale-110 shadow-redGlow" : "bg-white/5 border-white/5 opacity-55 hover:opacity-100"
                      }`}
                    >
                      {emo}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Comments</label>
                <textarea
                  rows={4}
                  placeholder="Write your review details here..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary/40 text-xs transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-xs uppercase tracking-widest shadow-redGlow hover:scale-102 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Submit Review
              </button>
            </form>
          </div>

        </div>

        {/* 8. MOVIE STORY */}
        <MovieStorySection synopsis={movie.description} />

        {/* 9. AI SMART INSIGHTS */}
        <AIFeaturesPanel rating={movie.rating} genres={movie.genre} />

        {/* 10. SEAT AVAILABILITY PREVIEW */}
        <SeatPreview movieId={movie.id} bookable={movie.status === "NOW_SHOWING"} />

        {/* 11. RECOMMENDED MOVIES */}
        <RecommendedMovies
          currentId={movie.id}
          currentGenres={movie.genre}
          onTrailer={() => setShowTrailer(true)}
        />

      </div>

      {/* 8. FLOATING ACTION BAR */}
      <AnimatePresence>
        {showFloatingBar && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 glass-panel border border-white/10 px-6 py-3.5 bg-[#050505]/95 shadow-glass rounded-full flex items-center gap-6"
          >
            <div className="flex items-center gap-3 pr-4 border-r border-white/10">
              <span className="font-heading font-extrabold text-xs text-white max-w-[120px] truncate">{movie.title}</span>
              <span className="text-[10px] text-gray-500 font-number">{movie.duration} Min</span>
            </div>
            
            <div className="flex items-center gap-3">
              {movie.status === "NOW_SHOWING" ? (
                <button
                  onClick={() => {
                    navigate(`/showtimes/${movie.id}`);
                  }}
                  className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white font-extrabold text-xs tracking-wider shadow-redGlow cursor-pointer transition-colors"
                >
                  Book Tickets
                </button>
              ) : (
                <span className="px-4 py-2.5 rounded-full bg-neutral-900 text-gray-600 text-xs font-bold uppercase tracking-wider cursor-not-allowed">Coming Soon</span>
              )}

              <button 
                onClick={() => setShowTrailer(true)}
                className="p-2.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                title="Trailer"
              >
                <Play className="w-4 h-4 fill-white" />
              </button>

              <button 
                onClick={handleFavoriteClick}
                className="p-2.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-primary hover:border-primary transition-all cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
              </button>

              <button 
                onClick={() => setShowShareModal(true)}
                className="p-2.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-accent hover:border-accent transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="p-2.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer text-xs font-bold"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 9. FULL SCREEN POSTER VIEWER */}
      <AnimatePresence>
        {showFullscreenPoster && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
            <button
              onClick={() => setShowFullscreenPoster(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white cursor-pointer transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-md max-h-[85vh] rounded-2xl overflow-hidden shadow-glass border border-white/10"
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-contain"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 10. TRAILER VIDEO IFRAME */}
      {showTrailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-glass bg-black flex items-center justify-center"
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/60 border border-white/10 hover:border-primary text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={movie.trailerUrl}
              title="Movie Trailer"
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </motion.div>
        </div>
      )}

      {/* 11. SHARE DIALOG */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm rounded-3xl glass-panel border border-white/10 p-6 space-y-6 bg-gradient-to-tr from-black to-zinc-950 shadow-glass"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="font-heading font-extrabold text-base text-white">Share Movie</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="p-1.5 rounded-full hover:bg-white/5 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="flex justify-center p-3 bg-white rounded-2xl border border-gray-200 select-none shadow-md w-fit mx-auto">
              <QRCodeSVG 
                value={window.location.href}
                size={140}
                level={"H"}
              />
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCopyLink}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <Copy className="w-4 h-4" /> Copy Direct Link
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 12. LIGHTBOX SLIDESHOW OVERLAY (Part 2 - Section 3) */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white cursor-pointer transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden shadow-glass border border-white/10"
            >
              <img
                src={gallery[lightboxIndex]?.url}
                alt="Slideshow"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 13. ACTOR DETAIL PROFILE POPUP MODAL (Part 2 - Section 1) */}
      <AnimatePresence>
        {selectedActor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl glass-panel border border-white/10 p-8 space-y-6 bg-gradient-to-b from-[#0e0c0c] to-black shadow-glass text-left relative my-8"
            >
              <button
                onClick={() => setSelectedActor(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src={selectedActor.image}
                  alt={selectedActor.name}
                  className="w-32 h-32 rounded-full object-cover border-2 border-primary shadow-redGlow"
                />
                <div className="space-y-2">
                  <h3 className="text-3xl font-heading font-extrabold text-white">{selectedActor.name}</h3>
                  <p className="text-sm text-accent font-bold uppercase tracking-wider">{selectedActor.character}</p>
                  <div className="flex gap-3 pt-1">
                    <a
                      href={selectedActor.socials?.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded bg-white/5 border border-white/10 hover:border-accent text-gray-400 hover:text-accent transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a
                      href={selectedActor.socials?.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded bg-white/5 border border-white/10 hover:border-accent text-gray-400 hover:text-accent transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t border-white/5 pt-6 text-sm">
                <div className="space-y-1.5">
                  <h4 className="font-heading font-extrabold text-xs uppercase text-gray-500 tracking-wider">Biography</h4>
                  <p className="text-gray-400 leading-relaxed text-xs">{selectedActor.bio || "No biography details added."}</p>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-2">
                  <div className="space-y-1.5">
                    <h4 className="font-heading font-extrabold text-xs uppercase text-gray-500 tracking-wider">Awards</h4>
                    <ul className="list-disc pl-4 text-xs text-gray-400 space-y-1">
                      {selectedActor.awards?.map((a: string, i: number) => <li key={i}>{a}</li>) || <li>No awards recorded.</li>}
                    </ul>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-heading font-extrabold text-xs uppercase text-gray-500 tracking-wider">Filmography</h4>
                    <ul className="list-disc pl-4 text-xs text-gray-400 space-y-1">
                      {selectedActor.filmography?.map((f: string, i: number) => <li key={i}>{f}</li>) || <li>No roles added.</li>}
                    </ul>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MovieDetails;
