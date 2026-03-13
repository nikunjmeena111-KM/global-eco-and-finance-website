import dotenv from "dotenv";
import connectDb from "./db/index.js";
import { app } from "./app.js";
//import { connectRedis } from "./db/redisClient.js";
import { startSnapshotRefreshJob } from "./backgroundJobs/snapshotRefresh.job.js";

dotenv.config({
  path: "./env",
});

const startServer = async () => {
  try {

    // Connect MongoDB
    await connectDb();
    console.log("MongoDB Connected");

    // Connect Redis
    //await connectRedis();
    //console.log("Redis Connected");

    // Start server
    const PORT = process.env.PORT || 7000;

    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });

    // Start cron jobs
    startSnapshotRefreshJob();

  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();