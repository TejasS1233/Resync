import Goal from "../models/Goal.js";

// Get all goals
export const getAllGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    const goalsWithProgress = goals.map((goal) => {
      const progress = goal.getCurrentPeriodProgress();
      return {
        ...goal.toObject(),
        currentProgress: progress,
      };
    });

    res.json({ success: true, data: goalsWithProgress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single goal
export const getGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!goal) {
      return res
        .status(404)
        .json({ success: false, message: "Goal not found" });
    }

    const progress = goal.getCurrentPeriodProgress();
    res.json({
      success: true,
      data: { ...goal.toObject(), currentProgress: progress },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new goal
export const createGoal = async (req, res) => {
  try {
    const goal = await Goal.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update goal
export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res
        .status(404)
        .json({ success: false, message: "Goal not found" });
    }

    res.json({ success: true, data: goal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete goal
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!goal) {
      return res
        .status(404)
        .json({ success: false, message: "Goal not found" });
    }

    res.json({ success: true, message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update progress for a goal
export const updateProgress = async (req, res) => {
  try {
    const { completed } = req.body;
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!goal) {
      return res
        .status(404)
        .json({ success: false, message: "Goal not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if progress exists for today
    const existingProgress = goal.progress.find((p) => {
      const progressDate = new Date(p.date);
      progressDate.setHours(0, 0, 0, 0);
      return progressDate.getTime() === today.getTime();
    });

    if (existingProgress) {
      // Increment or decrement based on completed flag
      if (completed) {
        existingProgress.completed = (existingProgress.completed || 0) + 1;
      } else {
        existingProgress.completed = Math.max(
          (existingProgress.completed || 0) - 1,
          0
        );
      }
    } else {
      goal.progress.push({ date: new Date(), completed: completed ? 1 : 0 });
    }

    await goal.save();

    const currentProgress = goal.getCurrentPeriodProgress();
    res.json({
      success: true,
      data: { ...goal.toObject(), currentProgress },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get goal statistics
export const getGoalStats = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id, isActive: true });

    const stats = {
      totalGoals: goals.length,
      completedToday: 0,
      onTrack: 0,
      needsAttention: 0,
      byCategory: {},
    };

    goals.forEach((goal) => {
      const progress = goal.getCurrentPeriodProgress();

      // Dynamically count categories
      if (!stats.byCategory[goal.category]) {
        stats.byCategory[goal.category] = 0;
      }
      stats.byCategory[goal.category]++;

      if (progress.percentage >= 100) {
        stats.completedToday++;
      } else if (progress.percentage >= 50) {
        stats.onTrack++;
      } else {
        stats.needsAttention++;
      }
    });

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
