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
import { exec } from "child_process";
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

// TUI Mode Command
program
  .command("tui")
  .description("Launch interactive TUI (Text User Interface) dashboard")
  .action(async () => {
    try {
      // Execute the TUI script
      const tuiPath = join(__dirname, "../commands/tui.js");
      exec(`node "${tuiPath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(chalk.red(`Error launching TUI: ${error.message}`));
          return;
        }
        if (stderr) {
          console.error(stderr);
        }
        console.log(stdout);
      });
    } catch (error) {
      console.error(chalk.red(`Failed to launch TUI: ${error.message}`));
      process.exit(1);
    }
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

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
