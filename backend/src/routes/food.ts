import { Router, Request, Response } from "express";
import { prisma } from "../index";

const router = Router();

// GET all food categories
router.get("/categories", async (req: Request, res: Response) => {
  const categories = [
    "Popcorn",
    "Drinks",
    "Combos",
    "Pizza",
    "Nachos",
    "Ice Cream",
    "Coffee & Tea"
  ];
  res.status(200).json(categories);
});

// GET all food items with dynamic offers and details
router.get("/items", async (req: Request, res: Response) => {
  const items = [
    {
      id: "f-1",
      name: "Truffle Butter Popcorn (L)",
      description: "Infused with premium white truffle oil and organic sea salt.",
      price: 240,
      offerPrice: 199,
      calories: 380,
      prepTime: "2 Mins",
      rating: 4.8,
      badge: "Best Seller",
      category: "Popcorn",
      imageUrl: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: "f-2",
      name: "Caramel Gold Crunch (L)",
      description: "Crispy popcorn coated in luxury artisanal brown sugar caramel sauce.",
      price: 280,
      offerPrice: 240,
      calories: 420,
      prepTime: "3 Mins",
      rating: 4.9,
      badge: "Chef Special",
      category: "Popcorn",
      imageUrl: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: "f-3",
      name: "Loaded Avocado Nachos",
      description: "Crispy corn tortillas topped with fresh guacamole, warm cheddar, and pickled jalapenos.",
      price: 320,
      offerPrice: 280,
      calories: 550,
      prepTime: "4 Mins",
      rating: 4.7,
      badge: "Most Ordered",
      category: "Nachos",
      imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: "f-4",
      name: "Fountain Pepsi Luxe (XL)",
      description: "Extra cold fountain sparkling soda served with lemon slices and dynamic ice.",
      price: 150,
      offerPrice: 120,
      calories: 180,
      prepTime: "1 Min",
      rating: 4.6,
      badge: "Popular",
      category: "Drinks",
      imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: "f-5",
      name: "Wild Mushroom Flatbread Pizza",
      description: "Stone-baked thin crust flatbread pizza topped with porcini mushrooms and truffle cheese glaze.",
      price: 450,
      offerPrice: 380,
      calories: 680,
      prepTime: "7 Mins",
      rating: 4.9,
      badge: "New",
      category: "Pizza",
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop"
    }
  ];
  res.status(200).json(items);
});

// GET all combos
router.get("/combos", async (req: Request, res: Response) => {
  const combos = [
    {
      id: "c-1",
      name: "Blockbuster Duo Feast",
      description: "1 Large Truffle Popcorn + 2 Drinks (XL) + 1 Loaded Nachos. Save ₹180.",
      price: 860,
      offerPrice: 680,
      savings: 180,
      itemsIncluded: ["Popcorn (L)", "2 Drinks (XL)", "Nachos"],
      rating: 4.9,
      badge: "Bestselling Combo",
      category: "Combos",
      imageUrl: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=500&auto=format&fit=crop"
    }
  ];
  res.status(200).json(combos);
});

// Standard router compatibility handler
router.get("/", async (req: Request, res: Response) => {
  try {
    const foods = await prisma.foodItem.findMany({
      where: { isAvailable: true },
      orderBy: { name: "asc" },
    });
    res.status(200).json(foods);
  } catch (error) {
    res.status(200).json([]);
  }
});

