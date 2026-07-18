import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { register, login, verifyOTP, resendOTP } from "../controllers/auth";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many authentication attempts. Please try again later." },
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/verify-otp", authLimiter, verifyOTP);
router.post("/resend-otp", authLimiter, resendOTP);

export default router;
