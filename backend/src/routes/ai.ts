import { Router, Request, Response } from "express";

const router = Router();

// POST /chat - AI Chatbot System
router.post("/chat", async (req: Request, res: Response) => {
  const { message, voice, customerId, channel } = req.body;
  const userMsg = (message || "").toLowerCase();

  let botResponse = "I'm the Prestige AI Assistant. How can I help you enjoy your cinematic experience today?";
  let action: any = null;

  // Simple NLP pattern matching
  if (userMsg.includes("playing today") || userMsg.includes("movie") || userMsg.includes("show")) {
    botResponse = "Currently playing today at CineVerse Premium IMAX: 1. Aether: Rising Stars (Sci-Fi), 2. Shadows of the Dynasty (Action-Drama), and 3. Cosmic Horizons 3D. Would you like me to recommend a screening?";
    action = { type: "RECOMMEND_MOVIES" };
  } else if (userMsg.includes("book") || userMsg.includes("seat")) {
    botResponse = "I can help with booking! I recommend Row E, Seats 11-12 which offer the optimal spatial sound and visual view angle for Avatar. Shall I hold these for you?";
    action = { type: "SELECT_SEATS", data: { seats: ["E-11", "E-12"] } };
  } else if (userMsg.includes("popcorn") || userMsg.includes("food") || userMsg.includes("nacho")) {
    botResponse = "Added Truffle Butter Popcorn (Large) and Fountain Pepsi XL to your order queue! Action movies pair exceptionally well with this combo.";
    action = { type: "ADD_FOOD", data: { itemId: "fnb-truffle", qty: 1 } };
  } else if (userMsg.includes("where") || userMsg.includes("theatre") || userMsg.includes("location")) {
    botResponse = "Your nearest theatre is CineVerse Palladium (IMAX), Lower Parel, Mumbai. It is 1.8 km from your current location.";
    action = { type: "SHOW_THEATRE" };
  } else if (userMsg.includes("ticket") || userMsg.includes("show my")) {
    botResponse = "Here is your digital booking pass: Booking Ref: #BK-7849c. Show this QR code at screen admission.";
    action = { type: "SHOW_TICKET", data: { bookingId: "bk-7849c" } };
  } else if (userMsg.includes("discount") || userMsg.includes("offer") || userMsg.includes("coupon")) {
    botResponse = "We have 1 active offer for you: Use code 'PRESTIGE50' to get 50% off on premium lounge seats today!";
    action = { type: "APPLY_COUPON", data: { code: "PRESTIGE50" } };
  } else if (userMsg.includes("upgrade") || userMsg.includes("membership")) {
    botResponse = "You can upgrade to VIP Gold Membership today to earn 2x reward points on concessions and get free screen upgrades. Would you like me to upgrade you?";
    action = { type: "UPGRADE_MEMBERSHIP" };
  } else if (userMsg.includes("refund") || userMsg.includes("failed")) {
    botResponse = "I've analyzed your transaction. Payment for Booking Ref #BK-6123a was interrupted, but don't worry—the refund has been automatically initiated and will reflect in your bank account in 24 hours.";
    action = { type: "REFUND_HELP" };
  }

  // Sentiment analysis simulation
  const sentiments = ["HAPPY", "NEUTRAL", "FRUSTRATED"];
  const sentimentScore = userMsg.includes("thank") || userMsg.includes("great") ? 0.9 : userMsg.includes("failed") || userMsg.includes("angry") ? 0.15 : 0.55;

  res.json({
    message: botResponse,
    sentiment: sentimentScore > 0.7 ? "HAPPY" : sentimentScore < 0.3 ? "ANGRY" : "NEUTRAL",
    sentimentScore,
    voiceWave: voice ? [20, 45, 80, 100, 75, 40, 15, 35, 60, 90, 50, 10] : null,
    action,
    channel: channel || "WEB",
    customerId: customerId || "usr-anon"
  });
});

