import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, LogOut, Ticket, Award } from "lucide-react";
import toast from "react-hot-toast";
import type { RootState } from "../redux/store";
import { logout } from "../redux/authSlice";
import API from "../api/axios";
import DashboardExtras from "../components/dashboard/DashboardExtras";

// Mock Fallback booking records
const MOCK_PAST_BOOKINGS = [
  {
    id: "bk-7849c",
    totalPrice: 620,
    seatNumbers: ["C-5", "C-6"],
    bookingDate: "2026-07-15T18:30:00.000Z",
    status: "CONFIRMED",
    showtime: {
      screenName: "Premium IMAX Lounge",
      startTime: "Mon, Jul 20 @ 07:30 PM",
      movie: {
        title: "Aether: Rising Stars",
        posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop"
      }
    }
  }
];

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<any[]>(MOCK_PAST_BOOKINGS);
  const [, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      toast.error("Please login to access your profile.");
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!user) return;
      try {
        const res = await API.get("/bookings/history");
        setBookings(res.data);
      } catch {
        /* fall back to mock bookings */
      } finally {
        setLoading(false);
      }
    };
    fetchUserBookings();
  }, [user]);

  const handleSignOut = () => {
    dispatch(logout());
    toast.success("Logged out successfully.");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Upper Profile Banner */}
      <div className="glass-panel border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-purple-950/20 via-zinc-950 to-black">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center font-heading font-extrabold text-white text-3xl shadow-redGlow">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-heading font-extrabold tracking-tight text-white">{user.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-400">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user.email}</span>
              {user.phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {user.phone}</span>}
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs font-bold text-accent uppercase tracking-wider">{user.role}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/membership")}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-white font-bold text-sm tracking-wide border border-purple-500/30 transition-all flex items-center gap-2 cursor-pointer shadow-glass"
          >
            <Award className="w-4 h-4 text-luxuryGold" />
            Prestige Club
          </button>
          <button
            onClick={handleSignOut}
            className="px-6 py-3 rounded-lg bg-white/5 hover:bg-primary/20 hover:text-primary text-gray-300 font-bold text-sm tracking-wide border border-white/10 hover:border-primary/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Dashboard quick stats, wallet & quick actions */}
      <DashboardExtras
        totalBookings={bookings.length}
        totalSpent={bookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0)}
      />

      {/* Booking History Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-heading font-bold flex items-center gap-2">
          <Ticket className="w-6 h-6 text-primary" />
          Booking <span className="text-primary">History</span>
        </h2>

        {bookings.length > 0 ? (
          <div className="flex flex-col gap-6">
            {bookings.map((bk) => (
              <div 
                key={bk.id}
                className="glass-panel border border-white/5 p-6 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={bk.showtime.movie.posterUrl}
                    alt={bk.showtime.movie.title}
                    className="w-16 aspect-[2/3] rounded object-cover border border-white/5"
                  />
                  <div>
                    <h3 className="font-heading font-bold text-lg text-white">{bk.showtime.movie.title}</h3>
                    <p className="text-xs text-gray-500 font-number mt-1">{bk.showtime.screenName}</p>
                    <p className="text-accent text-xs font-number mt-1">{bk.showtime.startTime}</p>
                    <span className="text-[10px] text-gray-600 block mt-2 font-number">Ref Code: {bk.id}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end gap-2 border-t md:border-none border-white/5 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">Price Paid</span>
                    <span className="font-number font-bold text-lg text-white">₹{bk.totalPrice}</span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-number uppercase">
                      {bk.status}
                    </span>
                    <button
                      onClick={() => navigate(`/success?bookingId=${bk.id}`)}
                      className="text-xs text-accent hover:text-accent-hover transition-colors font-medium mt-1 cursor-pointer"
                    >
                      View Ticket QR
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel border border-white/15 p-12 text-center rounded-2xl text-gray-500">
            You haven't booked any movie tickets yet. Explore movies and start booking!
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
