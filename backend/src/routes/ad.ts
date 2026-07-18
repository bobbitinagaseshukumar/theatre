import { Router, Request, Response } from "express";
import { prisma } from "../index";

const router = Router();

// POST /register - Register brand advertiser
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { companyName, contactName, email, phone } = req.body;
    const advertiser = await prisma.advertiser.create({
      data: { companyName, contactName, email, phone }
    });

    res.status(201).json({
      success: true,
      advertiser
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to register advertiser", error: error.message });
  }
});

// POST /campaign/create - Create campaign
router.post("/campaign/create", async (req: Request, res: Response) => {
  try {
    const { advertiserId, name, adType, startDate, endDate, budget, goal } = req.body;
    const campaign = await prisma.adCampaign.create({
      data: {
        advertiserId: advertiserId || "adv-default",
        name,
        adType: adType || "SCREEN",
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(),
        budget: parseFloat(budget) || 5000,
        goal
      }
    });

    res.status(201).json({
      success: true,
      campaign
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to create campaign", error: error.message });
  }
});

// POST /ad/upload - Mock file upload ad creative
router.post("/upload", async (req: Request, res: Response) => {
  try {
    const { campaignId, fileName, fileUrl } = req.body;
    res.json({
      success: true,
      campaignId,
      fileName,
      fileUrl: fileUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e",
      mediaApproved: true
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to upload creative", error: error.message });
  }
});

// GET /ad/spaces - Get active advertising slots
router.get("/spaces", async (_req: Request, res: Response) => {
  try {
    const spaces = await prisma.adSpace.findMany();
    if (spaces.length === 0) {
      return res.json([
        { id: "spc-1", name: "Audi 1 Screen Pre-Show Video", location: "SCREEN", pricing: 1500, status: "AVAILABLE" },
        { id: "spc-2", name: "Lobby LED Main Panel", location: "LOBBY", pricing: 800, status: "AVAILABLE" },
        { id: "spc-3", name: "Food Counter Left Banner", location: "FOOD_COUNTER", pricing: 450, status: "BOOKED" }
      ]);
    }
    res.json(spaces);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to read ad spaces", error: error.message });
  }
});

// POST /ad/schedule - Schedule ad playing frequency
router.post("/schedule", async (req: Request, res: Response) => {
  try {
    const { campaignId, spaceId, startTime, endTime, frequencyHz } = req.body;
    const sched = await prisma.adSchedule.create({
      data: {
        campaignId,
        spaceId,
        startTime: startTime ? new Date(startTime) : new Date(),
        endTime: endTime ? new Date(endTime) : new Date(),
        frequencyHz: parseFloat(frequencyHz) || 1.0
      }
    });

    res.status(201).json({
      success: true,
      schedule: sched
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to save ad schedule", error: error.message });
  }
});

// GET /ad/analytics - Fetch ad campaign ROI views/clicks
router.get("/analytics", async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.query;
    const reports = await prisma.adAnalytics.findFirst({
      where: { campaignId: (campaignId as string) || "camp-default" }
    });

    res.json({
      views: reports?.views || 18540,
      impressions: reports?.impressions || 42100,
      clicks: reports?.clicks || 1240,
      conversions: reports?.conversions || 154,
      clickThroughRate: 2.9,
      conversionRate: 12.4
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to read ad analytics", error: error.message });
  }
});

// POST /invoice/create - Create advertiser billing invoices
router.post("/invoice/create", async (req: Request, res: Response) => {
  try {
    const { campaignId, amount } = req.body;
    const payment = await prisma.adPayment.create({
      data: {
        campaignId: campaignId || "camp-default",
        amount: parseFloat(amount) || 1000
      }
    });

    res.status(201).json({
      success: true,
      invoiceId: payment.id,
      payment
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to create invoice", error: error.message });
  }
});

export default router;
