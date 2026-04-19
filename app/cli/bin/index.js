#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { registerAuthCommands } from "../commands/auth.js";
import { registerGoalCommands } from "../commands/goals.js";
import { registerNoteCommands } from "../commands/notes.js";
import { registerStatsCommands } from "../commands/stats.js";
import { registerFocusCommands } from "../commands/focus.js";
import { registerConfigCommands } from "../commands/config.js";
import api, { isAuthenticated } from "../lib/api.js";

const program = new Command();

program
  .name("resync")
  .description(
    chalk.cyan("Resync CLI - Track your goals and progress from the terminal")
  )
  .version("2.0.0");

// Default action - show dashboard
program.action(async () => {
  if (!isAuthenticated()) {
    console.log(chalk.yellow("\nNot logged in. Run 'resync auth login' first.\n"));
    return;
  }
  try {
    const [goalsRes, statsRes] = await Promise.all([
      api.get("/goals"),
      api.get("/goals/stats"),
    ]);
    const goals = goalsRes.data.data || [];
    const stats = statsRes.data.data || {};
    
    console.log(chalk.cyan("\n=== RESYNC DASHBOARD ===\n"));
    console.log(chalk.green(`Goals: ${stats.totalGoals || 0}`));
    console.log(chalk.green(`Completed Today: ${stats.completedToday || 0}`));
    console.log(chalk.green(`Streak: ${stats.streak || 0} days`));
    console.log(chalk.green(`Rate: ${stats.completionRate || 0}%`));
    console.log(chalk.cyan("\nYour Goals:"));
    goals.forEach((g, i) => {
      const pct = g.currentProgress?.percentage || 0;
      console.log(`${i+1}. ${g.title} - ${pct}%`);
    });
    console.log(chalk.gray("\nRun 'resync goals --help' for more commands.\n"));
  } catch (err) {
    console.error(chalk.red(err.message || "Failed to load"));
  }
});

registerAuthCommands(program);
registerGoalCommands(program);
registerNoteCommands(program);
registerStatsCommands(program);
registerFocusCommands(program);
registerConfigCommands(program);

program.on("command:*", () => {
  console.error(
    chalk.red("\nInvalid command. Use --help to see available commands.\n")
  );
  process.exit(1);
});

program.parse(process.argv);