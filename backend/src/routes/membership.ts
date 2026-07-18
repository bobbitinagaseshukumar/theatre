import { Router, Request, Response } from "express";
import { prisma } from "../index";

const router = Router();

// GET user membership profile
router.get("/profile", async (req: Request, res: Response) => {
  res.status(200).json({
    id: "mem-7849",
    tier: "Gold Member",
    points: 1450,
    lifetimePoints: 3200,
    walletBalance: 750,
    cashbackBalance: 120,
    joinDate: "2026-01-15",
    validUntil: "2027-01-15",
    referralCode: "CINE7849",
  });
});

// GET all available membership tiers
router.get("/tiers", async (req: Request, res: Response) => {
  const tiers = [
    {
      name: "Bronze",
      minPoints: 0,
      discount: 5,
      benefits: ["Standard Support", "Earn 1x Points on bookings"]
    },
    {
      name: "Silver",
      minPoints: 500,
      discount: 10,
      benefits: ["Priority Support", "Earn 1.2x Points", "Free Popcorn on Birthdays"]
    },
    {
      name: "Gold",
      minPoints: 1200,
      discount: 15,
      benefits: ["Early Booking Access", "Earn 1.5x Points", "Free Lounge Access", "Free Parking"]
    },
    {
      name: "Platinum",
      minPoints: 3000,
      discount: 20,
      benefits: ["Free Seat Upgrades", "Earn 2x Points", "VIP Lounge Access", "Exclusive Events Invite"]
    }
  ];
  res.status(200).json(tiers);
});

// GET user wallet details and history
router.get("/wallet/history", async (req: Request, res: Response) => {
  const transactions = [
    {
      id: "txn-901",
      timestamp: "2026-07-18T10:30:00Z",
      amount: 150,
      type: "CREDIT",
      source: "Cashback Conversion",
      status: "COMPLETED"
    },
    {
      id: "txn-902",
      timestamp: "2026-07-15T19:00:00Z",
      amount: 620,
      type: "DEBIT",
      source: "Ticket Booking #bk-7849c",
      status: "COMPLETED"
    },
    {
      id: "txn-903",
      timestamp: "2026-07-10T14:20:00Z",
      amount: 500,
      type: "CREDIT",
      source: "Manual Wallet Topup",
      status: "COMPLETED"
    }
  ];
  res.status(200).json(transactions);
});

// GET membership activity timeline
router.get("/activity", async (req: Request, res: Response) => {
  const activities = [
    {
      id: "act-1",
      timestamp: "2026-07-18T10:30:00Z",
      title: "Points Earned",
      description: "Earned 50 points for reviewing 'Aether: Rising Stars'."
    },
    {
      id: "act-2",
      timestamp: "2026-07-15T19:00:00Z",
      title: "Booking Completed",
      description: "Booked 2 tickets for 'Aether: Rising Stars' (Earned 120 points)."
    },
    {
      id: "act-3",
      timestamp: "2026-07-01T12:00:00Z",
      title: "Membership Upgraded",
      description: "Congratulations! You upgraded to Gold Membership tier."
    }
  ];
  res.status(200).json(activities);
});

export default router;
