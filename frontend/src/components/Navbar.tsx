import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { LogOut, LayoutDashboard, User, ChevronDown, Ticket, Menu, X } from "lucide-react";
import type { RootState } from "../redux/store";
import { logout } from "../redux/authSlice";
import SearchBar from "./SearchBar";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "../i18n/I18nProvider";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoRotation, setLogoRotation] = useState({ x: 0, y: 0 });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();

  // Scroll handler to toggle transparent vs glass layout
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle logo 3D mouse rotation (rotates up to 5 degrees)
  const handleLogoMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setLogoRotation({ x: y * -10, y: x * 10 });
  };

  const handleLogoMouseLeave = () => {
    setLogoRotation({ x: 0, y: 0 });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setShowProfileMenu(false);
  };

  const menuItems = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.movies"), path: "/movies" },
    { name: t("nav.theatres"), path: "/theatres" },
    { name: "Upcoming", path: "/movies?status=upcoming" },
    { name: t("nav.offers"), path: "/offers" },
    { name: t("nav.food"), path: "/food" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  const isAdmin = user && ["OWNER", "SUPER_ADMIN", "MANAGER", "STAFF"].includes(user.role);

  useEffect(() => {
    setMobileOpen(false);
    setShowProfileMenu(false);
  }, [location.pathname, location.search]);

  return (
    <nav 
      aria-label="Primary navigation"
      className={`fixed top-0 left-0 right-0 h-[76px] sm:h-[90px] z-50 transition-all duration-500 border-b ${
        isScrolled 
          ? "glass-panel border-white/5 bg-[#050505]/75 backdrop-blur-[25px] shadow-glass" 
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-[1600px] mx-auto h-full px-3 sm:px-6 lg:px-10 flex items-center justify-between">
        
        {/* LEFT: 3D animated Logo */}
        <div className="flex items-center shrink-0 mr-6 md:mr-10 lg:mr-16">
          <Link 
            to="/" 
            className="flex items-center gap-3 perspective-500"
            aria-label="Cinema Pro Max home"
            onMouseMove={handleLogoMouseMove}
            onMouseLeave={handleLogoMouseLeave}
          >
            <motion.div 
              style={{
                rotateX: logoRotation.x,
                rotateY: logoRotation.y,
                transformStyle: "preserve-3d",
              }}
              className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-redGlow cursor-pointer"
            >
              <span className="font-heading font-extrabold text-white text-2xl" style={{ transform: "translateZ(10px)" }}>C</span>
            </motion.div>
            <span className="hidden sm:inline font-heading font-extrabold text-2xl tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-primary select-none">
              CINE<span className="text-primary glow-text-red">VERSE</span>
            </span>
          </Link>
        </div>

        {/* CENTER: Luxury Hover Menus */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-8">
          {menuItems.map((item) => {
            const active = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                aria-current={active ? "page" : undefined}
                className="relative py-2 group text-sm font-semibold tracking-wide uppercase transition-all duration-300 hover:text-white"
              >
                <div className="transition-transform duration-300 group-hover:-translate-y-0.5 text-gray-300 group-hover:text-white flex flex-col items-center">
                  <span className={active ? "text-primary glow-text-red" : ""}>{item.name}</span>
                </div>
                {/* Grow from center glow underline */}
                <span 
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-primary to-accent transition-all duration-300 shadow-redGlow ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`} 
                />
              </Link>
            );
          })}
        </div>

        {/* RIGHT: Search & User Controls */}
        <div className="flex items-center gap-1.5 sm:gap-4 lg:gap-6">
          
          {/* Autocomplete Search Bar */}
          <div className="hidden md:block">
            <SearchBar />
          </div>

          {/* Language Switcher */}
          <LanguageSwitcher />



          {/* User Profile dropdown */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                aria-label="Open account menu"
                aria-expanded={showProfileMenu}
                className="flex items-center gap-2 p-1.5 rounded-full bg-white/5 border border-white/10 hover:border-accent transition-all cursor-pointer text-gray-300"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 flex items-center justify-center font-heading font-extrabold text-accent text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <ChevronDown className="w-4 h-4 mr-1 text-gray-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-12 z-50 w-52 rounded-xl glass-panel border border-white/10 bg-[#0d0d0d]/95 overflow-hidden shadow-glass py-2 text-sm text-gray-300">
                  <div className="px-4 py-3 border-b border-white/5">
                    <div className="font-bold text-white max-w-[150px] truncate">{user.name}</div>
                    <div className="text-[10px] text-gray-500 max-w-[150px] truncate mt-0.5">{user.email}</div>
                  </div>
                  
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-secondary" />
                      CMS Portal
                    </Link>
                  )}

                  <Link 
                    to="/profile" 
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-4 py-3 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <Ticket className="w-4 h-4 text-accent" />
                    My Tickets
                  </Link>

                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-primary/10 hover:text-primary transition-colors border-t border-white/5 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3.5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm tracking-wide shadow-redGlow hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap z-20"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Sign In</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Open mobile menu"
            aria-expanded={mobileOpen}
            className="inline-flex lg:hidden items-center justify-center rounded-lg border border-white/10 bg-white/5 p-2 text-gray-300 hover:border-accent hover:text-white"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>

      </div>
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[76px] sm:top-[90px] bottom-0 bg-[#0a0a0d] border-t border-white/10 z-[99] px-6 py-8 overflow-y-auto space-y-6 flex flex-col justify-start">
          <div className="grid grid-cols-2 gap-3">
            {menuItems.map((item) => {
              const active = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-xl border px-4 py-4 text-center font-heading text-sm font-extrabold uppercase transition-all tracking-wider ${
                    active
                      ? "border-primary/50 bg-primary/10 text-primary shadow-redGlow"
                      : "border-white/10 bg-white/5 text-gray-300 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* User Profile / Auth buttons for mobile */}
          <div className="pt-6 border-t border-white/10">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 flex items-center justify-center font-heading font-extrabold text-accent text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm truncate max-w-[200px]">{user.name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{user.email}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold text-gray-300 hover:text-white"
                    >
                      <LayoutDashboard className="w-4 h-4 text-secondary" /> CMS
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold text-gray-300 hover:text-white"
                  >
                    <Ticket className="w-4 h-4 text-accent" /> Tickets
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-xs font-bold text-primary hover:bg-primary/20 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  className="w-full py-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-widest shadow-redGlow flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" /> Sign In
                </Link>
                <Link
                  to="/register"
                  className="w-full py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
