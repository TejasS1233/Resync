import db from "../../lib/db.js";

export const Goal = {
  findById(id, userId) {
    const stmt = db.prepare("SELECT * FROM goals WHERE id = ? AND user_id = ?");
    return stmt.get(id, userId);
  },

  findAll(userId, { includeInactive = false } = {}) {
    let sql = "SELECT * FROM goals WHERE user_id = ?";
    if (!includeInactive) sql += " AND is_active = 1";
    sql += " ORDER BY created_at DESC";
    
    const stmt = db.prepare(sql);
    const goals = stmt.all(userId);
    
    return goals.map(goal => ({
      ...goal,
      progress: this.getProgress(goal.id),
      currentProgress: this.getCurrentPeriodProgress(goal),
      is_active: !!goal.is_active,
    }));
  },

  create(userId, data) {
    const stmt = db.prepare(`
      INSERT INTO goals (user_id, title, description, frequency, target_count, end_date, category)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      userId,
      data.title,
      data.description || "",
      data.frequency || "daily",
      data.targetCount || 1,
      data.endDate || null,
      data.category || "General"
    );
    return this.findById(result.lastInsertRowid, userId);
  },

  update(id, userId, data) {
    const fields = [];
    const values = [];
    
    if (data.title !== undefined) { fields.push("title = ?"); values.push(data.title); }
    if (data.description !== undefined) { fields.push("description = ?"); values.push(data.description); }
    if (data.frequency !== undefined) { fields.push("frequency = ?"); values.push(data.frequency); }
    if (data.targetCount !== undefined) { fields.push("target_count = ?"); values.push(data.targetCount); }
    if (data.endDate !== undefined) { fields.push("end_date = ?"); values.push(data.endDate); }
    if (data.category !== undefined) { fields.push("category = ?"); values.push(data.category); }
    if (data.isActive !== undefined) { fields.push("is_active = ?"); values.push(data.isActive ? 1 : 0); }
    
    if (fields.length === 0) return this.findById(id, userId);
    
    fields.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id, userId);
    
    const stmt = db.prepare(`UPDATE goals SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`);
    stmt.run(...values);
    return this.findById(id, userId);
  },

  delete(id, userId) {
    const stmt = db.prepare("DELETE FROM goals WHERE id = ? AND user_id = ?");
    return stmt.run(id, userId);
  },

  getProgress(goalId) {
    const stmt = db.prepare("SELECT date, completed FROM goal_progress WHERE goal_id = ? ORDER BY date DESC");
    return stmt.all(goalId);
  },

  addProgress(goalId, date, completed) {
    const stmt = db.prepare(`
      INSERT INTO goal_progress (goal_id, date, completed)
      VALUES (?, ?, ?)
      ON CONFLICT(goal_id, date) DO UPDATE SET completed = completed + excluded.completed
    `);
    stmt.run(goalId, date, completed);
  },

  setProgress(goalId, date, completed) {
    const stmt = db.prepare(`
      INSERT INTO goal_progress (goal_id, date, completed)
      VALUES (?, ?, ?)
      ON CONFLICT(goal_id, date) DO UPDATE SET completed = excluded.completed
    `);
    stmt.run(goalId, date, completed);
  },

  getCurrentPeriodProgress(goal) {
    const now = new Date();
    let periodStart;
    
    switch (goal.frequency) {
      case "daily":
        periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "weekly":
        const dayOfWeek = now.getDay();
        periodStart = new Date(now);
        periodStart.setDate(now.getDate() - dayOfWeek);
        periodStart.setHours(0, 0, 0, 0);
        break;
      case "monthly":
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }
    
    const progress = this.getProgress(goal.id);
    const currentProgress = progress.filter(p => new Date(p.date) >= periodStart);
    const totalCompleted = currentProgress.reduce((sum, p) => sum + p.completed, 0);
    
    return {
      completed: totalCompleted,
      target: goal.target_count,
      percentage: Math.min((totalCompleted / goal.target_count) * 100, 100),
    };
  },

  getStats(userId) {
    const goals = this.findAll(userId, { includeInactive: true });
    
    const stats = {
      totalGoals: goals.length,
      completedToday: 0,
      onTrack: 0,
      needsAttention: 0,
      byCategory: {},
    };
    
    goals.forEach(goal => {
      const progress = goal.currentProgress;
      
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
    
    return stats;
  }
};