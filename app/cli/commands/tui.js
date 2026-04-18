#!/usr/bin/env node

import blessed from "blessed";
import contrib from "blessed-contrib";
import chalk from "chalk";
import { getConfig } from "../lib/utils.js";
import api from "../lib/api.js";

class ResyncTUI {
  constructor() {
    this.screen = null;
    this.grid = null;
    this.goals = [];
    this.notes = [];
    this.stats = {};
    this.selectedGoalIndex = 0;
    this.currentView = "dashboard";
  }

  async initialize() {
    try {
      await this.loadData();
      this.createScreen();
      this.setupKeybindings();
      this.render();
    } catch (error) {
      console.error("Failed to initialize TUI:", error.message);
      process.exit(1);
    }
  }

  async loadData() {
    try {
      const goalsResponse = await api.getGoals();
      this.goals = goalsResponse.data || [];

      const statsResponse = await api.getStats();
      this.stats = statsResponse.data || {};

      const notesResponse = await api.getNotes();
      this.notes = notesResponse.data || [];
    } catch (error) {
      throw new Error("Failed to load data. Please check your authentication.");
    }
  }

  createScreen() {
    // Create screen
    this.screen = blessed.screen({
      smartCSR: true,
      title: "Resync - Goal Tracker",
      fullUnicode: true,
    });

    // Create grid layout
    this.grid = new contrib.grid({ rows: 12, cols: 12, screen: this.screen });

    // Header
    this.header = blessed.box({
      top: 0,
      left: 0,
      width: "100%",
      height: 3,
      content: this.getHeaderContent(),
      tags: true,
      style: {
        fg: "white",
        bg: "magenta",
        bold: true,
      },
      border: {
        type: "line",
        fg: "cyan",
      },
    });
    this.screen.append(this.header);

    // Stats Dashboard (top section)
    this.statsBox = this.grid.set(0, 0, 2, 12, blessed.box, {
      label: " 📊 Stats ",
      content: this.getStatsContent(),
      tags: true,
      style: {
        fg: "white",
        border: { fg: "cyan" },
      },
      border: { type: "line" },
    });

    // Goals List (left side)
    this.goalsTable = this.grid.set(2, 0, 7, 8, contrib.table, {
      keys: true,
      vi: true,
      label: " 🎯 Goals ",
      columnSpacing: 3,
      columnWidth: [30, 15, 10, 10],
      style: {
        fg: "white",
        border: { fg: "cyan" },
        header: { fg: "cyan", bold: true },
        cell: { selected: { bg: "blue" } },
      },
      border: { type: "line" },
    });

    // Goal Details (right side)
    this.detailsBox = this.grid.set(2, 8, 5, 4, blessed.box, {
      label: " 📝 Details ",
      content: this.getGoalDetails(),
      tags: true,
      scrollable: true,
      alwaysScroll: true,
      keys: true,
      vi: true,
      mouse: true,
      style: {
        fg: "white",
        border: { fg: "cyan" },
        scrollbar: { bg: "blue" },
      },
      border: { type: "line" },
      scrollbar: {
        ch: " ",
        track: { bg: "cyan" },
        style: { inverse: true },
      },
    });

    // Quick Actions (bottom right)
    this.actionsBox = this.grid.set(7, 8, 2, 4, blessed.box, {
      label: " ⚡ Quick Actions ",
      content: this.getActionsContent(),
      tags: true,
      style: {
        fg: "white",
        border: { fg: "cyan" },
      },
      border: { type: "line" },
    });

    // Activity Chart (bottom left)
    this.activityChart = this.grid.set(9, 0, 3, 8, contrib.bar, {
      label: " 📈 7-Day Activity ",
      barWidth: 4,
      barSpacing: 6,
      xOffset: 0,
      maxHeight: 9,
      style: {
        fg: "white",
        border: { fg: "cyan" },
      },
      border: { type: "line" },
    });

    // Log Box (bottom right)
    this.logBox = this.grid.set(9, 8, 3, 4, blessed.log, {
      label: " 📋 Activity Log ",
      tags: true,
      style: {
        fg: "white",
        border: { fg: "cyan" },
      },
      border: { type: "line" },
    });

    // Help Footer
    this.footer = blessed.box({
      bottom: 0,
      left: 0,
      width: "100%",
      height: 1,
      content: this.getFooterContent(),
      tags: true,
      style: {
        fg: "black",
        bg: "cyan",
      },
    });
    this.screen.append(this.footer);

    // Update table with goals data
    this.updateGoalsTable();
    this.updateActivityChart();
  }

  getHeaderContent() {
    const config = getConfig();
    return `{center}{bold}🌟 RESYNC - Goal Tracker{/bold}  |  User: ${
      config.user?.name || "Unknown"
    }{/center}`;
  }

  getStatsContent() {
    const {
      totalGoals = 0,
      completedToday = 0,
      onTrack = 0,
      needsAttention = 0,
    } = this.stats;
    return (
      `  {cyan-fg}Total Goals:{/cyan-fg} ${totalGoals}  |  ` +
      `{green-fg}✓ Completed:{/green-fg} ${completedToday}  |  ` +
      `{blue-fg}→ On Track:{/blue-fg} ${onTrack}  |  ` +
      `{yellow-fg}⚠ Needs Focus:{/yellow-fg} ${needsAttention}`
    );
  }

