import cron from "node-cron";
import { generateStaticSnapshot } from "../dashboard/dashboard.service.js";
import {DashboardSnapshot} from "../models/dashboardSnapshot.model.js";
import {Country} from "../models/country.model.js";
import { redisClient } from "../db/redisClient.js";
import logger from "../utils/logger.js";

const SNAPSHOT_TTL_MINUTES = 5;

const startSnapshotRefreshJob = () => {
  cron.schedule("*/4 * * * *", async () => {
    logger.info({ layer: "cron", job: "snapshotRefresh", message: "Started" });

    try {
      //  Get all supported countries
      const countries = await Country.find({}, { code: 1 });

      const BATCH_SIZE = 5;

      let successCount = 0;
      let failureCount = 0;

for (let i = 0; i < countries.length; i += BATCH_SIZE) {
  const batch = countries.slice(i, i + BATCH_SIZE);

  await Promise.all(
    batch.map(async (country) => {
      const upperCode = country.code.toUpperCase();

      try {

        const staticData = await generateStaticSnapshot(upperCode,{source:"cron"});

        const expiresAt = new Date(
          Date.now() + SNAPSHOT_TTL_MINUTES * 60 * 1000
        );

        await DashboardSnapshot.findOneAndUpdate(
          { countryCode: upperCode, version: "v1" },
          {
            data: staticData,
            expiresAt,
          },
          {
            upsert: true,
            returnDocument: "after",
            setDefaultsOnInsert: true,
          }
        );

        const redisKey = `dashboard:v1:${upperCode}`;
        await redisClient.del(redisKey);

        successCount++;

      } catch (error) {
        failureCount++;
      }
    })
  );
}

      logger.info({
        layer: "cron",
        job: "snapshotRefresh",
        message: "Completed",
        totalCountries: countries.length,
        success: successCount,
        failed: failureCount
      });

    } catch (error) {
      logger.error({ layer: "cron", job: "snapshotRefresh", error: error.message });
    }
  });
};

export {startSnapshotRefreshJob};