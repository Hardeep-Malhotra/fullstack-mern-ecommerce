
import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/userModel.js";
import { isTokenBlacklisted } from "../utils/redisCache.js";
// 1. Authenticate Logged In User
export const isAuthenticatedUser = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;

  // =====================================================
  // 1. TOKEN CHECK
  // =====================================================

  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource", 401));
  }

 try {

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);



  const blacklisted = await isTokenBlacklisted(token);

 

  if (blacklisted) {
    return next(
      new ErrorHandler("Session expired. Please login again.", 401)
    );
  }

  req.user = await User.findById(decodedData.id);

  if (!req.user) {
    return next(
      new ErrorHandler("User not found with this token", 401)
    );
  }

  next();

} catch (error) {

 
  return next(
    new ErrorHandler(
      "Invalid or Expired Token. Please Login again.",
      401
    )
  );
}
});

// 2. Authorize Roles (e.g., authorizeRoles("admin", "seller"))
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user?.role || "Guest"}) is not allowed to access this resource`,
          403,
        ),
      );
    }
    next();
  };
};

// 3. Verify Seller Approval Status
export const isApprovedSeller = (req, res, next) => {
  if (req.user && req.user.role === "seller" && !req.user.isApproved) {
    return next(
      new ErrorHandler(
        "Your seller account has not been approved by admin yet",
        403,
      ),
    );
  }
  next();
};
