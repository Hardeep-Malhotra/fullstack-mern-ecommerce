import User from "../../models/userModel.js";
import { sendToken } from "../../utils/sendToken.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js"; // 1. Import your ErrorHandler

// ================= USER REGISTER CONTROLLER =================
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, avatar } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    // 2. Pass ErrorHandler to next()
    return next(new ErrorHandler("User with this email already exists", 400));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    avatar,
    provider: "local",
  });

  sendToken(user, 201, res);
});
