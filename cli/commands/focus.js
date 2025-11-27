import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import { displaySuccess, displayInfo, displayBox } from "../lib/utils.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

async function runTimer(duration, label) {
  let remaining = duration;

  console.log("\n" + chalk.cyan("═".repeat(50)));
  console.log(chalk.bold.cyan(`  ${label} - ${formatTime(duration)}`));
  console.log(chalk.cyan("═".repeat(50)) + "\n");

  displayInfo("Press Ctrl+C to stop the timer\n");

  const startTime = Date.now();

  while (remaining > 0) {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    remaining = duration - elapsed;

    if (remaining < 0) remaining = 0;

    // Clear line and show timer
    process.stdout.write("\r" + " ".repeat(50));
    process.stdout.write(
      "\r  " +
        chalk.bold.yellow("⏱  ") +
        chalk.bold.white(formatTime(remaining)) +
        "  " +
        getTimerBar(remaining, duration)
    );

    await sleep(1000);
  }

  console.log("\n");
}

function getTimerBar(remaining, total) {
  const percentage = (remaining / total) * 100;
  const width = 20;
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;

  let color = chalk.green;
  if (percentage <= 25) color = chalk.red;
  else if (percentage <= 50) color = chalk.yellow;

  return color("█".repeat(filled)) + chalk.gray("░".repeat(empty));
}

export function registerFocusCommands(program) {
  const focus = new Command("focus");
  focus.description("Focus and productivity tools");

  // Pomodoro timer
  focus
    .command("start")
    .description("Start a focus/pomodoro session")
    .option("-d, --duration <minutes>", "Duration in minutes", "25")
    .option("-b, --break <minutes>", "Break duration in minutes", "5")
    .option(
      "-l, --long-break <minutes>",
      "Long break duration in minutes",
      "15"
    )
    .option("-c, --cycles <number>", "Number of cycles before long break", "4")
    .action(async (options) => {
      try {
        const workDuration = parseInt(options.duration) * 60;
        const shortBreak = parseInt(options.break) * 60;
        const longBreak = parseInt(options.longBreak) * 60;
        const cycles = parseInt(options.cycles);

        displayBox(
          [
            chalk.bold("Focus Session Configuration:"),
            "",
            `Work Duration: ${options.duration} minutes`,
            `Short Break: ${options.break} minutes`,
            `Long Break: ${options.longBreak} minutes`,
            `Cycles: ${cycles}`,
          ].join("\n"),
          "🎯 Pomodoro Timer"
        );

        const { confirm } = await inquirer.prompt([
          {
            type: "confirm",
            name: "confirm",
            message: "Start focus session?",
            default: true,
          },
        ]);

        if (!confirm) {
          displayInfo("Focus session cancelled");
          return;
        }

        let cycleCount = 0;

        while (cycleCount < cycles) {
          cycleCount++;

          // Work session
          console.log(
            chalk.bold.green(
              `\n🎯 Cycle ${cycleCount}/${cycles} - FOCUS TIME\n`
            )
          );
          await runTimer(workDuration, "⚡ Work Session");

          displaySuccess("Work session complete! Great job! 🎉");

          // Break
          if (cycleCount < cycles) {
            console.log(chalk.bold.cyan("\n☕ Time for a short break!\n"));
            await runTimer(shortBreak, "☕ Short Break");
            displaySuccess("Break complete! Ready for the next session?");
          }
        }

        // Long break after all cycles
        console.log(
          chalk.bold.magenta(
            "\n🌟 All cycles complete! Time for a long break!\n"
          )
        );
        await runTimer(longBreak, "🌟 Long Break");

        displayBox(
          [
            chalk.bold.green("🎉 Focus Session Complete!"),
            "",
            `You completed ${cycles} work cycles`,
            `Total focus time: ${cycles * parseInt(options.duration)} minutes`,
            "",
            chalk.italic("Great work! You're making progress! 💪"),
          ].join("\n"),
          "✨ Session Summary"
        );
      } catch (error) {
        if (error.message === "User force closed the prompt") {
          displayInfo("\nTimer stopped");
        } else {
          console.error(chalk.red("\n✖ Timer error:", error.message));
        }
      }
    });

  // Quick timer
  focus
    .command("timer")
    .description("Start a simple countdown timer")
    .argument("<minutes>", "Duration in minutes")
    .action(async (minutes) => {
      try {
        const duration = parseInt(minutes) * 60;

        if (isNaN(duration) || duration <= 0) {
          console.error(chalk.red("\n✖ Invalid duration"));
          return;
        }

        displayInfo(`Starting ${minutes} minute timer...`);

        await runTimer(duration, `⏱  ${minutes} Minute Timer`);

        displaySuccess("Timer complete! ⏰");
      } catch (error) {
        if (error.message === "User force closed the prompt") {
          displayInfo("\nTimer stopped");
        } else {
          console.error(chalk.red("\n✖ Timer error:", error.message));
        }
      }
    });

  program.addCommand(focus);
}
