import Joi from "joi";
// Register Schema
export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(25).trim().required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name cannot exceed 25 characters",
  }),

  email: Joi.string().email().trim().lowercase().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
  }),

  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"))
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base":
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number",
    }),

  avatar: Joi.object({
    public_id: Joi.string().allow(""),
    url: Joi.string().allow(""),
  }).optional(),
});

// Forgot Password Schema
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

// Forgot Password Schema
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  }),
});

// Reset Password Schema
export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.empty": "Password is required",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "string.empty": "Confirm Password is required",
  }),
});
