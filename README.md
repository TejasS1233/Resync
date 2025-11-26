# Cadence

A full-stack MERN application for tracking goals, habits, and daily progress with calendar views and activity heatmaps.

## Features

- Goal tracking with custom categories and frequencies
- Guest mode with localStorage or full authentication
- Calendar view showing daily progress
- GitHub-style activity heatmap
- Daily journaling with mood tracking
- Real-time statistics and progress visualization

## Stack

**Backend:** Node.js, Express, MongoDB  
**Frontend:** React, Vite, shadcn/ui, Lucide icons

## Setup

```bash
# Install dependencies
cd server && npm install
cd client && npm install

# Run servers (separate terminals)
cd server && npm start
cd client && npm run dev
```

Server: http://localhost:8000  
Client: http://localhost:3000

## Environment

**server/.env**

```
PORT=8000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

**client/.env**

```
VITE_API_URL=http://localhost:8000/api
```

## Usage

1. Visit landing page or use guest mode
2. Create goals with frequency (daily/weekly/monthly)
3. Track progress with +/- buttons
4. View calendar and activity heatmap
5. Write daily notes with mood tracking
