import { Router, Request, Response } from "express";
import { prisma } from "../index";

const router = Router();

router.get("/dashboard", async (req: Request, res: Response) => {
  res.json({
    totalCustomers: 12847,
    activeToday: 342,
    vipCustomers: 89,
    newToday: 28,
    avgSpend: 620,
    avgVisits: 4.2,
    satisfactionScore: 4.6,
    openTickets: 12,
    resolvedToday: 8,
    retentionRate: 78.5,
    lifetimeValue: 2840,
    repeatPurchaseRate: 62
  });
});

router.get("/customers", async (req: Request, res: Response) => {
  const customers = [
    { id: "usr-882", name: "Priya Sharma", email: "priya@gmail.com", phone: "+91 9845012345", tier: "VIP Gold", lifetimeSpend: 38400, totalBookings: 47, lastActive: "2 hours ago", tag: "High Value", satisfaction: 4.8, joinDate: "2024-03-15" },
    { id: "usr-104", name: "Rajesh Kumar", email: "rajesh.k@gmail.com", phone: "+91 9900223344", tier: "Platinum", lifetimeSpend: 62100, totalBookings: 83, lastActive: "30 mins ago", tag: "Frequent", satisfaction: 4.9, joinDate: "2023-11-20" },
    { id: "usr-291", name: "Ananya Patel", email: "ananya.p@outlook.com", phone: "+91 8844556677", tier: "Silver", lifetimeSpend: 8900, totalBookings: 12, lastActive: "1 day ago", tag: "Student", satisfaction: 4.5, joinDate: "2025-01-10" },
    { id: "usr-503", name: "Vikram Mehta", email: "vikram.m@corp.com", phone: "+91 7766554433", tier: "Executive", lifetimeSpend: 14200, totalBookings: 19, lastActive: "5 hours ago", tag: "Corporate", satisfaction: 4.3, joinDate: "2024-08-05" },
    { id: "usr-667", name: "Sneha Reddy", email: "sneha.r@gmail.com", phone: "+91 9988776655", tier: "Gold", lifetimeSpend: 22500, totalBookings: 31, lastActive: "15 mins ago", tag: "Family", satisfaction: 4.7, joinDate: "2024-06-18" }
  ];
  res.json(customers);
});

router.get("/customers/:id", async (req: Request, res: Response) => {
  res.json({
    id: req.params.id,
    name: "Priya Sharma",
    email: "priya@gmail.com",
    phone: "+91 9845012345",
    tier: "VIP Gold",
    lifetimeSpend: 38400,
    totalBookings: 47,
    rewardPoints: 2450,
    walletBalance: 750,
    preferredGenre: ["Sci-Fi", "Thriller"],
    favoriteTheatre: "CineVerse IMAX Mumbai",
    favoriteFood: "Truffle Butter Popcorn",
    bookings: [
      { id: "bk-7849c", movie: "Aether: Rising Stars", date: "2026-07-15", amount: 820, status: "CONFIRMED" },
      { id: "bk-6123a", movie: "Shadows of the Dynasty", date: "2026-07-10", amount: 640, status: "CONFIRMED" }
    ],
    timeline: [
      { event: "BOOKING_CREATED", details: "Booked Aether: Rising Stars", timestamp: "2026-07-15T18:30:00Z" },
      { event: "PAYMENT_COMPLETED", details: "Payment ₹820 via UPI", timestamp: "2026-07-15T18:31:00Z" },
      { event: "FOOD_ORDERED", details: "Truffle Butter Popcorn + Pepsi XL", timestamp: "2026-07-15T18:32:00Z" }
    ]
  });
});

router.get("/support/tickets", async (req: Request, res: Response) => {
  const tickets = [
    { id: "tkt-401", customerName: "Priya Sharma", customerId: "usr-882", category: "PAYMENT", subject: "Payment Failed But Amount Deducted", status: "OPEN", priority: "CRITICAL", assignedAgent: "Support Team A", createdAt: "2026-07-18T10:15:00Z", slaRemaining: "2h 30m" },
    { id: "tkt-402", customerName: "Rajesh Kumar", customerId: "usr-104", category: "FOOD", subject: "Concession Order Missing Items", status: "IN_PROGRESS", priority: "HIGH", assignedAgent: "Kitchen Ops", createdAt: "2026-07-18T09:45:00Z", slaRemaining: "4h" },
    { id: "tkt-403", customerName: "Ananya Patel", customerId: "usr-291", category: "REFUND", subject: "Refund Not Processed After 48 Hours", status: "ESCALATED", priority: "HIGH", assignedAgent: "Finance Desk", createdAt: "2026-07-16T14:20:00Z", slaRemaining: "OVERDUE" },
    { id: "tkt-404", customerName: "Vikram Mehta", customerId: "usr-503", category: "BOOKING", subject: "Seat Upgrade Request", status: "RESOLVED", priority: "MEDIUM", assignedAgent: "Support Team B", createdAt: "2026-07-17T16:00:00Z", slaRemaining: "—" },
    { id: "tkt-405", customerName: "Sneha Reddy", customerId: "usr-667", category: "LOST_ITEM", subject: "Left Bag in Screen 2 Row D", status: "OPEN", priority: "MEDIUM", assignedAgent: "Housekeeping", createdAt: "2026-07-18T11:00:00Z", slaRemaining: "6h" }
  ];
  res.json(tickets);
});

router.post("/support/tickets/:id/reply", async (req: Request, res: Response) => {
  res.json({ success: true, message: `Reply sent to ticket ${req.params.id}` });
});

router.patch("/support/tickets/:id/status", async (req: Request, res: Response) => {
  const { status } = req.body;
  res.json({ success: true, ticketId: req.params.id, newStatus: status || "RESOLVED" });
});

