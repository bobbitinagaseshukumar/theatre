import { Router, Request, Response } from "express";

const router = Router();

// GET /dashboard - Analytics Overview & Executive Metrics
router.get("/dashboard", async (_req: Request, res: Response) => {
  res.json({
    businessHealthScore: 88,
    metrics: {
      revenueGrowth: 12.4,
      customerGrowth: 8.2,
      profitability: 24.5,
      occupancy: 76.5,
      foodPerformance: 18.2,
      marketingPerformance: 14.8,
      employeeEfficiency: 91.2,
      customerSatisfaction: 4.6,
      securityLevel: 96.0,
      financialStability: 94.0
    },
    todaySummary: {
      revenue: 142850,
      profit: 34200,
      ticketsSold: 412,
      foodOrders: 127,
      customerCount: 384,
      occupancyPercent: 78.5,
      topMovie: "Aether: Rising Stars",
      topFoodItem: "Truffle Butter Popcorn",
      bestScreen: "IMAX Screen 1",
      bestTheatre: "CineVerse Delhi VIP"
    },
    anomalies: [
      { id: "an-1", type: "UNUSUAL_REFUND", details: "Refund attempt of ₹8,200 on corporate seat block rejected.", time: "2 hours ago" },
      { id: "an-2", type: "VELOCITY_ALERT", details: "Failed payment count spike (12) from IP range 103.44.x.x.", time: "4 hours ago" }
    ],
    aiInsights: [
      "EBITDA increased by 4.2% due to premium seat upgrades demand on weekend IMAX showtimes.",
      "Concession attachment rate is 14% higher during Sci-Fi blockbusters; prioritize Truffle Combo stocking."
    ]
  });
});

// GET /revenue - Coordinate graph timelines
router.get("/revenue", async (_req: Request, res: Response) => {
  res.json({
    dailyTimeline: [
      { time: "09:00", revenue: 12000 },
      { time: "12:00", revenue: 45000 },
      { time: "15:00", revenue: 62000 },
      { time: "18:00", revenue: 115000 },
      { time: "21:00", revenue: 142850 }
    ],
    paymentMethods: [
      { name: "UPI Pay", value: 65, color: "#3B82F6" },
      { name: "Credit Card", value: 20, color: "#F59E0B" },
      { name: "Debit Card", value: 10, color: "#10B981" },
      { name: "Cinema Wallet", value: 5, color: "#EC4899" }
    ]
  });
});

// GET /movie - Movie analytical leaderboard
router.get("/movie", async (_req: Request, res: Response) => {
  res.json([
    { rank: 1, movieName: "Aether: Rising Stars", genre: "Sci-Fi", ticketsSold: 14203, revenue: 4865000, occupancy: 92, rating: 4.8 },
    { rank: 2, movieName: "Shadows of the Dynasty", genre: "Action", ticketsSold: 9845, revenue: 3120000, occupancy: 78, rating: 4.5 },
    { rank: 3, movieName: "Echoes in the Dark", genre: "Horror", ticketsSold: 6420, revenue: 1980000, occupancy: 65, rating: 4.2 },
    { rank: 4, movieName: "Truffle Comedy Night", genre: "Comedy", ticketsSold: 4120, revenue: 1250000, occupancy: 58, rating: 4.4 }
  ]);
});

// GET /customer - Churn risk & lifetime values
router.get("/customer", async (_req: Request, res: Response) => {
  res.json({
    cohorts: [
      { name: "Active (Weekly)", count: 2847, spend: 1850 },
      { name: "Frequent (Monthly)", count: 4200, spend: 950 },
      { name: "Slipping (Inactive 30d)", count: 1203, spend: 620 },
      { name: "Churn Risk (Inactive 60d)", count: 445, spend: 410 }
    ],
    funnel: [
      { stage: "Website Visit", count: 12000, rate: 100 },
      { stage: "Movie Search", count: 8500, rate: 70.8 },
      { stage: "Seat Selection", count: 4200, rate: 35.0 },
      { stage: "Food Attachment", count: 2800, rate: 23.3 },
      { stage: "Payment Done", count: 2150, rate: 17.9 }
    ]
  });
});

// GET /food - F&B analytics reports
router.get("/food", async (_req: Request, res: Response) => {
  res.json({
    sales: [
      { name: "Truffle Butter Popcorn", sold: 6420, profitMargin: 82 },
      { name: "Pepsi Fountain XL", sold: 8900, profitMargin: 90 },
      { name: "Wild Mushroom Pizza", sold: 1840, profitMargin: 65 },
      { name: "Caramel Gold Crunch", sold: 3120, profitMargin: 78 }
    ]
  });
});

// GET /report - Saved report templates
router.get("/report", async (_req: Request, res: Response) => {
  res.json([
    { id: "rep-1", name: "Monthly CFO Profit & Loss Statement", category: "FINANCE", scheduled: "Monthly", format: "PDF" },
    { id: "rep-2", name: "Weekly F&B Inventory Wastage Audit", category: "FOOD", scheduled: "Weekly", format: "Excel" },
    { id: "rep-3", name: "Daily Box Office Occupancy Heatmap", category: "REVENUE", scheduled: "Daily", format: "JSON" }
  ]);
});

// POST /report/create - Save dynamic reports config
router.post("/report/create", async (req: Request, res: Response) => {
  const { name, category, config } = req.body;
  res.status(201).json({
    id: "rep-" + Math.floor(Math.random() * 1000 + 10),
    name,
    category,
    config,
    createdAt: new Date()
  });
});

// POST /report/export - Simulate document downloads
router.post("/report/export", async (req: Request, res: Response) => {
  const { format, reportId } = req.body;
  res.json({
    success: true,
    reportId,
    format,
    downloadUrl: `https://cinemapromax.com/reports/download/${reportId}.${format.toLowerCase()}`,
    fileSize: "4.8 MB",
    generatedAt: new Date()
  });
});

// POST /ai/analyze - NLP Q&A analysis
router.post("/ai/analyze", async (req: Request, res: Response) => {
  const { question } = req.body;
  let answer = "";
  if (question.toLowerCase().includes("revenue")) {
    answer = "Revenue today is at ₹1,42,850 (+12.4% vs yesterday) driven by high occupancy on evening shows of 'Aether: Rising Stars'.";
  } else if (question.toLowerCase().includes("food")) {
    answer = "Truffle Butter Popcorn accounts for 42% of F&B profit margins today. attachment rate is currently sitting at 23.3%.";
  } else {
    answer = "Overall business health score is 88. Customer retention is stable. Recommend keeping screen allocation for Sci-Fi genres high.";
  }

  res.json({
    question,
    answer,
    confidenceScore: 0.96,
    insightImpact: "+4.2% operational efficiency gain predicted."
  });
});

// GET /forecast - Predictive future projections
router.get("/forecast", async (_req: Request, res: Response) => {
  res.json([
    { period: "Next Week", revenue: 1540000, foodDemand: "High (+12%)", staffNeed: "Standard", confidence: 94 },
    { period: "Next Month", revenue: 6200000, foodDemand: "Medium (+4%)", staffNeed: "High (+8%)", confidence: 91 },
    { period: "Next Quarter", revenue: 19800000, foodDemand: "High (+15%)", staffNeed: "Peak Staffing", confidence: 85 }
  ]);
});

export default router;
