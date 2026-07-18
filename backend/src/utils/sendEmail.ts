import nodemailer from "nodemailer";

const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

interface SendEmailArgs {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailArgs): Promise<boolean> => {
  // If email configuration is dummy/unset, log to console instead of throwing an error
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER === "your-email@gmail.com") {
    console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
    console.log(`[MOCK EMAIL CONTENT]\n${html.replace(/<[^>]*>/g, "").trim().substring(0, 300)}...`);
    return true;
  }

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"CineVerse Pro" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("❌ Failed to send email via Nodemailer:", error);
    return false;
  }
};

export const getOTPHtml = (otp: string, name: string): string => {
  return `
    <div style="font-family: 'Inter', sans-serif; background-color: #050505; color: #ffffff; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
      <h1 style="color: #E50914; font-family: 'Poppins', sans-serif; margin-bottom: 20px; font-weight: 700; text-align: center;">CineVerse Pro</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #cccccc;">Hello ${name},</p>
      <p style="font-size: 16px; line-height: 1.6; color: #cccccc;">Thank you for choosing CineVerse Pro. Use the verification code below to verify your account or complete your login session. This OTP is valid for 10 minutes.</p>
      <div style="background: linear-gradient(135deg, #E50914 0%, #8B5CF6 100%); padding: 2px; border-radius: 8px; margin: 30px 0; text-align: center;">
        <div style="background-color: #0d0d0d; padding: 20px; border-radius: 6px;">
          <span style="font-family: 'Montserrat', sans-serif; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #00E5FF;">${otp}</span>
        </div>
      </div>
      <p style="font-size: 14px; color: #888888; text-align: center; margin-top: 40px;">If you didn't request this, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 30px 0;">
      <p style="font-size: 12px; color: #666666; text-align: center;">Experience Cinema Like Never Before. © ${new Date().getFullYear()} CineVerse Pro.</p>
    </div>
  `;
};
