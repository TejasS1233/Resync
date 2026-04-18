import express from "express";
import {
  getAllGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  updateProgress,
  getGoalStats,
} from "../controllers/goalController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.get("/", getAllGoals);
router.get("/stats", getGoalStats);
router.get("/:id", getGoal);
router.post("/", createGoal);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);
router.patch("/:id/progress", updateProgress);

export default router;
