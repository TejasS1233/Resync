# Resync CLI

Command-line interface for Resync goal tracking application.

## Installation

```bash
npm install -g resync-cli
```

Or install from source:

```bash
git clone https://github.com/TejasS1233/Resync.git
cd Resync/cli
npm install
npm link
```

## Quick Start

```bash
# Configure API URL
resync config set-url

# Create account or login
resync auth register
resync auth login

# Start tracking
resync goals add
resync goals list
```

## Configuration

### Set API URL

```bash
# Interactive selection
resync config set-url

# Direct URL
resync config set-url --url https://resync-pvu5.onrender.com/api

# View current config
resync config show

# Reset to defaults
resync config reset
```

**Production URL:** https://resync-pvu5.onrender.com/api  
**Local Development:** http://localhost:8000/api

## Commands

### Authentication

**Register new account**

```bash
resync auth register
```

**Login**

```bash
resync auth login
```

**View current user**

```bash
resync auth whoami
```

**Logout**

```bash
resync auth logout
```

### Goals

**List all goals**

```bash
resync goals list
resync goals ls

# Filter by category
resync goals list --filter Health

# Include inactive goals
resync goals list --all
```

**Add new goal**

```bash
resync goals add
```

Interactive wizard prompts for:

- Title
- Description
- Frequency (daily/weekly/monthly)
- Target count
- Category
- Optional end date

**Update progress**

```bash
resync goals check
```

Select a goal and increment/decrement progress.

**Delete goal**

```bash
resync goals delete
resync goals rm
```

### Notes

**Add daily note**

```bash
# Interactive mode
resync notes add

# Use system editor
resync notes add --editor
```

**List recent notes**

```bash
resync notes list
resync notes ls

# Limit results
resync notes list --limit 20
```

**View specific note**

```bash
# View today's note
resync notes view

# View by date
resync notes view 2024-01-15
```

### Statistics

**Dashboard summary**

```bash
resync stats summary
resync stats dash
```

Shows:

- Total and active goals
- Overall progress
- Recent notes and moods
- Motivational messages

**Detailed goal statistics**

```bash
resync stats goals
```

Shows breakdown by frequency and category.

### Focus Timer

**Pomodoro session**

```bash
# Default: 25min work, 5min break, 4 cycles
resync focus start

# Custom settings
resync focus start --duration 30 --break 10 --long-break 20 --cycles 4
```

**Simple countdown timer**

```bash
resync focus timer 15
```

Starts a 15-minute countdown timer.

## Features

- Secure JWT authentication with automatic token management
- Beautiful table displays for goals and notes
- Color-coded output for better readability
- Loading spinners for async operations
- System editor integration for note-taking
- Built-in Pomodoro timer with visual progress
- Progress bars for goal tracking
- Graceful error handling

## Environment Variables

Override API URL temporarily:

**Unix/Linux/macOS:**

```bash
export API_URL=https://resync-pvu5.onrender.com/api
resync auth login
```

**Windows PowerShell:**

```powershell
$env:API_URL = "https://resync-pvu5.onrender.com/api"
resync auth login
```

**Windows CMD:**

```cmd
set API_URL=https://resync-pvu5.onrender.com/api
resync auth login
```

## Configuration Storage

Config and tokens are stored in:

- **Windows:** `%APPDATA%\resync-cli-nodejs`
- **macOS:** `~/Library/Preferences/resync-cli-nodejs`
- **Linux:** `~/.config/resync-cli-nodejs`

## Troubleshooting

### Command not found

```bash
npm link
```

### Connection errors

Ensure backend is accessible:

```bash
curl https://resync-pvu5.onrender.com/api/health
```

Production server may take 30-60 seconds on first request (cold start).

### Authentication issues

```bash
resync auth logout
resync auth login
```

### Wrong API URL

```bash
resync config reset
resync config set-url
```

## Development

```bash
# Clone repository
git clone https://github.com/TejasS1233/Resync.git
cd Resync/cli

# Install dependencies
npm install

# Link for testing
npm link

# Unlink
npm unlink -g resync-cli
```

## Tech Stack

- **commander** - CLI framework
- **inquirer** - Interactive prompts
- **axios** - HTTP client
- **chalk** - Terminal colors
- **conf** - Configuration storage
- **ora** - Loading spinners
- **boxen** - Terminal boxes
- **cli-table3** - Table formatting

## Requirements

- Node.js v18 or higher
- npm v9 or higher

## Links

- **Production API:** https://resync-pvu5.onrender.com/api
- **Web App:** https://resync-sh.vercel.app
- **GitHub:** https://github.com/TejasS1233/Resync

## License

ISC

## Support

For issues and questions, open an issue on GitHub.
