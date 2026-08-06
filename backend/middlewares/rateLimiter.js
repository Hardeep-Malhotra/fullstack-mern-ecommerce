import rateLimit from "express-rate-limit";

// 1. Strict Limiter: Login aur Register ke liye
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 10, // Max 10 attempts
  message: {
    success: false,
    message:
      "Too many login/register attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. Strict Limiter: Forgot Password ke liye (Email spamming rokne ke liye)
export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 5, // Max 5 requests
  message: {
    success: false,
    message:
      "Too many password reset requests. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 3. General Limiter: Baaki saare API endpoints ke liye
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 300, // Max 300 requests
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