// POST /recommend - AI Recommendation Engine
router.post("/recommend", async (req: Request, res: Response) => {
  const { customerId, type } = req.body;

  let recommendations: any[] = [];

  if (type === "MOVIE") {
    recommendations = [
      { id: "mov-1", title: "Aether: Rising Stars", score: 0.98, reason: "Based on your interest in Sci-Fi" },
      { id: "mov-2", title: "Shadows of the Dynasty", score: 0.85, reason: "Trending in Mumbai" },
      { id: "mov-3", title: "Cosmic Horizons 3D", score: 0.76, reason: "Because you watched Interstellar" }
    ];
  } else if (type === "FOOD") {
    recommendations = [
      { id: "fnb-1", name: "Truffle Butter Popcorn", price: 290, score: 0.95, reason: "Often ordered during Action movies" },
      { id: "fnb-2", name: "Wild Mushroom Pizza", price: 420, score: 0.82, reason: "Pairing recommendation for late screenings" }
    ];
  } else if (type === "OFFER") {
    recommendations = [
      { code: "PRESTIGE50", discount: "50% Off", desc: "Gold tier exclusive voucher", score: 0.91 }
    ];
  } else if (type === "SEAT") {
    recommendations = [
      { row: "E", seat: "11", type: "Premium", score: 0.97, reason: "Matches your historical seat center selection" },
      { row: "E", seat: "12", type: "Premium", score: 0.97, reason: "Double seats booking preference" }
    ];
  }

  res.json({
    customerId: customerId || "usr-104",
    type,
    recommendations
  });
});

// GET /predictions - Predictive business indicators
router.get("/predictions", async (req: Request, res: Response) => {
  const { targetType } = req.query;

  const data: any = {
    revenuePredict: {
      tomorrow: 85600,
      nextWeek: 642000,
      nextMonth: 2840000,
      confidence: 0.91
    },
    churnRisk: [
      { id: "usr-291", name: "Ananya Patel", probability: 0.72, LTV: 8900, reason: "No visits in 45 days" },
      { id: "usr-503", name: "Vikram Mehta", probability: 0.45, LTV: 14200, reason: "Frequent cancellations" }
    ],
    dynamicPricing: {
      basePrice: 250,
      adjustedPrice: 320,
      factor: "HIGH_DEMAND",
      reason: "85% seats booked in Screen 1 for evening slot",
      minPrice: 180,
      maxPrice: 550,
      rules: {
        approvalRequired: true,
        autoAdjust: true
      }
    },
    inventoryDemand: [
      { item: "Corn Kernels", current: 450, predictedRequired: 680, unit: "kg", restockNeeded: true },
      { item: "Premium Butter", current: 25, predictedRequired: 80, unit: "kg", restockNeeded: true },
      { item: "Truffle Oil", current: 3, predictedRequired: 15, unit: "liters", restockNeeded: true }
    ]
  };

  if (targetType && data[targetType as string]) {
    return res.json(data[targetType as string]);
  }

  res.json(data);
});

// POST /train - AI Model training controller
router.post("/train", async (req: Request, res: Response) => {
  const { modelCode } = req.body;

  // Mock epochs training output
  const epochs = [
    { epoch: 1, loss: 0.85, accuracy: 0.54 },
    { epoch: 2, loss: 0.62, accuracy: 0.71 },
    { epoch: 3, loss: 0.41, accuracy: 0.82 },
    { epoch: 4, loss: 0.28, accuracy: 0.91 },
    { epoch: 5, loss: 0.18, accuracy: 0.965 }
  ];

  res.json({
    success: true,
    modelCode: modelCode || "CHURN_PREDICTION",
    epochs,
    finalAccuracy: 0.965,
    trainedAt: new Date().toISOString()
  });
});

// GET /insights - Sentiment analysis & CFO insights
router.get("/insights", async (_req: Request, res: Response) => {
  res.json({
    sentiment: {
      happy: 68,
      neutral: 22,
      angry: 10,
      feedbackVolume: 1240,
      improvementAreas: ["Seat cushion stiffness in Screen 3", "Lobby queue lines during peak show times"]
    },
    cfoAnalysis: [
      { question: "Why did revenue drop this Tuesday?", answer: "Heavy monsoon weather in Mumbai reduced footfall by 34%, matching historical seasonal trends." },
      { question: "Predict next month revenue", answer: "EBITDA is projected at ₹12,40,000, representing a 6% increase driven by the upcoming blockbuster release." }
    ],
    securityAlerts: [
      { id: "sec-1", area: "Screen 2 Entrance", issue: "High crowd density queue bottlenecks", time: "5 mins ago", severity: "MEDIUM" },
      { id: "sec-2", area: "Lobby East Corridor", issue: "Suspicious unattended bag detected", time: "12 mins ago", severity: "CRITICAL" }
    ],
    employeeWorkload: {
      underStaffedShifts: ["Saturday Evening (18:00 - 22:00)"],
      efficiencyGrade: "A+",
      suggestions: ["Allocate 3 additional floor coordinators from ticket queues to concessions counter on weekends"]
    }
  });
});

