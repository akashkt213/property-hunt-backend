import UserModel from "../models/user.model.js";
import type { Request, Response } from "express";
import type { createUserType, generateTokenType } from "../types/user.types.js";
import jwt from "jsonwebtoken";

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

const UserController = {
  createUser: async (req: Request<{}, {}, createUserType>, res: Response) => {
    try {
      const { email, password, full_name, role } = req.body ?? {};
      if (!email || !password || !full_name || !role) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const user = await UserModel.createUser({
        email,
        password,
        full_name,
        role,
      });
      return res
        .status(201)
        .json({ message: "User created successfully", user });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
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
          user: currUser,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default UserController;
