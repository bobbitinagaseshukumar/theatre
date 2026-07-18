import { Router, Request, Response } from "express";

const router = Router();

// GET /finance/dashboard - Financial KPIs & overview
router.get("/dashboard", async (_req: Request, res: Response) => {
  res.json({
    todayRevenue: 142850,
    yesterdayRevenue: 135400,
    weeklyRevenue: 984500,
    monthlyRevenue: 4284000,
    yearlyRevenue: 51240000,
    ticketRevenue: 2741760,
    foodRevenue: 1542240,
    parkingRevenue: 128500,
    membershipRevenue: 428000,
    advertisingRevenue: 150000,
    giftCardRevenue: 85000,
    corporateBookingRevenue: 320000,
    onlinePayments: 3427200,
    offlinePayments: 856800,
    walletRevenue: 214200,
    cashRevenue: 642600,
    upiRevenue: 2570400,
    creditCardRevenue: 856800,
    netProfit: 1284500,
    grossProfit: 2541760,
    operatingProfit: 1845000,
    expenses: 1257260,
    refunds: 42500,
    pendingSettlements: 120000,
    taxesCollected: 485400,
    avgTicketValue: 342,
    avgFoodOrderValue: 284,
    avgCustomerSpend: 626,
    customerLTV: 2840,
    businessHealthScore: 94
  });
});

// GET /revenue - Detailed revenue breakdown
router.get("/revenue", async (_req: Request, res: Response) => {
  res.json([
    { category: "Movie Tickets", amount: 2741760, taxRate: 18, department: "Box Office", ledgerCode: "REV-TKT-01" },
    { category: "Food Orders", amount: 1542240, taxRate: 5, department: "Concessions", ledgerCode: "REV-FNB-02" },
    { category: "Membership Plans", amount: 428000, taxRate: 18, department: "Marketing", ledgerCode: "REV-MBR-03" },
    { category: "Parking Fee", amount: 128500, taxRate: 18, department: "Facilities", ledgerCode: "REV-PRK-04" },
    { category: "VIP Lounge", amount: 95000, taxRate: 18, department: "Lounge", ledgerCode: "REV-VIP-05" },
    { category: "Corporate Bookings", amount: 320000, taxRate: 18, department: "B2B Sales", ledgerCode: "REV-CORP-06" },
    { category: "Private Screenings", amount: 180000, taxRate: 18, department: "Events", ledgerCode: "REV-PRIV-07" },
    { category: "Advertising Banners", amount: 150000, taxRate: 18, department: "Marketing", ledgerCode: "REV-ADV-08" }
  ]);
});

// POST /expense - Add new expense
router.post("/expense", async (req: Request, res: Response) => {
  const { vendor, category, amount, gst, status } = req.body;
  res.status(201).json({
    id: "exp-" + Math.floor(Math.random() * 10000),
    invoiceNumber: req.body.invoiceNumber || "INV-" + Math.floor(Math.random() * 100000),
    vendor,
    category,
    amount: parseFloat(amount),
    gst: parseFloat(gst || 0),
    status: status || "PENDING",
    paymentDate: new Date(),
    createdAt: new Date()
  });
});

// PUT /expense - Update existing expense
router.put("/expense/:id", async (req: Request, res: Response) => {
  res.json({
    success: true,
    id: req.params.id,
    updatedData: req.body
  });
});

// GET /gst - GST dashboard metrics
router.get("/gst", async (_req: Request, res: Response) => {
  res.json({
    cgstCollected: 242700,
    sgstCollected: 242700,
    igstCollected: 0,
    cessCollected: 24500,
    cgstPaid: 95400,
    sgstPaid: 95400,
    igstPaid: 12000,
    pendingTaxLiability: 282600,
    returnsStatus: "DRAFT_SAVED",
    hsnSummary: [
      { hsn: "9983", desc: "Movie Exhibition Services", rate: 18, taxableValue: 2741760, cgst: 246758, sgst: 246758 },
      { hsn: "9963", desc: "Food & Beverage Services", rate: 5, taxableValue: 1542240, cgst: 38556, sgst: 38556 }
    ]
  });
});

