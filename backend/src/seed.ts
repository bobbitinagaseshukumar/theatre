/**
 * ═══════════════════════════════════════════════════════════
 * Cinema Pro Max — Database Seed
 * Populates the database with sample data so the deployed site
 * has content out of the box. Safe to re-run (idempotent).
 *
 * Local:   npm run seed
 * Deploy:  runs automatically via the "postbuild"/start hook.
 * ═══════════════════════════════════════════════════════════
 */
import { PrismaClient, Role, MovieStatus, SeatType, FoodCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedUsers() {
  const adminPassword = await bcrypt.hash("Admin@12345", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@cinemapromax.com" },
    update: { role: Role.OWNER, isVerified: true },
    create: {
      email: "admin@cinemapromax.com",
      password: adminPassword,
      name: "Cinema Admin",
      phone: "+919000000001",
      role: Role.OWNER,
      isVerified: true,
    },
  });

  // Optional owner admin from env (keeps real credentials out of source control).
  // Set ADMIN_EMAIL and ADMIN_PASSWORD (e.g. in Render env vars or local .env).
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const ownerPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await prisma.user.upsert({
      where: { email: process.env.ADMIN_EMAIL.toLowerCase() },
      update: { password: ownerPassword, role: Role.OWNER, isVerified: true },
      create: {
        email: process.env.ADMIN_EMAIL.toLowerCase(),
        password: ownerPassword,
        name: process.env.ADMIN_NAME || "Owner",
        role: Role.OWNER,
        isVerified: true,
      },
    });
    console.log(`✅ Owner admin seeded from env (${process.env.ADMIN_EMAIL})`);
  }

  const customerPassword = await bcrypt.hash("Demo@12345", 12);
  await prisma.user.upsert({
    where: { email: "demo@cinemapromax.com" },
    update: { isVerified: true },
    create: {
      email: "demo@cinemapromax.com",
      password: customerPassword,
      name: "Demo Customer",
      phone: "+919000000002",
      role: Role.CUSTOMER,
      isVerified: true,
    },
  });

  console.log("✅ Users seeded (admin + demo customer)");
  return admin;
}

async function seedScreens() {
  const screens = [
    { name: "Screen 1 — Dolby Atmos", totalRows: 8, totalCols: 12 },
    { name: "Screen 2 — IMAX", totalRows: 10, totalCols: 14 },
  ];

  const created = [];
  for (const s of screens) {
    const screen = await prisma.screen.upsert({
      where: { name: s.name },
      update: {},
      create: { name: s.name, totalRows: s.totalRows, totalCols: s.totalCols },
    });

    // Generate seats only if the screen has none yet
    const existingSeats = await prisma.screenSeat.count({ where: { screenId: screen.id } });
    if (existingSeats === 0) {
      const rows = "ABCDEFGHIJ".slice(0, screen.totalRows).split("");
      const data = [];
      for (let r = 0; r < rows.length; r++) {
        for (let c = 1; c <= screen.totalCols; c++) {
          // Last two rows = VIP, middle rows = PREMIUM, front = STANDARD
          let type: SeatType = SeatType.STANDARD;
          if (r >= rows.length - 2) type = SeatType.VIP;
          else if (r >= Math.floor(rows.length / 2)) type = SeatType.PREMIUM;
          data.push({
            screenId: screen.id,
            seatNumber: `${rows[r]}-${c}`,
            row: rows[r],
            col: c,
            type,
          });
        }
      }
      await prisma.screenSeat.createMany({ data, skipDuplicates: true });
    }
    created.push(screen);
  }

  console.log(`✅ Screens seeded (${created.length}) with seat maps`);
  return created;
}

