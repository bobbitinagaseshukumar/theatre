import { Router, Request, Response } from "express";
import { prisma } from "../index";
import { protect, AuthenticatedRequest } from "../middleware/auth";
import { BookingStatus, ShowtimeSeatStatus } from "@prisma/client";

const router = Router();

// Create pending booking
router.post("/", protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { showtimeId, seatNumbers, foodItems, totalPrice } = req.body;
    const userId = req.user?.id;

    if (!showtimeId || !seatNumbers || seatNumbers.length === 0 || !totalPrice || !userId) {
      res.status(400).json({ message: "Invalid booking details." });
      return;
    }

    // Wrap in transaction: check seats availability, lock them, create booking
    const booking = await prisma.$transaction(async (tx) => {
      // 1. Check if seats are already booked/locked
      const showtime = await tx.showtime.findUnique({
        where: { id: showtimeId },
        include: { screen: true },
      });

      if (!showtime) {
        throw new Error("Showtime not found.");
      }

      // Check if ScreenSeats exist, create if they don't (simplified dynamic seat setup)
      for (const seatNum of seatNumbers) {
        const parts = seatNum.split("-");
        const row = parts[0];
        const col = parseInt(parts[1]);

        let screenSeat = await tx.screenSeat.findUnique({
          where: { screenId_seatNumber: { screenId: showtime.screenId, seatNumber: seatNum } },
        });

        if (!screenSeat) {
          screenSeat = await tx.screenSeat.create({
            data: {
              screenId: showtime.screenId,
              seatNumber: seatNum,
              row,
              col,
            },
          });
        }

        // Check if ShowtimeSeat is booked
        const showtimeSeat = await tx.showtimeSeat.findUnique({
          where: { showtimeId_screenSeatId: { showtimeId, screenSeatId: screenSeat.id } },
        });

        if (showtimeSeat && showtimeSeat.status === ShowtimeSeatStatus.BOOKED) {
          throw new Error(`Seat ${seatNum} is already booked.`);
        }
      }

      // Create Booking
      const newBooking = await tx.booking.create({
        data: {
          userId,
          showtimeId,
          totalPrice,
          seatNumbers,
          foodItems: foodItems || [],
          status: BookingStatus.PENDING,
        },
      });

      return newBooking;
    });

    res.status(201).json({ message: "Booking initiated successfully.", bookingId: booking.id });
  } catch (error: any) {
    console.error("Booking error:", error);
    res.status(500).json({ message: error.message || "Failed to initiate booking." });
  }
});

// GET bookings history (Authenticated user)
router.get("/history", protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const bookings = await prisma.booking.findMany({
      where: { userId, status: BookingStatus.CONFIRMED },
      include: {
        showtime: {
          include: {
            movie: true,
          },
        },
      },
      orderBy: { bookingDate: "desc" },
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(200).json([]);
  }
});

