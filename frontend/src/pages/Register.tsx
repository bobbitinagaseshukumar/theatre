import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { User, Mail, KeyRound, Phone, Loader2 } from "lucide-react";
import API from "../api/axios";
import { setLoading } from "../redux/authSlice";
import type { RootState } from "../redux/store";
import SocialLoginButtons from "../components/auth/SocialLoginButtons";
import PasswordStrengthMeter from "../components/auth/PasswordStrengthMeter";

const registerSchema = zod.object({
  name: zod.string().min(2, "Name must be at least 2 characters long"),
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
  phone: zod.string().min(10, "Phone number must be at least 10 digits").optional().or(zod.literal("")),
});

type RegisterFormInput = zod.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const { loading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get("redirect") || "/";

  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch("password") || "";

  const onSubmit = async (data: RegisterFormInput) => {
    dispatch(setLoading(true));
    try {
      const response = await API.post("/auth/register", data);
      toast.success(response.data.message || "Registration successful! Verification code sent.");
      // Redirect to OTP verification page
      navigate(`/verify-otp?email=${encodeURIComponent(data.email)}&redirect=${encodeURIComponent(redirectPath)}`);
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed.";
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] sm:min-h-[80vh] flex items-start sm:items-center justify-center px-3 sm:px-4 relative overflow-hidden py-6 sm:py-12">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md p-5 sm:p-8 rounded-2xl glass-panel relative z-10 border border-white/10 shadow-glass bg-black/85"
      >
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-white">
            Create Account
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            Join CineVerse Pro for premium cinematic bookings
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                {...formRegister("name")}
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all focus:ring-1 focus:ring-primary/40 text-sm"
              />
            </div>
            {errors.name && (
              <p className="text-primary text-xs mt-1.5">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...formRegister("email")}
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all focus:ring-1 focus:ring-primary/40 text-sm"
              />
            </div>
            {errors.email && (
              <p className="text-primary text-xs mt-1.5">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                <Phone className="w-5 h-5" />
              </span>
              <input
                type="tel"
                autoComplete="tel"
                placeholder="9876543210"
                {...formRegister("phone")}
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all focus:ring-1 focus:ring-primary/40 text-sm"
              />
            </div>
            {errors.phone && (
              <p className="text-primary text-xs mt-1.5">{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                <KeyRound className="w-5 h-5" />
              </span>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                {...formRegister("password")}
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all focus:ring-1 focus:ring-primary/40 text-sm"
              />
            </div>
            {errors.password && (
              <p className="text-primary text-xs mt-1.5">{errors.password.message}</p>
            )}
            <PasswordStrengthMeter password={passwordValue} />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-bold tracking-wide shadow-redGlow hover:shadow-purpleGlow hover:scale-102 transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Registering...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-6">
          <SocialLoginButtons />
        </div>

        <div className="text-center mt-6 text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
            className="text-primary hover:text-primary-hover font-semibold transition-colors"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
