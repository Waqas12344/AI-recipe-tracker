import express from "express";
const router = express.Router();
import * as authController from "../controllers/authContoller.js";
import authMiddleware from "../middleware/auth.js";

// public routes
router.post("/signup", authController.register);
router.post("/login", authController.login);
router.post("/reset-password", authController.requestPasswordReset);

// protected routes
router.get("/me", authMiddleware, authController.getCurrentUser);

export default router;