// GET /booking/intelligence - Dashboard live stats
router.get("/intelligence", async (_req: Request, res: Response) => {
  try {
    const liveRate = 18.4; // booking attempts per minute
    const expectedOccupancy = 78.5; // percent
    const demandScore = 84.2; // 0-100
    const pricingMode = "AI_SUGGESTION"; // AUTO, Suggestion, Manual

    res.json({
      liveRate,
      expectedOccupancy,
      demandScore,
      pricingMode,
      revenuePrediction: 1245000,
      activeRulesCount: await prisma.pricingRule.count() || 4,
      popularShows: [
        { movieTitle: "Aether: Rising Stars", time: "Friday 7 PM", occupancy: "95%" },
        { movieTitle: "Shadows of the Dynasty", time: "Saturday 6 PM", occupancy: "88%" }
      ],
      waitlistsCount: await prisma.waitlist.count()
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to read booking intelligence", error: error.message });
  }
});

// GET /demand/prediction - Runs AI demand forecasting
router.get("/prediction", async (req: Request, res: Response) => {
  try {
    const { movieId } = req.query;

    let scoreVal = 78.5;
    if (movieId) {
      const dbScore = await prisma.demandScore.findUnique({
        where: { movieId: movieId as string }
      });
      if (dbScore) {
        scoreVal = dbScore.score;
      }
    }

    res.json({
      movieId: movieId || "mov-all",
      demandScore: scoreVal,
      occupancyForecast: scoreVal > 80 ? "VERY_HIGH" : scoreVal > 60 ? "HIGH" : "MEDIUM",
      weatherImpact: "Heavy rain may decrease attendance by 12%",
      weekendSurge: scoreVal > 70 ? "+25% price multiplier suggested" : "Standard pricing"
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to forecast demand", error: error.message });
  }
});

// POST /pricing/update - Updates dynamic price rule parameters
router.post("/pricing/update", async (req: Request, res: Response) => {
  try {
    const { name, minPrice, maxPrice, discountLimit, premiumLimit } = req.body;
    const rule = await prisma.pricingRule.create({
      data: {
        name,
        minPrice: parseFloat(minPrice) || 150,
        maxPrice: parseFloat(maxPrice) || 600,
        discountLimit: parseFloat(discountLimit) || 10,
        premiumLimit: parseFloat(premiumLimit) || 30
      }
    });

    res.status(201).json({
      success: true,
      message: "Dynamic pricing rule saved successfully",
      rule
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update pricing rules", error: error.message });
  }
});

// GET /seat/heatmap - Returns seats demand map colors
router.get("/heatmap", async (req: Request, res: Response) => {
  try {
    const { showId } = req.query;
    
    // Query demand analytics if available
    const seatMetrics = await prisma.seatAnalytic.findMany({
      where: { showId: (showId as string) || "show-default" }
    });

    if (seatMetrics.length === 0) {
      // Return predefined heatmap matrix colors
      return res.json([
        { seat: "E-11", demand: "HIGH", score: 98, booked: true },
        { seat: "E-12", demand: "HIGH", score: 98, booked: true },
        { seat: "A-1", demand: "LOW", score: 25, booked: false },
        { seat: "B-5", demand: "MEDIUM", score: 62, booked: false }
      ]);
    }

    res.json(seatMetrics.map(s => ({
      seat: s.seatNumber,
      demand: s.demandScore > 80 ? "HIGH" : s.demandScore > 40 ? "MEDIUM" : "LOW",
      score: s.demandScore,
      booked: s.bookingSpeed > 5.0
    })));
  } catch (error: any) {
    res.status(500).json({ message: "Failed to load heatmap", error: error.message });
  }
});

// POST /waitlist/add - Adds user to full show waitlist
router.post("/waitlist/add", async (req: Request, res: Response) => {
  try {
    const { showId, customerId } = req.body;
    const item = await prisma.waitlist.create({
      data: {
        showId: showId || "show-default",
        customerId: customerId || "cust-anon"
      }
    });

    res.status(201).json({
      success: true,
      message: "Added to waitlist queue successfully.",
      waitlistId: item.id
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to join waitlist", error: error.message });
  }
});

// GET /revenue/optimization - Suggests pricing and slots adjustments
router.get("/revenue/optimization", async (_req: Request, res: Response) => {
  try {
    const forecasts = await prisma.revenueForecast.findMany({
      take: 7,
      orderBy: { forecastDate: "asc" }
    });

    res.json({
      weeklyExpectedRevenue: forecasts.reduce((acc, f) => acc + f.expectedVal, 0) || 842000,
      forecastsCount: forecasts.length,
      suggestions: [
        { type: "TICKET", suggestion: "Increase Friday Screen 1 prices by 15%", impactRevenue: 12500 },
        { type: "CONCESSIONS", suggestion: "Promote F&B combo pop-ups during Comedy screenings", impactRevenue: 8400 }
      ]
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to optimize revenue", error: error.message });
  }
});

// POST /fraud/check - Detects bots and fast bookings
router.post("/fraud/check", async (req: Request, res: Response) => {
  try {
    const { customerId, activityType } = req.body;
    
    // Simulate risk scoring algorithm
    const riskScore = activityType === "FAST_REFRESH" ? 82.5 : 12.0;

    const alert = await prisma.fraudDetection.create({
      data: {
        customerId: customerId || "usr-anon",
        riskScore,
        reason: activityType === "FAST_REFRESH" ? "Multiple rapid seating clicks" : "Standard browsing pattern",
        status: riskScore > 75 ? "BLOCKED" : "APPROVED"
      }
    });

    res.json({
      fraudAlertId: alert.id,
      riskScore,
      status: alert.status,
      actionRequired: riskScore > 75
    });
  } catch (error: any) {
    res.status(500).json({ message: "Security check failed", error: error.message });
  }
});

// GET booking by id
router.get("/:id", protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        showtime: {
          include: {
            movie: true,
          },
        },
      },
    });

    if (!booking) {
      res.status(404).json({ message: "Booking not found." });
      return;
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch booking details." });
  }
});

export default router;
