import { Router, Request, Response } from "express";
import { prisma } from "../index";
import { protect, restrictTo } from "../middleware/auth";
import { Role } from "@prisma/client";

const router = Router();

// GET all theatres
router.get("/theatres", async (req: Request, res: Response) => {
  // Return list of premium theatres
  const theatres = [
    {
      id: "th-1",
      name: "CineVerse Prestige - Screen 1",
      distance: "1.2 km",
      amenities: ["AC", "Dolby Atmos", "Wheelchair Access", "Food & Beverage", "Valet Parking", "Luxury Recliners"],
      rating: 4.8,
    },
    {
      id: "th-2",
      name: "CineVerse IMAX Dome",
      distance: "3.4 km",
      amenities: ["IMAX Laser", "Dolby Vision", "Food & Beverage", "Parking"],
      rating: 4.9,
    }
  ];
  res.status(200).json(theatres);
});

// GET all showtimes for a movie
router.get("/showtimes", async (req: Request, res: Response) => {
  const { movieId, date } = req.query;
  // Return list of dynamic showtimes
  const showtimes = [
    {
      id: "st-1",
      time: "10:30 AM",
      format: "IMAX 3D",
      screen: "IMAX Laser Hall",
      availableSeats: 120, // Green
      basePrice: 380,
    },
    {
      id: "st-2",
      time: "02:15 PM",
      format: "3D",
      screen: "Screen 1 - Dolby",
      availableSeats: 40, // Yellow
      basePrice: 280,
    },
    {
      id: "st-3",
      time: "06:30 PM",
      format: "2D",
      screen: "Screen 1 - Dolby",
      availableSeats: 8, // Red (Almost full)
      basePrice: 220,
    },
    {
      id: "st-4",
      time: "09:45 PM",
      format: "4DX",
      screen: "Screen 2 - 4DX",
      availableSeats: 0, // Grey (House full)
      basePrice: 450,
    }
  ];
  res.status(200).json(showtimes);
});

// GET pricing configurations
router.get("/pricing", async (req: Request, res: Response) => {
  const pricing = {
    morningPrice: 180,
    afternoonPrice: 220,
    eveningPrice: 280,
    weekendPrice: 320,
    reclinerPrice: 450
  };
  res.status(200).json(pricing);
});

export default router;
