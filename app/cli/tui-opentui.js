#!/usr/bin/env node

import { createCliRenderer, Box, Text } from "@opentui/core";
import api, { isAuthenticated, getUser, clearAuth } from "./lib/api.js";

let renderer = null;
let currentView = 0;
const views = ["Dashboard", "Goals", "Notes", "Stats", "Focus"];

let goals = [];
let notes = [];
let stats = { totalGoals: 0, completedToday: 0, streak: 0 };
let selectedIndex = 0;
let commandInput = "";
let commandHistory = [];
let historyIndex = -1;
let output = null;
let showOutput = false;
let inputActive = false;

function useDemoData() {
  goals = [
    { _id: "1", title: "Exercise", currentProgress: { percentage: 90 }, category: "daily" },
    { _id: "2", title: "Read", currentProgress: { percentage: 70 }, category: "daily" },
    { _id: "3", title: "Meditate", currentProgress: { percentage: 90 }, category: "daily" },
    { _id: "4", title: "Code", currentProgress: { percentage: 30 }, category: "daily" },
  ];
  stats = { totalGoals: 4, streak: 7, completionRate: 89, completedToday: 3 };
  notes = [
    { content: "Great day! Completed all goals.", _id: "1" },
    { content: "Worked on the new TUI feature.", _id: "2" },
  ];
}

async function fetchData() {
  if (!isAuthenticated()) {
    useDemoData();
    return;
  }
  
  try {
    const goalsRes = await Promise.race([
      api.get("/goals"),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000)),
    ]);
    goals = goalsRes.data.data || [];
    const statsRes = await api.get("/goals/stats");
    stats = statsRes.data.data || {};
    const notesRes = await api.get("/notes");
    notes = notesRes.data.data || [];
  } catch (err) {
    useDemoData();
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
        Text({ content: ` ${bar} ${pct}%`, fg: isSelected ? "#c0caf5" : "#a9b1d6", bold: isSelected }),
        Text({ content: ` ${goal.title || ""}`, fg: isSelected ? "#c0caf5" : "#a9b1d6" })
      );
    }),
    goals.length === 0 ? Text({ content: "No goals. Type 'goals add <title>'", fg: "#565f89" }) : null
  );
};

const renderNotes = () => {
  return Box({ flexDirection: "column", gap: 1 },
    Text({ content: "NOTES", fg: "#e0af68", bold: true }),
    Text({ content: "" }),
    ...notes.slice(0, 10).map((note, i) => {
      const isSelected = i === selectedIndex;
      return Box({ backgroundColor: isSelected ? "#1a1b26" : "transparent", padding: 1 },
        Text({ content: note.content?.slice(0, 70) || "(empty)", fg: isSelected ? "#c0caf5" : "#a9b1d6" })
      );
    }),
    notes.length === 0 ? Text({ content: "No notes.", fg: "#565f89" }) : null
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
    Text({ content: "Space to Start", fg: "#565f89" }),
    Text({ content: `Session ${pomodoro.sessions + 1}/6 today`, fg: "#7aa2f7" })
  );
};

const viewRenderers = [renderDashboard, renderGoals, renderNotes, renderStats, renderFocus];

async function render() {
  const screen = renderer.root;
  const user = getUser();
  const isAuth = isAuthenticated();
  
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
        Text({ content: ">", fg: "#7aa2f7", bold: true }),
        Text({ content: "Resync", fg: "#7aa2f7", bold: true }),
        Box({ flexGrow: 1 }),
        Text({ content: ":", fg: "#414868" }),
        Text({ content: "main", fg: "#bb9af7" }),
        Text({ content: " ", fg: "#414868" }),
        Text({ content: isAuth ? user?.name || "User" : "(offline)", fg: "#565f89" })
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
          Text({ content: inputActive ? `> ${commandInput}_` : "Type 'help'", fg: inputActive ? "#9ece6a" : "#565f89" })
        ),
        
        Box({ 
          flexGrow: 1, 
          backgroundColor: "#1e1e2e", 
          padding: 1,
          flexDirection: "column" 
        },
          showOutput && output 
            ? Box({ flexDirection: "column" },
              Text({ content: "OUTPUT", fg: "#f7768e", bold: true }),
              Text({ content: "" }),
              Text({ content: output, fg: "#c0caf5" }),
              Box({ flexGrow: 1 }),
              Text({ content: "[any key to close]", fg: "#565f89" })
            )
            : viewRenderers[currentView]()
        )
      ),
      
      Box({ 
        width: "100%", 
        backgroundColor: "#1a1b26", 
        flexDirection: "row",
        paddingX: 1 
      },
        Text({ content: isAuth ? api.getApiUrl() : "(demo)", fg: "#565f89" }),
        Box({ flexGrow: 1 }),
        Text({ content: "TAB:view UP/DOWN:nav ENTER:select I:input Q:quit", fg: "#565f89" })
      )
    )
  );
  
  renderer.requestRender();
}

