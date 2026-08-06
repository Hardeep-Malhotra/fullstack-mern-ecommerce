import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import User from "../../models/userModel.js";
import { sendToken } from "../../utils/sendToken.js";

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. User find karein aur password field explicit select karein (kyunki model me select: false hota hai)
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  // 2. Local provider check (Agar user Google OAuth se registered hai aur password set nahi hai)
  if (user.provider === "google" && !user.password) {
    return next(
      new ErrorHandler(
        "This account was created using Google Sign-In. Please login with Google.",
        400
      )
    );
  }

  // 3. Password verify karein
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  // 4. Token generate karke httpOnly cookie aur response bhejein
  sendToken(user, 200, res);
});