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

## Quick Start (One Command)

```bash
docker run -d -p 3000:3000 --name resync tejas1233/resync:latest
```

Open http://localhost:3000 and create your account!

---

## Docker Hub

**Image:** `tejas1233/resync:latest`

```bash
# Run the container
docker run -d -p 3000:3000 --name resync tejas1233/resync:latest

# Stop
docker stop resync

# Remove
docker rm resync

# With persistent data
docker run -d -p 3000:3000 -v resync_data:/app/data --name resync tejas1233/resync:latest
```

---

## Features

- **Goals:** Track daily/weekly/monthly habits
- **Journal:** Daily notes with mood tracking
- **Focus:** Pomodoro timer
- **CLI:** Terminal app (`npm install -g resync-cli`)
- **100% Private:** All data stored locally (SQLite)
- **No setup required:** Single container, one command

---

## Environment

| Port | URL |
|------|-----|
| 3000 | http://localhost:3000 |
| API | http://localhost:3000/api |
| DB | SQLite (auto-created in container) |

---

## Development

```bash
# Local development
cd app/api && npm install && node server.js

# Terminal 2: Web
cd app/web && npm install && npm run dev
```

---

## CLI Tool

Install the CLI:

```bash
npm install -g resync-cli
```

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Web | React + Vite + Tailwind |
| API | Express + SQLite |
| CLI | Node.js +Blessed |
| Auth | JWT |

---

## License

ISC

---

<p align="center">
<strong><em>Small steps. Clean habits. Resync.</em></strong>
</p>