async function executeCommand(cmd) {
  const parts = cmd.trim().split(/\s+/);
  const action = parts[0]?.toLowerCase();
  const args = parts.slice(1);
  
  if (!action) return;
  
  if (action === "help" || action === "?") {
    output = `Commands:
  goals list/add/complete/delete
  notes list/add
  auth status/logout
  stats/focus start/config
  r (refresh)
Shortcuts: g n a s f c r
Nav: TAB views UP/DOWN ENTER select
Input: I type, any key close output`;
    showOutput = true;
    await render();
    return;
  }
  
  if (action === "g" || action === "goals") {
    const sub = args[0]?.toLowerCase() || "list";
    
    if (sub === "list") {
      output = goals.map((g, i) => `${i+1}. ${g.title} (${g.currentProgress?.percentage || 0}%)`).join("\n") || "No goals";
    } else if (sub === "add") {
      const title = args.slice(1).join(" ");
      if (!title) { output = "Usage: goals add <title>"; }
      else {
        try { await api.post("/goals", { title, category: "daily", targetCount: 1 }); await fetchData(); output = "Created: " + title; }
        catch (e) { output = e.userMessage || e.message; }
      }
    } else if (sub === "complete") {
      const idx = parseInt(args[1]) - 1;
      if (goals[idx]) {
        try { await api.patch("/goals/" + goals[idx]._id + "/progress", { increment: 1 }); await fetchData(); output = "Done: " + goals[idx].title; }
        catch (e) { output = e.userMessage || e.message; }
      } else output = "Invalid goal #";
    } else if (sub === "delete") {
      const idx = parseInt(args[1]) - 1;
      if (goals[idx]) {
        try { await api.delete("/goals/" + goals[idx]._id); await fetchData(); output = "Deleted: " + goals[idx].title; }
        catch (e) { output = e.userMessage || e.message; }
      } else output = "Invalid goal #";
    } else output = "goals: list|add <title>|complete #|delete #";
    showOutput = true;
    await render();
    return;
  }
  
  if (action === "n" || action === "notes") {
    const sub = args[0]?.toLowerCase() || "list";
    
    if (sub === "list") {
      output = notes.map((n, i) => `${i+1}. ${n.content?.slice(50)}`).join("\n") || "No notes";
    } else if (sub === "add") {
      const content = args.slice(1).join(" ");
      if (!content) { output = "Usage: notes add <text>"; }
      else {
        try { await api.post("/notes", { content }); await fetchData(); output = "Note added"; }
        catch (e) { output = e.userMessage || e.message; }
      }
    } else output = "notes: list|add <text>";
    showOutput = true;
    await render();
    return;
  }
  
  if (action === "a" || action === "auth") {
    const sub = args[0]?.toLowerCase();
    if (sub === "logout") { clearAuth(); await fetchData(); output = "Logged out"; }
    else output = isAuthenticated() ? "Logged: " + (getUser()?.name || getUser()?.email) : "Not logged in";
    showOutput = true;
    await render();
    return;
  }
  
  if (action === "s" || action === "stats") {
    output = `Goals: ${stats.totalGoals} | Today: ${stats.completedToday} | Streak: ${stats.streak} days | Rate: ${stats.completionRate}%`;
    showOutput = true;
    await render();
    return;
  }
  
  if (action === "f" || action === "focus") {
    currentView = 4; output = "Focus mode"; showOutput = true;
    await render();
    return;
  }
  
  if (action === "c" || action === "config") {
    output = "API: " + api.getApiUrl(); showOutput = true;
    await render();
    return;
  }
  
  if (action === "r" || action === "refresh") {
    await fetchData(); output = "Refreshed"; showOutput = true;
    await render();
    return;
  }
  
  output = "Unknown: " + action + ". Type 'help'";
  showOutput = true;
  await render();
}

async function handleKeyPress(key) {
  if (showOutput) { showOutput = false; await render(); return; }
  
  if (inputActive) {
    if (key.name === "return" || key.name === "enter") {
      if (commandInput.trim()) {
        commandHistory.unshift(commandInput);
        await executeCommand(commandInput);
        commandInput = "";
      }
      inputActive = false;
      await render();
      return;
    }
    if (key.name === "escape") { inputActive = false; commandInput = ""; await render(); return; }
    if (key.name === "backspace") { commandInput = commandInput.slice(0, -1); await render(); return; }
    if (key.key) { commandInput += key.key; await render(); }
    return;
  }
  
  const name = key.name?.toLowerCase();
  
  if (name === "q" || (key.ctrl && name === "c")) {
    console.log("\nBye!");
    renderer.destroy();
    process.exit(0);
  }
  
  if (name === "i") { inputActive = true; await render(); return; }
  
  if (name === "tab") { currentView = (currentView + 1) % views.length; selectedIndex = 0; await render(); return; }
  
  if (name === "up" || name === "k") { selectedIndex = Math.max(0, selectedIndex - 1); await render(); return; }
  
  if (name === "down" || name === "j") { 
    const max = currentView === 1 ? goals.length - 1 : notes.length - 1;
    selectedIndex = Math.min(max || 0, selectedIndex + 1); await render(); return; 
  }
  
  if (name === "return" || name === "enter") {
    if (currentView === 1 && goals[selectedIndex]) {
      try { await api.patch("/goals/" + goals[selectedIndex]._id + "/progress", { increment: 1 }); await fetchData(); }
      catch (e) { output = e.userMessage || e.message; showOutput = true; }
    }
    await render();
  }
}

async function main() {
  await fetchData();
  renderer = await createCliRenderer();
  renderer.keyInput.on("keypress", handleKeyPress);
  await render();
}

main().catch(err => { console.error(err.message); process.exit(1); });

export default main;