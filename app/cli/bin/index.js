#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { registerAuthCommands } from "../commands/auth.js";
import { registerGoalCommands } from "../commands/goals.js";
import { registerNoteCommands } from "../commands/notes.js";
import { registerStatsCommands } from "../commands/stats.js";
import { registerFocusCommands } from "../commands/focus.js";
import { registerConfigCommands } from "../commands/config.js";
import { registerDaemonCommands } from "../commands/daemon.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

program
  .name("resync")
  .description(
    chalk.cyan("Resync CLI - Track your goals and progress from the terminal")
  )
  .version("1.0.0");

// Register command modules
registerAuthCommands(program);
registerGoalCommands(program);
registerNoteCommands(program);
registerStatsCommands(program);
registerFocusCommands(program);
registerConfigCommands(program);
registerDaemonCommands(program);

// Default to TUI mode
program.action(async () => {
  const { default: tui } = await import("../tui-opentui.js");
});

// Handle unknown commands
program.on("command:*", () => {
  console.error(
    chalk.red("\n✖ Invalid command. Use --help to see available commands.\n")
  );
  process.exit(1);
});

// Parse arguments
program.parse(process.argv);

// Show TUI if no command provided (default behavior)
if (!process.argv.slice(2).length) {
  const { default: tui } = await import("../tui-opentui.js");
}