const MOVIES = [
  {
    title: "Quantum Horizon",
    description:
      "A rogue physicist races against time to close a rift threatening to unravel reality itself.",
    posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: 148,
    language: ["English", "Hindi"],
    genre: ["Sci-Fi", "Thriller"],
    rating: 4.6,
    ageRestriction: "U/A",
    cast: [
      { name: "Aria Vance", role: "Dr. Elena", imageUrl: "https://i.pravatar.cc/150?img=5" },
      { name: "Marcus Cole", role: "Agent Rhys", imageUrl: "https://i.pravatar.cc/150?img=12" },
    ],
    status: MovieStatus.NOW_SHOWING,
  },
  {
    title: "Midnight Bazaar",
    description:
      "In a city that never sleeps, a street vendor stumbles into a web of secrets that could change everything.",
    posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: 132,
    language: ["Hindi", "Telugu"],
    genre: ["Drama", "Mystery"],
    rating: 4.3,
    ageRestriction: "U/A",
    cast: [
      { name: "Rohan Iyer", role: "Kabir", imageUrl: "https://i.pravatar.cc/150?img=33" },
      { name: "Sana Kapoor", role: "Meera", imageUrl: "https://i.pravatar.cc/150?img=45" },
    ],
    status: MovieStatus.NOW_SHOWING,
  },
  {
    title: "Iron Valley",
    description:
      "A retired soldier returns home to defend his town from a ruthless mining conglomerate.",
    posterUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: 121,
    language: ["English"],
    genre: ["Action", "Drama"],
    rating: 4.1,
    ageRestriction: "A",
    cast: [
      { name: "Derek Stone", role: "Jonah", imageUrl: "https://i.pravatar.cc/150?img=8" },
    ],
    status: MovieStatus.NOW_SHOWING,
  },
  {
    title: "Starlight Symphony",
    description:
      "An orphaned prodigy chases her dream of conducting the world's greatest orchestra.",
    posterUrl: "https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: 109,
    language: ["English", "Tamil"],
    genre: ["Drama", "Music"],
    rating: 4.7,
    ageRestriction: "U",
    cast: [
      { name: "Lily Chen", role: "Nova", imageUrl: "https://i.pravatar.cc/150?img=20" },
    ],
    status: MovieStatus.UPCOMING,
  },
];

async function seedMovies() {
  const existing = await prisma.movie.count();
  if (existing > 0) {
    console.log(`ℹ️  Movies already present (${existing}) — skipping movie insert`);
    return prisma.movie.findMany();
  }

  const created = [];
  const now = new Date();
  for (const m of MOVIES) {
    const movie = await prisma.movie.create({
      data: {
        ...m,
        releaseDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
    });
    created.push(movie);
  }
  console.log(`✅ Movies seeded (${created.length})`);
  return created;
}

async function seedShowtimes(movies: { id: string; status: MovieStatus }[], screens: { id: string }[]) {
  const existing = await prisma.showtime.count();
  if (existing > 0) {
    console.log(`ℹ️  Showtimes already present (${existing}) — skipping`);
    return;
  }
  if (screens.length === 0) return;

  const nowShowing = movies.filter((m) => m.status === MovieStatus.NOW_SHOWING);
  const slots = [11, 14, 18, 21]; // hours of the day
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const movie of nowShowing) {
    for (let day = 0; day < 3; day++) {
      for (let i = 0; i < slots.length; i++) {
        const screen = screens[i % screens.length];
        const start = new Date(today);
        start.setDate(start.getDate() + day);
        start.setHours(slots[i], 0, 0, 0);
        const end = new Date(start.getTime() + 150 * 60 * 1000);

        const showtime = await prisma.showtime.create({
          data: {
            movieId: movie.id,
            screenId: screen.id,
            startTime: start,
            endTime: end,
            basePrice: 200 + i * 30,
          },
        });

        // Create ShowtimeSeat rows from the screen's seat map
        const screenSeats = await prisma.screenSeat.findMany({ where: { screenId: screen.id } });
        if (screenSeats.length > 0) {
          await prisma.showtimeSeat.createMany({
            data: screenSeats.map((ss) => ({
              showtimeId: showtime.id,
              screenSeatId: ss.id,
            })),
            skipDuplicates: true,
          });
        }
      }
    }
  }
  console.log("✅ Showtimes + seat availability seeded");
}

