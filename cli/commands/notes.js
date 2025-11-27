import { Command } from "commander";
import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import Table from "cli-table3";
import { spawn } from "child_process";
import { writeFileSync, unlinkSync, readFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import api, { isAuthenticated } from "../lib/api.js";
import {
  displaySuccess,
  displayError,
  displayInfo,
  formatDateTime,
} from "../lib/utils.js";

function requireAuth() {
  if (!isAuthenticated()) {
    displayError('You must be logged in. Use "resync auth login" to login.');
    process.exit(1);
  }
}

function openEditor(initialContent = "") {
  return new Promise((resolve, reject) => {
    const editor = process.env.EDITOR || process.env.VISUAL || "notepad";
    const tempFile = join(tmpdir(), `resync-note-${Date.now()}.md`);

    writeFileSync(tempFile, initialContent);

    const child = spawn(editor, [tempFile], {
      stdio: "inherit",
      shell: true,
    });

    child.on("exit", (code) => {
      if (code === 0) {
        try {
          const content = readFileSync(tempFile, "utf-8");
          unlinkSync(tempFile);
          resolve(content.trim());
        } catch (error) {
          reject(error);
        }
      } else {
        try {
          unlinkSync(tempFile);
        } catch (e) {}
        reject(new Error("Editor closed without saving"));
      }
    });

    child.on("error", (error) => {
      try {
        unlinkSync(tempFile);
      } catch (e) {}
      reject(error);
    });
  });
}

export function registerNoteCommands(program) {
  const notes = new Command("notes");
  notes.description("Manage your daily notes");

  // Add note
  notes
    .command("add")
    .description("Add or update today's note")
    .option("-e, --editor", "Use system editor")
    .action(async (options) => {
      requireAuth();

      try {
        let content;
        let mood;

        if (options.editor) {
          displayInfo("Opening editor... (Save and close to continue)");
          try {
            content = await openEditor(
              "# Daily Note\n\nWrite your thoughts here...\n"
            );
            if (
              !content ||
              content === "# Daily Note\n\nWrite your thoughts here..."
            ) {
              displayInfo("Note cancelled - no content provided");
              return;
            }
          } catch (error) {
            displayError("Failed to open editor or save content");
            return;
          }

          const { moodAnswer } = await inquirer.prompt([
            {
              type: "list",
              name: "moodAnswer",
              message: "How are you feeling today?",
              choices: [
                { name: "😊 Great", value: "great" },
                { name: "🙂 Good", value: "good" },
                { name: "😐 Okay", value: "okay" },
                { name: "😔 Bad", value: "bad" },
                { name: "😢 Terrible", value: "terrible" },
              ],
            },
          ]);
          mood = moodAnswer;
        } else {
          const answers = await inquirer.prompt([
            {
              type: "editor",
              name: "content",
              message: "Write your note (this will open your default editor):",
              validate: (input) => (input ? true : "Note content is required"),
            },
            {
              type: "list",
              name: "mood",
              message: "How are you feeling today?",
              choices: [
                { name: "😊 Great", value: "great" },
                { name: "🙂 Good", value: "good" },
                { name: "😐 Okay", value: "okay" },
                { name: "😔 Bad", value: "bad" },
                { name: "😢 Terrible", value: "terrible" },
              ],
            },
          ]);
          content = answers.content;
          mood = answers.mood;
        }

        const spinner = ora("Saving note...").start();

        const noteData = {
          content,
          mood,
          date: new Date().toISOString().split("T")[0],
        };

        const response = await api.post("/notes", noteData);

        if (response.data.success) {
          spinner.succeed("Note saved successfully!");
          displaySuccess("Your daily note has been recorded");
        }
      } catch (error) {
        ora().fail("Failed to save note");
        displayError(error.userMessage || "Failed to save note");
      }
    });

  // List notes
  notes
    .command("list")
    .alias("ls")
    .description("List recent notes")
    .option("-l, --limit <number>", "Number of notes to show", "10")
    .action(async (options) => {
      requireAuth();

      try {
        const spinner = ora("Fetching notes...").start();

        const response = await api.get("/notes");

        if (response.data.success) {
          let notes = response.data.data;

          spinner.stop();

          if (notes.length === 0) {
            displayInfo('No notes found. Create one with "resync notes add"');
            return;
          }

          // Limit results
          const limit = parseInt(options.limit);
          notes = notes.slice(0, limit);

          const table = new Table({
            head: [
              chalk.cyan("Date"),
              chalk.cyan("Mood"),
              chalk.cyan("Preview"),
            ],
            colWidths: [20, 12, 60],
            wordWrap: true,
          });

          const moodEmojis = {
            great: "😊 Great",
            good: "🙂 Good",
            okay: "😐 Okay",
            bad: "😔 Bad",
            terrible: "😢 Terrible",
          };

          notes.forEach((note) => {
            const preview =
              note.content.length > 100
                ? note.content.substring(0, 100) + "..."
                : note.content;

            table.push([
              formatDateTime(note.date),
              moodEmojis[note.mood] || note.mood,
              preview.replace(/\n/g, " "),
            ]);
          });

          console.log("\n" + table.toString() + "\n");
          displayInfo(`Showing ${notes.length} note(s)`);
        }
      } catch (error) {
        ora().fail("Failed to fetch notes");
        displayError(error.userMessage || "Failed to fetch notes");
      }
    });

  // View specific note
  notes
    .command("view")
    .description("View a specific note by date")
    .argument("[date]", "Date in YYYY-MM-DD format (default: today)")
    .action(async (date) => {
      requireAuth();

      try {
        const targetDate = date || new Date().toISOString().split("T")[0];

        const spinner = ora("Fetching note...").start();

        const response = await api.get(`/notes/${targetDate}`);

        if (response.data.success) {
          const note = response.data.data;
          spinner.stop();

          if (!note) {
            displayInfo(`No note found for ${targetDate}`);
            return;
          }

          const moodEmojis = {
            great: "😊 Great",
            good: "🙂 Good",
            okay: "😐 Okay",
            bad: "😔 Bad",
            terrible: "😢 Terrible",
          };

          console.log("\n" + chalk.cyan("═".repeat(60)));
          console.log(chalk.bold(`Date: ${formatDateTime(note.date)}`));
          console.log(
            chalk.bold(`Mood: ${moodEmojis[note.mood] || note.mood}`)
          );
          console.log(chalk.cyan("═".repeat(60)));
          console.log("\n" + note.content + "\n");
          console.log(chalk.cyan("═".repeat(60)) + "\n");
        }
      } catch (error) {
        ora().fail("Failed to fetch note");
        displayError(error.userMessage || "Failed to fetch note");
      }
    });

  program.addCommand(notes);
}