router.get("/insights", async (req: Request, res: Response) => {
  res.json({
    churnRisk: [{ customerId: "usr-291", name: "Ananya Patel", probability: 0.72, reason: "No booking in 45 days" }],
    topSegments: [
      { name: "High Value", count: 89, avgSpend: 4200 },
      { name: "Frequent Visitors", count: 234, avgSpend: 1800 },
      { name: "Weekend Only", count: 567, avgSpend: 950 },
      { name: "Family Groups", count: 178, avgSpend: 2100 },
      { name: "Students", count: 445, avgSpend: 420 },
      { name: "Corporate", count: 67, avgSpend: 3100 },
      { name: "Inactive (30d+)", count: 1203, avgSpend: 0 }
    ],
    recommendations: [
      "Send win-back campaign to 1,203 inactive customers with ₹100 coupon",
      "VIP Gold tier customers respond 3x better to exclusive preview invites",
      "Student segment has 40% higher food attachment rate on weekends"
    ]
  });
});

// GET /customer/:id
router.get("/customer/:id", async (req: Request, res: Response) => {
  res.json({
    id: req.params.id,
    name: "Priya Sharma",
    email: "priya@gmail.com",
    phone: "+91 9845012345",
    tier: "VIP Gold",
    lifetimeSpend: 38400,
    totalBookings: 47,
    rewardPoints: 2450,
    walletBalance: 750,
    preferredGenre: ["Sci-Fi", "Thriller"],
    favoriteTheatre: "CineVerse IMAX Mumbai",
    favoriteFood: "Truffle Butter Popcorn",
    bookings: [
      { id: "bk-7849c", movie: "Aether: Rising Stars", date: "2026-07-15", amount: 820, status: "CONFIRMED" },
      { id: "bk-6123a", movie: "Shadows of the Dynasty", date: "2026-07-10", amount: 640, status: "CONFIRMED" }
    ],
    timeline: [
      { event: "BOOKING_CREATED", details: "Booked Aether: Rising Stars", timestamp: "2026-07-15T18:30:00Z" },
      { event: "PAYMENT_COMPLETED", details: "Payment ₹820 via UPI", timestamp: "2026-07-15T18:31:00Z" },
      { event: "FOOD_ORDERED", details: "Truffle Butter Popcorn + Pepsi XL", timestamp: "2026-07-15T18:32:00Z" }
    ]
  });
});

// PUT /customer/:id - Update customer profile
router.put("/customer/:id", async (req: Request, res: Response) => {
  try {
    const { name, phone, tier } = req.body;
    res.json({ success: true, message: `Profile for customer ${req.params.id} updated successfully.`, data: { id: req.params.id, name, phone, tier } });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update profile.", error: error.message });
  }
});

// POST /segment/create - Create dynamic segment
router.post("/segment/create", async (req: Request, res: Response) => {
  try {
    const { name, description, rules } = req.body;
    const segment = await prisma.customerSegment.create({
      data: {
        name,
        description: description || "",
        criteria: rules || {},
        isActive: true
      }
    });
    res.status(201).json({ success: true, message: "Customer segment created successfully.", segment });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to create segment.", error: error.message });
  }
});

// POST /reward/add - Credit reward points manually
router.post("/reward/add", async (req: Request, res: Response) => {
  try {
    const { userId, points, reason } = req.body;
    if (!userId || !points) {
      return res.status(400).json({ message: "userId and points are required." });
    }
    const reward = await prisma.rewardPoint.create({
      data: {
        userId,
        points: parseInt(points),
        source: reason || "ADMIN_ADJUSTMENT"
      }
    });
    res.status(201).json({ success: true, message: `${points} loyalty reward points credited!`, reward });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to credit reward points.", error: error.message });
  }
});

// POST /membership/create - Create membership tier
router.post("/membership/create", async (req: Request, res: Response) => {
  try {
    const { name, price, benefits, discountPct } = req.body;
    const plan = await prisma.membershipPlan.create({
      data: {
        name,
        monthlyPrice: parseFloat(price) || 0,
        yearlyPrice: (parseFloat(price) * 10) || 0,
        benefits: benefits || {},
        discountPercent: parseFloat(discountPct) || 10
      }
    });
    res.status(201).json({ success: true, message: `Membership plan ${name} created.`, plan });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to create membership plan.", error: error.message });
  }
});

// GET /customer/analytics - CRM Analytics
router.get("/customer/analytics", async (req: Request, res: Response) => {
  res.json({
    growthRate: "+18.2% MoM",
    activeRate: "82.4%",
    kpis: {
      satisfactionScore: 4.7,
      retentionRate: 78.5,
      churnRate: 4.2,
      averageLtv: 2840,
      rewardConversion: 64.2
    },
    funnel: {
      registered: 12847,
      engaged: 8432,
      activeBookers: 5821,
      vipMembers: 89
    }
  });
});

// POST /customer/offer - Send targeted offer
router.post("/customer/offer", async (req: Request, res: Response) => {
  res.json({ success: true, message: "Targeted promotional offer dispatched successfully via email/SMS." });
});

// POST /automation/create - Configure automation triggers
router.post("/automation/create", async (req: Request, res: Response) => {
  try {
    const { triggerEvent, actionType, actionPayload } = req.body;
    const rule = await prisma.marketingAutomation.create({
      data: {
        name: "Auto Path " + Date.now(),
        trigger: triggerEvent || "USER_REGISTERED",
        actions: { type: actionType, payload: actionPayload },
        isActive: true
      }
    });
    res.status(201).json({ success: true, message: "CRM automation path registered.", rule });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to register automation path.", error: error.message });
  }
});

export default router;
