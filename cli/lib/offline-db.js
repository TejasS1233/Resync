import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync, mkdirSync } from "fs";
import { homedir } from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database path in user's home directory
const DB_DIR = join(homedir(), ".resync");
const DB_PATH = join(DB_DIR, "resync-offline.db");

// Ensure directory exists
if (!existsSync(DB_DIR)) {
  mkdirSync(DB_DIR, { recursive: true });
}

class OfflineDatabase {
  constructor() {
    this.db = null;
  }

  connect() {
    try {
      this.db = new Database(DB_PATH);
      this.initTables();
      return true;
    } catch (error) {
      console.error("Failed to connect to offline database:", error);
      return false;
    }
  }

  initTables() {
    // Goals table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS goals (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        frequency TEXT,
        targetCount INTEGER,
        createdAt TEXT,
        updatedAt TEXT,
        syncStatus TEXT DEFAULT 'synced'
      )
    `);

    // Goal Progress table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS goal_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        goalId TEXT,
        date TEXT,
        completed INTEGER,
        syncStatus TEXT DEFAULT 'synced',
        FOREIGN KEY (goalId) REFERENCES goals(id) ON DELETE CASCADE
      )
    `);

    // Notes table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        mood TEXT,
        date TEXT,
        createdAt TEXT,
        updatedAt TEXT,
        syncStatus TEXT DEFAULT 'synced'
      )
    `);

    // Sync queue table (for pending changes)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entityType TEXT,
        entityId TEXT,
        operation TEXT,
        data TEXT,
        createdAt TEXT
      )
    `);

    // Create indexes
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_goals_category ON goals(category);
      CREATE INDEX IF NOT EXISTS idx_progress_goalId ON goal_progress(goalId);
      CREATE INDEX IF NOT EXISTS idx_progress_date ON goal_progress(date);
      CREATE INDEX IF NOT EXISTS idx_notes_date ON notes(date);
    `);
  }

  // Goals operations
  createGoal(goal) {
    const stmt = this.db.prepare(`
      INSERT INTO goals (id, title, description, category, frequency, targetCount, createdAt, updatedAt, syncStatus)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `);

    const id = `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    stmt.run(
      id,
      goal.title,
      goal.description,
      goal.category,
      goal.frequency,
      goal.targetCount,
      now,
      now
    );

    // Add to sync queue
    this.addToSyncQueue("goal", id, "create", goal);

    return { id, ...goal, createdAt: now, updatedAt: now };
  }

  getAllGoals() {
    const stmt = this.db.prepare("SELECT * FROM goals ORDER BY updatedAt DESC");
    const goals = stmt.all();

    // Get progress for each goal
    return goals.map((goal) => {
      const progress = this.getGoalProgress(goal.id);
      return { ...goal, progress };
    });
  }

  getGoalById(id) {
    const stmt = this.db.prepare("SELECT * FROM goals WHERE id = ?");
    const goal = stmt.get(id);

    if (goal) {
      goal.progress = this.getGoalProgress(id);
    }

    return goal;
  }

  updateGoal(id, updates) {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updates);
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      UPDATE goals 
      SET ${fields}, updatedAt = ?, syncStatus = 'pending'
      WHERE id = ?
    `);

    stmt.run(...values, now, id);

    // Add to sync queue
    this.addToSyncQueue("goal", id, "update", updates);

    return this.getGoalById(id);
  }

  deleteGoal(id) {
    const stmt = this.db.prepare("DELETE FROM goals WHERE id = ?");
    stmt.run(id);

    // Add to sync queue
    this.addToSyncQueue("goal", id, "delete", null);

    return true;
  }

  // Progress operations
  addGoalProgress(goalId, completed, date = null) {
    const progressDate = date || new Date().toISOString().split("T")[0];

    const stmt = this.db.prepare(`
      INSERT INTO goal_progress (goalId, date, completed, syncStatus)
      VALUES (?, ?, ?, 'pending')
    `);

    stmt.run(goalId, progressDate, completed);

    // Add to sync queue
    this.addToSyncQueue("progress", goalId, "create", {
      date: progressDate,
      completed,
    });

    return true;
  }

  getGoalProgress(goalId) {
    const stmt = this.db.prepare(
      "SELECT * FROM goal_progress WHERE goalId = ? ORDER BY date DESC"
    );
    return stmt.all(goalId);
  }

  // Notes operations
  createNote(note) {
    const stmt = this.db.prepare(`
      INSERT INTO notes (id, content, mood, date, createdAt, updatedAt, syncStatus)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `);

    const id = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    stmt.run(id, note.content, note.mood, note.date, now, now);

    // Add to sync queue
    this.addToSyncQueue("note", id, "create", note);

    return { id, ...note, createdAt: now, updatedAt: now };
  }

  getAllNotes() {
    const stmt = this.db.prepare("SELECT * FROM notes ORDER BY date DESC");
    return stmt.all();
  }

  getNoteById(id) {
    const stmt = this.db.prepare("SELECT * FROM notes WHERE id = ?");
    return stmt.get(id);
  }

  updateNote(id, updates) {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updates);
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      UPDATE notes 
      SET ${fields}, updatedAt = ?, syncStatus = 'pending'
      WHERE id = ?
    `);

    stmt.run(...values, now, id);

    // Add to sync queue
    this.addToSyncQueue("note", id, "update", updates);

    return this.getNoteById(id);
  }

  deleteNote(id) {
    const stmt = this.db.prepare("DELETE FROM notes WHERE id = ?");
    stmt.run(id);

    // Add to sync queue
    this.addToSyncQueue("note", id, "delete", null);

    return true;
  }

  // Sync queue operations
  addToSyncQueue(entityType, entityId, operation, data) {
    const stmt = this.db.prepare(`
      INSERT INTO sync_queue (entityType, entityId, operation, data, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      entityType,
      entityId,
      operation,
      JSON.stringify(data),
      new Date().toISOString()
    );
  }

  getPendingSyncItems() {
    const stmt = this.db.prepare(
      "SELECT * FROM sync_queue ORDER BY createdAt ASC"
    );
    return stmt.all().map((item) => ({
      ...item,
      data: JSON.parse(item.data),
    }));
  }

  clearSyncQueue() {
    const stmt = this.db.prepare("DELETE FROM sync_queue");
    stmt.run();
  }

  markAsSynced(entityType, entityId) {
    const table =
      entityType === "progress" ? "goal_progress" : `${entityType}s`;
    const idField = entityType === "progress" ? "goalId" : "id";

    const stmt = this.db.prepare(`
      UPDATE ${table}
      SET syncStatus = 'synced'
      WHERE ${idField} = ?
    `);

    stmt.run(entityId);
  }

  // Stats
  getStats() {
    const totalGoals = this.db
      .prepare("SELECT COUNT(*) as count FROM goals")
      .get().count;

    const today = new Date().toISOString().split("T")[0];
    const completedToday = this.db
      .prepare(
        `
      SELECT COUNT(DISTINCT goalId) as count 
      FROM goal_progress 
      WHERE date = ?
    `
      )
      .get(today).count;

    const totalNotes = this.db
      .prepare("SELECT COUNT(*) as count FROM notes")
      .get().count;

    return {
      totalGoals,
      completedToday,
      totalNotes,
      onTrack: Math.floor(totalGoals * 0.6), // Simplified calculation
      needsAttention: Math.floor(totalGoals * 0.3),
    };
  }

  // Sync with remote API
  async syncWithRemote(api) {
    const pendingItems = this.getPendingSyncItems();

    if (pendingItems.length === 0) {
      return { success: true, synced: 0 };
    }

    let syncedCount = 0;

    for (const item of pendingItems) {
      try {
        let remoteId;

        switch (item.operation) {
          case "create":
            if (item.entityType === "goal") {
              const response = await api.createGoal(item.data);
              remoteId = response.data._id;
              // Update local ID with remote ID
              this.db
                .prepare("UPDATE goals SET id = ?, syncStatus = ? WHERE id = ?")
                .run(remoteId, "synced", item.entityId);
            } else if (item.entityType === "note") {
              const response = await api.createNote(item.data);
              remoteId = response.data._id;
              this.db
                .prepare("UPDATE notes SET id = ?, syncStatus = ? WHERE id = ?")
                .run(remoteId, "synced", item.entityId);
            }
            break;

          case "update":
            if (item.entityType === "goal") {
              await api.updateGoal(item.entityId, item.data);
              this.markAsSynced("goal", item.entityId);
            } else if (item.entityType === "note") {
              await api.updateNote(item.entityId, item.data);
              this.markAsSynced("note", item.entityId);
            }
            break;

          case "delete":
            if (item.entityType === "goal") {
              await api.deleteGoal(item.entityId);
            } else if (item.entityType === "note") {
              await api.deleteNote(item.entityId);
            }
            break;
        }

        // Remove from sync queue
        this.db.prepare("DELETE FROM sync_queue WHERE id = ?").run(item.id);
        syncedCount++;
      } catch (error) {
        console.error(
          `Failed to sync ${item.entityType} ${item.entityId}:`,
          error.message
        );
      }
    }

    return {
      success: true,
      synced: syncedCount,
      failed: pendingItems.length - syncedCount,
    };
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

export default OfflineDatabase;
