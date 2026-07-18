import { Router, Response } from "express";
import crypto from "crypto";
import { prisma } from "../index";
import { protect, AuthenticatedRequest } from "../middleware/auth";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import { sendEmail } from "../utils/sendEmail";

const router = Router();

// Helper to send ticket confirmation email
const sendTicketEmail = async (bookingId: string) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        showtime: {
          include: {
            movie: true,
            screen: true,
          },
        },
      },
    });

    if (!booking) return;

    const emailHtml = `
      <div style="font-family: 'Inter', sans-serif; background-color: #050505; color: #ffffff; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
        <h1 style="color: #E50914; font-family: 'Poppins', sans-serif; margin-bottom: 20px; font-weight: 700; text-align: center;">CineVerse Pro</h1>
        <h2 style="color: #00E5FF; font-family: 'Poppins', sans-serif; text-align: center;">Your Tickets are Confirmed! 🎬</h2>
        <p style="font-size: 15px; color: #cccccc; text-align: center;">Reference Code: <strong>${booking.id.toUpperCase()}</strong></p>
        
        <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 25px 0;">
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #ffffff; margin-bottom: 5px;">${booking.showtime.movie.title}</h3>
          <p style="font-size: 14px; color: #aaaaaa; margin: 0;">${booking.showtime.screen.name}</p>
          <p style="font-size: 14px; color: #00E5FF; margin: 5px 0 0 0;">${booking.showtime.startTime}</p>
        </div>

        <div style="background-color: #111; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <table style="width: 100%; text-align: left; font-size: 14px;">
            <tr>
              <th style="color: #888;">Seats</th>
              <td style="color: #fff; font-weight: bold; text-align: right;">${booking.seatNumbers.join(", ")}</td>
            </tr>
            <tr>
              <th style="color: #888;">Convenience Fees</th>
              <td style="color: #fff; text-align: right;">₹${booking.seatNumbers.length * 30}</td>
            </tr>
            <tr>
              <th style="color: #888; padding-top: 5px;">Total Paid</th>
              <td style="color: #00E5FF; font-weight: bold; font-size: 18px; text-align: right; padding-top: 5px;">₹${booking.totalPrice}</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 13px; color: #888888; text-align: center;">Present the QR Code inside your application profile at the screen entry doors.</p>
        <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 30px 0;">
        <p style="font-size: 12px; color: #666666; text-align: center;">CineVerse Luxury Cinemas © ${new Date().getFullYear()}</p>
      </div>
    `;

    await sendEmail({
      to: booking.user.email,
      subject: `Booking Confirmed: ${booking.showtime.movie.title}`,
      html: emailHtml,
    });
  } catch (err) {
    console.error("Email ticket dispatcher failed:", err);
  }
};

// Razorpay signature verification
router.post("/verify", protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { bookingId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    if (!bookingId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      res.status(400).json({ message: "Verification parameters are missing." });
      return;
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "dummysignkeysecret456";

    // Verify signature
    const hmac = crypto.createHmac("sha256", keySecret);
    hmac.update(razorpayOrderId + "|" + razorpayPaymentId);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpaySignature) {
      res.status(400).json({ message: "Invalid payment signature verification failed." });
      return;
    }

    // Update booking status and save payment record in transaction
    await prisma.$transaction([
      prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CONFIRMED },
      }),
      prisma.payment.create({
        data: {
          bookingId,
          amount: (await prisma.booking.findUnique({ where: { id: bookingId } }))?.totalPrice || 0,
          status: PaymentStatus.SUCCESS,
          transactionId: razorpayPaymentId,
          signature: razorpaySignature,
        },
      }),
    ]);

    // Send ticket via email
    await sendTicketEmail(bookingId);

    res.status(200).json({ message: "Payment verified and booking confirmed successfully." });
  } catch (error: any) {
    console.error("Signature verification error:", error);
    res.status(500).json({ message: "Verification failed.", error: error.message });
  }
});

// Mock success checkout helper (for development/sandbox mode)
router.post("/mock-success", protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { bookingId } = req.body;

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      res.status(404).json({ message: "Booking record not found." });
      return;
    }

    await prisma.$transaction([
      prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CONFIRMED },
      }),
      prisma.payment.create({
        data: {
          bookingId,
          amount: booking.totalPrice,
          status: PaymentStatus.SUCCESS,
          transactionId: "mock-txn-" + Math.floor(Math.random() * 100000000),
          signature: "mock-sig-verified-success-ok",
        },
      }),
    ]);

    await sendTicketEmail(bookingId);

    res.status(200).json({ message: "Mock transaction processed and verified successfully." });
  } catch (error: any) {
    console.error("Mock success error:", error);
    res.status(500).json({ message: "Failed to process transaction.", error: error.message });
  }
});

