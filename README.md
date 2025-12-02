<p align="center"><img width="804" height="341" alt="image" src="https://github.com/user-attachments/assets/cca995c9-520a-4ef9-811e-0c703a6ef16c" />
</p>

<p align="center">
  <img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,react,vite,git,github,vercel&perline=10" alt="Tech Stack" />
</p>

## [Resync - Web App](https://resync-sh.vercel.app/)

Resync is a sleek, full-stack goal tracking web app with a dark, modern UI and smooth animations. It helps users visualize progress, track habits, and reflect daily, all in a responsive, installable Progressive Web App with advanced productivity features.

## Highlights

- **Visual dashboards:** Calendar view, activity heatmap, and advanced analytics with trend charts
- **Daily journaling** with mood tracking and correlation insights
- **Command Palette (⌘K):** Quick search and navigation across all goals and notes
- **Keyboard shortcuts:** 18+ shortcuts for power users (⌘N, ⌘/, Ctrl+Enter, etc.)
- **Focus Mode:** Distraction-free work environment with ambient effects
- **Zen Mode with Pomodoro:** Full-screen timer with customizable intervals and goal tracking
- **Smart Notifications:** Browser and PWA notifications with customizable reminders
- **PWA installable** with **offline support**
- **Responsive and accessible** across devices

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

#### Complete CLI Documentation: [cli/README.md](cli/README.md)

## Roadmap

### Core Features (Complete ✅)

- [x] Goal tracking with categories & frequencies
- [x] Dashboard stats, calendar, heatmap
- [x] Daily journaling + mood tracking
- [x] Authentication + guest mode
- [x] PWA install & offline support
- [x] CLI tool (auth, goals, notes, stats, focus)

---

### Productivity Enhancements (Complete ✅)

- [x] **Command Palette** + global search (⌘K)
- [x] **Keyboard shortcuts** (18+ shortcuts: ⌘K, ⌘N, ⌘/, Ctrl+Enter, etc.)
- [x] **Notification system** (browser + PWA with customizable reminders)
- [x] **Focus Mode** (distraction-free UI with ambient effects)
- [x] **Zen Mode with Pomodoro** (full-screen timer integrated with goal tracking)
- [x] **Advanced Analytics** (trends, mood correlation, category performance)

---

### CLI Advanced Features (Complete ✅)

- [x] **TUI mode** (interactive text-based dashboard with blessed)
- [x] **Background daemon** (scheduled CLI-based reminders running independently)
- [x] **Offline SQLite database** (full offline mode with sync queue)

---

### Next Phase (In Progress)

- [ ] Real-time sync improvements for multi-device use
- [ ] Plugin system for custom CLI commands
- [ ] Data export functionality (CSV, JSON)
- [ ] Enhanced data visualization options

---

### Optional Pro Features (Future)

- [ ] Stripe billing integration
- [ ] Extended history (beyond 1 year)
- [ ] API keys for external integrations
- [ ] Webhooks for automations
- [ ] Encrypted cloud backups

---

**Progress: 9/15 roadmap items complete (60%)** XD

---

<p align="center">
  <strong><em>Small steps. Clean habits. Resync.</em></strong>
</p>
