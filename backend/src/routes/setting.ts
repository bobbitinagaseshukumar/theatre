import { Router, Request, Response } from "express";
import { prisma } from "../index";

const router = Router();

// GET all settings keys
router.get("/", async (req: Request, res: Response) => {
  try {
    const settings = await prisma.setting.findMany();
    res.status(200).json(settings);
  } catch (error) {
    res.status(200).json([]);
  }
});

// POST save setting key-value
router.post("/", async (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    res.status(200).json({ message: "Settings saved successfully", setting });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to save settings.", error: error.message });
  }
});

// POST validate coupon code
router.post("/validate-coupon", async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, amount } = req.body;
    if (!code) {
      res.status(400).json({ message: "Coupon code is required." });
      return;
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      res.status(400).json({ message: "Invalid or inactive coupon code." });
      return;
    }

    if (new Date() > coupon.expiresAt) {
      res.status(400).json({ message: "This coupon code has expired." });
      return;
    }

    if (amount < coupon.minOrderAmount) {
      res.status(400).json({ message: `Minimum order amount of ₹${coupon.minOrderAmount} is required.` });
      return;
    }

    res.status(200).json({
      message: "Coupon applied successfully.",
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountValue: coupon.discountValue,
        isPercentage: coupon.isPercentage,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to validate coupon code.", error: error.message });
  }
});

export default router;
