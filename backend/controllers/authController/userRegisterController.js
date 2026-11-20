
import User from "../../models/userModel.js";
import { sendToken } from "../../utils/sendToken.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { addEmailJob } from "../../jobs/emailQueue.js";

import {
  welcomeEmailTemplate,
  sellerPendingEmailTemplate,
} from "../../utils/emailTemplates.js";

import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/ErrorHandlers.js";

export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, avatar, role } = req.body;

  // ============================================
  // CHECK EXISTING USER
  // ============================================

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(
      new ErrorHandler("User with this email already exists", 400)
    );
  }

  // ============================================
  // SECURITY: PUBLIC REGISTER SE ADMIN NA BANE
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
  // SELLER REGISTRATION EMAIL
  // ============================================

  if (user.role === "seller") {
    const emailData = {
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
    };

    try {
      const job = await addEmailJob(emailData, {
        jobId: `seller-registration-${user._id}`,
      });

      console.log("📬 Seller registration email queued:", job.id);
    } catch (queueError) {
      console.error(
        "⚠️ Seller email queue unavailable. Trying direct email:",
        queueError.message
      );

      try {
        await sendEmail(emailData);
        console.log("📧 Seller registration fallback email sent");
      } catch (emailError) {
        console.error(
          "❌ Seller registration email failed:",
          emailError.message
        );
      }
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

  const emailData = {
    email: user.email,
    subject: "Welcome to NexusCart AI! 🚀",
    html: welcomeEmailTemplate(user.name, user.email),
    message: `Welcome to NexusCart AI, ${user.name}! Your account has been created successfully.`,
  };

  try {
    const job = await addEmailJob(emailData, {
      jobId: `welcome-${user._id}`,
    });

    console.log("📬 Welcome email queued:", job.id);
  } catch (queueError) {
    console.error(
      "⚠️ Welcome email queue unavailable. Trying direct email:",
      queueError.message
    );

    try {
      await sendEmail(emailData);
      console.log("📧 Welcome fallback email sent");
    } catch (emailError) {
      console.error(
        "❌ Welcome email failed:",
        emailError.message
      );
    }
  }

  // ============================================
  // SEND TOKEN TO NORMAL USER
  // ============================================

  sendToken(user, 201, res);
});
