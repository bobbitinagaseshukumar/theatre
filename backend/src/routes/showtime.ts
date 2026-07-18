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
  try {
    const day = date ? new Date(String(date)) : null;
    const nextDay = day ? new Date(day) : null;
    if (nextDay) nextDay.setDate(nextDay.getDate() + 1);

    const dbShowtimes = await prisma.showtime.findMany({
      where: {
        ...(movieId ? { movieId: String(movieId) } : {}),
        ...(day && nextDay ? { startTime: { gte: day, lt: nextDay } } : {}),
      },
      include: {
        movie: true,
        screen: true,
        showtimeSeats: true,
      },
      orderBy: { startTime: "asc" },
    });

    if (dbShowtimes.length > 0) {
      return res.status(200).json(
        dbShowtimes.map((showtime) => {
          const booked = showtime.showtimeSeats.filter((seat) => seat.status === "BOOKED").length;
          const locked = showtime.showtimeSeats.filter((seat) => seat.status === "LOCKED" && seat.lockedUntil && seat.lockedUntil > new Date()).length;
          const totalSeats = showtime.showtimeSeats.length || showtime.screen.totalRows * showtime.screen.totalCols;
          return {
            id: showtime.id,
            movieId: showtime.movieId,
            movie: showtime.movie.title,
            time: showtime.startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            date: showtime.startTime.toISOString().slice(0, 10),
            format: showtime.screen.name.includes("IMAX") ? "IMAX 3D" : "2D",
            screen: showtime.screen.name,
            availableSeats: Math.max(0, totalSeats - booked - locked),
            totalSeats,
            booked,
            basePrice: showtime.basePrice,
            revenue: booked * showtime.basePrice,
            status: totalSeats - booked - locked <= 0 ? "FULL" : "OPEN",
          };
        })
      );
    }
  } catch {
    // fall through to seeded demo data
  }

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

