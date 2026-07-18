import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { I18nProvider } from "./i18n/I18nProvider";

// Lazy load pages for performance (Lighthouse optimization)
const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const OTPVerify = React.lazy(() => import("./pages/OTPVerify"));
const Movies = React.lazy(() => import("./pages/Movies"));
const MovieDetails = React.lazy(() => import("./pages/MovieDetails"));
const Booking = React.lazy(() => import("./pages/Booking"));
const Food = React.lazy(() => import("./pages/Food"));
const Offers = React.lazy(() => import("./pages/Offers"));
const Success = React.lazy(() => import("./pages/Success"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Contact = React.lazy(() => import("./pages/Contact"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const ShowtimeSelection = React.lazy(() => import("./pages/ShowtimeSelection"));
const Membership = React.lazy(() => import("./pages/Membership"));
const Payment = React.lazy(() => import("./pages/Payment"));
const TheatreSelection = React.lazy(() => import("./pages/TheatreSelection"));
const AccountSettings = React.lazy(() => import("./pages/AccountSettings"));
const Notifications = React.lazy(() => import("./pages/Notifications"));

const App: React.FC = () => {
  return (
    <I18nProvider>
    <Router>
      <div className="flex flex-col min-h-screen bg-background text-white">
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-grow pt-20">
          <Suspense 
            fallback={
              <div className="min-h-[70vh] flex items-center justify-center">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
                  <div className="absolute inset-2 rounded-full border-b-2 border-accent animate-spin" style={{ animationDirection: 'reverse' }} />
                </div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<OTPVerify />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movies/:id" element={<MovieDetails />} />
              <Route path="/theatres" element={<TheatreSelection />} />
              <Route path="/showtimes/:movieId" element={<ShowtimeSelection />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/food" element={<Food />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/success" element={<Success />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<AccountSettings />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
        
        {/* React Hot Toast notification system */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "rgba(10, 10, 10, 0.9)",
              color: "#fff",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(10px)",
              fontFamily: "Inter, sans-serif",
            },
          }}
        />
      </div>
    </Router>
    </I18nProvider>
  );
};

export default App;
