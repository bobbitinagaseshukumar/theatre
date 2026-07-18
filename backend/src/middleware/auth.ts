import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../index";
import { Role } from "@prisma/client";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: Role;
    isVerified: boolean;
  };
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({ message: "You are not logged in. Please log in to get access." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkeyforjwttokencineversepro") as {
      id: string;
      email: string;
      role: Role;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
      },
    });

    if (!user) {
      res.status(401).json({ message: "The user belonging to this token no longer exists." });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token. Please log in again." });
  }
};

export const restrictTo = (...roles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "User authentication required." });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: "You do not have permission to perform this action." });
      return;
    }

    next();
  };
};
