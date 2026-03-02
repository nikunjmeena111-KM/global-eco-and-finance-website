import cron from "node-cron";
import { generateStaticSnapshot } from "../dashboard/dashboard.service.js";
import {DashboardSnapshot} from "../models/dashboardSnapshot.model.js";
import {Country} from "../models/country.model.js";
import { redisClient } from "../db/redisClient.js";

const SNAPSHOT_TTL_MINUTES = 5;

const startSnapshotRefreshJob = () => {
  cron.schedule("*/4 * * * *", async () => {
    console.log(" Cron: Snapshot refresh started");

    try {
      //  Get all supported countries
      const countries = await Country.find({}, { code: 1 });

      const BATCH_SIZE = 5;

for (let i = 0; i < countries.length; i += BATCH_SIZE) {
  const batch = countries.slice(i, i + BATCH_SIZE);

  console.log(
    `🚀 Processing batch ${i / BATCH_SIZE + 1} (size: ${batch.length})`
  );

  await Promise.all(
    batch.map(async (country) => {
      const upperCode = country.code.toUpperCase();

      try {
        console.log(`⏳ Refreshing snapshot for ${upperCode}`);

        const staticData = await generateStaticSnapshot(upperCode);

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

        console.log(` Refreshed & cache cleared for ${upperCode}`);
      } catch (error) {
        console.error(` Failed for ${upperCode}:`, error.message);
      }
    })
  );
}

      console.log(" Cron: Snapshot refresh completed");
    } catch (error) {
      console.error("Cron job error:", error.message);
    }
  });
};

export {startSnapshotRefreshJob};