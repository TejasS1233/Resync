import chalk from "chalk";
import boxen from "boxen";

export function displaySuccess(message) {
  console.log(chalk.green(`\n✔ ${message}\n`));
}

export function displayError(message) {
  console.error(chalk.red(`\n✖ ${message}\n`));
}

export function displayInfo(message) {
  console.log(chalk.cyan(`\nℹ ${message}\n`));
}

export function displayWarning(message) {
  console.log(chalk.yellow(`\n⚠ ${message}\n`));
}

export function displayBox(content, title) {
  console.log(
    boxen(content, {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "cyan",
      title: title,
      titleAlignment: "center",
    })
  );
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date) {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getProgressBar(percentage, width = 20) {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);

  let color = chalk.red;
  if (percentage >= 75) color = chalk.green;
  else if (percentage >= 50) color = chalk.yellow;

  return color(bar) + ` ${percentage.toFixed(0)}%`;
}