// POST /automation - Smart campaigns automation rule manager
router.post("/automation", async (req: Request, res: Response) => {
  const { name, triggerType, conditions, actions } = req.body;
  res.status(201).json({
    success: true,
    rule: {
      id: "rule-" + Math.floor(Math.random() * 1000),
      name,
      triggerType,
      conditions,
      actions,
      isActive: true,
      runCount: 0,
      createdAt: new Date().toISOString()
    }
  });
});

// GET /models - Active Model Catalog Configurations
router.get("/models", async (_req: Request, res: Response) => {
  res.json([
    { code: "CHURN_PREDICTION", name: "Customer Churn Engine", accuracy: 0.94, isEnabled: true, desc: "Predicts high risk customer lists and triggers retention rules" },
    { code: "DYNAMIC_PRICING", name: "Dynamic Seat Pricing Model", accuracy: 0.91, isEnabled: true, desc: "Auto-calibrates seat multipliers matching active occupancy index" },
    { code: "CONCESSIONS_RECOMMEND", name: "F&B Combo Suggestion System", accuracy: 0.95, isEnabled: true, desc: "Personalizes snack counters pairings at checkout" },
    { code: "NLP_CHATBOT", name: "Conversational NLP Chatbot", accuracy: 0.88, isEnabled: true, desc: "Multichannel support assistant (WhatsApp, Web, Mobile)" },
    { code: "CCTV_DETECTOR", name: "Computer Vision Queue Monitor", accuracy: 0.92, isEnabled: false, desc: "Detects lobby queue bottlenecks and unauthorized entries" }
  ]);
});

router.get("/health", async (_req: Request, res: Response) => {
  res.json({
    status: "ONLINE",
    uptime: "99.97%",
    latency: "0.18s",
    activeModels: 9,
    totalModels: 12,
    predictionsToday: 1847,
    automationsExecuted: 312,
    recommendationHits: 4892,
    fraudDetections: 0,
    satisfactionIndex: 94.2,
    dataProcessingRate: "42.6 KB/s",
    learningStatus: "CONTINUOUS",
    lastTrainedAt: new Date(Date.now() - 3600000).toISOString(),
    pipelineStages: [
      { stage: "Data Collection", status: "ACTIVE", throughput: "12.4K events/hr" },
      { stage: "Data Cleaning", status: "ACTIVE", throughput: "11.8K events/hr" },
      { stage: "Feature Engineering", status: "ACTIVE", throughput: "9.2K features/hr" },
      { stage: "Model Inference", status: "ACTIVE", throughput: "8.1K predictions/hr" },
      { stage: "Action Dispatch", status: "ACTIVE", throughput: "6.4K actions/hr" },
      { stage: "Feedback Loop", status: "ACTIVE", throughput: "5.8K signals/hr" }
    ],
    memoryUsage: { used: 2.4, total: 8.0, unit: "GB" },
    gpuUtilization: 67.3
  });
});

