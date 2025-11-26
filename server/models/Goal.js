import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    frequency: {
      type: String,
      required: true,
      enum: ["daily", "weekly", "monthly"],
      default: "daily",
    },
    targetCount: {
      type: Number,
      required: true,
      default: 1,
    },
    endDate: {
      type: Date,
      default: null,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      default: "General",
    },
    progress: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        completed: {
          type: Number,
          default: 0,
        },
      },
    ],
    startDate: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Method to get current period progress
goalSchema.methods.getCurrentPeriodProgress = function () {
  const now = new Date();
  let periodStart;

  switch (this.frequency) {
    case "daily":
      periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "weekly":
      const dayOfWeek = now.getDay();
      periodStart = new Date(now);
      periodStart.setDate(now.getDate() - dayOfWeek);
      periodStart.setHours(0, 0, 0, 0);
      break;
    case "monthly":
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
  }

  const currentProgress = this.progress.filter(
    (p) => new Date(p.date) >= periodStart
  );

  const totalCompleted = currentProgress.reduce(
    (sum, p) => sum + p.completed,
    0
  );

  return {
    completed: totalCompleted,
    target: this.targetCount,
    percentage: Math.min((totalCompleted / this.targetCount) * 100, 100),
  };
};

export default mongoose.model("Goal", goalSchema);
