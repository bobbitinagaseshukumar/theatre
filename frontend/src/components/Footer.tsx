import React from "react";
import { Link } from "react-router-dom";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  MapPin, 
  Mail, 
  Phone, 
  Clock 
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#020202] border-t border-white/5 pt-16 pb-8 overflow-hidden">
      {/* Background glow styling */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-redGlow">
                <span className="font-heading font-extrabold text-white text-base">C</span>
              </div>
              <span className="font-heading font-extrabold text-xl tracking-wider text-white">
                CINE<span className="text-primary">VERSE</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience cinema like never before. Ultra-premium sound, custom curated comfort seating, and visual excellence designed for real movie enthusiasts.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 hover:text-primary text-gray-400 hover:scale-110 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 hover:text-primary text-gray-400 hover:scale-110 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 hover:text-primary text-gray-400 hover:scale-110 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 hover:text-primary text-gray-400 hover:scale-110 transition-all">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-6 uppercase tracking-wider text-xs">Explore</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link to="/movies" className="text-gray-400 hover:text-primary transition-colors">Now Showing</Link>
              </li>
              <li>
                <Link to="/movies?status=upcoming" className="text-gray-400 hover:text-primary transition-colors">Upcoming Releases</Link>
              </li>
              <li>
                <Link to="/offers" className="text-gray-400 hover:text-primary transition-colors">Promotional Offers</Link>
              </li>
              <li>
                <Link to="/food" className="text-gray-400 hover:text-primary transition-colors">Food Menu</Link>
              </li>
            </ul>
          </div>

          {/* Guidelines / Help */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-6 uppercase tracking-wider text-xs">Policies & Help</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">Support Desk</Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">Refund & Cancellation Rules</a>
              </li>
            </ul>
          </div>

          {/* Location & Contact Info */}
          <div className="flex flex-col gap-4 text-sm text-gray-400">
            <h4 className="font-heading font-semibold text-white mb-2 uppercase tracking-wider text-xs">Theatre Location</h4>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>CineVerse Luxury Theatre, 5th Avenue, Cyber City, Bangalore - 560001</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-accent shrink-0" />
              <span>+91 80 4444 8888</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-secondary shrink-0" />
              <span>support@cineversepro.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-luxuryGold shrink-0" />
              <span>Box Office: 09:00 AM - 11:30 PM</span>
            </div>
          </div>
        </div>

        <hr className="border-white/5 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} CineVerse Pro Theatre. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
