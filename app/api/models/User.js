import bcrypt from "bcryptjs";
import db from "../../lib/db.js";

const SALT_ROUNDS = 10;

export const User = {
  findById(id) {
    const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
    return stmt.get(id);
  },

  findByEmail(email) {
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    return stmt.get(email);
  },

  findByEmailWithPassword(email) {
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    return stmt.get(email);
  },

  create({ name, email, password }) {
    const hash = bcrypt.hashSync(password, SALT_ROUNDS);
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password) VALUES (?, ?, ?)
    `);
    const result = stmt.run(name, email, hash);
    return this.findById(result.lastInsertRowid);
  },

  update(id, data) {
    const fields = [];
    const values = [];
    
    if (data.name !== undefined) { fields.push("name = ?"); values.push(data.name); }
    if (data.onboarded !== undefined) { fields.push("onboarded = ?"); values.push(data.onboarded ? 1 : 0); }
    if (data.purpose !== undefined) { fields.push("purpose = ?"); values.push(data.purpose); }
    if (data.mainGoals !== undefined) { fields.push("main_goals = ?"); values.push(JSON.stringify(data.mainGoals)); }
    if (data.preferredFrequency !== undefined) { fields.push("preferred_frequency = ?"); values.push(data.preferredFrequency); }
    
    if (fields.length === 0) return this.findById(id);
    
    fields.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);
    
    const stmt = db.prepare(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`);
    stmt.run(...values);
    return this.findById(id);
  },

  comparePassword(user, password) {
    return bcrypt.compareSync(password, user.password);
  },

  getOnboardingData(user) {
    return {
      purpose: user.purpose,
      mainGoals: user.main_goals ? JSON.parse(user.main_goals) : [],
      preferredFrequency: user.preferred_frequency,
    };
  }
};