router.post("/item", async (req: Request, res: Response) => {
  try {
    const { name, description, price, imageUrl, category } = req.body;
    const item = await prisma.foodItem.create({
      data: { name, description: description || "", price: parseFloat(price), imageUrl: imageUrl || "", category: category || "SNACKS" }
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to create food item" });
  }
});

router.put("/item/:id", async (req: Request, res: Response) => {
  try {
    const item = await prisma.foodItem.update({ where: { id: req.params.id }, data: req.body });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to update food item" });
  }
});

router.delete("/item/:id", async (req: Request, res: Response) => {
  try {
    await prisma.foodItem.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete food item" });
  }
});

router.get("/kitchen/orders", async (req: Request, res: Response) => {
  const orders = [
    { id: "ko-101", customerName: "Priya S.", screenName: "IMAX 1", seatNumber: "D-4", items: [{ name: "Truffle Butter Popcorn", qty: 1 }, { name: "Pepsi XL", qty: 2 }], totalAmount: 439, status: "PREPARING", assignedChef: "Chef Arjun", estimatedPrepTime: 4, createdAt: "2026-07-18T12:10:00Z" },
    { id: "ko-102", customerName: "Vikram M.", screenName: "Dolby 2", seatNumber: "B-7", items: [{ name: "Loaded Nachos", qty: 1 }, { name: "Wild Mushroom Pizza", qty: 1 }], totalAmount: 660, status: "RECEIVED", assignedChef: null, estimatedPrepTime: 8, createdAt: "2026-07-18T12:12:00Z" },
    { id: "ko-103", customerName: "Sneha R.", screenName: "IMAX 1", seatNumber: "F-2", items: [{ name: "Caramel Gold Crunch", qty: 2 }], totalAmount: 480, status: "READY", assignedChef: "Chef Meera", estimatedPrepTime: 3, createdAt: "2026-07-18T12:05:00Z" },
    { id: "ko-104", customerName: "Ananya P.", screenName: "Screen 3", seatNumber: "A-10", items: [{ name: "Fountain Pepsi XL", qty: 3 }], totalAmount: 360, status: "DELIVERED", assignedChef: "Staff Ravi", estimatedPrepTime: 1, createdAt: "2026-07-18T11:55:00Z" }
  ];
  res.json(orders);
});

router.patch("/kitchen/orders/:id/status", async (req: Request, res: Response) => {
  const { status } = req.body;
  res.json({ success: true, orderId: req.params.id, newStatus: status || "PREPARING" });
});

router.get("/inventory", async (req: Request, res: Response) => {
  const inventory = [
    { id: "inv-1", ingredientName: "Corn Kernels", supplier: "AgriCorp India", currentStock: 450, minimumStock: 100, unit: "kg", costPerUnit: 45, expiryDate: "2026-09-15", status: "OK" },
    { id: "inv-2", ingredientName: "Premium Butter", supplier: "Amul Dairy", currentStock: 25, minimumStock: 50, unit: "kg", costPerUnit: 520, expiryDate: "2026-08-01", status: "LOW_STOCK" },
    { id: "inv-3", ingredientName: "Truffle Oil", supplier: "Italian Imports Co.", currentStock: 3, minimumStock: 10, unit: "liters", costPerUnit: 2800, expiryDate: "2026-12-30", status: "CRITICAL" },
    { id: "inv-4", ingredientName: "Cheese Blend", supplier: "DairyFresh Ltd.", currentStock: 80, minimumStock: 30, unit: "kg", costPerUnit: 380, expiryDate: "2026-08-10", status: "OK" },
    { id: "inv-5", ingredientName: "Cola Syrup", supplier: "PepsiCo Franchise", currentStock: 120, minimumStock: 40, unit: "liters", costPerUnit: 180, expiryDate: "2027-01-15", status: "OK" },
    { id: "inv-6", ingredientName: "Pizza Dough Base", supplier: "BakeMaster", currentStock: 8, minimumStock: 20, unit: "packs", costPerUnit: 150, expiryDate: "2026-07-25", status: "LOW_STOCK" },
    { id: "inv-7", ingredientName: "Nacho Chips", supplier: "SnackWorld", currentStock: 0, minimumStock: 15, unit: "packs", costPerUnit: 95, expiryDate: "N/A", status: "OUT_OF_STOCK" }
  ];
  res.json(inventory);
});

router.get("/analytics", async (req: Request, res: Response) => {
  res.json({
    todayRevenue: 48650,
    todayOrders: 127,
    avgOrderValue: 383,
    pendingOrders: 4,
    preparingOrders: 8,
    deliveredOrders: 112,
    cancelledOrders: 3,
    mostSoldItem: "Truffle Butter Popcorn",
    mostProfitableItem: "Wild Mushroom Pizza",
    kitchenQueueLength: 12,
    avgPrepTime: 4.2,
    topCategories: [
      { name: "Popcorn", orders: 64, revenue: 15360 },
      { name: "Drinks", orders: 89, revenue: 10680 },
      { name: "Pizza", orders: 23, revenue: 8740 },
      { name: "Nachos", orders: 31, revenue: 8680 },
      { name: "Combos", orders: 18, revenue: 12240 }
    ]
  });
});

// GET /food/menu
router.get("/menu", async (req: Request, res: Response) => {
  // Alias of /items
  const items = [
    { id: "f-1", name: "Truffle Butter Popcorn (L)", description: "Infused with premium white truffle oil and organic sea salt.", price: 240, offerPrice: 199, calories: 380, prepTime: "2 Mins", rating: 4.8, badge: "Best Seller", category: "Popcorn", imageUrl: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=400&auto=format&fit=crop" },
    { id: "f-2", name: "Caramel Gold Crunch (L)", description: "Crispy popcorn coated in luxury artisanal brown sugar caramel sauce.", price: 280, offerPrice: 240, calories: 420, prepTime: "3 Mins", rating: 4.9, badge: "Chef Special", category: "Popcorn", imageUrl: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=400&auto=format&fit=crop" },
    { id: "f-3", name: "Loaded Avocado Nachos", description: "Avocado, cheddar cheese sauce, crisp tortilla chips.", price: 320, offerPrice: 280, calories: 550, prepTime: "4 Mins", rating: 4.7, badge: "Most Ordered", category: "Nachos", imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=400&auto=format&fit=crop" }
  ];
  res.status(200).json(items);
});

// POST /food/order
router.post("/order", async (req: Request, res: Response) => {
  try {
    const { customerName, seatNumber, items, totalAmount } = req.body;
    const order = await prisma.kitchenOrder.create({
      data: {
        customerName: customerName || "Guest Customer",
        seatNumber: seatNumber || "Seat Delivery",
        items: items || [],
        totalAmount: parseFloat(totalAmount) || 0.0,
        status: "RECEIVED"
      }
    });
    res.status(201).json({ success: true, message: "Kitchen order queued.", order });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to queue kitchen order.", error: error.message });
  }
});

// PUT /order/status/:id
router.put("/order/status/:id", async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await prisma.kitchenOrder.update({
      where: { id: req.params.id },
      data: { status: status || "PREPARING" }
    });
    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update order status.", error: error.message });
  }
});

// PUT /order/status
router.put("/order/status", async (req: Request, res: Response) => {
  try {
    const { id, status } = req.body;
    const order = await prisma.kitchenOrder.update({
      where: { id },
      data: { status: status || "PREPARING" }
    });
    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update order status.", error: error.message });
  }
});

// POST /purchase - Create purchase order for supplier restocking
router.post("/purchase", async (req: Request, res: Response) => {
  try {
    const { supplier, item, quantity, costPerUnit } = req.body;
    if (!item || !quantity) {
      return res.status(400).json({ message: "Item and quantity are required." });
    }
    
    // Upsert into inventory stock list
    const stockItem = await prisma.foodInventoryItem.upsert({
      where: { ingredientName: item },
      update: {
        currentStock: { increment: parseFloat(quantity) },
        supplier: supplier || "Global Restocking Corp",
        lastRestocked: new Date()
      },
      create: {
        ingredientName: item,
        currentStock: parseFloat(quantity),
        supplier: supplier || "Global Restocking Corp",
        costPerUnit: parseFloat(costPerUnit) || 10.0,
        lastRestocked: new Date()
      }
    });

    res.status(201).json({ success: true, message: `Restocked ${quantity} of ${item} successfully.`, stockItem });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to place purchase order.", error: error.message });
  }
});

// GET /supplier
router.get("/supplier", async (req: Request, res: Response) => {
  const suppliers = [
    { companyName: "AgriCorp India", contact: "+91 9900011223", products: ["Corn Kernels", "Flour", "Oil"], rating: 4.8, paymentTerms: "Net 30" },
    { companyName: "Amul Dairy", contact: "+91 9876543210", products: ["Premium Butter", "Cheese Blend", "Milk"], rating: 4.9, paymentTerms: "COD" },
    { companyName: "PepsiCo Franchise", contact: "+91 8009988776", products: ["Cola Syrup", "Pepsi Cans", "Lays Chips"], rating: 4.7, paymentTerms: "Net 15" }
  ];
  res.json(suppliers);
});

// GET /food/analytics
router.get("/food/analytics", async (req: Request, res: Response) => {
  res.json({
    todayRevenue: 48650,
    todayOrders: 127,
    avgOrderValue: 383,
    pendingOrders: 4,
    preparingOrders: 8,
    deliveredOrders: 112,
    cancelledOrders: 3,
    mostSoldItem: "Truffle Butter Popcorn",
    mostProfitableItem: "Wild Mushroom Pizza",
    topCategories: [
      { name: "Popcorn", orders: 64, revenue: 15360 },
      { name: "Drinks", orders: 89, revenue: 10680 }
    ]
  });
});

export default router;
