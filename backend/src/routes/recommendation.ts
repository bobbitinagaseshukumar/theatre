import { Router, Request, Response } from "express";
import { prisma } from "../index";

const router = Router();

// GET AI food recommendations based on context query parameters
router.get("/recommendations", async (req: Request, res: Response) => {
  const { movieId, genre, showTime, seatCategory, groupSize } = req.query;
  const size = parseInt(groupSize as string) || 2;
  const isLateNight = showTime ? (showTime as string).includes("PM") && parseInt((showTime as string).split(":")[0]) >= 8 : false;

  const recommendations: any[] = [];

  // Rule 1: VIP seat category upgrades to premium menu
  if (seatCategory === "VIP" || seatCategory === "RECLINER") {
    recommendations.push({
      id: "f-rec-1",
      name: "Truffle Glazed Wild Mushrooms Pizza",
      description: "Baked on a thin artisanal sourdough crust, brushed with rich black truffle butter.",
      price: 480,
      offerPrice: 399,
      badge: "Premium Selection",
      whyMsg: "Recommended because you chose Luxury Recliner seats.",
      rating: 4.9,
      prepTime: "8 Mins",
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop"
    });
  }

  // Rule 2: Large groups suggest family combo
  if (size >= 3) {
    recommendations.push({
      id: "f-rec-2",
      name: "CineVerse Family Fiesta Combo",
      description: "2 Large Caramel Popcorns + 3 Fountain Sodas + 1 Loaded Avocado Nachos platter.",
      price: 980,
      offerPrice: 799,
      badge: "Family Combo",
      whyMsg: "Best value for your group of " + size + " customers.",
      rating: 4.8,
      prepTime: "5 Mins",
      imageUrl: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=400&auto=format&fit=crop"
    });
  }

  // Rule 3: Movie genre based context
  if (genre === "Action" || genre === "Sci-Fi") {
    recommendations.push({
      id: "f-rec-3",
      name: "Flamin' Hot Buffalo Chicken Wings",
      description: "Crispy chicken wings tossed in gourmet buffalo spice sauce with ranch dip.",
      price: 350,
      offerPrice: 290,
      badge: "Action Companion",
      whyMsg: "Action and Sci-Fi film fans usually order spicy treats.",
      rating: 4.7,
      prepTime: "6 Mins",
      imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=400&auto=format&fit=crop"
    });
  }

  // Rule 4: Late night shows get warm coffee suggestions
  if (isLateNight) {
    recommendations.push({
      id: "f-rec-4",
      name: "Artisanal Hazelnut Cafe Latte",
      description: "Freshly brewed espresso shots blended with warm hazelnut syrup and milk foam.",
      price: 190,
      offerPrice: 150,
      badge: "Late Night Boost",
      whyMsg: "Stay energetic during your late night screening.",
      rating: 4.8,
      prepTime: "3 Mins",
      imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=400&auto=format&fit=crop"
    });
  }

  // Fallback default recommendation if list is thin
  if (recommendations.length === 0) {
    recommendations.push({
      id: "f-rec-default",
      name: "CineVerse Movie Combo Saver",
      description: "1 Large Popcorn + 1 Medium Drink of choice.",
      price: 320,
      offerPrice: 280,
      badge: "Top Pick",
      whyMsg: "Best selling popcorn snack package today.",
      rating: 4.7,
      prepTime: "2 Mins",
      imageUrl: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=400&auto=format&fit=crop"
    });
  }

  res.status(200).json(recommendations);
});

// GET trending food items
router.get("/trending", async (req: Request, res: Response) => {
  const trending = [
    {
      id: "f-trend-1",
      name: "Truffle Butter Popcorn (L)",
      price: 240,
      offerPrice: 199,
      badge: "Trending Today",
      rating: 4.9,
      imageUrl: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: "f-trend-2",
      name: "Loaded Avocado Nachos",
      price: 320,
      offerPrice: 280,
      badge: "Fast Selling",
      rating: 4.8,
      imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=300&auto=format&fit=crop"
    }
  ];
  res.status(200).json(trending);
});

// POST analytics click trackers
router.post("/recommendation-click", async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Click logged." });
});

router.post("/recommendation-conversion", async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Conversion logged." });
});

export default router;
