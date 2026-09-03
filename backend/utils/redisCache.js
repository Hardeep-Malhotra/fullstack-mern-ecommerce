import redisClient from "../config/redis.js";

// =====================================================
// CACHE
// =====================================================

// Get cache
export const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);

    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Redis GET error:", error.message);
    return null;
  }
};

// Set cache
export const setCache = async (key, data, ttlSeconds = 300) => {
  try {
    await redisClient.setEx(
      key,
      ttlSeconds,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error("Redis SET error:", error.message);
  }
};

// Delete single cache
export const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error(
      `❌ Redis Delete Error (${key}):`,
      error.message
    );
  }
};

// Delete cache by pattern
export const deleteCacheByPattern = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern);

    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error(
      `❌ Redis Pattern Delete Error (${pattern}):`,
      error.message
    );
  }
};

// =====================================================
// JWT BLACKLIST
// =====================================================

// Blacklist JWT
export const blacklistToken = async (token, ttlSeconds) => {
  try {
    await redisClient.setEx(
      `blacklist:${token}`,
      ttlSeconds,
      "blacklisted"
    );
  } catch (error) {
    console.error(
      "❌ Redis Blacklist Error:",
      error.message
    );
  }
};

// Check JWT blacklist
export const isTokenBlacklisted = async (token) => {
  try {
    const result = await redisClient.get(
      `blacklist:${token}`
    );

    return result !== null;
  } catch (error) {
    console.error(
      "❌ Redis Blacklist Check Error:",
      error.message
    );

    return false;
  }
};