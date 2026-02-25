import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    url: { type: String, required: true },
    imageUrl: String,
    source: String,
    publishedAt: Date,
    category: {
      type: String,
      default: "global",
    },
  },
  { timestamps: true }
);

// Faster sorting
newsSchema.index({ publishedAt: -1 });

export default mongoose.model("News", newsSchema);