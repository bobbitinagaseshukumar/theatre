import { Router, Request, Response } from "express";
import { prisma } from "../index";
import { protect, restrictTo } from "../middleware/auth";
import { Role, MovieStatus } from "@prisma/client";

const router = Router();

// GET all upcoming movies
router.get("/", async (req: Request, res: Response) => {
  try {
    const upcoming = await prisma.movie.findMany({
      where: {
        status: MovieStatus.UPCOMING,
        isActive: true,
      },
      orderBy: { releaseDate: "asc" },
    });
    res.status(200).json(upcoming);
  } catch (error) {
    res.status(200).json([]);
  }
});

// GET single upcoming movie by ID
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const movie = await prisma.movie.findUnique({
      where: { id },
    });

    if (!movie || movie.status !== MovieStatus.UPCOMING) {
      res.status(404).json({ message: "Upcoming movie not found." });
      return;
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch upcoming movie details." });
  }
});

// POST create upcoming movie (Admin/Owner only)
router.post("/admin", protect, restrictTo(Role.OWNER, Role.SUPER_ADMIN), async (req: Request, res: Response) => {
  try {
    const { title, description, trailerUrl, posterUrl, bannerUrl, duration, releaseDate, language, genre, ageRestriction, cast } = req.body;
    
    const newMovie = await prisma.movie.create({
      data: {
        title,
        description,
        trailerUrl,
        posterUrl,
        bannerUrl,
        duration: parseInt(duration) || 120,
        releaseDate: new Date(releaseDate),
        language: language || ["English"],
        genre: genre || ["Action"],
        ageRestriction: ageRestriction || "UA",
        cast: cast || [],
        status: MovieStatus.UPCOMING,
      },
    });

    res.status(201).json({ message: "Upcoming movie created successfully", movie: newMovie });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to create upcoming movie.", error: error.message });
  }
});

// PUT update upcoming movie
router.put("/admin/:id", protect, restrictTo(Role.OWNER, Role.SUPER_ADMIN), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, trailerUrl, posterUrl, bannerUrl, duration, releaseDate, language, genre, ageRestriction, cast, status } = req.body;

    const updated = await prisma.movie.update({
      where: { id },
      data: {
        title,
        description,
        trailerUrl,
        posterUrl,
        bannerUrl,
        duration: duration ? parseInt(duration) : undefined,
        releaseDate: releaseDate ? new Date(releaseDate) : undefined,
        language,
        genre,
        ageRestriction,
        cast,
        status: status as MovieStatus,
      },
    });

    res.status(200).json({ message: "Upcoming movie updated successfully", movie: updated });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update upcoming movie.", error: error.message });
  }
});

// DELETE upcoming movie
router.delete("/admin/:id", protect, restrictTo(Role.OWNER, Role.SUPER_ADMIN), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.movie.delete({ where: { id } });
    res.status(200).json({ message: "Upcoming movie deleted successfully." });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to delete upcoming movie.", error: error.message });
  }
});

export default router;
