import User from "../../models/userModel.js";
import { sendToken } from "../../utils/sendToken.js";
import { sendEmail } from "../../utils/sendEmail.js";

import {
  welcomeEmailTemplate,
  sellerPendingEmailTemplate,
} from "../../utils/emailTemplates.js";

import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";

export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, avatar, role } = req.body;

  // ============================================
  // CHECK EXISTING USER
  // ============================================

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new ErrorHandler("User with this email already exists", 400));
  }

  // ============================================
  // SECURITY:
  // USER PUBLIC REGISTER SE ADMIN NA BANE
  // ============================================

  const userRole = role === "seller" ? "seller" : "user";

  // ============================================
  // CREATE USER
  // ============================================

  const user = await User.create({
    name,
    email,
    password,
    avatar,

    provider: "local",

    role: userRole,
  });

  // ============================================
  // SELLER REGISTRATION
  // ============================================

  if (user.role === "seller") {
    try {
      await sendEmail({
        email: user.email,

        subject: "Your NexusCart AI Seller Registration is Pending ⏳",

        html: sellerPendingEmailTemplate(user.name, user.email),

        message: `
Hello ${user.name},

Your seller registration request has been submitted successfully.

Your account is currently pending admin approval.

You will receive another email once your seller account is approved.

Thanks,
NexusCart AI Team
        `,
      });
    } catch (emailError) {
      console.error("Seller Registration Email Failed:", emailError.message);
    }

    // ============================================
    // SELLER KO TOKEN NAHI DENA
    // ============================================

    return res.status(201).json({
      success: true,

      message:
        "Seller registration submitted successfully! Please wait for admin approval.",
    });
  }

  // ============================================
  // NORMAL USER WELCOME EMAIL
  // ============================================

  try {
    await sendEmail({
      email: user.email,

      subject: "Welcome to NexusCart AI! 🚀",

      html: welcomeEmailTemplate(user.name, user.email),

      message: `Welcome to NexusCart AI, ${user.name}! Your account has been created successfully.`,
    });
  } catch (emailError) {
    console.error("Welcome Email Sending Failed:", emailError.message);
  }

  // ============================================
  // SEND TOKEN TO NORMAL USER
  // ============================================

  sendToken(user, 201, res);
});
