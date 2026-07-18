import { Router, Request, Response } from "express";
import { prisma } from "../index";

const router = Router();

// GET all eligible coupons based on order amount
router.get("/eligible", async (req: Request, res: Response) => {
  const { amount } = req.query;
  const orderAmount = parseFloat(amount as string) || 0;

  // Premium coupon database seeds
  const coupons = [
    {
      id: "cp-gold",
      code: "CINEGOLD",
      name: "Gold Class Privilege",
      discountValue: 150,
      isPercentage: false,
      minOrder: 500,
      badge: "Luxe Tier",
      description: "Get flat ₹150 off on gourmet snacks & tickets above ₹500.",
      expiryDate: "2026-12-31",
      terms: "Valid on all NOW_SHOWING movie ticket purchases."
    },
    {
      id: "cp-festive",
      code: "FESTIVE40",
      name: "Festival Carnival Promo",
      discountValue: 40,
      isPercentage: true,
      minOrder: 800,
      maxDiscount: 400,
      badge: "Carnival Special",
      description: "Enjoy 40% discount up to ₹400 on bookings above ₹800.",
      expiryDate: "2026-08-15",
      terms: "Single use code per registered customer."
    },
    {
      id: "cp-popcorn",
      code: "POPCORN50",
      name: "Movie Snack Special",
      discountValue: 50,
      isPercentage: false,
      minOrder: 300,
      badge: "Snack Feast",
      description: "Flat ₹50 off on select premium popcorn and beverages.",
      expiryDate: "2026-10-30",
      terms: "Requires at least 1 Popcorn item in cart."
    }
  ];

  // Map eligibility flag
  const eligibleCoupons = coupons.map((c) => ({
    ...c,
    isEligible: orderAmount >= c.minOrder,
    shortage: orderAmount < c.minOrder ? c.minOrder - orderAmount : 0
  }));

  res.status(200).json(eligibleCoupons);
});

// POST validate coupon code
router.post("/validate", async (req: Request, res: Response) => {
  const { code, amount } = req.body;
  const orderAmount = parseFloat(amount) || 0;

  if (!code) {
    return res.status(400).json({ message: "Coupon code is required." });
  }

  const couponsDb = [
    {
      id: "cp-gold",
      code: "CINEGOLD",
      discountValue: 150,
      isPercentage: false,
      minOrder: 500,
    },
    {
      id: "cp-festive",
      code: "FESTIVE40",
      discountValue: 40,
      isPercentage: true,
      minOrder: 800,
      maxDiscount: 400,
    },
    {
      id: "cp-popcorn",
      code: "POPCORN50",
      discountValue: 50,
      isPercentage: false,
      minOrder: 300,
    },
    {
      id: "cp-1",
      code: "CINE20",
      discountValue: 20,
      isPercentage: true,
      minOrder: 0,
    }
  ];

  const found = couponsDb.find((c) => c.code.toUpperCase() === code.toUpperCase());

  if (!found) {
    return res.status(404).json({ message: "Invalid Coupon. Code does not exist." });
  }

  if (orderAmount < found.minOrder) {
    return res.status(400).json({
      message: `Minimum order amount of ₹${found.minOrder} is required to apply code ${found.code}.`
    });
  }

  // Calculate discount values
  let discount = 0;
  if (found.isPercentage) {
    discount = Math.round(orderAmount * (found.discountValue / 100));
    if (found.maxDiscount && discount > found.maxDiscount) {
      discount = found.maxDiscount;
    }
  } else {
    discount = found.discountValue;
  }

  res.status(200).json({
    valid: true,
    coupon: {
      id: found.id,
      code: found.code,
      discountValue: found.discountValue,
      isPercentage: found.isPercentage,
      calculatedDiscount: discount
    }
  });
});

export default router;
