import express from "express";
import {
  getNotes,
  getNoteByDate,
  createOrUpdateNote,
  deleteNote,
} from "../controllers/noteController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.get("/", getNotes);
router.get("/:date", getNoteByDate);
router.post("/", createOrUpdateNote);
router.delete("/:id", deleteNote);

export default router;