router.post("/showtimes", protect, restrictTo(Role.OWNER, Role.SUPER_ADMIN, Role.MANAGER), async (req: Request, res: Response) => {
  try {
    const { movieId, movieTitle, screenName, date, time, basePrice } = req.body;
    if ((!movieId && !movieTitle) || !screenName || !date || !time || !basePrice) {
      return res.status(400).json({ message: "Movie, screen, date, time, and base price are required." });
    }

    const movie = movieId
      ? await prisma.movie.findUnique({ where: { id: String(movieId) } })
      : await prisma.movie.findFirst({ where: { title: String(movieTitle), isActive: true } });
    if (!movie) return res.status(404).json({ message: "Movie not found." });

    const startTime = new Date(`${date} ${time}`);
    if (Number.isNaN(startTime.getTime())) {
      return res.status(400).json({ message: "Invalid show date or time." });
    }
    const endTime = new Date(startTime.getTime() + movie.duration * 60 * 1000);
    const screen = await prisma.screen.upsert({
      where: { name: String(screenName) },
      update: { isActive: true },
      create: { name: String(screenName), totalRows: 10, totalCols: 15 },
    });

    const showtime = await prisma.showtime.create({
      data: {
        movieId: movie.id,
        screenId: screen.id,
        startTime,
        endTime,
        basePrice: Number(basePrice),
      },
      include: { movie: true, screen: true },
    });

    const screenSeats = [];
    for (let rowIdx = 0; rowIdx < screen.totalRows; rowIdx += 1) {
      const row = String.fromCharCode(65 + rowIdx);
      for (let col = 1; col <= screen.totalCols; col += 1) {
        const seatNumber = `${row}-${col}`;
        const seat = await prisma.screenSeat.upsert({
          where: { screenId_seatNumber: { screenId: screen.id, seatNumber } },
          update: {},
          create: { screenId: screen.id, seatNumber, row, col },
        });
        screenSeats.push(seat);
      }
    }

    await prisma.showtimeSeat.createMany({
      data: screenSeats.map((seat) => ({ showtimeId: showtime.id, screenSeatId: seat.id })),
      skipDuplicates: true,
    });

    return res.status(201).json({
      message: "Showtime created successfully.",
      showtime: {
        id: showtime.id,
        movieId: showtime.movieId,
        movie: showtime.movie.title,
        screen: showtime.screen.name,
        date,
        time,
        totalSeats: screenSeats.length,
        booked: 0,
        available: screenSeats.length,
        basePrice: showtime.basePrice,
        vipPrice: Number(showtime.basePrice) + 200,
        revenue: 0,
        status: "OPEN",
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to create showtime.", error: error.message });
  }
});

router.delete("/showtimes/:id", protect, restrictTo(Role.OWNER, Role.SUPER_ADMIN, Role.MANAGER), async (req: Request, res: Response) => {
  try {
    const activeBookings = await prisma.booking.count({
      where: { showtimeId: req.params.id, status: { in: ["PENDING", "CONFIRMED"] } },
    });
    if (activeBookings > 0) {
      return res.status(409).json({ message: "Cannot cancel a show with active bookings." });
    }
    await prisma.showtime.delete({ where: { id: req.params.id } });
    return res.status(200).json({ message: "Showtime cancelled successfully." });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to cancel showtime.", error: error.message });
  }
});

router.patch("/showtimes/:id", protect, restrictTo(Role.OWNER, Role.SUPER_ADMIN, Role.MANAGER), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { screenName, date, time, basePrice } = req.body;

    const showtime = await prisma.showtime.findUnique({
      where: { id },
      include: { movie: true, screen: true }
    });

    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found." });
    }

    // Check for active bookings if screenName or date/time changes
    const hasChanges = screenName || date || time;
    if (hasChanges) {
      const activeBookings = await prisma.booking.count({
        where: { showtimeId: id, status: { in: ["PENDING", "CONFIRMED"] } },
      });
      if (activeBookings > 0) {
        return res.status(409).json({ message: "Cannot edit showtime details (date, time, screen) with active bookings." });
      }
    }

    let screenId = showtime.screenId;
    if (screenName && screenName !== showtime.screen.name) {
      const screen = await prisma.screen.upsert({
        where: { name: String(screenName) },
        update: { isActive: true },
        create: { name: String(screenName), totalRows: 10, totalCols: 15 },
      });
      screenId = screen.id;
    }

    let startTime = showtime.startTime;
    let endTime = showtime.endTime;
    if (date || time) {
      const activeDate = date || showtime.startTime.toISOString().slice(0, 10);
      const activeTime = time || showtime.startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
      startTime = new Date(`${activeDate} ${activeTime}`);
      if (Number.isNaN(startTime.getTime())) {
        return res.status(400).json({ message: "Invalid date or time." });
      }
      endTime = new Date(startTime.getTime() + showtime.movie.duration * 60 * 1000);
    }

    const updatedShowtime = await prisma.showtime.update({
      where: { id },
      data: {
        screenId,
        startTime,
        endTime,
        basePrice: basePrice ? Number(basePrice) : undefined,
      },
      include: { movie: true, screen: true, showtimeSeats: true },
    });

    // If screen changed, delete old seats and create new showtime seats
    if (screenId !== showtime.screenId) {
      await prisma.showtimeSeat.deleteMany({
        where: { showtimeId: id }
      });

      const screen = await prisma.screen.findUnique({ where: { id: screenId } });
      if (screen) {
        const screenSeats = [];
        for (let rowIdx = 0; rowIdx < screen.totalRows; rowIdx += 1) {
          const row = String.fromCharCode(65 + rowIdx);
          for (let col = 1; col <= screen.totalCols; col += 1) {
            const seatNumber = `${row}-${col}`;
            const seat = await prisma.screenSeat.upsert({
              where: { screenId_seatNumber: { screenId: screen.id, seatNumber } },
              update: {},
              create: { screenId: screen.id, seatNumber, row, col },
            });
            screenSeats.push(seat);
          }
        }
        await prisma.showtimeSeat.createMany({
          data: screenSeats.map((seat) => ({ showtimeId: id, screenSeatId: seat.id })),
          skipDuplicates: true,
        });
      }
    }

    return res.status(200).json({
      message: "Showtime updated successfully.",
      showtime: {
        id: updatedShowtime.id,
        movieId: updatedShowtime.movieId,
        movie: updatedShowtime.movie.title,
        screen: updatedShowtime.screen.name,
        date: updatedShowtime.startTime.toISOString().slice(0, 10),
        time: updatedShowtime.startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        totalSeats: updatedShowtime.showtimeSeats?.length || 150,
        booked: 0,
        available: updatedShowtime.showtimeSeats?.length || 150,
        basePrice: updatedShowtime.basePrice,
        vipPrice: Number(updatedShowtime.basePrice) + 200,
        revenue: 0,
        status: "OPEN",
      }
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to update showtime.", error: error.message });
  }
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
