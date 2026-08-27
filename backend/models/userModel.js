// import mongoose from "mongoose";
// import validator from "validator";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";
// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Please enter your name"],
//       maxLength: [25, "Name cannot exceed 25 characters"],
//       minLength: [3, "Name must be at least 3 characters"],
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: [true, "Please enter your email"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       validate: [validator.isEmail, "Please enter a valid email"],
//     },
//     password: {
//       type: String,
//       required: [
//         function () {
//           // Password tabhi required hai jab user Google OAuth se login nahi kar raha
//           return !this.googleId;
//         },
//         "Please enter your password",
//       ],
//       minLength: [8, "Password must be at least 8 characters"],
//       select: false,
//     },
//     avatar: {
//       public_id: {
//         type: String,
//         default: "",
//       },
//       url: {
//         type: String,
//         default: "",
//       },
//     },
//     role: {
//       type: String,
//       enum: ["user", "seller", "admin"],
//       default: "user",
//     },
//     provider: {
//       type: String,
//       enum: ["local", "google"],
//       default: "local",
//     },
//     googleId: {
//       type: String,
//       default: null,
//     },
//     isEmailVerified: {
//       type: Boolean,
//       default: false,
//     },
//     resetPasswordToken: String,
//     resetPasswordExpire: Date,
//   },
//   {
//     timestamps: true,
//   },
// );

// // 1. Password Hashing (Pre-save Hook)
// userSchema.pre("save", async function () {
//   // 1. Agar password modify nahi hua ya missing hai, skip hashing
//   if (!this.isModified("password") || !this.password) {
//     return; // Direct return karein, next() ki zarurat nahi hai
//   }

//   // 2. Password Hash karein
//   this.password = await bcrypt.hash(this.password, 10);
// });
// // 2. JWT Token Generation Method
// userSchema.methods.getJWTToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE || "7d",
//   });
// };

// // 3. Compare Password Method (Login ke liye)
// userSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// // 4. Generate Password Reset Token
// userSchema.methods.getResetPasswordToken = function () {
//   // 1. Unhashed random token generate karein
//   const resetToken = crypto.randomBytes(20).toString("hex");

//   // 2. Hash karke resetPasswordToken field me set karein
//   this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   // 3. Token ki expiry 15 minutes set karein
//   this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

//   // Unhashed token return karein jo user ko email me bheja jayega
//   return resetToken;
// };

// export default mongoose.model("User", userSchema);

import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      maxLength: [25, "Name cannot exceed 25 characters"],
      minLength: [3, "Name must be at least 3 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [
        function () {
          // Password tabhi required hai jab user Google OAuth se login nahi kar raha
          return !this.googleId;
        },
        "Please enter your password",
      ],
      minLength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },
    isApproved: {
      type: Boolean,
      default: true, // Default true rahega, hook automatically handle karega
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  },
);

// ==========================================
// 1. PRE-SAVE HOOK (Password Hash + Auto Seller Approval Logic)
// ==========================================
userSchema.pre("save", async function () {
  // A. Naya User Create Hote Time Seller Approval Check
  if (this.isNew && this.role === "seller") {
    this.isApproved = false; // Seller ke liye HAMESHA admin approval zaruri hai
  }

  // B. Password Hashing Logic
  if (!this.isModified("password") || !this.password) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// ==========================================
// 2. JWT TOKEN GENERATION METHOD
// ==========================================
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// ==========================================
// 3. COMPARE PASSWORD METHOD
// ==========================================
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ==========================================
// 4. GENERATE RESET PASSWORD TOKEN
// ==========================================
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export default mongoose.model("User", userSchema);