router.post("/voice", async (req: Request, res: Response) => {
  const { transcript, language } = req.body;
  const text = (transcript || "").toLowerCase();
  
  let intent = "UNKNOWN";
  let response = "I didn't catch that. Could you please repeat?";
  let action: any = null;
  
  if (text.includes("comedy") || text.includes("find") || text.includes("search")) {
    intent = "MOVIE_SEARCH";
    response = "I found 3 comedy movies playing this week: Laugh Factory 3D, Comedy Nights Live, and The Giggle Fest. Want me to book tickets?";
    action = { type: "SEARCH_MOVIES", genre: "Comedy" };
  } else if (text.includes("book") || text.includes("favourite seat")) {
    intent = "VOICE_BOOKING";
    response = "Based on your history, your favourite seats are Row E, Seats 11-12 in Screen 1 IMAX. I've pre-selected them for the next available show. Confirm booking?";
    action = { type: "QUICK_BOOK", seats: ["E-11", "E-12"] };
  } else if (text.includes("offer") || text.includes("discount") || text.includes("deal")) {
    intent = "CHECK_OFFERS";
    response = "You have 2 active offers: PRESTIGE50 for 50% off premium loungers, and COMBO99 for a snack combo at just ₹99. Should I apply one?";
    action = { type: "SHOW_OFFERS" };
  } else if (text.includes("reward") || text.includes("point") || text.includes("membership")) {
    intent = "CHECK_REWARDS";
    response = "You currently have 2,450 reward points worth ₹245. Your VIP Gold membership expires in 8 months. You're 550 points away from Platinum!";
    action = { type: "SHOW_REWARDS" };
  } else if (text.includes("ticket") || text.includes("show my")) {
    intent = "SHOW_TICKET";
    response = "Here's your latest booking: Aether Rising Stars, Screen 1 IMAX, Row E Seats 11-12, July 18 at 7:30 PM. QR code is ready for scanning.";
    action = { type: "DISPLAY_TICKET", bookingId: "bk-7849c" };
  }
  
  res.json({
    intent,
    transcript: transcript || "",
    language: language || "en-IN",
    response,
    action,
    confidence: intent !== "UNKNOWN" ? 0.92 : 0.3,
    voiceOutput: true,
    waveform: [15, 35, 55, 80, 100, 85, 60, 40, 20, 45, 70, 95, 75, 50, 25]
  });
});

router.get("/recommend/homepage", async (req: Request, res: Response) => {
  const { customerId } = req.query;
  res.json({
    customerId: customerId || "usr-104",
    sections: [
      {
        id: "recommended",
        title: "Recommended For You",
        subtitle: "Based on your viewing preferences",
        items: [
          { id: "mov-1", title: "Aether: Rising Stars", genre: "Sci-Fi", score: 0.98, poster: "/posters/aether.jpg" },
          { id: "mov-4", title: "Nebula Beyond", genre: "Sci-Fi", score: 0.94, poster: "/posters/nebula.jpg" },
          { id: "mov-5", title: "Quantum Drift", genre: "Thriller", score: 0.91, poster: "/posters/quantum.jpg" }
        ]
      },
      {
        id: "because_watched",
        title: "Because You Watched Interstellar",
        subtitle: "Similar cinematic experiences",
        items: [
          { id: "mov-6", title: "Cosmic Horizons 3D", genre: "Sci-Fi", score: 0.96, poster: "/posters/cosmic.jpg" },
          { id: "mov-7", title: "Gravity Falls: Cinema Cut", genre: "Adventure", score: 0.88, poster: "/posters/gravity.jpg" }
        ]
      },
      {
        id: "trending",
        title: "Trending Near You",
        subtitle: "Popular in Mumbai this week",
        items: [
          { id: "mov-2", title: "Shadows of the Dynasty", genre: "Action-Drama", score: 0.92, poster: "/posters/shadows.jpg" },
          { id: "mov-8", title: "Monsoon Melodies", genre: "Musical", score: 0.87, poster: "/posters/monsoon.jpg" }
        ]
      },
      {
        id: "fav_genre",
        title: "Your Favourite Genre: Sci-Fi",
        subtitle: "Handpicked science fiction titles",
        items: [
          { id: "mov-9", title: "Starfield Legacy", genre: "Sci-Fi", score: 0.93, poster: "/posters/starfield.jpg" },
          { id: "mov-10", title: "The Mars Protocol", genre: "Sci-Fi", score: 0.89, poster: "/posters/mars.jpg" }
        ]
      },
      {
        id: "friends",
        title: "Friends Choice",
        subtitle: "Movies your friends are watching",
        items: [
          { id: "mov-11", title: "The Grand Heist 2", genre: "Action", score: 0.85, poster: "/posters/heist.jpg" }
        ]
      },
      {
        id: "weekend",
        title: "Weekend Suggestions",
        subtitle: "Perfect for a relaxing weekend",
        items: [
          { id: "mov-12", title: "Café Stories", genre: "Romance", score: 0.82, poster: "/posters/cafe.jpg" },
          { id: "mov-13", title: "Laugh Factory 3D", genre: "Comedy", score: 0.80, poster: "/posters/laugh.jpg" }
        ]
      },
      {
        id: "ai_picks",
        title: "AI Picks",
        subtitle: "Our AI's top predictions for you",
        items: [
          { id: "mov-1", title: "Aether: Rising Stars", genre: "Sci-Fi", score: 0.99, poster: "/posters/aether.jpg", badge: "#1 AI Pick" }
        ]
      }
    ]
  });
});

