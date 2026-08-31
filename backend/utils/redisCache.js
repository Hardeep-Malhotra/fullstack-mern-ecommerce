import redisClient from "../config/redis.js";

// 1. Redis se Cache Read Karne ke liye
export const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Redis GET error:", error.message);
    return null;
  }
};

// 2. Redis me Cache Save Karne ke liye (Default TTL: 300 Seconds = 5 Min)
export const setCache = async (key, data, ttlSeconds = 300) => {
  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(data));
  } catch (error) {
    console.error("Redis SET error:", error.message);
  }
};

// 3. Redis se Cache Delete Karne ke liye (Cache Invalidation)
export const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("Redis DELETE error:", error.message);
  }
};
