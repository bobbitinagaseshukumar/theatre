import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ShieldCheck, Loader2 } from "lucide-react";
import API from "../api/axios";
import { setCredentials, setLoading } from "../redux/authSlice";
import type { RootState } from "../redux/store";

const OTPVerify: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const redirectPath = searchParams.get("redirect") || "/";

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const { loading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect if email is not present
  useEffect(() => {
    if (!email) {
      toast.error("Invalid verification request.");
      navigate("/login");
    }
  }, [email, navigate]);

  // Resend OTP Countdown Timer
  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input box
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index] === "" && index > 0) {
        // Backspace on empty field - clear and focus previous field
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      } else {
        // Clear current field
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (pasteData.length === 6 && !isNaN(Number(pasteData))) {
      const pasteOtp = pasteData.split("");
      setOtp(pasteOtp);
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      toast.error("Please enter a 6-digit OTP code.");
      return;
    }

    dispatch(setLoading(true));
    try {
      const response = await API.post("/auth/verify-otp", {
        email,
        code: otpCode,
      });
      const { token, user } = response.data;
      dispatch(setCredentials({ token, user }));
      toast.success("Account verified successfully! Welcome!");
      navigate(redirectPath);
    } catch (error: any) {
      const message = error.response?.data?.message || "Verification failed.";
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setIsResending(true);
    try {
      const response = await API.post("/auth/resend-otp", { email });
      toast.success(response.data.message || "New verification code sent!");
      setResendTimer(60);
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to resend code.";
      toast.error(message);
    } finally {
      setIsResending(false);
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
          <div className="w-16 h-16 bg-accent/10 border border-accent/30 text-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-blueGlow">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-heading font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Verify Email
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            We have sent a verification code to <br />
            <span className="text-white font-semibold">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* OTP Code Input Boxes */}
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {otp.map((value, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={value}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-heading font-bold text-accent bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/40 transition-all font-number"
              />
            ))}
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
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </button>
        </form>

        <div className="text-center mt-8 text-sm text-gray-400">
          Didn't receive the email?{" "}
          <button
            onClick={handleResend}
            disabled={resendTimer > 0 || isResending}
            className={`font-semibold transition-colors ${
              resendTimer > 0 
                ? "text-gray-600 cursor-not-allowed" 
                : "text-accent hover:text-accent-hover cursor-pointer"
            }`}
          >
            {isResending ? (
              <Loader2 className="w-4 h-4 animate-spin inline-block mr-1" />
            ) : null}
            Resend Code {resendTimer > 0 ? `(${resendTimer}s)` : ""}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPVerify;
