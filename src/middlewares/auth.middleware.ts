import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { generateTokenType } from "../types/user.types.js";

export type AuthenticatedRequest = Request & {
  user?: generateTokenType;
};

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
};

const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  // CORS preflight does not send Authorization; let cors() answer OPTIONS.
  if (req.method === "OPTIONS") {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const payload = jwt.verify(token, getJwtSecret()) as generateTokenType;
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default requireAuth;
