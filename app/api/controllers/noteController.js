import { Note } from "../models/Note.js";

export const getAllNotes = async (req, res) => {
  try {
    const notes = Note.findAll(req.user.id, { limit: 100 });
    res.json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNote = async (req, res) => {
  try {
    const note = Note.findById(req.params.id, req.user.id);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    res.json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNoteByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const note = Note.findByDate(req.user.id, date);
    res.json({ success: true, data: note || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createNote = async (req, res) => {
  try {
    const { date, content, mood, tags } = req.body;
    const userId = req.user.id;

    const existing = Note.findByDate(userId, date);
    if (existing) {
      const updated = Note.update(existing.id, userId, { content, mood, tags });
      return res.json({ success: true, data: updated });
    }

    const note = Note.create(userId, { date, content, mood, tags });
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const note = Note.update(req.params.id, req.user.id, req.body);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    res.json({ success: true, data: note });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const result = Note.delete(req.params.id, req.user.id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    res.json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMoods = async (req, res) => {
  try {
    const moods = Note.getRecentMoods(req.user.id, 30);
    res.json({ success: true, data: moods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};