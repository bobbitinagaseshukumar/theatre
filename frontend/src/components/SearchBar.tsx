import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

interface SearchBarProps {
  suggestionsEnabled?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ suggestionsEnabled = true }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const listboxId = "movie-search-suggestions";
  const dropdownRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Fetch search suggestions
  useEffect(() => {
    if (!suggestionsEnabled || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        // Query backend movies by title search
        const response = await API.get(`/movies?search=${encodeURIComponent(query)}`);
        // Filter results locally as safety fallback if backend search isn't custom set
        const matches = (response.data || []).filter((m: any) =>
          m.title.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(matches.slice(0, 5));
        setShowDropdown(true);
      } catch {
        // Fallback mock suggestions for local testing
        const MOCK_TITLES = [
          { id: "m-1", title: "Aether: Rising Stars" },
          { id: "m-2", title: "Shadows of the Dynasty" },
          { id: "m-3", title: "Chronicles of Whispering Woods" },
        ];
        const matches = MOCK_TITLES.filter((m) =>
          m.title.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(matches);
        setShowDropdown(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, suggestionsEnabled]);

  const handleSelect = (id: string) => {
    setQuery("");
    setShowDropdown(false);
    navigate(`/movies/${id}`);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setShowDropdown(false);
    navigate(`/movies?search=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form ref={dropdownRef} onSubmit={handleSubmit} role="search" className="relative w-full max-w-[200px] sm:max-w-[260px] lg:max-w-[320px] h-9 sm:h-10 select-none">
      <div className="relative flex items-center w-full h-full group">
        {/* Search Input Box */}
        <input
          type="text"
          aria-label="Search movies"
          aria-autocomplete="list"
          aria-controls={showDropdown ? listboxId : undefined}
          aria-expanded={showDropdown}
          placeholder="Search Movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-full pl-3.5 pr-10 rounded-full bg-white/5 hover:bg-white/10 focus:bg-black/90 border border-white/10 focus:border-primary text-white placeholder-gray-400 focus:outline-none text-xs transition-all duration-300"
        />

        {/* Interactive Search Action Button */}
        <button
          type="submit"
          aria-label="Submit search"
          className="absolute right-1 inset-y-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-primary to-secondary hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-redGlow transition-all cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Search className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Autocomplete Dropdown List */}
      {showDropdown && suggestions.length > 0 && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute top-14 left-0 right-0 z-50 rounded-xl glass-panel border border-white/10 bg-[#0d0d0d]/95 overflow-hidden shadow-glass py-2"
        >
          {suggestions.map((m) => (
            <button
              key={m.id}
              type="button"
              role="option"
              aria-selected="false"
              onClick={() => handleSelect(m.id)}
              className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium border-b border-white/5 last:border-none"
            >
              {m.title}
            </button>
          ))}
        </div>
      )}
    </form>
  );
};

export default SearchBar;
