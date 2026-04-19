#!/usr/bin/env node

import { createCliRenderer, Box, Text, RootRenderable } from "@opentui/core";

let renderer = null;
const views = ["Dashboard", "Goals", "Notes", "Stats", "Focus"];
let currentView = 0;

const renderDashboard = () => {
  return Box({ flexDirection: "column", gap: 1 },
    Box({ flexDirection: "row", gap: 2 },
      Box({ width: "30%", backgroundColor: "#1a1b26", padding: 1, flexDirection: "column" },
        Text({ content: "OVERVIEW", fg: "#7aa2f7", bold: true }),
        Text({ content: "" }),
        Text({ content: "Goals: 12", fg: "#9ece6a" }),
        Text({ content: "Notes: 48", fg: "#e0af68" }),
        Text({ content: "Streak: 7 days", fg: "#bb9af7" }),
        Text({ content: "Completed: 89%", fg: "#73daca" }),
      ),
      Box({ flexGrow: 1, backgroundColor: "#1a1b26", padding: 1, flexDirection: "column" },
        Text({ content: "TODAY'S PROGRESS", fg: "#7aa2f7", bold: true }),
        Text({ content: "" }),
        Text({ content: "[#########-] 90% Exercise", fg: "#9ece6a" }),
        Text({ content: "[#######---] 70% Read", fg: "#9ece6a" }),
        Text({ content: "[#########-] 90% Meditate", fg: "#9ece6a" }),
        Text({ content: "[###------] 30% Code", fg: "#f7768e" }),
      )
    )
  );
};

const renderGoals = () => {
  return Box({ flexDirection: "column", gap: 1 },
    Text({ content: "GOALS", fg: "#9ece6a", bold: true }),
    Text({ content: "" }),
    Box({ backgroundColor: "#1a1b26", padding: 1 },
      Text({ content: "DAILY", fg: "#f7768e", bold: true }),
      Text({ content: "[#########-] Exercise", fg: "#9ece6a" }),
      Text({ content: "[#########-] Read", fg: "#9ece6a" }),
      Text({ content: "[########--] Meditate", fg: "#9ece6a" }),
    ),
    Box({ backgroundColor: "#1a1b26", padding: 1, marginTop: 1 },
      Text({ content: "WEEKLY", fg: "#f7768e", bold: true }),
      Text({ content: "[######---] Gym", fg: "#e0af68" }),
      Text({ content: "[#######--] Code", fg: "#9ece6a" }),
    ),
    Box({ backgroundColor: "#1a1b26", padding: 1, marginTop: 1 },
      Text({ content: "MONTHLY", fg: "#f7768e", bold: true }),
      Text({ content: "[###------] Run 50km", fg: "#e0af68" }),
      Text({ content: "[####-----] Read 3 books", fg: "#e0af68" })
    )
  );
};

const renderNotes = () => {
  return Box({ flexDirection: "column", gap: 1 },
    Text({ content: "NOTES", fg: "#e0af68", bold: true }),
    Text({ content: "" }),
    Box({ flexGrow: 1, backgroundColor: "#1a1b26", padding: 1 },
      Text({ content: "2026-04-19", fg: "#7aa2f7", bold: true }),
      Text({ content: "Great day! Completed all goals.", fg: "#a9b1d6" }),
      Text({ content: "" }),
      Text({ content: "2026-04-18", fg: "#7aa2f7", bold: true }),
      Text({ content: "Worked on the new TUI feature.", fg: "#a9b1d6" }),
    )
  );
};

const renderStats = () => {
  return Box({ flexDirection: "column", gap: 1 },
    Text({ content: "STATISTICS", fg: "#bb9af7", bold: true }),
    Text({ content: "" }),
    Box({ flexDirection: "row", gap: 2 },
      Box({ width: "25%", backgroundColor: "#1a1b26", padding: 1 },
        Text({ content: "Goals", fg: "#7aa2f7" }),
        Text({ content: "12", fg: "#9ece6a", bold: true }),
      ),
      Box({ width: "25%", backgroundColor: "#1a1b26", padding: 1 },
        Text({ content: "Streak", fg: "#7aa2f7" }),
        Text({ content: "7 days", fg: "#e0af68", bold: true }),
      ),
      Box({ width: "25%", backgroundColor: "#1a1b26", padding: 1 },
        Text({ content: "Completion", fg: "#7aa2f7" }),
        Text({ content: "89%", fg: "#73daca", bold: true }),
      )
    )
  );
};

const renderFocus = () => {
  return Box({ 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center",
    flexGrow: 1 
  },
    Text({ content: "POMODORO", fg: "#f7768e", bold: true }),
    Text({ content: "" }),
    Text({ content: "25:00", fg: "#9ece6a", bold: true }),
    Text({ content: "" }),
    Text({ content: "Press Space to Start", fg: "#565f89" }),
    Text({ content: "Session 4/6 today", fg: "#7aa2f7" })
  );
};

async function renderApp() {
  const screen = renderer.root;
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
        Text({ content: "TAB view Q quit", fg: "#565f89" })
      ),
      
      Box({ width: "100%", flexGrow: 1, flexDirection: "row" },
        Box({ 
          width: 20, 
          backgroundColor: "#1a1b26", 
          flexDirection: "column",
          gap: 0,
          paddingY: 1
        },
          Text({ content: currentView === 0 ? "[*] Dashboard" : "[ ] dashboard", fg: currentView === 0 ? "#7aa2f7" : "#414868" }),
          Text({ content: currentView === 1 ? "[*] Goals" : "[ ] goals", fg: currentView === 1 ? "#9ece6a" : "#414868" }),
          Text({ content: currentView === 2 ? "[*] Notes" : "[ ] notes", fg: currentView === 2 ? "#e0af68" : "#414868" }),
          Text({ content: currentView === 3 ? "[*] Stats" : "[ ] stats", fg: currentView === 3 ? "#bb9af7" : "#414868" }),
          Text({ content: currentView === 4 ? "[*] Focus" : "[ ] focus", fg: currentView === 4 ? "#f7768e" : "#414868" }),
        ),
        
        Box({ 
          flexGrow: 1, 
          backgroundColor: "#1e1e2e", 
          padding: 1,
          flexDirection: "column" 
        },
          currentView === 0 ? renderDashboard() :
          currentView === 1 ? renderGoals() :
          currentView === 2 ? renderNotes() :
          currentView === 3 ? renderStats() :
          renderFocus()
        )
      ),
      
      Box({ 
        width: "100%", 
        backgroundColor: "#1a1b26", 
        flexDirection: "row",
        paddingX: 1 
      },
        Text({ content: "main", fg: "#565f89" }),
        Box({ flexGrow: 1 }),
        Text({ content: "TAB switch view ARROWS up/down Q quit", fg: "#565f89" })
      )
    )
  );
  
  renderer.requestRender();
}

async function main() {
  renderer = await createCliRenderer();
  
  console.log("Resync OpenTUI - TAB to switch views, Q to quit");
  console.log("Arrow keys to navigate sidebar");
  
  renderer.keyInput.on("keypress", (key) => {
    const name = key.name?.toLowerCase();
    
    if (name === "q") {
      console.log("\nGoodbye!");
      renderer.destroy();
      process.exit(0);
    }
    
    if (name === "tab") {
      currentView = (currentView + 1) % views.length;
      renderApp();
    }
    
    if (name === "up" || name === "k") {
      currentView = Math.max(0, currentView - 1);
      renderApp();
    }
    
    if (name === "down" || name === "j") {
      currentView = Math.min(views.length - 1, currentView + 1);
      renderApp();
    }
  });
  
  await renderApp();
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});