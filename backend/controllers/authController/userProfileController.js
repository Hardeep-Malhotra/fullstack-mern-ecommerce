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


// @desc    Update User Profile
// @route   PUT /api/v1/auth/me/update
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // Google authenticated users ke email update par restrictions (Optional)
  if (req.user.provider === "google" && req.body.email) {
    delete newUserData.email; // Google accounts ka email directly change na karne dene ke liye
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});
