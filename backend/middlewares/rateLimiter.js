import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redisClient from "../config/redis.js";

// =====================================================
// REDIS COMMAND HELPER
// =====================================================

const sendCommand = (...args) => {
  return redisClient.sendCommand(args);
};

// =====================================================
// 1. AUTH LIMITER
// Login + Register
// 10 requests / 15 minutes
// =====================================================

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,

  store: new RedisStore({
    sendCommand,
    prefix: "rate-limit:auth:",
  }),

  message: {
    success: false,
    message:
      "Too many login/register attempts. Please try again after 15 minutes.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

// =====================================================
// 2. PASSWORD RESET LIMITER
// Forgot Password
// 5 requests / 15 minutes
// =====================================================

export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,

  store: new RedisStore({
    sendCommand,
    prefix: "rate-limit:password-reset:",
  }),

  message: {
    success: false,
    message:
      "Too many password reset requests. Please try again after 15 minutes.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

// =====================================================
// 3. GENERAL API LIMITER
// 300 requests / 15 minutes
// =====================================================

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,

  store: new RedisStore({
    sendCommand,
    prefix: "rate-limit:api:",
  }),

  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});