<pre align="center">
██████╗ ███████╗███████╗██╗   ██╗███╗   ██╗ ██████╗
██╔══██╗██╔════╝██╔════╝╚██╗ ██╔╝████╗  ██║██╔════╝
█████╔╝█████╗  ███████╗ ╚████╔╝ ██╔██╗ ██║██║     
██╔══██╗██╔══╝  ╚════██║  ╚██╔╝  ██║╚██╗██║██║     
██║  ██║███████╗███████║   ██║   ██║ ╚████║╚██████╗
╚═╝  ╚═╝╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═══╝ ╚═════╝ 
  ── track • journal • execute ──
</pre>


Resync is a private, self-hosted goal tracking app. Track goals, journal daily, and stay focused — 100% local, your data stays on your machine.

<p align="center">
  <a href="https://www.youtube.com/watch?v=CZeahoMetQ8" target="_blank" rel="noopener">
    <img src="https://raw.githubusercontent.com/TejasS1233/Resync/main/client/public/Screenshot%202025-11-28%20163510.png" alt="Watch the Website Demo" />
  </a>
</p>

_Click the image to watch the website demo on YouTube._

## [Resync CLI](https://www.npmjs.com/package/resync-cli)

The **Resync CLI** is a command-line interface for managing goals, notes, and focus sessions directly from the terminal. It provides a fast, lightweight, and scriptable way to interact with the Resync goal tracking system without leaving the development environment.

### Key Features

- **Terminal-first workflow:** Add, update, and track goals without switching to a browser
- **Interactive TUI Mode:** Full-featured text-based dashboard with live updates and navigation
- **Background Daemon:** Scheduled CLI reminders that run independently in the background
- **Offline SQLite Mode:** Full offline capability with automatic sync when online
- **Automation-friendly:** Integrate into scripts, cron jobs, or CI pipelines for automated tracking
- **Interactive prompts:** Guided commands using Inquirer for smooth user experience
- **Readable output:** Color-coded tables, progress bars, and spinners provide clear feedback
- **Cross-platform:** Compatible with Windows, macOS, and Linux
- **CLI-specific commands:** Terminal-native goal management, stats viewing, and focus session tracking
- **Configurable & secure:** JWT authentication with persistent token management

For developers and users who prefer lightweight, scriptable, and organized goal tracking.

![Resync_terminal_demo (1)](https://github.com/user-attachments/assets/4891b89a-86e0-4411-b668-1ac5941aa198)

### Installation

Install the CLI globally via npm:

```bash
npm install -g resync-cli
```

#### Complete CLI Documentation: [app/cli/README.md](app/cli/README.md)

## New: Docker Setup

Run Resync locally with one command (100% private, SQLite-based):

```bash
# Build and run
docker build -t resync . && docker run -d -p 3000:3000 --name resync resync
```

Open http://localhost:3000

### With Persistent Data

```bash
docker run -d -p 3000:3000 -v resync_data:/app/data --name resync resync
```

## Structure

```
Resync/
├── app/
│   ├── api/       # Express + SQLite server
│   ├── web/       # React UI
│   └── cli/       # CLI tool
├── lib/          # Shared database layer
├── data/         # SQLite database
└── Dockerfile    # Single container build
```

---

<p align="center">
<strong><em>Small steps. Clean habits. Resync.</em></strong>
</p>