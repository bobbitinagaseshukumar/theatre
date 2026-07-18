import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";
import { PrismaClient } from "@prisma/client";

// Load environment variables
dotenv.config();

// Initialize Prisma
export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
// Allowed origins: local dev + the deployed frontend (set FRONTEND_URL in Render).
// Supports a comma-separated FRONTEND_URL for multiple domains (e.g. preview + prod).
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",").map((o) => o.trim()) : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients (no origin) and any whitelisted origin
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      try {
        const hostname = new URL(origin).hostname;
        if (process.env.ALLOW_VERCEL_PREVIEWS === "true" && /\.vercel\.app$/.test(hostname)) {
          return callback(null, true);
        }
      } catch {
        return callback(new Error("Invalid CORS origin"));
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Body Parser
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use(morgan("dev"));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { message: "Too many requests from this IP, please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// Basic Route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// Import routes
import authRoutes from "./routes/auth";
import movieRoutes from "./routes/movie";
import bookingRoutes from "./routes/booking";
import paymentRoutes from "./routes/payment";
import foodRoutes from "./routes/food";
import settingRoutes from "./routes/setting";
import offerRoutes from "./routes/offer";
import upcomingRoutes from "./routes/upcoming";
import showtimeRoutes from "./routes/showtime";
import bookingEngineRoutes from "./routes/bookingEngine";

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/upcoming", upcomingRoutes);
app.use("/api/showtimes-theatres", showtimeRoutes);
app.use("/api/booking-engine", bookingEngineRoutes);
import recommendationRoutes from "./routes/recommendation";
app.use("/api/recommendation-engine", recommendationRoutes);
import couponEngineRoutes from "./routes/couponEngine";
app.use("/api/coupon-engine", couponEngineRoutes);
import membershipRoutes from "./routes/membership";
app.use("/api/membership-engine", membershipRoutes);
import crmRoutes from "./routes/crm";
app.use("/api/crm", crmRoutes);
import hrRoutes from "./routes/hr";
app.use("/api/hr", hrRoutes);
import marketingRoutes from "./routes/marketing";
app.use("/api/marketing", marketingRoutes);
import financeRoutes from "./routes/finance";
app.use("/api/finance", financeRoutes);
import securityRoutes from "./routes/security";
app.use("/api/security", securityRoutes);
import notificationRoutes from "./routes/notifications";
app.use("/api/notifications", notificationRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/automation", notificationRoutes);
app.use("/api/otp", notificationRoutes);
app.use("/api/chat", notificationRoutes);

import analyticsRoutes from "./routes/analytics";
app.use("/api/analytics", analyticsRoutes);

import mobileRoutes from "./routes/mobile";
app.use("/api/mobile", mobileRoutes);

import websiteRoutes from "./routes/website";
app.use("/api/website", websiteRoutes);

import seoRoutes from "./routes/seo";
app.use("/api/seo", seoRoutes);
app.use("/api/social", seoRoutes);
app.use("/api/marketing", seoRoutes);

import aiRoutes from "./routes/ai";
app.use("/api/ai", aiRoutes);

import adminRoutes from "./routes/admin";
app.use("/api/admin", adminRoutes);

import cmsRoutes from "./routes/cms";
app.use("/api/cms", cmsRoutes);

import systemRoutes from "./routes/system";
app.use("/api/system", systemRoutes);
app.use("/api/server", systemRoutes);
app.use("/api/backup", systemRoutes);
app.use("/api/restore", systemRoutes);
app.use("/api/logs", systemRoutes);
app.use("/api/deployment", systemRoutes);
app.use("/api/performance", systemRoutes);

app.use("/api/booking", bookingRoutes);
app.use("/api/demand", bookingRoutes);
app.use("/api/pricing", bookingRoutes);
app.use("/api/seat", bookingRoutes);
app.use("/api/waitlist", bookingRoutes);
app.use("/api/revenue", bookingRoutes);

import eventRoutes from "./routes/event";
app.use("/api/event", eventRoutes);
app.use("/api/vip", eventRoutes);
app.use("/api/invitation", eventRoutes);

import adRoutes from "./routes/ad";
app.use("/api/advertiser", adRoutes);
app.use("/api/ad", adRoutes);
app.use("/api/invoice", adRoutes);

import chainRoutes from "./routes/chain";
app.use("/api/theatre", chainRoutes);
app.use("/api/franchise", chainRoutes);
app.use("/api/chain", chainRoutes);
app.use("/api/location", chainRoutes);
app.use("/api/global", chainRoutes);

import saasRoutes from "./routes/saas";
app.use("/api/tenant", saasRoutes);
app.use("/api/subscription", saasRoutes);
app.use("/api/billing", saasRoutes);
app.use("/api/saas", saasRoutes);
app.use("/api/feature", saasRoutes);
app.use("/api/usage", saasRoutes);









// Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const isProduction = process.env.NODE_ENV === "production";
  res.status(err.status || 500).json({
    message: isProduction ? "Internal Server Error" : err.message || "Internal Server Error",
    error: isProduction ? {} : err,
  });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`🚀 CineVerse Backend is running on port ${PORT}`);
  try {
    await prisma.$connect();
    console.log("📂 Database connected successfully.");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
});