  getGoalDetails() {
    if (this.goals.length === 0) {
      return "{center}No goals selected{/center}";
    }

    const goal = this.goals[this.selectedGoalIndex];
    if (!goal) return "{center}No goal selected{/center}";

    const progress = goal.currentProgress || {};
    const percentage = progress.percentage || 0;

    return (
      `{bold}${goal.title}{/bold}\n\n` +
      `{cyan-fg}Category:{/cyan-fg} ${goal.category}\n` +
      `{cyan-fg}Frequency:{/cyan-fg} ${goal.frequency}\n` +
      `{cyan-fg}Target:{/cyan-fg} ${goal.targetCount}\n\n` +
      `{cyan-fg}Progress:{/cyan-fg} ${progress.completed || 0}/${
        goal.targetCount
      } (${percentage}%)\n` +
      `${"█".repeat(Math.floor(percentage / 10))}${"░".repeat(
        10 - Math.floor(percentage / 10)
      )}\n\n` +
      `{cyan-fg}Description:{/cyan-fg}\n${goal.description || "No description"}`
    );
  }

  getActionsContent() {
    return (
      `{center}[C] Complete Goal\n` +
      `[N] New Goal\n` +
      `[E] Edit Goal\n` +
      `[D] Delete Goal\n` +
      `[R] Refresh{/center}`
    );
  }

  getFooterContent() {
    return " [↑↓] Navigate | [Tab] Switch Panel | [C] Complete | [N] New | [E] Edit | [D] Delete | [R] Refresh | [Q] Quit ";
  }

  updateGoalsTable() {
    const data = this.goals.map((goal) => {
      const progress = goal.currentProgress || {};
      const percentage = progress.percentage || 0;
      const status = percentage >= 100 ? "✓" : percentage >= 50 ? "→" : "⚠";

      return [
        goal.title.slice(0, 28),
        goal.category,
        `${progress.completed || 0}/${goal.targetCount}`,
        `${status} ${percentage}%`,
      ];
    });

    this.goalsTable.setData({
      headers: ["Goal", "Category", "Progress", "Status"],
      data: data,
    });
  }

  updateActivityChart() {
    // Get last 7 days activity
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split("T")[0];
    });

    const activityData = last7Days.map((dateStr) => {
      const dayCompletions = this.goals.reduce((total, goal) => {
        const progress = goal.progress?.find((p) => p.date.startsWith(dateStr));
        return total + (progress?.completed || 0);
      }, 0);

      return {
        title: dateStr.slice(5), // MM-DD
        value: dayCompletions,
      };
    });

    this.activityChart.setData({
      titles: activityData.map((d) => d.title),
      data: activityData.map((d) => d.value),
    });
  }

  setupKeybindings() {
    // Quit
    this.screen.key(["escape", "q", "C-c"], () => {
      return process.exit(0);
    });

    // Navigation
    this.goalsTable.rows.on("select", (item, index) => {
      this.selectedGoalIndex = index;
      this.detailsBox.setContent(this.getGoalDetails());
      this.screen.render();
    });

    // Refresh data
    this.screen.key(["r"], async () => {
      this.log("Refreshing data...");
      await this.loadData();
      this.updateGoalsTable();
      this.updateActivityChart();
      this.statsBox.setContent(this.getStatsContent());
      this.detailsBox.setContent(this.getGoalDetails());
      this.log("Data refreshed!");
      this.screen.render();
    });

    // Complete goal
    this.screen.key(["c"], async () => {
      if (this.goals.length === 0) return;

      const goal = this.goals[this.selectedGoalIndex];
      if (!goal) return;

      try {
        this.log(`Completing ${goal.title}...`);
        await api.updateGoalProgress(goal._id, 1);
        await this.loadData();
        this.updateGoalsTable();
        this.detailsBox.setContent(this.getGoalDetails());
        this.log(`✓ Completed ${goal.title}!`);
        this.screen.render();
      } catch (error) {
        this.log(`✗ Error: ${error.message}`);
      }
    });

    // New goal (exit TUI and run command)
    this.screen.key(["n"], () => {
      this.screen.destroy();
      console.log("\nExiting TUI mode to create new goal...");
      console.log("Run: resync goals add");
      process.exit(0);
    });

    // Delete goal
    this.screen.key(["d"], async () => {
      if (this.goals.length === 0) return;

      const goal = this.goals[this.selectedGoalIndex];
      if (!goal) return;

      // Simple confirmation
      this.log(
        `Delete ${goal.title}? Press 'd' again to confirm or any other key to cancel.`
      );

      const confirmKey = await new Promise((resolve) => {
        this.screen.once("keypress", (ch) => resolve(ch));
      });

      if (confirmKey === "d") {
        try {
          this.log(`Deleting ${goal.title}...`);
          await api.deleteGoal(goal._id);
          await this.loadData();
          this.selectedGoalIndex = Math.min(
            this.selectedGoalIndex,
            this.goals.length - 1
          );
          this.updateGoalsTable();
          this.detailsBox.setContent(this.getGoalDetails());
          this.log(`✗ Deleted ${goal.title}`);
          this.screen.render();
        } catch (error) {
          this.log(`✗ Error: ${error.message}`);
        }
      } else {
        this.log("Delete cancelled");
      }
    });

    // Focus on goals table by default
    this.goalsTable.focus();
  }

  log(message) {
    const timestamp = new Date().toLocaleTimeString();
    this.logBox.log(`[${timestamp}] ${message}`);
  }

  render() {
    this.screen.render();
    this.log("TUI mode started. Press q to quit.");
  }
}

// Main function
async function main() {
  try {
    // Check if user is authenticated
    const config = getConfig();
    if (!config.token) {
      console.error("❌ Please login first: resync auth login");
      process.exit(1);
    }

    const tui = new ResyncTUI();
    await tui.initialize();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

// Run TUI
main().catch(console.error);