async function seedFood() {
  const items = [
    { name: "Salted Popcorn (Large)", price: 250, category: FoodCategory.POPCORN, imageUrl: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&q=80", description: "Freshly popped, lightly salted." },
    { name: "Caramel Popcorn (Large)", price: 300, category: FoodCategory.POPCORN, imageUrl: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400&q=80", description: "Sweet caramel-glazed popcorn." },
    { name: "Cola (Regular)", price: 120, category: FoodCategory.BEVERAGES, imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80", description: "Chilled fizzy cola." },
    { name: "Nachos with Cheese", price: 220, category: FoodCategory.SNACKS, imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&q=80", description: "Crispy nachos with molten cheese dip." },
    { name: "Movie Combo for Two", price: 599, category: FoodCategory.COMBOS, imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cee6a6?w=400&q=80", description: "2 popcorns + 2 colas + 1 nachos." },
  ];

  for (const item of items) {
    await prisma.foodItem.upsert({
      where: { name: item.name },
      update: { price: item.price, isAvailable: true },
      create: item,
    });
  }
  console.log(`✅ Food items seeded (${items.length})`);
}

async function seedOffers() {
  const existing = await prisma.offer.count();
  if (existing > 0) {
    console.log(`ℹ️  Offers already present (${existing}) — skipping`);
    return;
  }
  await prisma.offer.createMany({
    data: [
      { title: "Flat 20% Off First Booking", description: "New here? Get 20% off your very first movie booking.", imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&q=80", code: "FIRST20" },
      { title: "Weekend Combo Deal", description: "Book any weekend show and grab a food combo at 30% off.", imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&q=80", code: "WEEKEND30" },
      { title: "Members Save More", description: "Cinema Pro Max members enjoy exclusive year-round discounts.", imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80", code: "MEMBER" },
    ],
  });
  console.log("✅ Offers seeded");
}

async function seedBanners(movies: { id: string; title: string; bannerUrl?: string | null }[]) {
  const existing = await prisma.banner.count();
  if (existing > 0) {
    console.log(`ℹ️  Banners already present (${existing}) — skipping`);
    return;
  }
  await prisma.banner.createMany({
    data: movies.slice(0, 3).map((m, i) => ({
      imageUrl: m.bannerUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80",
      title: m.title,
      subtitle: "Now showing at Cinema Pro Max",
      movieId: m.id,
      order: i,
    })),
  });
  console.log("✅ Banners seeded");
}

async function seedMembershipPlans() {
  const plans = [
    { name: "Bronze", tier: "Basic", monthlyPrice: 199, yearlyPrice: 1999, discountPercent: 5, foodDiscount: 5, bonusPoints: 100, sortOrder: 1, description: "Great for occasional movie-goers." },
    { name: "Silver", tier: "Plus", monthlyPrice: 399, yearlyPrice: 3999, discountPercent: 10, foodDiscount: 10, bonusPoints: 300, priorityBooking: true, sortOrder: 2, description: "For regular fans who want more perks." },
    { name: "Gold", tier: "Premium", monthlyPrice: 799, yearlyPrice: 7999, discountPercent: 20, foodDiscount: 15, bonusPoints: 750, priorityBooking: true, freeParking: true, loungeAccess: true, sortOrder: 3, description: "The ultimate cinema experience." },
  ];
  for (const plan of plans) {
    await prisma.membershipPlan.upsert({
      where: { name: plan.name },
      update: { monthlyPrice: plan.monthlyPrice, yearlyPrice: plan.yearlyPrice, isActive: true },
      create: plan,
    });
  }
  console.log(`✅ Membership plans seeded (${plans.length})`);
}

async function main() {
  console.log("🌱 Seeding Cinema Pro Max database...\n");
  await seedUsers();
  const screens = await seedScreens();
  const movies = await seedMovies();
  await seedShowtimes(movies, screens);
  await seedFood();
  await seedOffers();
  await seedBanners(movies);
  await seedMembershipPlans();
  console.log("\n🎬 Seed complete!");
  console.log("   Admin login:  admin@cinemapromax.com / Admin@12345");
  console.log("   Demo login:   demo@cinemapromax.com  / Demo@12345");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
