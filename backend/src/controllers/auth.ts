import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../index";
import { generateOTP } from "../utils/otp";
import { sendEmail, getOTPHtml } from "../utils/sendEmail";
import { Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkeyforjwttokencineversepro";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const generateToken = (id: string, email: string, role: Role) => {
  return jwt.sign({ id, email, role }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Please provide name, email, and password." });
      return;
    }

    if (String(password).length < 8) {
      res.status(400).json({ message: "Password must be at least 8 characters long." });
      return;
    }

    const normalizedEmail = normalizeEmail(String(email));
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      res.status(400).json({ message: "Email is already registered." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // If it's the very first user, let's make them the OWNER/SUPER_ADMIN for testing ease!
    const usersCount = await prisma.user.count();
    const role = usersCount === 0 ? Role.OWNER : Role.CUSTOMER;

    const user = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        password: hashedPassword,
        phone,
        role,
      },
    });

    // Generate and send OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    await prisma.oTP.create({
      data: {
        email: normalizedEmail,
        code: otpCode,
        expiresAt,
      },
    });

    const emailHtml = getOTPHtml(otpCode, name);
    await sendEmail({
      to: normalizedEmail,
      subject: "Verify your CineVerse Pro Account",
      html: emailHtml,
    });

    res.status(201).json({
      message: "Registration successful. Please verify your email with the OTP sent.",
      userId: user.id,
      email: user.email,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Something went wrong during registration.", error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Please provide email and password." });
      return;
    }

    const normalizedEmail = normalizeEmail(String(email));
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    // Check if verified
    if (!user.isVerified) {
      // Re-trigger OTP
      const otpCode = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.oTP.create({
        data: {
          email: normalizedEmail,
          code: otpCode,
          expiresAt,
        },
      });

      await sendEmail({
        to: normalizedEmail,
        subject: "Verify your CineVerse Pro Account",
        html: getOTPHtml(otpCode, user.name),
      });

      res.status(403).json({
        message: "Email is not verified. A verification code has been sent to your email.",
        email: user.email,
        isVerified: false,
      });
      return;
    }

    const token = generateToken(user.id, user.email, user.role);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong during login.", error: error.message });
  }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      res.status(400).json({ message: "Please provide email and verification code." });
      return;
    }

    const normalizedEmail = normalizeEmail(String(email));

    // Find the latest valid unused OTP for this email
    const dbOtp = await prisma.oTP.findFirst({
      where: {
        email: normalizedEmail,
        code: String(code).trim(),
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!dbOtp) {
      res.status(400).json({ message: "Invalid or expired verification code." });
      return;
    }

    // Mark OTP as used
    await prisma.oTP.update({
      where: { id: dbOtp.id },
      data: { isUsed: true },
    });

    // Update user to verified
    const user = await prisma.user.update({
      where: { email: normalizedEmail },
      data: { isVerified: true },
    });

    const token = generateToken(user.id, user.email, user.role);

    res.status(200).json({
      message: "Email verified successfully.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error: any) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Something went wrong during OTP verification.", error: error.message });
  }
};

export const resendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Please provide email." });
      return;
    }

    const normalizedEmail = normalizeEmail(String(email));
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      res.status(404).json({ message: "No user found with this email address." });
      return;
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.oTP.create({
      data: {
        email: normalizedEmail,
        code: otpCode,
        expiresAt,
      },
    });

    await sendEmail({
      to: normalizedEmail,
      subject: "CineVerse Pro Verification Code",
      html: getOTPHtml(otpCode, user.name),
    });

    res.status(200).json({ message: "Verification code sent successfully to your email." });
  } catch (error: any) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Failed to resend verification code.", error: error.message });
  }
};
