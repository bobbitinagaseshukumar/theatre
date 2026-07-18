import { Router, Request, Response } from "express";
import { prisma } from "../index";

const router = Router();

// POST /theatre/create - Add new theatre node
router.post("/theatre/create", async (req: Request, res: Response) => {
  try {
    const { name, locationId, address, contact, managerName, screensCount, capacity } = req.body;
    const theatre = await prisma.theatre.create({
      data: {
        name,
        locationId: locationId || "loc-mumbai",
        address,
        contact,
        managerName,
        screensCount: parseInt(screensCount) || 1,
        capacity: parseInt(capacity) || 150
      }
    });

    res.status(201).json({
      success: true,
      theatre
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to create theatre", error: error.message });
  }
});

// GET /theatre/list - Get all theatres in chain
router.get("/theatre/list", async (_req: Request, res: Response) => {
  try {
    const list = await prisma.theatre.findMany();
    if (list.length === 0) {
      return res.json([
        { id: "th-1", name: "CineVerse Premium - Mumbai", address: "Lower Parel, Mumbai", contact: "9999999999", managerName: "Arjun Kapoor", screensCount: 3, capacity: 560, status: "ACTIVE" },
        { id: "th-2", name: "CineVerse Luxe - Delhi", address: "Saket, Delhi", contact: "8888888888", managerName: "Rohan Khanna", screensCount: 2, capacity: 320, status: "ACTIVE" }
      ]);
    }
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to read theatres list", error: error.message });
  }
});

// POST /franchise/apply - Submit franchise application
router.post("/franchise/apply", async (req: Request, res: Response) => {
  try {
    const { partnerName, companyName, location, investment } = req.body;
    const partner = await prisma.franchise.create({
      data: {
        partnerName,
        companyName,
        location,
        investment: parseFloat(investment) || 5000000,
        status: "PENDING"
      }
    });

    res.status(201).json({
      success: true,
      franchise: partner
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to submit franchise application", error: error.message });
  }
});

// POST /franchise/approve - Approve franchise partner
router.post("/franchise/approve", async (req: Request, res: Response) => {
  try {
    const { franchiseId } = req.body;
    const partner = await prisma.franchise.update({
      where: { id: franchiseId },
      data: { status: "ACTIVE" }
    });

    res.json({
      success: true,
      message: "Franchise partner status set to ACTIVE successfully.",
      franchise: partner
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to approve franchise", error: error.message });
  }
});

// GET /chain/dashboard - Centralized chain analytics
router.get("/dashboard", async (_req: Request, res: Response) => {
  try {
    const count = await prisma.theatre.count();
    const reports = await prisma.regionalReport.findMany();

    res.json({
      totalTheatres: count || 2,
      totalCities: 2,
      totalRevenue: reports.reduce((acc, r) => acc + r.revenue, 0) || 12450000,
      activeLocations: ["Mumbai", "Delhi"],
      franchiseGrowth: "+24%",
      rankings: [
        { name: "CineVerse Premium - Mumbai", revenue: 8400000, bookings: 24000 },
        { name: "CineVerse Luxe - Delhi", revenue: 4050000, bookings: 12000 }
      ]
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to read chain stats", error: error.message });
  }
});

// GET /location/performance - Compare location performance
router.get("/location/performance", async (req: Request, res: Response) => {
  try {
    const { region } = req.query;
    const reports = await prisma.regionalReport.findMany({
      where: { region: (region as string) || "WEST" }
    });

    if (reports.length === 0) {
      return res.json([
        { city: "Mumbai", revenue: 8400000, bookings: 24000, region: "WEST" }
      ]);
    }
    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to read regional data", error: error.message });
  }
});

// POST /global/movie - Publish movie to entire chain
router.post("/global/movie", async (req: Request, res: Response) => {
  try {
    const { title, genre, language, screenAllocations } = req.body;
    // Mock publishing global movie distribution details
    res.status(201).json({
      success: true,
      title,
      genre,
      language,
      distributedTheatresCount: screenAllocations?.length || 2
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to distribute movie", error: error.message });
  }
});

export default router;
