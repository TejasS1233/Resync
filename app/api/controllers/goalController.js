import { Goal } from "../models/Goal.js";

export const getAllGoals = async (req, res) => {
  try {
    const goals = Goal.findAll(req.user.id);
    res.json({ success: true, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getGoal = async (req, res) => {
  try {
    const goal = Goal.findById(req.params.id, req.user.id);
    if (!goal) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }
    res.json({ success: true, data: goal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createGoal = async (req, res) => {
  try {
    const goal = Goal.create(req.user.id, req.body);
    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const goal = Goal.update(req.params.id, req.user.id, req.body);
    if (!goal) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }
    res.json({ success: true, data: goal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const result = Goal.delete(req.params.id, req.user.id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }
    res.json({ success: true, message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { completed, action, amount } = req.body;
    const goalId = req.params.id;
    const userId = req.user.id;

    const goal = Goal.findById(goalId, userId);
    if (!goal) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split("T")[0];

    if (action === "increment") {
      Goal.addProgress(goalId, todayStr, amount || 1);
    } else if (action === "decrement") {
      Goal.addProgress(goalId, todayStr, -(amount || 1));
    } else if (action === "set") {
      Goal.setProgress(goalId, todayStr, amount || completed ? 1 : 0);
    } else {
      const existing = goal.progress?.find(p => p.date.startsWith(todayStr));
      if (existing) {
        Goal.addProgress(goalId, todayStr, completed ? 1 : -1);
      } else {
        Goal.setProgress(goalId, todayStr, completed ? 1 : 0);
      }
    }

    const updatedGoal = Goal.findById(goalId, userId);
    res.json({ success: true, data: updatedGoal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGoalStats = async (req, res) => {
  try {
    const stats = Goal.getStats(req.user.id);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};