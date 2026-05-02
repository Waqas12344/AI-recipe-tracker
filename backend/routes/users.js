import express from "express";
import * as userController from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();

// all routes are protected 
router.use(authMiddleware);

router.get("/profile", userController.getUserProfile);
router.put("/profile", userController.updateUserProfile);
router.put("/preferences", userController.updateUserPreference);
router.put("/change-password", userController.changePassword);
router.delete("/delete", userController.deleteUserAccount);

export default router;