// POST /payment/create-order
router.post("/create-order", protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { bookingId, amount, currency, gateway } = req.body;
    if (!bookingId || !amount || !gateway) {
      return res.status(400).json({ message: "Required parameters are missing." });
    }
    const order = await prisma.paymentOrder.create({
      data: {
        bookingId,
        amount: parseFloat(amount),
        currency: currency || "INR",
        gateway,
        status: "PENDING"
      }
    });
    return res.status(201).json(order);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to create payment order.", error: error.message });
  }
});

// GET /payment/status
router.get("/status", protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { bookingId } = req.query;
    if (!bookingId) {
      return res.status(400).json({ message: "bookingId query parameter is required." });
    }
    const payment = await prisma.payment.findFirst({
      where: { bookingId: String(bookingId) },
      orderBy: { createdAt: "desc" }
    });
    return res.json({ status: payment ? payment.status : "PENDING", payment });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch payment status.", error: error.message });
  }
});

// POST /payment/refund
router.post("/refund", protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { transactionId, amount, reason } = req.body;
    if (!transactionId || !amount) {
      return res.status(400).json({ message: "transactionId and amount are required." });
    }
    const refund = await prisma.refund.create({
      data: {
        transactionId,
        amount: parseFloat(amount),
        reason: reason || "Customer request",
        status: "SUCCESS"
      }
    });
    return res.status(201).json(refund);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to request refund.", error: error.message });
  }
});

// GET /payment/history
router.get("/history", protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        booking: {
          userId: req.user?.id
        }
      },
      include: {
        booking: {
          include: {
            showtime: {
              include: {
                movie: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return res.json(payments);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch payment history.", error: error.message });
  }
});

// POST /wallet/add
router.post("/wallet/add", protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { amount } = req.body;
    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ message: "Valid amount is required." });
    }
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized." });

    const wallet = await prisma.wallet.upsert({
      where: { customerId: userId },
      update: { balance: { increment: parseFloat(amount) } },
      create: { customerId: userId, balance: parseFloat(amount) }
    });

    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "CREDIT",
        amount: parseFloat(amount),
        description: "Add money to wallet"
      }
    });

    return res.json(wallet);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to add money to wallet.", error: error.message });
  }
});

// POST /wallet/pay
router.post("/wallet/pay", protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { amount, bookingId } = req.body;
    if (!amount || !bookingId) {
      return res.status(400).json({ message: "amount and bookingId are required." });
    }
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized." });

    const wallet = await prisma.wallet.findUnique({
      where: { customerId: userId }
    });

    if (!wallet || wallet.balance < parseFloat(amount)) {
      return res.status(400).json({ message: "Insufficient wallet balance." });
    }

    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: parseFloat(amount) } }
    });

    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "DEBIT",
        amount: parseFloat(amount),
        description: `Payment for booking ${bookingId}`
      }
    });

    await prisma.$transaction([
      prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CONFIRMED }
      }),
      prisma.payment.create({
        data: {
          bookingId,
          amount: parseFloat(amount),
          status: PaymentStatus.SUCCESS,
          transactionId: "wallet-pay-" + Date.now(),
          signature: "wallet-sig-verified"
        }
      })
    ]);

    return res.json({ success: true, wallet: updatedWallet });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to pay using wallet.", error: error.message });
  }
});

// GET /wallet/history
router.get("/wallet/history", protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized." });

    const wallet = await prisma.wallet.findUnique({
      where: { customerId: userId }
    });

    if (!wallet) {
      return res.json({ balance: 0, transactions: [] });
    }

    const transactions = await prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: "desc" }
    });

    return res.json({ balance: wallet.balance, bonusBalance: wallet.bonusBalance, rewardBalance: wallet.rewardBalance, transactions });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch wallet history.", error: error.message });
  }
});

// POST /coupon/apply
router.post("/coupon/apply", protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { code, amount } = req.body;
    if (!code || !amount) {
      return res.status(400).json({ message: "Coupon code and order amount are required." });
    }
    const coupon = await prisma.coupon.findUnique({
      where: { code: String(code).toUpperCase() }
    });

    if (!coupon || !coupon.isActive || new Date() > coupon.expiresAt) {
      return res.status(400).json({ message: "Invalid or expired coupon code." });
    }

    if (parseFloat(amount) < coupon.minOrderAmount) {
      return res.status(400).json({ message: `Minimum order amount of ₹${coupon.minOrderAmount} required.` });
    }

    let discount = coupon.discountValue;
    if (coupon.isPercentage) {
      discount = (parseFloat(amount) * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    }

    return res.json({
      success: true,
      code: coupon.code,
      discount,
      finalAmount: Math.max(0, parseFloat(amount) - discount)
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to apply coupon.", error: error.message });
  }
});

export default router;
