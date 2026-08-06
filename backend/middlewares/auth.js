import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/userModel.js";

// Check if user is authenticated
export const isAuthenticatedUser = asyncHandler(async (req, res, next) => {
  // Cookie se token lein ya Authorization Header se
  const token =
    req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  // Token decode karke ID verify karein
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  // Database se user nikal kar req.user me attach karein
  req.user = await User.findById(decodedData.id);

  if (!req.user) {
    return next(new ErrorHandler("User not found with this token", 404));
  }

  next();
});
