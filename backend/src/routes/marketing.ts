import { Router, Request, Response } from "express";

const router = Router();

// GET /dashboard - Marketing analytics
router.get("/dashboard", async (_req: Request, res: Response) => {
  res.json({
    campaignRevenue: 284500,
    campaignROI: 340,
    couponsRedeemed: 1247,
    couponsExpired: 89,
    membershipRevenue: 428000,
    membershipGrowth: 12.5,
    referralRevenue: 67800,
    rewardPointsIssued: 184500,
    rewardPointsRedeemed: 92400,
    cashbackIssued: 34200,
    repeatCustomers: 68,
    customerRetention: 78.5,
    conversionRate: 4.8,
    emailOpenRate: 42.3,
    emailClickRate: 12.8,
    pushCTR: 8.5,
    whatsappCTR: 22.4,
    smsCTR: 6.2,
    customerLTV: 2840,
    activeMemberships: 1247,
    totalCouponsActive: 18,
    totalCampaignsActive: 7,
    totalReferrals: 342
  });
});

// GET /memberships - Membership plans
router.get("/memberships", async (_req: Request, res: Response) => {
  const plans = [
    { id: "mp-1", name: "Silver Screen", tier: "Silver", monthlyPrice: 299, yearlyPrice: 2999, members: 456, discount: 5, foodDiscount: 10, bonusPoints: 100, priorityBooking: false, freeParking: false, loungeAccess: false, color: "#94A3B8" },
    { id: "mp-2", name: "Gold Star", tier: "Gold", monthlyPrice: 599, yearlyPrice: 5999, members: 312, discount: 10, foodDiscount: 15, bonusPoints: 250, priorityBooking: true, freeParking: false, loungeAccess: false, color: "#F59E0B" },
    { id: "mp-3", name: "Platinum Elite", tier: "Platinum", monthlyPrice: 999, yearlyPrice: 9999, members: 189, discount: 15, foodDiscount: 20, bonusPoints: 500, priorityBooking: true, freeParking: true, loungeAccess: false, color: "#A78BFA" },
    { id: "mp-4", name: "Diamond VIP", tier: "Diamond", monthlyPrice: 1999, yearlyPrice: 19999, members: 67, discount: 25, foodDiscount: 30, bonusPoints: 1000, priorityBooking: true, freeParking: true, loungeAccess: true, color: "#06B6D4" },
    { id: "mp-5", name: "Black Card", tier: "Black", monthlyPrice: 4999, yearlyPrice: 49999, members: 23, discount: 40, foodDiscount: 50, bonusPoints: 2500, priorityBooking: true, freeParking: true, loungeAccess: true, color: "#1E1E1E" }
  ];
  res.json(plans);
});

// GET /coupons - Active coupons
router.get("/coupons", async (_req: Request, res: Response) => {
  const coupons = [
    { id: "cpn-1", code: "WELCOME50", title: "Welcome Offer", type: "PERCENTAGE", value: 50, maxDiscount: 200, minOrder: 300, usageLimit: 5000, used: 1247, perCustomer: 1, expires: "2026-08-31", status: "ACTIVE" },
    { id: "cpn-2", code: "WEEKEND30", title: "Weekend Special", type: "FLAT", value: 30, maxDiscount: null, minOrder: 200, usageLimit: 2000, used: 834, perCustomer: 3, expires: "2026-07-31", status: "ACTIVE" },
    { id: "cpn-3", code: "BOGO2026", title: "Buy 1 Get 1 Free", type: "BOGO", value: 100, maxDiscount: 500, minOrder: 400, usageLimit: 1000, used: 467, perCustomer: 1, expires: "2026-09-30", status: "ACTIVE" },
    { id: "cpn-4", code: "FOOD20", title: "Food 20% Off", type: "PERCENTAGE", value: 20, maxDiscount: 150, minOrder: 200, usageLimit: 3000, used: 1890, perCustomer: 5, expires: "2026-07-25", status: "ACTIVE" },
    { id: "cpn-5", code: "BIRTHDAY100", title: "Birthday Gift", type: "FLAT", value: 100, maxDiscount: null, minOrder: 0, usageLimit: 10000, used: 342, perCustomer: 1, expires: "2026-12-31", status: "ACTIVE" },
    { id: "cpn-6", code: "IMAX150", title: "IMAX Discount", type: "FLAT", value: 150, maxDiscount: null, minOrder: 500, usageLimit: 500, used: 500, perCustomer: 1, expires: "2026-07-15", status: "EXPIRED" }
  ];
  res.json(coupons);
});

// GET /referrals - Referral stats
router.get("/referrals", async (_req: Request, res: Response) => {
  res.json({
    totalReferrals: 342,
    convertedReferrals: 218,
    conversionRate: 63.7,
    totalRewardsGiven: 67800,
    referrerReward: 200,
    referredReward: 100,
    topReferrers: [
      { name: "Priya Sharma", referrals: 24, earnings: 4800 },
      { name: "Rajesh Kumar", referrals: 18, earnings: 3600 },
      { name: "Sneha Reddy", referrals: 15, earnings: 3000 },
      { name: "Vikram Mehta", referrals: 12, earnings: 2400 },
      { name: "Ananya Patel", referrals: 9, earnings: 1800 }
    ]
  });
});

