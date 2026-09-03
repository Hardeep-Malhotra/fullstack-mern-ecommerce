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

export const deleteCache = async (key) => {
  try {
    const result = await redisClient.del(key);
    if (result > 0) {
      console.log(`🗑️ REDIS CACHE CLEARED: ${key}`);
    } else {
      console.log(`ℹ️ NO CACHE TO CLEAR FOR KEY: ${key}`);
    }
  } catch (error) {
    console.error(`❌ Redis Delete Error (${key}):`, error);
  }
};

export const deleteCacheByPattern = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern);

    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`🗑️ REDIS CACHE CLEARED: ${pattern}`);
    } else {
      console.log(`ℹ️ NO CACHE FOUND FOR: ${pattern}`);
    }

  } catch (error) {
    console.error(
      `❌ Redis Pattern Delete Error (${pattern}):`,
      error.message
    );
  }
};