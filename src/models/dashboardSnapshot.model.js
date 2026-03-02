import mongoose from "mongoose";

const dashboardSnapshotSchema = new mongoose.Schema(
  {
    countryCode: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
    },

    version: {
      type: String,
      required: true,
      default: "v1",
    },

    data: { 
      type: Object,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Only one snapshot per country per version
dashboardSnapshotSchema.index(
  { countryCode: 1, version: 1 },
  { unique: true }
);

export const DashboardSnapshot = mongoose.model("DashboardSnapshot",dashboardSnapshotSchema );