// GET /campaigns - Marketing campaigns
router.get("/campaigns", async (_req: Request, res: Response) => {
  const campaigns = [
    { id: "cmp-1", name: "Summer Blockbuster Launch", channel: "EMAIL", status: "ACTIVE", segment: "All Customers", sent: 12847, opened: 5434, clicked: 1642, conversions: 412, revenue: 84600, budget: 5000, roi: 1592 },
    { id: "cmp-2", name: "Weekend Food Fest", channel: "PUSH", status: "ACTIVE", segment: "Food Lovers", sent: 4500, opened: 2700, clicked: 945, conversions: 234, revenue: 46800, budget: 2000, roi: 2240 },
    { id: "cmp-3", name: "VIP Exclusive Preview", channel: "WHATSAPP", status: "COMPLETED", segment: "VIP Members", sent: 89, opened: 82, clicked: 67, conversions: 45, revenue: 67500, budget: 500, roi: 13400 },
    { id: "cmp-4", name: "Win-Back Inactive Users", channel: "SMS", status: "ACTIVE", segment: "Inactive 30d+", sent: 1203, opened: 420, clicked: 156, conversions: 42, revenue: 12600, budget: 3000, roi: 320 },
    { id: "cmp-5", name: "Birthday Month Special", channel: "EMAIL", status: "SCHEDULED", segment: "July Birthdays", sent: 0, opened: 0, clicked: 0, conversions: 0, revenue: 0, budget: 1000, roi: 0 },
    { id: "cmp-6", name: "Membership Upgrade Push", channel: "IN_APP", status: "DRAFT", segment: "Silver Members", sent: 0, opened: 0, clicked: 0, conversions: 0, revenue: 0, budget: 1500, roi: 0 }
  ];
  res.json(campaigns);
});

// GET /automations - Marketing automation workflows
router.get("/automations", async (_req: Request, res: Response) => {
  const automations = [
    { id: "auto-1", name: "Welcome Flow", trigger: "Customer Registers", steps: 5, executions: 2847, isActive: true, lastRun: "2h ago" },
    { id: "auto-2", name: "Abandoned Booking Recovery", trigger: "Booking Not Completed (30m)", steps: 3, executions: 456, isActive: true, lastRun: "15m ago" },
    { id: "auto-3", name: "Birthday Celebration", trigger: "Customer Birthday", steps: 4, executions: 342, isActive: true, lastRun: "6h ago" },
    { id: "auto-4", name: "Loyalty Milestone Reward", trigger: "Points Reach 1000", steps: 2, executions: 189, isActive: true, lastRun: "1d ago" },
    { id: "auto-5", name: "Win-Back Campaign", trigger: "No Visit in 30 Days", steps: 6, executions: 1203, isActive: true, lastRun: "3h ago" },
    { id: "auto-6", name: "Membership Renewal", trigger: "7 Days Before Expiry", steps: 3, executions: 67, isActive: false, lastRun: "5d ago" }
  ];
  res.json(automations);
});

// GET /segments - Customer segments
router.get("/segments", async (_req: Request, res: Response) => {
  const segments = [
    { id: "seg-1", name: "High Spenders", count: 89, avgSpend: 4200, color: "#F59E0B", auto: true },
    { id: "seg-2", name: "Frequent Visitors", count: 234, avgSpend: 1800, color: "#10B981", auto: true },
    { id: "seg-3", name: "Weekend Warriors", count: 567, avgSpend: 950, color: "#3B82F6", auto: true },
    { id: "seg-4", name: "Family Groups", count: 178, avgSpend: 2100, color: "#8B5CF6", auto: true },
    { id: "seg-5", name: "Students", count: 445, avgSpend: 420, color: "#06B6D4", auto: false },
    { id: "seg-6", name: "Corporate", count: 67, avgSpend: 3100, color: "#EC4899", auto: false },
    { id: "seg-7", name: "Food Enthusiasts", count: 312, avgSpend: 1450, color: "#F97316", auto: true },
    { id: "seg-8", name: "Inactive (30d+)", count: 1203, avgSpend: 0, color: "#EF4444", auto: true },
    { id: "seg-9", name: "New Users (7d)", count: 156, avgSpend: 380, color: "#14B8A6", auto: true },
    { id: "seg-10", name: "Premium Members", count: 279, avgSpend: 3400, color: "#A78BFA", auto: false }
  ];
  res.json(segments);
});

// GET /scratch-cards - Scratch card campaigns
router.get("/scratch-cards", async (_req: Request, res: Response) => {
  const cards = [
    { id: "sc-1", name: "Summer Scratch Fest", reward: "₹50-₹500 Cashback", probability: 0.7, total: 5000, scratched: 3240, isActive: true },
    { id: "sc-2", name: "Food Frenzy", reward: "Free Popcorn / Drink", probability: 0.5, total: 2000, scratched: 1456, isActive: true },
    { id: "sc-3", name: "Movie Mania", reward: "Free Ticket", probability: 0.1, total: 1000, scratched: 890, isActive: false }
  ];
  res.json(cards);
});

// GET /lucky-draws - Lucky draw campaigns
router.get("/lucky-draws", async (_req: Request, res: Response) => {
  const draws = [
    { id: "ld-1", name: "Grand Independence Day Draw", prize: "iPhone 16 Pro", entries: 4500, drawn: false, drawDate: "2026-08-15" },
    { id: "ld-2", name: "Monsoon Madness", prize: "Gold Coin (5g)", entries: 2800, drawn: false, drawDate: "2026-08-01" },
    { id: "ld-3", name: "Summer Movie Marathon", prize: "Annual Movie Pass", entries: 6200, drawn: true, winner: "Priya Sharma", drawDate: "2026-06-30" }
  ];
  res.json(draws);
});

export default router;
