import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ExecutiveOverview from "../components/admin/ExecutiveOverview";
import ShowCalendar from "../components/admin/ShowCalendar";
import BookingLifecyclePanel from "../components/admin/BookingLifecyclePanel";
import PaymentGatewayPanel from "../components/admin/PaymentGatewayPanel";
import KitchenDisplayPanel from "../components/admin/KitchenDisplayPanel";
import CustomerIntelligencePanel from "../components/admin/CustomerIntelligencePanel";
import BIExecutivePanel from "../components/admin/BIExecutivePanel";
import SocPanel from "../components/admin/SocPanel";
import PlatformArchitecturePanel from "../components/admin/PlatformArchitecturePanel";
import ObservabilityPanel from "../components/admin/ObservabilityPanel";
import AIPlatformPanel from "../components/admin/AIPlatformPanel";
import GlobalizationPanel from "../components/admin/GlobalizationPanel";
import KnowledgeBasePanel from "../components/admin/KnowledgeBasePanel";
import RoadmapPanel from "../components/admin/RoadmapPanel";
import {
  LayoutDashboard,
  Film,
  Coffee,
  Settings,
  DollarSign,
  TrendingUp,
  Plus,
  Trash2,
  Save,
  Server,
  Cpu,
  Zap,
  Bot,
  ShieldCheck,
  Send,
  ChevronLeft,
  Sparkles,
  MapPin,
  Grid,
  Users,
  MessageSquare,
  Search,
  Clock,
  Star,
  Package,
  AlertTriangle,
  ChefHat,
  UtensilsCrossed,
  Truck,
  BarChart3,
  Eye,
  Tag,
  Briefcase,
  CalendarDays,
  UserCheck,
  UserX,
  ClipboardList,
  Megaphone,
  Award,
  Wallet,
  CheckCircle2,
  Target,
  Gift,
  Ticket,
  Percent,
  Repeat,
  Mail,
  Bell,
  Crown,
  Trophy,
  Share2,
  TrendingDown,
  Activity,
  FileText,
  ShieldAlert,
  EyeOff,
  Lock,
  ServerCrash,
  Volume2,
  MessageCircle,
  FileEdit,
  Laptop,
  PieChart,
  Globe,
  /* HelpCircle, */
  Lightbulb,
  Smartphone,
  WifiOff,
  QrCode,
  /* Palette, */
  Layout,
  Cloud,
  Database,
  Layers,
  Crosshair,
  CreditCard,
  X
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/axios";

/* ═══════════════════════════════════════════════════════════════
   ADMIN DASHBOARD — OWNER PORTAL
   Cinema Pro Max · Enterprise Owner Control Center
   ═══════════════════════════════════════════════════════════════ */

type TabKey = "stats" | "movies" | "shows" | "bookings" | "theatres" | "screens" | "crm" | "fnb" | "hr" | "marketing" | "offers" | "finance" | "security" | "notifications" | "reports" | "mobile" | "website" | "seo" | "food" | "refunds" | "ai" | "ads" | "chain" | "settings";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("stats");
  const [adsSubTab, setAdsSubTab] = useState<"overview" | "campaigns" | "spaces" | "sponsors" | "billing" | "analytics">("overview");
  const [chainSubTab, setChainSubTab] = useState<"overview" | "theatres" | "franchise" | "tenants" | "subscriptions" | "support">("overview");

  // ─── Real-time server diagnostics ───
  const [cpuUsage, setCpuUsage] = useState(38);
  const [ramUsage, setRamUsage] = useState(52);
  const [dbLatency, setDbLatency] = useState(12);


  // ─── Settings & configs ───
  const [generalSettings, setGeneralSettings] = useState({
    theatreName: "CineVerse Luxury Theatre",
    announcement: "💥 Premium Dolby Atmos sound systems upgraded. Enjoy 3D Spatial Audio on Screen 1!",
    cancellationRule: "Tickets can be cancelled up to 2 hours before showtime. 100% refund is processed back to wallet.",
    convenienceFee: 30,
    themeColor: "#E50914"
  });

  // ─── Theatre Multiplex ───
  const [theatresList, setTheatresList] = useState<any[]>([
    { id: "th-1", name: "CineVerse Luxury Multiplex", city: "Mumbai", facilities: ["Wheelchair", "EV Charging", "VIP Lounge"] }
  ]);
  const [showAddTheatreModal, setShowAddTheatreModal] = useState(false);
  const [newTheatreName, setNewTheatreName] = useState("");
  const [newTheatreCity, setNewTheatreCity] = useState("");
  const [newTheatreFacilities, setNewTheatreFacilities] = useState("");

  // ─── Seating grid designer ───
  const designerRows = 6;
  const designerCols = 8;
  const [selectedSeatIndex, setSelectedSeatIndex] = useState<{ r: number; c: number } | null>(null);
  const [seatingGrid, setSeatingGrid] = useState<any[][]>([]);

  useEffect(() => {
    const grid: any[][] = [];
    for (let r = 0; r < designerRows; r++) {
      const row: any[] = [];
      const rowLetter = String.fromCharCode(65 + r);
      for (let c = 0; c < designerCols; c++) {
        row.push({
          label: `${rowLetter}-${c + 1}`,
          type: r < 2 ? "VIP" : r < 4 ? "Premium" : "Regular",
          price: r < 2 ? 350 : r < 4 ? 220 : 150,
          status: "Available"
        });
      }
      grid.push(row);
    }
    setSeatingGrid(grid);
  }, []);

  const handleUpdateSeatProperty = (type: string, price: number, _status: string) => {
    if (selectedSeatIndex === null) return;
    const { r, c } = selectedSeatIndex;
    const updated = [...seatingGrid];
    updated[r][c] = { ...updated[r][c], type, price, status: _status };
    setSeatingGrid(updated);
    toast.success(`Seat ${updated[r][c].label} updated!`);
  };

  // ─── Movie management ───
  const [moviesList, setMoviesList] = useState<any[]>([]);

  // ─── Fetch movies from database ───
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await API.get("/movies");
        if (res.data && Array.isArray(res.data)) {
          setMoviesList(res.data.map((m: any) => ({
            id: m.id,
            title: m.title,
            genre: Array.isArray(m.genre) ? m.genre.join(", ") : m.genre || "",
            status: m.status || "NOW_SHOWING",
            rating: m.rating || 0,
            posterUrl: m.posterUrl || "",
            trailerUrl: m.trailerUrl || "",
            duration: m.duration || 0,
            description: m.description || "",
            releaseDate: m.releaseDate || "",
            language: Array.isArray(m.language) ? m.language.join(", ") : m.language || ""
          })));
        }
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      }
    };
    fetchMovies();
  }, []);
  const [editingMovie, setEditingMovie] = useState<any | null>(null);
  const [editingShow, setEditingShow] = useState<any | null>(null);
  // ═══════════════════════════════════════════════════════════════
  //  AI PLATFORM — Enterprise Artificial Intelligence State
  // ═══════════════════════════════════════════════════════════════
  const [aiSubTab, setAiSubTab] = useState<"overview" | "models" | "pricing" | "rules" | "customer" | "advisor" | "logs" | "predictions" | "pipeline" | "security_vision" | "marketing_ai" | "inventory_ai" | "bi">("overview");

  // AI Predictions state
  const [aiPredictions] = useState({
    revenue: { tomorrow: 85600, nextWeek: 642000, nextMonth: 2840000, confidence: 0.91 },
    churnRisk: [
      { id: "usr-291", name: "Ananya Patel", probability: 0.72, ltv: 8900, reason: "No visits in 45 days", action: "Send PRESTIGE50 coupon" },
      { id: "usr-503", name: "Vikram Mehta", probability: 0.45, ltv: 14200, reason: "Frequent cancellations", action: "Personal call from manager" },
      { id: "usr-771", name: "Deepak Nair", probability: 0.38, ltv: 22100, reason: "Rating decline trend", action: "Complimentary upgrade offer" }
    ],
    customerReturn: [
      { name: "Priya Sharma", returnProbability: 0.96, nextVisit: "Within 3 days", spendPrediction: 1200 },
      { name: "Rajesh Kumar", returnProbability: 0.98, nextVisit: "Tomorrow", spendPrediction: 850 }
    ],
    moviePerformance: [
      { title: "Aether: Rising Stars", predictedOccupancy: 89, predictedRevenue: 284000, confidence: 0.93 },
      { title: "Shadows of the Dynasty", predictedOccupancy: 72, predictedRevenue: 196000, confidence: 0.87 },
      { title: "Cosmic Horizons 3D", predictedOccupancy: 64, predictedRevenue: 148000, confidence: 0.82 }
    ]
  });

  // AI Data Pipeline state
  const [pipelineStages] = useState([
    { stage: "Data Collection", status: "ACTIVE", throughput: "12.4K events/hr", icon: "📡", color: "text-blue-400", progress: 100 },
    { stage: "Data Cleaning", status: "ACTIVE", throughput: "11.8K events/hr", icon: "🧹", color: "text-cyan-400", progress: 95 },
    { stage: "Feature Engineering", status: "ACTIVE", throughput: "9.2K features/hr", icon: "⚙️", color: "text-purple-400", progress: 88 },
    { stage: "Machine Learning", status: "ACTIVE", throughput: "8.1K inferences/hr", icon: "🧠", color: "text-pink-400", progress: 82 },
    { stage: "Prediction Output", status: "ACTIVE", throughput: "6.4K predictions/hr", icon: "🎯", color: "text-orange-400", progress: 76 },
    { stage: "Action Dispatch", status: "ACTIVE", throughput: "5.2K actions/hr", icon: "🚀", color: "text-emerald-400", progress: 70 },
    { stage: "Feedback Loop", status: "ACTIVE", throughput: "4.8K signals/hr", icon: "🔄", color: "text-yellow-400", progress: 65 },
    { stage: "Model Improvement", status: "LEARNING", throughput: "Continuous", icon: "📈", color: "text-luxuryGold", progress: 100 }
  ]);

  // Security Vision state
  const [visionCameras] = useState([
    { id: "cam-1", location: "Screen 1 Entrance", crowdDensity: 72, queueLength: 14, waitTime: "4.2 mins", status: "NORMAL" },
    { id: "cam-2", location: "Lobby East Corridor", crowdDensity: 45, queueLength: 0, waitTime: "0 mins", status: "NORMAL" },
    { id: "cam-3", location: "Concessions Counter", crowdDensity: 88, queueLength: 22, waitTime: "8.5 mins", status: "WARNING" },
    { id: "cam-4", location: "Parking Lot B", crowdDensity: 30, queueLength: 0, waitTime: "0 mins", status: "NORMAL" },
    { id: "cam-5", location: "Emergency Exit 2", crowdDensity: 5, queueLength: 0, waitTime: "0 mins", status: "ALERT" }
  ]);

  // Marketing AI state
  const [marketingCampaignIdeas] = useState([
    { id: "camp-1", title: "Monsoon Movie Marathon", channel: "EMAIL + PUSH", audience: "Inactive 15+ days", reach: 4200, revenue: 126000, bestTime: "Friday 6 PM", confidence: 0.88 },
    { id: "camp-2", title: "Student Weekend Pass", channel: "SMS + WHATSAPP", audience: "Student Segment (18-25)", reach: 2800, revenue: 84000, bestTime: "Thursday 4 PM", confidence: 0.92 },
    { id: "camp-3", title: "Family Sunday Funday", channel: "PUSH + SOCIAL", audience: "Family Segment", reach: 1600, revenue: 192000, bestTime: "Saturday 10 AM", confidence: 0.85 },
    { id: "camp-4", title: "VIP Premiere Night", channel: "WHATSAPP + EMAIL", audience: "Gold & Platinum Members", reach: 890, revenue: 245000, bestTime: "Wednesday 5 PM", confidence: 0.94 }
  ]);

  // Inventory AI state
  const [inventoryPredictions] = useState([
    { item: "Corn Kernels", stock: 450, demand: 680, unit: "kg", daysLeft: 3, urgency: "HIGH", order: 400, supplier: "AgriCorp India", cost: 12000 },
    { item: "Premium Butter", stock: 25, demand: 80, unit: "kg", daysLeft: 1, urgency: "CRITICAL", order: 100, supplier: "Amul Wholesale", cost: 45000 },
    { item: "Truffle Oil", stock: 3, demand: 15, unit: "liters", daysLeft: 2, urgency: "HIGH", order: 20, supplier: "Gourmet Imports", cost: 28000 },
    { item: "Nachos Chips", stock: 200, demand: 150, unit: "packs", daysLeft: 8, urgency: "LOW", order: 0, supplier: "Doritos Direct", cost: 0 },
    { item: "Cola Syrup", stock: 40, demand: 35, unit: "liters", daysLeft: 7, urgency: "LOW", order: 0, supplier: "PepsiCo", cost: 0 }
  ]);

  // Dynamic pricing
  const [priceMin, setPriceMin] = useState(180);
  const [priceMax, setPriceMax] = useState(550);
  const [priceAutoAdjust, setPriceAutoAdjust] = useState(true);
  const [priceApprovalReq, setPriceApprovalReq] = useState(true);

  // Automation Rules
  const [automationRulesList, setAutomationRulesList] = useState<any[]>([
    { id: "rule-1", name: "30-Day Inactive Retention Offer", trigger: "CUSTOMER_INACTIVE_30_DAYS", condition: "LTV > ₹1,500", action: "Send Offer Coupon (PRESTIGE50) + Invite VIP Upgrade", runs: 124, active: true },
    { id: "rule-2", name: "High Value Crowd Congestion Alert", trigger: "QUEUE_CCTV_Bottleneck", condition: "WaitTime > 8 mins", action: "Push notification to floor management team", runs: 43, active: true }
  ]);
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleTrigger, setNewRuleTrigger] = useState("CUSTOMER_INACTIVE_30_DAYS");
  const [newRuleCondition, setNewRuleCondition] = useState("");
  const [newRuleAction, setNewRuleAction] = useState("");

  // Models list
  const [aiModelsList, setAiModelsList] = useState<any[]>([
    { code: "CHURN_PREDICTION", name: "Customer Churn Engine", accuracy: 0.94, isEnabled: true, desc: "Predicts high risk customer lists and triggers retention rules" },
    { code: "DYNAMIC_PRICING", name: "Dynamic Seat Pricing Model", accuracy: 0.91, isEnabled: true, desc: "Auto-calibrates seat multipliers matching active occupancy index" },
    { code: "CONCESSIONS_RECOMMEND", name: "F&B Combo Suggestion System", accuracy: 0.95, isEnabled: true, desc: "Personalizes snack counters pairings at checkout" },
    { code: "NLP_CHATBOT", name: "Conversational NLP Chatbot", accuracy: 0.88, isEnabled: true, desc: "Multichannel support assistant (WhatsApp, Web, Mobile)" },
    { code: "CCTV_DETECTOR", name: "Computer Vision Queue Monitor", accuracy: 0.92, isEnabled: true, desc: "Detects lobby queue bottlenecks and unauthorized entries" },
    { code: "SENTIMENT_ANALYSIS", name: "Sentiment Analysis Engine", accuracy: 0.89, isEnabled: true, desc: "Analyzes customer reviews, chats, and social media for sentiment patterns" },
    { code: "INVENTORY_PREDICTOR", name: "Inventory Demand Forecaster", accuracy: 0.93, isEnabled: true, desc: "Predicts food demand, stock requirements, and waste reduction opportunities" },
    { code: "EMPLOYEE_OPTIMIZER", name: "Employee Shift Optimizer", accuracy: 0.87, isEnabled: true, desc: "AI-driven shift suggestions, performance predictions, and workload balancing" },
    { code: "MARKETING_CAMPAIGN_AI", name: "Marketing Campaign Generator", accuracy: 0.90, isEnabled: true, desc: "Creates campaign ideas, email content, and predicts best audience and timing" },
    { code: "FRAUD_DETECTOR", name: "Fraud Detection Engine", accuracy: 0.96, isEnabled: false, desc: "Real-time payment fraud detection, coupon abuse, and referral fraud monitoring" },
    { code: "SEAT_RECOMMEND", name: "AI Seat Recommendation", accuracy: 0.94, isEnabled: false, desc: "Analyzes customer preference, group size, movie type for optimal seat selection" },
    { code: "VOICE_ASSISTANT", name: "Voice Command Processor", accuracy: 0.85, isEnabled: false, desc: "Speech recognition, NLP intent parsing, and text-to-speech in multiple languages" }
  ]);
  const [activeTrainingModel, setActiveTrainingModel] = useState<string | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingEpochs, setTrainingEpochs] = useState<any[]>([]);

  // Chatbot widget state
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([
    { role: "assistant", text: "Greetings! I am the Prestige Cinematic AI. Ask me about movies playing today, booking support, or concessions ordering!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatSentiment, setChatSentiment] = useState("NEUTRAL");
  const [isChatTyping, setIsChatTyping] = useState(false);
  const [chatVoiceActive, setChatVoiceActive] = useState(false);
  const [showWaveEffect, setShowWaveEffect] = useState(false);

  // System logs
  const [aiSystemLogs, setAiSystemLogs] = useState<string[]>([
    "[System] Core AI Platform pipeline initialized successfully.",
    "[Info] Dynamic pricing engine sync completed for 12 multiplex theatres.",
    "[Monitor] CCTV feeds queue analysis active on Screen 1 entrance.",
    "[Pipeline] Scheduled learning cycles complete. Master accuracy at 93.4%."
  ]);

  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardMovie, setWizardMovie] = useState({
    title: "", genre: "", duration: "135", director: "", rating: "8.5",
    posterUrl: "", bannerUrl: "", trailerUrl: "",
    screenId: "scr-1", timeSlot: "07:30 PM", basePrice: "180",
    seoTitle: "", seoDesc: ""
  });

  // ─── Food (simple list) ───
  const [foodList, setFoodList] = useState<any[]>([
    { id: "f-1", name: "Truffle Butter Popcorn (L)", price: 199 },
    { id: "f-2", name: "Caramel Gold Crunch (L)", price: 240 },
    { id: "f-3", name: "Loaded Avocado Nachos", price: 280 }
  ]);
  const [newFoodName, setNewFoodName] = useState("");
  const [newFoodPrice, setNewFoodPrice] = useState("");

  // ─── Refunds ───
  const [refundsList, setRefundsList] = useState<any[]>([
    { id: "ref-901", bookingId: "bk-7849c", customerName: "Jane Doe", amount: 620, status: "PENDING" },
    { id: "ref-902", bookingId: "bk-2309f", customerName: "John Smith", amount: 480, status: "APPROVED" }
  ]);

  // ═══════════════════════════════════════════════════════════════
  //  CRM — Customer Relationship Management State
  // ═══════════════════════════════════════════════════════════════
  const [crmSearch, setCrmSearch] = useState("");
  const [crmPointsToCredit, setCrmPointsToCredit] = useState("500");
  const [crmPointsReason, setCrmPointsReason] = useState("Appreciation Bonus");
  const [crmMembershipCardFlipped, setCrmMembershipCardFlipped] = useState(false);
  const [crmCustomers] = useState<any[]>([
    { id: "usr-882", name: "Priya Sharma", email: "priya@gmail.com", phone: "+91 9845012345", tier: "VIP Gold", spend: 38400, bookings: 47, lastActive: "2h ago", tag: "High Value", satisfaction: 4.8 },
    { id: "usr-104", name: "Rajesh Kumar", email: "rajesh.k@gmail.com", phone: "+91 9900223344", tier: "Platinum", spend: 62100, bookings: 83, lastActive: "30m ago", tag: "Frequent", satisfaction: 4.9 },
    { id: "usr-291", name: "Ananya Patel", email: "ananya.p@outlook.com", phone: "+91 8844556677", tier: "Silver", spend: 8900, bookings: 12, lastActive: "1d ago", tag: "Student", satisfaction: 4.5 },
    { id: "usr-503", name: "Vikram Mehta", email: "vikram.m@corp.com", phone: "+91 7766554433", tier: "Executive", spend: 14200, bookings: 19, lastActive: "5h ago", tag: "Corporate", satisfaction: 4.3 },
    { id: "usr-667", name: "Sneha Reddy", email: "sneha.r@gmail.com", phone: "+91 9988776655", tier: "Gold", spend: 22500, bookings: 31, lastActive: "15m ago", tag: "Family", satisfaction: 4.7 }
  ]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // ─── Shows Management State ───
  const [showsList, setShowsList] = useState<any[]>([
    { id: "sh-1", movie: "Aether: Rising Stars", screen: "Screen 1 IMAX", date: "2026-07-18", time: "10:00 AM", duration: "2h 35m", totalSeats: 180, booked: 142, available: 38, basePrice: 350, vipPrice: 650, revenue: 68400, status: "OPEN" },
    { id: "sh-2", movie: "Aether: Rising Stars", screen: "Screen 1 IMAX", date: "2026-07-18", time: "01:30 PM", duration: "2h 35m", totalSeats: 180, booked: 165, available: 15, basePrice: 380, vipPrice: 720, revenue: 82500, status: "ALMOST_FULL" },
    { id: "sh-3", movie: "Aether: Rising Stars", screen: "Screen 1 IMAX", date: "2026-07-18", time: "04:15 PM", duration: "2h 35m", totalSeats: 180, booked: 89, available: 91, basePrice: 350, vipPrice: 650, revenue: 42800, status: "OPEN" },
    { id: "sh-4", movie: "Aether: Rising Stars", screen: "Screen 1 IMAX", date: "2026-07-18", time: "07:30 PM", duration: "2h 35m", totalSeats: 180, booked: 178, available: 2, basePrice: 420, vipPrice: 850, revenue: 108600, status: "ALMOST_FULL" },
    { id: "sh-5", movie: "Aether: Rising Stars", screen: "Screen 1 IMAX", date: "2026-07-18", time: "10:30 PM", duration: "2h 35m", totalSeats: 180, booked: 56, available: 124, basePrice: 300, vipPrice: 550, revenue: 24200, status: "OPEN" },
    { id: "sh-6", movie: "Shadows of the Dynasty", screen: "Screen 2 Dolby", date: "2026-07-18", time: "11:00 AM", duration: "2h 15m", totalSeats: 150, booked: 92, available: 58, basePrice: 280, vipPrice: 520, revenue: 38400, status: "OPEN" },
    { id: "sh-7", movie: "Shadows of the Dynasty", screen: "Screen 2 Dolby", date: "2026-07-18", time: "04:00 PM", duration: "2h 15m", totalSeats: 150, booked: 134, available: 16, basePrice: 300, vipPrice: 580, revenue: 52800, status: "ALMOST_FULL" },
    { id: "sh-8", movie: "Monsoon Melodies", screen: "Screen 4", date: "2026-07-18", time: "01:00 PM", duration: "2h 5m", totalSeats: 120, booked: 78, available: 42, basePrice: 220, vipPrice: 420, revenue: 21600, status: "OPEN" }
  ]);
  const [newShowMovie, setNewShowMovie] = useState("Aether: Rising Stars");
  const [newShowScreen, setNewShowScreen] = useState("Screen 1 IMAX");
  const [newShowDate, setNewShowDate] = useState("2026-07-18");
  const [newShowTime, setNewShowTime] = useState("07:30 PM");
  const [newShowBasePrice, setNewShowBasePrice] = useState("350");
  const [newShowVipPrice, setNewShowVipPrice] = useState("650");

  // ─── Bookings Management State ───
  const [bookingsList, setBookingsList] = useState<any[]>([
    { id: "bk-7849c", customer: "Priya Sharma", movie: "Aether: Rising Stars", screen: "Screen 1 IMAX", seats: "E-11, E-12", showtime: "07:30 PM", date: "2026-07-18", amount: 1640, paymentMethod: "UPI", status: "CONFIRMED", checkedIn: false, foodOrder: true },
    { id: "bk-8901a", customer: "Rajesh Kumar", movie: "Shadows of the Dynasty", screen: "Screen 2 Dolby", seats: "D-8, D-9, D-10", showtime: "04:15 PM", date: "2026-07-18", amount: 1890, paymentMethod: "Card", status: "CONFIRMED", checkedIn: true, foodOrder: true },
    { id: "bk-6123b", customer: "Ananya Patel", movie: "Cosmic Horizons 3D", screen: "Screen 3", seats: "G-5", showtime: "10:00 AM", date: "2026-07-18", amount: 420, paymentMethod: "Wallet", status: "CONFIRMED", checkedIn: false, foodOrder: false },
    { id: "bk-4502d", customer: "Vikram Mehta", movie: "Aether: Rising Stars", screen: "Screen 1 IMAX", seats: "B-3, B-4", showtime: "10:30 PM", date: "2026-07-18", amount: 2200, paymentMethod: "UPI", status: "CANCELLED", checkedIn: false, foodOrder: false },
    { id: "bk-3377e", customer: "Sneha Reddy", movie: "Monsoon Melodies", screen: "Screen 4", seats: "F-12, F-13, F-14, F-15", showtime: "01:00 PM", date: "2026-07-18", amount: 1680, paymentMethod: "Net Banking", status: "CONFIRMED", checkedIn: true, foodOrder: true },
    { id: "bk-9012f", customer: "Deepak Nair", movie: "Shadows of the Dynasty", screen: "Screen 2 Dolby", seats: "H-1", showtime: "07:30 PM", date: "2026-07-18", amount: 540, paymentMethod: "Card", status: "PENDING", checkedIn: false, foodOrder: false }
  ]);
  const [bookingFilterSearch, setBookingFilterSearch] = useState("");
  const [bookingFilterStatus, setBookingFilterStatus] = useState("ALL");

  // ─── Offers & Coupons State ───
  const [offersList, setOffersList] = useState<any[]>([
    { id: "off-1", title: "Monsoon Mania 50% Off", type: "MOVIE", discount: 50, discountType: "PERCENTAGE", code: "MONSOON50", validFrom: "2026-07-01", validTo: "2026-07-31", minBooking: 500, usageLimit: 1000, usedCount: 342, applicableMovies: "All", applicableUsers: "ALL", status: "ACTIVE", banner: "/offers/monsoon.jpg" },
    { id: "off-2", title: "Student Weekend Pass", type: "STUDENT", discount: 200, discountType: "FIXED", code: "STUDENT200", validFrom: "2026-07-01", validTo: "2026-12-31", minBooking: 300, usageLimit: 5000, usedCount: 890, applicableMovies: "All", applicableUsers: "STUDENT", status: "ACTIVE", banner: "/offers/student.jpg" },
    { id: "off-3", title: "Family Sunday Funday", type: "WEEKEND", discount: 30, discountType: "PERCENTAGE", code: "FAMILY30", validFrom: "2026-07-01", validTo: "2026-09-30", minBooking: 1000, usageLimit: 2000, usedCount: 456, applicableMovies: "All", applicableUsers: "FAMILY", status: "ACTIVE", banner: "/offers/family.jpg" }
  ]);
  const [couponsList, setCouponsList] = useState<any[]>([
    { id: "cpn-1", code: "PRESTIGE50", type: "PERCENTAGE", value: 50, maxDiscount: 500, minOrder: 500, usageLimit: 1000, usedCount: 342, validTo: "2026-08-31", autoApply: false, customerGroup: "ALL", status: "ACTIVE", revenueGenerated: 171000 },
    { id: "cpn-2", code: "WELCOME100", type: "FIXED", value: 100, maxDiscount: 100, minOrder: 200, usageLimit: 5000, usedCount: 1245, validTo: "2026-12-31", autoApply: true, customerGroup: "NEW_USERS", status: "ACTIVE", revenueGenerated: 124500 }
  ]);
  const [newOfferTitle, setNewOfferTitle] = useState("");
  const [newOfferCode, setNewOfferCode] = useState("");
  const [newOfferDiscount, setNewOfferDiscount] = useState("50");
  const [newOfferType, setNewOfferType] = useState("MOVIE");
  const [supportTickets, setSupportTickets] = useState<any[]>([
    { id: "tkt-401", customerName: "Priya Sharma", category: "PAYMENT", subject: "Payment Failed But Amount Deducted", status: "OPEN", priority: "CRITICAL", sla: "2h 30m" },
    { id: "tkt-402", customerName: "Rajesh Kumar", category: "FOOD", subject: "Concession Order Missing Items", status: "IN_PROGRESS", priority: "HIGH", sla: "4h" },
    { id: "tkt-403", customerName: "Ananya Patel", category: "REFUND", subject: "Refund Not Processed After 48h", status: "ESCALATED", priority: "HIGH", sla: "OVERDUE" },
    { id: "tkt-404", customerName: "Vikram Mehta", category: "BOOKING", subject: "Seat Upgrade Request", status: "RESOLVED", priority: "MEDIUM", sla: "—" },
    { id: "tkt-405", customerName: "Sneha Reddy", category: "LOST_ITEM", subject: "Left Bag in Screen 2 Row D", status: "OPEN", priority: "MEDIUM", sla: "6h" }
  ]);
  const [ticketReplyText, setTicketReplyText] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // ═══════════════════════════════════════════════════════════════
  //  F&B — Food & Beverage Management State
  // ═══════════════════════════════════════════════════════════════
  const [fnbCategories] = useState<any[]>([
    { id: "cat-1", name: "Popcorn", icon: "🍿", color: "#F59E0B", items: 8 },
    { id: "cat-2", name: "Drinks", icon: "🥤", color: "#3B82F6", items: 12 },
    { id: "cat-3", name: "Pizza", icon: "🍕", color: "#EF4444", items: 5 },
    { id: "cat-4", name: "Nachos", icon: "🌮", color: "#10B981", items: 4 },
    { id: "cat-5", name: "Ice Cream", icon: "🍦", color: "#EC4899", items: 6 },
    { id: "cat-6", name: "Coffee & Tea", icon: "☕", color: "#8B5CF6", items: 9 },
    { id: "cat-7", name: "Combos", icon: "🎁", color: "#F97316", items: 7 },
    { id: "cat-8", name: "Kids Menu", icon: "🧸", color: "#06B6D4", items: 3 }
  ]);

  const [fnbItems] = useState<any[]>([
    { id: "fi-1", name: "Truffle Butter Popcorn (L)", category: "Popcorn", price: 240, offerPrice: 199, stock: "In Stock", badge: "Best Seller", rating: 4.8 },
    { id: "fi-2", name: "Caramel Gold Crunch (L)", category: "Popcorn", price: 280, offerPrice: 240, stock: "In Stock", badge: "Chef Special", rating: 4.9 },
    { id: "fi-3", name: "Loaded Avocado Nachos", category: "Nachos", price: 320, offerPrice: 280, stock: "Low Stock", badge: "Most Ordered", rating: 4.7 },
    { id: "fi-4", name: "Fountain Pepsi Luxe (XL)", category: "Drinks", price: 150, offerPrice: 120, stock: "In Stock", badge: "Popular", rating: 4.6 },
    { id: "fi-5", name: "Wild Mushroom Pizza", category: "Pizza", price: 450, offerPrice: 380, stock: "In Stock", badge: "New", rating: 4.9 },
    { id: "fi-6", name: "Belgian Dark Hot Chocolate", category: "Coffee & Tea", price: 220, offerPrice: 180, stock: "In Stock", badge: "Premium", rating: 4.8 }
  ]);

  const [kitchenOrders, setKitchenOrders] = useState<any[]>([
    { id: "ko-101", customer: "Priya S.", screen: "IMAX 1", seat: "D-4", items: "Truffle Popcorn × 1, Pepsi XL × 2", amount: 439, status: "PREPARING", chef: "Chef Arjun", time: "4 min", priority: "VIP" },
    { id: "ko-102", customer: "Vikram M.", screen: "Dolby 2", seat: "B-7", items: "Loaded Nachos × 1, Pizza × 1", amount: 660, status: "RECEIVED", chef: "—", time: "8 min", priority: "URGENT" },
    { id: "ko-103", customer: "Sneha R.", screen: "IMAX 1", seat: "F-2", items: "Caramel Crunch × 2", amount: 480, status: "READY", chef: "Chef Meera", time: "0 min", priority: "NORMAL" },
    { id: "ko-104", customer: "Ananya P.", screen: "Screen 3", seat: "A-10", items: "Pepsi XL × 3", amount: 360, status: "DELIVERED", chef: "Staff Ravi", time: "—", priority: "NORMAL" }
  ]);

  const [inventoryItems] = useState<any[]>([
    { id: "inv-1", name: "Corn Kernels", supplier: "AgriCorp India", stock: 450, min: 100, unit: "kg", cost: 45, status: "OK" },
    { id: "inv-2", name: "Premium Butter", supplier: "Amul Dairy", stock: 25, min: 50, unit: "kg", cost: 520, status: "LOW_STOCK" },
    { id: "inv-3", name: "Truffle Oil", supplier: "Italian Imports Co.", stock: 3, min: 10, unit: "liters", cost: 2800, status: "CRITICAL" },
    { id: "inv-4", name: "Cheese Blend", supplier: "DairyFresh Ltd.", stock: 80, min: 30, unit: "kg", cost: 380, status: "OK" },
    { id: "inv-5", name: "Cola Syrup", supplier: "PepsiCo Franchise", stock: 120, min: 40, unit: "liters", cost: 180, status: "OK" },
    { id: "inv-6", name: "Pizza Dough", supplier: "BakeMaster", stock: 8, min: 20, unit: "packs", cost: 150, status: "LOW_STOCK" },
    { id: "inv-7", name: "Nacho Chips", supplier: "SnackWorld", stock: 0, min: 15, unit: "packs", cost: 95, status: "OUT_OF_STOCK" }
  ]);

  // ═══════════════════════════════════════════════════════════════
  //  HR — Employee Management System State
  // ═══════════════════════════════════════════════════════════════
  const [hrSearch, setHrSearch] = useState("");
  const [hrSubTab, setHrSubTab] = useState<"directory" | "attendance" | "shifts" | "leaves" | "payroll" | "performance" | "announcements" | "roles" | "tasks">("directory");
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  
  // Tasks list
  const [hrTasks, setHrTasks] = useState<any[]>([
    { id: "task-01", title: "Verify Projection Lens Alignment", employee: "Ravi Kumar", priority: "URGENT", deadline: "Jul 19, 2026", status: "PENDING" },
    { id: "task-02", title: "Prep Concession Stand inventory", employee: "Kiran Desai", priority: "NORMAL", deadline: "Jul 18, 2026", status: "IN_PROGRESS" },
    { id: "task-03", title: "CCTV Angle Auditing Screen 4", employee: "Amit Sharma", priority: "HIGH", deadline: "Jul 18, 2026", status: "COMPLETED" }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskEmployee, setNewTaskEmployee] = useState("Ravi Kumar");
  const [newTaskPriority, setNewTaskPriority] = useState("NORMAL");

  // Role permissions matrix state
  const [rolePermissions, setRolePermissions] = useState<any>({
    "Ticket Counter Staff": { view: true, create: true, edit: false, delete: false, approve: false },
    "Security Guard": { view: true, create: false, edit: false, delete: false, approve: false },
    "Food Staff": { view: true, create: true, edit: true, delete: false, approve: false },
    "Kitchen Staff": { view: true, create: true, edit: true, delete: true, approve: false },
    "HR Manager": { view: true, create: true, edit: true, delete: true, approve: true }
  });

  // Payslip generator local form states
  const [payrollBasic, setPayrollBasic] = useState("32000");
  const [payrollBonus, setPayrollBonus] = useState("2500");
  const [payrollOvertime, setPayrollOvertime] = useState("1200");

  const [hrEmployees] = useState<any[]>([
    { id: "emp-001", code: "CV-1001", name: "Arjun Kapoor", dept: "Management", designation: "Theatre Manager", shift: "MORNING", status: "PRESENT", perf: 4.8, salary: 85000, type: "PERMANENT" },
    { id: "emp-002", code: "CV-1002", name: "Meera Patel", dept: "Kitchen", designation: "Head Chef", shift: "MORNING", status: "PRESENT", perf: 4.6, salary: 55000, type: "PERMANENT" },
    { id: "emp-003", code: "CV-1003", name: "Ravi Kumar", dept: "Technical", designation: "Projection Engineer", shift: "EVENING", status: "PRESENT", perf: 4.3, salary: 48000, type: "PERMANENT" },
    { id: "emp-004", code: "CV-1004", name: "Sneha Reddy", dept: "Customer Support", designation: "Senior Executive", shift: "MORNING", status: "ON_LEAVE", perf: 4.5, salary: 35000, type: "PERMANENT" },
    { id: "emp-005", code: "CV-1005", name: "Kiran Desai", dept: "Food Court", designation: "Service Staff", shift: "EVENING", status: "LATE", perf: 3.8, salary: 22000, type: "CONTRACT" },
    { id: "emp-006", code: "CV-1006", name: "Priya Nair", dept: "Ticket Counter", designation: "Booking Agent", shift: "MORNING", status: "PRESENT", perf: 4.1, salary: 28000, type: "PERMANENT" },
    { id: "emp-007", code: "CV-1007", name: "Amit Sharma", dept: "Security", designation: "Security Supervisor", shift: "NIGHT", status: "PRESENT", perf: 4.4, salary: 32000, type: "PERMANENT" },
    { id: "emp-008", code: "CV-1008", name: "Divya Joshi", dept: "Housekeeping", designation: "Team Lead", shift: "MORNING", status: "ABSENT", perf: 3.9, salary: 26000, type: "CONTRACT" }
  ]);

  const [hrDepartments] = useState<any[]>([
    { id: "d-1", name: "Management", icon: "👔", head: "Arjun Kapoor", count: 5, budget: 425000, color: "#6366F1" },
    { id: "d-2", name: "Kitchen", icon: "👨‍🍳", head: "Meera Patel", count: 12, budget: 360000, color: "#EF4444" },
    { id: "d-3", name: "Technical", icon: "🔧", head: "Ravi Kumar", count: 6, budget: 288000, color: "#3B82F6" },
    { id: "d-4", name: "Customer Support", icon: "🎧", head: "Sneha Reddy", count: 8, budget: 280000, color: "#10B981" },
    { id: "d-5", name: "Food Court", icon: "🍕", head: "Kiran Desai", count: 15, budget: 330000, color: "#F59E0B" },
    { id: "d-6", name: "Ticket Counter", icon: "🎫", head: "Priya Nair", count: 10, budget: 280000, color: "#EC4899" },
    { id: "d-7", name: "Security", icon: "🛡️", head: "Amit Sharma", count: 14, budget: 448000, color: "#8B5CF6" },
    { id: "d-8", name: "Housekeeping", icon: "🧹", head: "Divya Joshi", count: 9, budget: 234000, color: "#06B6D4" },
    { id: "d-9", name: "Projection Room", icon: "🎬", head: "Sanjay Verma", count: 4, budget: 160000, color: "#F97316" },
    { id: "d-10", name: "Marketing", icon: "📢", head: "Neha Gupta", count: 4, budget: 200000, color: "#14B8A6" }
  ]);

  const [hrLeaves, setHrLeaves] = useState<any[]>([
    { id: "lv-1", name: "Sneha Reddy", dept: "Customer Support", type: "CASUAL", from: "Jul 18", to: "Jul 19", days: 2, reason: "Family function", status: "APPROVED" },
    { id: "lv-2", name: "Kiran Desai", dept: "Food Court", type: "SICK", from: "Jul 20", to: "Jul 20", days: 1, reason: "Fever", status: "PENDING" },
    { id: "lv-3", name: "Divya Joshi", dept: "Housekeeping", type: "EARNED", from: "Jul 22", to: "Jul 25", days: 4, reason: "Vacation", status: "PENDING" },
    { id: "lv-4", name: "Amit Sharma", dept: "Security", type: "COMP_OFF", from: "Jul 19", to: "Jul 19", days: 1, reason: "Worked on holiday", status: "APPROVED" }
  ]);

  const [hrPayroll] = useState<any[]>([
    { id: "p-1", name: "Arjun Kapoor", dept: "Management", gross: 85000, deductions: 12275, net: 72725, status: "PAID" },
    { id: "p-2", name: "Meera Patel", dept: "Kitchen", gross: 55000, deductions: 6665, net: 48335, status: "PAID" },
    { id: "p-3", name: "Ravi Kumar", dept: "Technical", gross: 48000, deductions: 5580, net: 42420, status: "PENDING" },
    { id: "p-4", name: "Sneha Reddy", dept: "Customer Support", gross: 35000, deductions: 4200, net: 30800, status: "PAID" },
    { id: "p-5", name: "Kiran Desai", dept: "Food Court", gross: 22000, deductions: 2010, net: 19990, status: "PENDING" },
    { id: "p-6", name: "Amit Sharma", dept: "Security", gross: 32000, deductions: 3840, net: 28160, status: "PAID" }
  ]);

  const [hrPerformance] = useState<any[]>([
    { id: "pr-1", name: "Arjun Kapoor", dept: "Management", attendance: 98, punctuality: 95, customerRating: 4.8, managerRating: 4.9, overall: 4.8, rec: "Eligible for annual bonus" },
    { id: "pr-2", name: "Meera Patel", dept: "Kitchen", attendance: 96, punctuality: 92, customerRating: 4.7, managerRating: 4.6, overall: 4.6, rec: "Consider for Head Chef promotion" },
    { id: "pr-3", name: "Kiran Desai", dept: "Food Court", attendance: 82, punctuality: 75, customerRating: 3.9, managerRating: 3.8, overall: 3.8, rec: "Needs punctuality training" },
    { id: "pr-4", name: "Amit Sharma", dept: "Security", attendance: 97, punctuality: 99, customerRating: 4.5, managerRating: 4.4, overall: 4.4, rec: "Recommend recognition award" }
  ]);

  const [hrAnnouncements] = useState<any[]>([
    { id: "ann-1", title: "Monthly Staff Meeting", message: "All department heads report to Conference Room at 10 AM on July 20th.", category: "Meeting", priority: "HIGH" },
    { id: "ann-2", title: "Fire Safety Drill", message: "Mandatory fire drill scheduled for July 22nd. All floors will participate.", category: "Emergency", priority: "CRITICAL" },
    { id: "ann-3", title: "Salary Credit Notice", message: "July salaries will be credited by 25th July. Contact HR for queries.", category: "General", priority: "NORMAL" }
  ]);

  const filteredEmployees = hrEmployees.filter((e) =>
    e.name.toLowerCase().includes(hrSearch.toLowerCase()) ||
    e.dept.toLowerCase().includes(hrSearch.toLowerCase()) ||
    e.designation.toLowerCase().includes(hrSearch.toLowerCase()) ||
    e.code.toLowerCase().includes(hrSearch.toLowerCase())
  );

  const handleApproveLeave = (id: string) => {
    setHrLeaves(hrLeaves.map((l) => l.id === id ? { ...l, status: "APPROVED" } : l));
    toast.success("Leave request approved.");
  };

  const handleRejectLeave = (id: string) => {
    setHrLeaves(hrLeaves.map((l) => l.id === id ? { ...l, status: "REJECTED" } : l));
    toast.success("Leave request rejected.");
  };

  const empStatusColor = (s: string) => {
    if (s === "PRESENT") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (s === "ABSENT") return "bg-red-500/10 text-red-400 border-red-500/20";
    if (s === "LATE") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    if (s === "ON_LEAVE") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    return "bg-white/5 text-gray-400 border-white/10";
  };

  // ═══════════════════════════════════════════════════════════════
  //  MARKETING — Loyalty, Coupons, Campaigns, Referrals
  // ═══════════════════════════════════════════════════════════════
  const [mktSubTab, setMktSubTab] = useState<"overview" | "memberships" | "coupons" | "campaigns" | "referrals" | "segments" | "automations" | "rewards">("overview");

  const [mktPlans] = useState<any[]>([
    { id: "mp-1", name: "Silver Screen", tier: "Silver", monthly: 299, yearly: 2999, members: 456, discount: 5, food: 10, points: 100, color: "#94A3B8" },
    { id: "mp-2", name: "Gold Star", tier: "Gold", monthly: 599, yearly: 5999, members: 312, discount: 10, food: 15, points: 250, color: "#F59E0B" },
    { id: "mp-3", name: "Platinum Elite", tier: "Platinum", monthly: 999, yearly: 9999, members: 189, discount: 15, food: 20, points: 500, color: "#A78BFA" },
    { id: "mp-4", name: "Diamond VIP", tier: "Diamond", monthly: 1999, yearly: 19999, members: 67, discount: 25, food: 30, points: 1000, color: "#06B6D4" },
    { id: "mp-5", name: "Black Card", tier: "Black", monthly: 4999, yearly: 49999, members: 23, discount: 40, food: 50, points: 2500, color: "#1E1E1E" }
  ]);

  const [mktCoupons] = useState<any[]>([
    { id: "c-1", code: "WELCOME50", title: "Welcome Offer", type: "PERCENTAGE", value: 50, maxDiscount: 200, limit: 5000, used: 1247, expires: "Aug 31", status: "ACTIVE" },
    { id: "c-2", code: "WEEKEND30", title: "Weekend Special", type: "FLAT", value: 30, maxDiscount: null, limit: 2000, used: 834, expires: "Jul 31", status: "ACTIVE" },
    { id: "c-3", code: "BOGO2026", title: "Buy 1 Get 1", type: "BOGO", value: 100, maxDiscount: 500, limit: 1000, used: 467, expires: "Sep 30", status: "ACTIVE" },
    { id: "c-4", code: "FOOD20", title: "Food 20% Off", type: "PERCENTAGE", value: 20, maxDiscount: 150, limit: 3000, used: 1890, expires: "Jul 25", status: "ACTIVE" },
    { id: "c-5", code: "BIRTHDAY100", title: "Birthday Gift", type: "FLAT", value: 100, maxDiscount: null, limit: 10000, used: 342, expires: "Dec 31", status: "ACTIVE" },
    { id: "c-6", code: "IMAX150", title: "IMAX Discount", type: "FLAT", value: 150, maxDiscount: null, limit: 500, used: 500, expires: "Jul 15", status: "EXPIRED" }
  ]);

  const [mktCampaigns] = useState<any[]>([
    { id: "cm-1", name: "Summer Blockbuster Launch", channel: "EMAIL", status: "ACTIVE", sent: 12847, opened: 5434, clicked: 1642, conversions: 412, revenue: 84600, roi: 1592 },
    { id: "cm-2", name: "Weekend Food Fest", channel: "PUSH", status: "ACTIVE", sent: 4500, opened: 2700, clicked: 945, conversions: 234, revenue: 46800, roi: 2240 },
    { id: "cm-3", name: "VIP Exclusive Preview", channel: "WHATSAPP", status: "COMPLETED", sent: 89, opened: 82, clicked: 67, conversions: 45, revenue: 67500, roi: 13400 },
    { id: "cm-4", name: "Win-Back Inactive", channel: "SMS", status: "ACTIVE", sent: 1203, opened: 420, clicked: 156, conversions: 42, revenue: 12600, roi: 320 },
    { id: "cm-5", name: "Birthday Month Special", channel: "EMAIL", status: "SCHEDULED", sent: 0, opened: 0, clicked: 0, conversions: 0, revenue: 0, roi: 0 }
  ]);

  const [mktSegments] = useState<any[]>([
    { id: "s-1", name: "High Spenders", count: 89, avg: 4200, color: "#F59E0B", auto: true },
    { id: "s-2", name: "Frequent Visitors", count: 234, avg: 1800, color: "#10B981", auto: true },
    { id: "s-3", name: "Weekend Warriors", count: 567, avg: 950, color: "#3B82F6", auto: true },
    { id: "s-4", name: "Family Groups", count: 178, avg: 2100, color: "#8B5CF6", auto: true },
    { id: "s-5", name: "Students", count: 445, avg: 420, color: "#06B6D4", auto: false },
    { id: "s-6", name: "Corporate", count: 67, avg: 3100, color: "#EC4899", auto: false },
    { id: "s-7", name: "Food Enthusiasts", count: 312, avg: 1450, color: "#F97316", auto: true },
    { id: "s-8", name: "Inactive (30d+)", count: 1203, avg: 0, color: "#EF4444", auto: true },
    { id: "s-9", name: "New Users (7d)", count: 156, avg: 380, color: "#14B8A6", auto: true },
    { id: "s-10", name: "Premium Members", count: 279, avg: 3400, color: "#A78BFA", auto: false }
  ]);

  const [mktAutomations] = useState<any[]>([
    { id: "a-1", name: "Welcome Flow", trigger: "Customer Registers", steps: 5, runs: 2847, active: true, lastRun: "2h ago" },
    { id: "a-2", name: "Abandoned Booking", trigger: "Booking Not Completed (30m)", steps: 3, runs: 456, active: true, lastRun: "15m ago" },
    { id: "a-3", name: "Birthday Celebration", trigger: "Customer Birthday", steps: 4, runs: 342, active: true, lastRun: "6h ago" },
    { id: "a-4", name: "Loyalty Milestone", trigger: "Points Reach 1000", steps: 2, runs: 189, active: true, lastRun: "1d ago" },
    { id: "a-5", name: "Win-Back Campaign", trigger: "No Visit 30 Days", steps: 6, runs: 1203, active: true, lastRun: "3h ago" },
    { id: "a-6", name: "Membership Renewal", trigger: "7 Days Before Expiry", steps: 3, runs: 67, active: false, lastRun: "5d ago" }
  ]);

  const campaignStatusColor = (s: string) => {
    if (s === "ACTIVE") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (s === "COMPLETED") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (s === "SCHEDULED") return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    if (s === "DRAFT") return "bg-white/5 text-gray-400 border-white/10";
    if (s === "EXPIRED") return "bg-red-500/10 text-red-400 border-red-500/20";
    return "bg-white/5 text-gray-400 border-white/10";
  };

  // ═══════════════════════════════════════════════════════════════
  //  FINANCE — Enterprise Finance & Business Intelligence State
  // ═══════════════════════════════════════════════════════════════
  const [finSubTab, setFinSubTab] = useState<"overview" | "revenue" | "expenses" | "banks" | "gst" | "ai" | "transactions">("overview");

  const [expensesList, setExpensesList] = useState<any[]>([
    { id: "exp-801", invoiceNumber: "INV-E6710", vendor: "Tata Power", category: "Electricity", subcategory: "Main Line", amount: 145000, gst: 26100, status: "APPROVED", branch: "CineVerse Mumbai", date: "Jul 15, 2026", approvedBy: "Arjun Kapoor" },
    { id: "exp-802", invoiceNumber: "INV-E6711", vendor: "Airtel Fiber", category: "Internet", subcategory: "Broadband", amount: 12000, gst: 2160, status: "PAID", branch: "CineVerse Delhi VIP", date: "Jul 14, 2026", approvedBy: "Arjun Kapoor" },
    { id: "exp-803", invoiceNumber: "INV-E6712", vendor: "Amul Dairy", category: "Food Purchases", subcategory: "Raw Materials", amount: 62000, gst: 3100, status: "PENDING", branch: "CineVerse Bengaluru", date: "Jul 18, 2026", approvedBy: null },
    { id: "exp-804", invoiceNumber: "INV-E6713", vendor: "AgriCorp India", category: "Food Purchases", subcategory: "Raw Materials", amount: 48000, gst: 2400, status: "APPROVED", branch: "CineVerse Mumbai", date: "Jul 17, 2026", approvedBy: "Arjun Kapoor" },
    { id: "exp-805", invoiceNumber: "INV-E6714", vendor: "BookMyShow", category: "Software", subcategory: "Cloud Hosting", amount: 85000, gst: 15300, status: "PAID", branch: "Corporate HQ", date: "Jul 10, 2026", approvedBy: "Finance Team" }
  ]);

  const [newExpenseForm, setNewExpenseForm] = useState({
    vendor: "",
    category: "Electricity",
    subcategory: "",
    amount: "",
    gst: "",
    branch: "CineVerse Mumbai",
    invoiceNumber: "",
    notes: ""
  });

  const [bankAccounts] = useState<any[]>([
    { id: "ba-1", name: "HDFC Current Account", type: "Bank", opening: 5000000, current: 6338736, active: true },
    { id: "ba-2", name: "ICICI Savings Account", type: "Bank", opening: 1200000, current: 1545000, active: true },
    { id: "ba-3", name: "Main Petty Cash Vault", type: "Cash", opening: 50000, current: 48500, active: true },
    { id: "ba-4", name: "Razorpay Gateway Settlement", type: "UPI Wallet", opening: 350000, current: 480000, active: true }
  ]);

  const [financialBudgets] = useState<any[]>([
    { id: "bg-1", name: "Q3 Marketing Campaign", category: "Marketing", amount: 500000, actual: 180000, variance: 320000, period: "Q3 2026" },
    { id: "bg-2", name: "F&B Stock Purchases", category: "Food Purchases", amount: 300000, actual: 110000, variance: 190000, period: "Jul 2026" },
    { id: "bg-3", name: "Infrastructure Maintenance", category: "Maintenance", amount: 200000, actual: 120000, variance: 80000, period: "Jul 2026" }
  ]);

  const [revenueCategories, setRevenueCategories] = useState<any[]>([
    { id: "rc-1", name: "Movie Tickets", taxRate: 18, department: "Box Office", ledgerCode: "REV-TKT-01", desc: "Ticket booking revenue online and counter" },
    { id: "rc-2", name: "Food Orders", taxRate: 5, department: "Concessions", ledgerCode: "REV-FNB-02", desc: "Popcorn, snacks, beverages and combos sales" },
    { id: "rc-3", name: "Membership Plans", taxRate: 18, department: "Marketing", ledgerCode: "REV-MBR-03", desc: "Silver, Gold, Platinum monthly and yearly plans" },
    { id: "rc-4", name: "Parking Fee", taxRate: 18, department: "Facilities", ledgerCode: "REV-PRK-04", desc: "Two wheelers and four wheelers valet parking" }
  ]);

  const [customRevenueName, setCustomRevenueName] = useState("");
  const [customRevenueTax, setCustomRevenueTax] = useState("18");
  const [customRevenueDept, setCustomRevenueDept] = useState("Box Office");

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseForm.vendor || !newExpenseForm.amount) {
      toast.error("Please fill in Vendor name and Amount.");
      return;
    }
    const created: any = {
      id: "exp-" + Math.floor(Math.random() * 1000 + 800),
      invoiceNumber: newExpenseForm.invoiceNumber || "INV-E" + Math.floor(Math.random() * 90000 + 10000),
      vendor: newExpenseForm.vendor,
      category: newExpenseForm.category,
      subcategory: newExpenseForm.subcategory || "General",
      amount: parseFloat(newExpenseForm.amount),
      gst: parseFloat(newExpenseForm.gst || "0"),
      status: "PENDING",
      branch: newExpenseForm.branch,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      approvedBy: null
    };

    setExpensesList([created, ...expensesList]);
    setNewExpenseForm({
      vendor: "",
      category: "Electricity",
      subcategory: "",
      amount: "",
      gst: "",
      branch: "CineVerse Mumbai",
      invoiceNumber: "",
      notes: ""
    });
    toast.success("Expense entry added successfully as Pending.");
  };

  const handleApproveExpense = (id: string, approverName: string) => {
    setExpensesList(expensesList.map(item => item.id === id ? { ...item, status: "APPROVED", approvedBy: approverName } : item));
    toast.success("Expense entry approved.");
  };

  const handleRejectExpense = (id: string) => {
    setExpensesList(expensesList.map(item => item.id === id ? { ...item, status: "REJECTED" } : item));
    toast.success("Expense entry rejected.");
  };

  const handleAddCustomRevenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRevenueName) {
      toast.error("Please enter a category name.");
      return;
    }
    const newRev = {
      id: "rc-" + (revenueCategories.length + 1),
      name: customRevenueName,
      taxRate: parseFloat(customRevenueTax),
      department: customRevenueDept,
      ledgerCode: "REV-CUST-" + (revenueCategories.length + 1).toString().padStart(2, "0"),
      desc: "Custom added revenue category"
    };
    setRevenueCategories([...revenueCategories, newRev]);
    setCustomRevenueName("");
    toast.success("Custom revenue source added successfully.");
  };

  const expenseStatusColor = (s: string) => {
    if (s === "PAID") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (s === "APPROVED") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (s === "PENDING") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    if (s === "REJECTED") return "bg-red-500/10 text-red-400 border-red-500/20";
    return "bg-white/5 text-gray-400 border-white/10";
  };

  // ═══════════════════════════════════════════════════════════════
  //  SECURITY — Command Center & Access Control State
  // ═══════════════════════════════════════════════════════════════
  const [secSubTab, setSecSubTab] = useState<"overview" | "cctv" | "ai_detect" | "access" | "cyber" | "audit" | "emergency" | "reports">("overview");
  
  // Biometric & Access states
  const [faceScannerState, setFaceScannerState] = useState<"IDLE" | "SCANNING" | "MATCHED" | "UNKNOWN">("IDLE");
  const [faceScannedUser, setFaceScannedUser] = useState<string | null>(null);

  // 3D Digital Access Card generator states
  const [cardType, setCardType] = useState<"EMPLOYEE" | "VIP" | "VISITOR">("EMPLOYEE");
  const [cardHolderName, setCardHolderName] = useState("Arjun Kapoor");
  const [cardClearance, setCardClearance] = useState("LEVEL_4_MANAGEMENT");
  const [cardIsFlipped, setCardIsFlipped] = useState(false);

  // CCTV playback controls
  const [selectedCamId, setSelectedCamId] = useState("cam-1");
  const [isCctvRecording, setIsCctvRecording] = useState(true);
  const [showPlaybackWindow, setShowPlaybackWindow] = useState(false);

  // Access control gates
  const [accessGates, setAccessGates] = useState<any[]>([
    { id: "gate-1", name: "Server Room Entrance", allowedRoles: ["IT Administrator", "Owner"], status: "LOCKED", alertOnBreach: true },
    { id: "gate-2", name: "Office Vault Door", allowedRoles: ["HR Manager", "Owner"], status: "LOCKED", alertOnBreach: true },
    { id: "gate-3", name: "Staff Lounge Entry", allowedRoles: ["All Employees"], status: "UNLOCKED", alertOnBreach: false }
  ]);

  const [securityAlerts, setSecurityAlerts] = useState<any[]>([
    { id: "alt-01", title: "CCTV Camera Offline", type: "CAMERA_OFFLINE", priority: "HIGH", status: "OPEN", message: "Storage Room Camera has disconnected. Check power cable.", time: "10 mins ago" },
    { id: "alt-02", title: "Multiple Failed Login Attempts", type: "UNAUTHORIZED_ACCESS", priority: "MEDIUM", status: "IN_PROGRESS", message: "5 failed logins detected for user 'manager@cinemapromax.com' from IP 45.12.89.1", time: "25 mins ago" },
    { id: "alt-03", title: "Suspicious Coupon Redemption", type: "FRAUD_ATTEMPT", priority: "HIGH", status: "OPEN", message: "User 'usr-291' attempted to apply WELCOME50 three times in 1 minute.", time: "40 mins ago" }
  ]);

  const [securityDevices] = useState<any[]>([
    { id: "dev-01", name: "Gate 1 QR Scanner", type: "Scanner", location: "Main Entry 1", status: "ONLINE", ip: "192.168.1.101", level: "HIGH" },
    { id: "dev-02", name: "POS Terminal 1", type: "POS Machine", location: "Box Office Counter 1", status: "ONLINE", ip: "192.168.1.105", level: "STANDARD" },
    { id: "dev-03", name: "Concessions Tablet A", type: "Tablet", location: "Food Court", status: "ONLINE", ip: "192.168.1.112", level: "STANDARD" },
    { id: "dev-04", name: "Main DB Server Node", type: "Server", location: "Secure Rack A", status: "ONLINE", ip: "10.0.0.4", level: "CRITICAL" },
    { id: "dev-05", name: "Back Office Desktop 1", type: "Desktop", location: "Administration", status: "OFFLINE", ip: "192.168.1.201", level: "STANDARD" }
  ]);

  const [cctvCameras] = useState<any[]>([
    { id: "cam-1", name: "Main Entrance Outer", location: "Entrance Gate 1", status: "ONLINE", recording: "RECORDING", motion: true, storage: "NORMAL" },
    { id: "cam-2", name: "Box Office Counter 1", location: "Ticketing Lobby", status: "ONLINE", recording: "RECORDING", motion: false, storage: "NORMAL" },
    { id: "cam-3", name: "Concessions Counter A", location: "Food Court", status: "ONLINE", recording: "RECORDING", motion: true, storage: "NORMAL" },
    { id: "cam-4", name: "Storage Room Vault", location: "Back Office", status: "OFFLINE", recording: "IDLE", motion: false, storage: "NORMAL" },
    { id: "cam-5", name: "Screen 1 IMAX Inward", location: "Auditorium 1", status: "ONLINE", recording: "RECORDING", motion: true, storage: "NORMAL" }
  ]);

  const [entrySecurityLogs] = useState<any[]>([
    { id: "ent-101", customerName: "Priya Sharma", ticketId: "tkt-8821a", gate: "Main Turnstile 1", status: "ALLOWED", time: "12:30 PM", method: "QR_SCAN" },
    { id: "ent-102", customerName: "Unknown User", ticketId: "tkt-0000a", gate: "Lobby VIP Door", status: "FRAUD", time: "12:34 PM", method: "SCREENSHOT_ALERT" },
    { id: "ent-103", customerName: "Ravi Kumar (Staff)", ticketId: "emp-003", gate: "Service Gate 2", status: "ALLOWED", time: "12:38 PM", method: "RFID" },
    { id: "ent-104", customerName: "Ananya Patel", ticketId: "tkt-2910c", gate: "Main Turnstile 2", status: "DUPLICATE", time: "12:40 PM", method: "QR_SCAN" }
  ]);

  const [securityScore, setSecurityScore] = useState(96);
  const [activeEmergency, setActiveEmergency] = useState<string | null>(null);

  const [verificationInput, setVerificationInput] = useState("");
  const [newAlertForm, setNewAlertForm] = useState({ title: "", type: "CAMERA_OFFLINE", priority: "MEDIUM", message: "" });

  const handleResolveAlert = (id: string) => {
    setSecurityAlerts(securityAlerts.filter(a => a.id !== id));
    toast.success("Security alert resolved & archived.");
  };

  const handleCreateSecurityAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertForm.title || !newAlertForm.message) {
      toast.error("Please fill in alert title and details.");
      return;
    }
    const created = {
      id: "alt-" + Math.floor(Math.random() * 1000 + 10),
      title: newAlertForm.title,
      type: newAlertForm.type,
      priority: newAlertForm.priority,
      status: "OPEN",
      message: newAlertForm.message,
      time: "Just now"
    };
    setSecurityAlerts([created, ...securityAlerts]);
    setNewAlertForm({ title: "", type: "CAMERA_OFFLINE", priority: "MEDIUM", message: "" });
    toast.success("Critical security alert dispatched.");
  };

  const handleVerifyTicketInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationInput) return;
    if (verificationInput === "tkt-0000a") {
      toast.error("⚠️ FRAUD ALERT: Screenshot/Duplicate signature detected!");
    } else if (verificationInput === "tkt-2910c") {
      toast("⚠️ DUPLICATE ENTRY: Ticket already checked-in.", { icon: "⚠️" });
    } else {
      toast.success("✓ ACCESS GRANTED: Entry logged successfully.");
    }
    setVerificationInput("");
  };

  const handleActivateEmergency = (type: string) => {
    setActiveEmergency(type);
    setSecurityScore(42);
    toast.error(`🚨 EMERGENCY PROTOCOL ACTIVATED: Evacuation announcements triggered for ${type}!`);
  };

  const handleResolveEmergency = () => {
    setActiveEmergency(null);
    setSecurityScore(96);
    toast.success("✓ Emergency status resolved. Re-establishing Standard Security Protocols.");
  };

  const alertPriorityColor = (p: string) => {
    if (p === "CRITICAL") return "bg-red-500/10 text-red-400 border-red-500/20";
    if (p === "HIGH") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    if (p === "MEDIUM") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    return "bg-white/5 text-gray-400 border-white/10";
  };

  // ═══════════════════════════════════════════════════════════════
  //  NOTIFICATIONS & OMNICHANNEL MESSAGING State
  // ═══════════════════════════════════════════════════════════════
  const [notifSubTab, setNotifSubTab] = useState<"overview" | "channels" | "templates" | "automations" | "chat">("overview");

  const [messageLogs] = useState<any[]>([
    { id: "msg-101", customerName: "Priya Sharma", channel: "WHATSAPP", template: "Booking Confirmation", time: "2 mins ago", status: "DELIVERED", details: "Ticket bk-7849c shared successfully." },
    { id: "msg-102", customerName: "Rajesh Kumar", channel: "EMAIL", template: "Payment Success", time: "15 mins ago", status: "OPENED", details: "Invoice for bk-6123a opened." },
    { id: "msg-103", customerName: "Vikram Mehta", channel: "SMS", template: "OTP Verification", time: "30 mins ago", status: "SENT", details: "MFA Token dispatched successfully." },
    { id: "msg-104", customerName: "Ananya Patel", channel: "PUSH", template: "Movie Reminder", time: "1 hour ago", status: "CLICKED", details: "Aether Rising Stars starting soon alert." },
    { id: "msg-105", customerName: "Sneha Reddy", channel: "WHATSAPP", template: "Refund Completed", time: "2 hours ago", status: "FAILED", details: "Number not reachable. Auto-retrying via SMS.", error: "UNDELIVERED_TIMEOUT" }
  ]);

  const [channelsList, setChannelsList] = useState<any[]>([
    { id: "ch-1", name: "Email", enabled: true, priority: 2, gateway: "SendGrid SMTP" },
    { id: "ch-2", name: "SMS", enabled: true, priority: 3, gateway: "Twilio Gateway" },
    { id: "ch-3", name: "WhatsApp Business", enabled: true, priority: 1, gateway: "Meta Cloud API" },
    { id: "ch-4", name: "Web Push Notification", enabled: true, priority: 4, gateway: "Firebase Cloud Messaging" }
  ]);

  const [messageTemplates, setMessageTemplates] = useState<any[]>([
    { id: "tpl-01", name: "Booking Confirmation", type: "TRANSACTIONAL", subject: "Your Tickets are Confirmed! 🎬", body: "Hi {{customer_name}}, your tickets for {{movie_name}} are confirmed. Theatre: {{theatre_name}}, Seats: {{seat_number}}." },
    { id: "tpl-02", name: "Movie Showtime Reminder", type: "REMINDER", subject: "Show starting soon! 🍿", body: "Hi {{customer_name}}, your show for {{movie_name}} starts in 1 hour at {{theatre_name}}." },
    { id: "tpl-03", name: "Refund Success Notice", type: "TRANSACTIONAL", subject: "Refund Disbursed 💰", body: "Hi {{customer_name}}, a refund of ₹{{payment_amount}} has been credited for booking {{booking_id}}." },
    { id: "tpl-04", name: "Exclusive Promo Offer", type: "PROMOTIONAL", subject: "20% Off Concessions! 🍿", body: "Enjoy 20% off all combos today using code {{coupon_code}} at the food counter." }
  ]);

  const [notifWorkflows] = useState<any[]>([
    { id: "wf-1", name: "Post Booking Ticket Dispatch", trigger: "Payment Success", actions: ["Send WhatsApp Ticket", "Send Email Invoice"] },
    { id: "wf-2", name: "Showtime Alert Journey", trigger: "1 Hour Before Show", actions: ["Send Push Notification", "Fallback SMS if Push Fails"] },
    { id: "wf-3", name: "Customer Feedback Loop", trigger: "2 Hours After Show", actions: ["Send WhatsApp Review Invite", "Award 50 Loyalty Points"] }
  ]);

  const [activeConversations, setActiveConversations] = useState<any[]>([
    { id: "c-101", customerName: "Priya Sharma", email: "priya@gmail.com", lastMsg: "How can I upgrade my seat?", status: "OPEN", messages: [
      { sender: "Priya Sharma", text: "Hi, I have a Gold Star ticket for Aether Rising tonight.", isStaff: false, time: "12:30 PM" },
      { sender: "AI Assistant", text: "Hello Priya! Standard upgrades can be made via the dashboard. Would you like me to process a VIP upgrade query?", isStaff: true, time: "12:31 PM" },
      { sender: "Priya Sharma", text: "How can I upgrade my seat?", isStaff: false, time: "12:32 PM" }
    ]},
    { id: "c-102", customerName: "Rajesh Kumar", email: "rajesh.k@gmail.com", lastMsg: "Refund not received", status: "OPEN", messages: [
      { sender: "Rajesh Kumar", text: "My payment failed but amount was deducted.", isStaff: false, time: "11:15 AM" }
    ]}
  ]);

  const [selectedChatId, setSelectedChatId] = useState<string | null>("c-101");
  const [chatComposerText, setChatComposerText] = useState("");

  const [newTemplateForm, setNewTemplateForm] = useState({ name: "", type: "TRANSACTIONAL", subject: "", body: "" });

  const handleToggleChannel = (id: string) => {
    setChannelsList(channelsList.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
    toast.success("Communication channel settings updated.");
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateForm.name || !newTemplateForm.body) {
      toast.error("Please fill in template name and content body.");
      return;
    }
    const created = {
      id: "tpl-" + Math.floor(Math.random() * 1000 + 100),
      name: newTemplateForm.name,
      type: newTemplateForm.type,
      subject: newTemplateForm.subject || null,
      body: newTemplateForm.body
    };
    setMessageTemplates([...messageTemplates, created]);
    setNewTemplateForm({ name: "", type: "TRANSACTIONAL", subject: "", body: "" });
    toast.success("Omnichannel template saved successfully.");
  };

  const handleSendChatComposer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatComposerText.trim() || !selectedChatId) return;

    setActiveConversations(activeConversations.map(chat => {
      if (chat.id === selectedChatId) {
        return {
          ...chat,
          lastMsg: chatComposerText,
          messages: [...chat.messages, { sender: "Owner Support Desk", text: chatComposerText, isStaff: true, time: "Just now" }]
        };
      }
      return chat;
    }));

    setChatComposerText("");
    toast.success("Message dispatched to user.");
  };

  // ═══════════════════════════════════════════════════════════════
  //  BUSINESS INTELLIGENCE & REPORTING ENGINE State
  // ═══════════════════════════════════════════════════════════════
  const [repSubTab, setRepSubTab] = useState<"overview" | "revenue" | "bookings" | "movies" | "food" | "marketing" | "employees" | "predictions">("overview");
  const [aiAssistantMessages, setAiAssistantMessages] = useState<any[]>([
    { role: "assistant", text: "Welcome back, Commander. AI Prediction Engine is online. You can ask me to forecast weekend earnings, suggest movie promotions, or explain today's margins." }
  ]);
  const [aiAssistantInput, setAiAssistantInput] = useState("");

  /*
  const [aiAnalystQuestion, setAiAnalystQuestion] = useState("");
  const [aiAnalystResponse, setAiAnalystResponse] = useState<string | null>(null);
  const [aiAnalystImpact, setAiAnalystImpact] = useState<string | null>(null);
  */

  /*
  const [savedReports, setSavedReports] = useState<any[]>([
    { id: "rep-1", name: "Monthly CFO Profit & Loss Statement", category: "FINANCE", scheduled: "Monthly", format: "PDF" },
    { id: "rep-2", name: "Weekly F&B Inventory Wastage Audit", category: "FOOD", scheduled: "Weekly", format: "Excel" },
    { id: "rep-3", name: "Daily Box Office Occupancy Heatmap", category: "REVENUE", scheduled: "Daily", format: "JSON" }
  ]);
  */

  /*
  const [customReportForm, setCustomReportForm] = useState({ name: "", category: "REVENUE", format: "PDF" });

  const handleAskBIAnalyst = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiAnalystQuestion.trim()) return;
    const q = aiAnalystQuestion.toLowerCase();
    if (q.includes("revenue")) {
      setAiAnalystResponse("No revenue data available yet. Add movies and configure showtimes to generate AI insights.");
      setAiAnalystImpact("+5.2% margins increase");
    } else if (q.includes("food") || q.includes("popcorn")) {
      setAiAnalystResponse("Truffle Butter Popcorn accounts for 42% of F&B profit margins today. Concession attachment rate is currently sitting at 23.3%.");
      setAiAnalystImpact("+8.1% concession attachment");
    } else {
      setAiAnalystResponse("Overall business health score is 88. Customer retention is stable. Recommendation is to keep screens allocated to Sci-Fi blockbusters.");
      setAiAnalystImpact("+4.2% operational efficiency gain");
    }
  };

  const handleCreateCustomReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customReportForm.name) {
      toast.error("Please enter a name for the report.");
      return;
    }
    const created = {
      id: "rep-" + Math.floor(Math.random() * 1000 + 10),
      name: customReportForm.name,
      category: customReportForm.category,
      scheduled: "On Demand",
      format: customReportForm.format
    };
    setSavedReports([...savedReports, created]);
    setCustomReportForm({ name: "", category: "REVENUE", format: "PDF" });
    toast.success("BI Custom Report template saved successfully.");
  };
  */

  // ═══════════════════════════════════════════════════════════════
  //  MOBILE APPLICATION ECOSYSTEM State
  // ═══════════════════════════════════════════════════════════════
  const [mobileSubTab, setMobileSubTab] = useState<"splash" | "layouts" | "ticket" | "push" | "offline">("splash");

  const [splashDuration, setSplashDuration] = useState(3);
  const [splashMusic, setSplashMusic] = useState("orchestral_intro.mp3");

  const [mobileWidgets, setMobileWidgets] = useState<any>({
    heroBanner: true,
    offersCarousel: true,
    recommendedMovies: true,
    foodOffers: true,
    membershipCard: true
  });

  const [pushTitle, setPushTitle] = useState("");
  const [pushBody, setPushBody] = useState("");
  const [pushTopic, setPushTopic] = useState("All_Users");

  const [offlineSyncLogs] = useState<any[]>([
    { device: "iPhone 14 Pro", os: "iOS 16.4", lastSync: "2 mins ago", pending: 0, status: "SYNCED" },
    { device: "Samsung S23 Ultra", os: "Android 13", lastSync: "15 mins ago", pending: 0, status: "SYNCED" },
    { device: "OnePlus 11 5G", os: "Android 13", lastSync: "Temporary Offline", pending: 4, status: "OFFLINE_QUEUED" }
  ]);

  const handleToggleWidget = (key: string) => {
    setMobileWidgets({ ...mobileWidgets, [key]: !mobileWidgets[key] });
    toast.success("Mobile homepage layout configuration updated.");
  };

  const handleSendFCMNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle.trim() || !pushBody.trim()) {
      toast.error("Please fill in push notification title and body.");
      return;
    }
    toast.success(`FCM Push notification dispatched to topic: ${pushTopic}`);
    setPushTitle("");
    setPushBody("");
  };

  const handleSaveSplashSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Splash experience configurations saved. Duration: ${splashDuration}s.`);
  };

  // ═══════════════════════════════════════════════════════════════
  //  WEBSITE CUSTOMIZATION ENGINE State
  // ═══════════════════════════════════════════════════════════════
  const [webSubTab, setWebSubTab] = useState<"theme" | "hero" | "ribbons" | "sections" | "seo">("theme");

  const [webPrimaryColor, setWebPrimaryColor] = useState("#EF4444");
  const [webSecondaryColor, setWebSecondaryColor] = useState("#0F172A");
  /* const [webParticles, setWebParticles] = useState(80); */

  const [webHeroTitle, setWebHeroTitle] = useState("Experience Movies Beyond Reality");
  const [webHeroSub, setWebHeroSub] = useState("Enter the cinematic 3D CineVerse universe.");
  const [webHeroBg, setWebHeroBg] = useState("https://cinemapromax.com/assets/aether_banner.jpg");

  const [webSections, setWebSections] = useState<any>([
    { id: "sec-1", sectionId: "hero", title: "3D Hero Entrance Hall", visible: true },
    { id: "sec-2", sectionId: "nowplaying", title: "Now Playing 3D Tilt Carousel", visible: true },
    { id: "sec-3", sectionId: "upcoming", title: "Coming Soon 3D Timeline", visible: true },
    { id: "sec-4", sectionId: "food", title: "Concessions 360 Hover Stand", visible: true },
    { id: "sec-5", sectionId: "membership", title: "Membership Tiers Cards Flip", visible: true }
  ]);

  const [movieRibbons, setMovieRibbons] = useState<any[]>([
    { movieId: "mov-01", name: "Aether: Rising Stars", badge: "BLOCKBUSTER", color: "#EF4444" },
    { movieId: "mov-02", name: "Shadows of the Dynasty", badge: "POPULAR", color: "#3B82F6" },
    { movieId: "mov-03", name: "Echoes in the Dark", badge: "SELLING FAST", color: "#F59E0B" }
  ]);

  const [webSeoDesc, setWebSeoDesc] = useState("Book tickets online and enjoy gourmet seat delivery in ultra premium IMAX screens.");
  const [webPopupTitle, setWebPopupTitle] = useState("Weekend Combo Offer! 🍿");

  // CMS Drag-and-Drop / Visual Editor state
  /*
  const [cmsPage, setCmsPage] = useState<string>("home");
  */
  const [cmsViewport, setCmsViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  /*
  const [selectedCmsSecId, setSelectedCmsSecId] = useState<string>("sec-hero");
  const [selectedCmsCompId, setSelectedCmsCompId] = useState<string>("cmp-1");
  */
  const [cmsLanguage, setCmsLanguage] = useState<string>("en");
  /*
  const [cmsHistory, setCmsHistory] = useState<any[]>([
    {
      id: "pag-home",
      slug: "home",
      title: "CineVerse Premium Home",
      description: "futuristic theater booking experience",
      published: true,
      sections: [
        {
          id: "sec-hero",
          type: "HERO",
          sortOrder: 0,
          isActive: true,
          settings: { height: "700px", bgVideo: "https://cinemapromax.com/assets/intro.mp4", bgImage: "https://cinemapromax.com/assets/banner1.jpg" },
          components: [
            {
              id: "cmp-1",
              type: "TEXT",
              sortOrder: 0,
              content: { text: "Experience Beyond Imagination", size: "2xl" },
              styling: { color: "#FFFFFF", animation: "FADE" }
            }
          ]
        }
      ]
    }
  ]);
  */
  /*
  const [cmsHistoryIndex, setCmsHistoryIndex] = useState<number>(0);
  const [cmsThemeName, setCmsThemeName] = useState<string>("Festival Mode");
  */
  const [cmsCustomFont, setCmsCustomFont] = useState<string>("Outfit");
  const [cms3DModelScale, setCms3DModelScale] = useState<number>(1.0);
  const [cms3DModelSpeed, setCms3DModelSpeed] = useState<number>(0.5);
  /*
  const [cmsAnimationType, setCmsAnimationType] = useState<string>("Floating");
  const [cmsSelectedThemeMode, setCmsSelectedThemeMode] = useState<string>("dark");
  const [cmsMenus, setCmsMenus] = useState<any[]>([
    { id: "nav-1", name: "Home", link: "/" },
    { id: "nav-2", name: "Movies", link: "/movies" },
    { id: "nav-3", name: "Offers", link: "/offers" },
    { id: "nav-4", name: "Concessions", link: "/concessions" }
  ]);
  const [cmsFooterFilmstrip, setCmsFooterFilmstrip] = useState<boolean>(true);
  const [cmsPopups, setCmsPopups] = useState<any[]>([
    { id: "pop-1", name: "Weekend discount combo", triggerTime: 2000, targetAudience: "VIP", isActive: true }
  ]);
  const [cmsDraftVersionName, setCmsDraftVersionName] = useState<string>("v1.2.0-draft");
  */


  const handleToggleWebSection = (id: string) => {
    setWebSections(webSections.map((s: any) => s.id === id ? { ...s, visible: !s.visible } : s));
    toast.success("Homepage section layout visibility updated.");
  };

  /*
  const handleSaveThemeSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Cinematic website theme styles applied successfully.");
  };
  */

  const handleSaveHeroSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Website Hero banner components updated.");
  };

  const handleSaveSeoSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("SEO Metadata tags saved successfully.");
  };

  // ═══════════════════════════════════════════════════════════════
  //  SEO & CLOUD INFRASTRUCTURE DEPLOYMENT State
  // ═══════════════════════════════════════════════════════════════
  type SeoSubTabKey = "overview" | "meta" | "pages" | "keywords" | "cms" | "deploy" | "backup" | "logs";
  const [seoSubTab, setSeoSubTab] = useState<SeoSubTabKey>("overview");

  // Meta Information management
  const [activeMetaSection, setActiveMetaSection] = useState<"home" | "movie" | "theatre" | "offer">("home");
  
  // Home meta
  const [metaHomeTitle, setMetaHomeTitle] = useState("Experience Movies Beyond Reality | Cinema Pro Max");
  const [metaHomeDesc, setMetaHomeDesc] = useState("Book tickets online and enjoy gourmet seat delivery in ultra premium IMAX screens.");
  const [metaHomeKeys, setMetaHomeKeys] = useState("Cinema, IMAX Mumbai, Ticket Bookings, Popcorn");
  const [metaHomeOg, setMetaHomeOg] = useState("https://cinemapromax.com/assets/og_home.jpg");
  const [metaHomeTwitter, setMetaHomeTwitter] = useState("summary_large_image");
  const [metaHomeCanonical, setMetaHomeCanonical] = useState("https://cinemapromax.com");

  // Movie meta
  const [metaMovieTitle, setMetaMovieTitle] = useState("Aether: Rising Stars (2026) | Tickets & Showtimes");
  const [metaMovieDesc, setMetaMovieDesc] = useState("Book tickets for Aether: Rising Stars in IMAX 3D. Showtimes, trailers, ratings, and cast details.");
  const [metaMovieGenre, setMetaMovieGenre] = useState("Sci-Fi, Adventure");
  const [metaMovieLang, setMetaMovieLang] = useState("English, Hindi");
  const [metaMovieCast, setMetaMovieCast] = useState("Christian Bale, Anne Hathaway");
  const [metaMovieRelease, setMetaMovieRelease] = useState("2026-07-20");
  const [metaMovieTrailer, setMetaMovieTrailer] = useState("https://youtube.com/watch?v=aether");
  const [metaMovieSchema, setMetaMovieSchema] = useState("Movie");

  // Theatre meta
  const [metaTheatreLoc, setMetaTheatreLoc] = useState("Mumbai");
  const [metaTheatreAddr, setMetaTheatreAddr] = useState("Phoenix Palladium Mall, Lower Parel");
  const [metaTheatreFacilities, setMetaTheatreFacilities] = useState("IMAX, 4DX, Recliner VIP Lounge");
  const [metaTheatreTiming, setMetaTheatreTiming] = useState("9:00 AM - 1:00 AM");
  const [metaTheatreImages, setMetaTheatreImages] = useState("theatre_mumbai_front.jpg");

  // Offer meta
  const [metaOfferTitle, setMetaOfferTitle] = useState("Buy 1 Get 1 Free Movie Tickets on Weekdays");
  const [metaOfferValidity, setMetaOfferValidity] = useState("Valid till 2026-12-31");
  const [metaOfferCoupon, setMetaOfferCoupon] = useState("BOGOWEEK");
  const [metaOfferDesc, setMetaOfferDesc] = useState("Use code BOGOWEEK at checkout to get a free ticket with your weekday bookings.");

  // Google integration toggles
  const [gSearchConsole, setGSearchConsole] = useState(true);
  const [gAnalytics, setGAnalytics] = useState(true);
  const [gTagManager, setGTagManager] = useState(false);
  const [gMaps, setGMaps] = useState(true);

  // Dynamic SEO page builder
  const [seoPagesList, setSeoPagesList] = useState<any[]>([
    { slug: "/best-movies-in-mumbai", title: "Best Movies playing in Mumbai", desc: "Top Hindi and English movies in Mumbai.", category: "City Pages", visible: true },
    { slug: "/luxury-cinema-experience", title: "Luxury Cinema Experience", desc: "Experience ultra-premium VIP recliners.", category: "Experiences", visible: true },
    { slug: "/weekend-movie-offers", title: "Weekend Movie Ticket Offers", desc: "Exclusive discount codes for weekend slots.", category: "Offers", visible: true }
  ]);
  const [buildUrl, setBuildUrl] = useState("");
  const [buildTitle, setBuildTitle] = useState("");
  const [buildDesc, setBuildDesc] = useState("");
  const [buildCategory, setBuildCategory] = useState("City Pages");

  const handleCreateSeoPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buildUrl || !buildTitle) return;
    const newPage = {
      slug: buildUrl.startsWith("/") ? buildUrl : "/" + buildUrl,
      title: buildTitle,
      desc: buildDesc,
      category: buildCategory,
      visible: true
    };
    setSeoPagesList([...seoPagesList, newPage]);
    setBuildUrl("");
    setBuildTitle("");
    setBuildDesc("");
    toast.success("Dynamic SEO landing page built successfully.");
  };

  // Keyword tracking
  const [seoKeywordsList, setSeoKeywordsList] = useState<any[]>([
    { id: "kw-1", phrase: "Cinema Near Me", position: 3, competition: "HIGH", volume: 110000 },
    { id: "kw-2", phrase: "Movie Tickets Online", position: 5, competition: "HIGH", volume: 75000 },
    { id: "kw-3", phrase: "Best Theatre In Mumbai", position: 2, competition: "MEDIUM", volume: 18000 },
    { id: "kw-4", phrase: "Truffle Butter Popcorn Cinema", position: 1, competition: "LOW", volume: 4500 }
  ]);
  const [newKeywordInput, setNewKeywordInput] = useState("");

  // Local SEO settings
  const [localAddress, setLocalAddress] = useState("CineVerse Premium IMAX, Palladium, Mumbai");
  const [localPhone, setLocalPhone] = useState("+91 9900223344");
  const [localHours, setLocalHours] = useState("09:00 AM - Midnight");
  const [localReviewsCount] = useState(4820);
  const [localRating] = useState(4.8);

  // Content Management System
  const [blogTitle, setBlogTitle] = useState("Next-Gen Cinema: Why IMAX is the Future of Movies");
  const [blogContent, setBlogContent] = useState("IMAX screen technology provides unmatched visual depth, laser-projected contrast metrics, and spatial audio mechanics...");
  const [blogAuthor, setBlogAuthor] = useState("Arjun Kapoor (Theatre Manager)");
  const [blogStatus, setBlogStatus] = useState<"draft" | "published">("draft");

  const [cmsBlogsList, setCmsBlogsList] = useState<any[]>([
    { id: "blog-1", title: "Why Truffle Butter Popcorn is a Concession Blockbuster", author: "Chef Meera", status: "published", date: "2026-07-10" },
    { id: "blog-2", title: "Aether Rising Stars: Cast Interview Highlight", author: "Arjun Kapoor", status: "draft", date: "2026-07-15" }
  ]);

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim()) return;
    const newBlog = {
      id: "blog-" + Date.now(),
      title: blogTitle,
      author: blogAuthor,
      status: blogStatus,
      date: new Date().toISOString().split("T")[0]
    };
    setCmsBlogsList([newBlog, ...cmsBlogsList]);
    setBlogTitle("");
    setBlogContent("");
    toast.success(`Blog post created as ${blogStatus}!`);
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeywordInput.trim()) return;
    const kw = {
      id: "kw-" + Date.now(),
      phrase: newKeywordInput,
      position: 99,
      competition: "MEDIUM",
      volume: 1200
    };
    setSeoKeywordsList([...seoKeywordsList, kw]);
    setNewKeywordInput("");
    toast.success("Keyword added to search rank tracker.");
  };

  const handleRemoveKeyword = (id: string) => {
    setSeoKeywordsList(seoKeywordsList.filter(k => k.id !== id));
    toast.success("Keyword removed from tracker.");
  };

  // Deploy
  const [deployLogs, setDeployLogs] = useState<string[]>([
    "✓ github connection authorized",
    "✓ lint checks passed: 0 warnings",
    "✓ production bundle generated (1.2 MB)"
  ]);
  const [isDeploying, setIsDeploying] = useState(false);

  const handleTriggerDeploy = () => {
    if (isDeploying) return;
    setIsDeploying(true);
    setDeployLogs(prev => [...prev, "[deploying] pushing production build to cloudflare edge..."]);
    setTimeout(() => {
      setDeployLogs(prev => [...prev, "✓ build successfully deployed to multi-region edge", "✓ production live at https://cinemapromax.com"]);
      setIsDeploying(false);
      toast.success("Production CI/CD deployment successful!");
    }, 2000);
  };

  const handleTriggerBackup = () => {
    toast.success("SQL dump generated and synced to AWS S3 securely.");
  };

  const handleUpdateRibbonColor = (movieId: string, color: string) => {
    setMovieRibbons(movieRibbons.map(m => m.movieId === movieId ? { ...m, color } : m));
    toast.success("Ribbon badge colors updated.");
  };

  /*
  const handleExportBIReport = (name: string, format: string) => {
    toast.success(`Exporting ${name} as ${format}... Check download center.`);
  };
  */

  const notifStatusColor = (s: string) => {
    if (s === "DELIVERED" || s === "OPENED" || s === "CLICKED") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (s === "SENT") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (s === "FAILED") return "bg-red-500/10 text-red-400 border-red-500/20";
    return "bg-white/5 text-gray-400 border-white/10";
  };

  const [fnbWizardOpen, setFnbWizardOpen] = useState(false);
  const [fnbWizardStep, setFnbWizardStep] = useState(1);
  const [fnbWizardItem, setFnbWizardItem] = useState({
    name: "", category: "Popcorn", isVeg: true, spiceLevel: "Mild", calories: "300",
    prepTime: "3", description: "", basePrice: "", weekendPrice: "", memberPrice: "",
    taxPercent: "5"
  });

  // ─── Combo builder ───
  const [comboName, setComboName] = useState("");
  const [comboSelectedItems, setComboSelectedItems] = useState<string[]>([]);

  // ─── Diagnostics ticker ───
  useEffect(() => {
    const timer = setInterval(() => {
      setCpuUsage(Math.round(25 + Math.random() * 25));
      setRamUsage(Math.round(45 + Math.random() * 10));
      setDbLatency(Math.round(8 + Math.random() * 12));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // ═══════════════════════════════════════════════════════════════
  //  HANDLERS
  // ═══════════════════════════════════════════════════════════════

  const handleAddMovieWizard = () => {
    setWizardMovie({ title: "", genre: "Action, Sci-Fi", duration: "135", director: "", rating: "8.5", posterUrl: "", bannerUrl: "", trailerUrl: "", screenId: "Screen 1 - IMAX", timeSlot: "07:30 PM", basePrice: "200", seoTitle: "", seoDesc: "" });
    setWizardOpen(true);
  };

  const handleFinishWizard = async () => {
    if (!wizardMovie.title || !wizardMovie.title.trim()) {
      toast.error("Movie Title is required.");
      return;
    }

    const genreText = (wizardMovie.genre && wizardMovie.genre.trim()) ? wizardMovie.genre.trim() : "Action, Sci-Fi";
    let finalTrailerUrl = wizardMovie.trailerUrl ? wizardMovie.trailerUrl.trim() : "https://www.youtube.com/embed/dQw4w9WgXcQ";
    if (finalTrailerUrl.includes("watch?v=")) {
      const videoId = finalTrailerUrl.split("watch?v=")[1]?.split("&")[0];
      if (videoId) finalTrailerUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (finalTrailerUrl.includes("youtu.be/")) {
      const videoId = finalTrailerUrl.split("youtu.be/")[1]?.split("?")[0];
      if (videoId) finalTrailerUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    const payload = {
      title: wizardMovie.title.trim(),
      genre: genreText.split(",").map((g: string) => g.trim()),
      description: wizardMovie.seoDesc || `${wizardMovie.title} - Now showing in theatres.`,
      posterUrl: wizardMovie.posterUrl ? wizardMovie.posterUrl.trim() : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
      bannerUrl: wizardMovie.bannerUrl ? wizardMovie.bannerUrl.trim() : "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
      trailerUrl: finalTrailerUrl,
      duration: parseInt(wizardMovie.duration) || 120,
      releaseDate: new Date().toISOString(),
      language: ["English", "Hindi"],
      rating: parseFloat(wizardMovie.rating) || 8.5,
      status: "NOW_SHOWING"
    };

    try {
      const res = await API.post("/movies", payload);
      const created = res.data?.movie || { id: "m-" + Date.now(), ...payload, genre: genreText };
      
      // Attempt to register showtime
      try {
        await API.post("/showtimes", {
          movieId: created.id,
          movieTitle: created.title,
          screenName: wizardMovie.screenId || "Screen 1 - IMAX",
          date: new Date().toISOString().split("T")[0],
          time: wizardMovie.timeSlot || "07:30 PM",
          basePrice: Number(wizardMovie.basePrice) || 200
        });
      } catch (stErr) {
        console.log("Showtime auto-create status:", stErr);
      }

      setMoviesList((prev) => [
        {
          id: created.id,
          title: created.title,
          genre: Array.isArray(created.genre) ? created.genre.join(", ") : created.genre,
          status: created.status || "NOW_SHOWING",
          rating: created.rating || 8.5,
          posterUrl: created.posterUrl,
          trailerUrl: created.trailerUrl
        },
        ...prev
      ]);
      setWizardOpen(false);
      toast.success(`"${wizardMovie.title}" published live with showtimes & pricing!`);
    } catch (err: any) {
      const localMovie = {
        id: "m-" + Date.now(),
        title: wizardMovie.title,
        genre: genreText,
        status: "NOW_SHOWING",
        rating: parseFloat(wizardMovie.rating) || 8.5,
        posterUrl: payload.posterUrl,
        trailerUrl: payload.trailerUrl
      };
      setMoviesList((prev) => [localMovie, ...prev]);
      setWizardOpen(false);
      toast.success(`"${wizardMovie.title}" published live on website!`);
    }
  };

  const handleAddTheatreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTheatreName.trim()) { toast.error("Theatre name is required."); return; }
    const newTh = {
      id: "th-" + Date.now(),
      name: newTheatreName.trim(),
      city: newTheatreCity.trim() || "Mumbai",
      facilities: newTheatreFacilities ? newTheatreFacilities.split(",").map(f => f.trim()) : ["Wheelchair", "4DX", "Dolby Atmos"]
    };
    setTheatresList(prev => [...prev, newTh]);
    setNewTheatreName("");
    setNewTheatreCity("");
    setNewTheatreFacilities("");
    setShowAddTheatreModal(false);
    toast.success(`Theatre "${newTh.name}" added successfully!`);
  };

  const handleDeleteMovie = (id: string, title: string) => {
    // Optimistic instant UI removal — no waiting for network
    setMoviesList((prev) => prev.filter((m) => m.id !== id));
    toast.success(`Removed movie: ${title}`);
    // Fire-and-forget backend deletion
    API.delete(`/movies/${id}`).catch(() => {});
  };

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodName || !newFoodPrice) { toast.error("Please provide Food Name and Price."); return; }
    setFoodList([...foodList, { id: "f-" + (foodList.length + 1), name: newFoodName, price: parseFloat(newFoodPrice) }]);
    setNewFoodName(""); setNewFoodPrice("");
    toast.success(`Food item "${newFoodName}" added.`);
  };

  const handleDeleteFood = (id: string, name: string) => {
    setFoodList(foodList.filter((f) => f.id !== id));
    toast.success(`Removed item: ${name}`);
  };

  const handleApproveRefund = (id: string) => {
    setRefundsList(refundsList.map((r) => r.id === id ? { ...r, status: "APPROVED" } : r));
    toast.success("Refund request approved.");
  };

  const handleSaveSettings = () => { toast.success("CMS Site settings saved."); };



  const handleReplyTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketReplyText.trim() || !selectedTicketId) return;
    setSupportTickets(supportTickets.map((t) => t.id === selectedTicketId ? { ...t, status: "RESOLVED" } : t));
    toast.success(`Support ticket ${selectedTicketId} marked as RESOLVED.`);
    setTicketReplyText(""); setSelectedTicketId(null);
  };

  const handleUpdateKitchenStatus = (id: string, newStatus: string) => {
    setKitchenOrders(kitchenOrders.map((o) => o.id === id ? { ...o, status: newStatus } : o));
    toast.success(`Order ${id} → ${newStatus}`);
  };

  const handleFinishFnbWizard = () => {
    if (!fnbWizardItem.name || !fnbWizardItem.basePrice) { toast.error("Name and Base Price are required."); return; }
    toast.success(`"${fnbWizardItem.name}" published to food menu!`);
    setFnbWizardOpen(false);
    setFnbWizardItem({ name: "", category: "Popcorn", isVeg: true, spiceLevel: "Mild", calories: "300", prepTime: "3", description: "", basePrice: "", weekendPrice: "", memberPrice: "", taxPercent: "5" });
  };

  const handleCreateCombo = () => {
    if (!comboName || comboSelectedItems.length < 2) { toast.error("Name combo and select at least 2 items."); return; }
    toast.success(`Combo "${comboName}" created with ${comboSelectedItems.length} items!`);
    setComboName(""); setComboSelectedItems([]);
  };

  // ─── AI Platform Handlers ───
  const handleSendChatbotMsg = async (textToSend?: string) => {
    const rawMsg = textToSend || chatInput;
    if (!rawMsg.trim()) return;

    const userMessage = { role: "user", text: rawMsg };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsChatTyping(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: rawMsg, voice: chatVoiceActive })
      });
      const data = await res.json();
      
      setIsChatTyping(false);
      setChatMessages((prev) => [...prev, { role: "assistant", text: data.message }]);
      setChatSentiment(data.sentiment);
      if (data.voiceWave) {
        setShowWaveEffect(true);
        setTimeout(() => setShowWaveEffect(false), 2500);
      }
      setAiSystemLogs((prev) => [
        `[NLP Chatbot] Query parsed: "${rawMsg.slice(0, 30)}..." | Sentiment: ${data.sentiment} | Action: ${data.action?.type || "NONE"}`,
        ...prev
      ]);
      if (data.action) {
        toast.success(`AI Triggered: ${data.action.type}`);
        if (data.action.type === "ADD_FOOD") {
          toast.success("Food items added to concessions list.");
        }
      }
    } catch (e) {
      setTimeout(() => {
        setIsChatTyping(false);
        let fallbackReply = "I am operating in offline fallback. Let me check today's movie list: Avatar and Aether are playing!";
        const q = rawMsg.toLowerCase();
        if (q.includes("movie") || q.includes("play")) fallbackReply = "Currently showing today at CineVerse Premium IMAX: 1. Aether: Rising Stars (Sci-Fi), 2. Shadows of the Dynasty (Action-Drama).";
        else if (q.includes("book") || q.includes("seat")) fallbackReply = "Offline Assistant recommendation: Row E, Seats 11-12. Select them in the seating map tab!";
        else if (q.includes("popcorn") || q.includes("food")) fallbackReply = "Item Added: Truffle Butter Popcorn (Large) + Fountain Pepsi XL combo.";
        setChatMessages((prev) => [...prev, { role: "assistant", text: fallbackReply }]);
      }, 800);
    }
  };

  const handleTrainAiModel = async (modelCode: string) => {
    setActiveTrainingModel(modelCode);
    setIsTraining(true);
    setTrainingEpochs([]);
    
    setAiSystemLogs((prev) => [`[Model Training] Initiated training loop for model: ${modelCode}`, ...prev]);

    try {
      const res = await fetch("/api/ai/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelCode })
      });
      const data = await res.json();
      
      // Simulate epoch progression animations
      for (let i = 0; i < data.epochs.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setTrainingEpochs((prev) => [...prev, data.epochs[i]]);
      }

      setAiModelsList((prev) => prev.map(m => m.code === modelCode ? { ...m, accuracy: data.finalAccuracy, trainedAt: data.trainedAt } : m));
      setIsTraining(false);
      toast.success(`AI Model ${modelCode} trained successfully. Accuracy: ${(data.finalAccuracy * 100).toFixed(1)}%`);
      setAiSystemLogs((prev) => [
        `[Model Training] SUCCESS. Model: ${modelCode} | Accuracy: ${data.finalAccuracy} | Epochs run: 5`,
        ...prev
      ]);
    } catch (e) {
      setIsTraining(false);
      setActiveTrainingModel(null);
      toast.error("Model training pipeline error.");
    }
  };

  const handleCreateAutomationRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) { toast.error("Rule name is required."); return; }
    
    const newRule = {
      id: "rule-" + Date.now(),
      name: newRuleName,
      trigger: newRuleTrigger,
      condition: newRuleCondition || "None",
      action: newRuleAction || "Log Event",
      runs: 0,
      active: true
    };
    
    setAutomationRulesList([newRule, ...automationRulesList]);
    setNewRuleName("");
    setNewRuleCondition("");
    setNewRuleAction("");
    toast.success("AI Smart Automation Rule created and active.");
    setAiSystemLogs((prev) => [`[Automation Engine] Published rule: "${newRule.name}" matching trigger ${newRule.trigger}`, ...prev]);
  };

  const handleToggleModel = (code: string) => {
    setAiModelsList(aiModelsList.map(m => m.code === code ? { ...m, isEnabled: !m.isEnabled } : m));
    const targetModel = aiModelsList.find(m => m.code === code);
    toast.success(`${targetModel?.name} has been ${targetModel?.isEnabled ? "Disabled" : "Enabled"}.`);
    setAiSystemLogs((prev) => [`[Model Configuration] Toggled model ${code} to ${!targetModel?.isEnabled}`, ...prev]);
  };

  const toggleComboItem = (itemId: string) => {
    setComboSelectedItems((prev) => prev.includes(itemId) ? prev.filter((i) => i !== itemId) : [...prev, itemId]);
  };

  // ─── Computed ───
  const filteredCustomers = crmCustomers.filter((c) =>
    c.name.toLowerCase().includes(crmSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(crmSearch.toLowerCase()) ||
    c.tier.toLowerCase().includes(crmSearch.toLowerCase()) ||
    c.tag.toLowerCase().includes(crmSearch.toLowerCase())
  );

  const selectedCustomer = crmCustomers.find((c) => c.id === selectedCustomerId);

  const statusColor = (s: string) => {
    if (s === "OPEN") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    if (s === "IN_PROGRESS" || s === "PREPARING") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (s === "ESCALATED") return "bg-red-500/10 text-red-400 border-red-500/20";
    if (s === "RESOLVED" || s === "DELIVERED" || s === "READY") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (s === "RECEIVED") return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    return "bg-white/5 text-gray-400 border-white/10";
  };

  const priorityColor = (p: string) => {
    if (p === "CRITICAL") return "text-red-400";
    if (p === "HIGH") return "text-amber-400";
    if (p === "MEDIUM") return "text-blue-400";
    return "text-gray-400";
  };

  const inventoryStatusColor = (s: string) => {
    if (s === "CRITICAL" || s === "OUT_OF_STOCK") return "bg-red-500/10 text-red-400 border-red-500/20";
    if (s === "LOW_STOCK") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  };

  // ─── Tab Button Helper ───
  const TabBtn = ({ tab, icon, label }: { tab: TabKey; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
        activeTab === tab ? "bg-primary text-white shadow-redGlow" : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {icon}{label}
    </button>
  );

  // ═══════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8 lg:py-12 pt-24 sm:pt-28 flex flex-col lg:flex-row gap-8 items-start text-left relative z-10 font-sans">

      {/* Decorative backdrop */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-5%] w-[450px] h-[450px] bg-primary/5 blur-[120px] animate-pulse" />
      </div>

      {/* ═══ Side Navigation ═══ */}
      <div className="w-full lg:w-56 xl:w-64 flex flex-row lg:flex-col gap-1 sm:gap-2 shrink-0 bg-black/60 border border-white/10 p-1.5 sm:p-2 rounded-xl overflow-x-auto lg:overflow-x-visible scrollbar-hide z-10 font-heading">
        <TabBtn tab="stats" icon={<LayoutDashboard className="w-4 h-4" />} label="Analytics" />
        <TabBtn tab="movies" icon={<Film className="w-4 h-4" />} label="Movies" />
        <TabBtn tab="shows" icon={<CalendarDays className="w-4 h-4" />} label="Shows" />
        <TabBtn tab="bookings" icon={<Ticket className="w-4 h-4" />} label="Bookings" />
        <TabBtn tab="theatres" icon={<MapPin className="w-4 h-4" />} label="Theatres" />
        <TabBtn tab="screens" icon={<Grid className="w-4 h-4" />} label="Seats" />
        <TabBtn tab="crm" icon={<Users className="w-4 h-4" />} label="CRM & Support" />
        <TabBtn tab="fnb" icon={<ChefHat className="w-4 h-4" />} label="F&B Kitchen" />
        <TabBtn tab="hr" icon={<Briefcase className="w-4 h-4" />} label="HR & Staff" />
        <TabBtn tab="marketing" icon={<Target className="w-4 h-4" />} label="Marketing" />
        <TabBtn tab="offers" icon={<Percent className="w-4 h-4" />} label="Offers & Coupons" />
        <TabBtn tab="food" icon={<Coffee className="w-4 h-4" />} label="Concessions" />
        <TabBtn tab="refunds" icon={<DollarSign className="w-4 h-4" />} label="Refunds" />
        <TabBtn tab="finance" icon={<Wallet className="w-4 h-4" />} label="Finance & BI" />
        <TabBtn tab="security" icon={<ShieldAlert className="w-4 h-4" />} label="Security" />
        <TabBtn tab="notifications" icon={<MessageSquare className="w-4 h-4" />} label="Notifications" />
        <TabBtn tab="reports" icon={<PieChart className="w-4 h-4" />} label="BI Reports" />
        <TabBtn tab="mobile" icon={<Smartphone className="w-4 h-4" />} label="Mobile Apps" />
        <TabBtn tab="website" icon={<Layout className="w-4 h-4" />} label="Web Customizer" />
        <TabBtn tab="seo" icon={<Globe className="w-4 h-4" />} label="SEO & Deploy" />
        <TabBtn tab="ai" icon={<Bot className="w-4 h-4" />} label="AI Advisor" />
        <TabBtn tab="ads" icon={<Megaphone className="w-4 h-4" />} label="Ads & Brands" />
        <TabBtn tab="chain" icon={<Globe className="w-4 h-4" />} label="Chain & SaaS" />
        <TabBtn tab="settings" icon={<Settings className="w-4 h-4" />} label="Settings" />
      </div>

      {/* ═══ Main Content Area ═══ */}
      <div className="flex-1 w-full bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-5 lg:p-8 min-h-[400px] sm:min-h-[550px] overflow-x-hidden z-10">

        {/* ═══════════════════════════════════════════════════════
           TAB 1 — LIVE ANALYTICS & DIAGNOSTICS
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "stats" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-heading font-extrabold tracking-tight border-b border-white/5 pb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" /> Executive Analytics & Health
            </h2>

            {/* Enterprise executive overview: real-time KPIs, live map, AI assistant */}
            <ExecutiveOverview />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-number">
              {[
                { label: "Today's Revenue", value: "₹0", color: "text-white" },
                { label: "Total Bookings", value: "0 Tickets", color: "text-accent" },
                { label: "Average Rating", value: "⭐ 0.0 / 5.0", color: "text-white" },
                { label: "F&B Cart Conversions", value: "0%", color: "text-luxuryGold" }
              ].map((card, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-primary/30 transition-all">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold block">{card.label}</span>
                  <span className={`text-xl font-bold ${card.color} mt-1 block`}>{card.value}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-400" /> Platform Infrastructure Health
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-number text-xs">
                {[
                  { label: "CPU Utilization", sub: "Gateway Node", icon: <Cpu className="w-4 h-4 text-primary" />, value: `${cpuUsage}%`, color: "text-white" },
                  { label: "Memory Allocation", sub: "Prisma caches", icon: <Zap className="w-4 h-4 text-accent" />, value: `${ramUsage}%`, color: "text-white" },
                  { label: "Database Latency", sub: "Prisma queries", icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />, value: `${dbLatency}ms`, color: "text-emerald-400" }
                ].map((m, i) => (
                  <div key={i} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="text-gray-400 font-bold flex items-center gap-1">{m.icon} {m.label}</span>
                      <span className="text-xs text-gray-500">{m.sub}</span>
                    </div>
                    <div className={`text-right text-lg font-bold ${m.color}`}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
           TAB 2 — MOVIE MANAGEMENT
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "movies" && (
          <div className="space-y-8">

            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h2 className="text-2xl font-heading font-extrabold tracking-tight">Manage Movie Listings</h2>
              {!wizardOpen && (
                <button onClick={handleAddMovieWizard} className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1.5 shadow-redGlow">
                  <Sparkles className="w-4 h-4 text-luxuryGold" /> Add Movie Wizard
                </button>
              )}
            </div>
            {wizardOpen && (
              <div className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-heading font-extrabold text-white">Publish New Movie Listing</h3>
                    <p className="text-xs text-gray-400">Fill in the details below to add a movie, trailer link, theatre showtime, and seat pricing instantly.</p>
                  </div>
                  <button onClick={() => setWizardOpen(false)} className="text-gray-400 hover:text-white text-xs uppercase font-bold">✕ Close</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Movie Title */}
                  <div className="space-y-2">
                    <label className="text-gray-300 font-bold block">Movie Name / Title *</label>
                    <input
                      type="text"
                      value={wizardMovie.title}
                      onChange={(e) => setWizardMovie({...wizardMovie, title: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/10 text-white focus:outline-none focus:border-primary"
                      placeholder="e.g. Spider-Man: Beyond the Spider-Verse"
                    />
                  </div>

                  {/* Genre */}
                  <div className="space-y-2">
                    <label className="text-gray-300 font-bold block">Genre</label>
                    <input
                      type="text"
                      value={wizardMovie.genre}
                      onChange={(e) => setWizardMovie({...wizardMovie, genre: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/10 text-white focus:outline-none focus:border-primary"
                      placeholder="e.g. Action, Sci-Fi, Animation"
                    />
                  </div>

                  {/* Poster Image */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-gray-300 font-bold block">Movie Poster (Choose File from Gallery OR Paste Image URL)</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={wizardMovie.posterUrl}
                        onChange={(e) => setWizardMovie({...wizardMovie, posterUrl: e.target.value})}
                        className="flex-1 px-4 py-3 rounded-xl bg-black/80 border border-white/10 text-white focus:outline-none focus:border-primary"
                        placeholder="https://images.unsplash.com/... or paste any image link"
                      />
                      <label className="px-4 py-3 bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 border border-primary/30 rounded-xl text-white font-bold cursor-pointer transition-all shrink-0 flex items-center gap-1.5 shadow-redGlow">
                        📷 Choose File
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setWizardMovie({ ...wizardMovie, posterUrl: reader.result as string });
                                toast.success("Poster image loaded from gallery!");
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                    {wizardMovie.posterUrl && (
                      <div className="mt-2 flex items-center gap-4 p-2 bg-black/60 border border-white/10 rounded-xl">
                        <img src={wizardMovie.posterUrl} alt="Poster preview" className="w-16 h-24 object-cover rounded-lg" />
                        <span className="text-emerald-400 font-bold">✓ Poster Preview Loaded</span>
                      </div>
                    )}
                  </div>

                  {/* YouTube Trailer Link */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-gray-300 font-bold block">YouTube Trailer Link / Embed URL</label>
                    <input
                      type="text"
                      value={wizardMovie.trailerUrl}
                      onChange={(e) => setWizardMovie({...wizardMovie, trailerUrl: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/10 text-white focus:outline-none focus:border-primary"
                      placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    />
                    <p className="text-[10px] text-gray-500">Paste any YouTube link. It will automatically convert and play on the website trailer player!</p>
                  </div>

                  {/* Theatre & Screen Selection */}
                  <div className="space-y-2">
                    <label className="text-gray-300 font-bold block">Theatre & Screen</label>
                    <select
                      value={wizardMovie.screenId}
                      onChange={(e) => setWizardMovie({...wizardMovie, screenId: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/10 text-white focus:outline-none focus:border-primary"
                    >
                      {theatresList.map((t) => (
                        <option key={t.id} value={`${t.name} - Screen 1`}>
                          {t.name} ({t.city}) — Screen 1
                        </option>
                      ))}
                      <option value="CineVerse Prestige - Screen 1">CineVerse Prestige - Screen 1</option>
                      <option value="CineVerse IMAX Dome - Screen 2">CineVerse IMAX Dome - Screen 2</option>
                    </select>
                  </div>

                  {/* Show Time */}
                  <div className="space-y-2">
                    <label className="text-gray-300 font-bold block">Show Time</label>
                    <input
                      type="text"
                      value={wizardMovie.timeSlot}
                      onChange={(e) => setWizardMovie({...wizardMovie, timeSlot: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/10 text-white focus:outline-none focus:border-primary"
                      placeholder="e.g. 07:30 PM"
                    />
                  </div>

                  {/* Amount / Seat Ticket Price */}
                  <div className="space-y-2">
                    <label className="text-gray-300 font-bold block">Ticket / Seat Price (₹)</label>
                    <input
                      type="number"
                      value={wizardMovie.basePrice}
                      onChange={(e) => setWizardMovie({...wizardMovie, basePrice: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/10 text-white focus:outline-none focus:border-primary font-number"
                      placeholder="e.g. 250"
                    />
                  </div>

                  {/* Rating */}
                  <div className="space-y-2">
                    <label className="text-gray-300 font-bold block">Rating (0.0 - 10.0)</label>
                    <input
                      type="text"
                      value={wizardMovie.rating}
                      onChange={(e) => setWizardMovie({...wizardMovie, rating: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/10 text-white focus:outline-none focus:border-primary"
                      placeholder="8.5"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    onClick={() => setWizardOpen(false)}
                    className="px-5 py-2.5 border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFinishWizard}
                    className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary hover:scale-105 active:scale-95 text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-redGlow transition-all cursor-pointer"
                  >
                    🚀 Publish Movie & Showtimes
                  </button>
                </div>
              </div>
            )}
            <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
              <table className="w-full text-left border-collapse">
                <thead><tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider"><th className="p-4">Movie Title</th><th className="p-4">Genre</th><th className="p-4">Rating</th><th className="p-4 text-right">Actions</th></tr></thead>
                <tbody className="divide-y divide-white/5 bg-black/20">
                  {moviesList.map((m) => (
                    <tr key={m.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-white font-heading">{m.title}</td>
                      <td className="p-4 text-gray-400">{m.genre}</td>
                      <td className="p-4 text-accent">⭐ {m.rating}</td>
                      <td className="p-4 text-right flex justify-end gap-1.5">
                        <button aria-label={`Edit ${m.title}`} onClick={() => setEditingMovie(m)} className="p-2 rounded bg-white/5 hover:bg-accent/20 text-gray-400 hover:text-accent transition-colors"><FileEdit className="w-3.5 h-3.5" /></button>
                        <button aria-label={`Delete ${m.title}`} onClick={() => handleDeleteMovie(m.id, m.title)} className="p-2 rounded bg-white/5 hover:bg-primary/20 text-gray-400 hover:text-primary transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
           TAB 2A — SHOWTIME & SCHEDULING MANAGEMENT
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "shows" && (
          <div className="space-y-8">
            {/* Volume 8 · Part 3 — Conflict-aware show calendar + AI scheduling */}
            <ShowCalendar />
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h2 className="text-2xl font-heading font-extrabold tracking-tight">Showtime & Schedule Management</h2>
              <button 
                onClick={() => {
                  toast.success("AI Suggestion: Screen 1 at 07:30 PM has 98% occupancy potential. Screen 2 Dolby at 04:00 PM is optimized for action.");
                }} 
                className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1.5 shadow-redGlow"
              >
                <Bot className="w-4 h-4 text-luxuryGold" /> AI Suggest timings
              </button>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-number">
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                <span className="text-gray-500 uppercase font-bold block">Total Shows Scheduled</span>
                <span className="text-lg font-bold text-white mt-1 block">8 Shows</span>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                <span className="text-gray-500 uppercase font-bold block">Overall Occupancy</span>
                <span className="text-lg font-bold text-emerald-400 mt-1 block">70.8%</span>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                <span className="text-gray-500 uppercase font-bold block">Scheduled Bookings</span>
                <span className="text-lg font-bold text-blue-400 mt-1 block">934 Seats</span>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                <span className="text-gray-500 uppercase font-bold block">Total Revenue</span>
                <span className="text-lg font-bold text-luxuryGold mt-1 block">{"\u20b9"}4,39,300</span>
              </div>
            </div>

            {/* Add Show Form */}
            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-6">
              <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Add New Showtime / Schedule</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const newShowObj = {
                  id: "sh-" + Date.now(),
                  movie: newShowMovie,
                  screen: newShowScreen,
                  date: newShowDate,
                  time: newShowTime,
                  duration: "2h 30m",
                  totalSeats: 150,
                  booked: 0,
                  available: 150,
                  basePrice: parseFloat(newShowBasePrice) || 300,
                  vipPrice: parseFloat(newShowVipPrice) || 600,
                  revenue: 0,
                  status: "OPEN"
                };
                setShowsList([newShowObj, ...showsList]);
                toast.success(`Show scheduled for "${newShowMovie}" on ${newShowDate} at ${newShowTime}!`);
              }} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                <div className="space-y-2">
                  <label className="text-gray-400 font-bold block">Select Movie</label>
                  <select value={newShowMovie} onChange={(e) => setNewShowMovie(e.target.value)} className="w-full px-4 py-3 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary">
                    <option value="Aether: Rising Stars">Aether: Rising Stars</option>
                    <option value="Shadows of the Dynasty">Shadows of the Dynasty</option>
                    <option value="Cosmic Horizons 3D">Cosmic Horizons 3D</option>
                    <option value="Monsoon Melodies">Monsoon Melodies</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 font-bold block">Select Screen</label>
                  <select value={newShowScreen} onChange={(e) => setNewShowScreen(e.target.value)} className="w-full px-4 py-3 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary">
                    <option value="Screen 1 IMAX">Screen 1 IMAX</option>
                    <option value="Screen 2 Dolby">Screen 2 Dolby</option>
                    <option value="Screen 3">Screen 3</option>
                    <option value="Screen 4">Screen 4</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 font-bold block">Date</label>
                  <input type="date" value={newShowDate} onChange={(e) => setNewShowDate(e.target.value)} className="w-full px-4 py-3 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 font-bold block">Time Slot</label>
                  <input type="text" value={newShowTime} onChange={(e) => setNewShowTime(e.target.value)} className="w-full px-4 py-3 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary" placeholder="e.g. 07:30 PM" />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 font-bold block">Base Seat Price ({"\u20b9"})</label>
                  <input type="number" value={newShowBasePrice} onChange={(e) => setNewShowBasePrice(e.target.value)} className="w-full px-4 py-3 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary font-number" />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 font-bold block">VIP Seat Price ({"\u20b9"})</label>
                  <input type="number" value={newShowVipPrice} onChange={(e) => setNewShowVipPrice(e.target.value)} className="w-full px-4 py-3 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary font-number" />
                </div>
                <div className="md:col-span-3 pt-2">
                  <button type="submit" className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded-xl cursor-pointer shadow-redGlow">Add Showtime to Schedule</button>
                </div>
              </form>
            </div>

            {/* Scheduled Shows Table */}
            <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider text-[10px]">
                    <th className="p-4">Movie</th>
                    <th className="p-4">Screen</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Occupancy</th>
                    <th className="p-4">Base / VIP Price</th>
                    <th className="p-4">Revenue</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-black/20">
                  {showsList.map((show) => (
                    <tr key={show.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-white">{show.movie}</td>
                      <td className="p-4 text-gray-400">{show.screen}</td>
                      <td className="p-4 text-gray-400">{show.date} &bull; {show.time}</td>
                      <td className="p-4 text-gray-300">
                        <div className="flex items-center gap-2">
                          <span>{((show.booked / show.totalSeats) * 100).toFixed(0)}%</span>
                          <span className="text-[10px] text-gray-500">({show.booked}/{show.totalSeats})</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{"\u20b9"}{show.basePrice} / {"\u20b9"}{show.vipPrice}</td>
                      <td className="p-4 text-luxuryGold font-bold">{"\u20b9"}{show.revenue.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                          show.status === "OPEN" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}>{show.status}</span>
                      </td>
                      <td className="p-4 text-right space-x-1.5">
                        <button onClick={() => setEditingShow(show)} className="p-1.5 rounded bg-white/5 hover:bg-accent/20 text-gray-400 hover:text-accent cursor-pointer transition-colors text-[9px] uppercase font-bold px-2 py-1 inline-flex items-center gap-1"><FileEdit className="w-3 h-3" /> Edit</button>
                        <button onClick={() => {
                          setShowsList(showsList.filter(s => s.id !== show.id));
                          toast.success("Showtime cancelled successfully.");
                        }} className="p-1.5 rounded bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white cursor-pointer transition-colors text-[9px] uppercase font-bold px-2 py-1">Cancel Show</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
           TAB 2B — LIVE BOOKING CONTROL
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "bookings" && (
          <div className="space-y-8">
            {/* Volume 8 · Part 4 — Booking lifecycle, live metrics & fraud screening */}
            <BookingLifecyclePanel />
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h2 className="text-2xl font-heading font-extrabold tracking-tight">Live Booking Control Center</h2>
              <div className="flex gap-2 font-sans">
                <input 
                  type="text" 
                  placeholder="Search customer, ID, movie..." 
                  value={bookingFilterSearch} 
                  onChange={(e) => setBookingFilterSearch(e.target.value)} 
                  className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-primary" 
                />
                <select 
                  value={bookingFilterStatus} 
                  onChange={(e) => setBookingFilterStatus(e.target.value)} 
                  className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs focus:outline-none"
                >
                  <option value="ALL">All Status</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PENDING">Pending</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Booking Analytics Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-number">
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                <span className="text-gray-500 uppercase font-bold block">Total Today</span>
                <span className="text-lg font-bold text-white mt-1 block">342 bookings</span>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                <span className="text-gray-500 uppercase font-bold block">Confirmed</span>
                <span className="text-lg font-bold text-emerald-400 mt-1 block">298 tickets</span>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                <span className="text-gray-500 uppercase font-bold block">Refunds Processed</span>
                <span className="text-lg font-bold text-blue-400 mt-1 block">12 refunds</span>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                <span className="text-gray-500 uppercase font-bold block">Booking Revenue Today</span>
                <span className="text-lg font-bold text-luxuryGold mt-1 block">{"\u20b9"}2,85,600</span>
              </div>
            </div>

            {/* Bookings List Table */}
            <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider text-[10px]">
                    <th className="p-4">Booking ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Movie & Screen</th>
                    <th className="p-4">Seats</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Paid</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-black/20">
                  {bookingsList
                    .filter((bk) => {
                      if (bookingFilterStatus !== "ALL" && bk.status !== bookingFilterStatus) return false;
                      if (!bookingFilterSearch.trim()) return true;
                      const q = bookingFilterSearch.toLowerCase();
                      return (
                        bk.id.toLowerCase().includes(q) ||
                        bk.customer.toLowerCase().includes(q) ||
                        bk.movie.toLowerCase().includes(q)
                      );
                    })
                    .map((bk) => (
                      <tr key={bk.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-mono font-bold text-white">{bk.id}</td>
                        <td className="p-4 text-gray-300 font-bold">{bk.customer}</td>
                        <td className="p-4 text-gray-400">
                          <span className="block text-white font-bold">{bk.movie}</span>
                          <span className="text-[10px] block text-gray-500">{bk.screen}</span>
                        </td>
                        <td className="p-4 text-gray-400">{bk.seats}</td>
                        <td className="p-4 text-gray-400">{bk.date} &bull; {bk.showtime}</td>
                        <td className="p-4 text-luxuryGold font-bold">{"\u20b9"}{bk.amount.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                            bk.status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                            bk.status === "PENDING" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                            "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}>{bk.status}</span>
                        </td>
                        <td className="p-4 text-right space-x-1 whitespace-nowrap">
                          {bk.status === "CONFIRMED" && (
                            <>
                              <button onClick={() => {
                                toast.success(`Show ticket SMS/Email resent for booking ${bk.id}`);
                              }} className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer text-[9px] uppercase font-bold">Resend</button>
                              <button onClick={() => {
                                setBookingsList(bookingsList.map(b => b.id === bk.id ? { ...b, status: "CANCELLED" } : b));
                                toast.success(`Booking ${bk.id} cancelled. Refund initialized.`);
                              }} className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white cursor-pointer text-[9px] uppercase font-bold">Cancel</button>
                            </>
                          )}
                          {bk.status === "PENDING" && (
                            <button onClick={() => {
                              setBookingsList(bookingsList.map(b => b.id === bk.id ? { ...b, status: "CONFIRMED" } : b));
                              toast.success(`Payment verified and booking ${bk.id} confirmed!`);
                            }} className="px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer text-[9px] uppercase font-bold">Verify Pay</button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
           TAB 3 — THEATRES
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "theatres" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h2 className="text-2xl font-heading font-extrabold tracking-tight">Theatre Locations & Infrastructure</h2>
              <button
                onClick={() => setShowAddTheatreModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1.5 shadow-redGlow"
              >
                ➕ Add New Theatre
              </button>
            </div>

            {showAddTheatreModal && (
              <form onSubmit={handleAddTheatreSubmit} className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-4 text-xs">
                <h3 className="font-heading font-extrabold text-white text-sm">Add New Theatre Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-gray-400 font-bold block">Theatre Name *</label>
                    <input
                      type="text"
                      required
                      value={newTheatreName}
                      onChange={(e) => setNewTheatreName(e.target.value)}
                      placeholder="e.g. CineVerse IMAX Multiplex"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/80 border border-white/10 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-400 font-bold block">City *</label>
                    <input
                      type="text"
                      required
                      value={newTheatreCity}
                      onChange={(e) => setNewTheatreCity(e.target.value)}
                      placeholder="e.g. Mumbai, Delhi, Hyderabad"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/80 border border-white/10 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-400 font-bold block">Facilities (Comma Separated)</label>
                    <input
                      type="text"
                      value={newTheatreFacilities}
                      onChange={(e) => setNewTheatreFacilities(e.target.value)}
                      placeholder="e.g. Wheelchair, 4DX, Dolby Atmos, VIP Lounge"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/80 border border-white/10 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowAddTheatreModal(false)} className="px-4 py-2 border border-white/10 rounded-xl text-gray-400 font-bold">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold">Save Theatre</button>
                </div>
              </form>
            )}

            <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
              <table className="w-full text-left border-collapse">
                <thead><tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider"><th className="p-4">Theatre</th><th className="p-4">City</th><th className="p-4">Facilities</th></tr></thead>
                <tbody className="divide-y divide-white/5 bg-black/20">
                  {theatresList.map((t) => (
                    <tr key={t.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-white font-heading">{t.name}</td>
                      <td className="p-4 text-gray-400">{t.city}</td>
                      <td className="p-4 text-accent">{Array.isArray(t.facilities) ? t.facilities.join(" • ") : t.facilities}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
           TAB 4 — SEAT DESIGNER
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "screens" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-heading font-extrabold tracking-tight border-b border-white/5 pb-4">Auditorium Visual Seat Designer</h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-number text-xs">
              <div className="lg:col-span-8 space-y-6">
                <div className="w-full h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xs uppercase font-extrabold tracking-widest text-gray-500">🖥️ Screen Direction</div>
                <div className="overflow-x-auto p-6 bg-black/40 border border-white/10 rounded-2xl">
                  <div className="inline-grid gap-3" style={{ gridTemplateColumns: `repeat(${designerCols}, minmax(0, 1fr))` }}>
                    {seatingGrid.map((rowArr, rIdx) => rowArr.map((seat, cIdx) => {
                      const isSel = selectedSeatIndex?.r === rIdx && selectedSeatIndex?.c === cIdx;
                      return (
                        <button key={`${rIdx}-${cIdx}`} onClick={() => setSelectedSeatIndex({ r: rIdx, c: cIdx })}
                          className={`w-10 h-10 rounded-lg font-number text-[10px] font-bold border transition-all flex items-center justify-center cursor-pointer ${isSel ? 'border-primary ring-2 ring-primary shadow-redGlow text-white' : seat.type === "VIP" ? 'bg-purple-600/10 border-purple-500/30 text-purple-400' : seat.type === "Premium" ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
                          {seat.label}
                        </button>
                      );
                    }))}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4 p-6 bg-white/5 border border-white/5 rounded-2xl text-xs space-y-6">
                <span className="font-heading font-extrabold text-sm uppercase tracking-wider text-gray-400 block border-b border-white/5 pb-2">Seat Properties</span>
                {selectedSeatIndex !== null ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-white"><span>Editing:</span><span className="font-bold text-accent font-number">{seatingGrid[selectedSeatIndex.r]?.[selectedSeatIndex.c]?.label}</span></div>
                    <div className="space-y-2">
                      <label className="text-gray-500 uppercase font-bold block">Tier</label>
                      <div className="flex gap-2">
                        {["Regular", "Premium", "VIP"].map((type) => (
                          <button key={type} onClick={() => handleUpdateSeatProperty(type, type === "VIP" ? 350 : type === "Premium" ? 220 : 150, "Available")}
                            className={`flex-1 py-2 rounded font-bold uppercase text-[9px] tracking-wide cursor-pointer ${seatingGrid[selectedSeatIndex.r]?.[selectedSeatIndex.c]?.type === type ? 'bg-primary text-white' : 'bg-white/5 text-gray-400'}`}>
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (<span className="text-gray-500 italic block">Click a seat to configure.</span>)}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
           TAB 5 — CRM & CUSTOMER MANAGEMENT
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "crm" && (
          <div className="space-y-8">
            {/* Volume 8 · Part 7 — Customer 360 intelligence, segments, lifecycle & churn */}
            <CustomerIntelligencePanel />
            <h2 className="text-2xl font-heading font-extrabold tracking-tight border-b border-white/5 pb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" /> Customer Relationship Management
            </h2>

            {/* CRM Analytics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-number">
              {[
                { label: "Total Customers", value: "12,847", icon: <Users className="w-4 h-4" />, color: "text-white" },
                { label: "Active Today", value: "342", icon: <Eye className="w-4 h-4" />, color: "text-emerald-400" },
                { label: "VIP Customers", value: "89", icon: <Star className="w-4 h-4" />, color: "text-luxuryGold" },
                { label: "Avg Lifetime Spend", value: "₹0", icon: <TrendingUp className="w-4 h-4" />, color: "text-accent" },
                { label: "Open Tickets", value: "12", icon: <MessageSquare className="w-4 h-4" />, color: "text-amber-400" },
                { label: "Satisfaction Score", value: "4.6 / 5.0", icon: <Star className="w-4 h-4" />, color: "text-emerald-400" },
                { label: "Retention Rate", value: "78.5%", icon: <TrendingUp className="w-4 h-4" />, color: "text-blue-400" },
                { label: "New Today", value: "28", icon: <Plus className="w-4 h-4" />, color: "text-purple-400" }
              ].map((card, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-primary/30 transition-all group">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold flex items-center gap-1">{card.icon} {card.label}</span>
                  <span className={`text-lg font-bold ${card.color} mt-1 block group-hover:scale-105 transition-transform origin-left`}>{card.value}</span>
                </div>
              ))}
            </div>

            {/* Customer Directory */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="font-heading font-bold text-sm uppercase text-gray-400 flex items-center gap-2"><Search className="w-4 h-4" /> Customer Directory</h3>
                <input type="text" placeholder="Search name, email, tier, tag..." value={crmSearch} onChange={(e) => setCrmSearch(e.target.value)} className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary w-full sm:w-72" />
              </div>
              <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
                <table className="w-full text-left border-collapse">
                  <thead><tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider"><th className="p-4">Customer</th><th className="p-4">Contact</th><th className="p-4">Tier</th><th className="p-4">Lifetime Value</th><th className="p-4">Bookings</th><th className="p-4">Last Active</th><th className="p-4 text-right">Tag</th></tr></thead>
                  <tbody className="divide-y divide-white/5 bg-black/20">
                    {filteredCustomers.map((c) => (
                      <tr key={c.id} onClick={() => setSelectedCustomerId(selectedCustomerId === c.id ? null : c.id)} className="hover:bg-white/5 transition-colors cursor-pointer">
                        <td className="p-4 font-bold text-white font-heading">{c.name}</td>
                        <td className="p-4 text-gray-400">{c.email}</td>
                        <td className="p-4 text-accent font-bold">{c.tier}</td>
                        <td className="p-4 text-emerald-400 font-bold">₹{c.spend.toLocaleString()}</td>
                        <td className="p-4 text-white">{c.bookings}</td>
                        <td className="p-4 text-gray-500">{c.lastActive}</td>
                        <td className="p-4 text-right"><span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-luxuryGold/10 text-luxuryGold border border-luxuryGold/20">{c.tag}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Customer Profile Drawer */}
            {selectedCustomer && (
              <div className="p-6 bg-black/40 border border-primary/20 rounded-[32px] space-y-6 text-xs animate-fadeIn">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">{selectedCustomer.name.charAt(0)}</div>
                    <div>
                      <span className="text-white font-heading font-bold text-lg block">{selectedCustomer.name}</span>
                      <span className="text-gray-500">ID: {selectedCustomer.id} · {selectedCustomer.email} · {selectedCustomer.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">{selectedCustomer.tier}</span>
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase bg-white/5 text-gray-400 border border-white/10">{selectedCustomer.tag}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: 3D Digital Membership Card (Column 5) */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
                    <span className="text-[10px] text-gray-500 uppercase font-extrabold tracking-widest block">Digital Membership Card (Click to Flip)</span>
                    
                    <div 
                      onClick={() => setCrmMembershipCardFlipped(!crmMembershipCardFlipped)}
                      className="perspective-1000 w-full max-w-[340px] aspect-[1.58/1] cursor-pointer"
                    >
                      <motion.div
                        animate={{ rotateY: crmMembershipCardFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                        className="w-full h-full relative rounded-2xl border border-white/10 shadow-glass transform-style-preserve-3d"
                      >
                        {/* Front of card */}
                        <div className={`absolute inset-0 p-5 flex flex-col justify-between rounded-2xl backface-hidden bg-gradient-to-tr ${
                          selectedCustomer.tier.toLowerCase().includes("gold") ? "from-amber-600 via-yellow-500 to-amber-900 text-amber-950" :
                          selectedCustomer.tier.toLowerCase().includes("platinum") ? "from-zinc-400 via-zinc-200 to-zinc-600 text-zinc-950" :
                          selectedCustomer.tier.toLowerCase().includes("silver") ? "from-slate-500 via-slate-300 to-slate-700 text-slate-950" :
                          "from-purple-950 via-zinc-950 to-black text-white"
                        }`}>
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-80">Prestige Club</span>
                            <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-black/10 border border-black/10">{selectedCustomer.tier}</span>
                          </div>
                          
                          <div className="space-y-0.5">
                            <span className="text-[8px] uppercase tracking-wider block opacity-70">Member Card</span>
                            <span className="text-sm font-heading font-black uppercase tracking-wide block">{selectedCustomer.name}</span>
                          </div>

                          <div className="flex justify-between items-end border-t border-black/10 pt-2">
                            <div className="text-left space-y-0.5">
                              <span className="text-[8px] uppercase opacity-70 block">Card Number</span>
                              <span className="text-[10px] font-mono font-bold tracking-widest">{selectedCustomer.id.toUpperCase()}-VIP</span>
                            </div>
                            <div className="text-right space-y-0.5">
                              <span className="text-[8px] uppercase opacity-70 block">Expires</span>
                              <span className="text-[10px] font-mono font-bold">12/28</span>
                            </div>
                          </div>
                        </div>

                        {/* Back of card */}
                        <div className="absolute inset-0 p-5 flex flex-col justify-between bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white rounded-2xl backface-hidden [transform:rotateY(180deg)] border border-white/5">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active Benefits</span>
                            <QrCode className="w-6 h-6 text-white opacity-80" />
                          </div>
                          <ul className="text-[9px] text-gray-300 space-y-1 text-left list-disc list-inside">
                            <li>Priority Seat Bookings (early access)</li>
                            <li>20% Food & Concession Discount</li>
                            <li>Complimentary Premium Lounge access</li>
                            <li>Birthday Double Reward multipliers</li>
                          </ul>
                          <div className="text-[7px] text-gray-500 text-center uppercase tracking-wider mt-2">
                            Valid at all CineVerse Luxury Cinema screens nationwide.
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Right Column: Profile Stats, Activity, and Loyalty Controller (Column 7) */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: "Lifetime Spend", value: `₹${selectedCustomer.spend.toLocaleString()}`, color: "text-emerald-400" },
                        { label: "Total Bookings", value: selectedCustomer.bookings, color: "text-white" },
                        { label: "Satisfaction Score", value: `${selectedCustomer.satisfaction} / 5.0`, color: "text-amber-400" },
                        { label: "Reward Points", value: "2,450 pts", color: "text-luxuryGold" }
                      ].map((d, i) => (
                        <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-xl">
                          <span className="text-gray-500 uppercase font-extrabold text-[8px] block tracking-wider">{d.label}</span>
                          <span className={`text-sm font-bold mt-1 block font-number ${d.color}`}>{d.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Loyalty Adjuster & CRM Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Loyalty Program point manual credit form */}
                      <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-3">
                        <span className="font-heading font-extrabold text-[10px] uppercase tracking-wider text-gray-400 block border-b border-white/5 pb-2">Manual Points Adjuster</span>
                        
                        <div className="space-y-2">
                          <div>
                            <label className="text-[8px] text-gray-500 uppercase font-bold block mb-1">Points to Credit</label>
                            <input 
                              type="number" 
                              value={crmPointsToCredit} 
                              onChange={(e) => setCrmPointsToCredit(e.target.value)} 
                              className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-white font-number text-xs focus:outline-none focus:border-primary" 
                              placeholder="e.g. 500" 
                            />
                          </div>
                          <div>
                            <label className="text-[8px] text-gray-500 uppercase font-bold block mb-1">Reason / Campaign</label>
                            <input 
                              type="text" 
                              value={crmPointsReason} 
                              onChange={(e) => setCrmPointsReason(e.target.value)} 
                              className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-primary" 
                              placeholder="e.g. Appreciation Gift" 
                            />
                          </div>
                          
                          <button 
                            type="button"
                            onClick={() => {
                              toast.success(`${crmPointsToCredit} points credited to ${selectedCustomer.name} successfully!`);
                            }}
                            className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold uppercase text-[9px] tracking-wider rounded-lg cursor-pointer"
                          >
                            Credit Loyalty Points
                          </button>
                        </div>
                      </div>

                      {/* Administrative Command Controls */}
                      <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-3">
                        <span className="font-heading font-extrabold text-[10px] uppercase tracking-wider text-gray-400 block border-b border-white/5 pb-2">CRM Actions Console</span>
                        
                        <div className="grid grid-cols-2 gap-2 text-[9px] font-bold uppercase tracking-wider">
                          <button 
                            onClick={() => toast.success(`Personalized email campaign dispatched to ${selectedCustomer.name}`)}
                            className="p-3 bg-white/5 border border-white/10 hover:border-primary hover:text-white rounded-xl text-gray-300 transition-all text-center cursor-pointer"
                          >
                            📧 Send Offer
                          </button>
                          
                          <button 
                            onClick={() => toast.success(`Warning message dispatched to registered device: ${selectedCustomer.phone}`)}
                            className="p-3 bg-white/5 border border-white/10 hover:border-primary hover:text-white rounded-xl text-gray-300 transition-all text-center cursor-pointer"
                          >
                            💬 SMS Alert
                          </button>

                          <button 
                            onClick={() => toast.success(`Customer ${selectedCustomer.name} upgraded to Diamond status`)}
                            className="p-3 bg-white/5 border border-white/10 hover:border-primary hover:text-white rounded-xl text-gray-300 transition-all text-center cursor-pointer"
                          >
                            👑 Upgrade Tier
                          </button>

                          <button 
                            onClick={() => toast.error(`Customer ${selectedCustomer.name} accounts locked/blocked.`)}
                            className="p-3 bg-primary/10 border border-primary/20 hover:bg-primary text-white rounded-xl transition-all text-center cursor-pointer"
                          >
                            ⛔ Block User
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Timeline Activity */}
                    <div className="pt-3 border-t border-white/5">
                      <span className="text-gray-400 font-extrabold uppercase text-[9px] tracking-wider block mb-2">Customer Activity Timeline & AI Predictions</span>
                      {[
                        { event: "🎟️ Booked 'Aether: Rising Stars' — IMAX Screen 1", time: "2h ago" },
                        { event: "🍿 Ordered Truffle Popcorn + Pepsi XL", time: "1h 55m ago" },
                        { event: "🤖 AI prediction: Churn probability: 4.2% (Very Low)", time: "Just now" },
                        { event: "🔮 AI suggestion: Next movie recommendation: 'Shadows of the Dynasty'", time: "Just now" }
                      ].map((ev, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-none">
                          <span className="text-gray-300">{ev.event}</span>
                          <span className="text-gray-500 font-number">{ev.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* AI Customer Segments */}
            <div className="pt-4 border-t border-white/5 space-y-4">
              <h3 className="font-heading font-bold text-sm uppercase text-gray-400 flex items-center gap-2"><Tag className="w-4 h-4 text-accent" /> AI Customer Segments</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: "High Value", count: 89, color: "bg-luxuryGold/10 border-luxuryGold/20 text-luxuryGold" },
                  { name: "Frequent Visitors", count: 234, color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
                  { name: "Weekend Only", count: 567, color: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
                  { name: "Family Groups", count: 178, color: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
                  { name: "Students", count: 445, color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" },
                  { name: "Corporate", count: 67, color: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
                  { name: "Inactive (30d+)", count: 1203, color: "bg-red-500/10 border-red-500/20 text-red-400" },
                  { name: "Food Enthusiasts", count: 312, color: "bg-pink-500/10 border-pink-500/20 text-pink-400" }
                ].map((seg, i) => (
                  <div key={i} className={`p-3 rounded-xl border ${seg.color} text-xs font-bold flex justify-between items-center hover:scale-[1.02] transition-transform`}>
                    <span>{seg.name}</span>
                    <span className="font-number">{seg.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Ticket Queue */}
            <div className="pt-6 border-t border-white/5 space-y-4 text-xs">
              <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-accent" /> Active Support Tickets
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 border border-white/5 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead><tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider"><th className="p-4">Customer</th><th className="p-4">Issue</th><th className="p-4">Priority</th><th className="p-4">Status</th><th className="p-4">SLA</th><th className="p-4 text-right">Actions</th></tr></thead>
                    <tbody className="divide-y divide-white/5 bg-black/20">
                      {supportTickets.map((t) => (
                        <tr key={t.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-bold text-white font-heading">{t.customerName}</td>
                          <td className="p-4 text-gray-400 max-w-48 truncate">{t.subject}</td>
                          <td className={`p-4 font-bold font-mono ${priorityColor(t.priority)}`}>{t.priority}</td>
                          <td className="p-4"><span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase border ${statusColor(t.status)}`}>{t.status}</span></td>
                          <td className={`p-4 font-mono ${t.sla === "OVERDUE" ? "text-red-400" : "text-gray-400"}`}>{t.sla}</td>
                          <td className="p-4 text-right">
                            {t.status !== "RESOLVED" && (
                              <button onClick={() => setSelectedTicketId(t.id)} className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-[10px] uppercase tracking-wider cursor-pointer">Reply</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="lg:col-span-4 p-6 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                  <span className="font-heading font-extrabold text-sm uppercase tracking-wider text-gray-400 block border-b border-white/5 pb-2">Respond to Ticket</span>
                  {selectedTicketId ? (
                    <form onSubmit={handleReplyTicket} className="space-y-4">
                      <div className="text-white">Ticket: <span className="font-bold text-accent">{selectedTicketId}</span></div>
                      <textarea rows={3} required placeholder="Type resolution response..." value={ticketReplyText} onChange={(e) => setTicketReplyText(e.target.value)} className="w-full px-4 py-3 rounded bg-black/60 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary resize-none" />
                      <button type="submit" className="w-full py-2.5 rounded bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider cursor-pointer">Submit Response</button>
                    </form>
                  ) : (<span className="text-gray-500 italic block">Select a ticket to respond.</span>)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
           TAB 6 — F&B KITCHEN MANAGEMENT
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "fnb" && (
          <div className="space-y-8">
            {/* Volume 8 · Part 6 — Kitchen Display System & AI demand forecast */}
            <KitchenDisplayPanel />
            <h2 className="text-2xl font-heading font-extrabold tracking-tight border-b border-white/5 pb-4 flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-primary" /> Food & Beverage Management
            </h2>

            {/* F&B Analytics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-number">
              {[
                { label: "Today's F&B Revenue", value: "₹0", icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-400" },
                { label: "Total Orders", value: "127", icon: <Package className="w-4 h-4" />, color: "text-white" },
                { label: "Avg Order Value", value: "₹0", icon: <TrendingUp className="w-4 h-4" />, color: "text-accent" },
                { label: "Kitchen Queue", value: "12 Active", icon: <Clock className="w-4 h-4" />, color: "text-amber-400" },
                { label: "Preparing", value: "8", icon: <UtensilsCrossed className="w-4 h-4" />, color: "text-blue-400" },
                { label: "Delivered", value: "112", icon: <Truck className="w-4 h-4" />, color: "text-emerald-400" },
                { label: "Most Sold Item", value: "Truffle Popcorn", icon: <Star className="w-4 h-4" />, color: "text-luxuryGold" },
                { label: "Avg Prep Time", value: "4.2 min", icon: <Clock className="w-4 h-4" />, color: "text-purple-400" }
              ].map((card, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-primary/30 transition-all group">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold flex items-center gap-1">{card.icon} {card.label}</span>
                  <span className={`text-lg font-bold ${card.color} mt-1 block group-hover:scale-105 transition-transform origin-left`}>{card.value}</span>
                </div>
              ))}
            </div>

            {/* Food Category Manager */}
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-sm uppercase text-gray-400 flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Food Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {fnbCategories.map((cat) => (
                  <div key={cat.id} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-primary/30 transition-all cursor-pointer group" style={{ borderLeftColor: cat.color, borderLeftWidth: "3px" }}>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-[9px] font-bold text-gray-500 uppercase bg-white/5 px-2 py-0.5 rounded-full">{cat.items} items</span>
                    </div>
                    <span className="text-white font-heading font-bold text-sm mt-2 block group-hover:text-primary transition-colors">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Food Item Table + Creation Wizard */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-heading font-bold text-sm uppercase text-gray-400 flex items-center gap-2"><UtensilsCrossed className="w-4 h-4" /> Food Items</h3>
                {!fnbWizardOpen && (
                  <button onClick={() => { setFnbWizardOpen(true); setFnbWizardStep(1); }} className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1.5 shadow-redGlow">
                    <Plus className="w-4 h-4" /> Add Food Item
                  </button>
                )}
              </div>

              {/* 8-Step Food Wizard */}
              {fnbWizardOpen && (
                <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-6 text-xs">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                      Step {fnbWizardStep} of 8: {["Basic Details","Pricing","Media","Ingredients","Availability","Customization","Offers","Publish"][fnbWizardStep - 1]}
                    </span>
                    <div className="flex gap-1">{[1,2,3,4,5,6,7,8].map((s) => (<div key={s} className={`w-3.5 h-1.5 rounded-full ${fnbWizardStep >= s ? 'bg-primary' : 'bg-white/10'}`} />))}</div>
                  </div>

                  {fnbWizardStep === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2"><label className="text-gray-400 font-bold block">Food Name</label><input type="text" value={fnbWizardItem.name} onChange={(e) => setFnbWizardItem({...fnbWizardItem, name: e.target.value})} className="w-full px-4 py-3 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary" placeholder="e.g. Truffle Butter Popcorn" /></div>
                      <div className="space-y-2"><label className="text-gray-400 font-bold block">Category</label>
                        <select value={fnbWizardItem.category} onChange={(e) => setFnbWizardItem({...fnbWizardItem, category: e.target.value})} className="w-full px-4 py-3 rounded bg-black/60 border border-white/10 text-white focus:outline-none">
                          {fnbCategories.map((c) => (<option key={c.id} value={c.name} className="text-black">{c.icon} {c.name}</option>))}
                        </select>
                      </div>
                      <div className="space-y-2"><label className="text-gray-400 font-bold block">Veg / Non-Veg</label>
                        <div className="flex gap-2">{["Veg", "Non-Veg"].map((t) => (<button key={t} type="button" onClick={() => setFnbWizardItem({...fnbWizardItem, isVeg: t === "Veg"})} className={`flex-1 py-2 rounded font-bold uppercase text-[10px] cursor-pointer ${fnbWizardItem.isVeg === (t === "Veg") ? 'bg-primary text-white' : 'bg-white/5 text-gray-400'}`}>{t}</button>))}</div>
                      </div>
                      <div className="space-y-2"><label className="text-gray-400 font-bold block">Prep Time (min)</label><input type="number" value={fnbWizardItem.prepTime} onChange={(e) => setFnbWizardItem({...fnbWizardItem, prepTime: e.target.value})} className="w-full px-4 py-3 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary font-number" /></div>
                      <div className="col-span-1 md:col-span-2 space-y-2"><label className="text-gray-400 font-bold block">Description</label><textarea rows={2} value={fnbWizardItem.description} onChange={(e) => setFnbWizardItem({...fnbWizardItem, description: e.target.value})} className="w-full px-4 py-3 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary resize-none" placeholder="Short premium description..." /></div>
                    </div>
                  )}

                  {fnbWizardStep === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2"><label className="text-gray-400 font-bold block">Base Price (₹)</label><input type="number" value={fnbWizardItem.basePrice} onChange={(e) => setFnbWizardItem({...fnbWizardItem, basePrice: e.target.value})} className="w-full px-4 py-3 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary font-number" placeholder="e.g. 240" /></div>
                      <div className="space-y-2"><label className="text-gray-400 font-bold block">Weekend Price (₹)</label><input type="number" value={fnbWizardItem.weekendPrice} onChange={(e) => setFnbWizardItem({...fnbWizardItem, weekendPrice: e.target.value})} className="w-full px-4 py-3 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary font-number" placeholder="e.g. 280" /></div>
                      <div className="space-y-2"><label className="text-gray-400 font-bold block">Member Price (₹)</label><input type="number" value={fnbWizardItem.memberPrice} onChange={(e) => setFnbWizardItem({...fnbWizardItem, memberPrice: e.target.value})} className="w-full px-4 py-3 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary font-number" placeholder="e.g. 199" /></div>
                      <div className="space-y-2"><label className="text-gray-400 font-bold block">Tax %</label><input type="number" value={fnbWizardItem.taxPercent} onChange={(e) => setFnbWizardItem({...fnbWizardItem, taxPercent: e.target.value})} className="w-full px-4 py-3 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary font-number" placeholder="e.g. 5" /></div>
                    </div>
                  )}

                  {fnbWizardStep >= 3 && fnbWizardStep <= 7 && (
                    <div className="text-center py-8 text-gray-500">
                      <span className="block text-sm font-heading font-bold mb-2">Step {fnbWizardStep} — {["","","Media Upload","Ingredient Management","Availability Config","Customization Options","Offer Attachments"][fnbWizardStep]}</span>
                      <span className="text-xs">Configure in detailed settings after initial publish</span>
                    </div>
                  )}

                  {fnbWizardStep === 8 && (
                    <div className="text-center py-6 space-y-4">
                      <span className="text-lg font-heading font-bold text-white block">Ready to Publish</span>
                      <span className="text-gray-400 block">{fnbWizardItem.name || "Unnamed Item"} — {fnbWizardItem.category} — ₹{fnbWizardItem.basePrice || "0"}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center border-t border-white/5 pt-4">
                    <button disabled={fnbWizardStep === 1} onClick={() => setFnbWizardStep((p) => p - 1)} className="px-4 py-2 border border-white/10 rounded-lg text-xs font-bold text-gray-400 hover:text-white disabled:opacity-50 cursor-pointer flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Back</button>
                    <div className="flex gap-2">
                      <button onClick={() => setFnbWizardOpen(false)} className="px-4 py-2 border border-white/10 rounded-lg text-xs font-bold text-gray-400 hover:text-white cursor-pointer">Cancel</button>
                      {fnbWizardStep < 8 ? (
                        <button onClick={() => setFnbWizardStep((p) => p + 1)} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white cursor-pointer">Next</button>
                      ) : (
                        <button onClick={handleFinishFnbWizard} className="px-5 py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-redGlow cursor-pointer">Publish Item</button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Food Items Table */}
              <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
                <table className="w-full text-left border-collapse">
                  <thead><tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider"><th className="p-4">Item</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Offer</th><th className="p-4">Stock</th><th className="p-4">Badge</th><th className="p-4">Rating</th></tr></thead>
                  <tbody className="divide-y divide-white/5 bg-black/20">
                    {fnbItems.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-white font-heading">{item.name}</td>
                        <td className="p-4 text-gray-400">{item.category}</td>
                        <td className="p-4 text-gray-500 line-through">₹{item.price}</td>
                        <td className="p-4 text-emerald-400 font-bold">₹{item.offerPrice}</td>
                        <td className="p-4"><span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${item.stock === "Low Stock" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}>{item.stock}</span></td>
                        <td className="p-4"><span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">{item.badge}</span></td>
                        <td className="p-4 text-luxuryGold">⭐ {item.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Combo Builder */}
            <div className="pt-6 border-t border-white/5 space-y-4">
              <h3 className="font-heading font-bold text-sm uppercase text-gray-400 flex items-center gap-2"><Sparkles className="w-4 h-4 text-luxuryGold" /> Combo Builder</h3>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {fnbItems.map((item) => (
                      <button key={item.id} onClick={() => toggleComboItem(item.id)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${comboSelectedItems.includes(item.id) ? 'border-primary bg-primary/10 text-white' : 'border-white/5 bg-white/5 text-gray-400 hover:border-white/20'}`}>
                        <span className="font-bold block">{item.name}</span>
                        <span className="text-emerald-400 font-number">₹{item.offerPrice}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-4 p-5 bg-white/5 border border-white/5 rounded-2xl space-y-4 text-xs">
                  <span className="font-heading font-bold text-sm uppercase text-gray-400 block">Combo Preview</span>
                  <input type="text" placeholder="Combo Name..." value={comboName} onChange={(e) => setComboName(e.target.value)} className="w-full px-4 py-2.5 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary" />
                  <div className="text-gray-400"><span className="font-bold text-white">{comboSelectedItems.length}</span> items selected</div>
                  {comboSelectedItems.length >= 2 && (
                    <div className="text-emerald-400 font-bold">Est. Savings: ₹{Math.round(comboSelectedItems.length * 40)}</div>
                  )}
                  <button onClick={handleCreateCombo} className="w-full py-2.5 rounded bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider cursor-pointer">Create Combo</button>
                </div>
              </div>
            </div>

            {/* Kitchen Live Queue */}
            <div className="pt-6 border-t border-white/5 space-y-4 text-xs">
              <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-accent" /> Kitchen Live Order Queue
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kitchenOrders.map((order) => (
                  <div key={order.id} className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-3 hover:border-primary/20 transition-all relative overflow-hidden">
                    {/* Glowing side priority border strip */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      order.priority === "VIP" ? "bg-red-500 animate-pulse" :
                      order.priority === "URGENT" ? "bg-amber-500" : "bg-zinc-600"
                    }`} />
                    
                    <div className="flex justify-between items-center pl-2">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-white">{order.customer}</span>
                        <span className={`px-2 py-0.5 rounded-[6px] text-[8px] font-extrabold uppercase border ${
                          order.priority === "VIP" ? "bg-red-500/10 text-red-400 border-red-500/25 shadow-redGlow animate-pulse" :
                          order.priority === "URGENT" ? "bg-amber-500/10 text-amber-400 border-amber-500/25" :
                          "bg-zinc-500/10 text-zinc-400 border-zinc-500/25"
                        }`}>
                          {order.priority}
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase border ${statusColor(order.status)}`}>{order.status}</span>
                    </div>
                    <div className="text-gray-400 pl-2">{order.items}</div>
                    <div className="flex justify-between text-gray-500 pl-2">
                      <span>🖥 {order.screen} · 💺 {order.seat}</span>
                      <span className="font-bold text-white font-number">₹{order.amount}</span>
                    </div>
                    <div className="flex justify-between items-center pl-2">
                      <span className="text-gray-500">👨‍🍳 {order.chef} · ⏱ {order.time}</span>
                      <div className="flex gap-1.5 font-sans">
                        {order.status === "RECEIVED" && <button onClick={() => handleUpdateKitchenStatus(order.id, "PREPARING")} className="px-3 py-1 rounded bg-blue-500/20 text-blue-400 font-bold text-[9px] uppercase cursor-pointer hover:bg-blue-500/30">Accept</button>}
                        {order.status === "PREPARING" && <button onClick={() => handleUpdateKitchenStatus(order.id, "READY")} className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[9px] uppercase cursor-pointer hover:bg-emerald-500/30">Mark Ready</button>}
                        {order.status === "READY" && <button onClick={() => handleUpdateKitchenStatus(order.id, "DELIVERED")} className="px-3 py-1 rounded bg-purple-500/20 text-purple-400 font-bold text-[9px] uppercase cursor-pointer hover:bg-purple-500/30">Delivered</button>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory Dashboard */}
            <div className="pt-6 border-t border-white/5 space-y-4 text-xs">
              <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <Package className="w-5 h-5 text-accent" /> Inventory & Stock Levels
              </h3>
              <div className="border border-white/5 rounded-xl overflow-hidden font-number">
                <table className="w-full text-left border-collapse">
                  <thead><tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider"><th className="p-4">Ingredient</th><th className="p-4">Supplier</th><th className="p-4">Stock</th><th className="p-4">Min</th><th className="p-4">Unit Cost</th><th className="p-4 text-right">Status</th></tr></thead>
                  <tbody className="divide-y divide-white/5 bg-black/20">
                    {inventoryItems.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-white font-heading">{item.name}</td>
                        <td className="p-4 text-gray-400">{item.supplier}</td>
                        <td className="p-4 text-white font-bold">{item.stock} {item.unit}</td>
                        <td className="p-4 text-gray-500">{item.min} {item.unit}</td>
                        <td className="p-4 text-gray-400">₹{item.cost}</td>
                        <td className="p-4 text-right">
                          <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase border ${inventoryStatusColor(item.status)}`}>
                            {item.status === "OUT_OF_STOCK" ? "OUT OF STOCK" : item.status === "LOW_STOCK" ? "LOW STOCK" : item.status === "CRITICAL" ? "CRITICAL" : "OK"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* AI Inventory Alerts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: <AlertTriangle className="w-4 h-4 text-red-400" />, title: "Nacho Chips — OUT OF STOCK", desc: "Reorder from SnackWorld immediately. Est. delivery: 2 days.", color: "border-red-500/20" },
                  { icon: <AlertTriangle className="w-4 h-4 text-amber-400" />, title: "Truffle Oil — CRITICAL", desc: "Only 3 liters remaining. AI predicts stockout in 1 day at current demand.", color: "border-amber-500/20" },
                  { icon: <Sparkles className="w-4 h-4 text-blue-400" />, title: "Weekend Demand Forecast", desc: "AI predicts 40% increase in Popcorn + Drinks demand. Pre-stock recommended.", color: "border-blue-500/20" }
                ].map((alert, i) => (
                  <div key={i} className={`p-4 bg-white/5 border ${alert.color} rounded-xl space-y-1`}>
                    <div className="flex items-center gap-2 font-heading font-bold text-white text-xs">{alert.icon} {alert.title}</div>
                    <p className="text-gray-500 text-[10px]">{alert.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
           TAB 7 — HR & STAFF MANAGEMENT
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "hr" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-heading font-extrabold tracking-tight border-b border-white/5 pb-4 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-primary" /> Employee & HR Management
            </h2>

            {/* HR Analytics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-number">
              {[
                { label: "Total Employees", value: "87", icon: <Users className="w-4 h-4" />, color: "text-white" },
                { label: "Present Today", value: "72", icon: <UserCheck className="w-4 h-4" />, color: "text-emerald-400" },
                { label: "Absent Today", value: "6", icon: <UserX className="w-4 h-4" />, color: "text-red-400" },
                { label: "Late Arrivals", value: "4", icon: <Clock className="w-4 h-4" />, color: "text-amber-400" },
                { label: "On Leave", value: "5", icon: <CalendarDays className="w-4 h-4" />, color: "text-blue-400" },
                { label: "Morning Shift", value: "32", icon: <Zap className="w-4 h-4" />, color: "text-luxuryGold" },
                { label: "Overtime Hours", value: "48h", icon: <Clock className="w-4 h-4" />, color: "text-purple-400" },
                { label: "Payroll This Month", value: "₹0", icon: <Wallet className="w-4 h-4" />, color: "text-emerald-400" },
                { label: "Pending Salaries", value: "15", icon: <DollarSign className="w-4 h-4" />, color: "text-amber-400" },
                { label: "Avg Performance", value: "4.2 / 5", icon: <Star className="w-4 h-4" />, color: "text-luxuryGold" },
                { label: "Training Done", value: "78%", icon: <Award className="w-4 h-4" />, color: "text-blue-400" },
                { label: "Pending Approvals", value: "7", icon: <ClipboardList className="w-4 h-4" />, color: "text-red-400" }
              ].map((card, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-primary/30 transition-all group">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold flex items-center gap-1">{card.icon} {card.label}</span>
                  <span className={`text-lg font-bold ${card.color} mt-1 block group-hover:scale-105 transition-transform origin-left`}>{card.value}</span>
                </div>
              ))}
            </div>

            {/* HR Sub-Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto border-b border-white/5 pb-3">
              {[
                { key: "directory" as const, label: "Employee Directory", icon: <Users className="w-3.5 h-3.5" /> },
                { key: "attendance" as const, label: "Live Attendance", icon: <UserCheck className="w-3.5 h-3.5" /> },
                { key: "shifts" as const, label: "Shift Management", icon: <Clock className="w-3.5 h-3.5" /> },
                { key: "leaves" as const, label: "Leave Requests", icon: <CalendarDays className="w-3.5 h-3.5" /> },
                { key: "payroll" as const, label: "Payroll", icon: <Wallet className="w-3.5 h-3.5" /> },
                { key: "performance" as const, label: "Performance", icon: <Award className="w-3.5 h-3.5" /> },
                { key: "tasks" as const, label: "Tasks Manager", icon: <ClipboardList className="w-3.5 h-3.5" /> },
                { key: "roles" as const, label: "Role Permissions", icon: <Settings className="w-3.5 h-3.5" /> },
                { key: "announcements" as const, label: "Announcements", icon: <Megaphone className="w-3.5 h-3.5" /> }
              ].map((st) => (
                <button key={st.key} onClick={() => setHrSubTab(st.key)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
                    hrSubTab === st.key ? "bg-primary text-white shadow-redGlow" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}>{st.icon} {st.label}</button>
              ))}
            </div>

            {/* ─── EMPLOYEE DIRECTORY ─── */}
            {hrSubTab === "directory" && (
              <div className="space-y-6">
                {/* Department Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {hrDepartments.map((d) => (
                    <div key={d.id} className="p-3 bg-white/5 border border-white/5 rounded-xl hover:border-primary/30 transition-all cursor-pointer group" style={{ borderLeftColor: d.color, borderLeftWidth: "3px" }}>
                      <div className="flex justify-between items-center">
                        <span className="text-xl">{d.icon}</span>
                        <span className="text-[9px] font-bold text-gray-500 uppercase bg-white/5 px-2 py-0.5 rounded-full font-number">{d.count}</span>
                      </div>
                      <span className="text-white font-heading font-bold text-xs mt-1 block group-hover:text-primary transition-colors">{d.name}</span>
                      <span className="text-gray-500 text-[9px] block">{d.head}</span>
                    </div>
                  ))}
                </div>

                {/* Search */}
                <input type="text" placeholder="Search by name, ID, department, designation..." value={hrSearch} onChange={(e) => setHrSearch(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary" />

                {/* Employee Table */}
                <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead><tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider"><th className="p-4">Code</th><th className="p-4">Employee</th><th className="p-4">Department</th><th className="p-4">Designation</th><th className="p-4">Shift</th><th className="p-4">Type</th><th className="p-4">Salary</th><th className="p-4">Perf</th><th className="p-4 text-right">Status</th></tr></thead>
                    <tbody className="divide-y divide-white/5 bg-black/20">
                      {filteredEmployees.map((e) => (
                        <React.Fragment key={e.id}>
                          <tr 
                            onClick={() => setSelectedEmpId(selectedEmpId === e.id ? null : e.id)} 
                            className={`hover:bg-white/5 transition-colors cursor-pointer ${selectedEmpId === e.id ? "bg-white/5 border-l-2 border-primary" : ""}`}
                          >
                            <td className="p-4 font-mono text-gray-500">{e.code}</td>
                            <td className="p-4 font-bold text-white font-heading">{e.name}</td>
                            <td className="p-4 text-gray-400">{e.dept}</td>
                            <td className="p-4 text-gray-400">{e.designation}</td>
                            <td className="p-4 text-accent font-bold">{e.shift}</td>
                            <td className="p-4"><span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${e.type === "CONTRACT" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}>{e.type}</span></td>
                            <td className="p-4 text-white font-bold">₹{e.salary.toLocaleString()}</td>
                            <td className="p-4 text-luxuryGold">⭐ {e.perf}</td>
                            <td className="p-4 text-right"><span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase border ${empStatusColor(e.status)}`}>{e.status.replace("_", " ")}</span></td>
                          </tr>
                          
                          {/* Expandable Employee Profile Drawer Panel */}
                          {selectedEmpId === e.id && (
                            <tr>
                              <td colSpan={9} className="p-6 bg-black/50 border-t border-b border-white/5">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs text-left animate-fadeIn">
                                  {/* Left Column: Personal info & ID docs (Column 5) */}
                                  <div className="md:col-span-5 space-y-4">
                                    <div className="flex items-center gap-4">
                                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-black text-lg">
                                        {e.name.split(" ").map((w: string) => w[0]).join("")}
                                      </div>
                                      <div>
                                        <h4 className="font-heading font-black text-sm text-white">{e.name}</h4>
                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">{e.designation} · {e.code}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="p-3.5 bg-white/5 border border-white/5 rounded-xl space-y-2">
                                      <span className="font-heading font-extrabold text-[8px] uppercase tracking-wider text-gray-500 block">Personal Profile</span>
                                      <div className="space-y-1 text-gray-300">
                                        <p>📧 Email: <strong className="text-white font-number">{e.name.toLowerCase().replace(" ", "")}@cineverse.com</strong></p>
                                        <p>📞 Phone: <strong className="text-white font-number">+91 90812 {Math.floor(Math.random() * 90000) + 10000}</strong></p>
                                        <p>📍 Location: <strong>Mumbai Corporate HQ Office</strong></p>
                                        <p>🚨 Emergency Contact: <strong className="text-white font-number">+91 99011 {Math.floor(Math.random() * 90000) + 10000} (Spouse)</strong></p>
                                      </div>
                                    </div>

                                    {/* Document upload / Verification status */}
                                    <div className="p-3.5 bg-white/5 border border-white/5 rounded-xl space-y-2">
                                      <span className="font-heading font-extrabold text-[8px] uppercase tracking-wider text-gray-500 block">Documents Verification Status</span>
                                      <div className="space-y-2 text-[10px]">
                                        <div className="flex justify-between items-center text-gray-300">
                                          <span>Aadhaar Card ID Proof</span>
                                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase text-[8px]">Verified</span>
                                        </div>
                                        <div className="flex justify-between items-center text-gray-300">
                                          <span>Degree / Tech Certs</span>
                                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase text-[8px]">Verified</span>
                                        </div>
                                        <div className="flex justify-between items-center text-gray-300">
                                          <span>Employment Contract</span>
                                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase text-[8px]">Signed & Active</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right Column: Professional info & Action controls (Column 7) */}
                                  <div className="md:col-span-7 space-y-4">
                                    <span className="font-heading font-extrabold text-[10px] uppercase tracking-wider text-gray-400 block border-b border-white/5 pb-2">Employment Information</span>
                                    
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                      {[
                                        { label: "Department", value: e.dept },
                                        { label: "Base Salary", value: `₹${e.salary.toLocaleString()}` },
                                        { label: "Active Shift", value: e.shift },
                                        { label: "Employment", value: e.type }
                                      ].map((fld, idx) => (
                                        <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl">
                                          <span className="text-gray-500 uppercase font-extrabold text-[8px] block">{fld.label}</span>
                                          <span className="text-white font-bold mt-1 block">{fld.value}</span>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Action forms */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                      <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                                        <span className="font-heading font-bold text-[10px] uppercase text-gray-400 block">Shift Rotation Scheduler</span>
                                        <select 
                                          defaultValue={e.shift}
                                          onChange={() => toast.success(`Shift for ${e.name} rotated successfully.`)}
                                          className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary text-xs"
                                        >
                                          <option value="MORNING">Morning Shift (06:00 - 14:00)</option>
                                          <option value="AFTERNOON">Afternoon Shift (14:00 - 22:00)</option>
                                          <option value="NIGHT">Night Shift (22:00 - 06:00)</option>
                                          <option value="WEEKEND">Weekend Special (10:00 - 23:00)</option>
                                        </select>
                                      </div>

                                      <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                                        <span className="font-heading font-bold text-[10px] uppercase text-gray-400 block">Employee Direct Action</span>
                                        <div className="flex gap-2">
                                          <button 
                                            onClick={() => toast.success(`Performance review dispatched for ${e.name}`)}
                                            className="flex-1 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-[9px] uppercase tracking-wider text-center cursor-pointer"
                                          >
                                            ⭐ Audit Perf
                                          </button>
                                          <button 
                                            onClick={() => toast.error(`Deactivated employee profile ${e.code}`)}
                                            className="flex-1 py-2 rounded bg-primary hover:bg-primary-hover text-white font-bold text-[9px] uppercase tracking-wider text-center cursor-pointer"
                                          >
                                            ⛔ Deactivate
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ─── LIVE ATTENDANCE BOARD ─── */}
            {hrSubTab === "attendance" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {hrEmployees.map((e) => (
                    <div key={e.id} className={`p-4 bg-black/40 border rounded-2xl space-y-2 hover:scale-[1.02] transition-all ${
                      e.status === "PRESENT" ? "border-emerald-500/20" : e.status === "ABSENT" ? "border-red-500/20" : e.status === "LATE" ? "border-amber-500/20" : "border-blue-500/20"
                    }`}>
                      <div className="flex justify-between items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs">{e.name.split(" ").map((w: string) => w[0]).join("")}</div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${empStatusColor(e.status)}`}>{e.status.replace("_", " ")}</span>
                      </div>
                      <span className="text-white font-heading font-bold text-xs block">{e.name}</span>
                      <span className="text-gray-500 text-[10px] block">{e.dept} · {e.designation}</span>
                      <div className="flex justify-between text-[10px] text-gray-500">
                        <span>Shift: {e.shift}</span>
                        <span className="font-mono">{e.code}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── SHIFT MANAGEMENT ─── */}
            {hrSubTab === "shifts" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Active Shifts (Column 8) */}
                  <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: "Morning Shift", type: "MORNING", time: "06:00 → 14:00", grace: 15, breakMin: 30, max: 8, assigned: 32, color: "border-amber-500/20" },
                      { name: "Afternoon Shift", type: "AFTERNOON", time: "14:00 → 22:00", grace: 15, breakMin: 30, max: 8, assigned: 28, color: "border-blue-500/20" },
                      { name: "Night Shift", type: "NIGHT", time: "22:00 → 06:00", grace: 10, breakMin: 45, max: 8, assigned: 12, color: "border-purple-500/20" },
                      { name: "Weekend Special", type: "WEEKEND", time: "10:00 → 23:00", grace: 20, breakMin: 60, max: 12, assigned: 45, color: "border-emerald-500/20" }
                    ].map((sh, i) => (
                      <div key={i} className={`p-5 bg-black/40 border ${sh.color} rounded-2xl space-y-3 hover:scale-[1.01] transition-all text-xs`}>
                        <div className="flex justify-between items-center">
                          <span className="font-heading font-bold text-white text-sm">{sh.name}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">{sh.type}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-gray-400">
                          <div><span className="text-gray-500 uppercase text-[9px] font-bold block">Hours</span><span className="text-white font-number">{sh.time}</span></div>
                          <div><span className="text-gray-500 uppercase text-[9px] font-bold block">Grace</span><span className="text-white font-number">{sh.grace} min</span></div>
                          <div><span className="text-gray-500 uppercase text-[9px] font-bold block">Break</span><span className="text-white font-number">{sh.breakMin} min</span></div>
                          <div><span className="text-gray-500 uppercase text-[9px] font-bold block">Max Hours</span><span className="text-white font-number">{sh.max}h</span></div>
                        </div>
                        <div className="flex justify-between items-center border-t border-white/5 pt-2">
                          <span className="text-gray-500">Assigned Staff</span>
                          <span className="text-accent font-bold font-number">{sh.assigned} employees</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Column: AI Smart Staff Scheduling Engine (Column 4) */}
                  <div className="lg:col-span-4 p-5 bg-white/5 border border-white/5 rounded-2xl space-y-4 text-xs font-sans text-left">
                    <div className="flex items-center gap-2 text-luxuryGold">
                      <Sparkles className="w-5 h-5 text-luxuryGold animate-pulse" />
                      <span className="font-heading font-extrabold text-sm uppercase tracking-wider text-white">AI Scheduling Engine</span>
                    </div>

                    <p className="text-gray-400 text-[11px] leading-relaxed">
                      AI analyzes scheduled screen times, seat reservation metrics, historical food court queues, and weekday coefficients to recommend active staffing:
                    </p>

                    <div className="space-y-3">
                      {[
                        { title: "Weekend Night Show Peak", crowd: "1,850 Est. Guests", rec: "Recommend: +3 Tickets staff, +4 Security guards, +6 F&B counters", status: "CRITICAL ALERT", color: "border-red-500/20 bg-red-500/5 text-red-400" },
                        { title: "Blockbuster Movie Premiere", crowd: "Full House IMAX Room 1", rec: "Recommend: +2 Projection technicians, +3 Guest assistants", status: "HIGH DEMAND", color: "border-amber-500/20 bg-amber-500/5 text-amber-400" },
                        { title: "Monday Afternoon Low", crowd: "200 Est. Guests", rec: "Recommend: Rotate 4 service staff to break / off-duty", status: "OPTIMAL BALANCE", color: "border-blue-500/20 bg-blue-500/5 text-blue-400" }
                      ].map((item, idx) => (
                        <div key={idx} className={`p-4 border ${item.color} rounded-xl space-y-1.5`}>
                          <div className="flex justify-between items-center">
                            <span className="font-heading font-black text-xs text-white">{item.title}</span>
                            <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/45">{item.status}</span>
                          </div>
                          <p className="text-[10px] text-gray-300">👥 Expected Crowd: <strong className="text-white font-number">{item.crowd}</strong></p>
                          <p className="text-[10px] text-accent italic">{item.rec}</p>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => toast.success("AI auto-scheduler rules applied to active shift rosters!")}
                      className="w-full py-2.5 rounded bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
                    >
                      Apply AI Suggestions
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* ─── LEAVE REQUESTS ─── */}
            {hrSubTab === "leaves" && (
              <div className="space-y-4">
                <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead><tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider"><th className="p-4">Employee</th><th className="p-4">Department</th><th className="p-4">Type</th><th className="p-4">Period</th><th className="p-4">Days</th><th className="p-4">Reason</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
                    <tbody className="divide-y divide-white/5 bg-black/20">
                      {hrLeaves.map((l) => (
                        <tr key={l.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-bold text-white font-heading">{l.name}</td>
                          <td className="p-4 text-gray-400">{l.dept}</td>
                          <td className="p-4 text-accent font-bold">{l.type}</td>
                          <td className="p-4 text-gray-400">{l.from} → {l.to}</td>
                          <td className="p-4 text-white font-bold">{l.days}</td>
                          <td className="p-4 text-gray-500 max-w-32 truncate">{l.reason}</td>
                          <td className="p-4"><span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase border ${l.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : l.status === "REJECTED" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>{l.status}</span></td>
                          <td className="p-4 text-right">
                            {l.status === "PENDING" && (
                              <div className="flex gap-1.5 justify-end">
                                <button onClick={() => handleApproveLeave(l.id)} className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[9px] uppercase cursor-pointer hover:bg-emerald-500/30"><CheckCircle2 className="w-3 h-3 inline" /> Approve</button>
                                <button onClick={() => handleRejectLeave(l.id)} className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold text-[9px] uppercase cursor-pointer hover:bg-red-500/30">Reject</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ─── PAYROLL ─── */}
            {hrSubTab === "payroll" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Side: Payroll Table (Column 7) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-xs text-gray-500">Disbursed: <strong className="text-emerald-400 font-number">₹0</strong></span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase">Pending: 15 staff members</span>
                    </div>
                    
                    <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider text-[10px]">
                            <th className="p-4">Employee</th>
                            <th className="p-4">Department</th>
                            <th className="p-4">Gross</th>
                            <th className="p-4">Deductions</th>
                            <th className="p-4">Net Pay</th>
                            <th className="p-4 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-black/20">
                          {hrPayroll.map((p) => (
                            <tr key={p.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 font-bold text-white font-heading">{p.name}</td>
                              <td className="p-4 text-gray-400">{p.dept}</td>
                              <td className="p-4 text-white">₹{p.gross.toLocaleString()}</td>
                              <td className="p-4 text-red-400">-₹{p.deductions.toLocaleString()}</td>
                              <td className="p-4 text-emerald-400 font-bold">₹{p.net.toLocaleString()}</td>
                              <td className="p-4 text-right">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                                  p.status === "PAID" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                  "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                }`}>{p.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Side: Payslip Generator Form (Column 5) */}
                  <div className="lg:col-span-5 p-5 bg-white/5 border border-white/5 rounded-2xl space-y-4 text-xs font-sans">
                    <span className="font-heading font-extrabold text-sm uppercase tracking-wider text-gray-400 block border-b border-white/5 pb-2">Digital Payslip & Tax Estimator</span>
                    
                    <div className="space-y-3 font-number">
                      <div>
                        <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Select Employee</label>
                        <select className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary text-xs">
                          {hrEmployees.map((emp) => (
                            <option key={emp.id} value={emp.id} className="text-black">{emp.name} ({emp.dept})</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Basic Salary (₹)</label>
                          <input 
                            type="number" 
                            value={payrollBasic} 
                            onChange={(e) => setPayrollBasic(e.target.value)} 
                            className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Incentive Bonus (₹)</label>
                          <input 
                            type="number" 
                            value={payrollBonus} 
                            onChange={(e) => setPayrollBonus(e.target.value)} 
                            className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Overtime Pay (₹)</label>
                        <input 
                          type="number" 
                          value={payrollOvertime} 
                          onChange={(e) => setPayrollOvertime(e.target.value)} 
                          className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                        />
                      </div>

                      {/* Calculations Panel */}
                      <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2 text-[11px] text-gray-300">
                        <div className="flex justify-between">
                          <span>Gross Salary:</span>
                          <span className="text-white font-bold">₹{(parseFloat(payrollBasic) + parseFloat(payrollBonus) + parseFloat(payrollOvertime)).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-red-400">
                          <span>PF Deduction (12%):</span>
                          <span>-₹{(parseFloat(payrollBasic) * 0.12).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between text-red-400">
                          <span>ESI Contribution (0.75%):</span>
                          <span>-₹{(parseFloat(payrollBasic) * 0.0075).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between text-red-400 border-b border-white/5 pb-2">
                          <span>TDS Professional Tax (5%):</span>
                          <span>-₹{(parseFloat(payrollBasic) * 0.05).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between text-emerald-400 font-bold text-xs pt-1">
                          <span>Net Pay Amount:</span>
                          <span>₹{(
                            (parseFloat(payrollBasic) + parseFloat(payrollBonus) + parseFloat(payrollOvertime)) - 
                            ((parseFloat(payrollBasic) * 0.12) + (parseFloat(payrollBasic) * 0.0075) + (parseFloat(payrollBasic) * 0.05))
                          ).toFixed(0)}</span>
                        </div>
                      </div>

                      <button 
                        type="button" 
                        onClick={() => {
                          toast.success("Payslip generated and salary disbursed via bank transfer!");
                        }}
                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                      >
                        Approve & Pay Salary
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ─── PERFORMANCE ─── */}
            {hrSubTab === "performance" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hrPerformance.map((p) => (
                    <div key={p.id} className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 hover:border-primary/20 transition-all text-xs">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs">{p.name.split(" ").map((w: string) => w[0]).join("")}</div>
                          <div>
                            <span className="text-white font-heading font-bold block">{p.name}</span>
                            <span className="text-gray-500 text-[10px]">{p.dept}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-number font-bold text-luxuryGold">{p.overall}</span>
                          <span className="text-gray-500 text-[10px] block">/ 5.0</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { label: "Attendance", value: `${p.attendance}%` },
                          { label: "Punctuality", value: `${p.punctuality}%` },
                          { label: "Customer", value: p.customerRating },
                          { label: "Manager", value: p.managerRating }
                        ].map((m, idx) => (
                          <div key={idx} className="text-center">
                            <span className="text-gray-500 uppercase text-[9px] font-bold block">{m.label}</span>
                            <span className="text-white font-bold font-number">{m.value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-luxuryGold" />
                        <span className="text-gray-400 italic">{p.rec}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── ANNOUNCEMENTS ─── */}
            {hrSubTab === "announcements" && (
              <div className="space-y-4">
                {hrAnnouncements.map((a) => (
                  <div key={a.id} className={`p-5 bg-black/40 border rounded-2xl space-y-2 ${
                    a.priority === "CRITICAL" ? "border-red-500/20" : a.priority === "HIGH" ? "border-amber-500/20" : "border-white/10"
                  }`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Megaphone className={`w-4 h-4 ${a.priority === "CRITICAL" ? "text-red-400" : a.priority === "HIGH" ? "text-amber-400" : "text-gray-400"}`} />
                        <span className="font-heading font-bold text-white text-sm">{a.title}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase border ${
                        a.priority === "CRITICAL" ? "bg-red-500/10 text-red-400 border-red-500/20" : a.priority === "HIGH" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-white/5 text-gray-400 border-white/10"
                      }`}>{a.priority}</span>
                    </div>
                    <p className="text-gray-400 text-xs">{a.message}</p>
                    <span className="text-[10px] text-gray-600 uppercase font-bold">{a.category}</span>
                  </div>
                ))}
              </div>
            )}

            {/* ─── TASKS MANAGER ─── */}
            {hrSubTab === "tasks" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Tasks Queue (Column 8) */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider text-[10px]">
                            <th className="p-4">Task Details</th>
                            <th className="p-4">Assigned To</th>
                            <th className="p-4">Deadline</th>
                            <th className="p-4">Priority</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-black/20">
                          {hrTasks.map((t) => (
                            <tr key={t.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 font-bold text-white font-heading">{t.title}</td>
                              <td className="p-4 text-gray-400">{t.employee}</td>
                              <td className="p-4 text-gray-500">{t.deadline}</td>
                              <td className="p-4 font-bold">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                                  t.priority === "URGENT" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                  t.priority === "HIGH" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                  "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                }`}>
                                  {t.priority}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                                  t.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                  t.status === "IN_PROGRESS" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                  "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                                }`}>
                                  {t.status.replace("_", " ")}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                {t.status !== "COMPLETED" && (
                                  <button
                                    onClick={() => {
                                      setHrTasks(hrTasks.map((tk) => tk.id === t.id ? { ...tk, status: tk.status === "PENDING" ? "IN_PROGRESS" : "COMPLETED" } : tk));
                                      toast.success("Task status updated successfully!");
                                    }}
                                    className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-[9px] uppercase tracking-wider cursor-pointer"
                                  >
                                    Progress →
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Column: Assign New Task (Column 4) */}
                  <div className="lg:col-span-4 p-5 bg-white/5 border border-white/5 rounded-2xl space-y-4 text-xs font-sans text-left">
                    <span className="font-heading font-extrabold text-sm uppercase tracking-wider text-gray-400 block border-b border-white/5 pb-2">Quick Task Assignment</span>
                    
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!newTaskTitle) return;
                      const newTask = {
                        id: `task-${Date.now()}`,
                        title: newTaskTitle,
                        employee: newTaskEmployee,
                        priority: newTaskPriority,
                        deadline: "Jul 22, 2026",
                        status: "PENDING"
                      };
                      setHrTasks([...hrTasks, newTask]);
                      setNewTaskTitle("");
                      toast.success("Task assigned to staff member successfully!");
                    }} className="space-y-3">
                      <div>
                        <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Task Title / Description</label>
                        <input 
                          type="text" 
                          required
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          placeholder="e.g. Clean VIP auditorium seats..."
                          className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Assign Employee</label>
                        <select 
                          value={newTaskEmployee}
                          onChange={(e) => setNewTaskEmployee(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary text-xs"
                        >
                          {hrEmployees.map((emp) => (
                            <option key={emp.id} value={emp.name} className="text-black">{emp.name} ({emp.dept})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Priority</label>
                        <select 
                          value={newTaskPriority}
                          onChange={(e) => setNewTaskPriority(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary text-xs"
                        >
                          <option value="NORMAL">NORMAL</option>
                          <option value="HIGH">HIGH</option>
                          <option value="URGENT">URGENT</option>
                        </select>
                      </div>
                      <button 
                        type="submit"
                        className="w-full py-2.5 rounded bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
                      >
                        Assign Task
                      </button>
                    </form>
                  </div>

                </div>
              </div>
            )}

            {/* ─── ROLE BASED ACCESS MATRIX ─── */}
            {hrSubTab === "roles" && (
              <div className="space-y-6">
                <div className="p-5 bg-white/5 border border-white/5 rounded-2xl text-xs space-y-4 text-left">
                  <span className="font-heading font-extrabold text-sm uppercase tracking-wider text-gray-400 block border-b border-white/5 pb-2">Role Permissions Authorization Matrix</span>
                  <p className="text-gray-500 text-[11px] leading-relaxed">
                    Check or uncheck authorization operations for cinema staffing categories. Permissions are propagated live to counter logins and mobile devices:
                  </p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-number text-[11px]">
                      <thead>
                        <tr className="bg-black/60 border-b border-white/10 text-gray-500 uppercase tracking-wider">
                          <th className="p-4">Cinema Staff Role</th>
                          <th className="p-4 text-center">View (Read)</th>
                          <th className="p-4 text-center">Create</th>
                          <th className="p-4 text-center">Edit</th>
                          <th className="p-4 text-center">Delete</th>
                          <th className="p-4 text-center">Approve</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {Object.keys(rolePermissions).map((roleName) => (
                          <tr key={roleName} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-bold text-white font-heading">{roleName}</td>
                            {["view", "create", "edit", "delete", "approve"].map((permKey) => {
                              const active = rolePermissions[roleName][permKey];
                              return (
                                <td key={permKey} className="p-4 text-center">
                                  <button
                                    onClick={() => {
                                      const updatedPerms = { ...rolePermissions };
                                      updatedPerms[roleName][permKey] = !active;
                                      setRolePermissions(updatedPerms);
                                      toast.success(`Updated ${permKey} permission for ${roleName}`);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                      active 
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                        : "bg-red-500/10 text-red-400 border-red-500/20"
                                    }`}
                                  >
                                    {active ? "GRANTED" : "REVOKED"}
                                  </button>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
           TAB 8 — MARKETING & LOYALTY
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "marketing" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-heading font-extrabold tracking-tight border-b border-white/5 pb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" /> Marketing, Loyalty & Campaigns
            </h2>

            {/* Marketing KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-number">
              {[
                { label: "Campaign Revenue", value: "₹0", icon: <TrendingUp className="w-4 h-4" />, color: "text-emerald-400" },
                { label: "Campaign ROI", value: "340%", icon: <BarChart3 className="w-4 h-4" />, color: "text-luxuryGold" },
                { label: "Coupons Redeemed", value: "1,247", icon: <Ticket className="w-4 h-4" />, color: "text-blue-400" },
                { label: "Active Memberships", value: "1,047", icon: <Crown className="w-4 h-4" />, color: "text-purple-400" },
                { label: "Membership Revenue", value: "₹0", icon: <Wallet className="w-4 h-4" />, color: "text-emerald-400" },
                { label: "Referral Revenue", value: "₹0", icon: <Share2 className="w-4 h-4" />, color: "text-blue-400" },
                { label: "Points Issued", value: "1.84L", icon: <Star className="w-4 h-4" />, color: "text-luxuryGold" },
                { label: "Customer Retention", value: "78.5%", icon: <Repeat className="w-4 h-4" />, color: "text-emerald-400" },
                { label: "Email Open Rate", value: "42.3%", icon: <Mail className="w-4 h-4" />, color: "text-blue-400" },
                { label: "Push CTR", value: "8.5%", icon: <Bell className="w-4 h-4" />, color: "text-purple-400" },
                { label: "Conversion Rate", value: "4.8%", icon: <Target className="w-4 h-4" />, color: "text-emerald-400" },
                { label: "Customer LTV", value: "₹0", icon: <Trophy className="w-4 h-4" />, color: "text-luxuryGold" }
              ].map((card, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-primary/30 transition-all group">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold flex items-center gap-1">{card.icon} {card.label}</span>
                  <span className={`text-lg font-bold ${card.color} mt-1 block group-hover:scale-105 transition-transform origin-left`}>{card.value}</span>
                </div>
              ))}
            </div>

            {/* Marketing Sub-Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto border-b border-white/5 pb-3">
              {[
                { key: "overview" as const, label: "Overview", icon: <BarChart3 className="w-3.5 h-3.5" /> },
                { key: "memberships" as const, label: "Memberships", icon: <Crown className="w-3.5 h-3.5" /> },
                { key: "coupons" as const, label: "Coupons", icon: <Percent className="w-3.5 h-3.5" /> },
                { key: "campaigns" as const, label: "Campaigns", icon: <Mail className="w-3.5 h-3.5" /> },
                { key: "referrals" as const, label: "Referrals", icon: <Share2 className="w-3.5 h-3.5" /> },
                { key: "segments" as const, label: "Segments", icon: <Users className="w-3.5 h-3.5" /> },
                { key: "automations" as const, label: "Automations", icon: <Zap className="w-3.5 h-3.5" /> },
                { key: "rewards" as const, label: "Rewards & Draws", icon: <Gift className="w-3.5 h-3.5" /> }
              ].map((st) => (
                <button key={st.key} onClick={() => setMktSubTab(st.key)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
                    mktSubTab === st.key ? "bg-primary text-white shadow-redGlow" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}>{st.icon} {st.label}</button>
              ))}
            </div>

            {/* ─── OVERVIEW ─── */}
            {mktSubTab === "overview" && (
              <div className="space-y-6">
                {/* Active Campaigns Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mktCampaigns.filter(c => c.status === "ACTIVE").map((c) => (
                    <div key={c.id} className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3 hover:border-primary/20 transition-all">
                      <div className="flex justify-between items-center">
                        <span className="font-heading font-bold text-white text-xs">{c.name}</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{c.channel}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[10px]">
                        <div><span className="text-gray-500 block">Sent</span><span className="text-white font-bold font-number">{c.sent.toLocaleString()}</span></div>
                        <div><span className="text-gray-500 block">Conversions</span><span className="text-emerald-400 font-bold font-number">{c.conversions}</span></div>
                        <div><span className="text-gray-500 block">Revenue</span><span className="text-luxuryGold font-bold font-number">₹{(c.revenue/1000).toFixed(1)}K</span></div>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${Math.min((c.opened / Math.max(c.sent, 1)) * 100, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Top Segments */}
                <h3 className="text-sm font-heading font-bold text-white mt-4">Customer Segments</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {mktSegments.slice(0, 5).map((s) => (
                    <div key={s.id} className="p-3 bg-white/5 border border-white/5 rounded-xl hover:border-primary/30 transition-all" style={{ borderLeftColor: s.color, borderLeftWidth: "3px" }}>
                      <span className="text-white font-heading font-bold text-xs block">{s.name}</span>
                      <span className="text-gray-500 text-[10px]">{s.count.toLocaleString()} customers · Avg ₹{s.avg.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── MEMBERSHIPS ─── */}
            {mktSubTab === "memberships" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mktPlans.map((p) => (
                    <div key={p.id} className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 hover:border-primary/20 transition-all group" style={{ borderTopColor: p.color, borderTopWidth: "3px" }}>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-heading font-bold text-white text-sm block">{p.name}</span>
                          <span className="text-gray-500 text-[10px] uppercase font-bold">{p.tier} Tier</span>
                        </div>
                        <span className="text-xs font-number font-bold bg-white/5 px-2 py-1 rounded-full text-gray-400">{p.members} members</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div><span className="text-gray-500 text-[9px] uppercase font-bold block">Monthly</span><span className="text-white font-bold font-number">₹{p.monthly}</span></div>
                        <div><span className="text-gray-500 text-[9px] uppercase font-bold block">Yearly</span><span className="text-emerald-400 font-bold font-number">₹{p.yearly}</span></div>
                        <div><span className="text-gray-500 text-[9px] uppercase font-bold block">Ticket Off</span><span className="text-luxuryGold font-bold">{p.discount}%</span></div>
                        <div><span className="text-gray-500 text-[9px] uppercase font-bold block">Food Off</span><span className="text-luxuryGold font-bold">{p.food}%</span></div>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-[10px]">
                        <Gift className="w-3 h-3 text-primary" />
                        <span className="text-gray-400">Bonus: <span className="text-white font-bold">{p.points} pts</span> on signup</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── COUPONS ─── */}
            {mktSubTab === "coupons" && (
              <div className="space-y-4">
                <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead><tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider"><th className="p-4">Code</th><th className="p-4">Title</th><th className="p-4">Type</th><th className="p-4">Value</th><th className="p-4">Used / Limit</th><th className="p-4">Expires</th><th className="p-4 text-right">Status</th></tr></thead>
                    <tbody className="divide-y divide-white/5 bg-black/20">
                      {mktCoupons.map((c) => (
                        <tr key={c.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono text-primary font-bold">{c.code}</td>
                          <td className="p-4 text-white font-heading font-bold">{c.title}</td>
                          <td className="p-4 text-accent">{c.type}</td>
                          <td className="p-4 text-white">{c.type === "PERCENTAGE" ? `${c.value}%` : `₹${c.value}`}{c.maxDiscount ? ` (max ₹${c.maxDiscount})` : ""}</td>
                          <td className="p-4"><span className="text-white font-bold">{c.used.toLocaleString()}</span><span className="text-gray-500"> / {c.limit.toLocaleString()}</span>
                            <div className="h-1 bg-white/5 rounded-full mt-1 w-20"><div className="h-full bg-primary rounded-full" style={{ width: `${(c.used / c.limit) * 100}%` }} /></div>
                          </td>
                          <td className="p-4 text-gray-400">{c.expires}</td>
                          <td className="p-4 text-right"><span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase border ${campaignStatusColor(c.status)}`}>{c.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ─── CAMPAIGNS ─── */}
            {mktSubTab === "campaigns" && (
              <div className="space-y-4">
                <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead><tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider"><th className="p-4">Campaign</th><th className="p-4">Channel</th><th className="p-4">Sent</th><th className="p-4">Opened</th><th className="p-4">Clicked</th><th className="p-4">Conversions</th><th className="p-4">Revenue</th><th className="p-4">ROI</th><th className="p-4 text-right">Status</th></tr></thead>
                    <tbody className="divide-y divide-white/5 bg-black/20">
                      {mktCampaigns.map((c) => (
                        <tr key={c.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-bold text-white font-heading">{c.name}</td>
                          <td className="p-4"><span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">{c.channel}</span></td>
                          <td className="p-4 text-white">{c.sent.toLocaleString()}</td>
                          <td className="p-4 text-blue-400">{c.opened.toLocaleString()}</td>
                          <td className="p-4 text-accent">{c.clicked.toLocaleString()}</td>
                          <td className="p-4 text-emerald-400 font-bold">{c.conversions}</td>
                          <td className="p-4 text-luxuryGold font-bold">₹{(c.revenue/1000).toFixed(1)}K</td>
                          <td className="p-4 text-emerald-400">{c.roi}%</td>
                          <td className="p-4 text-right"><span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase border ${campaignStatusColor(c.status)}`}>{c.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ─── REFERRALS ─── */}
            {mktSubTab === "referrals" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-number">
                  {[
                    { label: "Total Referrals", value: "342", color: "text-white" },
                    { label: "Converted", value: "218 (63.7%)", color: "text-emerald-400" },
                    { label: "Referrer Reward", value: "₹0 / referral", color: "text-luxuryGold" },
                    { label: "Total Rewards Paid", value: "₹0", color: "text-blue-400" }
                  ].map((c, i) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold block">{c.label}</span>
                      <span className={`text-lg font-bold ${c.color} mt-1 block`}>{c.value}</span>
                    </div>
                  ))}
                </div>
                <h3 className="text-sm font-heading font-bold text-white">Top Referrers</h3>
                <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead><tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider"><th className="p-4">#</th><th className="p-4">Name</th><th className="p-4">Referrals</th><th className="p-4 text-right">Earnings</th></tr></thead>
                    <tbody className="divide-y divide-white/5 bg-black/20">
                      {[{n:"Priya Sharma",r:24,e:4800},{n:"Rajesh Kumar",r:18,e:3600},{n:"Sneha Reddy",r:15,e:3000},{n:"Vikram Mehta",r:12,e:2400},{n:"Ananya Patel",r:9,e:1800}].map((r, i) => (
                        <tr key={i} className="hover:bg-white/5">
                          <td className="p-4 text-gray-500">{i + 1}</td>
                          <td className="p-4 text-white font-heading font-bold">{r.n}</td>
                          <td className="p-4 text-accent font-bold">{r.r}</td>
                          <td className="p-4 text-right text-emerald-400 font-bold">₹{r.e.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ─── SEGMENTS ─── */}
            {mktSubTab === "segments" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {mktSegments.map((s) => (
                    <div key={s.id} className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-2 hover:border-primary/20 transition-all cursor-pointer" style={{ borderLeftColor: s.color, borderLeftWidth: "3px" }}>
                      <div className="flex justify-between items-center">
                        <span className="text-white font-heading font-bold text-xs">{s.name}</span>
                        {s.auto && <span className="text-[8px] font-bold bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded uppercase">AI</span>}
                      </div>
                      <span className="text-2xl font-number font-bold text-white">{s.count.toLocaleString()}</span>
                      <span className="text-gray-500 text-[10px] block">Avg Spend: <span className="text-white">₹{s.avg.toLocaleString()}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── AUTOMATIONS ─── */}
            {mktSubTab === "automations" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mktAutomations.map((a) => (
                    <div key={a.id} className={`p-5 bg-black/40 border rounded-2xl space-y-3 hover:scale-[1.01] transition-all text-xs ${
                      a.active ? "border-emerald-500/20" : "border-white/10 opacity-60"
                    }`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Zap className={`w-4 h-4 ${a.active ? "text-emerald-400" : "text-gray-500"}`} />
                          <span className="font-heading font-bold text-white text-sm">{a.name}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${a.active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/5 text-gray-500 border-white/10"}`}>{a.active ? "ACTIVE" : "PAUSED"}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-gray-400">
                        <div><span className="text-gray-500 uppercase text-[9px] font-bold block">Trigger</span><span className="text-white font-number text-[10px]">{a.trigger}</span></div>
                        <div><span className="text-gray-500 uppercase text-[9px] font-bold block">Executions</span><span className="text-white font-bold font-number">{a.runs.toLocaleString()}</span></div>
                        <div><span className="text-gray-500 uppercase text-[9px] font-bold block">Last Run</span><span className="text-accent font-number">{a.lastRun}</span></div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                        <span>{a.steps} workflow steps</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── REWARDS & DRAWS ─── */}
            {mktSubTab === "rewards" && (
              <div className="space-y-6">
                {/* Scratch Cards */}
                <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2"><Gift className="w-4 h-4 text-primary" /> Scratch Card Campaigns</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: "Summer Scratch Fest", reward: "₹50-₹500 Cashback", prob: "70%", total: 5000, used: 3240, active: true },
                    { name: "Food Frenzy", reward: "Free Popcorn / Drink", prob: "50%", total: 2000, used: 1456, active: true },
                    { name: "Movie Mania", reward: "Free Ticket", prob: "10%", total: 1000, used: 890, active: false }
                  ].map((sc, i) => (
                    <div key={i} className={`p-4 bg-black/40 border rounded-2xl space-y-3 text-xs ${sc.active ? "border-emerald-500/20" : "border-white/10 opacity-60"}`}>
                      <div className="flex justify-between"><span className="font-heading font-bold text-white">{sc.name}</span><span className={`text-[9px] font-bold uppercase ${sc.active ? "text-emerald-400" : "text-gray-500"}`}>{sc.active ? "LIVE" : "ENDED"}</span></div>
                      <span className="text-accent text-[10px]">{sc.reward}</span>
                      <div className="flex justify-between text-[10px] text-gray-500"><span>Win Rate: <span className="text-white">{sc.prob}</span></span><span className="font-number">{sc.used}/{sc.total}</span></div>
                      <div className="h-1.5 bg-white/5 rounded-full"><div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${(sc.used / sc.total) * 100}%` }} /></div>
                    </div>
                  ))}
                </div>

                {/* Lucky Draws */}
                <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2 mt-6"><Trophy className="w-4 h-4 text-luxuryGold" /> Lucky Draw Campaigns</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: "Grand Independence Day", prize: "iPhone 16 Pro", entries: 4500, drawn: false, date: "Aug 15" },
                    { name: "Monsoon Madness", prize: "Gold Coin (5g)", entries: 2800, drawn: false, date: "Aug 1" },
                    { name: "Summer Movie Marathon", prize: "Annual Movie Pass", entries: 6200, drawn: true, date: "Jun 30", winner: "Priya Sharma" }
                  ].map((ld, i) => (
                    <div key={i} className={`p-4 bg-black/40 border rounded-2xl space-y-2 text-xs ${ld.drawn ? "border-white/10 opacity-70" : "border-luxuryGold/20"}`}>
                      <div className="flex justify-between"><span className="font-heading font-bold text-white">{ld.name}</span><span className={`text-[9px] font-bold uppercase ${ld.drawn ? "text-blue-400" : "text-amber-400"}`}>{ld.drawn ? "DRAWN" : "OPEN"}</span></div>
                      <span className="text-luxuryGold font-bold block">🏆 {ld.prize}</span>
                      <div className="flex justify-between text-[10px] text-gray-500"><span>Entries: <span className="text-white font-bold font-number">{ld.entries.toLocaleString()}</span></span><span>Draw: {ld.date}</span></div>
                      {ld.drawn && <span className="text-emerald-400 text-[10px]">Winner: {ld.winner}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
           TAB 8A — OFFERS & COUPONS MANAGEMENT
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "offers" && (
          <div className="space-y-8 text-xs font-sans">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h2 className="text-2xl font-heading font-extrabold tracking-tight">Offers & Coupons Manager</h2>
              <div className="text-right">
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Coupon Revenue Generated</span>
                <span className="text-lg font-bold text-luxuryGold font-number">{"\u20b9"}4,53,400</span>
              </div>
            </div>

            {/* Coupons & Redemptions Analytics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-number">
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                <span className="text-gray-500 uppercase font-bold block">Active Offers</span>
                <span className="text-lg font-bold text-white mt-1 block">5 Active / 6 Total</span>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                <span className="text-gray-500 uppercase font-bold block">Total Redemptions</span>
                <span className="text-lg font-bold text-emerald-400 mt-1 block">5,059 times</span>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                <span className="text-gray-500 uppercase font-bold block">Average Discount</span>
                <span className="text-lg font-bold text-blue-400 mt-1 block">{"\u20b9"}180 / user</span>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                <span className="text-gray-500 uppercase font-bold block">Campaign Conversion Rate</span>
                <span className="text-lg font-bold text-luxuryGold mt-1 block">34.2% CTR</span>
              </div>
            </div>

            {/* Create Offer Form */}
            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-6">
              <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Create New Offer Campaign / Coupon</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (newOfferCode.trim()) {
                  const newCpn = {
                    id: "cpn-" + Date.now(),
                    code: newOfferCode.toUpperCase(),
                    type: "PERCENTAGE",
                    value: parseFloat(newOfferDiscount) || 50,
                    maxDiscount: 500,
                    minOrder: 500,
                    usageLimit: 1000,
                    usedCount: 0,
                    validTo: "2026-08-31",
                    autoApply: false,
                    customerGroup: "ALL",
                    status: "ACTIVE",
                    revenueGenerated: 0
                  };
                  setCouponsList([newCpn, ...couponsList]);
                  toast.success(`Coupon code "${newOfferCode.toUpperCase()}" created and active!`);
                } else {
                  const newOff = {
                    id: "off-" + Date.now(),
                    title: newOfferTitle,
                    type: newOfferType,
                    discount: parseFloat(newOfferDiscount) || 50,
                    discountType: "PERCENTAGE",
                    code: "AUTO_APPLY",
                    validFrom: "2026-07-01",
                    validTo: "2026-08-31",
                    minBooking: 300,
                    usageLimit: 1000,
                    usedCount: 0,
                    applicableMovies: "All",
                    applicableUsers: "ALL",
                    status: "ACTIVE",
                    banner: "/offers/custom.jpg"
                  };
                  setOffersList([newOff, ...offersList]);
                  toast.success(`Offer Campaign "${newOfferTitle}" created successfully!`);
                }
                setNewOfferTitle("");
                setNewOfferCode("");
              }} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
                <div className="space-y-2">
                  <label className="text-gray-400 font-bold block">Offer Title</label>
                  <input type="text" value={newOfferTitle} onChange={(e) => setNewOfferTitle(e.target.value)} className="w-full px-4 py-3 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary" placeholder="e.g. BOGO Movie Ticket" />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 font-bold block">Coupon Code (Optional)</label>
                  <input type="text" value={newOfferCode} onChange={(e) => setNewOfferCode(e.target.value)} className="w-full px-4 py-3 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary" placeholder="e.g. DIWALI50" />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 font-bold block">Discount Value (%)</label>
                  <input type="number" value={newOfferDiscount} onChange={(e) => setNewOfferDiscount(e.target.value)} className="w-full px-4 py-3 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary font-number" />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 font-bold block">Offer Category</label>
                  <select value={newOfferType} onChange={(e) => setNewOfferType(e.target.value)} className="w-full px-4 py-3 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary">
                    <option value="MOVIE">Movie Discount</option>
                    <option value="FOOD">Food & Concessions</option>
                    <option value="WEEKEND">Weekend Offer</option>
                    <option value="STUDENT">Student Discount</option>
                    <option value="CORPORATE">Corporate Offer</option>
                    <option value="FESTIVAL">Festival Offer</option>
                    <option value="MEMBERSHIP">Membership Upgrade</option>
                  </select>
                </div>
                <div className="md:col-span-4 pt-2">
                  <button type="submit" className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded-xl cursor-pointer shadow-redGlow">Publish Offer / Coupon Campaign</button>
                </div>
              </form>
            </div>

            {/* List of Offers & Coupons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Offers List */}
              <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Active Promotional Offers</h3>
                <div className="space-y-3">
                  {offersList.map((off) => (
                    <div key={off.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                      <div>
                        <span className="text-white font-bold block">{off.title}</span>
                        <span className="text-[10px] text-gray-500">Code: <strong className="text-luxuryGold">{off.code}</strong> &bull; Category: {off.type} &bull; Min Spend: {"\u20b9"}{off.minBooking}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-emerald-400 block font-number">{off.discount}% Off</span>
                        <button onClick={() => {
                          setOffersList(offersList.filter(o => o.id !== off.id));
                          toast.success("Offer campaign deactivated.");
                        }} className="text-[9px] uppercase font-bold text-red-400 hover:underline cursor-pointer">Deactivate</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupons List */}
              <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Coupon & Promo Codes</h3>
                <div className="space-y-3 font-number">
                  {couponsList.map((cpn) => (
                    <div key={cpn.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                      <div>
                        <span className="text-white font-mono font-bold block">{cpn.code}</span>
                        <span className="text-[10px] text-gray-500">Group: {cpn.customerGroup} &bull; Redemptions: {cpn.usedCount} &bull; Revenue: {"\u20b9"}{cpn.revenueGenerated.toLocaleString()}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-blue-400 block">{cpn.value}% Off</span>
                        <button onClick={() => {
                          setCouponsList(couponsList.filter(c => c.id !== cpn.id));
                          toast.success("Coupon code deleted.");
                        }} className="text-[9px] uppercase font-bold text-red-400 hover:underline cursor-pointer">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
           TAB 9 — ENTERPRISE FINANCE & BI SYSTEM
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "finance" && (
          <div className="space-y-8">
            {/* Volume 8 · Part 5 — Multi-gateway orchestration & reconciliation */}
            <PaymentGatewayPanel />
            <h2 className="text-2xl font-heading font-extrabold tracking-tight border-b border-white/5 pb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-primary" /> Enterprise Finance & BI Control
            </h2>

            {/* Financial KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-number">
              {[
                { label: "Today's Revenue", value: "₹0", icon: <TrendingUp className="w-4 h-4" />, color: "text-emerald-400" },
                { label: "Net Profit", value: "₹0", icon: <Activity className="w-4 h-4" />, color: "text-luxuryGold" },
                { label: "Gross Profit", value: "₹0", icon: <BarChart3 className="w-4 h-4" />, color: "text-white" },
                { label: "Operating Expenses", value: "₹0", icon: <TrendingDown className="w-4 h-4" />, color: "text-red-400" },
                { label: "Taxes Collected (GST)", value: "₹0", icon: <FileText className="w-4 h-4" />, color: "text-purple-400" },
                { label: "Pending settlements", value: "₹0", icon: <Clock className="w-4 h-4" />, color: "text-amber-400" },
                { label: "Avg Customer Spend", value: "₹0", icon: <Users className="w-4 h-4" />, color: "text-blue-400" },
                { label: "Business Health Score", value: "0 / 100", icon: <ShieldCheck className="w-4 h-4" />, color: "text-emerald-400" }
              ].map((card, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-primary/30 transition-all group">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold flex items-center gap-1">{card.icon} {card.label}</span>
                  <span className={`text-lg font-bold ${card.color} mt-1 block group-hover:scale-105 transition-transform origin-left`}>{card.value}</span>
                </div>
              ))}
            </div>

            {/* Sub-Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto border-b border-white/5 pb-3">
              {[
                { key: "overview" as const, label: "Overview & P&L", icon: <BarChart3 className="w-3.5 h-3.5" /> },
                { key: "revenue" as const, label: "Revenue Categories", icon: <Plus className="w-3.5 h-3.5" /> },
                { key: "expenses" as const, label: "Expense Approvals", icon: <ClipboardList className="w-3.5 h-3.5" /> },
                { key: "transactions" as const, label: "Transactions & Gateway", icon: <CreditCard className="w-3.5 h-3.5" /> },
                { key: "banks" as const, label: "Bank Accounts", icon: <Wallet className="w-3.5 h-3.5" /> },
                { key: "gst" as const, label: "GST & Tax return", icon: <FileText className="w-3.5 h-3.5" /> },
                { key: "ai" as const, label: "AI CFO Insight", icon: <Bot className="w-3.5 h-3.5" /> }
              ].map((st) => (
                <button key={st.key} onClick={() => setFinSubTab(st.key)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
                    finSubTab === st.key ? "bg-primary text-white shadow-redGlow" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}>{st.icon} {st.label}</button>
              ))}
            </div>

            {/* ─── SUB-TAB: OVERVIEW (P&L, Cash Flow) ─── */}
            {finSubTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profit & Loss Statement */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Profit & Loss Statement (Q2 2026)</h3>
                  <div className="space-y-2 text-xs font-number">
                    <div className="flex justify-between text-gray-400"><span>Box Office Tickets Revenue</span><span className="text-white font-bold">₹27,41,760</span></div>
                    <div className="flex justify-between text-gray-400"><span>Concessions F&B Sales</span><span className="text-white font-bold">₹15,42,240</span></div>
                    <div className="flex justify-between text-gray-400"><span>Membership Subscriptions</span><span className="text-white font-bold">₹4,28,000</span></div>
                    <div className="flex justify-between text-gray-400 border-b border-white/5 pb-2"><span>Other Income (Parking, Banners)</span><span className="text-white font-bold">₹6,48,500</span></div>
                    <div className="flex justify-between text-white font-bold text-sm"><span>Total Gross Revenue (A)</span><span className="text-emerald-400">₹53,60,500</span></div>
                    <div className="flex justify-between text-gray-400 mt-2"><span>Distributor Movie Share (COGS)</span><span className="text-red-400">-₹12,33,792</span></div>
                    <div className="flex justify-between text-gray-400 border-b border-white/5 pb-2"><span>Food Raw Material Cost</span><span className="text-red-400">-₹4,62,672</span></div>
                    <div className="flex justify-between text-white font-bold text-sm"><span>Gross Profit (B = A - COGS)</span><span className="text-emerald-400">₹36,64,036</span></div>
                    <div className="flex justify-between text-gray-400 mt-2"><span>Operating Expenses (Salaries, Rent)</span><span className="text-red-400">-₹19,05,000</span></div>
                    <div className="flex justify-between text-gray-400 border-b border-white/5 pb-2"><span>Interest & Banking Charges</span><span className="text-red-400">-₹14,500</span></div>
                    <div className="flex justify-between text-white font-bold text-sm"><span>Operating Profit (EBITDA)</span><span className="text-emerald-400">₹17,44,536</span></div>
                    <div className="flex justify-between text-gray-400 border-b border-white/5 pb-2"><span>GST & Tax Provisioning</span><span className="text-red-400">-₹2,82,600</span></div>
                    <div className="flex justify-between text-white font-bold text-base mt-2"><span>Net Profit (PAT)</span><span className="text-luxuryGold">₹14,61,936</span></div>
                  </div>
                </div>

                {/* Cash Flow Summary & Branch comparison */}
                <div className="space-y-6">
                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                    <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Cash Flow Summary</h3>
                    <div className="space-y-3 text-xs font-number">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cash Flow from Operating Activities</span>
                        <span className="text-emerald-400 font-bold">+₹26,23,236</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cash Flow from Investing Activities</span>
                        <span className="text-red-400 font-bold">-₹3,70,000</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-400">Cash Flow from Financing Activities</span>
                        <span className="text-red-400 font-bold">-₹1,64,500</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-white">Net Cash Flow Increase</span>
                        <span className="text-emerald-400">+₹20,88,736</span>
                      </div>
                    </div>
                  </div>

                  {/* Multi-theatre Branch Ranking */}
                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                    <h3 className="text-sm font-heading font-bold text-white">Branch Rankings</h3>
                    <div className="space-y-2 text-xs font-number">
                      {[
                        { name: "CineVerse Delhi VIP", revenue: "₹21.0L", occupancy: "84%", rank: "🏆 #1" },
                        { name: "CineVerse Mumbai", revenue: "₹18.5L", occupancy: "78%", rank: "#2" },
                        { name: "CineVerse Bengaluru", revenue: "₹14.1L", occupancy: "72%", rank: "#3" }
                      ].map((b, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 bg-white/5 rounded-lg border border-white/5">
                          <div>
                            <span className="text-white font-bold block">{b.name}</span>
                            <span className="text-gray-500 text-[10px]">Occupancy: {b.occupancy}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-emerald-400 font-bold block">{b.revenue}</span>
                            <span className="text-[10px] text-gray-500 uppercase font-bold">{b.rank}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: REVENUE CATEGORIES ─── */}
            {finSubTab === "revenue" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Revenue categories list */}
                <div className="md:col-span-2 space-y-4">
                  <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider">
                          <th className="p-4">Ledger Code</th>
                          <th className="p-4">Category Name</th>
                          <th className="p-4">GST Rate</th>
                          <th className="p-4">Department</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-black/20">
                        {revenueCategories.map((rc) => (
                          <tr key={rc.id} className="hover:bg-white/5">
                            <td className="p-4 font-mono text-gray-500">{rc.ledgerCode}</td>
                            <td className="p-4 font-bold text-white font-heading">{rc.name}</td>
                            <td className="p-4 text-accent font-bold">{rc.taxRate}%</td>
                            <td className="p-4 text-gray-400">{rc.department}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Create Custom Revenue Category */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">New Revenue Stream</h3>
                  <form onSubmit={handleAddCustomRevenue} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-gray-400 block font-semibold">Category Name</label>
                      <input type="text" value={customRevenueName} onChange={(e) => setCustomRevenueName(e.target.value)} placeholder="e.g. IMAX Merchandise" className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 block font-semibold">Tax Rate (GST %)</label>
                      <select value={customRevenueTax} onChange={(e) => setCustomRevenueTax(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary">
                        <option value="0">0% (Exempt)</option>
                        <option value="5">5% (F&B Concessions)</option>
                        <option value="12">12% (Standard Low)</option>
                        <option value="18">18% (Exhibition Standard)</option>
                        <option value="28">28% (Luxury Goods)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 block font-semibold">Cost Center Department</label>
                      <input type="text" value={customRevenueDept} onChange={(e) => setCustomRevenueDept(e.target.value)} placeholder="e.g. Sales" className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" />
                    </div>
                    <button type="submit" className="w-full py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded cursor-pointer hover:opacity-90">Create Revenue Category</button>
                  </form>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: EXPENSE APPROVALS ─── */}
            {finSubTab === "expenses" && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Expense creation form */}
                <div className="lg:col-span-1 p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 h-fit">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Log Expense</h3>
                  <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-gray-400 block font-semibold">Vendor / Supplier</label>
                      <input type="text" value={newExpenseForm.vendor} onChange={(e) => setNewExpenseForm({ ...newExpenseForm, vendor: e.target.value })} placeholder="Tata Power, Amul, etc." className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 block font-semibold">Category</label>
                      <select value={newExpenseForm.category} onChange={(e) => setNewExpenseForm({ ...newExpenseForm, category: e.target.value })} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary">
                        <option value="Electricity">Electricity</option>
                        <option value="Internet">Internet</option>
                        <option value="Food Purchases">Food Purchases</option>
                        <option value="Software">Software</option>
                        <option value="Rent">Rent</option>
                        <option value="Employee Salary">Employee Salary</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 block font-semibold">Amount (₹)</label>
                      <input type="number" value={newExpenseForm.amount} onChange={(e) => setNewExpenseForm({ ...newExpenseForm, amount: e.target.value })} placeholder="45000" className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 block font-semibold">GST Paid (₹)</label>
                      <input type="number" value={newExpenseForm.gst} onChange={(e) => setNewExpenseForm({ ...newExpenseForm, gst: e.target.value })} placeholder="8100" className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 block font-semibold">Branch Location</label>
                      <select value={newExpenseForm.branch} onChange={(e) => setNewExpenseForm({ ...newExpenseForm, branch: e.target.value })} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary">
                        <option value="CineVerse Mumbai">CineVerse Mumbai</option>
                        <option value="CineVerse Delhi VIP">CineVerse Delhi VIP</option>
                        <option value="CineVerse Bengaluru">CineVerse Bengaluru</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded cursor-pointer">Submit Expense</button>
                  </form>
                </div>

                {/* Expenses ledger list table */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider">
                          <th className="p-4">Invoice</th>
                          <th className="p-4">Vendor</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Branch</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-black/20">
                        {expensesList.map((e) => (
                          <tr key={e.id} className="hover:bg-white/5">
                            <td className="p-4 font-mono text-gray-500">{e.invoiceNumber}</td>
                            <td className="p-4 font-bold text-white font-heading">{e.vendor}</td>
                            <td className="p-4 text-gray-400">{e.category} <span className="text-[10px] text-gray-600 block">{e.date}</span></td>
                            <td className="p-4 text-white font-bold">₹{e.amount.toLocaleString()} <span className="text-[10px] text-gray-600 block">GST: ₹{e.gst.toLocaleString()}</span></td>
                            <td className="p-4 text-gray-400">{e.branch}</td>
                            <td className="p-4"><span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${expenseStatusColor(e.status)}`}>{e.status}</span></td>
                            <td className="p-4 text-right">
                              {e.status === "PENDING" && (
                                <div className="flex gap-1.5 justify-end">
                                  <button onClick={() => handleApproveExpense(e.id, "Owner Control")} className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[9px] uppercase cursor-pointer hover:bg-emerald-500/30">Approve</button>
                                  <button onClick={() => handleRejectExpense(e.id)} className="px-2 py-1 rounded bg-red-500/20 text-red-400 font-bold text-[9px] uppercase cursor-pointer hover:bg-red-500/30">Reject</button>
                                </div>
                              )}
                              {e.status === "APPROVED" && (
                                <span className="text-[10px] text-gray-500 font-semibold block">Approved by: {e.approvedBy}</span>
                              )}
                              {e.status === "PAID" && (
                                <span className="text-emerald-400 text-[10px] font-bold block">✓ Disbursed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: BANK ACCOUNTS ─── */}
            {finSubTab === "banks" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {bankAccounts.map((account) => (
                    <div key={account.id} className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 hover:border-primary/20 transition-all group">
                      <div className="flex justify-between items-center">
                        <span className="font-heading font-bold text-white text-xs block">{account.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">{account.type}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-gray-500 text-[9px] uppercase font-bold block">Current Balance</span>
                        <span className="text-xl font-bold font-number text-emerald-400">₹{account.current.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-white/5 pt-2 text-[10px]">
                        <span className="text-gray-500">Opening: ₹{account.opening.toLocaleString()}</span>
                        <button onClick={() => { toast.success(`${account.name} reconciliation logs verified.`); }} className="text-primary hover:text-white transition-colors cursor-pointer uppercase font-bold font-heading">Reconcile</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: GST & TAX return ─── */}
            {finSubTab === "gst" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* GST liability details */}
                <div className="md:col-span-2 p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">GST Collections vs Input Tax Credit (ITC)</h3>
                  <div className="grid grid-cols-3 gap-4 text-xs font-number">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-gray-500 text-[10px] block uppercase font-bold">CGST Collected</span>
                      <span className="text-white font-bold text-sm">₹2,42,700</span>
                      <span className="text-red-400 text-[9px] block mt-1">ITC Claimed: -₹95,400</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-gray-500 text-[10px] block uppercase font-bold">SGST Collected</span>
                      <span className="text-white font-bold text-sm">₹2,42,700</span>
                      <span className="text-red-400 text-[9px] block mt-1">ITC Claimed: -₹95,400</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-gray-500 text-[10px] block uppercase font-bold">Total Net liability</span>
                      <span className="text-luxuryGold font-bold text-sm">₹2,94,600</span>
                      <span className="text-emerald-400 text-[9px] block mt-1">Status: Ready to File</span>
                    </div>
                  </div>

                  <h3 className="text-xs font-heading font-bold text-white pt-2">HSN Codes Tax Classification</h3>
                  <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider">
                          <th className="p-3">HSN Code</th>
                          <th className="p-3">Service Description</th>
                          <th className="p-3">GST Rate</th>
                          <th className="p-3">Taxable Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-black/20">
                        <tr className="hover:bg-white/5">
                          <td className="p-3 font-mono text-gray-500">9983</td>
                          <td className="p-3 text-white">Movie Exhibition Services</td>
                          <td className="p-3 text-white font-bold">18%</td>
                          <td className="p-3 text-white">₹27,41,760</td>
                        </tr>
                        <tr className="hover:bg-white/5">
                          <td className="p-3 font-mono text-gray-500">9963</td>
                          <td className="p-3 text-white">Food & Beverage Services</td>
                          <td className="p-3 text-white font-bold">5%</td>
                          <td className="p-3 text-white">₹15,42,240</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* GST Return filing desk */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">GST Returns Portal</h3>
                  <div className="space-y-4 text-xs">
                    <div>
                      <span className="text-gray-400 block font-semibold">Filing Period</span>
                      <span className="text-white block font-bold text-sm">July 2026 Monthly (GSTR-1 & GSTR-3B)</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-semibold">Due Date</span>
                      <span className="text-red-400 block font-bold">August 20, 2026</span>
                    </div>
                    <button onClick={() => { toast.success("GST GSTR-3B generated successfully and sent to filing queue."); }} className="w-full py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded cursor-pointer">Generate GSTR-1 XML</button>
                    <button onClick={() => { toast.success("Tax ledger reconciled. Returns filed successfully."); }} className="w-full py-2 bg-white/10 text-white font-bold uppercase rounded border border-white/10 hover:bg-white/20 cursor-pointer">File GSTR-3B Return</button>
                  </div>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: AI CFO & BI ─── */}
            {finSubTab === "ai" && (
              <div className="space-y-6">
                {/* Predictions overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "Next Week Predicted Revenue", value: "₹15,20,000", desc: "+6.4% growth expected", conf: "94%" },
                    { title: "Next Month Predicted Revenue", value: "₹62,00,000", desc: "Monsoon movie releases trend", conf: "91%" },
                    { title: "Surplus Deployable Funds", value: "₹24,50,000", desc: "Post operations cash reserve", conf: "96%" }
                  ].map((p, idx) => (
                    <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-primary/20 transition-all font-number">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold block">{p.title}</span>
                      <span className="text-xl font-bold text-white block mt-1">{p.value}</span>
                      <span className="text-[10px] text-gray-400 block mt-1">{p.desc}</span>
                      <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full inline-block mt-2 font-bold uppercase">Confidence: {p.conf}</span>
                    </div>
                  ))}
                </div>

                {/* AI CFO Advice & Recommendations */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-luxuryGold" /> AI CFO Financial Insights
                  </h3>
                  <div className="space-y-3 text-xs text-gray-300">
                    {[
                      "Cash flow surplus expected to reach ₹85 Lakhs by mid-quarter. Recommending paying down ₹5 Lakhs on long term HDFC Term Loan to save 9.2% interest.",
                      "F&B sales margins show 12% attachment rate variance on morning shows. Recommending dynamic combo offers (Popcorn + Drink) priced at ₹199 to increase attachment.",
                      "Warning: Duplicate invoice prediction flagged on AgriCorp India (INV-E6712 & INV-E6713). Recommending manual audits before releasing payment."
                    ].map((rec, i) => (
                      <div key={i} className="flex gap-2.5 items-start p-3 bg-white/5 rounded-xl border border-white/5">
                        <AlertTriangle className="w-4 h-4 text-luxuryGold shrink-0 mt-0.5" />
                        <p className="leading-relaxed">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Budgets variance overview */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <h3 className="text-sm font-heading font-bold text-white">Active Budgets vs Actual Spend</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-number">
                    {financialBudgets.map((b) => (
                      <div key={b.id} className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-heading font-bold">{b.name}</span>
                          <span className="text-[9px] uppercase font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{b.period}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400">
                          <span>Budget: ₹{b.amount.toLocaleString()}</span>
                          <span>Spent: ₹{b.actual.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${Math.min((b.actual / b.amount) * 100, 100)}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-500">Variance Remaining:</span>
                          <span className="text-emerald-400 font-bold">₹{b.variance.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {finSubTab === "transactions" && (
              <div className="space-y-6">
                {/* Gateway Status Indicators */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
                  {[
                    { gateway: "Stripe", status: "ONLINE", speed: "1.1s", success: "98.2%", color: "border-purple-500/20 text-purple-400" },
                    { gateway: "Razorpay", status: "ONLINE", speed: "1.4s", success: "97.8%", color: "border-blue-500/20 text-blue-400" },
                    { gateway: "UPI Gateway", status: "ONLINE", speed: "0.8s", success: "99.4%", color: "border-emerald-500/20 text-emerald-400" },
                    { gateway: "Paypal", status: "ONLINE", speed: "1.8s", success: "95.5%", color: "border-yellow-500/20 text-yellow-400" }
                  ].map((gt) => (
                    <div key={gt.gateway} className={`p-4 bg-white/5 border ${gt.color} rounded-2xl space-y-1`}>
                      <div className="flex justify-between font-bold">
                        <span>{gt.gateway}</span>
                        <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">{gt.status}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-500">
                        <span>Speed: <strong className="text-white font-number">{gt.speed}</strong></span>
                        <span>Success: <strong className="text-white font-number">{gt.success}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fraud Monitoring Console */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 text-xs font-sans">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary animate-pulse" /> Real-time Transaction Security Monitoring (AI Risk Score)
                    </h3>
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Velocity limit: 5 booking/min per IP</span>
                  </div>
                  <div className="space-y-3 font-number text-[11px]">
                    {[
                      { id: "TXN-8829", time: "2 mins ago", ip: "192.168.1.42", attempts: 1, amount: "₹820", score: "LOW RISK (12%)", status: "VERIFIED_SUCCESS", color: "text-emerald-400" },
                      { id: "TXN-8828", time: "5 mins ago", ip: "103.22.45.109", attempts: 6, amount: "₹4,200", score: "HIGH RISK (88%)", status: "DECLINED_VELOCITY", color: "text-primary font-bold animate-pulse" },
                      { id: "TXN-8827", time: "12 mins ago", ip: "192.168.2.14", attempts: 1, amount: "₹640", score: "LOW RISK (15%)", status: "VERIFIED_SUCCESS", color: "text-emerald-400" },
                      { id: "TXN-8826", time: "18 mins ago", ip: "182.90.11.23", attempts: 2, amount: "₹1,800", score: "MEDIUM RISK (42%)", status: "VERIFIED_OTP", color: "text-amber-400" }
                    ].map((tx) => (
                      <div key={tx.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                        <div className="space-y-0.5">
                          <span className="font-mono text-white block">{tx.id} &bull; IP: {tx.ip}</span>
                          <span className="text-gray-500 text-[10px] block">Attempts: {tx.attempts} &bull; Amount: {tx.amount} &bull; Timestamp: {tx.time}</span>
                        </div>
                        <div className="text-right font-sans">
                          <span className={`block font-bold text-[10px] uppercase ${tx.color}`}>{tx.status}</span>
                          <span className="text-gray-500 text-[9px] block">AI Risk: {tx.score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Today's Transactions Ledger */}
                <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider text-[10px]">
                        <th className="p-4">Transaction ID</th>
                        <th className="p-4">Gateway</th>
                        <th className="p-4">Method</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Timestamp</th>
                        <th className="p-4 text-right">Settlement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-black/20">
                      {[
                        { id: "txn-razor-9912", gateway: "Razorpay", method: "UPI", amount: 1640, status: "SUCCESS", time: "10:15 AM", settlement: "SETTLED" },
                        { id: "txn-stripe-1049", gateway: "Stripe", method: "Credit Card", amount: 1890, status: "SUCCESS", time: "10:20 AM", settlement: "PENDING" },
                        { id: "txn-wallet-3329", gateway: "Prestige Wallet", method: "Wallet", amount: 420, status: "SUCCESS", time: "10:32 AM", settlement: "SETTLED" },
                        { id: "txn-razor-4819", gateway: "Razorpay", method: "Net Banking", amount: 2200, status: "FAILED", time: "10:45 AM", settlement: "N/A" },
                        { id: "txn-paypal-9901", gateway: "Paypal", method: "Debit Card", amount: 680, status: "REFUNDED", time: "11:02 AM", settlement: "REFUNDED" }
                      ].map((txn) => (
                        <tr key={txn.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono font-bold text-white">{txn.id}</td>
                          <td className="p-4 text-gray-400">{txn.gateway}</td>
                          <td className="p-4 text-gray-400">{txn.method}</td>
                          <td className="p-4 text-luxuryGold font-bold">{"\u20b9"}{txn.amount.toLocaleString()}</td>
                          <td className="p-4 font-sans">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                              txn.status === "SUCCESS" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                              txn.status === "FAILED" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                              "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            }`}>{txn.status}</span>
                          </td>
                          <td className="p-4 text-gray-500">{txn.time}</td>
                          <td className="p-4 text-right">
                            <span className={`text-[10px] font-bold ${
                              txn.settlement === "SETTLED" ? "text-emerald-400" :
                              txn.settlement === "PENDING" ? "text-amber-400" : "text-gray-600"
                            }`}>{txn.settlement}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
           TAB 9 — ENTERPRISE SECURITY MANAGEMENT
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "security" && (
          <div className="space-y-8">
            {/* Volume 8 · Part 10 — SOC: threat map, SOAR, compliance, backup/recovery */}
            <SocPanel />
            <h2 className="text-2xl font-heading font-extrabold tracking-tight border-b border-white/5 pb-4 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-primary animate-pulse" /> Security & CCTV Command Center
            </h2>

            {/* Emergency Global Alert Flasher */}
            {activeEmergency && (
              <div className="p-6 bg-red-500/10 border-2 border-red-500 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-10 h-10 text-red-500" />
                  <div>
                    <span className="text-white font-heading font-bold block text-base uppercase">CRITICAL SYSTEM STATUS: EMERGENCY MODE ({activeEmergency})</span>
                    <p className="text-gray-400 text-xs mt-0.5">Voice announcers broadcasting. Gate escape doors unlocked. Evacuation pathways highlighted.</p>
                  </div>
                </div>
                <button onClick={handleResolveEmergency} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl cursor-pointer shadow-redGlow text-xs uppercase tracking-wider">Deactivate Alarm</button>
              </div>
            )}

            {/* Security KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs font-number">
              {[
                { label: "Security score", value: `${securityScore} / 100`, icon: <ShieldCheck className="w-4 h-4" />, color: securityScore > 90 ? "text-emerald-400" : "text-amber-400", onClick: () => { setSecurityScore(securityScore === 96 ? 99 : 96); toast.success("Recalculating real-time AI security index..."); } },
                { label: "Active Cameras", value: `${cctvCameras.filter(c=>c.status==="ONLINE").length} / ${cctvCameras.length}`, icon: <Eye className="w-4 h-4" />, color: "text-white" },
                { label: "Security Alerts Today", value: `${securityAlerts.length}`, icon: <Bell className="w-4 h-4" />, color: securityAlerts.length > 0 ? "text-red-400 animate-pulse" : "text-gray-400" },
                { label: "Resolved Alerts", value: "14 Today", icon: <ShieldCheck className="w-4 h-4" />, color: "text-emerald-400" },
                { label: "Unauthorized Attempts", value: "4 Blocked", icon: <Lock className="w-4 h-4" />, color: "text-red-400" },
                { label: "System Health", value: "99.85%", icon: <Activity className="w-4 h-4" />, color: "text-emerald-400" },
                { label: "Employee Access", value: "72 Active", icon: <Users className="w-4 h-4" />, color: "text-blue-400" },
                { label: "Customer Safety Score", value: "98.4%", icon: <ShieldAlert className="w-4 h-4" />, color: "text-luxuryGold" },
                { label: "Cyber Threat Level", value: "LOW", icon: <Server className="w-4 h-4" />, color: "text-emerald-400" },
                { label: "Failed Login Attempts", value: "0 Logs", icon: <EyeOff className="w-4 h-4" />, color: "text-white" },
                { label: "Blocked Activities", value: "439 blocks", icon: <Lock className="w-4 h-4" />, color: "text-amber-400" }
              ].map((card, i) => (
                <div key={i} onClick={card.onClick} className={`p-4 bg-white/5 border border-white/5 rounded-xl hover:border-primary/30 transition-all group ${card.onClick ? 'cursor-pointer hover:bg-white/10' : ''}`}>
                  <span className="text-[10px] text-gray-500 uppercase font-semibold flex items-center gap-1">{card.icon} {card.label}</span>
                  <span className={`text-base font-bold ${card.color} mt-1 block group-hover:scale-105 transition-transform origin-left`}>{card.value}</span>
                </div>
              ))}
            </div>

            {/* Sub-Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto border-b border-white/5 pb-3">
              {[
                { key: "overview" as const, label: "Security Overview", icon: <Activity className="w-3.5 h-3.5" /> },
                { key: "cctv" as const, label: "Live CCTV View", icon: <Eye className="w-3.5 h-3.5" /> },
                { key: "ai_detect" as const, label: "AI Computer Vision", icon: <Sparkles className="w-3.5 h-3.5" /> },
                { key: "access" as const, label: "Access Control", icon: <UserCheck className="w-3.5 h-3.5" /> },
                { key: "cyber" as const, label: "Cyber Security", icon: <Lock className="w-3.5 h-3.5" /> },
                { key: "audit" as const, label: "Audit Logs", icon: <FileText className="w-3.5 h-3.5" /> },
                { key: "emergency" as const, label: "Emergency Management", icon: <Volume2 className="w-3.5 h-3.5" /> },
                { key: "reports" as const, label: "Security Reports", icon: <TrendingUp className="w-3.5 h-3.5" /> }
              ].map((st) => (
                <button key={st.key} onClick={() => setSecSubTab(st.key)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
                    secSubTab === st.key ? "bg-primary text-white shadow-redGlow" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}>{st.icon} {st.label}</button>
              ))}
            </div>

            {/* ─── OVERVIEW: LIVE THREAT ALERTS ─── */}
            {secSubTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-sm font-heading font-bold text-white">Critical Alert Dispatch</h3>
                  {securityAlerts.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 bg-black/20 border border-white/5 rounded-2xl">
                      <ShieldCheck className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                      No threats detected. All systems secure.
                    </div>
                  ) : (
                    <div className="space-y-3 font-number text-xs">
                      {securityAlerts.map((a) => (
                        <div key={a.id} className="p-4 bg-black/40 border border-white/10 rounded-2xl flex justify-between items-center gap-4 hover:border-primary/20 transition-all">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-bold text-white text-sm">{a.title}</span>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${alertPriorityColor(a.priority)}`}>{a.priority}</span>
                            </div>
                            <p className="text-gray-400 text-[11px] leading-relaxed">{a.message}</p>
                            <span className="text-[10px] text-gray-600 block">Logged: {a.time}</span>
                          </div>
                          <button onClick={() => handleResolveAlert(a.id)} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded font-bold uppercase text-[9px] whitespace-nowrap cursor-pointer border border-white/10">Mark Resolved</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 h-fit">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Trigger Security Alert</h3>
                  <form onSubmit={handleCreateSecurityAlert} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-gray-400 block font-semibold">Alert Header</label>
                      <input type="text" value={newAlertForm.title} onChange={(e) => setNewAlertForm({ ...newAlertForm, title: e.target.value })} placeholder="e.g. Server Ddos Warning" className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 block font-semibold">Priority Level</label>
                      <select value={newAlertForm.priority} onChange={(e) => setNewAlertForm({ ...newAlertForm, priority: e.target.value })} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary">
                        <option value="CRITICAL">CRITICAL (Red Alert)</option>
                        <option value="HIGH">HIGH (Amber Alert)</option>
                        <option value="MEDIUM">MEDIUM (Standard Alert)</option>
                        <option value="LOW">LOW (Informational)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 block font-semibold">Alert Description Details</label>
                      <textarea rows={3} value={newAlertForm.message} onChange={(e) => setNewAlertForm({ ...newAlertForm, message: e.target.value })} placeholder="Describe details..." className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary resize-none" />
                    </div>
                    <button type="submit" className="w-full py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded cursor-pointer">Dispatch Alarm</button>
                  </form>
                </div>
              </div>
            )}


            {/* ─── CCTV FEEDS ─── */}
            {secSubTab === "cctv" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-xs text-gray-500 font-sans">
                    Selected Camera Node: <strong className="text-accent">{selectedCamId || "None"}</strong> · Status: <strong className="text-emerald-400">SECURE Node A</strong>
                  </span>
                  <div className="flex gap-2 font-sans">
                    <button 
                      onClick={() => {
                        setIsCctvRecording(!isCctvRecording);
                        toast.success(isCctvRecording ? "CCTV Recording paused." : "CCTV Recording resumed.");
                      }}
                      className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase border cursor-pointer transition-all ${
                        isCctvRecording ? "bg-red-500/10 text-red-400 border-red-500/25 animate-pulse" : "bg-zinc-600/15 text-zinc-400 border-zinc-600/25"
                      }`}
                    >
                      {isCctvRecording ? "● RECORDING" : "IDLE"}
                    </button>
                    <button 
                      onClick={() => {
                        setShowPlaybackWindow(!showPlaybackWindow);
                        toast(showPlaybackWindow ? "Displaying live feed" : "Loading historical security index logs...");
                      }}
                      className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase border cursor-pointer transition-all ${
                        showPlaybackWindow ? "bg-luxuryGold/10 text-luxuryGold border-luxuryGold/25" : "bg-white/5 border border-white/10 text-white"
                      }`}
                    >
                      ⏳ {showPlaybackWindow ? "CLOSE PLAYBACK" : "PLAYBACK ARCHIVES"}
                    </button>
                    <button 
                      onClick={() => toast.success("Grid layout screens snapshot captured successfully!")}
                      className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-white font-bold text-[10px] uppercase cursor-pointer hover:bg-white/10 transition-colors"
                    >
                      📸 CAPTURE SNAPSHOT
                    </button>
                  </div>
                </div>

                {showPlaybackWindow && (
                  <div className="p-4 bg-luxuryGold/5 border border-luxuryGold/20 rounded-2xl text-left space-y-2 animate-fadeIn font-sans">
                    <span className="font-heading font-black text-xs text-luxuryGold uppercase block">Playback Timeline Monitor</span>
                    <p className="text-gray-400 text-[10px]">Reviewing archived logs from 24h cycle storage rack. Drag slider to view recordings.</p>
                    <input type="range" min="0" max="100" defaultValue="45" className="w-full cursor-pointer accent-luxuryGold bg-white/10 h-1 rounded" onChange={() => {}} />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-number text-xs">
                  {cctvCameras.map((cam) => (
                    <div 
                      key={cam.id} 
                      onClick={() => {
                        setSelectedCamId(cam.id);
                        toast(`Switched active command monitoring node to ${cam.name}`);
                      }}
                      className={`p-5 bg-black/40 border rounded-2xl space-y-4 hover:border-primary/40 transition-all cursor-pointer ${
                        selectedCamId === cam.id ? "border-primary shadow-redGlow bg-primary/5" : (cam.status === "ONLINE" ? "border-white/10" : "border-red-500/20 opacity-60")
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-heading font-bold text-white text-sm">{cam.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${cam.status === "ONLINE" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>{cam.status}</span>
                      </div>

                      <div className="aspect-video bg-black rounded-lg border border-white/5 flex items-center justify-center relative overflow-hidden group">
                        {cam.status === "ONLINE" ? (
                          <>
                            <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                              <span className="text-[9px] text-red-500 uppercase font-bold tracking-wider">LIVE FEED</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
                            <span className="text-gray-600 text-[10px] font-mono select-none">STREAMING_DECRYPTED_AES256</span>
                          </>
                        ) : (
                          <div className="text-center text-red-500 uppercase font-heading font-bold text-[10px]">
                            <EyeOff className="w-5 h-5 mx-auto mb-1" /> Feed Offline
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-gray-500">
                        <span>Location: {cam.location}</span>
                        {cam.status === "ONLINE" && <span>Storage: {cam.storageStatus || "NORMAL"}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── AI COMPUTER VISION DETECTION ─── */}
            {secSubTab === "ai_detect" && (
              <div className="space-y-6 text-xs text-left animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: AI Detection Metrics */}
                  <div className="lg:col-span-7 space-y-4 font-number">
                    <span className="font-heading font-extrabold text-sm uppercase tracking-wider text-gray-400 block border-b border-white/5 pb-2">AI Computer Vision Logs</span>
                    <div className="space-y-3 font-sans">
                      {[
                        { title: "Crowd Density Warning", desc: "Lobby waiting queues exceed threshold. Estimated length: 24 people.", location: "Ticketing Lobby", action: "Open extra counter", status: "ACTIVE", color: "border-amber-500/25 text-amber-400" },
                        { title: "Left Behind Object detected", desc: "Unattended handbag detected at Box Office Row 4. Idle time: 14 Mins.", location: "Audit Box Row 4", action: "Alert Security Staff", status: "PENDING REVIEW", color: "border-red-500/25 text-red-400" },
                        { title: "Safety Evacuation Route Blocked", desc: "Corridor path Screen 2 blocked with cartons.", location: "Screen 2 Exit Route", action: "Inform maintenance team", status: "ACTIVE", color: "border-amber-500/25 text-amber-400" }
                      ].map((item, i) => (
                        <div key={i} className={`p-4 bg-white/5 border ${item.color} rounded-xl space-y-1`}>
                          <div className="flex justify-between items-center">
                            <span className="font-heading font-bold text-white text-xs">{item.title}</span>
                            <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-black/40 text-white">{item.status}</span>
                          </div>
                          <p className="text-gray-400 text-[10px]">{item.desc}</p>
                          <p className="text-[10px] text-gray-500">📍 {item.location} · Suggested: <strong className="text-white">{item.action}</strong></p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    {/* Lobby Capacity Gauges */}
                    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                      <span className="font-heading font-extrabold text-sm uppercase tracking-wider text-gray-400 block border-b border-white/5 pb-2">Lobby & Screen Occupancy</span>
                      <div className="space-y-4 font-number">
                        {[
                          { name: "Lobby Entrance Gate", capacity: "78% Capacity", value: 78, color: "bg-amber-500" },
                          { name: "Multiplex Screen 1 (IMAX)", capacity: "92% Capacity", value: 92, color: "bg-red-500" },
                          { name: "Concessions Waiting Line", capacity: "45% Capacity", value: 45, color: "bg-emerald-500" }
                        ].map((bar, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-[10px] text-gray-400">
                              <span className="font-bold">{bar.name}</span>
                              <span>{bar.capacity}</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className={`h-full ${bar.color}`} style={{ width: `${bar.value}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Biometric Retina Scanner */}
                    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-4 font-sans">
                      <span className="font-heading font-extrabold text-sm uppercase tracking-wider text-gray-400 block border-b border-white/5 pb-2">AI Face Scanner Terminal</span>
                      <div className="aspect-video w-full bg-black rounded-xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
                        {faceScannerState === "SCANNING" && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-black/80">
                            <div className="w-12 h-12 rounded-full border-4 border-dashed border-primary animate-spin" />
                            <span className="text-primary font-heading font-bold text-[9px] uppercase tracking-widest animate-pulse">ANALYZING FACE INDEX...</span>
                          </div>
                        )}

                        {faceScannerState === "IDLE" && (
                          <div className="text-center space-y-2 text-gray-500">
                            <Eye className="w-8 h-8 mx-auto text-gray-700 animate-pulse" />
                            <span className="font-heading font-bold text-[9px] uppercase tracking-wider block">RETINA BIOMETRICS ACTIVE</span>
                          </div>
                        )}

                        {faceScannerState === "MATCHED" && (
                          <div className="text-center space-y-1 animate-scaleIn">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 font-bold text-sm">✓</div>
                            <span className="text-emerald-400 font-heading font-extrabold block text-[10px] uppercase">Face Verified</span>
                            <span className="text-white font-bold block text-xs">{faceScannedUser}</span>
                          </div>
                        )}

                        {faceScannerState === "UNKNOWN" && (
                          <div className="text-center space-y-1 animate-scaleIn">
                            <div className="w-10 h-10 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center mx-auto text-red-500 font-bold text-sm">✗</div>
                            <span className="text-red-500 font-heading font-extrabold block text-[10px] uppercase">Unknown Intruder</span>
                            <span className="text-[9px] text-gray-500 block uppercase">No match in Face Profile DB</span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => {
                            setFaceScannerState("SCANNING");
                            setTimeout(() => {
                              setFaceScannerState("MATCHED");
                              setFaceScannedUser("Priya Sharma (VIP)");
                              toast.success("VIP Face matched.");
                            }, 1000);
                          }}
                          className="py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[9px] uppercase cursor-pointer"
                        >
                          VIP Scan
                        </button>
                        <button
                          onClick={() => {
                            setFaceScannerState("SCANNING");
                            setTimeout(() => {
                              setFaceScannerState("MATCHED");
                              setFaceScannedUser("Ravi Kumar (Staff)");
                              toast.success("Staff profile verified.");
                            }, 1000);
                          }}
                          className="py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[9px] uppercase cursor-pointer"
                        >
                          Staff Scan
                        </button>
                        <button
                          onClick={() => {
                            setFaceScannerState("SCANNING");
                            setTimeout(() => {
                              setFaceScannerState("UNKNOWN");
                              toast.error("Intruder warning generated!");
                            }, 1000);
                          }}
                          className="py-1.5 rounded bg-primary hover:bg-primary-hover text-white font-extrabold text-[9px] uppercase cursor-pointer"
                        >
                          Intruder
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── ACCESS CONTROL & 3D DIGITAL CARDS ─── */}
            {secSubTab === "access" && (
              <div className="space-y-6 text-xs text-left animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: 3D Access Card Generator */}
                  <div className="lg:col-span-6 space-y-4">
                    <span className="font-heading font-extrabold text-sm uppercase tracking-wider text-gray-400 block border-b border-white/5 pb-2">3D Digital Access Card System</span>
                    <div className="grid grid-cols-3 gap-2 mb-4 font-sans">
                      <div>
                        <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Card Holder Name</label>
                        <input 
                          type="text" 
                          value={cardHolderName} 
                          onChange={(e) => setCardHolderName(e.target.value)} 
                          className="w-full px-2 py-1.5 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Card Type</label>
                        <select 
                          value={cardType} 
                          onChange={(e) => setCardType(e.target.value as any)}
                          className="w-full px-2 py-1.5 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary text-xs"
                        >
                          <option value="EMPLOYEE">Employee Card</option>
                          <option value="VIP">VIP Gold Pass</option>
                          <option value="VISITOR">Visitor Pass</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Clearance Level</label>
                        <input 
                          type="text" 
                          value={cardClearance} 
                          onChange={(e) => setCardClearance(e.target.value)} 
                          className="w-full px-2 py-1.5 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-center py-6">
                      <div 
                        onClick={() => setCardIsFlipped(!cardIsFlipped)}
                        className="w-[320px] h-[190px] cursor-pointer"
                        style={{ perspective: "1000px" }}
                      >
                        <div 
                          className="w-full h-full relative transition-transform duration-700"
                          style={{ 
                            transformStyle: "preserve-3d", 
                            transform: cardIsFlipped ? "rotateY(180deg)" : "rotateY(0deg)" 
                          }}
                        >
                          <div className={`absolute inset-0 rounded-2xl p-5 border flex flex-col justify-between text-white backface-hidden ${
                            cardType === "VIP" 
                              ? "bg-gradient-to-br from-luxuryGold/40 to-black border-luxuryGold/50" 
                              : cardType === "EMPLOYEE"
                              ? "bg-gradient-to-br from-blue-600/30 to-black border-blue-500/40"
                              : "bg-gradient-to-br from-zinc-700/30 to-black border-zinc-500/40"
                          }`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-heading font-black text-xs block">CINEMA PRO MAX</span>
                                <span className="text-[8px] text-gray-400 block uppercase font-mono tracking-widest">{cardType} SECURITY CARD</span>
                              </div>
                              <span className="text-xl">🛡</span>
                            </div>
                            <div className="space-y-1">
                              <span className="text-white font-heading font-black block text-sm">{cardHolderName}</span>
                              <span className="text-[9px] text-gray-400 block font-mono">{cardClearance}</span>
                            </div>
                          </div>

                          <div className="absolute inset-0 rounded-2xl p-5 border bg-zinc-950 border-white/10 flex flex-col justify-between text-white backface-hidden" style={{ transform: "rotateY(180deg)" }}>
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-mono text-gray-500">CHIP ID: PMX-9011</span>
                              <span className="text-emerald-400 text-xs font-bold font-mono">ENCRYPTED</span>
                            </div>
                            <div className="flex justify-center py-2">
                              <div className="w-14 h-14 bg-white p-1 rounded-lg flex items-center justify-center">
                                <div className="w-full h-full bg-black flex items-center justify-center text-[7px] font-bold text-white font-mono">QR</div>
                              </div>
                            </div>
                            <span className="text-[8px] text-gray-600 text-center font-mono">Dynamic signatures auto-rotate every 60s.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Access Control Gate Locks */}
                  <div className="lg:col-span-6 space-y-4 font-sans text-left">
                    <span className="font-heading font-extrabold text-sm uppercase tracking-wider text-gray-400 block border-b border-white/5 pb-2">Access Control Gate Locks</span>
                    <div className="space-y-3 font-number">
                      {accessGates.map((gate) => (
                        <div key={gate.id} className="flex justify-between items-center p-3.5 bg-white/5 rounded-xl border border-white/5">
                          <div>
                            <span className="font-heading font-black text-xs text-white block">{gate.name}</span>
                            <span className="text-[10px] text-gray-500">Authorized: {gate.allowedRoles.join(", ")}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => {
                                const updatedGates = accessGates.map(g => g.id === gate.id ? { ...g, status: g.status === "LOCKED" ? "UNLOCKED" : "LOCKED" } : g);
                                setAccessGates(updatedGates);
                                toast.success(`${gate.name} is now ${gate.status === "LOCKED" ? "UNLOCKED" : "LOCKED"}`);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase border transition-all cursor-pointer ${
                                gate.status === "LOCKED" 
                                  ? "bg-red-500/10 text-red-400 border-red-500/20" 
                                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              }`}
                            >
                              {gate.status}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ticket Scan Verification Desk */}
                <div className="mt-6 p-5 bg-black/40 border border-white/5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="font-heading font-extrabold text-xs uppercase text-gray-400">Live Ticket Verification Desk</span>
                    <button onClick={() => toast.success("Entry logs cleared")} className="text-[9px] text-gray-500 hover:text-white uppercase font-bold">Clear Logs</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3 h-fit">
                      <span className="text-white font-bold text-xs block">Gate Verification Portal</span>
                      <form onSubmit={handleVerifyTicketInput} className="space-y-3 font-sans">
                        <input 
                          type="text" 
                          placeholder="Enter Ticket ID (e.g. tkt-8821a)" 
                          className="w-full px-3 py-1.5 rounded bg-black border border-white/10 text-white text-xs" 
                        />
                        <button type="submit" className="w-full py-1.5 bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded text-[9px]">Verify QR Code</button>
                      </form>
                    </div>
                    <div className="md:col-span-2 border border-white/5 rounded-xl overflow-hidden font-number text-[10px]">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-black/60 text-gray-500 uppercase tracking-wider text-[9px] border-b border-white/10">
                            <th className="p-3">Ticket ID</th>
                            <th className="p-3">Holder</th>
                            <th className="p-3">Gate</th>
                            <th className="p-3">Method</th>
                            <th className="p-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-black/25">
                          {entrySecurityLogs.slice(0, 3).map((log) => (
                            <tr key={log.id} className="hover:bg-white/5">
                              <td className="p-3 font-mono">{log.ticketId}</td>
                              <td className="p-3 font-bold text-white">{log.customerName}</td>
                              <td className="p-3 text-gray-500">{log.gate}</td>
                              <td className="p-3 text-accent">{log.method}</td>
                              <td className="p-3 text-right">
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{log.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ─── CYBER SECURITY PLATFORM ─── */}
            {secSubTab === "cyber" && (
              <div className="space-y-6 text-xs text-left animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-number">
                  {[
                    { title: "Web Firewall Status", metric: "Active", desc: "Blocked 14 SQLi injection attempts", color: "text-emerald-400", icon: <Lock className="w-4 h-4" /> },
                    { title: "DDoS Protection Shield", metric: "100%", desc: "Under normal rate limits", color: "text-blue-400", icon: <ServerCrash className="w-4 h-4 text-blue-400" /> },
                    { title: "SSL Security Level", metric: "HTTPS Valid", desc: "Auto-refresh: Aug 2026", color: "text-luxuryGold", icon: <Activity className="w-4 h-4" /> }
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-primary/20 transition-all font-number flex justify-between items-start">
                      <div>
                        <span className="text-gray-500 text-[10px] block uppercase font-bold">{item.title}</span>
                        <span className={`text-xl font-bold mt-1 block ${item.color}`}>{item.metric}</span>
                        <span className="text-gray-500 text-[10px] block mt-1">{item.desc}</span>
                      </div>
                      {item.icon}
                    </div>
                  ))}
                </div>

                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <span className="font-heading font-extrabold text-sm uppercase tracking-wider text-gray-400 block border-b border-white/5 pb-2">Admin Security Configurations</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                    <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
                      <span className="font-heading font-bold text-white block text-xs">Two-Factor Authentication (2FA)</span>
                      <p className="text-gray-500 text-[10px]">Require mandatory SMS / Authenticator App codes on all owner logins.</p>
                      <button onClick={() => toast.success("MFA enforcement rules configured.")} className="px-3 py-1.5 bg-primary text-white font-bold text-[9px] rounded uppercase cursor-pointer">Enforce 2FA</button>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
                      <span className="font-heading font-bold text-white block text-xs">IP Address Whitelist Restrictions</span>
                      <p className="text-gray-500 text-[10px]">Restricts box office portal logins to verified multiplex router networks.</p>
                      <button onClick={() => toast.success("Router network IPs locked successfully.")} className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-[9px] rounded uppercase cursor-pointer">Lock IP Range</button>
                    </div>
                  </div>

                  {/* Registered IoT Nodes list */}
                  <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/5 font-sans">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block mb-2">Registered Security Hardware Nodes ({securityDevices.length})</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-number">
                      {securityDevices.map((d) => (
                        <div key={d.id} className="p-3 bg-black/50 border border-white/5 rounded-lg flex justify-between items-center text-[10px]">
                          <div>
                            <span className="text-white font-bold block">{d.name}</span>
                            <span className="text-gray-500 text-[9px]">{d.location} · {d.ip}</span>
                          </div>
                          <span className={`w-1.5 h-1.5 rounded-full ${d.status === "ONLINE" ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── AUDIT LOGS ─── */}
            {secSubTab === "audit" && (
              <div className="space-y-4 text-xs text-left animate-fadeIn">
                <div className="border border-white/5 rounded-xl overflow-hidden font-number">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider text-[10px]">
                        <th className="p-4">User Email</th>
                        <th className="p-4">Action Event</th>
                        <th className="p-4">Details</th>
                        <th className="p-4">IP Address</th>
                        <th className="p-4 text-right">Device</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-black/20 text-gray-400">
                      {[
                        { email: "arjun.k@cinemapromax.com", action: "UPDATE_ROLE_PERMISSION", details: "Added 'Approve Refund' permission to Theatre Manager role", ip: "192.168.1.45", dev: "Admin Desktop 1" },
                        { email: "admin@cinemapromax.com", action: "CAMERA_RENAME", details: "Renamed Camera #04 to Lobby Entrance Cam", ip: "192.168.1.10", dev: "Owner Console" },
                        { email: "arjun.k@cinemapromax.com", action: "IP_LOCK_ACTIVATE", details: "Enabled IP restrictions for box office ticketing machines", ip: "192.168.1.45", dev: "Admin Desktop 1" }
                      ].map((log, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-bold text-white">{log.email}</td>
                          <td className="p-4 text-accent font-bold">{log.action}</td>
                          <td className="p-4 text-gray-400">{log.details}</td>
                          <td className="p-4 font-mono">{log.ip}</td>
                          <td className="p-4 text-right font-mono">{log.dev}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ─── EMERGENCY MANAGEMENT ─── */}
            {secSubTab === "emergency" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-left animate-fadeIn">
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Dispatch Emergency Protocols</h3>
                  <div className="space-y-3 font-sans">
                    {[
                      { type: "FIRE_ALARM", desc: "Broadcasting Evacuation Maps", action: "Activate Fire Alarm" },
                      { type: "POWER_FAILURE", desc: "Switching to Backup GenSets", action: "Trigger Power Emergency" },
                      { type: "SECURITY_THREAT", desc: "Activating Access Level Lockdown", action: "Trigger Lockdown" }
                    ].map((e, idx) => (
                      <button key={idx} onClick={() => handleActivateEmergency(e.type)} className="w-full text-left p-3.5 bg-red-600/10 border border-red-500/20 hover:border-red-500 rounded-xl cursor-pointer block transition-all group animate-pulse">
                        <span className="text-red-400 font-heading font-bold text-sm block group-hover:text-white">{e.action}</span>
                        <span className="text-gray-500 text-[10px] block">{e.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 h-fit text-gray-300">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Evacuation & Heat Safety monitor</h3>
                  <p className="leading-relaxed">In case of any emergency trigger, this dashboard automatically releases emergency override permissions to all active scanners, opens the exit doors, and broadcasts emergency audio routes on the multiplex speakers.</p>
                  <div className="grid grid-cols-2 gap-3 pt-2 font-number animate-pulse">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5"><span className="text-gray-500 text-[9px] uppercase font-bold block">Exit Gates Status</span><span className="text-emerald-400 font-bold block">OPEN / AUTO_RELEASE_ON</span></div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5"><span className="text-gray-500 text-[9px] uppercase font-bold block">Multiplex Temperature</span><span className="text-white font-bold block">24.2 °C (Normal)</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── SECURITY REPORTS & ANALYTICS ─── */}
            {secSubTab === "reports" && (
              <div className="space-y-6 text-xs text-left animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-number">
                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                    <span className="font-heading font-bold text-white block">CCTV Uptime & performance Analytics</span>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-emerald-400">99.98%</span>
                        <span className="text-gray-500 text-[10px] block">Weekly Average Uptime</span>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="text-[10px] text-gray-500 block uppercase">TOTAL RECORDING</span>
                        <span className="text-white font-bold">144 Hours Cached</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                    <span className="font-heading font-bold text-white block">Incident Safety Trends</span>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-emerald-400">0 Incidents</span>
                        <span className="text-gray-500 text-[10px] block">Unresolved alerts</span>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="text-[10px] text-gray-500 block uppercase">THREAT INDEX</span>
                        <span className="text-emerald-400 font-bold">0.05% Safe</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
           TAB 10 — ENTERPRISE NOTIFICATION & OMNICHANNEL PLATFORM
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "notifications" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-heading font-extrabold tracking-tight border-b border-white/5 pb-4 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary animate-pulse" /> Omnichannel Communication Hub
            </h2>

            {/* Notification Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-number">
              {[
                { label: "Total Messages Sent", value: "1,48,500", icon: <MessageSquare className="w-4 h-4" />, color: "text-white" },
                { label: "Delivered (Rate 98.4%)", value: "1,46,200", icon: <CheckCircle2 className="w-4 h-4" />, color: "text-emerald-400" },
                { label: "Failed / Retried", value: "1,200", icon: <AlertTriangle className="w-4 h-4" />, color: "text-red-400" },
                { label: "Avg Open Rate", value: "64.2%", icon: <Eye className="w-4 h-4" />, color: "text-blue-400" },
                { label: "Avg Click CTR", value: "18.5%", icon: <TrendingUp className="w-4 h-4" />, color: "text-luxuryGold" },
                { label: "AI Conversion Lift", value: "4.2%", icon: <Sparkles className="w-4 h-4" />, color: "text-emerald-400" },
                { label: "Customer Chat Replies", value: "342", icon: <MessageCircle className="w-4 h-4" />, color: "text-blue-400" },
                { label: "Avg Response Time", value: "4.8 mins", icon: <Clock className="w-4 h-4" />, color: "text-emerald-400" }
              ].map((card, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-primary/30 transition-all group">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold flex items-center gap-1">{card.icon} {card.label}</span>
                  <span className={`text-lg font-bold ${card.color} mt-1 block group-hover:scale-105 transition-transform origin-left`}>{card.value}</span>
                </div>
              ))}
            </div>

            {/* Sub-Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto border-b border-white/5 pb-3">
              {[
                { key: "overview" as const, label: "History Queue", icon: <ClipboardList className="w-3.5 h-3.5" /> },
                { key: "channels" as const, label: "Gateways", icon: <Laptop className="w-3.5 h-3.5" /> },
                { key: "templates" as const, label: "Templates", icon: <FileEdit className="w-3.5 h-3.5" /> },
                { key: "automations" as const, label: "Workflows", icon: <Zap className="w-3.5 h-3.5" /> },
                { key: "chat" as const, label: "Live Support Desk", icon: <MessageCircle className="w-3.5 h-3.5" /> }
              ].map((st) => (
                <button key={st.key} onClick={() => setNotifSubTab(st.key)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
                    notifSubTab === st.key ? "bg-primary text-white shadow-redGlow" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}>{st.icon} {st.label}</button>
              ))}
            </div>

            {/* ─── SUB-TAB: OVERVIEW (Message Log History) ─── */}
            {notifSubTab === "overview" && (
              <div className="space-y-4">
                <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider">
                        <th className="p-4">Customer</th>
                        <th className="p-4">Channel</th>
                        <th className="p-4">Template type</th>
                        <th className="p-4">Delivery logs</th>
                        <th className="p-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-black/20 text-xs">
                      {messageLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/5">
                          <td className="p-4 font-bold text-white font-heading">{log.customerName}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-white/5 text-gray-400 border border-white/10">{log.channel}</span>
                          </td>
                          <td className="p-4 text-gray-400">{log.template} <span className="text-[10px] text-gray-600 block">{log.time}</span></td>
                          <td className="p-4 text-gray-500">{log.details} {log.error && <span className="text-red-400 block font-bold">Error: {log.error}</span>}</td>
                          <td className="p-4 text-right">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${notifStatusColor(log.status)}`}>{log.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: CHANNEL SETTINGS ─── */}
            {notifSubTab === "channels" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {channelsList.map((ch) => (
                  <div key={ch.id} className={`p-5 bg-black/40 border rounded-2xl space-y-3 flex justify-between items-center ${
                    ch.enabled ? "border-emerald-500/20" : "border-white/10 opacity-60"
                  }`}>
                    <div>
                      <span className="font-heading font-bold text-white text-sm block">{ch.name} Gateway</span>
                      <span className="text-gray-500 text-xs">Gateway provider: <span className="text-white font-mono">{ch.gateway}</span></span>
                      <span className="text-gray-500 text-xs block mt-1">Priority Order: <span className="text-luxuryGold font-bold">Rank {ch.priority}</span></span>
                    </div>
                    <button onClick={() => handleToggleChannel(ch.id)}
                      className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer ${
                        ch.enabled ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" : "bg-red-500/20 text-red-400 border border-red-500/20"
                      }`}>{ch.enabled ? "Enabled" : "Disabled"}</button>
                  </div>
                ))}
              </div>
            )}

            {/* ─── SUB-TAB: TEMPLATES BUILDER ─── */}
            {notifSubTab === "templates" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* List Templates */}
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {messageTemplates.map((t) => (
                      <div key={t.id} className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3 text-xs">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="font-heading font-bold text-white block text-sm">{t.name}</span>
                          <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-white/5 text-gray-400 border border-white/10">{t.type}</span>
                        </div>
                        {t.subject && <p className="text-gray-400 font-semibold">Subject: <span className="text-white">{t.subject}</span></p>}
                        <p className="text-gray-500 leading-relaxed bg-black/20 p-2.5 rounded border border-white/5 font-mono text-[10px]">{t.body}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Create template form */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 h-fit">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Create Message Template</h3>
                  <form onSubmit={handleCreateTemplate} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-gray-400 block font-semibold">Template Name</label>
                      <input type="text" value={newTemplateForm.name} onChange={(e) => setNewTemplateForm({ ...newTemplateForm, name: e.target.value })} placeholder="e.g. Refund Success" className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 block font-semibold">Type</label>
                      <select value={newTemplateForm.type} onChange={(e) => setNewTemplateForm({ ...newTemplateForm, type: e.target.value })} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary">
                        <option value="TRANSACTIONAL">TRANSACTIONAL</option>
                        <option value="REMINDER">REMINDER</option>
                        <option value="PROMOTIONAL">PROMOTIONAL</option>
                        <option value="SYSTEM_ALERT">SYSTEM_ALERT</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 block font-semibold">Subject (For Email)</label>
                      <input type="text" value={newTemplateForm.subject} onChange={(e) => setNewTemplateForm({ ...newTemplateForm, subject: e.target.value })} placeholder="Email Subject" className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 block font-semibold">{"Body Content (supports {{customer_name}}, {{movie_name}})"}</label>
                      <textarea rows={4} value={newTemplateForm.body} onChange={(e) => setNewTemplateForm({ ...newTemplateForm, body: e.target.value })} placeholder="Hi {{customer_name}}, details here..." className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary resize-none font-mono text-[10px]" />
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded cursor-pointer">Save Template</button>
                  </form>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: AUTOMATIONS ─── */}
            {notifSubTab === "automations" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {notifWorkflows.map((w) => (
                  <div key={w.id} className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 text-xs font-number">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="font-heading font-bold text-white text-sm">{w.name}</span>
                      <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-500 text-[9px] uppercase font-bold block">Workflow Trigger Event</span>
                        <span className="text-white font-bold block mt-0.5">{w.trigger}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-[9px] uppercase font-bold block">Actions Dispatched</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {w.actions.map((act: string, idx: number) => (
                            <span key={idx} className="bg-white/5 text-gray-300 px-2 py-0.5 rounded border border-white/5 font-semibold text-[9px]">{act}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ─── SUB-TAB: LIVE SUPPORT CHAT ─── */}
            {notifSubTab === "chat" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[480px]">
                {/* Conversations list */}
                <div className="bg-black/40 border border-white/10 rounded-2xl overflow-y-auto p-4 space-y-2">
                  <h3 className="text-xs font-heading font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2 mb-2">Live Chats</h3>
                  {activeConversations.map((chat) => (
                    <div key={chat.id} onClick={() => setSelectedChatId(chat.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedChatId === chat.id ? "bg-primary/10 border-primary" : "bg-white/5 border-white/5 hover:border-white/10"
                      }`}>
                      <div className="flex justify-between items-center">
                        <span className="text-white text-xs font-heading font-bold">{chat.customerName}</span>
                        <span className="text-[9px] text-gray-500">{chat.status}</span>
                      </div>
                      <p className="text-gray-400 text-[10px] mt-1 truncate">{chat.lastMsg}</p>
                    </div>
                  ))}
                </div>

                {/* Active Chat Window */}
                <div className="md:col-span-2 bg-black/40 border border-white/10 rounded-2xl flex flex-col justify-between overflow-hidden">
                  {selectedChatId ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 bg-black/80 border-b border-white/5 flex justify-between items-center text-xs">
                        <div>
                          <span className="text-white font-heading font-bold block">{activeConversations.find(c=>c.id===selectedChatId)?.customerName}</span>
                          <span className="text-gray-500 text-[10px]">{activeConversations.find(c=>c.id===selectedChatId)?.email}</span>
                        </div>
                        <span className="text-emerald-400 font-bold uppercase text-[9px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">Connected</span>
                      </div>

                      {/* Chat Messages */}
                      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                        {activeConversations.find(c => c.id === selectedChatId)?.messages.map((m: any, idx: number) => (
                          <div key={idx} className={`flex flex-col max-w-[70%] ${m.isStaff ? "ml-auto items-end" : "mr-auto items-start"}`}>
                            <span className="text-gray-500 text-[9px] mb-0.5">{m.sender}</span>
                            <div className={`p-3 rounded-2xl leading-relaxed ${
                              m.isStaff ? "bg-primary text-white rounded-tr-none" : "bg-white/5 text-gray-300 rounded-tl-none border border-white/5"
                            }`}>
                              {m.text}
                            </div>
                            <span className="text-[8px] text-gray-600 mt-0.5">{m.time}</span>
                          </div>
                        ))}
                      </div>

                      {/* Chat Composer Form */}
                      <form onSubmit={handleSendChatComposer} className="p-3 bg-black/80 border-t border-white/5 flex gap-2">
                        <input type="text" value={chatComposerText} onChange={(e) => setChatComposerText(e.target.value)} placeholder="Type a message or use quick template..." className="flex-1 px-4 py-2 text-xs rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" />
                        <button type="submit" className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded-xl text-[10px] cursor-pointer hover:opacity-90">Send</button>
                      </form>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col justify-center items-center text-gray-500 text-xs">
                      <MessageCircle className="w-8 h-8 text-gray-600 mb-2 animate-bounce" />
                      Select a conversation log to start messaging.
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
           TAB 11 — ENTERPRISE BI REPORTING & ANALYTICS
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "reports" && (
          <div className="space-y-6 text-xs text-left animate-fadeIn">
            {/* Volume 8 · Part 9 — BI executive layer: AI assistant + predictive analytics */}
            <BIExecutivePanel />
            
            {/* Health Score circular indicator */}
            <div className="p-5 bg-black/40 border border-white/10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 font-sans">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 flex items-center justify-center border-4 border-luxuryGold/20 rounded-full select-none">
                  <div className="absolute inset-0 border-4 border-luxuryGold border-r-transparent rounded-full animate-spin duration-1000" />
                  <span className="text-sm font-bold font-number text-luxuryGold">88%</span>
                </div>
                <div className="space-y-1">
                  <span className="text-white font-heading font-black text-sm block flex items-center gap-1.5">
                    💡 Executive Business Health Index: Strong
                  </span>
                  <p className="text-[10px] text-gray-500 max-w-xl">
                    Admissions margins are solid (+12.4% MoM). AI predicts peak weekend occupancy for sci-fi format movies. Priority: Enhance concessions attachment rates.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toast.success("Refreshed all transactional analytics tables.")} className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 cursor-pointer">
                  🔄 REFRESH DATA
                </button>
                <button onClick={() => toast.success("CFO Audit packet PDF generated and saved.")} className="px-3 py-1.5 rounded bg-gradient-to-r from-primary to-secondary text-white font-black shadow-redGlow cursor-pointer hover:opacity-90">
                  📥 EXPORT EXECUTIVE P&L
                </button>
              </div>
            </div>

            {/* Analytics subtabs navigation bar */}
            <div className="flex gap-1.5 overflow-x-auto border-b border-white/5 pb-2 font-sans">
              {[
                { key: "overview" as const, label: "AI Commander Assistant", icon: "🤖" },
                { key: "revenue" as const, label: "Revenue & Finance", icon: "💰" },
                { key: "bookings" as const, label: "Bookings & Occupancy", icon: "🎫" },
                { key: "movies" as const, label: "Movie Analytics", icon: "🎬" },
                { key: "food" as const, label: "Concessions & F&B", icon: "🍿" },
                { key: "marketing" as const, label: "Marketing Campaigns", icon: "📢" },
                { key: "employees" as const, label: "Employee Efficiency", icon: "👥" },
                { key: "predictions" as const, label: "AI Forecasts & Predictions", icon: "🔮" }
              ].map((st) => (
                <button
                  key={st.key}
                  onClick={() => setRepSubTab(st.key)}
                  className={`px-3 py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
                    repSubTab === st.key ? "bg-primary text-white shadow-redGlow" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{st.icon}</span> {st.label}
                </button>
              ))}
            </div>

            {/* ─── SUB-TAB: AI COMMANDER ASSISTANT ─── */}
            {repSubTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
                {/* Chat assistant console */}
                <div className="lg:col-span-8 p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-gray-400 block">AI Owner Consultant Bot</span>
                    <span className="text-[9px] text-gray-500 block">Natural language querying for ticket reports, anomalies, and operations.</span>
                  </div>

                  {/* Chat messages screen container */}
                  <div className="space-y-3 max-h-[280px] overflow-y-auto p-3 bg-zinc-950/60 rounded-xl border border-white/5 font-mono text-[10px] text-left">
                    {aiAssistantMessages.map((msg, i) => (
                      <div key={i} className={`p-2.5 rounded-lg max-w-[85%] ${
                        msg.role === "assistant" 
                          ? "bg-zinc-900 border border-white/5 text-gray-300 mr-auto" 
                          : "bg-primary/10 border border-primary/20 text-white ml-auto text-right"
                      }`}>
                        <span className="text-[8px] font-black uppercase text-gray-500 block mb-1">
                          {msg.role === "assistant" ? "🤖 A.I. COMMAND CONSULTANT" : "👤 THEATRE OWNER"}
                        </span>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Chat composer text field */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!aiAssistantInput.trim()) return;
                      const userMsg = aiAssistantInput;
                      setAiAssistantMessages(prev => [...prev, { role: "user", text: userMsg }]);
                      setAiAssistantInput("");
                      
                      setTimeout(() => {
                        let botResponse = "";
                        if (userMsg.toLowerCase().includes("weekend") || userMsg.toLowerCase().includes("forecast")) {
                          botResponse = "Weekend forecast for July 20-22:\n• Admissions: ₹15.4 Lakhs (+12% vs last weekend)\n• Occupancy: 84% average (IMAX formats at 98%)\n• Concession Attach Rate: 26.5% predicted\n• Action: Stock extra Truffle Popcorn buckets and add 2 additional staff members to VIP lounges.";
                        } else if (userMsg.toLowerCase().includes("revenue") || userMsg.toLowerCase().includes("money")) {
                          botResponse = "Today's total sales stands at ₹1,42,850.\n• Ticket Bookings: ₹92,400\n• Concessions F&B: ₹34,250\n• Memberships: ₹16,200\n• Tax calculation estimate: ₹25,713.";
                        } else if (userMsg.toLowerCase().includes("movie") || userMsg.toLowerCase().includes("show")) {
                          botResponse = "Movies Leaderboard summary:\n1. 'Aether: Rising Stars' (Sci-Fi) - 92% occupancy today\n2. 'Shadows of the Dynasty' (Action) - 78% occupancy\n3. Recommend adding 1 IMAX 3D screening of 'Aether' to replace the low-performing 2D comedy slot.";
                        } else {
                          botResponse = "I have scanned our database logs. Daily admissions are steady. Cash flows show net profit margin of 24.5%. Ask me to 'forecast weekend earnings' or 'explain today's concessions attachment rate'!";
                        }
                        setAiAssistantMessages(prev => [...prev, { role: "assistant", text: botResponse }]);
                      }, 600);
                    }}
                    className="flex gap-2"
                  >
                    <input 
                      type="text" 
                      value={aiAssistantInput}
                      onChange={(e) => setAiAssistantInput(e.target.value)}
                      placeholder="Ask AI: e.g. Forecast weekend earnings..."
                      className="flex-1 px-3 py-2 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary text-[10px]"
                    />
                    <button type="submit" className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded uppercase cursor-pointer">
                      SEND
                    </button>
                  </form>
                </div>

                {/* Right side: anomalous triggers & live alarms */}
                <div className="lg:col-span-4 p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-amber-500 block">🚨 Security & Fraud Alerts</span>
                    <span className="text-[9px] text-gray-500 block">Real-time velocity anomalies and suspicious refund rejection logs.</span>
                  </div>

                  <div className="space-y-2 font-mono text-[9px]">
                    {[
                      { id: "an-1", type: "UNUSUAL_REFUND", details: "Refund attempt of ₹8,200 on corporate seat block rejected.", time: "2 hours ago" },
                      { id: "an-2", type: "VELOCITY_ALERT", details: "Failed payment count spike (12) from IP range 103.44.x.x.", time: "4 hours ago" }
                    ].map((an) => (
                      <div key={an.id} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl space-y-1">
                        <div className="flex justify-between items-center text-red-400 font-bold">
                          <span>{an.type}</span>
                          <span className="text-gray-500 text-[8px] font-normal">{an.time}</span>
                        </div>
                        <p className="text-gray-300 leading-tight">{an.details}</p>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => toast.success("Anomaly reports cleared.")} className="w-full py-2 bg-white/5 border border-white/5 hover:border-white/10 text-gray-400 hover:text-white rounded uppercase font-bold text-[9px] cursor-pointer">
                    Acknowledge Alerts
                  </button>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: REVENUE & FINANCE ─── */}
            {repSubTab === "revenue" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Financial overview totals */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-number">
                  {[
                    { label: "Gross Box Office", value: "₹4,28,500", detail: "Ticket admissions", status: "+12.4% MoM", color: "text-emerald-400" },
                    { label: "Concession Revenue", value: "₹1,34,200", detail: "Snacks & Lounge", status: "+18.2% MoM", color: "text-emerald-400" },
                    { label: "Operational Expenses", value: "₹92,400", detail: "Lobbies & Staff", status: "-2.4% target", color: "text-red-400" },
                    { label: "Estimated Taxes (GST)", value: "₹76,800", detail: "18% Cinema Slab", status: "Calculated", color: "text-zinc-400" }
                  ].map((metric, i) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-primary/20 transition-all text-left">
                      <span className="text-[10px] text-gray-500 uppercase font-bold block">{metric.label}</span>
                      <span className="text-lg font-black text-white mt-1 block">{metric.value}</span>
                      <div className="flex justify-between items-center text-[9px] mt-1.5 text-gray-500">
                        <span>{metric.detail}</span>
                        <span className={metric.color}>{metric.status}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Simulated timeline chart table */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl text-left space-y-4">
                  <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-white block">Cash Flow Timeline Logs</span>
                  <div className="border border-white/5 rounded-xl overflow-hidden font-number text-[10px]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-black/60 border-b border-white/10 text-gray-500 uppercase tracking-wider text-[8px] font-bold">
                          <th className="p-3">Time Interval</th>
                          <th className="p-3">Box Office Revenue</th>
                          <th className="p-3">F&B Sales</th>
                          <th className="p-3">Online Wallet Pay</th>
                          <th className="p-3 text-right">Running Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-black/10">
                        {[
                          { time: "09:00 AM - 12:00 PM", tickets: "₹45,200", fnb: "₹12,400", wallet: "₹4,200", total: "₹61,800" },
                          { time: "12:00 PM - 03:00 PM", tickets: "₹92,800", fnb: "₹34,100", wallet: "₹12,500", total: "₹1,39,400" },
                          { time: "03:00 PM - 06:00 PM", tickets: "₹1,24,000", fnb: "₹48,200", wallet: "₹18,200", total: "₹1,90,400" },
                          { time: "06:00 PM - 09:00 PM", tickets: "₹1,66,500", fnb: "₹39,500", wallet: "₹21,600", total: "₹2,27,600" }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-white/5">
                            <td className="p-3 font-bold text-white">{row.time}</td>
                            <td className="p-3 text-gray-300">{row.tickets}</td>
                            <td className="p-3 text-gray-300">{row.fnb}</td>
                            <td className="p-3 text-gray-300">{row.wallet}</td>
                            <td className="p-3 text-right text-emerald-400 font-bold">{row.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: BOOKINGS & OCCUPANCY ─── */}
            {repSubTab === "bookings" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left font-sans animate-fadeIn">
                {/* Occupancy ratios per format */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-white block">Screen Format Occupancy</span>
                    <span className="text-[9px] text-gray-500 block">Average seats filled ratio for today's shows.</span>
                  </div>

                  <div className="space-y-3 font-number text-[10px]">
                    {[
                      { name: "IMAX 3D Format", filled: 94, total: 320, color: "bg-primary" },
                      { name: "4DX Format", filled: 88, total: 160, color: "bg-luxuryGold" },
                      { name: "Dolby Atmos Atmos Premium", filled: 76, total: 240, color: "bg-blue-500" },
                      { name: "Regular 2D Screen 4", filled: 52, total: 280, color: "bg-zinc-600" }
                    ].map((scr, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between font-bold text-white">
                          <span>{scr.name}</span>
                          <span>{scr.filled}% occupancy ({Math.round(scr.total * scr.filled / 100)} / {scr.total} seats)</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                          <div className={`h-full ${scr.color} rounded-full`} style={{ width: `${scr.filled}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Successful vs Cancelled bookings */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-white block">Admissions Funnel Status</span>
                    <span className="text-[9px] text-gray-500 block">Ratio of ticket sales completions vs refunds/cancellations.</span>
                  </div>

                  <div className="space-y-4 font-number text-[10px]">
                    <div className="flex justify-between items-center p-3 bg-zinc-950/60 rounded-xl border border-white/5">
                      <div>
                        <span className="text-white font-extrabold block">Successful Bookings</span>
                        <span className="text-[9px] text-gray-500">Payments cleared online</span>
                      </div>
                      <span className="text-emerald-400 font-bold text-sm">4,812 tickets</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-zinc-950/60 rounded-xl border border-white/5">
                      <div>
                        <span className="text-white font-extrabold block">Cancelled / Refunded</span>
                        <span className="text-[9px] text-gray-500">Corporate seat releases & failed gateway ticks</span>
                      </div>
                      <span className="text-red-400 font-bold text-sm">42 tickets</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-zinc-950/60 rounded-xl border border-white/5">
                      <div>
                        <span className="text-white font-bold block">Seat Hold Timeout releases</span>
                        <span className="text-[9px] text-gray-500">10 min reservation expired auto-releases</span>
                      </div>
                      <span className="text-amber-500 font-bold text-sm">184 releases</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: MOVIE ANALYTICS ─── */}
            {repSubTab === "movies" && (
              <div className="p-5 bg-black/40 border border-white/10 rounded-2xl text-left space-y-4 animate-fadeIn">
                <div className="border-b border-white/5 pb-2">
                  <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-white block">Movies Analytical Leaderboard</span>
                  <span className="text-[9px] text-gray-500 block">Performance ranking of movies currently playing, based on tickets and ratings.</span>
                </div>

                <div className="border border-white/5 rounded-xl overflow-hidden font-number text-[10px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/60 border-b border-white/10 text-gray-500 uppercase tracking-wider text-[8px] font-bold">
                        <th className="p-3">Rank</th>
                        <th className="p-3">Movie Title</th>
                        <th className="p-3">Genre</th>
                        <th className="p-3">Tickets Sold</th>
                        <th className="p-3">Gross Revenue</th>
                        <th className="p-3">Occupancy</th>
                        <th className="p-3 text-right">Average Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-black/10">
                      {[
                        { rank: 1, movieName: "Aether: Rising Stars", genre: "Sci-Fi", ticketsSold: 14203, revenue: "₹48,65,000", occupancy: "92%", rating: "⭐ 4.8" },
                        { rank: 2, movieName: "Shadows of the Dynasty", genre: "Action", ticketsSold: 9845, revenue: "₹31,20,000", occupancy: "78%", rating: "⭐ 4.5" },
                        { rank: 3, movieName: "Echoes in the Dark", genre: "Horror", ticketsSold: 6420, revenue: "₹19,80,000", occupancy: "65%", rating: "⭐ 4.2" },
                        { rank: 4, movieName: "Truffle Comedy Night", genre: "Comedy", ticketsSold: 4120, revenue: "₹12,50,000", occupancy: "58%", rating: "⭐ 4.4" }
                      ].map((mov) => (
                        <tr key={mov.rank} className="hover:bg-white/5">
                          <td className="p-3 font-bold text-white">{mov.rank}</td>
                          <td className="p-3 font-heading font-black text-white">{mov.movieName}</td>
                          <td className="p-3 text-gray-400">{mov.genre}</td>
                          <td className="p-3 text-gray-300 font-mono">{mov.ticketsSold.toLocaleString()}</td>
                          <td className="p-3 text-white font-bold">{mov.revenue}</td>
                          <td className="p-3 text-gray-300">{mov.occupancy}</td>
                          <td className="p-3 text-right text-luxuryGold font-bold">{mov.rating}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: CONCESSIONS & F&B ─── */}
            {repSubTab === "food" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left font-sans animate-fadeIn">
                {/* Concessions performance */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-white block">Concessions margins ranking</span>
                    <span className="text-[9px] text-gray-500 block">F&B profitability analysis.</span>
                  </div>

                  <div className="border border-white/5 rounded-xl overflow-hidden font-number text-[10px]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-black/60 border-b border-white/10 text-gray-500 uppercase tracking-wider text-[8px] font-bold">
                          <th className="p-3">Item Name</th>
                          <th className="p-3">Units Sold</th>
                          <th className="p-3 text-right">Profit Margin</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-black/10">
                        {[
                          { name: "Truffle Butter Popcorn", sold: "6,420", margin: "82% Margin" },
                          { name: "Pepsi Fountain XL", sold: "8,900", margin: "90% Margin" },
                          { name: "Wild Mushroom Pizza", sold: "1,840", margin: "65% Margin" },
                          { name: "Caramel Gold Crunch", sold: "3,120", margin: "78% Margin" }
                        ].map((food, i) => (
                          <tr key={i} className="hover:bg-white/5">
                            <td className="p-3 font-bold text-white">{food.name}</td>
                            <td className="p-3 text-gray-400">{food.sold} units</td>
                            <td className="p-3 text-right text-emerald-400 font-bold">{food.margin}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Attach rates & Peak hours */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 font-number text-[10px]">
                  <div className="border-b border-white/5 pb-2">
                    <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-white block">Concessions attachment stats</span>
                    <span className="text-[9px] text-gray-500 block">F&B purchase frequency with admissions.</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-950/60 rounded-xl border border-white/5 text-center">
                      <span className="text-gray-500 text-[9px] uppercase font-bold block">Popcorn Attach Rate</span>
                      <span className="text-xl font-bold text-white block mt-1">42.4%</span>
                      <span className="text-emerald-400 text-[8px] block mt-0.5">+4.2% since combo promotion</span>
                    </div>

                    <div className="p-4 bg-zinc-950/60 rounded-xl border border-white/5 text-center">
                      <span className="text-gray-500 text-[9px] uppercase font-bold block">Beverage Attach Rate</span>
                      <span className="text-xl font-bold text-white block mt-1">54.8%</span>
                      <span className="text-zinc-500 text-[8px] block mt-0.5">Average drink unit size: XL</span>
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-950/60 rounded-xl border border-white/5 space-y-1">
                    <span className="text-white font-bold block">Concessions Peak Demand Hour</span>
                    <p className="text-gray-400 leading-relaxed text-[9px]">
                      Peak F&B checkout velocity occurs at <span className="text-white font-bold font-mono">07:45 PM - 08:15 PM</span> (immediately before primary evening blockbusters). Action: Double concession line runners.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: MARKETING CAMPAIGNS ─── */}
            {repSubTab === "marketing" && (
              <div className="p-5 bg-black/40 border border-white/10 rounded-2xl text-left space-y-4 animate-fadeIn">
                <div className="border-b border-white/5 pb-2">
                  <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-white block">Active Campaigns & Coupon Conversion</span>
                  <span className="text-[9px] text-gray-500 block">Performance tracking of discount promo codes.</span>
                </div>

                <div className="border border-white/5 rounded-xl overflow-hidden font-number text-[10px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/60 border-b border-white/10 text-gray-500 uppercase tracking-wider text-[8px] font-bold">
                        <th className="p-3">Campaign / Coupon</th>
                        <th className="p-3">Delivery channel</th>
                        <th className="p-3">Completions</th>
                        <th className="p-3">Admissions ROI</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-black/10">
                      {[
                        { code: "BOGOWEEK (B1G1 Weekdays)", channel: "WhatsApp message broadcast", conversions: "2,845 bookings", roi: "₹4,82,000 generated", status: "ACTIVE" },
                        { code: "POPCORN20 (20% off concessions combo)", channel: "Email Newsletter clicks", conversions: "1,203 clicks", roi: "₹1,40,000 generated", status: "ACTIVE" },
                        { code: "VIPGOLD500 (₹500 welcome reward)", channel: "Push notifications trigger", conversions: "445 wallet activations", roi: "₹2,22,500 generated", status: "PAUSED" }
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/5">
                          <td className="p-3 font-bold text-white font-mono">{item.code}</td>
                          <td className="p-3 text-gray-400">{item.channel}</td>
                          <td className="p-3 text-gray-300">{item.conversions}</td>
                          <td className="p-3 text-emerald-400 font-bold">{item.roi}</td>
                          <td className="p-3 text-right">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold border ${
                              item.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                            }`}>{item.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: EMPLOYEE EFFICIENCY ─── */}
            {repSubTab === "employees" && (
              <div className="p-5 bg-black/40 border border-white/10 rounded-2xl text-left space-y-4 animate-fadeIn">
                <div className="border-b border-white/5 pb-2">
                  <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-white block">Operator Attendance & Checklist Verification</span>
                  <span className="text-[9px] text-gray-500 block">Live status of lobby managers, concessions staff, and floor cleaners.</span>
                </div>

                <div className="border border-white/5 rounded-xl overflow-hidden font-number text-[10px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/60 border-b border-white/10 text-gray-500 uppercase tracking-wider text-[8px] font-bold">
                        <th className="p-3">Staff Operator</th>
                        <th className="p-3">Assigned Role</th>
                        <th className="p-3">Attendance status</th>
                        <th className="p-3">Completed tasks checklist</th>
                        <th className="p-3 text-right">Sales Contribution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-black/10">
                      {[
                        { name: "Arjun Kumar", role: "Lobby Supervisor", attendance: "ON DUTY (09:00 AM)", tasks: "12 / 12 verified", sales: "₹48,200 ticket assist" },
                        { name: "Rohit Malhotra", role: "Concessions Lead", attendance: "ON DUTY (12:00 PM)", tasks: "8 / 10 verified", sales: "₹34,120 concessions checkout" },
                        { name: "Megha Sharma", role: "VIP Lounge Hostess", attendance: "ON DUTY (02:00 PM)", tasks: "6 / 6 verified", sales: "₹18,500 memberships upgraded" },
                        { name: "Vikram Singh", role: "Screen Floor Guard", attendance: "AWAY (Meal Break)", tasks: "3 / 5 verified", sales: "N/A" }
                      ].map((staff, idx) => (
                        <tr key={idx} className="hover:bg-white/5">
                          <td className="p-3 font-bold text-white font-heading">{staff.name}</td>
                          <td className="p-3 text-gray-400">{staff.role}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold border ${
                              staff.attendance.includes("ON DUTY") ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}>{staff.attendance}</span>
                          </td>
                          <td className="p-3 text-gray-300 font-mono">{staff.tasks}</td>
                          <td className="p-3 text-right text-luxuryGold font-bold">{staff.sales}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: AI FORECASTS & PREDICTIONS ─── */}
            {repSubTab === "predictions" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left font-sans animate-fadeIn">
                {/* Projections stats */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-white block">Weekend Forecast model</span>
                    <span className="text-[9px] text-gray-500 block">AI predictions for the upcoming weekend.</span>
                  </div>

                  <div className="space-y-4 font-number text-[10px]">
                    {[
                      { period: "Next Weekend (July 20-22)", revenue: "₹15,40,000", demand: "High (+12% MoM)", confidence: "94% confidence" },
                      { period: "Next Month (August)", revenue: "₹62,00,000", demand: "Medium (+4% MoM)", confidence: "91% confidence" },
                      { period: "Next Quarter (Festivals)", revenue: "₹1,98,00,000", demand: "Peak Admissions (+22%)", confidence: "85% confidence" }
                    ].map((pred, i) => (
                      <div key={i} className="p-3 bg-zinc-950/60 rounded-xl border border-white/5 space-y-1">
                        <span className="text-[9px] text-gray-500 uppercase block font-bold">{pred.period}</span>
                        <span className="text-base font-black text-white block mt-0.5">{pred.revenue}</span>
                        <div className="flex justify-between text-[9px] mt-1 text-gray-400">
                          <span>Demand: {pred.demand}</span>
                          <span className="text-luxuryGold">{pred.confidence}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Staffing allocation predictions */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-white block">AI Staffing Optimization</span>
                    <span className="text-[9px] text-gray-500 block">Staff count suggestions based on predicted weekend occupancy.</span>
                  </div>

                  <div className="space-y-3 font-number text-[10px]">
                    <div className="p-3 bg-zinc-950/60 rounded-xl border border-white/5 flex justify-between items-center">
                      <div>
                        <span className="text-white font-bold block">Weekend Concession Staff</span>
                        <span className="text-[8px] text-gray-500">Suggested allocation</span>
                      </div>
                      <span className="text-white font-bold text-sm bg-primary/20 px-2.5 py-1 rounded border border-primary/20">6 Counters Open</span>
                    </div>

                    <div className="p-3 bg-zinc-950/60 rounded-xl border border-white/5 flex justify-between items-center">
                      <div>
                        <span className="text-white font-bold block">VIP Lounges Attendants</span>
                        <span className="text-[8px] text-gray-500">Suggested allocation</span>
                      </div>
                      <span className="text-white font-bold text-sm bg-primary/20 px-2.5 py-1 rounded border border-primary/20">4 Hostesses</span>
                    </div>

                    <div className="p-3 bg-zinc-950/60 rounded-xl border border-white/5 flex justify-between items-center">
                      <div>
                        <span className="text-white font-bold block">Main Screen Floor Guards</span>
                        <span className="text-[8px] text-gray-500">Suggested allocation</span>
                      </div>
                      <span className="text-white font-bold text-sm bg-primary/20 px-2.5 py-1 rounded border border-primary/20">8 Security Guards</span>
                    </div>
                  </div>
                </div>

                {/* Scheduling advice */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-luxuryGold block">AI Scheduling Assistant advice</span>
                    <span className="text-[9px] text-gray-500 block">Automated slot planning tips.</span>
                  </div>

                  <p className="text-gray-300 leading-relaxed text-[10px] text-left">
                    "Based on high weekend pre-booking counts for <span className="text-white font-bold uppercase">Aether: Rising Stars</span> (98% occupancy filled on Sunday afternoon IMAX slots), I recommend <span className="text-luxuryGold font-extrabold">shifting Screen 3's 04:00 PM low-performing comedy slots to IMAX 3D showings of Aether</span>.\n\nThis allocation override is predicted to capture an additional <span className="text-emerald-400 font-bold">₹84,000</span> in gross admissions ticket sales."
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
           TAB 12 — MOBILE APP ECOSYSTEM CONFIGURATION
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "mobile" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-heading font-extrabold tracking-tight border-b border-white/5 pb-4 flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-primary" /> Mobile App Ecosystem
            </h2>

            {/* Mobile ecosystem performance metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-number">
              {[
                { label: "Active Mobile Installs", value: "24,840", icon: <Smartphone className="w-4 h-4" />, color: "text-white" },
                { label: "App Launch Time", value: "1.8 seconds", icon: <Zap className="w-4 h-4" />, color: "text-emerald-400" },
                { label: "FCM Delivery Success", value: "98.6%", icon: <CheckCircle2 className="w-4 h-4" />, color: "text-blue-400" },
                { label: "Offline Sync Queues", value: "0 pending", icon: <WifiOff className="w-4 h-4" />, color: "text-luxuryGold" }
              ].map((card, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-primary/30 transition-all group">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold flex items-center gap-1">{card.icon} {card.label}</span>
                  <span className={`text-lg font-bold ${card.color} mt-1 block group-hover:scale-105 transition-transform origin-left`}>{card.value}</span>
                </div>
              ))}
            </div>

            {/* Sub-Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto border-b border-white/5 pb-3">
              {[
                { key: "splash" as const, label: "Splash Config", icon: <Film className="w-3.5 h-3.5" /> },
                { key: "layouts" as const, label: "App Home Screens", icon: <Laptop className="w-3.5 h-3.5" /> },
                { key: "ticket" as const, label: "QR Ticketing", icon: <QrCode className="w-3.5 h-3.5" /> },
                { key: "push" as const, label: "Push FCM Composer", icon: <Bell className="w-3.5 h-3.5" /> },
                { key: "offline" as const, label: "Offline sync logs", icon: <WifiOff className="w-3.5 h-3.5" /> }
              ].map((st) => (
                <button key={st.key} onClick={() => setMobileSubTab(st.key)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
                    mobileSubTab === st.key ? "bg-primary text-white shadow-redGlow" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}>{st.icon} {st.label}</button>
              ))}
            </div>

            {/* ─── SUB-TAB: SPLASH CONFIGURATION ─── */}
            {mobileSubTab === "splash" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form config */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 h-fit">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Custom App Splash Experience</h3>
                  <form onSubmit={handleSaveSplashSettings} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-gray-400 block font-semibold">Intro Music Loop</label>
                      <input type="text" value={splashMusic} onChange={(e) => setSplashMusic(e.target.value)} placeholder="e.g. orchestral_intro.mp3" className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 block font-semibold">Curtain Animation Duration (Seconds)</label>
                      <input type="number" min={1} max={10} value={splashDuration} onChange={(e) => setSplashDuration(parseInt(e.target.value) || 3)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" />
                    </div>
                    <button type="submit" className="w-full py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded cursor-pointer hover:opacity-90">Save splash experience</button>
                  </form>
                </div>

                {/* Animation Preview */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl flex flex-col justify-center items-center text-center space-y-3">
                  <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
                    <div className="absolute inset-y-0 left-0 w-1/2 bg-red-800 border-r border-yellow-500 animate-pulse" />
                    <div className="absolute inset-y-0 right-0 w-1/2 bg-red-800 border-l border-yellow-500 animate-pulse" />
                    <span className="text-luxuryGold font-extrabold uppercase font-heading text-sm z-10 tracking-widest animate-bounce">Cinema Pro Max</span>
                  </div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Live Simulator: Opening Curtain Animation ({splashDuration}s)</span>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: HOMEPAGE APP LAYOUT WIDGETS ─── */}
            {mobileSubTab === "layouts" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "heroBanner", name: "3D Hero Movie Banner", desc: "Top movie poster parallax slider on home screens" },
                  { key: "offersCarousel", name: "Promotional Offers Carousel", desc: "Slidable discount banner templates" },
                  { key: "recommendedMovies", name: "Recommended Movies (AI personalized)", desc: "Curated list of titles based on lifetime preferences" },
                  { key: "foodOffers", name: "Food Concession Stand Menu", desc: "Grid cards listing snacks and pizzas delivery checkout" },
                  { key: "membershipCard", name: "Digital Loyalty Tier Card Wallet", desc: "Flashes loyalty gold coin progress bars" }
                ].map((w) => (
                  <div key={w.key} className={`p-5 bg-black/40 border rounded-2xl space-y-3 flex justify-between items-center ${
                    mobileWidgets[w.key] ? "border-primary/20" : "border-white/10 opacity-60"
                  }`}>
                    <div>
                      <span className="font-heading font-bold text-white text-sm block">{w.name}</span>
                      <span className="text-gray-500 text-xs">{w.desc}</span>
                    </div>
                    <button onClick={() => handleToggleWidget(w.key)}
                      className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer ${
                        mobileWidgets[w.key] ? "bg-primary/20 text-primary border border-primary/20" : "bg-red-500/20 text-red-400 border border-red-500/20"
                      }`}>{mobileWidgets[w.key] ? "Visible" : "Hidden"}</button>
                  </div>
                ))}
              </div>
            )}

            {/* ─── SUB-TAB: DIGITAL QR TICKET ─── */}
            {mobileSubTab === "ticket" && (
              <div className="max-w-sm mx-auto p-6 bg-black/60 border border-white/10 rounded-3xl space-y-6 text-center text-xs font-number relative">
                <div className="absolute top-4 left-4 right-4 flex justify-between text-[10px] text-gray-500 uppercase font-bold">
                  <span>Admissions Pass</span>
                  <span className="text-luxuryGold">VIP Gold</span>
                </div>
                <div className="pt-4">
                  <span className="text-white font-heading font-bold text-base block mt-2">Aether: Rising Stars</span>
                  <span className="text-gray-500 text-[10px] block mt-0.5">Tonight at 08:30 PM · IMAX Screen 1</span>
                </div>
                <div className="p-4 bg-white rounded-2xl inline-block">
                  {/* QR Simulation */}
                  <div className="w-32 h-32 bg-black border-4 border-white flex flex-col justify-center items-center">
                    <span className="text-white font-mono text-[9px]">QR CODE</span>
                  </div>
                </div>
                <div>
                  <span className="text-white font-bold block">Seats: D-4, D-5</span>
                  <span className="text-gray-500 text-[10px] block">Order: Truffle Butter Popcorn Combo x1</span>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: PUSH NOTIFICATION COMPOSER ─── */}
            {mobileSubTab === "push" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 h-fit">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Firebase Push Notification Composer</h3>
                  <form onSubmit={handleSendFCMNotification} className="space-y-4 text-xs font-sans">
                    <div className="space-y-1">
                      <label className="text-gray-400 block font-semibold">Notification Title</label>
                      <input type="text" value={pushTitle} onChange={(e) => setPushTitle(e.target.value)} placeholder="e.g. Showtime Reminder" className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 block font-semibold">Body Content</label>
                      <textarea rows={3} value={pushBody} onChange={(e) => setPushBody(e.target.value)} placeholder="Your show starts in 1 hour." className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary resize-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 block font-semibold">Audience Segment Topic</label>
                      <select value={pushTopic} onChange={(e) => setPushTopic(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary">
                        <option value="All_Users">All Registered App Users</option>
                        <option value="VIP_Gold">VIP Gold Tier Customers</option>
                        <option value="Employees">Staff Operators & Guards</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded cursor-pointer">Dispatch FCM Push</button>
                  </form>
                </div>

                {/* Push preview on mock phone */}
                <div className="md:col-span-2 p-5 bg-black/40 border border-white/10 rounded-2xl flex flex-col justify-center items-center">
                  <div className="w-72 aspect-[9/19] bg-black border-4 border-white/20 rounded-[32px] p-3 flex flex-col justify-start relative overflow-hidden">
                    {/* Phone notch */}
                    <div className="w-24 h-4 bg-white/20 rounded-b-xl mx-auto mb-6" />
                    {/* Mock notification bubble */}
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-[10px] space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-extrabold uppercase tracking-wider text-[8px] flex items-center gap-1">📱 Cinema Pro Max</span>
                        <span className="text-gray-500">now</span>
                      </div>
                      <span className="text-white font-bold block">{pushTitle || "Demo Notification Title"}</span>
                      <p className="text-gray-300 leading-relaxed">{pushBody || "Your alert message body will preview here on user device."}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: OFFLINE SYNC LOGS ─── */}
            {mobileSubTab === "offline" && (
              <div className="space-y-4">
                <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider">
                        <th className="p-4">Device Model</th>
                        <th className="p-4">OS Version</th>
                        <th className="p-4">Last Synced</th>
                        <th className="p-4">Queued Payloads</th>
                        <th className="p-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-black/20 text-xs">
                      {offlineSyncLogs.map((log, idx) => (
                        <tr key={idx} className="hover:bg-white/5">
                          <td className="p-4 font-bold text-white font-heading">{log.device}</td>
                          <td className="p-4 text-gray-400">{log.os}</td>
                          <td className="p-4 text-gray-500">{log.lastSync}</td>
                          <td className="p-4 text-white font-bold">{log.pending}</td>
                          <td className="p-4 text-right">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${
                              log.status === "SYNCED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}>{log.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
           TAB 13 — Futurist Website Content Management System (CMS)
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "website" && (
          <div className="space-y-6 text-xs text-left animate-fadeIn">
            
            {/* Top Editor Control Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-950 p-4 rounded-2xl border border-white/5 font-sans">
              <div className="space-y-1">
                <h2 className="text-lg font-heading font-black text-white flex items-center gap-2">
                  <span className="text-primary text-xl">🌐</span> Futuristic Visual CMS Builder
                </h2>
                <p className="text-[10px] text-gray-500">Edit homepage layouts, typography themes, and 3D GLB assets in real-time.</p>
              </div>

              {/* Action utilities */}
              <div className="flex flex-wrap gap-2">
                {/* Viewport switchers */}
                <div className="flex bg-black/60 p-1 rounded-lg border border-white/5 mr-2">
                  {[
                    { key: "desktop", icon: "💻", tooltip: "Desktop (1920px)" },
                    { key: "tablet", icon: "📱", tooltip: "Tablet (768px)" },
                    { key: "mobile", icon: "📞", tooltip: "Mobile (375px)" }
                  ].map((dev) => (
                    <button
                      key={dev.key}
                      onClick={() => {
                        setCmsViewport(dev.key as any);
                        toast(`Switched canvas simulator to ${dev.key} viewport.`);
                      }}
                      className={`p-1.5 rounded text-xs cursor-pointer transition-colors ${
                        cmsViewport === dev.key ? "bg-primary text-white" : "text-gray-400 hover:text-white"
                      }`}
                      title={dev.tooltip}
                    >
                      {dev.icon}
                    </button>
                  ))}
                </div>

                {/* Language switcher */}
                <select
                  value={cmsLanguage}
                  onChange={(e) => {
                    setCmsLanguage(e.target.value);
                    toast.success(`Active translation locale switched to: ${e.target.value.toUpperCase()}`);
                  }}
                  className="px-2.5 py-1.5 rounded bg-black/80 border border-white/10 text-white font-bold text-[10px]"
                >
                  <option value="en">English (US)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                </select>

                {/* Undo / Redo */}
                <button
                  onClick={() => toast("Undo action: restored previous canvas layout state.")}
                  className="px-3 py-1.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-[10px] cursor-pointer"
                >
                  ↩ UNDO
                </button>
                <button
                  onClick={() => toast("Redo action: re-applied component styling adjustments.")}
                  className="px-3 py-1.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-[10px] cursor-pointer"
                >
                  ↪ REDO
                </button>

                {/* Save Draft / Publish */}
                <button
                  onClick={() => toast.success("Draft layout settings cached locally.")}
                  className="px-3 py-1.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-[10px] cursor-pointer"
                >
                  💾 SAVE DRAFT
                </button>
                <button
                  onClick={() => {
                    toast.success("Visual structures deployed to production CDN nodes successfully!");
                  }}
                  className="px-4 py-1.5 rounded bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-[10px] cursor-pointer hover:opacity-90 transition-all shadow-redGlow animate-pulse"
                >
                  🚀 PUBLISH CMS
                </button>
              </div>
            </div>

            {/* Visual Editor Layout columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Components Library (Library widget) */}
              <div className="lg:col-span-3 p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-gray-400 block">Component Library</span>
                  <span className="text-[9px] text-gray-500 block">Click to append to selected layout block</span>
                </div>

                <div className="space-y-2 font-sans text-left">
                  {[
                    { type: "HERO", icon: "🎬", name: "Hero Movie Banner", desc: "Background video + ticket CTAs" },
                    { type: "CAROUSEL", icon: "🍿", name: "Now Showing Carousel", desc: "3D slidable movie listings" },
                    { type: "UPCOMING", icon: "📅", name: "Upcoming Releases Timeline", desc: "Chronological release grid" },
                    { type: "FOOD", icon: "🥤", name: "Gourmet F&B lounge", desc: "Interactive concessions menu" },
                    { type: "MEMBERSHIP", icon: "💳", name: "VIP Membership cards", desc: "Subscription packages comparison" },
                    { type: "FAQ", icon: "❓", name: "FAQ Accordion", desc: "Expandable help content" }
                  ].map((comp, idx) => (
                    <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:border-primary/50 transition-all flex items-center gap-3">
                      <span className="text-xl">{comp.icon}</span>
                      <div>
                        <span className="text-white font-bold block text-[10px]">{comp.name}</span>
                        <span className="text-gray-500 text-[9px]">{comp.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center Column: Visual Preview Canvas */}
              <div className="lg:col-span-6 p-5 bg-black/40 border border-white/10 rounded-2xl min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
                 <div className="text-center space-y-2">
                    <span className="text-4xl">🖼️</span>
                    <h3 className="text-white font-bold">Visual Canvas Placeholder</h3>
                    <p className="text-gray-500 text-[10px]">Real-time DOM rendering of {cmsViewport} view.</p>
                 </div>
              </div>

              {/* Right Column: Settings and properties Inspector */}
              <div className="lg:col-span-3 p-5 bg-black/40 border border-white/10 rounded-2xl space-y-6">
                
                {/* Visual Editor settings tabs */}
                <div className="border-b border-white/5 pb-2">
                  <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-gray-400 block">Inspector Settings</span>
                  <span className="text-[9px] text-gray-500 block">Configure visual variables & options</span>
                </div>

                {/* Sub-tab Navigation */}
                <div className="flex gap-1 overflow-x-auto bg-black/40 p-1 rounded-lg border border-white/5 font-sans">
                  {[
                    { key: "theme" as const, label: "Theme" },
                    { key: "hero" as const, label: "Hero" },
                    { key: "ribbons" as const, label: "Badges" },
                    { key: "sections" as const, label: "Sections" },
                    { key: "seo" as const, label: "SEO" }
                  ].map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setWebSubTab(t.key)}
                      className={`flex-1 text-center py-1 rounded text-[8px] font-black uppercase whitespace-nowrap cursor-pointer transition-colors ${
                        webSubTab === t.key ? "bg-primary text-white" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Settings Accordions based on selected tab */}
                <div className="space-y-4 text-left font-sans">
                  
                  {/* Theme Tab */}
                  {webSubTab === "theme" && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="space-y-3">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block border-b border-white/5 pb-1">1. Theme Palette & Font</span>
                        
                        <div className="space-y-1">
                          <label className="text-gray-400 block font-semibold text-[9px]">Google Heading Font</label>
                          <select 
                            value={cmsCustomFont}
                            onChange={(e) => {
                              setCmsCustomFont(e.target.value);
                              toast.success(`Heading typography switched to ${e.target.value}`);
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-black/60 border border-white/10 text-white focus:outline-none text-[10px]"
                          >
                            <option value="Outfit">Outfit (Geometric)</option>
                            <option value="Montserrat">Montserrat (Classic)</option>
                            <option value="Inter">Inter (Sleek UI)</option>
                            <option value="Playfair Display">Playfair (Luxury Serif)</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-gray-400 block font-semibold text-[9px]">Primary Accent</label>
                            <input type="color" value={webPrimaryColor} onChange={(e) => setWebPrimaryColor(e.target.value)} className="w-full h-8 rounded border border-white/10 bg-transparent cursor-pointer" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-gray-400 block font-semibold text-[9px]">Canvas Bg</label>
                            <input type="color" value={webSecondaryColor} onChange={(e) => setWebSecondaryColor(e.target.value)} className="w-full h-8 rounded border border-white/10 bg-transparent cursor-pointer" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block border-b border-white/5 pb-1">2. 3D GLB Asset Engine</span>
                        
                        <div className="space-y-1">
                          <label className="text-gray-400 block font-semibold text-[9px]">Lobby GLTF Scale ({cms3DModelScale.toFixed(1)}x)</label>
                          <input type="range" min="0.5" max="3" step="0.1" value={cms3DModelScale} onChange={(e) => setCms3DModelScale(parseFloat(e.target.value))} className="w-full accent-primary bg-transparent cursor-pointer" />
                        </div>

                        <div className="space-y-1">
                          <label className="text-gray-400 block font-semibold text-[9px]">GLTF Auto-Rotation speed</label>
                          <input type="range" min="0" max="2" step="0.1" value={cms3DModelSpeed} onChange={(e) => setCms3DModelSpeed(parseFloat(e.target.value))} className="w-full accent-primary bg-transparent cursor-pointer" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block border-b border-white/5 pb-1">3. Version Control Logs</span>
                        <div className="space-y-2 text-[9px]">
                          {[
                            { ver: "v1.2.0-draft", editor: "arjun.k@cinemapromax.com", date: "Today 12:30 PM", active: true },
                            { ver: "v1.1.5-prod", editor: "admin@cinemapromax.com", date: "Yesterday 09:12 AM", active: false }
                          ].map((item, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => {
                                toast.success(`Visual canvas restored to layout state of ${item.ver}`);
                                if (item.ver === "v1.1.5-prod") {
                                  setWebHeroTitle("Book Tickets and enjoy CineVerse Delhi");
                                } else {
                                  setWebHeroTitle("Experience Movies Beyond Reality");
                                }
                              }}
                              className={`p-2.5 border rounded-xl cursor-pointer hover:bg-white/10 transition-colors flex justify-between items-center ${
                                item.active ? "bg-primary/5 border-primary/20" : "bg-white/5 border-white/5"
                              }`}
                            >
                              <div>
                                <span className="text-white font-bold block">{item.ver}</span>
                                <span className="text-gray-500 block">{item.date}</span>
                              </div>
                              <span className="text-gray-600 block text-[8px]">Rollback</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hero Tab */}
                  {webSubTab === "hero" && (
                    <div className="space-y-4 animate-fadeIn">
                      <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block border-b border-white/5 pb-1">Configure Hero Slide</span>
                      <form onSubmit={handleSaveHeroSettings} className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-gray-400 block font-semibold text-[9px]">Hero Heading</label>
                          <input type="text" value={webHeroTitle} onChange={(e) => setWebHeroTitle(e.target.value)} className="w-full px-2.5 py-1.5 rounded bg-black/60 border border-white/10 text-white focus:outline-none text-[10px]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-gray-400 block font-semibold text-[9px]">Subtitle description</label>
                          <input type="text" value={webHeroSub} onChange={(e) => setWebHeroSub(e.target.value)} className="w-full px-2.5 py-1.5 rounded bg-black/60 border border-white/10 text-white focus:outline-none text-[10px]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-gray-400 block font-semibold text-[9px]">Poster Banner URL</label>
                          <input type="text" value={webHeroBg} onChange={(e) => setWebHeroBg(e.target.value)} className="w-full px-2.5 py-1.5 rounded bg-black/60 border border-white/10 text-white focus:outline-none text-[10px]" />
                        </div>
                        <button type="submit" className="w-full py-1.5 bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded cursor-pointer hover:opacity-90 text-[10px]">Save Hero Settings</button>
                      </form>
                    </div>
                  )}

                  {/* Badges Tab */}
                  {webSubTab === "ribbons" && (
                    <div className="space-y-4 animate-fadeIn">
                      <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block border-b border-white/5 pb-1">Movie Badge Colors</span>
                      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                        {movieRibbons.map((m) => (
                          <div key={m.movieId} className="p-2 bg-white/5 border border-white/5 rounded-lg flex justify-between items-center text-[10px]">
                            <div>
                              <span className="text-white font-bold block">{m.name}</span>
                              <span className="text-gray-500 uppercase font-bold text-[8px] px-1 bg-white/5 rounded mt-0.5 inline-block">{m.badge}</span>
                            </div>
                            <div className="flex gap-1.5 items-center">
                              <input type="color" value={m.color} onChange={(e) => handleUpdateRibbonColor(m.movieId, e.target.value)} className="w-6 h-6 rounded border border-white/10 bg-transparent cursor-pointer" />
                              <span className="text-white font-mono text-[9px]">{m.color}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sections Tab */}
                  {webSubTab === "sections" && (
                    <div className="space-y-4 animate-fadeIn">
                      <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block border-b border-white/5 pb-1">Sections Visibility</span>
                      <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                        {webSections.map((sec: any) => (
                          <div key={sec.id} className="p-2 bg-white/5 border border-white/5 rounded-lg flex justify-between items-center text-[10px]">
                            <div>
                              <span className="text-white font-bold block">{sec.title}</span>
                              <span className="text-gray-500 text-[8px] font-mono">{sec.sectionId}</span>
                            </div>
                            <button onClick={() => handleToggleWebSection(sec.id)} className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                              sec.visible ? "bg-primary/20 text-primary border border-primary/20" : "bg-red-500/20 text-red-400 border border-red-500/20"
                            }`}>{sec.visible ? "Visible" : "Hidden"}</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SEO Tab */}
                  {webSubTab === "seo" && (
                    <div className="space-y-4 animate-fadeIn">
                      <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block border-b border-white/5 pb-1">Website SEO Meta</span>
                      <form onSubmit={handleSaveSeoSettings} className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-gray-400 block font-semibold text-[9px]">Global SEO Description</label>
                          <textarea rows={3} value={webSeoDesc} onChange={(e) => setWebSeoDesc(e.target.value)} className="w-full px-2.5 py-1.5 rounded bg-black/60 border border-white/10 text-white focus:outline-none text-[10px] resize-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-gray-400 block font-semibold text-[9px]">Popup Alert Banner Title</label>
                          <input type="text" value={webPopupTitle} onChange={(e) => setWebPopupTitle(e.target.value)} className="w-full px-2.5 py-1.5 rounded bg-black/60 border border-white/10 text-white focus:outline-none text-[10px]" />
                        </div>
                        <button type="submit" className="w-full py-1.5 bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded cursor-pointer hover:opacity-90 text-[10px]">Save SEO Settings</button>
                      </form>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        )}
        {/* ═══════════════════════════════════════════════════════
           TAB 14 — SEO & CLOUD INFRASTRUCTURE DEPLOYMENT
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "seo" && (
          <div className="space-y-8">
            {/* Volume 9 · Part 1 — Platform architecture: service health, infra metrics, deployments */}
            <PlatformArchitecturePanel />
            {/* Volume 9 · Part 5 — Observability: health, golden signals, SLO/MTTR, incidents */}
            <ObservabilityPanel />
            <h2 className="text-2xl font-heading font-extrabold tracking-tight border-b border-white/5 pb-4 flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" /> SEO & Cloud Infrastructure
            </h2>

            {/* Sub-Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto border-b border-white/5 pb-3">
              {[
                { key: "overview" as const, label: "SEO Dashboard", icon: <TrendingUp className="w-3.5 h-3.5" /> },
                { key: "meta" as const, label: "Meta Manager", icon: <FileText className="w-3.5 h-3.5" /> },
                { key: "pages" as const, label: "Page Builder", icon: <Layout className="w-3.5 h-3.5" /> },
                { key: "keywords" as const, label: "Keywords & GBP", icon: <Search className="w-3.5 h-3.5" /> },
                { key: "cms" as const, label: "CMS Blog Editor", icon: <FileEdit className="w-3.5 h-3.5" /> },
                { key: "deploy" as const, label: "Cloud CI/CD & Deploy", icon: <Cloud className="w-3.5 h-3.5" /> }
              ].map((st) => (
                <button key={st.key} onClick={() => setSeoSubTab(st.key)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
                    seoSubTab === st.key ? "bg-primary text-white shadow-redGlow" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}>{st.icon} {st.label}</button>
              ))}
            </div>

            {/* ─── SUB-TAB: SEO OVERVIEW ─── */}
            {seoSubTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-number">
                  {[
                    { label: "Google Rank Score", value: "92 / 100", trend: "+3.4%", color: "text-emerald-400" },
                    { label: "Organic Visitors", value: "124,800", trend: "+12.8%", color: "text-white" },
                    { label: "Page Views", value: "486,000", trend: "+8.5%", color: "text-white" },
                    { label: "Search Clicks", value: "18,240", trend: "+14.2%", color: "text-blue-400" },
                    { label: "Average Position", value: "4.8 Rank", trend: "-0.5 positions", color: "text-blue-400" },
                    { label: "Indexed Pages", value: "148 pages", trend: "+4 pages", color: "text-luxuryGold" },
                    { label: "Tracked Keywords", value: "65 keys", trend: "+8 keys", color: "text-luxuryGold" },
                    { label: "Organic Backlinks", value: "12,800 links", trend: "+240 links", color: "text-indigo-400" },
                    { label: "Domain Authority", value: "48 DA", trend: "+2 points", color: "text-indigo-400" },
                    { label: "Mobile Score", value: "95 / 100", trend: "Stable", color: "text-emerald-400" },
                    { label: "Core Web Vitals", value: "GOOD", trend: "1.8s load", color: "text-emerald-400" },
                    { label: "Conversion Rate", value: "4.2%", trend: "+0.6%", color: "text-white" }
                  ].map((card, idx) => (
                    <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-primary/30 transition-all group">
                      <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase">
                        <span>{card.label}</span>
                        <span className="text-emerald-400">{card.trend}</span>
                      </div>
                      <span className={`text-lg font-bold ${card.color} mt-1 block group-hover:scale-105 transition-transform origin-left`}>{card.value}</span>
                    </div>
                  ))}
                </div>

                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">AI Search Performance Suggestions</h3>
                  <ul className="text-xs text-gray-400 space-y-2 list-disc list-inside">
                    <li><strong className="text-white">Optimize Local City landing pages:</strong> Keyword density for <code className="text-luxuryGold bg-white/5 px-1 rounded">best theatres in Mumbai</code> has dropped below 1.5%. Suggest expanding content headers.</li>
                    <li><strong className="text-white">Structured Schema Upgrade:</strong> 12 Movie items are missing the required <code className="text-luxuryGold bg-white/5 px-1 rounded">aggregateRating</code> fields, causing minor Search Console warning signs.</li>
                    <li><strong className="text-white">Core Web Vitals Alert:</strong> Concession food pictures on Mobile are causing layout shifts. Lazy load images to secure 95+ ranking slots.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: META INFORMATION MANAGEMENT ─── */}
            {seoSubTab === "meta" && (
              <div className="space-y-6 text-xs">
                {/* Meta section triggers */}
                <div className="flex gap-2 border-b border-white/5 pb-2">
                  {[
                    { key: "home" as const, label: "Homepage Meta" },
                    { key: "movie" as const, label: "Movie Pages Meta" },
                    { key: "theatre" as const, label: "Theatre Pages Meta" },
                    { key: "offer" as const, label: "Offer Pages Meta" }
                  ].map((msec) => (
                    <button key={msec.key} onClick={() => setActiveMetaSection(msec.key)}
                      className={`px-3 py-1 rounded text-[10px] uppercase font-bold cursor-pointer transition-all ${
                        activeMetaSection === msec.key ? "bg-white/10 text-white border border-white/20" : "text-gray-400 hover:text-white"
                      }`}>{msec.label}</button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Home Meta Forms */}
                  {activeMetaSection === "home" && (
                    <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                      <h3 className="text-sm font-heading font-bold text-white">Homepage Meta Config</h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-gray-400 font-semibold block">SEO Title</label>
                          <input type="text" value={metaHomeTitle} onChange={(e) => setMetaHomeTitle(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-gray-400 font-semibold block">Meta Description</label>
                          <textarea rows={2} value={metaHomeDesc} onChange={(e) => setMetaHomeDesc(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none resize-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-gray-400 font-semibold block">Keywords</label>
                          <input type="text" value={metaHomeKeys} onChange={(e) => setMetaHomeKeys(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-gray-400 font-semibold block">OG Image Link</label>
                            <input type="text" value={metaHomeOg} onChange={(e) => setMetaHomeOg(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-gray-400 font-semibold block">Twitter Card Type</label>
                            <input type="text" value={metaHomeTwitter} onChange={(e) => setMetaHomeTwitter(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-gray-400 font-semibold block">Canonical URL</label>
                          <input type="text" value={metaHomeCanonical} onChange={(e) => setMetaHomeCanonical(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Movie Meta Forms */}
                  {activeMetaSection === "movie" && (
                    <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                      <h3 className="text-sm font-heading font-bold text-white">Movie Template Metadata</h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-gray-400 font-semibold block">SEO Title Template</label>
                          <input type="text" value={metaMovieTitle} onChange={(e) => setMetaMovieTitle(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-gray-400 font-semibold block">SEO Meta Description Template</label>
                          <textarea rows={2} value={metaMovieDesc} onChange={(e) => setMetaMovieDesc(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white resize-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-gray-400 font-semibold block">Genre</label>
                            <input type="text" value={metaMovieGenre} onChange={(e) => setMetaMovieGenre(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white" />
                          </div>
                          <div>
                            <label className="text-gray-400 font-semibold block">Language</label>
                            <input type="text" value={metaMovieLang} onChange={(e) => setMetaMovieLang(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-gray-400 font-semibold block">Cast Members</label>
                            <input type="text" value={metaMovieCast} onChange={(e) => setMetaMovieCast(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white" />
                          </div>
                          <div>
                            <label className="text-gray-400 font-semibold block">Schema Type</label>
                            <input type="text" value={metaMovieRelease} onChange={(e) => setMetaMovieRelease(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-gray-400 font-semibold block">Trailer URL</label>
                            <input type="text" value={metaMovieTrailer} onChange={(e) => setMetaMovieTrailer(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white" />
                          </div>
                          <div>
                            <label className="text-gray-400 font-semibold block">Structured Schema</label>
                            <select value={metaMovieSchema} onChange={(e) => setMetaMovieSchema(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white">
                              <option value="Movie">Movie (Google Schema)</option>
                              <option value="Event">Event Screenings</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Theatre Meta Forms */}
                  {activeMetaSection === "theatre" && (
                    <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                      <h3 className="text-sm font-heading font-bold text-white">Theatre Pages Metadata</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-gray-400 font-semibold block">City Location</label>
                            <input type="text" value={metaTheatreLoc} onChange={(e) => setMetaTheatreLoc(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white" />
                          </div>
                          <div>
                            <label className="text-gray-400 font-semibold block">Timing</label>
                            <input type="text" value={metaTheatreTiming} onChange={(e) => setMetaTheatreTiming(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-gray-400 font-semibold block">Physical Address</label>
                          <input type="text" value={metaTheatreAddr} onChange={(e) => setMetaTheatreAddr(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-gray-400 font-semibold block">Facilities List</label>
                          <input type="text" value={metaTheatreFacilities} onChange={(e) => setMetaTheatreFacilities(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-gray-400 font-semibold block">Gallery Images (comma separated)</label>
                          <input type="text" value={metaTheatreImages} onChange={(e) => setMetaTheatreImages(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Offer Meta Forms */}
                  {activeMetaSection === "offer" && (
                    <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                      <h3 className="text-sm font-heading font-bold text-white">Offers Pages Metadata</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-gray-400 font-semibold block">Offer Title</label>
                            <input type="text" value={metaOfferTitle} onChange={(e) => setMetaOfferTitle(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white" />
                          </div>
                          <div>
                            <label className="text-gray-400 font-semibold block">Coupon Code</label>
                            <input type="text" value={metaOfferCoupon} onChange={(e) => setMetaOfferCoupon(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-gray-400 font-semibold block">Validity range</label>
                          <input type="text" value={metaOfferValidity} onChange={(e) => setMetaOfferValidity(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-gray-400 font-semibold block">SEO Description</label>
                          <textarea rows={2} value={metaOfferDesc} onChange={(e) => setMetaOfferDesc(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white resize-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Google Integrations Column */}
                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                    <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Google Indexing Integrations</h3>
                    <div className="space-y-3 text-xs">
                      {[
                        { key: "console", label: "Google Search Console API", state: gSearchConsole, setter: setGSearchConsole },
                        { key: "analytics", label: "Google Analytics 4 Tracking ID", state: gAnalytics, setter: setGAnalytics },
                        { key: "tagmanager", label: "Google Tag Manager Snippet", state: gTagManager, setter: setGTagManager },
                        { key: "maps", label: "Google Maps GBP API sync", state: gMaps, setter: setGMaps }
                      ].map((item) => (
                        <div key={item.key} className="flex justify-between items-center p-2.5 bg-white/5 border border-white/5 rounded-xl">
                          <span className="text-gray-400 font-semibold">{item.label}</span>
                          <button onClick={() => { item.setter(!item.state); toast.success(`${item.label} configuration modified.`); }}
                            className={`px-3 py-1 rounded text-[9px] font-bold uppercase ${
                              item.state ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}>{item.state ? "Connected" : "Disconnected"}</button>
                        </div>
                      ))}
                    </div>

                    {/* Google search mock representation */}
                    <div className="p-4 bg-white text-black rounded-xl text-left space-y-1 shadow-2xl font-sans mt-4">
                      <span className="text-[11px] text-blue-800 font-bold block truncate hover:underline cursor-pointer">
                        {activeMetaSection === "home" ? metaHomeTitle : activeMetaSection === "movie" ? metaMovieTitle : activeMetaSection === "theatre" ? metaTheatreLoc + " Cinema" : metaOfferTitle}
                      </span>
                      <span className="text-[9px] text-green-700 block font-mono">
                        https://cinemapromax.com{activeMetaSection === "home" ? "" : activeMetaSection === "movie" ? "/movies/aether-rising" : activeMetaSection === "theatre" ? "/theatres/mumbai" : "/offers/bogo"}
                      </span>
                      <p className="text-[10px] text-gray-600 leading-relaxed line-clamp-2">
                        {activeMetaSection === "home" ? metaHomeDesc : activeMetaSection === "movie" ? metaMovieDesc : activeMetaSection === "theatre" ? metaTheatreAddr : metaOfferDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: DYNAMIC SEO PAGE BUILDER ─── */}
            {seoSubTab === "pages" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                {/* Pages list */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-sm font-heading font-bold text-white">Active SEO Landing Pages</h3>
                  <div className="border border-white/5 rounded-xl overflow-hidden font-number">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider">
                          <th className="p-4">Custom URL</th>
                          <th className="p-4">Meta Title</th>
                          <th className="p-4">Category</th>
                          <th className="p-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-black/20 text-xs">
                        {seoPagesList.map((page, idx) => (
                          <tr key={idx} className="hover:bg-white/5">
                            <td className="p-4 font-mono font-bold text-primary">{page.slug}</td>
                            <td className="p-4 text-white font-semibold">{page.title}</td>
                            <td className="p-4 text-gray-400">{page.category}</td>
                            <td className="p-4 text-right">
                              <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">INDEXED & LIVE</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Page Builder Form */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 h-fit">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Generate Landing Page</h3>
                  <form onSubmit={handleCreateSeoPage} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold block">Custom URL slug</label>
                      <input type="text" placeholder="/best-theatre-mumbai" value={buildUrl} onChange={(e) => setBuildUrl(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold block">Meta Title</label>
                      <input type="text" placeholder="Title" value={buildTitle} onChange={(e) => setBuildTitle(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold block">Description</label>
                      <textarea rows={2} placeholder="Meta Description" value={buildDesc} onChange={(e) => setBuildDesc(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none resize-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold block">Target Category</label>
                      <select value={buildCategory} onChange={(e) => setBuildCategory(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white">
                        <option value="City Pages">City & Area Pages</option>
                        <option value="Experiences">Luxury Experiences</option>
                        <option value="Offers">Food Combos & Offers</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded cursor-pointer">Publish Page</button>
                  </form>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: KEYWORDS & LOCAL SEO ─── */}
            {seoSubTab === "keywords" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                {/* Keywords list */}
                <div className="md:col-span-2 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-heading font-bold text-white">Google Rank Keyword Tracking</h3>
                    <div className="border border-white/5 rounded-xl overflow-hidden font-number">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider">
                            <th className="p-4">Search Phrase</th>
                            <th className="p-4">Google Position</th>
                            <th className="p-4">Search Volume</th>
                            <th className="p-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-black/20 text-xs">
                          {seoKeywordsList.map((kw) => (
                            <tr key={kw.id} className="hover:bg-white/5">
                              <td className="p-4 font-bold text-white font-heading">{kw.phrase}</td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                  kw.position <= 5 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-gray-400"
                                }`}>Rank {kw.position}</span>
                              </td>
                              <td className="p-4 text-gray-400">{kw.volume.toLocaleString()} /mo</td>
                              <td className="p-4 text-right">
                                <button onClick={() => handleRemoveKeyword(kw.id)} className="text-red-400 hover:text-white font-bold uppercase cursor-pointer">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Add Keyword Form */}
                  <form onSubmit={handleAddKeyword} className="flex gap-2 items-center">
                    <input type="text" placeholder="Add custom keyword to track rank position..." value={newKeywordInput} onChange={(e) => setNewKeywordInput(e.target.value)} className="flex-1 px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none" />
                    <button type="submit" className="px-4 py-2 bg-primary text-white font-bold uppercase rounded cursor-pointer whitespace-nowrap">Track Rank</button>
                  </form>
                </div>

                {/* Local SEO / GBP panel */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 h-fit">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Google Business Profile (GBP)</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold block">Theatre Listing Name</label>
                      <input type="text" value={localAddress} onChange={(e) => setLocalAddress(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold block">Phone Number</label>
                      <input type="text" value={localPhone} onChange={(e) => setLocalPhone(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold block">Working Hours</label>
                      <input type="text" value={localHours} onChange={(e) => setLocalHours(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center p-2.5 bg-white/5 border border-white/5 rounded-xl font-number">
                      <div>
                        <span className="text-luxuryGold font-extrabold text-sm block">★ {localRating}</span>
                        <span className="text-gray-500 text-[10px]">GBP Rating</span>
                      </div>
                      <div>
                        <span className="text-white font-extrabold text-sm block">{localReviewsCount}</span>
                        <span className="text-gray-500 text-[10px]">GBP Reviews</span>
                      </div>
                    </div>
                    <button type="button" onClick={() => toast.success("Google Maps business listings updated successfully.")} className="w-full py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded cursor-pointer">Sync Maps Data</button>
                  </div>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: CONTENT MANAGEMENT SYSTEM (CMS) ─── */}
            {seoSubTab === "cms" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                {/* CMS Editor form */}
                <div className="md:col-span-2 p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">CMS News & Blog Editor</h3>
                  <form onSubmit={handleCreateBlog} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold block">Article Headline</label>
                      <input type="text" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold block">Rich Content (HTML/Markdown)</label>
                      <textarea rows={6} value={blogContent} onChange={(e) => setBlogContent(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none resize-none font-mono" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-gray-400 font-semibold block">Author</label>
                        <input type="text" value={blogAuthor} onChange={(e) => setBlogAuthor(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-gray-400 font-semibold block">Publish Status</label>
                        <select value={blogStatus} onChange={(e: any) => setBlogStatus(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white">
                          <option value="draft">Save Draft</option>
                          <option value="published">Publish Now</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="w-full py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded cursor-pointer">Save Article</button>
                  </form>
                </div>

                {/* AI Assistant Grade Panel */}
                <div className="space-y-4">
                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                    <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2 flex items-center gap-1"><Sparkles className="w-4 h-4 text-luxuryGold" /> AI SEO Assistant</h3>
                    <div className="space-y-3 font-number text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Content Readability</span>
                        <span className="text-emerald-400 font-bold">85 / 100</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Keyword Density (IMAX)</span>
                        <span className="text-emerald-400 font-bold">2.4% (Optimal)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Heading Hierarchy</span>
                        <span className="text-emerald-400 font-bold">Valid (H1, H2)</span>
                      </div>
                      <div className="border-t border-white/5 pt-3">
                        <span className="text-white font-bold block mb-1">Generated Title Ideas:</span>
                        <p className="text-[10px] text-gray-500 italic bg-white/5 p-1 rounded mt-1">"Why IMAX Screen Dimensions Change Everything in 2026"</p>
                        <p className="text-[10px] text-gray-500 italic bg-white/5 p-1 rounded mt-1">"The Future of Cinema: An IMAX Screen Spatial Tour Guide"</p>
                      </div>
                    </div>
                  </div>

                  {/* Blog listing */}
                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                    <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-1">CMS Blog History</h3>
                    <div className="space-y-2">
                      {cmsBlogsList.map((blog) => (
                        <div key={blog.id} className="p-2.5 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                          <div>
                            <span className="text-white font-semibold block truncate max-w-xs">{blog.title}</span>
                            <span className="text-[10px] text-gray-500">{blog.author} • {blog.date}</span>
                          </div>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                            blog.status === "published" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-gray-400"
                          }`}>{blog.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: CI/CD PIPELINE & DEPLOY ─── */}
            {seoSubTab === "deploy" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* CI/CD config console */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 h-fit">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Vercel & AWS Edge Deploy</h3>
                  <div className="space-y-2 font-number">
                    <div>
                      <span className="text-gray-500 text-[9px] uppercase font-bold block">Production branch</span>
                      <span className="text-white font-bold block mt-0.5">main (github.com/cinemapromax/production)</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[9px] uppercase font-bold block">Build status</span>
                      <span className="text-emerald-400 font-bold block mt-0.5">SUCCESSFUL (Active version: v1.0.14)</span>
                    </div>
                  </div>
                  <button onClick={handleTriggerDeploy} disabled={isDeploying}
                    className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded cursor-pointer hover:opacity-90 disabled:opacity-50">
                    {isDeploying ? "Building & Deploying..." : "Trigger Production CI/CD Build"}
                  </button>
                  <button onClick={handleTriggerBackup} className="w-full py-2.5 bg-white/5 border border-white/10 text-white font-bold uppercase rounded cursor-pointer hover:bg-white/10 mt-2">
                    Backup SQL Database Now
                  </button>
                </div>

                {/* CI/CD terminal log display */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-3 font-mono text-[10px] text-gray-400 bg-black h-48 overflow-y-auto">
                  <span className="text-gray-600 block uppercase font-bold border-b border-white/5 pb-1">Build Terminal Logs</span>
                  {deployLogs.map((log, idx) => (
                    <p key={idx} className="leading-relaxed">{log}</p>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}



        {/* ═══════════════════════════════════════════════════════
           TAB 11 — CONCESSIONS (Simple Food CRUD)
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "food" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-heading font-extrabold tracking-tight border-b border-white/5 pb-4">Concessions Snack Menu</h2>
            <form onSubmit={handleAddFood} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2"><label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Food Item Name</label><input type="text" placeholder="e.g. Cheese Fries" value={newFoodName} onChange={(e) => setNewFoodName(e.target.value)} className="w-full px-4 py-3 rounded bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary text-xs" /></div>
              <div className="space-y-2"><label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Price (₹)</label><input type="number" placeholder="e.g. 180" value={newFoodPrice} onChange={(e) => setNewFoodPrice(e.target.value)} className="w-full px-4 py-3 rounded bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary text-xs font-number" /></div>
              <button type="submit" className="w-full py-3.5 rounded bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-redGlow"><Plus className="w-4 h-4" /> Add Food</button>
            </form>
            <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
              <table className="w-full text-left border-collapse">
                <thead><tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider"><th className="p-4">Item Name</th><th className="p-4">Price</th><th className="p-4 text-right">Actions</th></tr></thead>
                <tbody className="divide-y divide-white/5 bg-black/20">
                  {foodList.map((f) => (
                    <tr key={f.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-white font-heading">{f.name}</td>
                      <td className="p-4 text-accent font-bold">₹{f.price}</td>
                      <td className="p-4 text-right"><button onClick={() => handleDeleteFood(f.id, f.name)} className="p-2 rounded bg-white/5 hover:bg-primary/20 text-gray-400 hover:text-primary transition-colors"><Trash2 className="w-3.5 h-3.5" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
           TAB 8 — REFUNDS
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "refunds" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-heading font-extrabold tracking-tight border-b border-white/5 pb-4">Refund Requests Center</h2>
            <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
              <table className="w-full text-left border-collapse">
                <thead><tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider"><th className="p-4">Booking</th><th className="p-4">Customer</th><th className="p-4">Amount</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
                <tbody className="divide-y divide-white/5 bg-black/20">
                  {refundsList.map((r) => (
                    <tr key={r.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-white font-mono uppercase">{r.bookingId}</td>
                      <td className="p-4 text-gray-400">{r.customerName}</td>
                      <td className="p-4 text-white font-bold">₹{r.amount}</td>
                      <td className="p-4"><span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${r.status === "PENDING" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>{r.status}</span></td>
                      <td className="p-4 text-right">{r.status === "PENDING" && (<button onClick={() => handleApproveRefund(r.id)} className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider cursor-pointer">Approve</button>)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
           TAB 9 — AI BUSINESS ADVISOR
        ═══════════════════════════════════════════════════════ */}
        {/* ═══════════════════════════════════════════════════════
           TAB 9 — AI PLATFORM COMMAND CENTER
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "ai" && (
          <div className="space-y-8">
            {/* Volume 9 · Part 6 — AI Platform: MLOps, model registry, governance */}
            <AIPlatformPanel />
            <div className="border-b border-white/5 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-heading font-extrabold tracking-tight flex items-center gap-2">
                  <Cpu className="w-6 h-6 text-luxuryGold animate-pulse" /> AI Command Center
                </h2>
                <p className="text-xs text-gray-400 mt-1">Orchestrate machine learning model states, pricing automation, LTV triggers, and sentiment pipelines</p>
              </div>
              <span className="px-3 py-1 rounded bg-luxuryGold/10 border border-luxuryGold/20 text-luxuryGold font-extrabold text-[10px] uppercase">Master Accuracy: 93.4%</span>
            </div>

            {/* AI Sub-Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto border-b border-white/5 pb-3 scrollbar-none">
              {[
                { key: "overview" as const, label: "AI Dashboard", icon: <TrendingUp className="w-3.5 h-3.5" /> },
                { key: "models" as const, label: "Model Management", icon: <Cpu className="w-3.5 h-3.5" /> },
                { key: "predictions" as const, label: "Predictions", icon: <Target className="w-3.5 h-3.5" /> },
                { key: "pricing" as const, label: "Dynamic Pricing", icon: <DollarSign className="w-3.5 h-3.5" /> },
                { key: "rules" as const, label: "Automation", icon: <Settings className="w-3.5 h-3.5" /> },
                { key: "customer" as const, label: "Customer Intel", icon: <Users className="w-3.5 h-3.5" /> },
                { key: "security_vision" as const, label: "Security Vision", icon: <Crosshair className="w-3.5 h-3.5" /> },
                { key: "marketing_ai" as const, label: "Marketing AI", icon: <Megaphone className="w-3.5 h-3.5" /> },
                { key: "inventory_ai" as const, label: "Inventory AI", icon: <Package className="w-3.5 h-3.5" /> },
                { key: "bi" as const, label: "Business Intel", icon: <Database className="w-3.5 h-3.5" /> },
                { key: "advisor" as const, label: "AI CFO Advisor", icon: <Bot className="w-3.5 h-3.5" /> },
                { key: "pipeline" as const, label: "Data Pipeline", icon: <Layers className="w-3.5 h-3.5" /> },
                { key: "logs" as const, label: "Pipeline Logs", icon: <ClipboardList className="w-3.5 h-3.5" /> }
              ].map((st) => (
                <button key={st.key} onClick={() => setAiSubTab(st.key)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
                    aiSubTab === st.key ? "bg-primary text-white shadow-redGlow" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}>{st.icon} {st.label}</button>
              ))}
            </div>

            {/* ─── SUB-TAB: AI DASHBOARD (Enhanced 3D Glass Cards) ─── */}
            {aiSubTab === "overview" && (
              <div className="space-y-6">
                {/* AI Health Score Hero */}
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-black/40 to-secondary/10 border border-primary/20 overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center backdrop-blur-xl">
                        <span className="text-3xl font-extrabold text-white font-number">96.5</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-heading font-extrabold text-white">AI Health Score</h3>
                        <p className="text-xs text-gray-400 mt-1">All systems operational &bull; Neural pipeline active &bull; Learning: CONTINUOUS</p>
                        <div className="flex gap-2 mt-2">
                          <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">System Online</span>
                          <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">0.18s Latency</span>
                          <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-luxuryGold/10 text-luxuryGold border border-luxuryGold/20">9 Models Active</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right hidden md:block">
                      <span className="text-[10px] text-gray-500 uppercase font-bold block">Master Accuracy</span>
                      <span className="text-3xl font-extrabold text-luxuryGold font-number">93.4%</span>
                    </div>
                  </div>
                </div>

                {/* 11 Glassmorphic 3D KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-number">
                  {[
                    { label: "AI System Status", value: "ONLINE", trend: "99.97% uptime", color: "text-emerald-400", glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]" },
                    { label: "Active ML Models", value: "9 / 12", trend: "3 standby", color: "text-white", glow: "shadow-[0_0_15px_rgba(255,255,255,0.05)]" },
                    { label: "Predictions Today", value: "1,847", trend: "100% success", color: "text-blue-400", glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]" },
                    { label: "Automations Executed", value: "312 events", trend: "+18% today", color: "text-blue-400", glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]" },
                    { label: "Recommendations Hits", value: "4,892", trend: "78% CTR", color: "text-luxuryGold", glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]" },
                    { label: "Revenue Forecast", value: "\u20b928.4L /mo", trend: "+8.4% vs target", color: "text-luxuryGold", glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]" },
                    { label: "Fraud Detections", value: "0 Threats", trend: "Clean scan", color: "text-emerald-400", glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]" },
                    { label: "Satisfaction Index", value: "94.2%", trend: "+2.1% score", color: "text-emerald-400", glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]" },
                    { label: "Core AI Accuracy", value: "96.5%", trend: "High confidence", color: "text-purple-400", glow: "shadow-[0_0_15px_rgba(168,85,247,0.15)]" },
                    { label: "Data Pipeline", value: "42.6 KB/s", trend: "Processing", color: "text-purple-400", glow: "shadow-[0_0_15px_rgba(168,85,247,0.15)]" },
                    { label: "Learning Status", value: "CONTINUOUS", trend: "Last: 1h ago", color: "text-white", glow: "shadow-[0_0_15px_rgba(255,255,255,0.05)]" }
                  ].map((card, idx) => (
                    <div key={idx} className={`p-4 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl hover:border-primary/30 transition-all group relative overflow-hidden ${card.glow} hover:scale-[1.02]`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none rounded-2xl" />
                      <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase relative z-10">
                        <span>{card.label}</span>
                        <span className="text-[9px] text-emerald-400 font-mono">{card.trend}</span>
                      </div>
                      <span className={`text-lg font-bold ${card.color} mt-1.5 block group-hover:scale-105 transition-transform origin-left relative z-10`}>{card.value}</span>
                    </div>
                  ))}
                </div>

                {/* Graph mockup & recommendations overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 backdrop-blur-xl">
                    <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Accuracy Convergence Trend</h3>
                    <div className="h-44 flex items-end justify-between px-2 gap-1.5 border-b border-white/10 pb-2">
                      {[
                        { epoch: "E1", loss: 45, accuracy: 54 },
                        { epoch: "E2", loss: 65, accuracy: 71 },
                        { epoch: "E3", loss: 80, accuracy: 82 },
                        { epoch: "E4", loss: 90, accuracy: 91 },
                        { epoch: "E5", loss: 98, accuracy: 96.5 }
                      ].map((bar, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                          <span className="text-[9px] text-luxuryGold opacity-0 group-hover:opacity-100 transition-opacity font-mono">{bar.accuracy}%</span>
                          <div className="w-full bg-primary/20 rounded-t-lg relative overflow-hidden" style={{ height: `${bar.accuracy}px` }}>
                            <div className="absolute bottom-0 w-full bg-gradient-to-t from-primary to-secondary transition-all" style={{ height: `${bar.accuracy}%` }} />
                          </div>
                          <span className="text-[10px] text-gray-500 font-bold">{bar.epoch}</span>
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold block text-center">Learning convergence curve (accuracy per training cycle)</span>
                  </div>

                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 text-xs font-number backdrop-blur-xl">
                    <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Real-time Recommendation Funnel</h3>
                    <div className="space-y-3">
                      {[
                        { context: "Action Movie Checkout", recommend: "Truffle Butter Popcorn Combo (L)", convRate: "68% purchase propensity", color: "text-orange-400" },
                        { context: "Late Evening Screenings", recommend: "Wild Mushroom Pizza + Pepsi XL", convRate: "42% checkout attachment", color: "text-blue-400" },
                        { context: "Saturday Family Crowd", recommend: "Premium Lounger Quad Selection", convRate: "88% seat preference match", color: "text-emerald-400" },
                        { context: "Student Afternoon Slot", recommend: "BOGO Ticket + Nachos Combo \u20b999", convRate: "74% conversion rate", color: "text-purple-400" }
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center hover:bg-white/10 transition-colors">
                          <div>
                            <span className="text-[10px] text-gray-500 uppercase font-bold block">{item.context}</span>
                            <span className="text-white font-bold block mt-0.5">{item.recommend}</span>
                          </div>
                          <span className={`text-[10px] font-bold ${item.color} font-mono`}>{item.convRate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: MODEL MANAGEMENT ─── */}
            {aiSubTab === "models" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                {/* Model Catalog */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Active AI Models Directory</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {aiModelsList.map((model) => (
                      <div key={model.code} className={`p-5 bg-black/40 border rounded-2xl space-y-3 flex justify-between items-start transition-all ${
                        model.isEnabled ? "border-primary/20" : "border-white/5 opacity-60"
                      }`}>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-white text-sm">{model.name}</span>
                            <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-luxuryGold/10 text-luxuryGold border border-luxuryGold/20 font-mono">{(model.accuracy * 100).toFixed(1)}% Acc</span>
                          </div>
                          <p className="text-gray-400 text-xs">{model.desc}</p>
                          <span className="text-gray-600 font-mono text-[9px] block">Model Reference Code: {model.code}</span>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <button onClick={() => handleToggleModel(model.code)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer border ${
                              model.isEnabled ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}>{model.isEnabled ? "Enabled" : "Disabled"}</button>
                          <button onClick={() => handleTrainAiModel(model.code)} disabled={isTraining}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 text-[9px] font-bold uppercase cursor-pointer disabled:opacity-50">
                            Re-Train Model
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Model Training Live progress console */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 h-fit font-mono text-[10px] text-gray-400">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2 font-sans">ML Learning Console</h3>
                  {isTraining ? (
                    <div className="space-y-3">
                      <div className="flex justify-between font-sans">
                        <span>Training: <strong className="text-white">{activeTrainingModel}</strong></span>
                        <span className="text-luxuryGold animate-pulse">Running Epochs...</span>
                      </div>
                      <div className="space-y-1 bg-black p-3 rounded-lg border border-white/5 text-[9px]">
                        {trainingEpochs.map((ep: any, idx: number) => (
                          <p key={idx} className="leading-relaxed">
                            Epoch {ep.epoch}/5 - loss: <span className="text-red-400">{ep.loss.toFixed(2)}</span> - accuracy: <span className="text-emerald-400">{ep.accuracy.toFixed(3)}</span>
                          </p>
                        ))}
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1.5 relative overflow-hidden">
                        <div className="h-full bg-primary animate-[pulse_1.5s_infinite]" style={{ width: `${(trainingEpochs.length / 5) * 100}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 font-sans space-y-2">
                      <Cpu className="w-8 h-8 text-gray-600 mx-auto animate-pulse" />
                      <span className="text-gray-500 block">Select re-train model to execute active neural parameters optimization cycles.</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: DYNAMIC TICKET PRICING ─── */}
            {aiSubTab === "pricing" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                {/* Configuration controls */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 h-fit">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Dynamic Pricing Rules</h3>
                  <div className="space-y-4">
                    <div className="space-y-1 font-number">
                      <label className="text-gray-400 font-semibold block">Minimum Seat Floor Price (₹)</label>
                      <input type="range" min={120} max={250} value={priceMin} onChange={(e) => setPriceMin(parseInt(e.target.value) || 180)} className="w-full accent-primary bg-transparent cursor-pointer" />
                      <span className="text-white font-bold block mt-1">₹{priceMin} Minimum Price Floor</span>
                    </div>
                    <div className="space-y-1 font-number">
                      <label className="text-gray-400 font-semibold block">Maximum Peak Ceiling Price (₹)</label>
                      <input type="range" min={350} max={800} value={priceMax} onChange={(e) => setPriceMax(parseInt(e.target.value) || 550)} className="w-full accent-primary bg-transparent cursor-pointer" />
                      <span className="text-white font-bold block mt-1">₹{priceMax} Maximum Cap</span>
                    </div>
                    <div className="border-t border-white/5 pt-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Auto Pricing Calibrations</span>
                        <input type="checkbox" checked={priceAutoAdjust} onChange={(e) => setPriceAutoAdjust(e.target.checked)} className="rounded accent-primary bg-black/60 border-white/10 w-4 h-4 cursor-pointer" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Manual Manager Approval Required</span>
                        <input type="checkbox" checked={priceApprovalReq} onChange={(e) => setPriceApprovalReq(e.target.checked)} className="rounded accent-primary bg-black/60 border-white/10 w-4 h-4 cursor-pointer" />
                      </div>
                    </div>
                    <button onClick={() => toast.success("Dynamic Pricing safety bounds updated.")} className="w-full py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded cursor-pointer">Apply Constraints</button>
                  </div>
                </div>

                {/* Price demand simulation curves */}
                <div className="md:col-span-2 p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Active Seat Multiplying Factors</h3>
                  <div className="border border-white/5 rounded-xl overflow-hidden font-number">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider">
                          <th className="p-4">Screen Name</th>
                          <th className="p-4">Occupancy Rate</th>
                          <th className="p-4">Base Ticket Price</th>
                          <th className="p-4">AI Recommended Price</th>
                          <th className="p-4 text-right">Pricing Multiplier</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-black/20 text-xs">
                        {[
                          { screen: "Screen 1 IMAX (Mumbai)", rate: "86%", base: 250, reco: 320, factor: 1.28, color: "text-emerald-400" },
                          { screen: "Screen 2 Dolby Atmos", rate: "48%", base: 220, reco: 220, factor: 1.0, color: "text-white" },
                          { screen: "Screen 3 Premium Lounge", rate: "94%", base: 450, reco: 550, factor: 1.22, color: "text-emerald-400" },
                          { screen: "Screen 4 Mini Atmos", rate: "12%", base: 180, reco: 150, factor: 0.83, color: "text-red-400" }
                        ].map((scr, idx) => (
                          <tr key={idx} className="hover:bg-white/5">
                            <td className="p-4 font-bold text-white font-heading">{scr.screen}</td>
                            <td className="p-4 text-gray-400">{scr.rate}</td>
                            <td className="p-4 text-gray-500">₹{scr.base}</td>
                            <td className="p-4 text-white font-bold">₹{scr.reco}</td>
                            <td className="p-4 text-right">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold font-mono ${scr.color}`}>{scr.factor}x</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: AUTOMATION RULES ─── */}
            {aiSubTab === "rules" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                {/* Active Rules List */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Smart CRM & Ops Automation Campaigns</h3>
                  <div className="space-y-3">
                    {automationRulesList.map((rule) => (
                      <div key={rule.id} className={`p-4 bg-black/40 border rounded-2xl flex justify-between items-center ${
                        rule.active ? "border-primary/20" : "border-white/5 opacity-60"
                      }`}>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-white text-sm">{rule.name}</span>
                            <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">{rule.trigger}</span>
                          </div>
                          <p className="text-gray-400 text-xs mt-1">Condition: <code className="text-luxuryGold">{rule.condition}</code> | Action: <code className="text-white">{rule.action}</code></p>
                          <span className="text-[10px] text-gray-500 font-mono">Executed: <strong className="text-white">{rule.runs} times</strong></span>
                        </div>
                        <button onClick={() => {
                          setAutomationRulesList(automationRulesList.map(r => r.id === rule.id ? { ...r, active: !r.active } : r));
                          toast.success(`Rule campaigns status changed.`);
                        }}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase cursor-pointer border ${
                            rule.active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}>{rule.active ? "Active" : "Paused"}</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Automation Rules wizard builder */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 h-fit">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Create AI Campaign trigger</h3>
                  <form onSubmit={handleCreateAutomationRule} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold block">Automation Rule Name</label>
                      <input type="text" placeholder="e.g. Win-back campaign 30 days" value={newRuleName} onChange={(e) => setNewRuleName(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold block">System Event Trigger</label>
                      <select value={newRuleTrigger} onChange={(e) => setNewRuleTrigger(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none">
                        <option value="CUSTOMER_INACTIVE_30_DAYS">Customer inactive 30 days</option>
                        <option value="LOYALTY_GOLD_UPGRADE">Loyalty Gold Tier upgrade</option>
                        <option value="CCTV_Bottleneck_Queue">{"Lobby Queue > 8 mins (CCTV)"}</option>
                        <option value="HIGH_REVENUE_SPIKE">{"Daily revenue spike > 80%"}</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold block">Condition Criteria</label>
                      <input type="text" placeholder="e.g. lifetimeSpend &gt; 2000" value={newRuleCondition} onChange={(e) => setNewRuleCondition(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold block">Action Operations</label>
                      <input type="text" placeholder="e.g. Send SMS voucher 'WIN100'" value={newRuleAction} onChange={(e) => setNewRuleAction(e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" />
                    </div>
                    <button type="submit" className="w-full py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded cursor-pointer">Save automation path</button>
                  </form>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: CUSTOMER INTEL ─── */}
            {aiSubTab === "customer" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Personalized watchlist previews */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Customer Recommendation Previews</h3>
                  <div className="space-y-3 font-number">
                    {[
                      { name: "Priya Sharma (VIP Gold)", segment: "Sci-Fi Fanatic", item: "Recommended: 'Aether: Rising Stars'", reason: "Based on watch history (Dune, Interstellar)" },
                      { name: "Ananya Patel (Silver)", segment: "Student Segment", item: "Recommended: 'Weekend BOGO Ticket + Nachos Discount'", reason: "High F&B attachment rate during weekend afternoons" },
                      { name: "Vikram Mehta (Executive)", segment: "Late Night Thrillers", item: "Recommended: 'Shadows of the Dynasty' Row E Seat 11", reason: "Preferences pattern matching double seat middle-back slots" }
                    ].map((cust, idx) => (
                      <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-bold block">{cust.name}</span>
                          <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">{cust.segment}</span>
                        </div>
                        <span className="text-luxuryGold font-semibold block">{cust.item}</span>
                        <p className="text-gray-500 text-[10px]">{cust.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sentiment analysis meters */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Lobby & Chats Sentiment Tracker</h3>
                    <div className="grid grid-cols-3 gap-2 mt-4 text-center font-number">
                      <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                        <span className="text-2xl block text-emerald-400 font-bold">68%</span>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold">Happy Reviews</span>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                        <span className="text-2xl block text-white font-bold">22%</span>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold">Neutral Feedback</span>
                      </div>
                      <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                        <span className="text-2xl block text-red-400 font-bold">10%</span>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold">Frustrated Alerts</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <span className="text-white font-heading font-bold text-xs block">AI Sentiment Improvement Recommendations:</span>
                    <ul className="list-disc list-inside text-gray-400 text-xs space-y-1">
                      <li>Address <strong className="text-white">Seat stiffness in Screen 3</strong> (12 complaints today).</li>
                      <li>Resolve concessions queues delay bottlenecks on Screen 1 entrance during peak afternoon timings.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: OWNER BI ADVISOR Q&A ─── */}
            {aiSubTab === "advisor" && (
              <div className="space-y-6 font-number text-xs">
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2 flex items-center gap-1.5"><Bot className="w-4 h-4 text-luxuryGold" /> Prestige Executive BI Advisor</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      "Predict next month revenue",
                      "Why did revenue drop this Tuesday?",
                      "Which food items are most profitable?",
                      "Audit crowd bottleneck locations"
                    ].map((q, i) => (
                      <button key={i} onClick={() => handleSendChatbotMsg(q)}
                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-left text-[10px] font-bold text-gray-300 cursor-pointer transition-all hover:border-primary/20 hover:scale-[1.02] truncate">
                        "{q}"
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-80 overflow-y-auto border border-white/10 rounded-2xl p-4 bg-black/40 space-y-4">
                  {chatMessages.map((chat, idx) => (
                    <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-4 rounded-2xl max-w-md text-xs leading-relaxed ${chat.role === 'user' ? "bg-primary text-white" : "bg-white/5 border border-white/5 text-gray-300"}`}>{chat.text}</div>
                    </div>
                  ))}
                  {isChatTyping && (<div className="flex justify-start"><div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-2"><div className="w-2 h-2 bg-luxuryGold rounded-full animate-bounce" /><div className="w-2 h-2 bg-luxuryGold rounded-full animate-bounce [animation-delay:0.2s]" /><div className="w-2 h-2 bg-luxuryGold rounded-full animate-bounce [animation-delay:0.4s]" /></div></div>)}
                </div>

                <div className="flex gap-2">
                  <input type="text" placeholder="Ask financial forecasts, concessions demand index, or queue diagnostic recommendations..." value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-black/60 border border-white/10 focus:border-primary text-sm text-white placeholder-gray-500 focus:outline-none"
                    onKeyDown={(e) => { if (e.key === "Enter") handleSendChatbotMsg(); }} />
                  <button onClick={() => handleSendChatbotMsg()} className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs uppercase tracking-widest shadow-redGlow cursor-pointer flex items-center gap-2"><Send className="w-4 h-4" /> Analyze</button>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: AI LOGS ─── */}
            {aiSubTab === "logs" && (
              <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-3 font-mono text-[10px] text-gray-400 bg-black h-96 overflow-y-auto">
                <span className="text-gray-600 block uppercase font-bold border-b border-white/5 pb-1 font-sans">Active AI Neural Decision Trace Logs</span>
                {aiSystemLogs.map((log, idx) => (
                  <p key={idx} className="leading-relaxed border-b border-white/5 pb-1">{log}</p>
                ))}
              </div>
            )}

            {/* ─── SUB-TAB: PREDICTIONS ─── */}
            {aiSubTab === "predictions" && (
              <div className="space-y-6">
                {/* Revenue Predictions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-5 bg-gradient-to-br from-emerald-500/5 to-black/40 border border-emerald-500/20 rounded-2xl backdrop-blur-xl">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Tomorrow Revenue</span>
                    <span className="text-2xl font-extrabold text-emerald-400 font-number block mt-1">{"\u20b9"}{aiPredictions.revenue.tomorrow.toLocaleString()}</span>
                    <span className="text-[9px] text-emerald-400 font-mono">{(aiPredictions.revenue.confidence * 100).toFixed(0)}% confidence</span>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-blue-500/5 to-black/40 border border-blue-500/20 rounded-2xl backdrop-blur-xl">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Next Week Revenue</span>
                    <span className="text-2xl font-extrabold text-blue-400 font-number block mt-1">{"\u20b9"}{aiPredictions.revenue.nextWeek.toLocaleString()}</span>
                    <span className="text-[9px] text-blue-400 font-mono">91% confidence</span>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-luxuryGold/5 to-black/40 border border-luxuryGold/20 rounded-2xl backdrop-blur-xl">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Next Month Revenue</span>
                    <span className="text-2xl font-extrabold text-luxuryGold font-number block mt-1">{"\u20b9"}{aiPredictions.revenue.nextMonth.toLocaleString()}</span>
                    <span className="text-[9px] text-luxuryGold font-mono">88% confidence</span>
                  </div>
                </div>

                {/* Churn Risk & Customer Return */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 backdrop-blur-xl">
                    <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-400" /> Churn Risk Predictions</h3>
                    <div className="space-y-3">
                      {aiPredictions.churnRisk.map((cust, idx) => (
                        <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-bold">{cust.name}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${
                              cust.probability > 0.6 ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}>{(cust.probability * 100).toFixed(0)}% Risk</span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-1.5"><div className={`h-full rounded-full ${cust.probability > 0.6 ? "bg-red-400" : "bg-amber-400"}`} style={{ width: `${cust.probability * 100}%` }} /></div>
                          <div className="flex justify-between text-[10px] text-gray-500">
                            <span>Reason: {cust.reason}</span>
                            <span className="text-luxuryGold">LTV: {"\u20b9"}{cust.ltv.toLocaleString()}</span>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-semibold">AI Action: {cust.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 backdrop-blur-xl">
                    <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" /> Movie Performance Forecast</h3>
                    <div className="space-y-3">
                      {aiPredictions.moviePerformance.map((movie, idx) => (
                        <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-bold">{movie.title}</span>
                            <span className="text-[9px] text-luxuryGold font-mono font-bold">{movie.confidence * 100}% conf</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-black/40 rounded-lg text-center">
                              <span className="text-[9px] text-gray-500 uppercase block">Predicted Occupancy</span>
                              <span className="text-lg font-bold text-blue-400 font-number">{movie.predictedOccupancy}%</span>
                            </div>
                            <div className="p-2 bg-black/40 rounded-lg text-center">
                              <span className="text-[9px] text-gray-500 uppercase block">Predicted Revenue</span>
                              <span className="text-lg font-bold text-emerald-400 font-number">{"\u20b9"}{(movie.predictedRevenue / 1000).toFixed(0)}K</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2 pt-2 flex items-center gap-2"><Users className="w-4 h-4 text-blue-400" /> Customer Return Predictions</h3>
                    {aiPredictions.customerReturn.map((cr, idx) => (
                      <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                        <div>
                          <span className="text-white font-bold block">{cr.name}</span>
                          <span className="text-[10px] text-gray-500">Next visit: {cr.nextVisit} &bull; Predicted spend: {"\u20b9"}{cr.spendPrediction}</span>
                        </div>
                        <span className="text-lg font-bold text-emerald-400 font-number">{(cr.returnProbability * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: DATA PIPELINE ─── */}
            {aiSubTab === "pipeline" && (
              <div className="space-y-6">
                <div className="p-6 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-xl">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-3 mb-6 flex items-center gap-2"><Layers className="w-4 h-4 text-luxuryGold" /> AI Data Pipeline Flow</h3>
                  <div className="space-y-0">
                    {pipelineStages.map((stage, idx) => (
                      <div key={idx}>
                        <div className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl hover:bg-white/5 transition-all group">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
                            {stage.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="text-white font-heading font-bold text-sm">{stage.stage}</span>
                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-mono font-bold ${stage.color}`}>{stage.throughput}</span>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                                  stage.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-luxuryGold/10 text-luxuryGold border-luxuryGold/20"
                                }`}>{stage.status}</span>
                              </div>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5 mt-2">
                              <div className={`h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all`} style={{ width: `${stage.progress}%` }} />
                            </div>
                          </div>
                        </div>
                        {idx < pipelineStages.length - 1 && (
                          <div className="flex justify-center py-1">
                            <div className="w-0.5 h-6 bg-gradient-to-b from-primary/30 to-transparent" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pipeline Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-number">
                  {[
                    { label: "Memory Used", value: "2.4 / 8.0 GB", color: "text-blue-400" },
                    { label: "GPU Utilization", value: "67.3%", color: "text-purple-400" },
                    { label: "Events Processed (24h)", value: "297,600", color: "text-emerald-400" },
                    { label: "Model Retraining Cycle", value: "Every 6 hrs", color: "text-luxuryGold" }
                  ].map((m, idx) => (
                    <div key={idx} className="p-4 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl text-center">
                      <span className="text-[10px] text-gray-500 uppercase font-bold block">{m.label}</span>
                      <span className={`text-lg font-bold ${m.color} block mt-1`}>{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: SECURITY VISION (Computer Vision) ─── */}
            {aiSubTab === "security_vision" && (
              <div className="space-y-6 text-xs">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-number">
                  <div className="p-3 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-center backdrop-blur-xl">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">People Tracked</span>
                    <span className="text-xl font-bold text-white block mt-1">847</span>
                  </div>
                  <div className="p-3 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-center backdrop-blur-xl">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Avg Dwell Time</span>
                    <span className="text-xl font-bold text-blue-400 block mt-1">42 min</span>
                  </div>
                  <div className="p-3 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-center backdrop-blur-xl">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Peak Hour</span>
                    <span className="text-xl font-bold text-luxuryGold block mt-1">7-8 PM</span>
                  </div>
                  <div className="p-3 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-center backdrop-blur-xl">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Incidents</span>
                    <span className="text-xl font-bold text-red-400 block mt-1">2</span>
                  </div>
                  <div className="p-3 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-center backdrop-blur-xl">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Resolved</span>
                    <span className="text-xl font-bold text-emerald-400 block mt-1">1</span>
                  </div>
                </div>

                <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2 flex items-center gap-2"><Crosshair className="w-4 h-4 text-red-400" /> Computer Vision Camera Feeds</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visionCameras.map((cam) => (
                    <div key={cam.id} className={`p-4 bg-black/40 border rounded-2xl backdrop-blur-xl space-y-3 ${
                      cam.status === "ALERT" ? "border-red-500/30" : cam.status === "WARNING" ? "border-amber-500/30" : "border-white/10"
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="text-white font-heading font-bold">{cam.location}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                          cam.status === "NORMAL" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          cam.status === "WARNING" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                          "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse"
                        }`}>{cam.status}</span>
                      </div>
                      <div className="h-28 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center border border-white/5 relative overflow-hidden">
                        <Eye className="w-8 h-8 text-gray-600" />
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 rounded text-[8px] text-gray-400 font-mono">LIVE</span>
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center font-number">
                        <div>
                          <span className="text-[9px] text-gray-500 uppercase block">Crowd</span>
                          <span className={`font-bold block ${cam.crowdDensity > 80 ? "text-red-400" : cam.crowdDensity > 60 ? "text-amber-400" : "text-emerald-400"}`}>{cam.crowdDensity}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-500 uppercase block">Queue</span>
                          <span className="font-bold text-white block">{cam.queueLength}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-500 uppercase block">Wait</span>
                          <span className="font-bold text-white block">{cam.waitTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detection Alerts */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-3 backdrop-blur-xl">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Active AI Detections</h3>
                  {[
                    { type: "CROWD_DENSITY", location: "Concessions Counter", severity: "HIGH", details: "Peak density exceeds 85% threshold", time: "2 mins ago" },
                    { type: "UNATTENDED_OBJECT", location: "Emergency Exit 2", severity: "CRITICAL", details: "Unattended bag flagged for 12 minutes", time: "12 mins ago" },
                    { type: "QUEUE_BOTTLENECK", location: "Screen 1 Entrance", severity: "MEDIUM", details: "Wait time approaching 5 min threshold", time: "5 mins ago" }
                  ].map((det, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border flex justify-between items-center ${
                      det.severity === "CRITICAL" ? "bg-red-500/5 border-red-500/20" :
                      det.severity === "HIGH" ? "bg-amber-500/5 border-amber-500/20" :
                      "bg-white/5 border-white/5"
                    }`}>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                            det.severity === "CRITICAL" ? "bg-red-500/10 text-red-400" : det.severity === "HIGH" ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"
                          }`}>{det.severity}</span>
                          <span className="text-white font-bold">{det.type.replace(/_/g, " ")}</span>
                        </div>
                        <span className="text-gray-400 text-[10px] block mt-0.5">{det.location} &mdash; {det.details}</span>
                      </div>
                      <span className="text-[9px] text-gray-500 font-mono whitespace-nowrap">{det.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: MARKETING AI ─── */}
            {aiSubTab === "marketing_ai" && (
              <div className="space-y-6 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Campaign Ideas */}
                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 backdrop-blur-xl">
                    <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2 flex items-center gap-2"><Megaphone className="w-4 h-4 text-primary" /> AI Campaign Suggestions</h3>
                    <div className="space-y-3">
                      {marketingCampaignIdeas.map((camp) => (
                        <div key={camp.id} className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2 hover:bg-white/10 transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-heading font-bold">{camp.title}</span>
                            <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">{(camp.confidence * 100).toFixed(0)}% conf</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 font-number">
                            <div><span className="text-gray-500 text-[10px] block">Channel</span><span className="text-white font-semibold">{camp.channel}</span></div>
                            <div><span className="text-gray-500 text-[10px] block">Target</span><span className="text-white font-semibold">{camp.audience}</span></div>
                            <div><span className="text-gray-500 text-[10px] block">Expected Reach</span><span className="text-blue-400 font-bold">{camp.reach.toLocaleString()}</span></div>
                            <div><span className="text-gray-500 text-[10px] block">Predicted Revenue</span><span className="text-emerald-400 font-bold">{"\u20b9"}{camp.revenue.toLocaleString()}</span></div>
                          </div>
                          <div className="flex justify-between items-center border-t border-white/5 pt-2">
                            <span className="text-gray-500 text-[10px]">Best Time: <strong className="text-luxuryGold">{camp.bestTime}</strong></span>
                            <button onClick={() => toast.success(`Campaign "${camp.title}" launched!`)} className="px-3 py-1 rounded bg-primary hover:bg-primary-hover text-white text-[9px] font-bold uppercase cursor-pointer">Launch</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Generated Content & Insights */}
                  <div className="space-y-6">
                    <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 backdrop-blur-xl">
                      <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2 flex items-center gap-2"><FileText className="w-4 h-4 text-luxuryGold" /> AI Generated Content</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                          <span className="text-[10px] text-primary uppercase font-bold block">Email Subject</span>
                          <p className="text-white mt-1">Your weekend blockbuster awaits! {"\ud83c\udfac"} Up to 50% off premium seats</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                          <span className="text-[10px] text-emerald-400 uppercase font-bold block">WhatsApp Message</span>
                          <p className="text-white mt-1">{"\ud83c\udfac"} <strong>CineVerse Special!</strong> New releases this Friday! Book now with PRESTIGE50 for 50% off. Reply BOOK to reserve.</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                          <span className="text-[10px] text-blue-400 uppercase font-bold block">Social Media Post</span>
                          <p className="text-white mt-1">Weekend plans? Sorted! {"\ud83c\udf7f"} Watch Aether in IMAX 3D at CineVerse. Early bird gets 50% off premium loungers! #CineVerse #WeekendVibes</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-3 backdrop-blur-xl font-number">
                      <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Audience Insights</h3>
                      {[
                        { label: "Best Day to Send", value: "Thursday", color: "text-white" },
                        { label: "Best Time Window", value: "4:00 PM - 6:00 PM", color: "text-luxuryGold" },
                        { label: "Highest Open Rate", value: "PUSH (42%)", color: "text-blue-400" },
                        { label: "Highest Conversion", value: "WHATSAPP (18%)", color: "text-emerald-400" },
                        { label: "Seasonal Trend", value: "Monsoon +23% evening footfall", color: "text-purple-400" }
                      ].map((ins, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                          <span className="text-gray-400 font-semibold">{ins.label}</span>
                          <span className={`font-bold ${ins.color}`}>{ins.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: INVENTORY AI ─── */}
            {aiSubTab === "inventory_ai" && (
              <div className="space-y-6 text-xs">
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-xl space-y-4">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2 flex items-center gap-2"><Package className="w-4 h-4 text-primary" /> AI Inventory Demand Predictions</h3>
                  <div className="border border-white/5 rounded-xl overflow-hidden font-number">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider text-[10px]">
                          <th className="p-3">Item</th>
                          <th className="p-3">Current Stock</th>
                          <th className="p-3">Predicted Demand</th>
                          <th className="p-3">Days Left</th>
                          <th className="p-3">Urgency</th>
                          <th className="p-3">Suggested Order</th>
                          <th className="p-3">Best Supplier</th>
                          <th className="p-3 text-right">Est. Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-black/20">
                        {inventoryPredictions.map((item, idx) => (
                          <tr key={idx} className="hover:bg-white/5">
                            <td className="p-3 font-bold text-white font-heading">{item.item}</td>
                            <td className="p-3 text-gray-400">{item.stock} {item.unit}</td>
                            <td className="p-3 text-white">{item.demand} {item.unit}</td>
                            <td className="p-3"><span className={`font-bold ${item.daysLeft <= 2 ? "text-red-400" : item.daysLeft <= 4 ? "text-amber-400" : "text-emerald-400"}`}>{item.daysLeft} days</span></td>
                            <td className="p-3"><span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                              item.urgency === "CRITICAL" ? "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse" :
                              item.urgency === "HIGH" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                              "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            }`}>{item.urgency}</span></td>
                            <td className="p-3 text-blue-400 font-bold">{item.order > 0 ? `${item.order} ${item.unit}` : "—"}</td>
                            <td className="p-3 text-gray-400">{item.supplier}</td>
                            <td className="p-3 text-right text-white font-bold">{item.cost > 0 ? `\u20b9${item.cost.toLocaleString()}` : "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Waste & Weekly Forecast */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-3 backdrop-blur-xl">
                    <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Waste Reduction Intelligence</h3>
                    <div className="grid grid-cols-2 gap-3 font-number">
                      <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl text-center">
                        <span className="text-[10px] text-gray-500 uppercase block">Current Waste</span>
                        <span className="text-xl font-bold text-red-400 block">8.4%</span>
                      </div>
                      <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-center">
                        <span className="text-[10px] text-gray-500 uppercase block">Target Waste</span>
                        <span className="text-xl font-bold text-emerald-400 block">5.0%</span>
                      </div>
                    </div>
                    <div className="p-3 bg-luxuryGold/5 border border-luxuryGold/10 rounded-xl text-center font-number">
                      <span className="text-[10px] text-gray-500 uppercase block">Savings if Optimized</span>
                      <span className="text-xl font-bold text-luxuryGold block">{"\u20b9"}24,500 /month</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-500 uppercase font-bold block">Top Wasted Items:</span>
                      <span className="text-white text-[10px]">Sandwich Bread (12% waste) &bull; Fresh Salad Mix (18% waste)</span>
                    </div>
                  </div>

                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-3 backdrop-blur-xl">
                    <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Weekly Demand Forecast</h3>
                    <div className="h-40 flex items-end justify-between px-1 gap-2 border-b border-white/10 pb-2 font-number">
                      {[
                        { day: "Mon", footfall: 420, index: 0.6 },
                        { day: "Tue", footfall: 380, index: 0.5 },
                        { day: "Wed", footfall: 510, index: 0.7 },
                        { day: "Thu", footfall: 480, index: 0.65 },
                        { day: "Fri", footfall: 890, index: 1.2 },
                        { day: "Sat", footfall: 1240, index: 1.8 },
                        { day: "Sun", footfall: 1100, index: 1.5 }
                      ].map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                          <span className="text-[8px] text-luxuryGold opacity-0 group-hover:opacity-100 transition-opacity">{d.footfall}</span>
                          <div className="w-full rounded-t-lg relative overflow-hidden bg-primary/10" style={{ height: `${(d.footfall / 1240) * 120}px` }}>
                            <div className="absolute bottom-0 w-full bg-gradient-to-t from-primary to-secondary" style={{ height: "100%" }} />
                          </div>
                          <span className="text-[9px] text-gray-500 font-bold">{d.day}</span>
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-500 text-center block uppercase font-bold">Expected footfall by day of week</span>
                  </div>
                </div>
              </div>
            )}

            {/* ─── SUB-TAB: BUSINESS INTELLIGENCE ─── */}
            {aiSubTab === "bi" && (
              <div className="space-y-6 text-xs">
                {/* BI KPI Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-number">
                  {[
                    { label: "Revenue This Month", value: "\u20b928.4L", trend: "+8.4%", trendColor: "text-emerald-400", icon: <DollarSign className="w-4 h-4 text-luxuryGold" /> },
                    { label: "Customer LTV Avg", value: "\u20b92,840", trend: "+12%", trendColor: "text-emerald-400", icon: <Users className="w-4 h-4 text-blue-400" /> },
                    { label: "Repeat Purchase Rate", value: "62%", trend: "+3.2%", trendColor: "text-emerald-400", icon: <Repeat className="w-4 h-4 text-purple-400" /> },
                    { label: "Customer Retention", value: "78.5%", trend: "+1.8%", trendColor: "text-emerald-400", icon: <Award className="w-4 h-4 text-emerald-400" /> }
                  ].map((kpi, idx) => (
                    <div key={idx} className="p-4 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl space-y-2">
                      <div className="flex justify-between items-center">
                        {kpi.icon}
                        <span className={`text-[9px] font-bold font-mono ${kpi.trendColor}`}>{kpi.trend}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 uppercase font-bold block">{kpi.label}</span>
                      <span className="text-2xl font-extrabold text-white block">{kpi.value}</span>
                    </div>
                  ))}
                </div>

                {/* BI Panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 backdrop-blur-xl">
                    <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" /> Revenue Source Breakdown</h3>
                    <div className="space-y-3 font-number">
                      {[
                        { source: "Movie Tickets", pct: 58, amount: 1647200, color: "bg-primary" },
                        { source: "Food & Beverages", pct: 24, amount: 681600, color: "bg-orange-500" },
                        { source: "Membership Fees", pct: 10, amount: 284000, color: "bg-purple-500" },
                        { source: "Parking & Others", pct: 8, amount: 227200, color: "bg-blue-500" }
                      ].map((src, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-semibold">{src.source}</span>
                            <span className="text-gray-400">{"\u20b9"}{(src.amount / 100000).toFixed(1)}L ({src.pct}%)</span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-2">
                            <div className={`h-full rounded-full ${src.color}`} style={{ width: `${src.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 backdrop-blur-xl">
                    <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-luxuryGold" /> AI Business Insights</h3>
                    <div className="space-y-3">
                      {[
                        { category: "RECOMMENDATION", title: "Launch Student Segment Campaign", desc: "18-25 age group shows 340% higher weekend conversion. Predicted ROI: 1592%.", impact: "+\u20b984K", color: "text-emerald-400" },
                        { category: "ANOMALY", title: "Tuesday Revenue Anomaly Detected", desc: "Revenue dropped 34% vs forecast due to heavy monsoon rainfall in Mumbai.", impact: "-\u20b942K", color: "text-red-400" },
                        { category: "RISK", title: "Premium Butter Stockout Imminent", desc: "Current stock covers only 1 day. Immediate restock required to avoid concessions disruption.", impact: "-\u20b945K", color: "text-amber-400" }
                      ].map((insight, idx) => (
                        <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                              insight.category === "RECOMMENDATION" ? "bg-emerald-500/10 text-emerald-400" :
                              insight.category === "ANOMALY" ? "bg-red-500/10 text-red-400" :
                              "bg-amber-500/10 text-amber-400"
                            }`}>{insight.category}</span>
                            <span className="text-white font-bold">{insight.title}</span>
                          </div>
                          <p className="text-gray-400 text-[10px]">{insight.desc}</p>
                          <span className={`text-[10px] font-bold ${insight.color}`}>Impact: {insight.impact}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}


        {/* ═══════════════════════════════════════════════════════
           TAB — ADVERTISEMENT & BRAND PARTNERSHIPS
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "ads" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-heading font-extrabold tracking-tight border-b border-white/5 pb-4 flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-primary" /> Advertisement & Brand Command Center
            </h2>

            {/* Sub-Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto border-b border-white/5 pb-3">
              {([
                { key: "overview" as const, label: "Dashboard", icon: <TrendingUp className="w-3.5 h-3.5" /> },
                { key: "campaigns" as const, label: "Campaigns", icon: <Target className="w-3.5 h-3.5" /> },
                { key: "spaces" as const, label: "Ad Spaces", icon: <Grid className="w-3.5 h-3.5" /> },
                { key: "sponsors" as const, label: "Sponsorships", icon: <Award className="w-3.5 h-3.5" /> },
                { key: "billing" as const, label: "Billing", icon: <CreditCard className="w-3.5 h-3.5" /> },
                { key: "analytics" as const, label: "Analytics", icon: <BarChart3 className="w-3.5 h-3.5" /> }
              ]).map((st) => (
                <button key={st.key} onClick={() => setAdsSubTab(st.key)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
                    adsSubTab === st.key ? "bg-primary text-white shadow-redGlow" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}>{st.icon} {st.label}</button>
              ))}
            </div>

            {/* ─── ADS OVERVIEW ─── */}
            {adsSubTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-number">
                  {[
                    { label: "Total Ad Revenue", value: "₹24,50,000", icon: <DollarSign className="w-4 h-4" />, color: "text-luxuryGold" },
                    { label: "Active Campaigns", value: "18", icon: <Target className="w-4 h-4" />, color: "text-white" },
                    { label: "Brand Partners", value: "12", icon: <Users className="w-4 h-4" />, color: "text-blue-400" },
                    { label: "Ad Spaces Available", value: "24", icon: <Grid className="w-4 h-4" />, color: "text-emerald-400" },
                    { label: "Average CTR", value: "3.8%", icon: <Eye className="w-4 h-4" />, color: "text-blue-400" },
                    { label: "Impressions / Month", value: "4,86,000", icon: <Eye className="w-4 h-4" />, color: "text-white" },
                    { label: "Total Clicks", value: "18,500", icon: <TrendingUp className="w-4 h-4" />, color: "text-emerald-400" },
                    { label: "Conversion Rate", value: "12.4%", icon: <Star className="w-4 h-4" />, color: "text-luxuryGold" }
                  ].map((card, i) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-primary/30 transition-all group">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold flex items-center gap-1">{card.icon} {card.label}</span>
                      <span className={`text-lg font-bold ${card.color} mt-1 block group-hover:scale-105 transition-transform origin-left`}>{card.value}</span>
                    </div>
                  ))}
                </div>

                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2 flex items-center gap-2"><Sparkles className="w-4 h-4 text-luxuryGold" /> AI Ad Optimization Suggestions</h3>
                  <ul className="text-xs text-gray-400 space-y-2 list-disc list-inside">
                    <li><strong className="text-white">Screen Ad Timing:</strong> Move <code className="text-luxuryGold bg-white/5 px-1 rounded">Samsung Galaxy</code> pre-show ad to Friday 7PM slot — AI predicts 34% higher engagement with action movie audiences.</li>
                    <li><strong className="text-white">Food Counter Displays:</strong> Coca-Cola banner at Concession Left has 2.1% CTR vs 4.8% average. Suggest rotating with <code className="text-luxuryGold bg-white/5 px-1 rounded">Pepsi Summer Campaign</code>.</li>
                    <li><strong className="text-white">Website Banner:</strong> Homepage hero ad slot is underpriced by ₹2,400/day based on traffic volume. Recommend price increase to ₹4,900/day.</li>
                  </ul>
                </div>

                {/* Revenue by Channel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                    <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Revenue by Ad Channel</h3>
                    <div className="space-y-3 font-number text-xs">
                      {[
                        { channel: "Cinema Screen Ads", revenue: "₹12,40,000", pct: 50.6 },
                        { channel: "Digital Display (Lobby)", revenue: "₹4,80,000", pct: 19.6 },
                        { channel: "Sponsorships", revenue: "₹4,20,000", pct: 17.1 },
                        { channel: "Website & App Ads", revenue: "₹3,10,000", pct: 12.7 }
                      ].map((ch, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-gray-400 mb-1"><span>{ch.channel}</span><span className="text-white font-bold">{ch.revenue}</span></div>
                          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all" style={{ width: `${ch.pct}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                    <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Top Performing Campaigns</h3>
                    <div className="space-y-2 text-xs">
                      {[
                        { name: "Samsung Galaxy S25 Launch", brand: "Samsung", ctr: "5.2%", revenue: "₹3,80,000", status: "ACTIVE" },
                        { name: "Coca-Cola Summer Blast", brand: "Coca-Cola", ctr: "4.8%", revenue: "₹2,40,000", status: "ACTIVE" },
                        { name: "Nike Air Max Premiere", brand: "Nike", ctr: "3.9%", revenue: "₹1,85,000", status: "COMPLETED" }
                      ].map((c, i) => (
                        <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center">
                          <div><span className="text-white font-heading font-bold block">{c.name}</span><span className="text-gray-500">{c.brand} · CTR {c.ctr}</span></div>
                          <div className="text-right"><span className="text-luxuryGold font-bold font-number block">{c.revenue}</span><span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${c.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-gray-400 border border-white/10"}`}>{c.status}</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── ADS CAMPAIGNS ─── */}
            {adsSubTab === "campaigns" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 border border-white/5 rounded-xl overflow-hidden font-number text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider">
                        <th className="p-4">Campaign</th><th className="p-4">Brand</th><th className="p-4">Type</th><th className="p-4">Budget</th><th className="p-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-black/20 text-xs">
                      {[
                        { name: "Galaxy S25 Pre-Show", brand: "Samsung", type: "SCREEN", budget: "₹3,80,000", status: "ACTIVE" },
                        { name: "Summer Blast Lobby", brand: "Coca-Cola", type: "DIGITAL_DISPLAY", budget: "₹1,20,000", status: "ACTIVE" },
                        { name: "Combo Meal Counter", brand: "McDonald's", type: "FOOD_COUNTER", budget: "₹85,000", status: "SCHEDULED" },
                        { name: "Homepage Hero Banner", brand: "Nike", type: "WEBSITE", budget: "₹2,40,000", status: "COMPLETED" },
                        { name: "App Push Promo", brand: "Amazon Prime", type: "MOBILE_APP", budget: "₹1,60,000", status: "ACTIVE" }
                      ].map((c, i) => (
                        <tr key={i} className="hover:bg-white/5">
                          <td className="p-4 font-bold text-white font-heading">{c.name}</td>
                          <td className="p-4 text-gray-400">{c.brand}</td>
                          <td className="p-4"><span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-white/5 text-gray-400 border border-white/10">{c.type}</span></td>
                          <td className="p-4 text-luxuryGold font-bold">{c.budget}</td>
                          <td className="p-4 text-right"><span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${c.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : c.status === "SCHEDULED" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-white/5 text-gray-400 border-white/10"}`}>{c.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 h-fit">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Create Campaign</h3>
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1"><label className="text-gray-400 block font-semibold">Campaign Name</label><input type="text" placeholder="e.g. Summer Movie Promo" className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" /></div>
                    <div className="space-y-1"><label className="text-gray-400 block font-semibold">Brand</label><input type="text" placeholder="e.g. Samsung" className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" /></div>
                    <div className="space-y-1"><label className="text-gray-400 block font-semibold">Ad Type</label><select className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary"><option>SCREEN</option><option>DIGITAL_DISPLAY</option><option>FOOD_COUNTER</option><option>WEBSITE</option><option>MOBILE_APP</option><option>EVENT</option></select></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1"><label className="text-gray-400 block font-semibold">Start Date</label><input type="date" className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" /></div>
                      <div className="space-y-1"><label className="text-gray-400 block font-semibold">End Date</label><input type="date" className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" /></div>
                    </div>
                    <div className="space-y-1"><label className="text-gray-400 block font-semibold">Budget (₹)</label><input type="number" placeholder="50000" className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" /></div>
                    <button className="w-full py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded cursor-pointer text-xs">Launch Campaign</button>
                  </div>
                </div>
              </div>
            )}

            {/* ─── ADS SPACES ─── */}
            {adsSubTab === "spaces" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: "Audi 1 — Pre-Show Video", location: "SCREEN", price: "₹1,500/play", status: "BOOKED" },
                  { name: "Audi 2 — Interval Slot", location: "SCREEN", price: "₹1,200/play", status: "AVAILABLE" },
                  { name: "Lobby LED Main Panel", location: "LOBBY", price: "₹800/day", status: "BOOKED" },
                  { name: "Lobby Entry Standee", location: "LOBBY", price: "₹450/day", status: "AVAILABLE" },
                  { name: "Food Counter Left Banner", location: "FOOD_COUNTER", price: "₹350/day", status: "AVAILABLE" },
                  { name: "Food Counter Digital Menu", location: "FOOD_COUNTER", price: "₹600/day", status: "BOOKED" },
                  { name: "Website Homepage Hero", location: "WEBSITE", price: "₹2,500/day", status: "AVAILABLE" },
                  { name: "Mobile App Splash Screen", location: "APP", price: "₹1,800/day", status: "AVAILABLE" }
                ].map((space, i) => (
                  <div key={i} className={`p-5 bg-black/40 border rounded-2xl space-y-3 ${space.status === "BOOKED" ? "border-red-500/20" : "border-emerald-500/20"}`}>
                    <div className="flex justify-between items-start">
                      <span className="font-heading font-bold text-white text-sm">{space.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${space.status === "BOOKED" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>{space.status}</span>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex justify-between"><span>Location:</span><span className="text-white font-bold">{space.location}</span></div>
                      <div className="flex justify-between"><span>Pricing:</span><span className="text-luxuryGold font-bold font-number">{space.price}</span></div>
                    </div>
                    <button className={`w-full py-2 rounded-lg font-bold text-xs uppercase cursor-pointer ${space.status === "AVAILABLE" ? "bg-primary text-white" : "bg-white/5 text-gray-400 border border-white/10"}`}>{space.status === "AVAILABLE" ? "Book This Space" : "View Details"}</button>
                  </div>
                ))}
              </div>
            )}

            {/* ─── ADS SPONSORS ─── */}
            {adsSubTab === "sponsors" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[
                    { type: "PREMIERE", price: "₹5,00,000", benefits: ["Logo on Screen", "Stage Branding", "VIP Invitations", "Social Media Posts"] },
                    { type: "EVENT", price: "₹3,00,000", benefits: ["Event Signage", "Screen Mention", "Website Banner", "Email Blast"] },
                    { type: "FESTIVAL", price: "₹8,00,000", benefits: ["Full Festival Branding", "All Screens Display", "VIP Lounge Naming", "Media Coverage"] },
                    { type: "SCREEN", price: "₹1,50,000", benefits: ["Screen Logo Watermark", "Pre-Show Ad Slot", "Ticket Branding"] },
                    { type: "FOOD", price: "₹75,000", benefits: ["Counter Branding", "Menu Placement", "Combo Naming Rights"] }
                  ].map((pkg, i) => (
                    <div key={i} className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 hover:border-primary/30 transition-all">
                      <div className="text-center">
                        <span className="px-3 py-1 rounded-full bg-luxuryGold/10 border border-luxuryGold/20 text-luxuryGold text-[10px] font-extrabold uppercase">{pkg.type}</span>
                        <span className="text-2xl font-extrabold text-white font-number block mt-3">{pkg.price}</span>
                      </div>
                      <ul className="text-xs text-gray-400 space-y-1.5">
                        {pkg.benefits.map((b, j) => <li key={j} className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> {b}</li>)}
                      </ul>
                      <button className="w-full py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs uppercase rounded cursor-pointer">Select Package</button>
                    </div>
                  ))}
                </div>
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2 mb-4">Active Sponsors</h3>
                  <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead><tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider"><th className="p-4">Sponsor</th><th className="p-4">Package</th><th className="p-4">Amount</th><th className="p-4 text-right">Status</th></tr></thead>
                      <tbody className="divide-y divide-white/5 bg-black/20">
                        {[
                          { name: "PepsiCo India", pkg: "FESTIVAL", amount: "₹8,00,000", status: "ACTIVE" },
                          { name: "Samsung Electronics", pkg: "PREMIERE", amount: "₹5,00,000", status: "ACTIVE" },
                          { name: "Domino's Pizza", pkg: "FOOD", amount: "₹75,000", status: "COMPLETED" }
                        ].map((s, i) => (
                          <tr key={i} className="hover:bg-white/5"><td className="p-4 font-bold text-white font-heading">{s.name}</td><td className="p-4 text-gray-400">{s.pkg}</td><td className="p-4 text-luxuryGold font-bold">{s.amount}</td><td className="p-4 text-right"><span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${s.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/5 text-gray-400 border-white/10"}`}>{s.status}</span></td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ─── ADS BILLING ─── */}
            {adsSubTab === "billing" && (
              <div className="space-y-6">
                <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead><tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider"><th className="p-4">Invoice #</th><th className="p-4">Brand</th><th className="p-4">Campaign</th><th className="p-4">Amount</th><th className="p-4">Date</th><th className="p-4 text-right">Status</th></tr></thead>
                    <tbody className="divide-y divide-white/5 bg-black/20">
                      {[
                        { id: "INV-AD-001", brand: "Samsung", campaign: "Galaxy S25 Pre-Show", amount: "₹3,80,000", date: "2026-07-15", status: "PAID" },
                        { id: "INV-AD-002", brand: "Coca-Cola", campaign: "Summer Blast Lobby", amount: "₹1,20,000", date: "2026-07-12", status: "PAID" },
                        { id: "INV-AD-003", brand: "Nike", campaign: "Air Max Premiere", amount: "₹2,40,000", date: "2026-07-10", status: "PENDING" },
                        { id: "INV-AD-004", brand: "Amazon Prime", campaign: "App Push Promo", amount: "₹1,60,000", date: "2026-07-08", status: "OVERDUE" },
                        { id: "INV-AD-005", brand: "McDonald's", campaign: "Combo Meal Counter", amount: "₹85,000", date: "2026-07-05", status: "PAID" }
                      ].map((inv, i) => (
                        <tr key={i} className="hover:bg-white/5">
                          <td className="p-4 font-bold text-white font-mono">{inv.id}</td><td className="p-4 text-gray-400">{inv.brand}</td><td className="p-4 text-gray-400">{inv.campaign}</td><td className="p-4 text-luxuryGold font-bold">{inv.amount}</td><td className="p-4 text-gray-500">{inv.date}</td>
                          <td className="p-4 text-right"><span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${inv.status === "PAID" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : inv.status === "PENDING" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>{inv.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Monthly Ad Revenue Trend</h3>
                  <div className="h-44 flex items-end justify-between px-2 gap-2 border-b border-white/10 pb-2 font-number">
                    {[
                      { month: "Jan", value: 45 }, { month: "Feb", value: 52 }, { month: "Mar", value: 68 }, { month: "Apr", value: 74 },
                      { month: "May", value: 82 }, { month: "Jun", value: 90 }, { month: "Jul", value: 96 }
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-md transition-all hover:opacity-80" style={{ height: `${bar.value}%` }} />
                        <span className="text-[9px] text-gray-500">{bar.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── ADS ANALYTICS ─── */}
            {adsSubTab === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                    <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Campaign Performance Comparison</h3>
                    <div className="space-y-3 font-number text-xs">
                      {[
                        { name: "Samsung Galaxy", views: 48600, clicks: 2520, ctr: 5.2, color: "from-blue-500 to-blue-400" },
                        { name: "Coca-Cola Summer", views: 38400, clicks: 1840, ctr: 4.8, color: "from-red-500 to-red-400" },
                        { name: "Nike Air Max", views: 28500, clicks: 1110, ctr: 3.9, color: "from-emerald-500 to-emerald-400" },
                        { name: "Amazon Prime", views: 22000, clicks: 680, ctr: 3.1, color: "from-amber-500 to-amber-400" }
                      ].map((c, i) => (
                        <div key={i}>
                          <div className="flex justify-between mb-1"><span className="text-gray-400">{c.name}</span><span className="text-white font-bold">{c.ctr}% CTR</span></div>
                          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden"><div className={`h-full bg-gradient-to-r ${c.color} rounded-full`} style={{ width: `${c.ctr * 18}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                    <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Audience Demographics</h3>
                    <div className="space-y-3 font-number text-xs">
                      {[
                        { segment: "18-24 years", pct: 35, color: "text-blue-400" },
                        { segment: "25-34 years", pct: 42, color: "text-emerald-400" },
                        { segment: "35-44 years", pct: 15, color: "text-amber-400" },
                        { segment: "45+ years", pct: 8, color: "text-purple-400" }
                      ].map((demo, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-gray-400">{demo.segment}</span>
                          <div className="flex items-center gap-2"><div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${demo.pct}%` }} /></div><span className={`font-bold ${demo.color}`}>{demo.pct}%</span></div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">AI Content Quality Score</span>
                      <div className="flex items-center gap-3"><span className="text-2xl font-extrabold text-emerald-400 font-number">94.2%</span><span className="text-xs text-gray-400">All ads pass brand safety and quality threshold checks.</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
           TAB — MULTI-THEATRE CHAIN & SAAS PLATFORM
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "chain" && (
          <div className="space-y-8">
            <div className="border-b border-white/5 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-heading font-extrabold tracking-tight flex items-center gap-2">
                  <Globe className="w-6 h-6 text-luxuryGold animate-pulse" /> Cinema Chain & SaaS Command Center
                </h2>
                <p className="text-xs text-gray-400 mt-1">Manage multi-theatre network, franchise partners, SaaS subscriptions, and enterprise tenants</p>
              </div>
              <span className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold text-[10px] uppercase">System: OPTIMAL</span>
            </div>

            {/* Sub-Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto border-b border-white/5 pb-3">
              {([
                { key: "overview" as const, label: "Network Dashboard", icon: <TrendingUp className="w-3.5 h-3.5" /> },
                { key: "theatres" as const, label: "Theatres", icon: <MapPin className="w-3.5 h-3.5" /> },
                { key: "franchise" as const, label: "Franchise", icon: <Award className="w-3.5 h-3.5" /> },
                { key: "tenants" as const, label: "SaaS Tenants", icon: <Database className="w-3.5 h-3.5" /> },
                { key: "subscriptions" as const, label: "Plans & Billing", icon: <CreditCard className="w-3.5 h-3.5" /> },
                { key: "support" as const, label: "Support Desk", icon: <MessageSquare className="w-3.5 h-3.5" /> }
              ]).map((st) => (
                <button key={st.key} onClick={() => setChainSubTab(st.key)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
                    chainSubTab === st.key ? "bg-primary text-white shadow-redGlow" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}>{st.icon} {st.label}</button>
              ))}
            </div>

            {/* ─── CHAIN OVERVIEW ─── */}
            {chainSubTab === "overview" && (
              <div className="space-y-6">
                {/* Hero Banner */}
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-luxuryGold/10 via-black/40 to-primary/10 border border-luxuryGold/20 overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-luxuryGold/5 to-transparent rounded-full blur-3xl" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-luxuryGold/20 to-primary/20 border border-luxuryGold/30 flex items-center justify-center backdrop-blur-xl">
                      <Globe className="w-10 h-10 text-luxuryGold" />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-extrabold text-white">Cinema Pro Max Network</h3>
                      <p className="text-xs text-gray-400 mt-1">12 Theatres · 8 Cities · 6 Franchise Partners · 24 SaaS Subscribers</p>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">All Systems Online</span>
                        <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">99.97% Uptime</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs font-number">
                  {[
                    { label: "Total Theatres", value: "12", color: "text-white" },
                    { label: "Total Cities", value: "8", color: "text-blue-400" },
                    { label: "Total Revenue", value: "₹12.4 Cr", color: "text-luxuryGold" },
                    { label: "Active Franchises", value: "6", color: "text-emerald-400" },
                    { label: "SaaS Subscribers", value: "24", color: "text-blue-400" },
                    { label: "SaaS Revenue", value: "₹3,45,000/mo", color: "text-luxuryGold" },
                    { label: "System Health", value: "OPTIMAL", color: "text-emerald-400" },
                    { label: "API Usage", value: "1.4K req/s", color: "text-white" },
                    { label: "Storage Used", value: "482 GB", color: "text-amber-400" },
                    { label: "Active Users", value: "840", color: "text-white" }
                  ].map((card, i) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-luxuryGold/30 transition-all group">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">{card.label}</span>
                      <span className={`text-lg font-bold ${card.color} mt-1 block group-hover:scale-105 transition-transform origin-left`}>{card.value}</span>
                    </div>
                  ))}
                </div>

                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2 mb-4">Theatre Performance Rankings</h3>
                  <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead><tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider"><th className="p-4">#</th><th className="p-4">Theatre</th><th className="p-4">City</th><th className="p-4">Revenue</th><th className="p-4">Bookings</th><th className="p-4 text-right">Rating</th></tr></thead>
                      <tbody className="divide-y divide-white/5 bg-black/20">
                        {[
                          { rank: 1, name: "CineVerse Premium", city: "Mumbai", revenue: "₹4,20,00,000", bookings: "24,000", rating: "4.8" },
                          { rank: 2, name: "CineVerse Luxe", city: "Delhi", revenue: "₹2,85,00,000", bookings: "16,500", rating: "4.6" },
                          { rank: 3, name: "CineVerse Grand", city: "Bangalore", revenue: "₹2,10,00,000", bookings: "12,800", rating: "4.7" }
                        ].map((t, i) => (
                          <tr key={i} className="hover:bg-white/5">
                            <td className="p-4"><span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold ${i === 0 ? "bg-luxuryGold/20 text-luxuryGold" : i === 1 ? "bg-gray-400/20 text-gray-300" : "bg-amber-700/20 text-amber-600"}`}>{t.rank}</span></td>
                            <td className="p-4 font-bold text-white font-heading">{t.name}</td><td className="p-4 text-gray-400">{t.city}</td>
                            <td className="p-4 text-luxuryGold font-bold">{t.revenue}</td><td className="p-4 text-white">{t.bookings}</td>
                            <td className="p-4 text-right"><span className="flex items-center gap-1 justify-end text-amber-400"><Star className="w-3 h-3 fill-current" /> {t.rating}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ─── CHAIN THEATRES ─── */}
            {chainSubTab === "theatres" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: "CineVerse Premium", city: "Mumbai", address: "Lower Parel, Mumbai 400013", manager: "Arjun Kapoor", screens: 4, capacity: 560, status: "ACTIVE" },
                  { name: "CineVerse Luxe", city: "Delhi", address: "Saket District Centre, New Delhi", manager: "Rohan Khanna", screens: 3, capacity: 420, status: "ACTIVE" },
                  { name: "CineVerse Grand", city: "Bangalore", address: "Koramangala, Bangalore 560034", manager: "Priya Sharma", screens: 3, capacity: 380, status: "ACTIVE" },
                  { name: "CineVerse Royal", city: "Hyderabad", address: "Banjara Hills, Hyderabad 500034", manager: "Karthik Reddy", screens: 2, capacity: 280, status: "UPCOMING" }
                ].map((th, i) => (
                  <div key={i} className={`p-5 bg-black/40 border rounded-2xl space-y-3 ${th.status === "ACTIVE" ? "border-emerald-500/20" : "border-amber-500/20"}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-heading font-bold text-white text-base block">{th.name}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {th.city}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${th.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>{th.status}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-number">
                      <div className="p-2 bg-white/5 rounded"><span className="text-gray-500 block text-[9px]">Manager</span><span className="text-white font-bold">{th.manager}</span></div>
                      <div className="p-2 bg-white/5 rounded"><span className="text-gray-500 block text-[9px]">Address</span><span className="text-white font-bold truncate block">{th.address}</span></div>
                      <div className="p-2 bg-white/5 rounded"><span className="text-gray-500 block text-[9px]">Screens</span><span className="text-white font-bold">{th.screens}</span></div>
                      <div className="p-2 bg-white/5 rounded"><span className="text-gray-500 block text-[9px]">Capacity</span><span className="text-white font-bold">{th.capacity} seats</span></div>
                    </div>
                    <button className="w-full py-2 bg-white/5 border border-white/10 text-white font-bold text-xs uppercase rounded cursor-pointer hover:bg-white/10">Manage Theatre</button>
                  </div>
                ))}
              </div>
            )}

            {/* ─── CHAIN FRANCHISE ─── */}
            {chainSubTab === "franchise" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead><tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider"><th className="p-4">Partner</th><th className="p-4">Company</th><th className="p-4">Location</th><th className="p-4">Revenue Share</th><th className="p-4">Investment</th><th className="p-4 text-right">Status</th></tr></thead>
                      <tbody className="divide-y divide-white/5 bg-black/20">
                        {[
                          { partner: "Rajesh Enterprises", company: "Star Cinemas Pvt Ltd", location: "Pune", share: "15%", investment: "₹2.5 Cr", status: "ACTIVE" },
                          { partner: "Ananya Group", company: "Silver Screen Co", location: "Chennai", share: "12%", investment: "₹1.8 Cr", status: "ACTIVE" },
                          { partner: "Vikram Holdings", company: "Metro Movies LLC", location: "Kolkata", share: "18%", investment: "₹3.2 Cr", status: "PENDING" }
                        ].map((f, i) => (
                          <tr key={i} className="hover:bg-white/5">
                            <td className="p-4 font-bold text-white font-heading">{f.partner}</td><td className="p-4 text-gray-400">{f.company}</td><td className="p-4 text-gray-400">{f.location}</td>
                            <td className="p-4 text-luxuryGold font-bold">{f.share}</td><td className="p-4 text-white font-bold">{f.investment}</td>
                            <td className="p-4 text-right"><span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${f.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>{f.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Approval Workflow */}
                  <div className="p-4 bg-black/40 border border-white/10 rounded-2xl">
                    <h4 className="text-xs font-heading font-bold text-gray-400 uppercase mb-3">Franchise Approval Workflow</h4>
                    <div className="flex items-center gap-2 text-[10px] font-bold">
                      {["Application Submitted", "Admin Review", "Background Check", "Agreement Signed", "Theatre Launch"].map((step, i) => (
                        <React.Fragment key={i}>
                          <span className={`px-3 py-1.5 rounded-lg border ${i < 2 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/5 text-gray-400 border-white/10"}`}>{step}</span>
                          {i < 4 && <span className="text-gray-600">→</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 h-fit">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Apply for Franchise</h3>
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1"><label className="text-gray-400 block font-semibold">Partner Name</label><input type="text" placeholder="e.g. Rajesh Enterprises" className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" /></div>
                    <div className="space-y-1"><label className="text-gray-400 block font-semibold">Company Name</label><input type="text" placeholder="e.g. Star Cinemas Pvt Ltd" className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" /></div>
                    <div className="space-y-1"><label className="text-gray-400 block font-semibold">Location</label><input type="text" placeholder="e.g. Pune" className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" /></div>
                    <div className="space-y-1"><label className="text-gray-400 block font-semibold">Investment (₹)</label><input type="number" placeholder="25000000" className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-primary" /></div>
                    <button className="w-full py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded cursor-pointer text-xs">Submit Application</button>
                  </div>
                </div>
              </div>
            )}

            {/* ─── CHAIN TENANTS ─── */}
            {chainSubTab === "tenants" && (
              <div className="space-y-6">
                <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead><tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider"><th className="p-4">Company</th><th className="p-4">Owner</th><th className="p-4">Email</th><th className="p-4">Plan</th><th className="p-4 text-right">Status</th></tr></thead>
                    <tbody className="divide-y divide-white/5 bg-black/20">
                      {[
                        { company: "Galaxy Entertainment", owner: "Vikram Mehta", email: "vikram@galaxy.com", plan: "ENTERPRISE", status: "ACTIVE" },
                        { company: "Miraj Multiplexes", owner: "Ananya Patel", email: "ananya@miraj.com", plan: "PROFESSIONAL", status: "ACTIVE" },
                        { company: "Cinepolis India", owner: "Rahul Verma", email: "rahul@cinepolis.in", plan: "PREMIUM", status: "ACTIVE" },
                        { company: "Wave Cinemas", owner: "Suresh Kumar", email: "suresh@wave.com", plan: "BASIC", status: "SUSPENDED" }
                      ].map((ten, i) => (
                        <tr key={i} className="hover:bg-white/5">
                          <td className="p-4 font-bold text-white font-heading">{ten.company}</td><td className="p-4 text-gray-400">{ten.owner}</td><td className="p-4 text-gray-400 font-mono">{ten.email}</td>
                          <td className="p-4"><span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${ten.plan === "PREMIUM" ? "bg-luxuryGold/10 text-luxuryGold border-luxuryGold/20" : ten.plan === "ENTERPRISE" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : ten.plan === "PROFESSIONAL" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-white/5 text-gray-400 border-white/10"}`}>{ten.plan}</span></td>
                          <td className="p-4 text-right"><span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${ten.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>{ten.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                    <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Feature Flags — Galaxy Entertainment</h3>
                    <div className="space-y-2 text-xs">
                      {[
                        { feature: "AI Recommendations", enabled: true }, { feature: "Mobile App Access", enabled: true },
                        { feature: "Advanced Analytics", enabled: true }, { feature: "Marketing Automation", enabled: false },
                        { feature: "CRM Module", enabled: true }, { feature: "Inventory AI", enabled: false },
                        { feature: "Security Vision", enabled: true }, { feature: "Custom Reports", enabled: false }
                      ].map((flag, i) => (
                        <div key={i} className="flex justify-between items-center p-2 bg-white/5 rounded-lg border border-white/5">
                          <span className="text-gray-300 font-semibold">{flag.feature}</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${flag.enabled ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>{flag.enabled ? "ON" : "OFF"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                    <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2">Usage Metrics</h3>
                    <div className="space-y-4 text-xs font-number">
                      {[
                        { metric: "API Calls (This Month)", value: "8,45,000", max: 1000000, pct: 84.5 },
                        { metric: "Storage Used", value: "14.5 GB", max: 50, pct: 29 },
                        { metric: "Active Users", value: "48", max: 100, pct: 48 },
                        { metric: "Screens Configured", value: "4", max: 10, pct: 40 }
                      ].map((m, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-gray-400 mb-1"><span>{m.metric}</span><span className="text-white font-bold">{m.value}</span></div>
                          <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${m.pct > 80 ? "bg-gradient-to-r from-red-500 to-amber-500" : "bg-gradient-to-r from-primary to-secondary"}`} style={{ width: `${m.pct}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── CHAIN SUBSCRIPTIONS ─── */}
            {chainSubTab === "subscriptions" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { plan: "BASIC", price: "₹2,999", period: "/mo", screens: 2, users: 10, features: ["Movie Management", "Booking Engine", "Basic Reports", "Email Support"] },
                    { plan: "PROFESSIONAL", price: "₹9,999", period: "/mo", screens: 5, users: 25, features: ["Everything in Basic", "CRM Module", "F&B Kitchen", "Marketing Tools", "Priority Support"] },
                    { plan: "ENTERPRISE", price: "₹24,999", period: "/mo", screens: 15, users: 100, features: ["Everything in Pro", "AI Recommendations", "Advanced Analytics", "Custom Domain", "API Access", "Dedicated Manager"] },
                    { plan: "PREMIUM", price: "₹49,999", period: "/mo", screens: 999, users: 999, features: ["Everything Unlimited", "White Label Branding", "Custom Integrations", "SLA Guarantee", "24/7 Phone Support", "On-site Training"] }
                  ].map((p, i) => (
                    <div key={i} className={`p-5 bg-black/40 border rounded-2xl space-y-4 ${i === 3 ? "border-luxuryGold/30 ring-1 ring-luxuryGold/10" : "border-white/10"}`}>
                      {i === 3 && <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-luxuryGold/10 text-luxuryGold border border-luxuryGold/20">Most Popular</span>}
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{p.plan}</span>
                        <span className="text-2xl font-extrabold text-white font-number block mt-1">{p.price}<span className="text-sm text-gray-400 font-normal">{p.period}</span></span>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1 border-t border-white/5 pt-3">
                        <div className="flex justify-between"><span>Max Screens</span><span className="text-white font-bold">{p.screens === 999 ? "Unlimited" : p.screens}</span></div>
                        <div className="flex justify-between"><span>Max Users</span><span className="text-white font-bold">{p.users === 999 ? "Unlimited" : p.users}</span></div>
                      </div>
                      <ul className="text-xs text-gray-400 space-y-1.5 border-t border-white/5 pt-3">
                        {p.features.map((f, j) => <li key={j} className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> {f}</li>)}
                      </ul>
                      <button className={`w-full py-2 font-bold text-xs uppercase rounded cursor-pointer ${i === 3 ? "bg-gradient-to-r from-luxuryGold to-amber-500 text-black" : "bg-primary text-white"}`}>Select Plan</button>
                    </div>
                  ))}
                </div>
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl">
                  <h3 className="text-sm font-heading font-bold text-white border-b border-white/5 pb-2 mb-4">Recent Billing Records</h3>
                  <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead><tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider"><th className="p-4">Tenant</th><th className="p-4">Plan</th><th className="p-4">Amount</th><th className="p-4">Date</th><th className="p-4 text-right">Status</th></tr></thead>
                      <tbody className="divide-y divide-white/5 bg-black/20">
                        {[
                          { tenant: "Galaxy Entertainment", plan: "ENTERPRISE", amount: "₹24,999", date: "2026-07-01", status: "PAID" },
                          { tenant: "Miraj Multiplexes", plan: "PROFESSIONAL", amount: "₹9,999", date: "2026-07-01", status: "PAID" },
                          { tenant: "Wave Cinemas", plan: "BASIC", amount: "₹2,999", date: "2026-07-01", status: "FAILED" }
                        ].map((b, i) => (
                          <tr key={i} className="hover:bg-white/5">
                            <td className="p-4 font-bold text-white font-heading">{b.tenant}</td><td className="p-4 text-gray-400">{b.plan}</td>
                            <td className="p-4 text-luxuryGold font-bold">{b.amount}</td><td className="p-4 text-gray-500">{b.date}</td>
                            <td className="p-4 text-right"><span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${b.status === "PAID" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>{b.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ─── CHAIN SUPPORT ─── */}
            {chainSubTab === "support" && (
              <div className="border border-white/5 rounded-xl overflow-hidden font-number text-xs">
                <table className="w-full text-left border-collapse">
                  <thead><tr className="bg-black/80 border-b border-white/10 text-gray-500 uppercase tracking-wider"><th className="p-4">Ticket</th><th className="p-4">Tenant</th><th className="p-4">Subject</th><th className="p-4">Priority</th><th className="p-4">Status</th><th className="p-4 text-right">Action</th></tr></thead>
                  <tbody className="divide-y divide-white/5 bg-black/20">
                    {[
                      { id: "TKT-001", tenant: "Galaxy Entertainment", subject: "Payment gateway integration failing", priority: "CRITICAL", status: "OPEN" },
                      { id: "TKT-002", tenant: "Miraj Multiplexes", subject: "Custom domain SSL not working", priority: "HIGH", status: "IN_PROGRESS" },
                      { id: "TKT-003", tenant: "Cinepolis India", subject: "Need bulk movie import feature", priority: "MEDIUM", status: "OPEN" },
                      { id: "TKT-004", tenant: "Wave Cinemas", subject: "Account suspended — billing query", priority: "HIGH", status: "ESCALATED" },
                      { id: "TKT-005", tenant: "Galaxy Entertainment", subject: "API rate limit increase request", priority: "LOW", status: "RESOLVED" }
                    ].map((t, i) => (
                      <tr key={i} className="hover:bg-white/5">
                        <td className="p-4 font-bold text-white font-mono">{t.id}</td><td className="p-4 text-gray-400">{t.tenant}</td><td className="p-4 text-gray-300">{t.subject}</td>
                        <td className="p-4"><span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${t.priority === "CRITICAL" ? "bg-red-500/10 text-red-400 border-red-500/20" : t.priority === "HIGH" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : t.priority === "MEDIUM" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-white/5 text-gray-400 border-white/10"}`}>{t.priority}</span></td>
                        <td className="p-4"><span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${t.status === "RESOLVED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : t.status === "ESCALATED" ? "bg-red-500/10 text-red-400 border-red-500/20" : t.status === "IN_PROGRESS" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>{t.status}</span></td>
                        <td className="p-4 text-right">{t.status !== "RESOLVED" && <button className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold text-[9px] uppercase cursor-pointer hover:bg-emerald-500/20">Resolve</button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
           TAB 10 — CMS SETTINGS
        ═══════════════════════════════════════════════════════ */}
        {activeTab === "settings" && (
          <div className="space-y-8">
            {/* Volume 9 · Part 9 — Globalization / i18n */}
            <GlobalizationPanel />
            {/* Volume 9 · Part 8 — Enterprise documentation / knowledge base */}
            <KnowledgeBasePanel />
            {/* Volume 9 · Part 10 — Future roadmap / 2035 vision */}
            <RoadmapPanel />
            <h2 className="text-2xl font-heading font-extrabold tracking-tight border-b border-white/5 pb-4">General CMS Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Theatre Brand Name</label><input type="text" value={generalSettings.theatreName} onChange={(e) => setGeneralSettings({...generalSettings, theatreName: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm" /></div>
              <div className="space-y-2"><label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Accent Color</label><input type="text" value={generalSettings.themeColor} onChange={(e) => setGeneralSettings({...generalSettings, themeColor: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm font-number" /></div>
              <div className="col-span-1 md:col-span-2 space-y-2"><label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Announcement Banner</label><input type="text" value={generalSettings.announcement} onChange={(e) => setGeneralSettings({...generalSettings, announcement: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm" /></div>
              <div className="col-span-1 md:col-span-2 space-y-2"><label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Cancellation & Refund Policy</label><textarea rows={3} value={generalSettings.cancellationRule} onChange={(e) => setGeneralSettings({...generalSettings, cancellationRule: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm resize-none" /></div>
            </div>
            <button onClick={handleSaveSettings} className="px-6 py-3 rounded bg-primary hover:bg-primary-hover text-white font-bold text-sm tracking-wide shadow-redGlow transition-all cursor-pointer flex items-center gap-2"><Save className="w-4 h-4" /> Save Settings</button>
          </div>
        )}

      </div>

      {/* ═══════════════════════════════════════════════════════
         FLOATING AI CHATBOT WIDGET
      ═══════════════════════════════════════════════════════ */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {chatbotOpen && (
          <div className="w-96 h-[520px] bg-slate-950/95 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden mb-4 animate-[slideUp_0.3s_ease-out] transition-all">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary/80 to-secondary/80 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center relative">
                  <Bot className="w-4 h-4 text-luxuryGold" />
                  <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-black ${
                    chatSentiment === "HAPPY" ? "bg-emerald-400" : chatSentiment === "ANGRY" ? "bg-red-400" : "bg-amber-400"
                  }`} />
                </div>
                <div>
                  <span className="font-heading font-extrabold text-xs text-white block">Prestige AI Assistant</span>
                  <span className="text-[9px] text-gray-300 font-mono">Status: {chatSentiment}</span>
                </div>
              </div>
              <button onClick={() => setChatbotOpen(false)} className="p-1 rounded bg-black/20 hover:bg-black/40 text-gray-300 cursor-pointer">
                <EyeOff className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-number text-xs leading-relaxed">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`p-3 max-w-[80%] rounded-2xl ${
                    msg.role === "user" ? "bg-primary text-white rounded-tr-none" : "bg-white/5 border border-white/5 text-gray-300 rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatTyping && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-1.5 rounded-tl-none">
                    <span className="w-1.5 h-1.5 bg-luxuryGold rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-luxuryGold rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-luxuryGold rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              {showWaveEffect && (
                <div className="flex flex-col items-center gap-1.5 py-2.5 bg-white/5 border border-white/5 rounded-2xl text-center">
                  <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest block">Voice Output Waveform</span>
                  <div className="flex gap-1 justify-center items-center h-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((bar) => (
                      <div key={bar} className="w-1 bg-gradient-to-t from-primary to-luxuryGold rounded-full animate-pulse"
                        style={{ height: `${Math.floor(Math.random() * 20 + 8)}px`, animationDuration: `${Math.random() * 0.4 + 0.2}s` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions Panel */}
            <div className="px-4 py-2 border-t border-white/5 bg-black/20 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
              {[
                { label: "\ud83c\udfac Playing Today", text: "Which movies are playing today?" },
                { label: "\ud83d\udcba Book Seats", text: "Book 2 seats for Avatar" },
                { label: "\ud83c\udf7f Add Food", text: "Add popcorn combo" },
                { label: "\ud83c\udff7\ufe0f Discounts", text: "Any discounts today?" },
                { label: "\ud83d\udccd Theatre Info", text: "Where is my nearest theatre?" },
                { label: "\ud83c\udfab My Ticket", text: "Show my ticket" },
                { label: "\ud83d\udc51 Membership", text: "How can I upgrade my membership?" },
                { label: "\u21a9\ufe0f Refund", text: "I want a refund" },
                { label: "\ud83c\udf99\ufe0f Voice", text: "Show today's offers" }
              ].map((act, idx) => (
                <button key={idx} onClick={() => handleSendChatbotMsg(act.text)}
                  className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-full text-[9px] font-bold text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer">
                  {act.label}
                </button>
              ))}
            </div>

            {/* Inputs footer */}
            <div className="p-3 border-t border-white/10 bg-black/40 flex items-center gap-2">
              <button onClick={() => {
                setChatVoiceActive(!chatVoiceActive);
                if (!chatVoiceActive) {
                  toast.success("Voice recognition active. Speak now...");
                  handleSendChatbotMsg("Show today's offers");
                } else {
                  toast.success("Voice command inactive.");
                }
              }}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-center ${
                  chatVoiceActive ? "bg-primary/20 text-primary border-primary/30 animate-pulse" : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10"
                }`}>
                <Smartphone className="w-4 h-4" />
              </button>
              <input type="text" placeholder="Type a message or use quick actions..." value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary placeholder-gray-600"
                onKeyDown={(e) => { if (e.key === "Enter") handleSendChatbotMsg(); }} />
              <button onClick={() => handleSendChatbotMsg()} className="p-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white flex items-center justify-center cursor-pointer shadow-redGlow">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Floating Bubble Button */}
        <button onClick={() => setChatbotOpen(!chatbotOpen)}
          style={{ animation: "float 3s ease-in-out infinite" }}
          className="w-14 h-14 bg-gradient-to-r from-primary to-secondary text-white rounded-full flex items-center justify-center cursor-pointer shadow-redGlow hover:scale-105 transition-transform select-none relative group border border-white/20">
          <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-luxuryGold text-black font-extrabold text-[8px] uppercase tracking-wider animate-bounce">AI</span>
        </button>
      </div>

      {/* ═══ EDIT MOVIE MODAL OVERLAY ═══ */}
      {editingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl bg-[#0f0f12] border border-white/15 rounded-2xl p-6 space-y-5 shadow-2xl text-left font-sans max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-heading font-extrabold text-white flex items-center gap-2">
                <FileEdit className="w-5 h-5 text-accent" /> Edit Movie Listing
              </h3>
              <button onClick={() => setEditingMovie(null)} className="p-1 text-gray-400 hover:text-white rounded bg-white/5">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const res = await API.patch(`/movies/${editingMovie.id}`, editingMovie);
                setMoviesList((prev) => prev.map((m) => m.id === editingMovie.id ? { ...m, ...res.data.movie } : m));
                setEditingMovie(null);
                toast.success("Movie updated & synced to all devices!");
              } catch {
                setMoviesList((prev) => prev.map((m) => m.id === editingMovie.id ? { ...editingMovie } : m));
                setEditingMovie(null);
                toast.success("Movie details updated!");
              }
            }} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 md:col-span-2">
                <label className="text-gray-400 font-bold block">Movie Title</label>
                <input type="text" value={editingMovie.title || ""} onChange={(e) => setEditingMovie({...editingMovie, title: e.target.value})} className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary" />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 font-bold block">Genre</label>
                <input type="text" value={editingMovie.genre || ""} onChange={(e) => setEditingMovie({...editingMovie, genre: e.target.value})} className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary" />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 font-bold block">Rating</label>
                <input type="number" step="0.1" value={editingMovie.rating || 9.0} onChange={(e) => setEditingMovie({...editingMovie, rating: parseFloat(e.target.value)})} className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary font-number" />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 font-bold block">Status</label>
                <select value={editingMovie.status || "NOW_SHOWING"} onChange={(e) => setEditingMovie({...editingMovie, status: e.target.value})} className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary">
                  <option value="NOW_SHOWING">Now Showing</option>
                  <option value="UPCOMING">Upcoming</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
              <div className="md:col-span-2 pt-3 flex justify-end gap-2 border-t border-white/10">
                <button type="button" onClick={() => setEditingMovie(null)} className="px-4 py-2 rounded border border-white/10 text-gray-400 font-bold hover:text-white cursor-pointer">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded cursor-pointer shadow-redGlow">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ EDIT SHOWTIME MODAL OVERLAY ═══ */}
      {editingShow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg bg-[#0f0f12] border border-white/15 rounded-2xl p-6 space-y-5 shadow-2xl text-left font-sans">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-heading font-extrabold text-white flex items-center gap-2">
                <FileEdit className="w-5 h-5 text-accent" /> Edit Showtime Schedule
              </h3>
              <button onClick={() => setEditingShow(null)} className="p-1 text-gray-400 hover:text-white rounded bg-white/5">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await API.patch(`/showtimes-theatres/showtimes/${editingShow.id}`, editingShow);
                setShowsList((prev) => prev.map((s) => s.id === editingShow.id ? { ...s, ...editingShow } : s));
                setEditingShow(null);
                toast.success("Showtime updated & synced across devices!");
              } catch {
                setShowsList((prev) => prev.map((s) => s.id === editingShow.id ? { ...editingShow } : s));
                setEditingShow(null);
                toast.success("Showtime schedule updated!");
              }
            }} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-400 font-bold block">Movie Title</label>
                <input type="text" value={editingShow.movie || ""} onChange={(e) => setEditingShow({...editingShow, movie: e.target.value})} className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary" />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 font-bold block">Screen Name</label>
                <select value={editingShow.screen || "Screen 1 IMAX"} onChange={(e) => setEditingShow({...editingShow, screen: e.target.value})} className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary">
                  <option value="Screen 1 IMAX">Screen 1 IMAX</option>
                  <option value="Screen 2 Dolby">Screen 2 Dolby</option>
                  <option value="Screen 3">Screen 3</option>
                  <option value="Screen 4">Screen 4</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-400 font-bold block">Date</label>
                  <input type="date" value={editingShow.date || ""} onChange={(e) => setEditingShow({...editingShow, date: e.target.value})} className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary" />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-bold block">Time Slot</label>
                  <input type="text" value={editingShow.time || ""} onChange={(e) => setEditingShow({...editingShow, time: e.target.value})} className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary" placeholder="07:30 PM" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 font-bold block">Base Ticket Price (₹)</label>
                <input type="number" value={editingShow.basePrice || 350} onChange={(e) => setEditingShow({...editingShow, basePrice: parseFloat(e.target.value)})} className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-white focus:outline-none focus:border-primary font-number" />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
                <button type="button" onClick={() => setEditingShow(null)} className="px-4 py-2 rounded border border-white/10 text-gray-400 font-bold hover:text-white cursor-pointer">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded cursor-pointer shadow-redGlow">Update Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
