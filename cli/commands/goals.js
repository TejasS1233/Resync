import { Command } from "commander";
import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import Table from "cli-table3";
import api, { isAuthenticated } from "../lib/api.js";
import {
  displaySuccess,
  displayError,
  displayInfo,
  getProgressBar,
  formatDate,
} from "../lib/utils.js";

function requireAuth() {
  if (!isAuthenticated()) {
    displayError('You must be logged in. Use "resync auth login" to login.');
    process.exit(1);
  }
}

export function registerGoalCommands(program) {
  const goals = new Command("goals");
  goals.description("Manage your goals");

  // List goals
  goals
    .command("list")
    .alias("ls")
    .description("List all your goals")
    .option("-f, --filter <category>", "Filter by category")
    .option("-a, --all", "Show inactive goals too")
    .action(async (options) => {
      requireAuth();

      try {
        const spinner = ora("Fetching goals...").start();

        const response = await api.get("/goals");

        if (response.data.success) {
          let goals = response.data.data;

          // Apply filters
          if (options.filter) {
            goals = goals.filter(
              (g) => g.category.toLowerCase() === options.filter.toLowerCase()
            );
          }

          if (!options.all) {
            goals = goals.filter((g) => g.isActive);
          }

          spinner.stop();

          if (goals.length === 0) {
            displayInfo('No goals found. Create one with "resync goals add"');
            return;
          }

          const table = new Table({
            head: [
              chalk.cyan("Title"),
              chalk.cyan("Category"),
              chalk.cyan("Frequency"),
              chalk.cyan("Progress"),
              chalk.cyan("Status"),
            ],
            colWidths: [30, 15, 12, 30, 10],
            wordWrap: true,
          });

          goals.forEach((goal) => {
            const progress = goal.progress || [];
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

            const currentProgress = progress.filter(
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

            table.push([
              goal.title,
              goal.category,
              goal.frequency,
              `${totalCompleted}/${goal.targetCount}\n${getProgressBar(
                percentage
              )}`,
              goal.isActive ? chalk.green("Active") : chalk.gray("Inactive"),
            ]);
          });

          console.log("\n" + table.toString() + "\n");
          displayInfo(`Total: ${goals.length} goal(s)`);
        }
      } catch (error) {
        ora().fail("Failed to fetch goals");
        displayError(error.userMessage || "Failed to fetch goals");
      }
    });

  // Add goal
  goals
    .command("add")
    .description("Create a new goal")
    .action(async () => {
      requireAuth();

      try {
        const answers = await inquirer.prompt([
          {
            type: "input",
            name: "title",
            message: "Goal title:",
            validate: (input) => (input ? true : "Title is required"),
          },
          {
            type: "input",
            name: "description",
            message: "Description (optional):",
          },
          {
            type: "list",
            name: "frequency",
            message: "Frequency:",
            choices: ["daily", "weekly", "monthly"],
            default: "daily",
          },
          {
            type: "number",
            name: "targetCount",
            message: "Target count per period:",
            default: 1,
            validate: (input) => {
              if (!input || input < 1) return "Target must be at least 1";
              return true;
            },
          },
          {
            type: "input",
            name: "category",
            message: "Category:",
            default: "General",
          },
          {
            type: "confirm",
            name: "setEndDate",
            message: "Set an end date?",
            default: false,
          },
        ]);

        let endDate = null;
        if (answers.setEndDate) {
          const dateAnswer = await inquirer.prompt([
            {
              type: "input",
              name: "endDate",
              message: "End date (YYYY-MM-DD):",
              validate: (input) => {
                if (!input) return true;
                const date = new Date(input);
                if (isNaN(date.getTime())) return "Invalid date format";
                if (date < new Date()) return "End date must be in the future";
                return true;
              },
            },
          ]);
          endDate = dateAnswer.endDate || null;
        }

        const spinner = ora("Creating goal...").start();

        const goalData = {
          title: answers.title,
          description: answers.description || "",
          frequency: answers.frequency,
          targetCount: answers.targetCount,
          category: answers.category,
          endDate,
        };

        const response = await api.post("/goals", goalData);

        if (response.data.success) {
          spinner.succeed("Goal created successfully!");
          displaySuccess(`"${answers.title}" has been added to your goals`);
        }
      } catch (error) {
        ora().fail("Failed to create goal");
        displayError(error.userMessage || "Failed to create goal");
      }
    });

  // Update progress
  goals
    .command("check")
    .description("Update goal progress")
    .action(async () => {
      requireAuth();

      try {
        const spinner = ora("Fetching goals...").start();

        const response = await api.get("/goals");

        if (!response.data.success || response.data.data.length === 0) {
          spinner.stop();
          displayInfo('No goals found. Create one with "resync goals add"');
          return;
        }

        const goals = response.data.data.filter((g) => g.isActive);

        if (goals.length === 0) {
          spinner.stop();
          displayInfo("No active goals found");
          return;
        }

        spinner.stop();

        const { goalId } = await inquirer.prompt([
          {
            type: "list",
            name: "goalId",
            message: "Select a goal to update:",
            choices: goals.map((g) => ({
              name: `${g.title} (${g.category})`,
              value: g._id,
            })),
          },
        ]);

        const { action, amount } = await inquirer.prompt([
          {
            type: "list",
            name: "action",
            message: "Action:",
            choices: [
              { name: "Increment (+1)", value: "increment" },
              { name: "Decrement (-1)", value: "decrement" },
              { name: "Set custom amount", value: "custom" },
            ],
          },
          {
            type: "number",
            name: "amount",
            message: "Amount:",
            default: 1,
            when: (answers) => answers.action === "custom",
            validate: (input) => {
              if (input === undefined || input === null)
                return "Amount is required";
              return true;
            },
          },
        ]);

        const updateSpinner = ora("Updating progress...").start();

        let updateData = {};
        if (action === "increment") {
          updateData = { action: "increment", amount: 1 };
        } else if (action === "decrement") {
          updateData = { action: "decrement", amount: 1 };
        } else {
          updateData = { action: "set", amount };
        }

        const updateResponse = await api.patch(
          `/goals/${goalId}/progress`,
          updateData
        );

        if (updateResponse.data.success) {
          updateSpinner.succeed("Progress updated!");
          displaySuccess("Goal progress has been updated");
        }
      } catch (error) {
        ora().fail("Failed to update progress");
        displayError(error.userMessage || "Failed to update progress");
      }
    });

  // Delete goal
  goals
    .command("delete")
    .alias("rm")
    .description("Delete a goal")
    .action(async () => {
      requireAuth();

      try {
        const spinner = ora("Fetching goals...").start();

        const response = await api.get("/goals");

        if (!response.data.success || response.data.data.length === 0) {
          spinner.stop();
          displayInfo("No goals found");
          return;
        }

        const goals = response.data.data;
        spinner.stop();

        const { goalId } = await inquirer.prompt([
          {
            type: "list",
            name: "goalId",
            message: "Select a goal to delete:",
            choices: goals.map((g) => ({
              name: `${g.title} (${g.category})`,
              value: g._id,
            })),
          },
        ]);

        const selectedGoal = goals.find((g) => g._id === goalId);

        const { confirm } = await inquirer.prompt([
          {
            type: "confirm",
            name: "confirm",
            message: `Are you sure you want to delete "${selectedGoal.title}"?`,
            default: false,
          },
        ]);

        if (!confirm) {
          displayInfo("Deletion cancelled");
          return;
        }

        const deleteSpinner = ora("Deleting goal...").start();

        await api.delete(`/goals/${goalId}`);

        deleteSpinner.succeed("Goal deleted successfully");
      } catch (error) {
        ora().fail("Failed to delete goal");
        displayError(error.userMessage || "Failed to delete goal");
      }
    });

  program.addCommand(goals);
}
