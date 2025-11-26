import Note from "../models/Note.js";

// @desc    Get all notes for user
// @route   GET /api/notes
export const getNotes = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = { userId: req.user._id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const notes = await Note.find(query).sort({ date: -1 });

    res.json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get note by date
// @route   GET /api/notes/:date
export const getNoteByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const note = await Note.findOne({
      userId: req.user._id,
      date: {
        $gte: date,
        $lt: nextDay,
      },
    });

    res.json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create or update note
// @route   POST /api/notes
export const createOrUpdateNote = async (req, res) => {
  try {
    const { date, content, mood, tags } = req.body;

    const noteDate = new Date(date);
    noteDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(noteDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Check if note exists for this date
    let note = await Note.findOne({
      userId: req.user._id,
      date: {
        $gte: noteDate,
        $lt: nextDay,
      },
    });

    if (note) {
      // Update existing note
      note.content = content;
      note.mood = mood;
      note.tags = tags;
      await note.save();
    } else {
      // Create new note
      note = await Note.create({
        userId: req.user._id,
        date: noteDate,
        content,
        mood,
        tags,
      });
    }

    res.status(201).json({ success: true, data: note });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    await note.deleteOne();

    res.json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
