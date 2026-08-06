import asyncHandler from "../../middlewares/asyncHandler.js";
import User from "../../models/userModel.js";

// @desc    Get Currently Logged-in User Profile
// @route   GET /api/v1/auth/me
// @access  Private (Requires isAuthenticatedUser)
export const getUserProfile = asyncHandler(async (req, res, next) => {
  // req.user already isAuthenticatedUser middleware se aayega
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc    Logout User & Clear Cookie
// @route   GET /api/v1/auth/logout
// @access  Public
export const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
});
