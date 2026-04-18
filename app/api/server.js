import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import goalRoutes from "./routes/goalRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import db, { init } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const clientPath = join(__dirname, "../web/dist");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowed = (process.env.CORS_ORIGIN || "http://localhost:3000").split(",");
      if (allowed.includes(origin.trim())) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/notes", noteRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Resync is running", db: "SQLite" });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientPath));
  app.get("*", (req, res) => {
    res.sendFile(join(clientPath, "index.html"));
  });
}

init();

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║         🚀 Resync is running            ║
║   Local:  http://localhost:${PORT}         ║
║   DB:     SQLite (embedded)             ║
╚════════════════════════════════════════╝
  `);
});