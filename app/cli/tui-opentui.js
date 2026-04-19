#!/usr/bin/env node

import { createCliRenderer, Box, Text } from "@opentui/core";
import api, { isAuthenticated, getUser } from "./lib/api.js";

let renderer = null;
let currentView = 0;
const views = ["Dashboard", "Goals", "Notes", "Stats", "Focus"];

let goals = [];
let notes = [];
let stats = { totalGoals: 0, completedToday: 0, streak: 0 };
let selectedIndex = 0;

async function fetchData() {
  try {
    const [goalsRes, statsRes, notesRes] = await Promise.all([
      api.get("/goals"),
      api.get("/goals/stats"),
      api.get("/notes"),
    ]);
    goals = goalsRes.data.data || [];
    stats = statsRes.data.data || {};
    notes = notesRes.data.data || [];
  } catch (err) {
    console.error("Failed to fetch data:", err.userMessage || err.message);
  }
}

const renderDashboard = () => {
  return Box({ flexDirection: "column", gap: 1 },
    Box({ flexDirection: "row", gap: 2 },
      Box({ width: "30%", backgroundColor: "#1a1b26", padding: 1, flexDirection: "column" },
        Text({ content: "OVERVIEW", fg: "#7aa2f7", bold: true }),
        Text({ content: "" }),
        Text({ content: `Goals: ${stats.totalGoals || 0}`, fg: "#9ece6a" }),
        Text({ content: `Notes: ${notes.length}`, fg: "#e0af68" }),
        Text({ content: `Streak: ${stats.streak || 0} days`, fg: "#bb9af7" }),
        Text({ content: `Completed: ${stats.completionRate || 0}%`, fg: "#73daca" }),
      ),
      Box({ flexGrow: 1, backgroundColor: "#1a1b26", padding: 1, flexDirection: "column" },
        Text({ content: "TODAY'S PROGRESS", fg: "#7aa2f7", bold: true }),
        Text({ content: "" }),
        ...goals.slice(0, 5).map(goal => {
          const pct = goal.currentProgress?.percentage || 0;
          const bar = "█".repeat(Math.floor(pct / 10)) + "░".repeat(10 - Math.floor(pct / 10));
          return Text({ content: `[${bar}] ${pct}% ${goal.title?.slice(0, 15) || ""}`, fg: pct >= 50 ? "#9ece6a" : "#f7768e" });
        })
      )
    )
  );
};

const renderGoals = () => {
  return Box({ flexDirection: "column", gap: 1 },
    Text({ content: "GOALS", fg: "#9ece6a", bold: true }),
    Text({ content: "" }),
    ...goals.map((goal, i) => {
      const pct = goal.currentProgress?.percentage || 0;
      const isSelected = i === selectedIndex;
      const bar = "█".repeat(Math.floor(pct / 10)) + "░".repeat(10 - Math.floor(pct / 10));
      return Box({ backgroundColor: isSelected ? "#1a1b26" : "transparent", paddingX: 1 },
        Text({ content: isSelected ? "[*]" : "[ ]", fg: isSelected ? "#9ece6a" : "#414868" }),
        Text({ content: ` ${bar} ${pct}% ${goal.title || ""}`, fg: isSelected ? "#c0caf5" : "#a9b1d6", bold: isSelected })
      );
    }),
    goals.length === 0 ? Text({ content: "No goals yet. Press N to create one.", fg: "#565f89" }) : null
  );
};

const renderNotes = () => {
  return Box({ flexDirection: "column", gap: 1 },
    Text({ content: "NOTES", fg: "#e0af68", bold: true }),
    Text({ content: "" }),
    ...notes.slice(0, 10).map(note => 
      Box({ backgroundColor: "#1a1b26", padding: 1 },
        Text({ content: note.content?.slice(0, 60) || "(empty)", fg: "#a9b1d6" })
      )
    ),
    notes.length === 0 ? Text({ content: "No notes yet.", fg: "#565f89" }) : null
  );
};

const renderStats = () => {
  return Box({ flexDirection: "column", gap: 1 },
    Text({ content: "STATISTICS", fg: "#bb9af7", bold: true }),
    Text({ content: "" }),
    Box({ flexDirection: "row", gap: 2 },
      Box({ width: "25%", backgroundColor: "#1a1b26", padding: 1 },
        Text({ content: "Goals", fg: "#7aa2f7" }),
        Text({ content: `${stats.totalGoals || 0}`, fg: "#9ece6a", bold: true }),
      ),
      Box({ width: "25%", backgroundColor: "#1a1b26", padding: 1 },
        Text({ content: "Streak", fg: "#7aa2f7" }),
        Text({ content: `${stats.streak || 0} days`, fg: "#e0af68", bold: true }),
      ),
      Box({ width: "25%", backgroundColor: "#1a1b26", padding: 1 },
        Text({ content: "Completion", fg: "#7aa2f7" }),
        Text({ content: `${stats.completionRate || 0}%`, fg: "#73daca", bold: true }),
      )
    ),
    Box({ marginTop: 1, backgroundColor: "#1a1b26", padding: 1 },
      Text({ content: "COMPLETED TODAY", fg: "#7aa2f7", bold: true }),
      Text({ content: `${stats.completedToday || 0}`, fg: "#9ece6a", bold: true })
    )
  );
};

