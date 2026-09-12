import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import User from "../../models/userModel.js";
import { sendToken } from "../../utils/sendToken.js";



export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  if (user.provider === "google" && !user.password) {
    return next(
      new ErrorHandler(
        "This account was created using Google Sign-In. Please login with Google.",
        400
      )
    );
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  // Approval Check for Sellers
  if (user.role === "seller" && !user.isApproved) {
    return next(
      new ErrorHandler(
        "Your seller account is pending approval from Admin.",
        403
      )
    );
  }

  sendToken(user, 200, res);
});


