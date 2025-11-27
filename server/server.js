import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import goalRoutes from "./routes/goalRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/notes", noteRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });
