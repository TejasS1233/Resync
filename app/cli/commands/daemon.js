#!/usr/bin/env node

import schedule from "node-schedule";
import chalk from "chalk";
import boxen from "boxen";
import { getConfig, saveConfig } from "../lib/utils.js";
import api from "../lib/api.js";
import { exec } from "child_process";
import { platform } from "os";

class ResyncDaemon {
  constructor() {
    this.jobs = [];
    this.config = getConfig();
    this.running = false;
  }

  async start() {
    console.log(chalk.cyan("🚀 Starting Resync background daemon...\n"));

    if (!this.config.token) {
      console.error(chalk.red("❌ Please login first: resync auth login"));
      process.exit(1);
    }

    // Load daemon settings
    const daemonConfig = this.config.daemon || {
      goalReminder: true,
      goalReminderTime: "09:00",
      journalReminder: true,
      journalReminderTime: "20:00",
      pomodoroBreak: true,
      pomodoroWorkMinutes: 25,
      pomodoroBreakMinutes: 5,
    };

    // Schedule goal reminder
    if (daemonConfig.goalReminder) {
      const [hour, minute] = daemonConfig.goalReminderTime.split(":");
      const job = schedule.scheduleJob(`${minute} ${hour} * * *`, () => {
        this.sendGoalReminder();
      });
      this.jobs.push(job);
      console.log(
        chalk.green(
          `✓ Goal reminder scheduled for ${daemonConfig.goalReminderTime}`
        )
      );
    }

    // Schedule journal reminder
    if (daemonConfig.journalReminder) {
      const [hour, minute] = daemonConfig.journalReminderTime.split(":");
      const job = schedule.scheduleJob(`${minute} ${hour} * * *`, () => {
        this.sendJournalReminder();
      });
      this.jobs.push(job);
      console.log(
        chalk.green(
          `✓ Journal reminder scheduled for ${daemonConfig.journalReminderTime}`
        )
      );
    }

    // Save daemon PID
    this.config.daemon = {
      ...daemonConfig,
      pid: process.pid,
      startedAt: new Date().toISOString(),
    };
    saveConfig(this.config);

    this.running = true;
    console.log(chalk.cyan("\n📡 Daemon is running in the background"));
    console.log(chalk.gray("Press Ctrl+C to stop\n"));

    // Keep process alive
    process.on("SIGINT", () => {
      this.stop();
    });

    process.on("SIGTERM", () => {
      this.stop();
    });
  }

  async sendGoalReminder() {
    try {
      const response = await api.getGoals();
      const goals = response.data || [];

      const incompleteGoals = goals.filter((g) => {
        const progress = g.currentProgress || {};
        return progress.percentage < 100;
      });

      if (incompleteGoals.length > 0) {
        this.sendNotification(
          "Resync - Daily Goal Reminder",
          `You have ${incompleteGoals.length} goal(s) pending today. Keep up the momentum! 🎯`
        );
      } else {
        this.sendNotification(
          "Resync - All Goals Complete!",
          "Amazing! You've completed all your goals today! 🌟"
        );
      }
    } catch (error) {
      console.error(chalk.red("Failed to fetch goals for reminder"));
    }
  }

  async sendJournalReminder() {
    this.sendNotification(
      "Resync - Daily Journal",
      "Time to reflect on your day. How are you feeling? 📝"
    );
  }

  sendNotification(title, message) {
    const os = platform();

    console.log(
      boxen(chalk.bold(title) + "\n\n" + message, {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "cyan",
      })
    );

    // Send system notification based on OS
    try {
      if (os === "darwin") {
        // macOS
        exec(
          `osascript -e 'display notification "${message}" with title "${title}"'`
        );
      } else if (os === "win32") {
        // Windows - using PowerShell
        const script = `
          Add-Type -AssemblyName System.Windows.Forms
          $notification = New-Object System.Windows.Forms.NotifyIcon
          $notification.Icon = [System.Drawing.SystemIcons]::Information
          $notification.BalloonTipTitle = "${title}"
          $notification.BalloonTipText = "${message}"
          $notification.Visible = $true
          $notification.ShowBalloonTip(5000)
        `;
        exec(`powershell -Command "${script.replace(/\n/g, " ")}"`);
      } else if (os === "linux") {
        // Linux - using notify-send
        exec(`notify-send "${title}" "${message}"`);
      }
    } catch (error) {
      // Silently fail if notification system is not available
    }
  }

