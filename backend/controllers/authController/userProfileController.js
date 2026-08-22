import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
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

// @desc    Update User Role (Admin Only)
// @route   PUT /api/v1/auth/admin/user/:id
// @access  Private (Admin Only)
export const updateUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;

  // 1. Lockout Guard: Self-Demotion check
  if (req.user.id === req.params.id && role !== "admin") {
    return res.status(400).json({
      success: false,
      message: "You cannot demote your own admin account.",
    });
  }

  // 2. User existence check
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User not found with ID: ${req.params.id}`,
    });
  }

  // 3. Update role & save
  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: "User role updated successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// @desc    Delete User (Admin Only)
// @route   DELETE /api/v1/auth/admin/user/:id
// @access  Private (Admin Only)
export const deleteUser = asyncHandler(async (req, res, next) => {
  // 1. Lockout Guard: Admin apne hi account ko is route se delete nahi kar sakta
  if (req.user.id === req.params.id) {
    return next(
      new ErrorHandler("You cannot delete your own admin account.", 400),
    );
  }

  // 2. User Existence Check
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with ID: ${req.params.id}`, 404),
    );
  }

  // 3. Delete User Document
  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
