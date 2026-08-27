// import jwt from "jsonwebtoken";
// import asyncHandler from "./asyncHandler.js";
// import ErrorHandler from "../utils/errorHandler.js";
// import User from "../models/userModel.js";

// // 1. Authenticate User (Token Check)
// export const isAuthenticatedUser = asyncHandler(async (req, res, next) => {
//   const token =
//     req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");

//   if (!token) {
//     return next(new ErrorHandler("Please login to access this resource", 401));
//   }

//   const decodedData = jwt.verify(token, process.env.JWT_SECRET);
//   req.user = await User.findById(decodedData.id);

//   if (!req.user) {
//     return next(new ErrorHandler("User not found with this token", 404));
//   }

//   next();
// });

// // 2. Authorize Admin Role (Role Check)
// export const authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new ErrorHandler(
//           `Role (${req.user.role}) is not allowed to access this resource`,
//           403
//         )
//       );
//     }
//     next();
//   };
// };

import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/userModel.js";

// ==========================================
// 1. AUTHENTICATE USER (TOKEN CHECK)
// ==========================================
export const isAuthenticatedUser = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id);

  if (!req.user) {
    return next(new ErrorHandler("User not found with this token", 404));
  }

  next();
});

// ==========================================
// 2. AUTHORIZE ROLES & SELLER APPROVAL CHECK
// ==========================================
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check 1: Role matching (e.g., 'seller' or 'admin')
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403,
        ),
      );
    }

    // Check 2: Seller Approval Check (Admin bypassed automatically)
    if (req.user.role === "seller" && !req.user.isApproved) {
      return next(
        new ErrorHandler(
          "Access denied: Your seller account is pending Super Admin approval.",
          403,
        ),
      );
    }

    next();
  };
};
