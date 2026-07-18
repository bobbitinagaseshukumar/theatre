import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2, KeyRound, Mail } from "lucide-react";
import API from "../api/axios";
import { setCredentials, setLoading } from "../redux/authSlice";
import type { RootState } from "../redux/store";
import SocialLoginButtons from "../components/auth/SocialLoginButtons";

const loginSchema = zod.object({
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
});

type LoginFormInput = zod.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get("redirect") || "/";

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInput) => {
    dispatch(setLoading(true));
    try {
      const response = await API.post("/auth/login", data);
      const { token, user } = response.data;
      dispatch(setCredentials({ token, user }));
      toast.success(`Welcome back, ${user.name}!`);
      navigate(redirectPath);
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "Login failed.";
      
      if (status === 403 && error.response?.data?.isVerified === false) {
        // OTP verification pending
        toast.error(message);
        navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`);
      } else {
        toast.error(message);
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden py-12">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md p-8 rounded-2xl glass-panel relative z-10 border border-white/10 shadow-glass"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Welcome Back
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            Login to your premium ticket booking profile
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                placeholder="you@example.com"
                {...formRegister("email")}
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all focus:ring-1 focus:ring-primary/40 text-sm"
              />
            </div>
            {errors.email && (
              <p className="text-primary text-xs mt-1.5">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Password
              </label>
              <a href="#" className="text-xs text-accent hover:text-accent-hover transition-colors">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                <KeyRound className="w-5 h-5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...formRegister("password")}
                className="w-full pl-11 pr-12 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all focus:ring-1 focus:ring-primary/40 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-primary text-xs mt-1.5">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-bold tracking-wide shadow-redGlow hover:shadow-purpleGlow hover:scale-102 transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Logging In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6">
          <SocialLoginButtons />
        </div>

        <div className="text-center mt-6 text-sm text-gray-400">
          New to CineVerse?{" "}
          <Link
            to={`/register?redirect=${encodeURIComponent(redirectPath)}`}
            className="text-primary hover:text-primary-hover font-semibold transition-colors"
          >
            Create an Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
