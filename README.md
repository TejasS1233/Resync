# Resync

A full-stack MERN application for tracking goals, habits, and daily progress with calendar views and activity heatmaps.

## Features

- Goal tracking with custom categories and frequencies
- Guest mode with localStorage or full authentication
- Calendar view showing daily progress
- GitHub-style activity heatmap
- Daily journaling with mood tracking
- Real-time statistics and progress visualization
- Command-line interface for terminal-based tracking


## Stack

**Backend:** Node.js, Express, MongoDB  
**Frontend:** React, Vite, shadcn/ui, Lucide icons  
**CLI:** Node.js, Commander, Inquirer, Axios

## Usage

### Web Application

1. Visit landing page or use guest mode
2. Create goals with frequency (daily/weekly/monthly)
3. Track progress with +/- buttons
4. View calendar and activity heatmap
5. Write daily notes with mood tracking

### CLI Tool

Install the Resync CLI globally via npm:

```bash
npm install -g resync-cli
```

Quick start:

```bash
# Configure for production
resync config set-url

# Login or register
resync auth login

# Start tracking
resync goals add
resync goals list
resync stats summary
resync focus start
```

**Available Commands:**

- `resync auth` - Authentication (login, register, logout, whoami)
- `resync goals` - Goal management (add, list, check, delete)
- `resync notes` - Daily notes with mood tracking
- `resync stats` - Statistics and dashboard
- `resync focus` - Pomodoro timer and focus sessions
- `resync config` - Configuration management

**Links:**

- npm Package: https://www.npmjs.com/package/resync-cli
- CLI Documentation: [cli/README.md](cli/README.md)

**Development:**

```bash
cd cli
npm install
npm link
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

ISC
