// import crypto from "crypto";
// import asyncHandler from "../../middlewares/asyncHandler.js";
// import ErrorHandler from "../../utils/errorHandler.js";
// import User from "../../models/userModel.js";
// import { sendEmail } from "../../utils/sendEmail.js";
// import { sendToken } from "../../utils/sendToken.js";

// // @desc    Forgot Password - Send Reset Email
// // @route   POST /api/v1/auth/password/forgot
// // @access  Public
// export const forgotPassword = asyncHandler(async (req, res, next) => {
//   const { email } = req.body;

//   const user = await User.findOne({ email });

//   if (!user) {
//     return next(new ErrorHandler("User not found with this email", 404));
//   }

//   // Check if Google-only user
//   if (user.provider === "google" && !user.password) {
//     return next(
//       new ErrorHandler(
//         "Google authenticated users cannot reset password. Please login via Google.",
//         400,
//       ),
//     );
//   }

//   // Get Reset Token from Model Method
//   const resetToken = user.getResetPasswordToken();

//   await user.save({ validateBeforeSave: false });

//   // Reset URL construct karein
//   const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/password/reset/${resetToken}`;

//   const message = `Your password reset token is as follows:\n\n${resetPasswordUrl}\n\nIf you have not requested this email, then please ignore it. Token is valid for 15 minutes.`;

//   console.log("Original Token:", resetToken);
// console.log("DB Token:", user.resetPasswordToken);
// console.log("Expiry:", user.resetPasswordExpire);

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: "NexusCart Password Recovery",
//       message,
//     });

//     res.status(200).json({
//       success: true,
//       message: `Email sent successfully to ${user.email}`,
//     });
//   } catch (error) {
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save({ validateBeforeSave: false });

//     return next(
//       new ErrorHandler("Email could not be sent. Please try again later.", 500),
//     );
//   }
// });

// // @desc    Reset Password using Token
// // @route   PUT /api/v1/auth/password/reset/:token
// // @access  Public
// export const resetPassword = asyncHandler(async (req, res, next) => {
//   // Encrypt incoming token to match hashed token stored in DB
//   console.log("Token from URL:", req.params.token);

//   const resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");

//   console.log("Hashed Token:", resetPasswordToken);

//   const user = await User.findOne({
//     resetPasswordToken,
//     resetPasswordExpire: { $gt: Date.now() },
//   });

//   console.log("User Found:", user);
//   if (!user) {
//     return next(
//       new ErrorHandler("Password reset token is invalid or has expired", 400),
//     );
//   }

//   // Set new password
//   user.password = req.body.password;
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpire = undefined;

//   await user.save();

//   // Reset hone ke baad automatic login karwa ke token return kar do
//   sendToken(user, 200, res);
// });

import crypto from "crypto";
import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import User from "../../models/userModel.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { sendToken } from "../../utils/sendToken.js";
import {
  forgotPasswordTemplate,
  passwordChangedTemplate,
} from "../../utils/emailTemplates.js";

// @desc    Forgot Password - Send Reset Email
// @route   POST /api/v1/auth/password/forgot
// @access  Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  // Check if Google-only user
  if (user.provider === "google" && !user.password) {
    return next(
      new ErrorHandler(
        "Google authenticated users cannot reset password. Please login via Google.",
        400,
      ),
    );
  }

  // Get Reset Token from Model Method
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Frontend Reset Link Construct
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetPasswordUrl = `${frontendUrl}/password/reset/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "NexusCart AI - Password Recovery 🔐",
      html: forgotPasswordTemplate(resetPasswordUrl, user.name),
      message: `Your password reset URL is: ${resetPasswordUrl}. Valid for 15 minutes.`,
    });

    res.status(200).json({
      success: true,
      message: `Password reset link sent successfully to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new ErrorHandler("Email could not be sent. Please try again later.", 500),
    );
  }
});

// @desc    Reset Password using Token
// @route   PUT /api/v1/auth/password/reset/:token
// @access  Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Password reset token is invalid or has expired", 400),
    );
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  // 📧 Send Security Alert Email using template
  try {
    await sendEmail({
      email: user.email,
      subject: "NexusCart AI - Security Alert: Password Updated 🔒",
      html: passwordChangedTemplate(user.name),
      message:
        "Your NexusCart AI account password has been updated successfully.",
    });
  } catch (emailError) {
    console.error(
      "Password change notification email failed:",
      emailError.message,
    );
  }

  sendToken(user, 200, res);
});
