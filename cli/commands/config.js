import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import { getApiUrl, setApiUrl } from "../lib/api.js";
import { displaySuccess, displayInfo, displayBox } from "../lib/utils.js";

export function registerConfigCommands(program) {
  const config = new Command("config");
  config.description("Manage CLI configuration");

  // View current config
  config
    .command("show")
    .description("Show current configuration")
    .action(() => {
      const apiUrl = getApiUrl();

      const content = [
        `${chalk.bold("API URL:")} ${apiUrl}`,
        "",
        chalk.dim("Environment variable API_URL takes precedence if set"),
      ].join("\n");

      displayBox(content, "⚙️  Configuration");
    });

  // Set API URL
  config
    .command("set-url")
    .description("Set the API URL")
    .option("-u, --url <url>", "API URL")
    .action(async (options) => {
      try {
        let url = options.url;

        if (!url) {
          const answers = await inquirer.prompt([
            {
              type: "list",
              name: "preset",
              message: "Choose API URL:",
              choices: [
                {
                  name: "Production (https://resync-pvu5.onrender.com/api)",
                  value: "production",
                },
                {
                  name: "Local Development (http://localhost:8000/api)",
                  value: "local",
                },
                { name: "Custom URL", value: "custom" },
              ],
            },
          ]);

          if (answers.preset === "production") {
            url = "https://resync-pvu5.onrender.com/api";
          } else if (answers.preset === "local") {
            url = "http://localhost:8000/api";
          } else {
            const customAnswer = await inquirer.prompt([
              {
                type: "input",
                name: "customUrl",
                message: "Enter custom API URL:",
                validate: (input) => {
                  if (!input) return "URL is required";
                  try {
                    new URL(input);
                    return true;
                  } catch {
                    return "Please enter a valid URL";
                  }
                },
              },
            ]);
            url = customAnswer.customUrl;
          }
        }

        // Ensure URL doesn't end with slash
        url = url.replace(/\/$/, "");

        setApiUrl(url);
        displaySuccess(`API URL set to: ${chalk.cyan(url)}`);
        displayInfo("Restart any running commands for changes to take effect");
      } catch (error) {
        console.error(chalk.red("\n✖ Failed to set API URL"));
      }
    });

  // Reset to default
  config
    .command("reset")
    .description("Reset configuration to defaults")
    .action(async () => {
      try {
        const { confirm } = await inquirer.prompt([
          {
            type: "confirm",
            name: "confirm",
            message: "Reset configuration to defaults?",
            default: false,
          },
        ]);

        if (confirm) {
          setApiUrl("http://localhost:8000/api");
          displaySuccess("Configuration reset to defaults");
        }
      } catch (error) {
        console.error(chalk.red("\n✖ Failed to reset configuration"));
      }
    });

  program.addCommand(config);
}
