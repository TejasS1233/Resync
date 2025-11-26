import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    mood: {
      type: String,
      enum: ["great", "good", "okay", "bad", "terrible"],
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by user and date
noteSchema.index({ userId: 1, date: -1 });

export default mongoose.model("Note", noteSchema);
