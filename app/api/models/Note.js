import db from "../../lib/db.js";

export const Note = {
  findById(id, userId) {
    const stmt = db.prepare("SELECT * FROM notes WHERE id = ? AND user_id = ?");
    return stmt.get(id, userId);
  },

  findAll(userId, { limit = 50, offset = 0 } = {}) {
    const stmt = db.prepare(`
      SELECT * FROM notes 
      WHERE user_id = ? 
      ORDER BY date DESC 
      LIMIT ? OFFSET ?
    `);
    return stmt.all(userId, limit, offset);
  },

  findByDate(userId, date) {
    const stmt = db.prepare("SELECT * FROM notes WHERE user_id = ? AND date = ?");
    return stmt.get(userId, date);
  },

  create(userId, data) {
    const stmt = db.prepare(`
      INSERT INTO notes (user_id, date, content, mood, tags)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      userId,
      data.date,
      data.content,
      data.mood || null,
      data.tags ? JSON.stringify(data.tags) : null
    );
    return this.findById(result.lastInsertRowid, userId);
  },

  update(id, userId, data) {
    const fields = [];
    const values = [];
    
    if (data.content !== undefined) { fields.push("content = ?"); values.push(data.content); }
    if (data.mood !== undefined) { fields.push("mood = ?"); values.push(data.mood); }
    if (data.tags !== undefined) { fields.push("tags = ?"); values.push(JSON.stringify(data.tags)); }
    
    if (fields.length === 0) return this.findById(id, userId);
    
    fields.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id, userId);
    
    const stmt = db.prepare(`UPDATE notes SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`);
    stmt.run(...values);
    return this.findById(id, userId);
  },

  delete(id, userId) {
    const stmt = db.prepare("DELETE FROM notes WHERE id = ? AND user_id = ?");
    return stmt.run(id, userId);
  },

  getRecentMoods(userId, days = 30) {
    const stmt = db.prepare(`
      SELECT mood, date FROM notes 
      WHERE user_id = ? AND mood IS NOT NULL AND date >= date('now', '-${days} days')
      ORDER BY date DESC
    `);
    return stmt.all(userId);
  }
};