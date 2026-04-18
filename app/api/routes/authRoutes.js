import express from "express";
import {
  register,
  login,
  getMe,
  completeOnboarding,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/onboarding", protect, completeOnboarding);

export default router;
