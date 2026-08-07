import express from "express";
import passport from "passport";

// Controllers
import { registerUser } from "../controllers/authController/userRegisterController.js";
import { loginUser } from "../controllers/authController/userLoginController.js";
import { googleAuthCallback } from "../controllers/authController/googleAuthController.js";
import {
  getUserProfile,
  updateUserProfile,
  logoutUser,
} from "../controllers/authController/userProfileController.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/authController/passwordController.js";

// Middlewares & Validation
import { validateBody } from "../middlewares/validate.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";
import { registerSchema, loginSchema } from "../validators/userValidation.js";
import { updateProfileSchema } from "../validators/userValidation.js";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/userValidation.js";
const router = express.Router();

// Rate Limiters Import
import {
  authLimiter,
  passwordResetLimiter,
} from "../middlewares/rateLimiter.js";

// Public Routes
router.post(
  "/register",
  authLimiter,
  validateBody(registerSchema),
  registerUser,
);
router.post("/login", authLimiter, validateBody(loginSchema), loginUser);
router.get("/logout", logoutUser);
router.post(
  "/password/forgot",
  passwordResetLimiter,
  validateBody(forgotPasswordSchema),
  forgotPassword,
);
router.put(
  "/password/reset/:token",
  validateBody(resetPasswordSchema),
  resetPassword,
);
// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleAuthCallback,
);

// Protected Routes
router.get("/me", isAuthenticatedUser, getUserProfile);
router.put(
  "/me/update",
  isAuthenticatedUser,
  validateBody(updateProfileSchema),
  updateUserProfile,
);
export default router;
