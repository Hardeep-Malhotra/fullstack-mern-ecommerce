import express from "express";
import passport from "passport";

// Controllers
import { registerUser } from "../controllers/authController/userRegisterController.js";
import { googleAuthCallback } from "../controllers/authController/googleAuthController.js";
import { loginUser } from "../controllers/authController/userLoginController.js";

// Middlewares & Validators
import { validateBody } from "../middlewares/validate.js";
import { registerSchema } from "../validators/userValidation.js";
import { loginSchema } from "../validators/userValidation.js";

const router = express.Router();

// 1. Local Register Route
router.post("/register", validateBody(registerSchema), registerUser);

// 2. Google Auth Trigger (Redirects to Google)
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);
// Login Route
router.post("/login", validateBody(loginSchema), loginUser);

// 3. Google Auth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  googleAuthCallback
);

export default router;