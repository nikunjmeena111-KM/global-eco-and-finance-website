import { redisClient } from "../db/redisClient.js";

const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Redis GET error:", error.message);
    return null; // fallback safety
  }
};

const setCache = async (key, value, ttl = 60) => {
  try {
    console.log(" Setting Redis Key:", key);

    await redisClient.set(
      key,
      JSON.stringify(value),
      { EX: ttl } 
    );

    console.log(" Redis Key Stored Successfully");

  } catch (error) {
    console.error("Redis SET error:", error.message);
  }
};

export {getCache ,setCache}