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
  const dropdownRef = useRef<HTMLDivElement>(null);
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
      } catch (err) {
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

  return (
    <div ref={dropdownRef} className="relative w-full max-w-[420px] h-12">
      <div className="relative w-full h-full group">
        {/* Search Input Box */}
        <input
          type="text"
          placeholder="Search Movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-full pl-12 pr-4 rounded-full bg-white/5 hover:bg-white/10 focus:bg-black/60 border border-white/10 focus:border-accent text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent/40 text-sm transition-all duration-300"
        />

        {/* Search Icon with rotation anim on hover */}
        <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-hover:text-white transition-colors duration-300">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-accent" />
          ) : (
            <Search className="w-5 h-5 transition-transform duration-500 group-hover:rotate-12" />
          )}
        </span>
      </div>

      {/* Autocomplete Dropdown List */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-14 left-0 right-0 z-50 rounded-xl glass-panel border border-white/10 bg-[#0d0d0d]/95 overflow-hidden shadow-glass py-2">
          {suggestions.map((m) => (
            <button
              key={m.id}
              onClick={() => handleSelect(m.id)}
              className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium border-b border-white/5 last:border-none"
            >
              {m.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
