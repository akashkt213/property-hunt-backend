import { Router } from "express";
import UserController from "../controller/user.controller.js";

const userRoutes = Router()

userRoutes.post("/", UserController.createUser);
userRoutes.get("/verify-email", UserController.verifyEmail);
userRoutes.put("/:id", UserController.updateUser);
userRoutes.get("/:id", UserController.findUserById);
userRoutes.delete("/:id", UserController.deleteUser);
userRoutes.get("/", UserController.findAllUsers);
userRoutes.post("/signin", UserController.userSignIn);

export default userRoutes;