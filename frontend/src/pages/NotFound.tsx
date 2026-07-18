import React from "react";
import { Link } from "react-router-dom";
import { Film, Home, Search } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-gold shadow-goldGlow">
        <Film className="h-10 w-10" aria-hidden />
      </div>
      <p className="font-number text-xs font-bold uppercase tracking-widest text-primary">
        404
      </p>
      <h1 className="mt-3 font-heading text-3xl font-extrabold text-white sm:text-4xl">
        This showtime is not on the schedule
      </h1>
      <p className="mt-3 text-sm leading-6 text-cpm-muted">
        The page may have moved, expired, or never existed. Head back to the lobby and continue browsing.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-cpm bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-bold text-white shadow-redGlow"
        >
          <Home className="h-4 w-4" aria-hidden />
          Go Home
        </Link>
        <Link
          to="/movies"
          className="inline-flex items-center gap-2 rounded-cpm border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:border-gold/50"
        >
          <Search className="h-4 w-4" aria-hidden />
          Browse Movies
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
