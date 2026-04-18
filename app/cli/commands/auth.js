import { Command } from "commander";
import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import api, {
  setToken,
  setUser,
  clearAuth,
  getUser,
  isAuthenticated,
} from "../lib/api.js";
import {
  displaySuccess,
  displayError,
  displayInfo,
  displayBox,
} from "../lib/utils.js";

export function registerAuthCommands(program) {
  const auth = new Command("auth");
  auth.description("Authentication commands");

  // Login command
  auth
    .command("login")
    .description("Login to your Resync account")
    .action(async () => {
      try {
        if (isAuthenticated()) {
          const user = getUser();
          displayWarning(`Already logged in as ${user.email}`);
          const { confirm } = await inquirer.prompt([
            {
              type: "confirm",
              name: "confirm",
              message: "Do you want to login with a different account?",
              default: false,
            },
          ]);
          if (!confirm) return;
          clearAuth();
        }

        const answers = await inquirer.prompt([
          {
            type: "input",
            name: "email",
            message: "Email:",
            validate: (input) => {
              if (!input) return "Email is required";
              if (!/\S+@\S+\.\S+/.test(input))
                return "Please enter a valid email";
              return true;
            },
          },
          {
            type: "password",
            name: "password",
            message: "Password:",
            mask: "*",
            validate: (input) => (input ? true : "Password is required"),
          },
        ]);

        const spinner = ora("Logging in...").start();

        const response = await api.post("/auth/login", answers);

        if (response.data.success) {
          const { token, ...user } = response.data.data;
          setToken(token);
          setUser(user);

          spinner.succeed("Login successful!");
          displaySuccess(`Welcome back, ${chalk.bold(user.name)}!`);
        }
      } catch (error) {
        ora().fail("Login failed");
        displayError(error.userMessage || "Login failed");
      }
    });

  // Register command
  auth
    .command("register")
    .description("Create a new Resync account")
    .action(async () => {
      try {
        const answers = await inquirer.prompt([
          {
            type: "input",
            name: "name",
            message: "Full Name:",
            validate: (input) => (input ? true : "Name is required"),
          },
          {
            type: "input",
            name: "email",
            message: "Email:",
            validate: (input) => {
              if (!input) return "Email is required";
              if (!/\S+@\S+\.\S+/.test(input))
                return "Please enter a valid email";
              return true;
            },
          },
          {
            type: "password",
            name: "password",
            message: "Password (min 6 characters):",
            mask: "*",
            validate: (input) => {
              if (!input) return "Password is required";
              if (input.length < 6)
                return "Password must be at least 6 characters";
              return true;
            },
          },
          {
            type: "password",
            name: "confirmPassword",
            message: "Confirm Password:",
            mask: "*",
            validate: (input, answers) => {
              if (input !== answers.password) return "Passwords do not match";
              return true;
            },
          },
        ]);

        const spinner = ora("Creating account...").start();

        const { confirmPassword, ...userData } = answers;
        const response = await api.post("/auth/register", userData);

        if (response.data.success) {
          const { token, ...user } = response.data.data;
          setToken(token);
          setUser(user);

          spinner.succeed("Account created successfully!");
          displaySuccess(`Welcome to Resync, ${chalk.bold(user.name)}!`);
          displayInfo(
            'You can now start tracking your goals with "resync goals add"'
          );
        }
      } catch (error) {
        ora().fail("Registration failed");
        displayError(error.userMessage || "Registration failed");
      }
    });

  // Logout command
  auth
    .command("logout")
    .description("Logout from your account")
    .action(async () => {
      try {
        if (!isAuthenticated()) {
          displayInfo("You are not logged in");
          return;
        }

        const user = getUser();
        const { confirm } = await inquirer.prompt([
          {
            type: "confirm",
            name: "confirm",
            message: `Logout from ${user.email}?`,
            default: true,
          },
        ]);

        if (confirm) {
          clearAuth();
          displaySuccess("Logged out successfully");
        }
      } catch (error) {
        displayError("Logout failed");
      }
    });

  // Whoami command
  auth
    .command("whoami")
    .description("Display current user information")
    .action(async () => {
      try {
        if (!isAuthenticated()) {
          displayInfo(
            'You are not logged in. Use "resync auth login" to login.'
          );
          return;
        }

        const spinner = ora("Fetching user info...").start();

        const response = await api.get("/auth/me");

        if (response.data.success) {
          const user = response.data.data;
          spinner.stop();

          const content = [
            `${chalk.bold("Name:")} ${user.name}`,
            `${chalk.bold("Email:")} ${user.email}`,
            `${chalk.bold("Onboarded:")} ${
              user.onboarded ? chalk.green("Yes") : chalk.yellow("No")
            }`,
            user.onboardingData?.purpose &&
              `${chalk.bold("Purpose:")} ${user.onboardingData.purpose}`,
            user.onboardingData?.preferredFrequency &&
              `${chalk.bold("Preferred Frequency:")} ${
                user.onboardingData.preferredFrequency
              }`,
          ]
            .filter(Boolean)
            .join("\n");

          displayBox(content, "👤 User Profile");
        }
      } catch (error) {
        ora().fail("Failed to fetch user info");
        displayError(error.userMessage || "Failed to fetch user info");
      }
    });

  program.addCommand(auth);
}
