import { Router, Request, Response } from "express";

const router = Router();

// GET /website/theme - Fetch colors and typography
router.get("/theme", async (_req: Request, res: Response) => {
  res.json({
    id: "thm-001",
    name: "Future Cyber Gold",
    primaryColor: "#EF4444",
    secondaryColor: "#0F172A",
    accentColor: "#F59E0B",
    fontFamily: "Outfit",
    glowEffects: true,
    particlesCount: 80
  });
});

// GET /homepage - Active sections configuration
router.get("/homepage", async (_req: Request, res: Response) => {
  res.json({
    sections: [
      { id: "sec-1", sectionId: "hero", title: "Experience Movies Beyond Reality", subtitle: "Enter the CineVerse", isVisible: true },
      { id: "sec-2", sectionId: "nowplaying", title: "Now Playing in Theatres", subtitle: "Book tickets instantly", isVisible: true },
      { id: "sec-3", sectionId: "upcoming", title: "Coming Soon Blockbusters", subtitle: "Pre-book tickets", isVisible: true },
      { id: "sec-4", sectionId: "food", title: "F&B Concession Lounge", subtitle: "Seat delivery available", isVisible: true },
      { id: "sec-5", sectionId: "membership", title: "Premium Membership Tiers", subtitle: "Unlock exclusive rewards", isVisible: true }
    ],
    heroBanner: {
      id: "ban-901",
      title: "Aether: Rising Stars",
      subtitle: "Now Streaming in IMAX 3D and 4DX formats",
      bgImageUrl: "https://cinemapromax.com/assets/aether_banner.jpg",
      movieLink: "/movie/aether-rising"
    }
  });
});

// GET /movies - Movie list tag ribbons
router.get("/movies", async (_req: Request, res: Response) => {
  res.json([
    { movieId: "mov-01", isFeatured: true, badgeText: "BLOCKBUSTER", ribbonColor: "#EF4444" },
    { movieId: "mov-02", isFeatured: false, badgeText: "POPULAR", ribbonColor: "#3B82F6" },
    { movieId: "mov-03", isFeatured: true, badgeText: "SELLING FAST", ribbonColor: "#F59E0B" }
  ]);
});

// GET /offers - Slidable discount coupons
router.get("/offers", async (_req: Request, res: Response) => {
  res.json([
    { id: "off-1", title: "Weekday BOGO Deal", couponCode: "BOGOWEEK", discountValue: "Buy 1 Get 1 Free", bgGradient: "from-blue-600 to-indigo-900" },
    { id: "off-2", title: "Snack Combo discount", couponCode: "POPCORN20", discountValue: "20% OFF F&B", bgGradient: "from-amber-500 to-yellow-600" }
  ]);
});

// GET /settings - Smooth scroll and SEO tags
router.get("/settings", async (_req: Request, res: Response) => {
  res.json({
    animation: {
      smoothScroll: true,
      parallaxStrength: 0.5,
      hoverTiltEnabled: true,
      fadeTransitions: true
    },
    seo: {
      titlePrefix: "Cinema Pro Max",
      description: "Book tickets online and enjoy gourmet seat delivery in ultra premium IMAX screens.",
      metaKeys: ["Cinema", "IMAX Mumbai", "Ticket Bookings", "Truffle Popcorn"]
    }
  });
});

// POST /theme/update - Modify colors
router.post("/theme/update", async (req: Request, res: Response) => {
  const { primaryColor, secondaryColor, accentColor, glowEffects } = req.body;
  res.json({
    success: true,
    message: "Theme overrides saved.",
    updatedTheme: {
      primaryColor,
      secondaryColor,
      accentColor,
      glowEffects
    }
  });
});

// POST /banner/update - Change banner poster
router.post("/banner/update", async (req: Request, res: Response) => {
  const { title, subtitle, bgImageUrl } = req.body;
  res.json({
    success: true,
    message: "Hero Banner updated.",
    updatedBanner: {
      title,
      subtitle,
      bgImageUrl
    }
  });
});

export default router;
