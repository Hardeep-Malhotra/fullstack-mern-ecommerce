import User from "../../models/userModel.js";
import { sendToken } from "../../utils/sendToken.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { welcomeEmailTemplate } from "../../utils/emailTemplates.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js"; 

// ================= USER REGISTER CONTROLLER =================
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, avatar, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new ErrorHandler("User with this email already exists", 400));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    avatar,
    role,
    provider: "local",
  });

  // 📧 Send Welcome Email via Resend
  try {
    await sendEmail({
      email: user.email,
      subject: "Welcome to NexusCart AI! 🚀",
      html: welcomeEmailTemplate(user.name, user.email),
      message: `Welcome to NexusCart AI, ${user.name}! Your account has been created successfully.`,
    });
  } catch (emailError) {
    // Log email error without blocking user signup response
    console.error("Welcome Email Sending Failed:", emailError.message);
  }

  // Send Token & Response
  sendToken(user, 201, res);
});