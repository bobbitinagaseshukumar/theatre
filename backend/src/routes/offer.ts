import { Router, Request, Response } from "express";
import { prisma } from "../index";
import { protect, restrictTo } from "../middleware/auth";
import { Role } from "@prisma/client";

const router = Router();

// GET all active offers
router.get("/", async (req: Request, res: Response) => {
  try {
    const offers = await prisma.offer.findMany({
      where: { isActive: true },
    });
    
    // Map database fields to the exact API response structure (adding dynamic defaults if missing in DB model)
    const formattedOffers = offers.map((offer) => ({
      OfferID: offer.id,
      Title: offer.title,
      Subtitle: "Special discount coupon",
      Description: offer.description,
      CouponCode: offer.code || "CINEPRO",
      Image: offer.imageUrl,
      Background: "linear-gradient(135deg, rgba(229, 9, 20, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)",
      ExpiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Ends in 2 Days
      StartDate: offer.createdAt.toISOString(),
      Priority: 1,
      Status: "ACTIVE",
      MovieIDs: [],
    }));

    res.status(200).json(formattedOffers);
  } catch (error) {
    res.status(200).json([]);
  }
});

// GET single offer
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const offer = await prisma.offer.findUnique({
      where: { id },
    });

    if (!offer) {
      res.status(404).json({ message: "Offer not found." });
      return;
    }

    res.status(200).json({
      OfferID: offer.id,
      Title: offer.title,
      Subtitle: "Special discount coupon",
      Description: offer.description,
      CouponCode: offer.code || "CINEPRO",
      Image: offer.imageUrl,
      Background: "linear-gradient(135deg, rgba(229, 9, 20, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)",
      ExpiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      StartDate: offer.createdAt.toISOString(),
      Priority: 1,
      Status: "ACTIVE",
      MovieIDs: [],
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch offer details." });
  }
});

// POST create offer (Admin/Owner only)
router.post("/admin", protect, restrictTo(Role.OWNER, Role.SUPER_ADMIN), async (req: Request, res: Response) => {
  try {
    const { title, description, imageUrl, code } = req.body;
    const newOffer = await prisma.offer.create({
      data: {
        title,
        description,
        imageUrl,
        code,
      },
    });
    res.status(201).json({ message: "Offer created successfully", offer: newOffer });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to create offer.", error: error.message });
  }
});

// PUT update offer
router.put("/admin/:id", protect, restrictTo(Role.OWNER, Role.SUPER_ADMIN), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, code, isActive } = req.body;

    const updated = await prisma.offer.update({
      where: { id },
      data: {
        title,
        description,
        imageUrl,
        code,
        isActive,
      },
    });
    res.status(200).json({ message: "Offer updated successfully", offer: updated });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update offer.", error: error.message });
  }
});

// DELETE offer
router.delete("/admin/:id", protect, restrictTo(Role.OWNER, Role.SUPER_ADMIN), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.offer.delete({ where: { id } });
    res.status(200).json({ message: "Offer deleted successfully." });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to delete offer.", error: error.message });
  }
});

export default router;
