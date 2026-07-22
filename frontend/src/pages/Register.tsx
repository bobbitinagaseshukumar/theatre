import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, useMotionValue, useTransform } from "framer-motion";
import toast from "react-hot-toast";
import { User, Mail, KeyRound, Phone, Loader2, EyeOff, Eye, LogIn } from "lucide-react";

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

const FloatingOrb = ({ color, delay, duration, size, initialPos }: any) => {
  return (
    <motion.div
      className={`absolute rounded-full opacity-20 mix-blend-screen filter blur-[100px] pointer-events-none ${color}`}
      style={{
        width: size,
        height: size,
        top: initialPos.y,
        left: initialPos.x,
      }}
      animate={{
        x: [0, 100, -50, 0],
        y: [0, -100, 50, 0],
        scale: [1, 1.2, 0.8, 1],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "linear",
        delay: delay,
      }}
    />
  );
};

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
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

  const password = watch("password", "");

  const onSubmit = async (data: RegisterFormInput) => {
    dispatch(setLoading(true));
    try {
      await API.post("/auth/register", data);
      toast.success("Registration successful! Please verify your email.");
      const encodedEmail = encodeURIComponent(data.email);
      const encodedRedirect = encodeURIComponent(redirectPath);
      navigate(`/verify-otp?email=${encodedEmail}&redirect=${encodedRedirect}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // 3D Tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-150, 150], [3, -3]);
  const rotateY = useTransform(x, [-150, 150], [-3, 3]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen w-full bg-[#030305] flex items-center justify-center relative overflow-hidden px-4 sm:px-6 py-8 sm:py-12">
      {/* Background Orbs */}
      <FloatingOrb color="bg-red-600" delay={0} duration={15} size={350} initialPos={{ x: '80%', y: '10%' }} />
      <FloatingOrb color="bg-purple-600" delay={2} duration={20} size={450} initialPos={{ x: '10%', y: '60%' }} />
      <FloatingOrb color="bg-teal-600" delay={5} duration={18} size={300} initialPos={{ x: '40%', y: '80%' }} />

      <motion.div
        className="w-full max-w-md relative z-10"
        style={{ perspective: 1000 }}
      >
        {/* Glowing border effect wrapper */}
        <motion.div 
          className="absolute -inset-[2px] rounded-2xl opacity-40 bg-gradient-to-r from-red-500 via-purple-500 to-teal-500"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          style={{ filter: 'blur(8px)', backgroundSize: '200% 200%' }}
        />

        <motion.div
          className="bg-[#0a0a0f] rounded-2xl shadow-2xl relative w-full border border-white/5"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="p-6 sm:p-8">
            <motion.div 
              variants={containerVariants} 
              initial="hidden" 
              animate="visible"
              className="flex flex-col gap-6"
            >
              <motion.div variants={itemVariants} className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                <p className="text-gray-400 text-sm">Join us for the best experience</p>
              </motion.div>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    {...formRegister('name')}
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                    placeholder="Full Name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    {...formRegister('email')}
                    type="email"
                    className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm"
                    placeholder="Email Address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    {...formRegister('phone')}
                    type="tel"
                    className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                    placeholder="Phone Number (Optional)"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    {...formRegister('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="block w-full pl-10 pr-10 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
                  )}
                  {password.length > 0 && (
                    <div className="mt-2">
                      <PasswordStrengthMeter password={password} />
                    </div>
                  )}
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  type="submit"
                  disabled={loading}
                  className="mt-2 relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white font-medium bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] focus:ring-purple-500 disabled:opacity-50 overflow-hidden text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ translateX: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 1 }}
                  />
                  {loading ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center relative z-10">
                      Sign Up <LogIn className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </motion.button>
              </form>

              <motion.div variants={itemVariants} className="mt-2">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-800" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-[#0a0a0f] text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-5">
                  <SocialLoginButtons />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="text-center mt-2">
                <p className="text-xs text-gray-400">
                  Already have an account?{' '}
                  <Link to={`/login${redirectPath !== '/' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`} className="font-medium text-teal-400 hover:text-teal-300 transition-colors">
                    Sign in here
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
