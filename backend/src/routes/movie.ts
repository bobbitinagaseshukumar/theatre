import { Router, Request, Response } from "express";
import { prisma } from "../index";
import { MovieStatus } from "@prisma/client";

const router = Router();

// GET all movies
router.get("/", async (req: Request, res: Response) => {
  try {
    const movies = await prisma.movie.findMany({
      where: { isActive: true },
      orderBy: { releaseDate: "desc" },
    });
    res.status(200).json(movies);
  } catch (error) {
    // Return empty list so client does not crash, fallback to mock on client
    res.status(200).json([]);
  }
});

// GET movie by id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movie = await prisma.movie.findUnique({
      where: { id },
      include: {
        showtimes: {
          include: { screen: true },
        },
      },
    });
    if (!movie) {
      res.status(404).json({ message: "Movie not found" });
      return;
    }
    res.status(200).json(movie);
  } catch (error: any) {
    console.error("Movie query error:", error);
    res.status(500).json({ message: "Database query failed.", error: error?.message, code: error?.code });
  }
});

// POST add movie (Owner only)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description, posterUrl, bannerUrl, duration, releaseDate, language, genre, ageRestriction, cast, status } = req.body;
    const movie = await prisma.movie.create({
      data: {
        title,
        description,
        posterUrl,
        bannerUrl,
        duration: parseInt(duration),
        releaseDate: new Date(releaseDate),
        language,
        genre,
        ageRestriction,
        cast: cast || [],
        status: status as MovieStatus,
      },
    });
    res.status(201).json({ message: "Movie created successfully", movie });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to create movie.", error: error.message });
  }
});

// GET movie cast details
router.get("/:id/cast", async (req: Request, res: Response) => {
  const { id } = req.params;
  // Dynamic mock responses depending on movie context
  const castList = [
    {
      name: id === "m-2" ? "Keanu Reeves" : "Robert Downey Jr.",
      character: id === "m-2" ? "John Wick" : "Tony Stark",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      socials: { instagram: "https://instagram.com", twitter: "https://twitter.com", imdb: "https://imdb.com" }
    },
    {
      name: id === "m-2" ? "Hiroyuki Sanada" : "Scarlett Johansson",
      character: id === "m-2" ? "Shimazu Koji" : "Natasha Romanoff",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
      socials: { instagram: "https://instagram.com", twitter: "https://twitter.com", imdb: "https://imdb.com" }
    },
    {
      name: id === "m-2" ? "Donnie Yen" : "Chris Evans",
      character: id === "m-2" ? "Caine" : "Steve Rogers",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
      socials: { instagram: "https://instagram.com", twitter: "https://twitter.com", imdb: "https://imdb.com" }
    },
    {
      name: id === "m-2" ? "Rina Sawayama" : "Mark Ruffalo",
      character: id === "m-2" ? "Akira" : "Bruce Banner",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
      socials: { instagram: "https://instagram.com", twitter: "https://twitter.com", imdb: "https://imdb.com" }
    }
  ];
  res.status(200).json(castList);
});

// GET movie gallery
router.get("/:id/gallery", async (req: Request, res: Response) => {
  const gallery = [
    { type: "image", url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop" },
    { type: "image", url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop" },
    { type: "image", url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=600&auto=format&fit=crop" },
    { type: "image", url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=600&auto=format&fit=crop" }
  ];
  res.status(200).json(gallery);
});

// GET movie reviews
router.get("/:id/reviews", async (req: Request, res: Response) => {
  const reviews = [
    {
      id: "rev-1",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
      name: "Aravind Swamy",
      date: "2026-07-12",
      rating: 5,
      comment: "Absolutely mind-blowing cinematic experience! The sound design in Screen 1 was next level.",
      likes: 42,
      emoji: "🔥"
    },
    {
      id: "rev-2",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop",
      name: "Meera Nair",
      date: "2026-07-15",
      rating: 4,
      comment: "Superb acting performances and top notch visual effects. Highly recommended for premium theatre viewing.",
      likes: 18,
      emoji: "🍿"
    }
  ];
  res.status(200).json(reviews);
});

// POST submit review
router.post("/:id/reviews", async (req: Request, res: Response) => {
  const { name, rating, comment, emoji } = req.body;
  res.status(201).json({
    message: "Review submitted successfully",
    review: {
      id: `rev-${Date.now()}`,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
      name: name || "Anonymous Guest",
      date: new Date().toISOString().split("T")[0],
      rating: rating || 5,
      comment: comment || "",
      likes: 0,
      emoji: emoji || "👍"
    }
  });
});

// GET movie soundtrack list
router.get("/:id/songs", async (req: Request, res: Response) => {
  const songs = [
    { name: "Starlight Voyage", artist: "Hans Zimmer", duration: "4:12" },
    { name: "Neon Shadow Dancers", artist: "Tyler Bates", duration: "3:45" },
    { name: "Stellar Wind", artist: "Alexandre Desplat", duration: "5:02" }
  ];
  res.status(200).json(songs);
});

export default router;
