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
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isBun = typeof Bun !== "undefined";
const tuiPath = join(__dirname, "../tui-opentui.js");

async function launchTUI() {
  if (isBun && existsSync(tuiPath)) {
    console.log("Launching TUI (Bun)...");
    const { default: tui } = await import("../tui-opentui.js");
  } else {
    console.log("Launching TUI (Node.js)...");
    const tuiPath = join(__dirname, "../commands/tui.js");
    const { spawn } = await import("child_process");
    spawn("node", [tuiPath], { stdio: "inherit" });
  }
}

const program = new Command();

program
  .name("resync")
  .description(
    chalk.cyan("Resync CLI - Track your goals and progress from the terminal")
  )
  .version("1.0.0");

registerAuthCommands(program);
registerGoalCommands(program);
registerNoteCommands(program);
registerStatsCommands(program);
registerFocusCommands(program);
registerConfigCommands(program);
registerDaemonCommands(program);

program.action(async () => {
  await launchTUI();
});

program.on("command:*", () => {
  console.error(
    chalk.red("\nInvalid command. Use --help to see available commands.\n")
  );
  process.exit(1);
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  await launchTUI();
}