// GET /profit-loss - Income statement
router.get("/profit-loss", async (_req: Request, res: Response) => {
  res.json({
    revenue: {
      tickets: 2741760,
      concessions: 1542240,
      membership: 428000,
      others: 648500,
      total: 5360500
    },
    cogs: {
      movieDistributorShare: 1233792,
      foodRawMaterials: 462672,
      total: 1696464
    },
    grossProfit: 3664036,
    operatingExpenses: {
      salaries: 850000,
      rentAndLease: 450000,
      electricityAndUtilities: 220000,
      marketingAndAdvertising: 180000,
      softwareAndCloud: 85000,
      maintenanceAndCleaning: 120000,
      total: 1905000
    },
    operatingProfit: 1759036,
    taxInterest: {
      gstLiability: 282600,
      bankCharges: 14500,
      total: 297100
    },
    netProfit: 1461936
  });
});

// GET /cashflow - Cash flow statement
router.get("/cashflow", async (_req: Request, res: Response) => {
  res.json({
    operatingActivities: {
      receiptsFromCustomers: 5360500,
      paymentsToSuppliers: -462672,
      paymentsToDistributors: -1233792,
      paymentsToEmployees: -850000,
      taxPayments: -190800,
      netOperatingCash: 2623236
    },
    investingActivities: {
      equipmentPurchase: -250000,
      furnitureUpgrades: -120000,
      netInvestingCash: -370000
    },
    financingActivities: {
      loanRepayment: -150000,
      interestPaid: -14500,
      netFinancingCash: -164500
    },
    netIncreaseInCash: 2088736,
    openingBalance: 4250000,
    closingBalance: 6338736
  });
});

// GET /balance-sheet - Assets, Liabilities & Equity
router.get("/balance-sheet", async (_req: Request, res: Response) => {
  res.json({
    assets: {
      currentAssets: {
        cashAndBank: 6338736,
        foodInventory: 245000,
        receivables: 120000,
        totalCurrent: 6703736
      },
      fixedAssets: {
        projectorsAndAudio: 4200000,
        furnitureAndInterior: 1800000,
        softwareLicense: 350000,
        depreciation: -850000,
        totalFixed: 5500000
      },
      totalAssets: 12203736
    },
    liabilities: {
      currentLiabilities: {
        supplierPayables: 380000,
        gstPayable: 282600,
        salaryPayable: 0,
        totalCurrent: 662600
      },
      longTermLiabilities: {
        bankLoan: 2500000,
        totalLongTerm: 2500000
      },
      totalLiabilities: 3162600
    },
    equity: {
      shareCapital: 5000000,
      retainedEarnings: 4041136,
      totalEquity: 9041136
    },
    totalLiabilitiesAndEquity: 12203736
  });
});

// POST /invoice - Custom invoice generator
router.post("/invoice", async (req: Request, res: Response) => {
  res.json({
    success: true,
    invoiceNumber: "INV-2026-" + Math.floor(Math.random() * 90000 + 10000),
    qrCodeData: "https://cinemapromax.com/invoice/verify/" + Math.floor(Math.random() * 1000000),
    data: req.body
  });
});

// GET /analytics - Graph coordinates / stats
router.get("/analytics", async (_req: Request, res: Response) => {
  res.json({
    revenueTrends: [
      { label: "Jan", tickets: 2100000, food: 1100000, membership: 250000 },
      { label: "Feb", tickets: 2300000, food: 1250000, membership: 280000 },
      { label: "Mar", tickets: 2500000, food: 1400000, membership: 310000 },
      { label: "Apr", tickets: 2800000, food: 1550000, membership: 390000 },
      { label: "May", tickets: 3100000, food: 1700000, membership: 420000 },
      { label: "Jun", tickets: 2741760, food: 1542240, membership: 428000 }
    ],
    branchSales: [
      { name: "CineVerse Mumbai", revenue: 1850000, expenses: 1100000, occupancy: 78 },
      { name: "CineVerse Delhi VIP", revenue: 2100000, expenses: 1300000, occupancy: 84 },
      { name: "CineVerse Bengaluru", revenue: 1410500, expenses: 950000, occupancy: 72 }
    ]
  });
});

// GET /forecast - AI Forecasting Predictions
router.get("/forecast", async (_req: Request, res: Response) => {
  res.json({
    nextWeekRevenue: 1520000,
    nextMonthRevenue: 6200000,
    confidenceScore: 0.94,
    insights: [
      "F&B sales predicted to grow by 14% next week due to high blockbusters occupancy.",
      "Cash flow surplus expected to reach ₹85 Lakhs by mid-quarter; recommend prepaying 10% bank loan.",
      "Staff costs will remain stable while marketing ROI shows a positive trend of 2.1x."
    ]
  });
});

export default router;
