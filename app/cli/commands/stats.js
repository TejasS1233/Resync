import { Command } from "commander";
import ora from "ora";
import chalk from "chalk";
import api, { isAuthenticated } from "../lib/api.js";
import { displayError, displayBox, getProgressBar } from "../lib/utils.js";

function requireAuth() {
  if (!isAuthenticated()) {
    displayError('You must be logged in. Use "resync auth login" to login.');
    process.exit(1);
  }
}

export function registerStatsCommands(program) {
  const stats = new Command("stats");
  stats.description("View your statistics and progress");

  // Summary command
  stats
    .command("summary")
    .alias("dash")
    .description("Display dashboard summary")
    .action(async () => {
      requireAuth();

      try {
        const spinner = ora("Fetching statistics...").start();

        const [goalsResponse, notesResponse] = await Promise.all([
          api.get("/goals"),
          api.get("/notes"),
        ]);

        spinner.stop();

        if (goalsResponse.data.success) {
          const goals = goalsResponse.data.data;
          const notes = notesResponse.data.data || [];

          // Calculate stats
          const totalGoals = goals.length;
          const activeGoals = goals.filter((g) => g.isActive).length;
          const completedToday = goals.filter((g) => {
            const today = new Date().toISOString().split("T")[0];
            return g.progress.some(
              (p) => p.date.split("T")[0] === today && p.completed > 0
            );
          }).length;

          // Calculate overall progress
          let totalProgress = 0;
          let goalCount = 0;

          goals.forEach((goal) => {
            if (!goal.isActive) return;

            const now = new Date();
            let periodStart;

            switch (goal.frequency) {
              case "daily":
                periodStart = new Date(
                  now.getFullYear(),
                  now.getMonth(),
                  now.getDate()
                );
                break;
              case "weekly":
                const dayOfWeek = now.getDay();
                periodStart = new Date(now);
                periodStart.setDate(now.getDate() - dayOfWeek);
                periodStart.setHours(0, 0, 0, 0);
                break;
              case "monthly":
                periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            }

            const currentProgress = goal.progress.filter(
              (p) => new Date(p.date) >= periodStart
            );

            const totalCompleted = currentProgress.reduce(
              (sum, p) => sum + p.completed,
              0
            );

            const percentage = Math.min(
              (totalCompleted / goal.targetCount) * 100,
              100
            );

            totalProgress += percentage;
            goalCount++;
          });

          const avgProgress = goalCount > 0 ? totalProgress / goalCount : 0;

          // Recent notes
          const recentNotes = notes.slice(0, 3);
          const notesThisWeek = notes.filter((note) => {
            const noteDate = new Date(note.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return noteDate >= weekAgo;
          }).length;

          // Build dashboard content
          const content = [
            chalk.bold.cyan("📊 GOALS OVERVIEW"),
            "",
            `${chalk.bold("Total Goals:")} ${totalGoals}`,
            `${chalk.bold("Active Goals:")} ${chalk.green(activeGoals)}`,
            `${chalk.bold("Completed Today:")} ${chalk.yellow(completedToday)}`,
            "",
            `${chalk.bold("Overall Progress:")}`,
            getProgressBar(avgProgress, 30),
            "",
            chalk.bold.cyan("📝 NOTES OVERVIEW"),
            "",
            `${chalk.bold("Total Notes:")} ${notes.length}`,
            `${chalk.bold("Notes This Week:")} ${notesThisWeek}`,
            "",
          ];

          if (recentNotes.length > 0) {
            content.push(chalk.bold("Recent Moods:"));
            const moodEmojis = {
              great: "😊",
              good: "🙂",
              okay: "😐",
              bad: "😔",
              terrible: "😢",
            };
            recentNotes.forEach((note) => {
              const date = new Date(note.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
              content.push(`  ${date}: ${moodEmojis[note.mood] || note.mood}`);
            });
          }

          displayBox(content.join("\n"), "🎯 Resync Dashboard");

          // Show motivational message
          if (avgProgress >= 80) {
            console.log(
              chalk.green.bold(
                "  🌟 Amazing progress! Keep up the great work!\n"
              )
            );
          } else if (avgProgress >= 50) {
            console.log(
              chalk.yellow.bold("  💪 You're doing well! Stay consistent!\n")
            );
          } else if (activeGoals > 0) {
            console.log(chalk.cyan.bold("  🚀 Let's make today count!\n"));
          }
        }
      } catch (error) {
        ora().fail("Failed to fetch statistics");
        displayError(error.userMessage || "Failed to fetch statistics");
      }
    });

  // Detailed stats
  stats
    .command("goals")
    .description("Detailed goal statistics")
    .action(async () => {
      requireAuth();

      try {
        const spinner = ora("Fetching goal statistics...").start();

        const response = await api.get("/goals/stats");

        if (response.data.success) {
          const stats = response.data.data;
          spinner.stop();

          const content = [
            `${chalk.bold("Total Goals:")} ${stats.totalGoals || 0}`,
            `${chalk.bold("Active Goals:")} ${stats.activeGoals || 0}`,
            `${chalk.bold("Completed Goals:")} ${stats.completedGoals || 0}`,
            "",
            chalk.bold("By Frequency:"),
            `  Daily: ${stats.byFrequency?.daily || 0}`,
            `  Weekly: ${stats.byFrequency?.weekly || 0}`,
            `  Monthly: ${stats.byFrequency?.monthly || 0}`,
            "",
            chalk.bold("By Category:"),
          ];

          if (stats.byCategory) {
            Object.entries(stats.byCategory).forEach(([category, count]) => {
              content.push(`  ${category}: ${count}`);
            });
          }

          displayBox(content.join("\n"), "📈 Goal Statistics");
        }
      } catch (error) {
        ora().fail("Failed to fetch goal statistics");
        displayError(error.userMessage || "Failed to fetch goal statistics");
      }
    });

  program.addCommand(stats);
}
