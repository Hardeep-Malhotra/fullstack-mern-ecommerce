import User from "../../models/userModel.js";
import { sendToken } from "../../utils/sendToken.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js"; // 1. Import your ErrorHandler

// ================

// ================= USER Sign With Google CONTROLLER =================
// @desc    Google OAuth Callback
// @route   GET /api/v1/auth/google/callback
// controllers/authController.js
export const googleAuthCallback = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("Google Authentication Failed", 400));
  }

  // Frontend URL par redirect karein (e.g., http://localhost:5173)
  const redirectUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  sendToken(req.user, 200, res, redirectUrl);
});
