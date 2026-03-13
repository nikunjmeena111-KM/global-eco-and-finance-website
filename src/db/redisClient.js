import { createClient } from "redis";

 const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

(async () => {
  await redisClient.connect();
})();
export { redisClient };