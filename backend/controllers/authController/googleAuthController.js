import User from "../../models/userModel.js";
import { sendToken } from "../../utils/sendToken.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js"; // 1. Import your ErrorHandler

// ================


// ================= USER Sign With Google CONTROLLER =================
// @desc    Google OAuth Callback
// @route   GET /api/v1/auth/google/callback
export const googleAuthCallback = asyncHandler(async (req, res, next) => {
  // Passport Strategy req.user me google user return kar deti hai
  if (!req.user) {
    return next(new ErrorHandler("Google Authentication Failed", 400));
  }

  // Generate JWT & send httpOnly cookie
  sendToken(req.user, 200, res);
});