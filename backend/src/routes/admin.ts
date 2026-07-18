import { Router, Request, Response } from "express";
import { prisma } from "../index";

const router = Router();

// GET /dashboard - Full Admin Dashboard Data
router.get("/dashboard", async (_req: Request, res: Response) => {
  try {
    res.json({
      overview: {
        totalRevenue: 2840000,
        todayRevenue: 85600,
        totalBookings: 12847,
        todayBookings: 342,
        totalCustomers: 48920,
        activeCustomers: 12400,
        totalMovies: 24,
        nowShowing: 8,
        occupancyRate: 74.8,
        avgTicketPrice: 420,
        foodRevenue: 681600,
        membershipRevenue: 284000
      },
      alerts: [
        { id: "al-1", type: "WARNING", title: "Low Inventory: Premium Butter", message: "Stock covers only 1 day. Immediate restock required.", time: "15 mins ago", action: "RESTOCK" },
        { id: "al-2", type: "INFO", title: "New Movie Upload Pending", message: "Cosmic Horizons 3D awaiting poster and trailer upload.", time: "1 hour ago", action: "UPLOAD" },
        { id: "al-3", type: "CRITICAL", title: "Payment Gateway Error", message: "Razorpay webhook returning 502 for 3 transactions.", time: "5 mins ago", action: "INVESTIGATE" },
        { id: "al-4", type: "SUCCESS", title: "Daily Backup Complete", message: "Full database backup completed successfully (2.4 GB).", time: "30 mins ago", action: "VIEW" }
      ],
      aiSuggestions: [
        { id: "sg-1", category: "REVENUE", title: "Launch Student Weekend Pass", description: "AI predicts 340% higher conversion for 18-25 age group on weekends. Estimated revenue: ₹84,000.", confidence: 0.92, impact: "+₹84K" },
        { id: "sg-2", category: "OPERATIONS", title: "Add Evening Staff at Concessions", description: "Queue bottleneck detected at 7-8 PM. Adding 2 staff members reduces wait time by 60%.", confidence: 0.88, impact: "+22% satisfaction" },
        { id: "sg-3", category: "MARKETING", title: "Monsoon Movie Marathon Campaign", description: "Rainy season increases indoor entertainment demand by 23%. Launch targeted email campaign.", confidence: 0.85, impact: "+₹126K" }
      ],
      recentActivity: [
        { event: "BOOKING_CONFIRMED", details: "Priya Sharma booked Aether: Rising Stars (Screen 1 IMAX)", time: "2 mins ago" },
        { event: "PAYMENT_RECEIVED", details: "₹1,640 received via UPI for booking bk-8901", time: "5 mins ago" },
        { event: "FOOD_ORDER", details: "Kitchen Order #KO-445: Truffle Popcorn + Nachos (Screen 2)", time: "8 mins ago" },
        { event: "REFUND_PROCESSED", details: "₹420 refunded to Vikram Mehta for cancelled booking", time: "12 mins ago" },
        { event: "EMPLOYEE_CHECKIN", details: "Arjun Kapoor (Floor Manager) checked in for evening shift", time: "20 mins ago" },
        { event: "SECURITY_ALERT", details: "CCTV Camera 3: Crowd density at concessions exceeds 85%", time: "25 mins ago" }
      ],
      quickStats: {
        screenUtilization: [85, 72, 91, 64, 88],
        hourlyBookings: [12, 8, 15, 22, 45, 67, 89, 94, 78, 55, 34, 18],
        topMovies: [
          { title: "Aether: Rising Stars", bookings: 342, revenue: 284000, occupancy: 89 },
          { title: "Shadows of the Dynasty", bookings: 218, revenue: 196000, occupancy: 72 },
          { title: "Cosmic Horizons 3D", bookings: 156, revenue: 148000, occupancy: 64 }
        ],
        customerSegments: [
          { segment: "VIP Gold", count: 89, revenue: 890000, pct: 31 },
          { segment: "Regular", count: 8400, revenue: 1200000, pct: 42 },
          { segment: "Student", count: 2800, revenue: 420000, pct: 15 },
          { segment: "Family", count: 1600, revenue: 330000, pct: 12 }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /bookings - Full Booking Management
router.get("/bookings", async (req: Request, res: Response) => {
  try {
    res.json({
      stats: {
        totalToday: 342,
        confirmed: 298,
        cancelled: 18,
        pending: 26,
        totalRevenue: 285600,
        avgBookingValue: 835,
        refundsPending: 5,
        refundsProcessed: 12
      },
      bookings: [
        { id: "bk-7849c", customer: "Priya Sharma", movie: "Aether: Rising Stars", screen: "Screen 1 IMAX", seats: "E-11, E-12", showtime: "07:30 PM", date: "2026-07-18", amount: 1640, paymentMethod: "UPI", status: "CONFIRMED", checkedIn: false, foodOrder: true },
        { id: "bk-8901a", customer: "Rajesh Kumar", movie: "Shadows of the Dynasty", screen: "Screen 2 Dolby", seats: "D-8, D-9, D-10", showtime: "04:15 PM", date: "2026-07-18", amount: 1890, paymentMethod: "Card", status: "CONFIRMED", checkedIn: true, foodOrder: true },
        { id: "bk-6123b", customer: "Ananya Patel", movie: "Cosmic Horizons 3D", screen: "Screen 3", seats: "G-5", showtime: "10:00 AM", date: "2026-07-18", amount: 420, paymentMethod: "Wallet", status: "CONFIRMED", checkedIn: false, foodOrder: false },
        { id: "bk-4502d", customer: "Vikram Mehta", movie: "Aether: Rising Stars", screen: "Screen 1 IMAX", seats: "B-3, B-4", showtime: "10:30 PM", date: "2026-07-18", amount: 2200, paymentMethod: "UPI", status: "CANCELLED", checkedIn: false, foodOrder: false },
        { id: "bk-3377e", customer: "Sneha Reddy", movie: "Monsoon Melodies", screen: "Screen 4", seats: "F-12, F-13, F-14, F-15", showtime: "01:00 PM", date: "2026-07-18", amount: 1680, paymentMethod: "Net Banking", status: "CONFIRMED", checkedIn: true, foodOrder: true },
        { id: "bk-9012f", customer: "Deepak Nair", movie: "Shadows of the Dynasty", screen: "Screen 2 Dolby", seats: "H-1", showtime: "07:30 PM", date: "2026-07-18", amount: 540, paymentMethod: "Card", status: "PENDING", checkedIn: false, foodOrder: false }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /offers - All Offers & Coupons
router.get("/offers", async (_req: Request, res: Response) => {
  try {
    res.json({
      offers: [
        { id: "off-1", title: "Monsoon Mania 50% Off", type: "MOVIE", discount: 50, discountType: "PERCENTAGE", code: "MONSOON50", validFrom: "2026-07-01", validTo: "2026-07-31", minBooking: 500, usageLimit: 1000, usedCount: 342, applicableMovies: "All", applicableUsers: "ALL", status: "ACTIVE", banner: "/offers/monsoon.jpg" },
        { id: "off-2", title: "Student Weekend Pass", type: "STUDENT", discount: 200, discountType: "FIXED", code: "STUDENT200", validFrom: "2026-07-01", validTo: "2026-12-31", minBooking: 300, usageLimit: 5000, usedCount: 890, applicableMovies: "All", applicableUsers: "STUDENT", status: "ACTIVE", banner: "/offers/student.jpg" },
        { id: "off-3", title: "Family Sunday Funday", type: "WEEKEND", discount: 30, discountType: "PERCENTAGE", code: "FAMILY30", validFrom: "2026-07-01", validTo: "2026-09-30", minBooking: 1000, usageLimit: 2000, usedCount: 456, applicableMovies: "All", applicableUsers: "FAMILY", status: "ACTIVE", banner: "/offers/family.jpg" },
        { id: "off-4", title: "VIP Premiere Night", type: "MEMBERSHIP", discount: 40, discountType: "PERCENTAGE", code: "VIP40", validFrom: "2026-07-15", validTo: "2026-07-20", minBooking: 800, usageLimit: 200, usedCount: 78, applicableMovies: "Aether: Rising Stars", applicableUsers: "VIP_GOLD,PLATINUM", status: "ACTIVE", banner: "/offers/vip.jpg" },
        { id: "off-5", title: "Popcorn Combo ₹99", type: "FOOD", discount: 99, discountType: "FIXED", code: "COMBO99", validFrom: "2026-07-01", validTo: "2026-08-31", minBooking: 0, usageLimit: 10000, usedCount: 2340, applicableMovies: "All", applicableUsers: "ALL", status: "ACTIVE", banner: "/offers/combo.jpg" },
        { id: "off-6", title: "Festival Diwali Special", type: "FESTIVAL", discount: 60, discountType: "PERCENTAGE", code: "DIWALI60", validFrom: "2026-10-20", validTo: "2026-11-05", minBooking: 400, usageLimit: 3000, usedCount: 0, applicableMovies: "All", applicableUsers: "ALL", status: "SCHEDULED", banner: "/offers/diwali.jpg" }
      ],
      coupons: [
        { id: "cpn-1", code: "PRESTIGE50", type: "PERCENTAGE", value: 50, maxDiscount: 500, minOrder: 500, usageLimit: 1000, usedCount: 342, validTo: "2026-08-31", autoApply: false, customerGroup: "ALL", status: "ACTIVE", revenueGenerated: 171000 },
        { id: "cpn-2", code: "WELCOME100", type: "FIXED", value: 100, maxDiscount: 100, minOrder: 200, usageLimit: 5000, usedCount: 1245, validTo: "2026-12-31", autoApply: true, customerGroup: "NEW_USERS", status: "ACTIVE", revenueGenerated: 124500 },
        { id: "cpn-3", code: "BIRTHDAY500", type: "FIXED", value: 500, maxDiscount: 500, minOrder: 800, usageLimit: 500, usedCount: 89, validTo: "2026-12-31", autoApply: true, customerGroup: "BIRTHDAY_MONTH", status: "ACTIVE", revenueGenerated: 44500 },
        { id: "cpn-4", code: "LOYALTY200", type: "FIXED", value: 200, maxDiscount: 200, minOrder: 400, usageLimit: 2000, usedCount: 567, validTo: "2026-09-30", autoApply: false, customerGroup: "PLATINUM", status: "ACTIVE", revenueGenerated: 113400 }
      ],
      analytics: {
        totalOffers: 6,
        activeOffers: 5,
        totalCoupons: 4,
        totalRedemptions: 5059,
        totalRevenueGenerated: 453400,
        avgDiscountValue: 180,
        topCoupon: "PRESTIGE50",
        conversionRate: 34.2
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /shows - Show Management
router.get("/shows", async (_req: Request, res: Response) => {
  try {
    res.json({
      shows: [
        { id: "sh-1", movie: "Aether: Rising Stars", screen: "Screen 1 IMAX", date: "2026-07-18", time: "10:00 AM", duration: "2h 35m", totalSeats: 180, booked: 142, available: 38, basePrice: 350, vipPrice: 650, revenue: 68400, status: "OPEN" },
        { id: "sh-2", movie: "Aether: Rising Stars", screen: "Screen 1 IMAX", date: "2026-07-18", time: "01:30 PM", duration: "2h 35m", totalSeats: 180, booked: 165, available: 15, basePrice: 380, vipPrice: 720, revenue: 82500, status: "ALMOST_FULL" },
        { id: "sh-3", movie: "Aether: Rising Stars", screen: "Screen 1 IMAX", date: "2026-07-18", time: "04:15 PM", duration: "2h 35m", totalSeats: 180, booked: 89, available: 91, basePrice: 350, vipPrice: 650, revenue: 42800, status: "OPEN" },
        { id: "sh-4", movie: "Aether: Rising Stars", screen: "Screen 1 IMAX", date: "2026-07-18", time: "07:30 PM", duration: "2h 35m", totalSeats: 180, booked: 178, available: 2, basePrice: 420, vipPrice: 850, revenue: 108600, status: "ALMOST_FULL" },
        { id: "sh-5", movie: "Aether: Rising Stars", screen: "Screen 1 IMAX", date: "2026-07-18", time: "10:30 PM", duration: "2h 35m", totalSeats: 180, booked: 56, available: 124, basePrice: 300, vipPrice: 550, revenue: 24200, status: "OPEN" },
        { id: "sh-6", movie: "Shadows of the Dynasty", screen: "Screen 2 Dolby", date: "2026-07-18", time: "11:00 AM", duration: "2h 15m", totalSeats: 150, booked: 92, available: 58, basePrice: 280, vipPrice: 520, revenue: 38400, status: "OPEN" },
        { id: "sh-7", movie: "Shadows of the Dynasty", screen: "Screen 2 Dolby", date: "2026-07-18", time: "04:00 PM", duration: "2h 15m", totalSeats: 150, booked: 134, available: 16, basePrice: 300, vipPrice: 580, revenue: 52800, status: "ALMOST_FULL" },
        { id: "sh-8", movie: "Monsoon Melodies", screen: "Screen 4", date: "2026-07-18", time: "01:00 PM", duration: "2h 5m", totalSeats: 120, booked: 78, available: 42, basePrice: 220, vipPrice: 420, revenue: 21600, status: "OPEN" }
      ],
      summary: {
        totalShows: 8,
        totalSeats: 1320,
        totalBooked: 934,
        totalAvailable: 386,
        occupancyRate: 70.8,
        totalRevenue: 439300,
        peakShow: "Aether 07:30 PM (98.9% full)",
        lowShow: "Aether 10:30 PM (31.1% full)"
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