router.get("/security/vision", async (_req: Request, res: Response) => {
  res.json({
    cameras: [
      { id: "cam-1", location: "Screen 1 Entrance", crowdDensity: 72, queueLength: 14, avgWaitTime: "4.2 mins", status: "NORMAL", alerts: [] },
      { id: "cam-2", location: "Lobby East Corridor", crowdDensity: 45, queueLength: 0, avgWaitTime: "0 mins", status: "NORMAL", alerts: [] },
      { id: "cam-3", location: "Concessions Counter", crowdDensity: 88, queueLength: 22, avgWaitTime: "8.5 mins", status: "WARNING", alerts: ["Queue bottleneck detected"] },
      { id: "cam-4", location: "Parking Lot B", crowdDensity: 30, queueLength: 0, avgWaitTime: "0 mins", status: "NORMAL", alerts: [] },
      { id: "cam-5", location: "Emergency Exit 2", crowdDensity: 5, queueLength: 0, avgWaitTime: "0 mins", status: "ALERT", alerts: ["Unattended bag detected near exit"] }
    ],
    overallStatus: "MONITORING",
    detections: [
      { type: "CROWD_DENSITY", location: "Concessions Counter", severity: "HIGH", details: "Peak crowd density exceeds 85% threshold", time: "2 mins ago" },
      { type: "UNATTENDED_OBJECT", location: "Emergency Exit 2", severity: "CRITICAL", details: "Unattended bag flagged for 12 minutes", time: "12 mins ago" },
      { type: "QUEUE_BOTTLENECK", location: "Screen 1 Entrance", severity: "MEDIUM", details: "Average wait time approaching 5 minute threshold", time: "5 mins ago" }
    ],
    metrics: {
      totalPeopleTracked: 847,
      avgDwellTime: "42 mins",
      peakHour: "7:00 PM - 8:00 PM",
      incidentsToday: 2,
      resolvedToday: 1
    }
  });
});

router.get("/employee/insights", async (_req: Request, res: Response) => {
  res.json({
    shiftSuggestions: [
      { shift: "Saturday Evening (18:00-22:00)", current: 4, recommended: 7, reason: "Historical peak footfall - 340% increase over weekday" },
      { shift: "Sunday Afternoon (12:00-16:00)", current: 5, recommended: 6, reason: "Family segment influx during matinee shows" },
      { shift: "Friday Night (20:00-23:00)", current: 3, recommended: 5, reason: "Premiere night crowd management requirement" }
    ],
    performancePredictions: [
      { name: "Arjun Kapoor", role: "Floor Manager", score: 94, trend: "UP", prediction: "Likely to exceed quarterly targets by 12%" },
      { name: "Meera Patel", role: "Kitchen Lead", score: 91, trend: "STABLE", prediction: "Consistent high performer. Ready for senior role" },
      { name: "Rahul Singh", role: "Ticket Counter", score: 72, trend: "DOWN", prediction: "Needs additional customer service training module" }
    ],
    trainingRecommendations: [
      { module: "Advanced Customer Handling", priority: "HIGH", targetEmployees: 3, reason: "12 customer complaints traced to counter interactions" },
      { module: "Food Safety Certification", priority: "MEDIUM", targetEmployees: 8, reason: "Annual certification renewal due in 30 days" }
    ],
    workloadBalance: {
      overloaded: ["Concessions Counter (Sat 18:00-22:00)"],
      underutilized: ["Parking Attendants (Weekday mornings)"],
      optimal: ["Projection Room Staff", "Security Gates"]
    }
  });
});

