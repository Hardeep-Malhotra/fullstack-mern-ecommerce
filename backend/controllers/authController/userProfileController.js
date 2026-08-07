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

// @desc    Get all users for Admin Panel
// @route   GET /api/v1/admin/users
// @access  Private (Admin Only)
export const getAllUsers = asyncHandler(async (req, res, next) => {
  // Passwords exclude karein aur performance ke liye .lean() use karein
  const users = await User.find().select("-password").lean();

  res.status(200).json({
    success: true,
    totalUsers: users.length,
    users,
  });
});

// @desc    Get single user details for Admin
// @route   GET /api/v1/admin/user/:id
// @access  Private (Admin Only)
export const getSingleUser = asyncHandler(async (req, res, next) => {
  // URL params se ID nikaal kar find karein aur password exclude karein
  const user = await User.findById(req.params.id).select("-password").lean();

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User not found with ID: ${req.params.id}`,
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
});