  startPomodoroTimer(workMinutes = 25, breakMinutes = 5) {
    console.log(
      chalk.cyan(
        `\n🍅 Starting Pomodoro: ${workMinutes} min work, ${breakMinutes} min break`
      )
    );

    let currentSession = "work";
    let sessionCount = 0;

    const workTimer = () => {
      this.sendNotification(
        "Pomodoro - Work Session",
        `Focus time! ${workMinutes} minutes of deep work. 🎯`
      );

      setTimeout(() => {
        this.sendNotification(
          "Pomodoro - Work Complete!",
          "Great work! Time for a break. 🌟"
        );
        sessionCount++;

        // Start break
        setTimeout(() => {
          this.sendNotification(
            "Pomodoro - Break Time",
            `Relax for ${breakMinutes} minutes. ☕`
          );

          setTimeout(() => {
            this.sendNotification(
              "Pomodoro - Break Complete",
              "Ready to get back to work? 💪"
            );

            // Start next work session
            workTimer();
          }, breakMinutes * 60 * 1000);
        }, 1000);
      }, workMinutes * 60 * 1000);
    };

    workTimer();
  }

  stop() {
    console.log(chalk.yellow("\n\n🛑 Stopping daemon...\n"));

    // Cancel all scheduled jobs
    this.jobs.forEach((job) => job.cancel());

    // Clear daemon config
    const config = getConfig();
    if (config.daemon) {
      delete config.daemon.pid;
      delete config.daemon.startedAt;
      saveConfig(config);
    }

    console.log(chalk.green("✓ Daemon stopped successfully\n"));
    process.exit(0);
  }

  status() {
    const config = getConfig();
    const daemon = config.daemon || {};

    if (daemon.pid) {
      console.log(
        boxen(
          chalk.bold.green("Daemon Status: Running\n\n") +
            chalk.gray(`PID: ${daemon.pid}\n`) +
            chalk.gray(
              `Started: ${new Date(daemon.startedAt).toLocaleString()}\n\n`
            ) +
            chalk.cyan("Reminders:\n") +
            (daemon.goalReminder
              ? `  ✓ Goals: ${daemon.goalReminderTime}\n`
              : "  ✗ Goals: Disabled\n") +
            (daemon.journalReminder
              ? `  ✓ Journal: ${daemon.journalReminderTime}\n`
              : "  ✗ Journal: Disabled\n"),
          {
            padding: 1,
            margin: 1,
            borderStyle: "round",
            borderColor: "green",
          }
        )
      );
    } else {
      console.log(
        boxen(
          chalk.bold.yellow("Daemon Status: Not Running\n\n") +
            chalk.gray("Start the daemon with: resync daemon start"),
          {
            padding: 1,
            margin: 1,
            borderStyle: "round",
            borderColor: "yellow",
          }
        )
      );
    }
  }
}

// Command registration function
export function registerDaemonCommands(program) {
  const daemon = program
    .command("daemon")
    .description("Background daemon for reminders and notifications");

  daemon
    .command("start")
    .description("Start the background daemon")
    .option("-p, --pomodoro", "Start with Pomodoro timer")
    .option(
      "-w, --work <minutes>",
      "Pomodoro work duration (default: 25)",
      "25"
    )
    .option(
      "-b, --break <minutes>",
      "Pomodoro break duration (default: 5)",
      "5"
    )
    .action(async (options) => {
      const daemonProcess = new ResyncDaemon();
      await daemonProcess.start();

      if (options.pomodoro) {
        daemonProcess.startPomodoroTimer(
          parseInt(options.work),
          parseInt(options.break)
        );
      }
    });

  daemon
    .command("stop")
    .description("Stop the background daemon")
    .action(() => {
      const config = getConfig();
      if (config.daemon?.pid) {
        try {
          process.kill(config.daemon.pid, "SIGTERM");
          console.log(chalk.green("✓ Daemon stopped"));
        } catch (error) {
          console.error(chalk.red("Failed to stop daemon"));
        }
      } else {
        console.log(chalk.yellow("Daemon is not running"));
      }
    });

  daemon
    .command("status")
    .description("Check daemon status")
    .action(() => {
      const daemonProcess = new ResyncDaemon();
      daemonProcess.status();
    });

  daemon
    .command("config")
    .description("Configure daemon settings")
    .action(async () => {
      const inquirer = (await import("inquirer")).default;
      const config = getConfig();
      const currentDaemon = config.daemon || {};

      const answers = await inquirer.prompt([
        {
          type: "confirm",
          name: "goalReminder",
          message: "Enable daily goal reminders?",
          default: currentDaemon.goalReminder !== false,
        },
        {
          type: "input",
          name: "goalReminderTime",
          message: "Goal reminder time (HH:MM):",
          default: currentDaemon.goalReminderTime || "09:00",
          when: (answers) => answers.goalReminder,
        },
        {
          type: "confirm",
          name: "journalReminder",
          message: "Enable daily journal reminders?",
          default: currentDaemon.journalReminder !== false,
        },
        {
          type: "input",
          name: "journalReminderTime",
          message: "Journal reminder time (HH:MM):",
          default: currentDaemon.journalReminderTime || "20:00",
          when: (answers) => answers.journalReminder,
        },
      ]);

      config.daemon = {
        ...currentDaemon,
        ...answers,
      };
      saveConfig(config);

      console.log(chalk.green("\n✓ Daemon configuration saved!"));
      console.log(
        chalk.gray("Restart the daemon for changes to take effect.\n")
      );
    });
}

export default ResyncDaemon;