const renderFocus = () => {
  const pomodoro = stats.pomodoro || { sessions: 0, timeLeft: 25 * 60 };
  const mins = Math.floor(pomodoro.timeLeft / 60);
  const secs = pomodoro.timeLeft % 60;
  return Box({ 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center",
    flexGrow: 1 
  },
    Text({ content: "POMODORO", fg: "#f7768e", bold: true }),
    Text({ content: "" }),
    Text({ content: `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`, fg: "#9ece6a", bold: true }),
    Text({ content: "" }),
    Text({ content: "Space to Start/Pause", fg: "#565f89" }),
    Text({ content: `Session ${pomodoro.sessions + 1}/6 today`, fg: "#7aa2f7" })
  );
};

const viewRenderers = [renderDashboard, renderGoals, renderNotes, renderStats, renderFocus];

async function render() {
  const screen = renderer.root;
  const user = getUser();
  
  screen.children = [];
  
  screen.add(
    Box({ width: "100%", height: "100%", flexDirection: "column" },
      Box({ 
        width: "100%", 
        backgroundColor: "#1a1b26", 
        flexDirection: "row",
        paddingX: 1,
        gap: 1
      },
        Text({ content: "Resync", fg: "#7aa2f7", bold: true }),
        Text({ content: "-", fg: "#565f89" }),
        Text({ content: views[currentView], fg: "#c0caf5" }),
        Box({ flexGrow: 1 }),
        Text({ content: user?.name || "User", fg: "#565f89" }),
        Text({ content: " TAB ", fg: "#414868" }),
        Text({ content: "Q quit", fg: "#565f89" })
      ),
      
      Box({ width: "100%", flexGrow: 1, flexDirection: "row" },
        Box({ 
          width: 20, 
          backgroundColor: "#1a1b26", 
          flexDirection: "column",
          gap: 0,
          paddingY: 1
        },
          ...views.map((view, i) => 
            Text({ 
              content: currentView === i ? `[*] ${view}` : `[ ] ${view}`, 
              fg: currentView === i ? ["#7aa2f7", "#9ece6a", "#e0af68", "#bb9af7", "#f7768e"][i] : "#414868" 
            })
          ),
          Box({ flexGrow: 1 }),
          Text({ content: "N new goal", fg: "#414868" }),
          Text({ content: "Enter complete", fg: "#414868" }),
          Text({ content: "D delete", fg: "#414868" })
        ),
        
        Box({ 
          flexGrow: 1, 
          backgroundColor: "#1e1e2e", 
          padding: 1,
          flexDirection: "column" 
        },
          viewRenderers[currentView]()
        )
      ),
      
      Box({ 
        width: "100%", 
        backgroundColor: "#1a1b26", 
        flexDirection: "row",
        paddingX: 1 
      },
        Text({ content: api.getApiUrl(), fg: "#565f89" }),
        Box({ flexGrow: 1 }),
        Text({ content: "TAB switch | UP/DOWN navigate | ENTER complete | D delete | Q quit", fg: "#565f89" })
      )
    )
  );
  
  renderer.requestRender();
}

async function handleKeyPress(key) {
  const name = key.name?.toLowerCase();
  
  if (name === "q") {
    console.log("\nGoodbye!");
    renderer.destroy();
    process.exit(0);
  }
  
  if (name === "tab") {
    currentView = (currentView + 1) % views.length;
    selectedIndex = 0;
    await render();
    return;
  }
  
  if (name === "up" || name === "k") {
    selectedIndex = Math.max(0, selectedIndex - 1);
    await render();
    return;
  }
  
  if (name === "down" || name === "j") {
    const maxIndex = currentView === 1 ? goals.length - 1 : notes.length - 1;
    selectedIndex = Math.min(maxIndex || 0, selectedIndex + 1);
    await render();
    return;
  }
  
  if (name === "return" || name === "enter") {
    if (currentView === 1 && goals[selectedIndex]) {
      const goal = goals[selectedIndex];
      try {
        await api.patch(`/goals/${goal._id}/progress`, { increment: 1 });
        await fetchData();
        await render();
      } catch (err) {
        console.error("Error:", err.userMessage || err.message);
      }
    }
    return;
  }
  
  if (name === "d" && currentView === 1 && goals[selectedIndex]) {
    const goal = goals[selectedIndex];
    try {
      await api.delete(`/goals/${goal._id}`);
      await fetchData();
      selectedIndex = Math.min(selectedIndex, goals.length - 1);
      await render();
    } catch (err) {
      console.error("Error:", err.userMessage || err.message);
    }
    return;
  }
  
  if (name === "n" && currentView === 1) {
    console.log("\nComing soon: Create goal dialog");
    return;
  }
  
  await render();
}

async function main() {
  if (!isAuthenticated()) {
    console.error("Not logged in. Run: resync auth login");
    process.exit(1);
  }
  
  renderer = await createCliRenderer();
  
  console.log("Resync OpenTUI");
  console.log("TAB: switch view | UP/DOWN: navigate | ENTER: complete | D: delete | Q: quit");
  
  await fetchData();
  
  renderer.keyInput.on("keypress", handleKeyPress);
  await render();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});