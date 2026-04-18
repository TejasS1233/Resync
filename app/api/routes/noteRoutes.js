import express from "express";
import {
  getAllNotes,
  getNote,
  getNoteByDate,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getAllNotes);
router.get("/:id", getNote);
router.get("/date/:date", getNoteByDate);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;