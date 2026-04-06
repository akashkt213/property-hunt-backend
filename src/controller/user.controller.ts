import UserModel from "../models/user.model.js";
import type { Request, Response } from "express";
import type { createUserType, generateTokenType } from "../types/user.types.js";
import jwt from "jsonwebtoken";
import { transporter } from "../config/mail.js";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
};

const generateToken = (user: generateTokenType) => {
  const payload = {
    email: user.email,
    id: user.id,
    role: user.role,
  };
  const jwtSecret = getJwtSecret();

  const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: "1d" });
  const refreshToken = jwt.sign(payload, jwtSecret, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};

const generateEmailVerificationToken = (user: generateTokenType) => {
  const payload = {
    id: user.id,
    email: user.email,
    type: "email_verification",
  };

  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: "1h",
  });
};

const UserController = {
  createUser: async (req: Request<{}, {}, createUserType>, res: Response) => {
    try {
      const { email, password, full_name, role } = req.body ?? {};
      if (!email || !password || !full_name || !role) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const currUser = await UserModel.findByEmail({ email });

      if(currUser){
        return res.status(409).json({stautus:409,message:"Email already exists"})
      }

      const user = await UserModel.createUser({
        email,
        password,
        full_name,
        role,
      });
      const token = generateEmailVerificationToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8000";

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Verify your email",
          html: `
            <div style="font-family:Arial,Helvetica,sans-serif;background:#f6f7fb;padding:40px 20px;">
              <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:8px;padding:30px;border:1px solid #e5e7eb;">
                
                <h2 style="margin:0 0 10px;color:#111827;">
                  Verify your email
                </h2>

                <p style="color:#4b5563;font-size:14px;line-height:1.6;margin-bottom:24px;">
                  Thanks for signing up. Please confirm your email address by clicking the button below.
                </p>

                <div style="text-align:center;margin:30px 0;">
                  <a 
                    href="${frontendUrl}/verify-email?token=${token}"
                    style="
                      background:#2563eb;
                      color:#ffffff;
                      padding:12px 20px;
                      text-decoration:none;
                      border-radius:6px;
                      font-weight:600;
                      display:inline-block;
                    "
                  >
                    Verify Email
                  </a>
                </div>

                <p style="color:#6b7280;font-size:13px;line-height:1.6;">
                  This link will expire in 1 hour. If you did not create an account,
                  you can safely ignore this email.
                </p>

                <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

                <p style="font-size:12px;color:#9ca3af;text-align:center;">
                  If the button doesn't work, copy and paste this link into your browser:
                </p>

                <p style="font-size:12px;color:#2563eb;word-break:break-all;text-align:center;">
                  ${frontendUrl}/verify-email?token=${token}
                </p>

              </div>
            </div>
            `,
          });
      } catch (mailError) {
        return res.status(201).json({
          message: "User created, but failed to send verification email",
          user,
        });
      }

      return res
        .status(201)
        .json({
          message: "User created successfully. Verification email sent.",
          user,
        });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  verifyEmail: async (req: Request, res: Response) => {
    try {
      const { token } = req.query;
      if (typeof token !== "string") {
        return res.status(400).json({ message: "Token is required" });
      }

      const decoded = jwt.verify(token, getJwtSecret()) as {
        id: string;
        email: string;
        type: string;
      };

      if (decoded.type !== "email_verification") {
        return res.status(400).json({ message: "Invalid token" });
      }

      const verifiedUser = await UserModel.verifyUser({ id: decoded.id });
      if (!verifiedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "Email verified successfully",
      });
    } catch (error) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }
  },
  updateUser: async (req: Request, res: Response) => {
    try {
      const { id, full_name } = req.body ?? {};

      if (!id || !full_name) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const updatedUser = await UserModel.updateUser({
        id,
        full_name,
      });

      return res
        .status(200)
        .json({ message: "User updated successfully", updatedUser });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  findUserById: async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "id is required" });
      }

      const user = await UserModel.findById({ id });

      return res.status(200).json({ message: "User", user });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  deleteUser: async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "id is required" });
      }

      const deletedUser = await UserModel.deleteUser({ id });

      return res
        .status(200)
        .json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  findAllUsers: async (req: Request, res: Response) => {
    try {
      const users = await UserModel.findAll();

      return res.status(200).json({ message: "Users", users });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  userSignIn: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body ?? {};
      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const currUser = await UserModel.findByEmail({ email });
      if (!currUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      if (!currUser.email_verified) {
        return res.status(403).json({
          message: "Please verify your email",
        });
      }

      const { accessToken, refreshToken } = generateToken({
        email,
        id: currUser.id,
        role: currUser.role,
      });

      const user = await UserModel.signIn({ email, password });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      return res.status(200).json({
        message: "Sign in successful",
        data: {
          accessToken,
          refreshToken,
          user,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default UserController;
