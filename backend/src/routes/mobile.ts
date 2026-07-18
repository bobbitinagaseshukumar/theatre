import { Router, Request, Response } from "express";

const router = Router();

// POST /mobile/login - Mobile pin and biometric login
router.post("/login", async (req: Request, res: Response) => {
  const { phoneNumber, pin, role } = req.body;
  res.json({
    success: true,
    token: "mob-tok-" + Math.floor(Math.random() * 100000),
    user: {
      phoneNumber,
      role: role || "CUSTOMER",
      name: "Priya Sharma",
      email: "priya@gmail.com"
    }
  });
});

// POST /otp - Dispatch & verify OTP code
router.post("/otp", async (req: Request, res: Response) => {
  const { phoneNumber, code } = req.body;
  if (code) {
    res.json({ success: true, message: "OTP verified." });
  } else {
    res.json({ success: true, message: `OTP sent to ${phoneNumber}.` });
  }
});

// GET /mobile/home - Customizable layout widgets from owner dashboard config
router.get("/home", async (_req: Request, res: Response) => {
  res.json({
    splashSettings: {
      animationDuration: 3,
      theme: "Classic 3D Cinema Curtain",
      bgMusic: "orchestral_intro.mp3"
    },
    heroBanner: {
      movieTitle: "Aether: Rising Stars",
      genre: "Sci-Fi / Thriller",
      rating: 4.8,
      posterUrl: "https://cinemapromax.com/assets/aether_poster.jpg",
      formats: ["IMAX 3D", "4DX"]
    },
    offers: [
      { id: "off-1", title: "Flat 20% Off Truffle Butter Combos", code: "TRUFFLE20" },
      { id: "off-2", title: "Buy 1 Get 1 Free on Tuesday IMAX shows", code: "IMAXBOGO" }
    ],
    nowPlaying: [
      { id: "mov-01", name: "Aether: Rising Stars", genre: "Sci-Fi", rating: 4.8 },
      { id: "mov-02", name: "Shadows of the Dynasty", genre: "Action", rating: 4.5 }
    ]
  });
});

// GET /movies - Search & filter movies
router.get("/movies", async (req: Request, res: Response) => {
  const { genre, format } = req.query;
  res.json({
    genreFilter: genre || "All",
    formatFilter: format || "IMAX",
    results: [
      { id: "mov-01", name: "Aether: Rising Stars", duration: "148 mins", cast: ["Arjun Kapoor", "Meera Patel"] },
      { id: "mov-02", name: "Shadows of the Dynasty", duration: "132 mins", cast: ["Ravi Kumar"] }
    ]
  });
});

// POST /booking - Create seat blocks
router.post("/booking", async (req: Request, res: Response) => {
  const { movieId, seatNumbers, showTimeId } = req.body;
  res.status(201).json({
    bookingId: "bk-mob-" + Math.floor(Math.random() * 10000),
    movieId,
    seatNumbers,
    showTimeId,
    amount: seatNumbers.length * 450,
    status: "HELD"
  });
});

// POST /payment - simulated success animation configs
router.post("/payment", async (req: Request, res: Response) => {
  const { bookingId, method } = req.body;
  res.json({
    success: true,
    bookingId,
    method,
    transactionId: "txn-" + Math.floor(Math.random() * 90000 + 10000),
    ticketUrl: `https://cinemapromax.com/ticket/${bookingId}/pdf`,
    animation: {
      type: "3D_FLYING_TICKET",
      particles: "confetti",
      sound: "success_chime.wav"
    }
  });
});

// GET /ticket - Digital ticket configs
router.get("/ticket", async (req: Request, res: Response) => {
  res.json({
    ticketId: "bk-mob-882",
    movie: "Aether: Rising Stars",
    seats: ["D-4", "D-5"],
    qrCode: "MOBILETICKET_VERIFY_CPMAX_2910c",
    screen: "IMAX Screen 1",
    theatre: "CineVerse Mumbai",
    time: "Tonight at 08:30 PM",
    foodItem: "Truffle Butter Popcorn Combo x1"
  });
});

// POST /food/order - mobile concessions order
router.post("/food/order", async (req: Request, res: Response) => {
  res.json({
    orderId: "f-mob-" + Math.floor(Math.random() * 10000),
    items: req.body.items || [],
    deliveryType: req.body.seatNumber ? "SEAT_DELIVERY" : "COUNTER_PICKUP",
    seatNumber: req.body.seatNumber || null,
    status: "PREPARING"
  });
});

// GET /profile - wallet and digital badges
router.get("/profile", async (_req: Request, res: Response) => {
  res.json({
    name: "Priya Sharma",
    tier: "VIP Gold",
    rewardPoints: 2450,
    walletBalance: 750,
    achievements: [
      { id: "badge-1", name: "Sci-Fi Fanatic", icon: "🚀", desc: "Watched 5 sci-fi movies in a row." },
      { id: "badge-2", name: "Truffle Lover", icon: "🍿", desc: "Ordered Truffle Popcorn 10 times." }
    ]
  });
});

// POST /notification - Send FCM Push
router.post("/notification", async (req: Request, res: Response) => {
  const { title, body, topic } = req.body;
  res.json({
    success: true,
    messageId: "fcm-msg-" + Math.floor(Math.random() * 100000),
    title,
    body,
    topic: topic || "All_Users"
  });
});

export default router;
