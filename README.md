# Resync

Private goal tracking. Your data, your machine.

## Quick Start

### Docker (One Command)
```bash
docker build -t resync . && docker run -d -p 3000:3000 --name resync resync
```
Open http://localhost:3000

### Local Development
```bash
# Terminal 1: API
cd app/api && npm install && node server.js

# Terminal 2: Web
cd app/web && npm install && npm run dev
```

## Features

- **Goals** - Track daily/weekly/monthly habits
- **Notes** - Daily journal with mood
- **Focus** - Pomodoro timer
- **CLI** - Terminal app (`npm install -g resync-cli`)

## Tech Stack

| Layer | Tech |
|-------|------|
| Web | React + Vite + Tailwind |
| API | Express + SQLite |
| Auth | JWT |

## Structure

```
app/
├── api/    # Express server
├── web/    # React UI
└── cli/    # CLI tool
data/       # SQLite database
lib/        # Shared database layer
```

## Docker

```bash
# Build
docker build -t resync .

# Run with persistent data
docker run -d -p 3000:3000 -v resync_data:/app/data --name resync resync

# Stop
docker stop resync && docker rm resync
```

---

**Stack:** Node.js + SQLite + React + Docker  
**100% private. 100% local.**