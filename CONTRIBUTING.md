# Contributing

Thanks for your interest in contributing to Resync! We appreciate all contributions, big or small.

## Table of Contents

[Prerequisites](#prerequisites) • [Getting Started](#getting-started) • [Environment Setup](#environment-setup) • [Development](#development) • [Commit Conventions](#commit-conventions) • [Pull Requests](#pull-requests)

## Prerequisites

- **Node.js** (v18+) - [Download](https://nodejs.org/)
- **npm** (v9+) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **MongoDB** - [Local](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas) (recommended)

## Getting Started

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
3. Set up environment variables (see below)
4. Create a branch: `git checkout -b feature/your-feature-name`

## Environment Setup

**server/.env:**

```bash
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret_key
```

**client/.env:**

```bash
VITE_API_URL=http://localhost:8000/api
```

**MongoDB Setup:**

- Local: Use `mongodb://localhost:27017/resync`
- Atlas: Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), get connection string from "Connect" → "Connect your application"

## Development

Start servers in separate terminals:

```bash
# Terminal 1 - Backend
cd server && npm start

# Terminal 2 - Frontend
cd client && npm run dev

# Terminal 3 - CLI (optional)
cd cli && npm install && npm link
resync --help
```

Backend: `http://localhost:8000` | Frontend: `http://localhost:3000`

**Code Quality:**

```bash
cd client
npm run lint                    # Linting
npx prettier --write .          # Formatting
```

**CLI Development:**

```bash
cd cli
npm link                        # Link for global use
resync --help                   # Test commands
npm unlink -g resync-cli        # Unlink when done
```

## Commit Conventions

Follow Conventional Commits: `<type>(<scope>): <description>`

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`

**Examples:**

```bash
feat(goals): add weekly goal frequency option
fix(calendar): resolve date rendering issue
docs: update installation instructions
```

**Breaking changes:** Add `!` after type/scope: `feat(api)!: change response format`

## Pull Requests

- Keep PRs focused on a single feature or fix
- Include clear descriptions and screenshots for UI changes
- Reference related issues: `Fixes #123`
- Test both guest mode and authenticated mode
- Ensure linting passes

## Project Structure

```
📁 Resync
├── 📁 client          — React frontend (Vite, shadcn/ui)
│   ├── 📁 public      — Static assets
│   └── 📁 src
│       ├── api        — API client
│       ├── assets     — Images, icons
│       ├── components — UI components (includes ui/ for shadcn)
│       ├── context    — React context providers
│       ├── lib        — Utilities
│       ├── App.jsx    — Main app component
│       └── main.jsx   — Entry point
│
├── 📁 server          — Express backend
│   ├── controllers    — Route controllers
│   ├── models         — MongoDB models
│   ├── routes         — API routes
│   ├── middleware     — Custom middleware
│   └── server.js      — Server entry point
│
└── 📁 cli             — Command-line interface
    ├── bin            — CLI entry point
    ├── commands       — Command modules
    ├── lib            — API client & utilities
    └── package.json   — CLI dependencies
```

## Common Issues

**MongoDB Connection Error:** Verify `MONGODB_URI`, check service is running, whitelist IP in Atlas

**CORS Issues:** Verify `VITE_API_URL` matches backend URL

**Port in Use:** Change `PORT` in server `.env` and update client `.env`

## Need Help?

Open an issue if you have questions. We're here to help!

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