router.get("/inventory/predict", async (_req: Request, res: Response) => {
  res.json({
    predictions: [
      { item: "Corn Kernels", currentStock: 450, predictedDemand: 680, unit: "kg", daysUntilStockout: 3, restockUrgency: "HIGH", suggestedOrder: 400, bestSupplier: "AgriCorp India", estimatedCost: 12000 },
      { item: "Premium Butter", currentStock: 25, predictedDemand: 80, unit: "kg", daysUntilStockout: 1, restockUrgency: "CRITICAL", suggestedOrder: 100, bestSupplier: "Amul Wholesale", estimatedCost: 45000 },
      { item: "Truffle Oil", currentStock: 3, predictedDemand: 15, unit: "liters", daysUntilStockout: 2, restockUrgency: "HIGH", suggestedOrder: 20, bestSupplier: "Gourmet Imports", estimatedCost: 28000 },
      { item: "Nachos Chips", currentStock: 200, predictedDemand: 150, unit: "packs", daysUntilStockout: 8, restockUrgency: "LOW", suggestedOrder: 0, bestSupplier: "Doritos Direct", estimatedCost: 0 },
      { item: "Cola Syrup", currentStock: 40, predictedDemand: 35, unit: "liters", daysUntilStockout: 7, restockUrgency: "LOW", suggestedOrder: 0, bestSupplier: "PepsiCo", estimatedCost: 0 }
    ],
    wasteReduction: {
      currentWastePercent: 8.4,
      targetWastePercent: 5.0,
      savingsIfOptimized: 24500,
      topWastedItems: ["Sandwich Bread (12% waste)", "Fresh Salad Mix (18% waste)"]
    },
    weeklyForecast: [
      { day: "Monday", expectedFootfall: 420, foodDemandIndex: 0.6 },
      { day: "Tuesday", expectedFootfall: 380, foodDemandIndex: 0.5 },
      { day: "Wednesday", expectedFootfall: 510, foodDemandIndex: 0.7 },
      { day: "Thursday", expectedFootfall: 480, foodDemandIndex: 0.65 },
      { day: "Friday", expectedFootfall: 890, foodDemandIndex: 1.2 },
      { day: "Saturday", expectedFootfall: 1240, foodDemandIndex: 1.8 },
      { day: "Sunday", expectedFootfall: 1100, foodDemandIndex: 1.5 }
    ]
  });
});

router.get("/marketing/assistant", async (_req: Request, res: Response) => {
  res.json({
    campaignIdeas: [
      { id: "camp-1", title: "Monsoon Movie Marathon", channel: "EMAIL + PUSH", targetAudience: "Inactive 15+ days", expectedReach: 4200, predictedRevenue: 126000, bestTime: "Friday 6 PM", confidence: 0.88 },
      { id: "camp-2", title: "Student Weekend Pass", channel: "SMS + WHATSAPP", targetAudience: "Student Segment (18-25)", expectedReach: 2800, predictedRevenue: 84000, bestTime: "Thursday 4 PM", confidence: 0.92 },
      { id: "camp-3", title: "Family Sunday Funday", channel: "PUSH + SOCIAL", targetAudience: "Family Segment", expectedReach: 1600, predictedRevenue: 192000, bestTime: "Saturday 10 AM", confidence: 0.85 }
    ],
    generatedContent: {
      emailSubject: "Your weekend blockbuster awaits! 🎬 Up to 50% off premium seats",
      emailBody: "Hi {{name}}, based on your love for {{genre}} movies, we've curated a special weekend experience just for you...",
      whatsappMessage: "🎬 *CineVerse Special!* Your favourite genre {{genre}} has a new release this Friday! Book now with code PRESTIGE50 for 50% off. Reply BOOK to reserve.",
      socialPost: "Weekend plans? Sorted! 🍿 Watch {{movie}} in IMAX 3D at CineVerse. Early bird gets 50% off premium loungers! #CineVerse #WeekendVibes"
    },
    audienceInsights: {
      bestDayToSend: "Thursday",
      bestTimeToSend: "4:00 PM - 6:00 PM",
      highestOpenRateChannel: "PUSH (42%)",
      highestConversionChannel: "WHATSAPP (18%)",
      seasonalTrend: "Monsoon season shows 23% higher evening footfall"
    }
  });
});

export default router;
